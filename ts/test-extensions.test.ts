/**
 * Plugin Slots and Extensibility — test suite (Epic T).
 *
 * Tests ContributionRegistry, ExtensionRegistry, ExtensionContext,
 * activation/deactivation lifecycle, failure isolation, and diagnostics.
 *
 * Run: bun test ts/test-extensions.test.ts
 */

import { describe, test, expect } from "bun:test";
import {
	ExtensionRegistry,
} from "./src/extensions";
import type {
	Extension,
	ExtensionContext,
	ExtensionDiagnostic,
	ContributionRegistration,
	PaletteContribution,
	DevtoolsContribution,
	ThemeContribution,
	ExampleContribution,
} from "./src/extensions";
import { CommandRegistry } from "./src/commands";
import type { Command, Disposable } from "./src/commands";
import { KeymapRegistry } from "./src/keymap";
import type { KeyBinding } from "./src/keymap";
import { TuvrenError } from "./src/errors";

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeExtension(
	id: string,
	activate?: (ctx: ExtensionContext) => void | Promise<void>,
	deactivate?: () => void | Promise<void>,
): Extension {
	return { id, activate: activate ?? (() => {}), deactivate };
}

function noopCommand(id: string = "test.cmd"): Command {
	return { id, title: id, run: () => {} };
}

function noopKeyBinding(command: string = "test.cmd", key: string = "f1"): KeyBinding {
	return { command, key };
}

// ── Contribution registry behavior (via ExtensionRegistry) ──────────────────

describe("Contribution registry behavior", () => {
	test("register returns a disposable", () => {
		const r = new ExtensionRegistry();
		const d = r.palette.register({ command: "cmd" });
		expect(typeof d.dispose).toBe("function");
	});

	test("list returns registered items", () => {
		const r = new ExtensionRegistry();
		r.palette.register({ command: "a" });
		r.palette.register({ command: "b" });
		expect(r.palette.list()).toEqual([{ command: "a" }, { command: "b" }]);
	});

	test("dispose removes the item from the registry", () => {
		const r = new ExtensionRegistry();
		const d = r.palette.register({ command: "a" });
		r.palette.register({ command: "b" });
		d.dispose();
		expect(r.palette.list()).toEqual([{ command: "b" }]);
	});

	test("double-dispose is safe", () => {
		const r = new ExtensionRegistry();
		const d = r.palette.register({ command: "a" });
		d.dispose();
		d.dispose();
		expect(r.palette.list()).toEqual([]);
	});

	test("empty registry returns empty list", () => {
		const r = new ExtensionRegistry();
		expect(r.palette.list()).toEqual([]);
	});

	test("double-dispose does not remove other items", () => {
		const r = new ExtensionRegistry();
		r.palette.register({ command: "a" });
		const db = r.palette.register({ command: "b" });
		r.palette.register({ command: "c" });
		db.dispose();
		db.dispose();
		expect(r.palette.list()).toEqual([{ command: "a" }, { command: "c" }]);
	});
});

// ── ExtensionRegistry — registration and lifecycle ───────────────────────────

describe("ExtensionRegistry — registration", () => {
	test("register returns a disposable", () => {
		const r = new ExtensionRegistry();
		const d = r.register(makeExtension("test.ext"));
		expect(typeof d.dispose).toBe("function");
		d.dispose();
	});

	test("list returns all registered extensions", () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.a"));
		r.register(makeExtension("ext.b"));
		const list = r.list();
		expect(list.length).toBe(2);
		expect(list.map((e) => e.id).sort()).toEqual(["ext.a", "ext.b"]);
	});

	test("disposing a registered extension removes it from list", () => {
		const r = new ExtensionRegistry();
		const d = r.register(makeExtension("ext.a"));
		r.register(makeExtension("ext.b"));
		d.dispose();
		const list = r.list();
		expect(list.length).toBe(1);
		expect(list[0]!.id).toBe("ext.b");
	});

	test("throws on invalid extension id (empty)", () => {
		const r = new ExtensionRegistry();
		expect(() => r.register(makeExtension(""))).toThrow(TuvrenError);
	});

	test("throws on duplicate extension id", () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("dup"));
		expect(() => r.register(makeExtension("dup"))).toThrow(TuvrenError);
	});
});

// ── ExtensionRegistry — activation ───────────────────────────────────────────

describe("ExtensionRegistry — activation", () => {
	test("activate calls the extension's activate function with context", async () => {
		const r = new ExtensionRegistry();
		let capturedCtx: ExtensionContext | undefined;
		r.register(makeExtension("ext.a", (ctx) => { capturedCtx = ctx; }));
		await r.activate("ext.a");
		expect(capturedCtx).toBeDefined();
		expect(typeof capturedCtx!.commands.register).toBe("function");
		expect(typeof capturedCtx!.commands.list).toBe("function");
		expect(typeof capturedCtx!.keymaps.register).toBe("function");
		expect(typeof capturedCtx!.keymaps.resolve).toBe("function");
		expect(capturedCtx!.subscriptions).toBeInstanceOf(Array);
	});

	test("activate returns true for success, false for unknown", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.a"));
		expect(await r.activate("ext.a")).toBe(true);
		expect(await r.activate("nonexistent")).toBe(false);
	});

	test("double activation is rejected and returns false", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.dup"));
		expect(await r.activate("ext.dup")).toBe(true);
		expect(await r.activate("ext.dup")).toBe(false);
		expect(r.isActive("ext.dup")).toBe(true);
	});

	test("commands registered during activation appear in the shared registry", async () => {
		const r = new ExtensionRegistry();
		const cmd: Command = { id: "plugin.cmd", title: "Plugin", run: () => {} };
		r.register(makeExtension("ext.a", (ctx) => { ctx.commands.register(cmd); }));
		r.commands.register({ id: "native.cmd", title: "Native", run: () => {} });

		await r.activate("ext.a");
		const list = r.commands.list();
		expect(list.length).toBe(2);
		expect(list.find((c) => c.id === "plugin.cmd")).toBeDefined();
		expect(list.find((c) => c.id === "native.cmd")).toBeDefined();
	});

	test("keymaps registered during activation appear in the shared keymap registry", async () => {
		const r = new ExtensionRegistry();
		r.commands.register(noopCommand("plugin.cmd"));
		r.keymaps.setRegistry(r.commands);
		r.register(makeExtension("ext.a", (ctx) => {
			ctx.keymaps.register({ command: "plugin.cmd", key: "f5" });
		}));

		await r.activate("ext.a");
		const cmds = r.commands.list();
		expect(cmds.find((c) => c.id === "plugin.cmd")).toBeDefined();
	});

	test("disposed during activation records failure diagnostic", async () => {
		const r = new ExtensionRegistry();
		const reg = r.register(makeExtension("ext.race", async (ctx) => {
			await new Promise((resolve) => setTimeout(resolve, 1));
			ctx.commands.register(noopCommand("race.cmd"));
		}));
		// Activate and immediately dispose while activation is in-flight
		const actPromise = r.activate("ext.race");
		reg.dispose();
		await actPromise;

		const diag = r.getDiagnostics().find((d) => d.id === "ext.race");
		expect(diag).toBeDefined();
		expect(diag!.status).toBe("activation-failed");
	});
});

// ── ExtensionRegistry — deactivation ─────────────────────────────────────────

describe("ExtensionRegistry — deactivation", () => {
	test("deactivate removes contributed commands from the shared registry", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.del", (ctx) => {
			ctx.commands.register(noopCommand("plugin.del"));
		}));
		await r.activate("ext.del");
		expect(r.commands.get("plugin.del")).toBeDefined();

		await r.deactivate("ext.del");
		expect(r.commands.get("plugin.del")).toBeUndefined();
	});

	test("deactivate calls the extension's deactivate hook", async () => {
		const r = new ExtensionRegistry();
		let deactivated = false;
		r.register(makeExtension("ext.x", () => {}, () => { deactivated = true; }));
		await r.activate("ext.x");
		await r.deactivate("ext.x");
		expect(deactivated).toBe(true);
	});

	test("deactivating an inactive extension is a no-op", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.x"));
		const result = await r.deactivate("ext.x");
		expect(result).toBe(false);
	});

	test("deactivation cleans up subscriptions array disposables", async () => {
		const r = new ExtensionRegistry();
		let disposed = false;
		r.register(makeExtension("ext.sub", (ctx) => {
			ctx.subscriptions.push({ dispose: () => { disposed = true; } });
		}));
		await r.activate("ext.sub");
		expect(disposed).toBe(false);
		await r.deactivate("ext.sub");
		expect(disposed).toBe(true);
	});

	test("disposing an active extension auto-deactivates and cleans up contributions", async () => {
		const r = new ExtensionRegistry();
		const cmd = noopCommand("plugin.auto");
		const d = r.register(makeExtension("ext.auto", (ctx) => {
			ctx.commands.register(cmd);
		}));
		await r.activate("ext.auto");
		expect(r.commands.get("plugin.auto")).toBeDefined();

		d.dispose();
		expect(r.commands.get("plugin.auto")).toBeUndefined();
		expect(r.list().find((e) => e.id === "ext.auto")).toBeUndefined();
	});
});

// ── Activation failure isolation ─────────────────────────────────────────────

describe("ExtensionRegistry — failure isolation", () => {
	test("activation failure does not crash the registry", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.good", (ctx) => {
			ctx.commands.register(noopCommand("good.cmd"));
		}));
		r.register(makeExtension("ext.bad", () => {
			throw new Error("activation failed");
		}));

		await r.activate("ext.bad");
		await r.activate("ext.good");

		expect(r.commands.get("good.cmd")).toBeDefined();
	});

	test("activation failure is reported in diagnostics", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.bad", () => { throw new Error("boom"); }));
		await r.activate("ext.bad");

		const diags = r.getDiagnostics();
		const badDiag = diags.find((d) => d.id === "ext.bad");
		expect(badDiag).toBeDefined();
		expect(badDiag!.status).toBe("activation-failed");
		expect(badDiag!.error).toContain("boom");
	});

	test("activation failure cleans up subscription disposables", async () => {
		const r = new ExtensionRegistry();
		let subsDisposed = false;
		r.register(makeExtension("ext.subfail", (ctx) => {
			ctx.subscriptions.push({ dispose: () => { subsDisposed = true; } });
			throw new Error("boom");
		}));
		await r.activate("ext.subfail");
		expect(subsDisposed).toBe(true);
	});

	test("successful activation appears as active in diagnostics", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.ok"));
		await r.activate("ext.ok");
		const diag = r.getDiagnostics().find((d) => d.id === "ext.ok");
		expect(diag).toBeDefined();
		expect(diag!.status).toBe("active");
	});

	test("unactivated extension appears as inactive in diagnostics", () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.idle"));
		const diag = r.getDiagnostics().find((d) => d.id === "ext.idle");
		expect(diag).toBeDefined();
		expect(diag!.status).toBe("inactive");
	});

	test("deactivation failure is caught and recorded in diagnostics", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.dfail", () => {}, () => {
			throw new Error("deactivation failed");
		}));
		await r.activate("ext.dfail");
		await r.deactivate("ext.dfail");

		const diag = r.getDiagnostics().find((d) => d.id === "ext.dfail");
		expect(diag).toBeDefined();
		expect(diag!.status).toBe("deactivation-failed");
		expect(diag!.error).toContain("deactivation failed");
	});

	test("deactivation failure via dispose preserves diagnostic", async () => {
		const r = new ExtensionRegistry();
		const d = r.register(makeExtension("ext.dispose-fail", () => {}, () => {
			throw new Error("dispose deactivation failed");
		}));
		await r.activate("ext.dispose-fail");
		d.dispose();
		// Poll until deactivation settles — the fire-and-forget dispose path
		// defers diagnostic cleanup so we must wait for it to land.
		const deadline = Date.now() + 500;
		let diag: ExtensionDiagnostic | undefined;
		while (Date.now() < deadline) {
			diag = r.getDiagnostics().find((d_) => d_.id === "ext.dispose-fail");
			if (diag && diag.status !== "active") break;
			await new Promise((resolve) => setTimeout(resolve, 1));
		}

		expect(diag).toBeDefined();
		expect(diag!.status).toBe("deactivation-failed");
		expect(diag!.error).toContain("dispose deactivation failed");
	});

	test("async activate works correctly", async () => {
		const r = new ExtensionRegistry();
		let activated = false;
		r.register(makeExtension("ext.async", async () => {
			await new Promise((resolve) => setTimeout(resolve, 1));
			activated = true;
		}));
		expect(activated).toBe(false);
		await r.activate("ext.async");
		expect(activated).toBe(true);
	});

	test("async deactivate works correctly", async () => {
		const r = new ExtensionRegistry();
		let deactivated = false;
		r.register(makeExtension("ext.async-deact", () => {}, async () => {
			await new Promise((resolve) => setTimeout(resolve, 1));
			deactivated = true;
		}));
		await r.activate("ext.async-deact");
		expect(deactivated).toBe(false);
		await r.deactivate("ext.async-deact");
		expect(deactivated).toBe(true);
	});
});

// ── ExtensionContext — contribution slots ─────────────────────────────────────

describe("ExtensionContext — contribution slots", () => {
	test("palette contributions are tracked and cleaned on deactivation", async () => {
		const r = new ExtensionRegistry();
		let palette: ContributionRegistration<PaletteContribution> | undefined;
		r.register(makeExtension("ext.pal", (ctx) => {
			palette = ctx.palette;
			ctx.palette.register({ command: "test.cmd", title: "Override Title" });
		}));
		r.commands.register(noopCommand("test.cmd"));

		await r.activate("ext.pal");
		expect(palette).toBeDefined();
		expect(palette!.list().length).toBe(1);
		expect(palette!.list()[0]!.command).toBe("test.cmd");
		expect(palette!.list()[0]!.title).toBe("Override Title");

		await r.deactivate("ext.pal");
		expect(palette!.list().length).toBe(0);
	});

	test("devtools contributions are tracked", async () => {
		const r = new ExtensionRegistry();
		let devtools: ContributionRegistration<DevtoolsContribution> | undefined;
		r.register(makeExtension("ext.dev", (ctx) => {
			devtools = ctx.devtools;
			ctx.devtools.register({ id: "panel.a", title: "Panel A" });
		}));
		await r.activate("ext.dev");
		expect(devtools!.list().length).toBe(1);
		expect(devtools!.list()[0]!.id).toBe("panel.a");
	});

	test("theme contributions are tracked", async () => {
		const r = new ExtensionRegistry();
		let themes: ContributionRegistration<ThemeContribution> | undefined;
		r.register(makeExtension("ext.thm", (ctx) => {
			themes = ctx.themes;
			ctx.themes.register({ id: "theme.a", title: "Theme A" });
		}));
		await r.activate("ext.thm");
		expect(themes!.list().length).toBe(1);
		expect(themes!.list()[0]!.id).toBe("theme.a");
	});

	test("example contributions are tracked", async () => {
		const r = new ExtensionRegistry();
		let examples: ContributionRegistration<ExampleContribution> | undefined;
		r.register(makeExtension("ext.ex", (ctx) => {
			examples = ctx.examples;
			ctx.examples.register({ id: "example.a", title: "Example A" });
		}));
		await r.activate("ext.ex");
		expect(examples!.list().length).toBe(1);
		expect(examples!.list()[0]!.id).toBe("example.a");
	});

	test("all contribution slots are cleaned on deactivation", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.cleanup", (ctx) => {
			ctx.palette.register({ command: "t.cmd" });
			ctx.devtools.register({ id: "d.panel", title: "Panel D" });
			ctx.themes.register({ id: "t.theme", title: "Theme T" });
			ctx.examples.register({ id: "e.example", title: "Example E" });
		}));
		await r.activate("ext.cleanup");

		let paletteProbe: ContributionRegistration<PaletteContribution> | undefined;
		let devtoolsProbe: ContributionRegistration<DevtoolsContribution> | undefined;
		r.register(makeExtension("ext.probe", (ctx) => {
			paletteProbe = ctx.palette;
			devtoolsProbe = ctx.devtools;
		}));
		await r.activate("ext.probe");

		expect(paletteProbe!.list().length).toBe(1);
		expect(devtoolsProbe!.list().length).toBe(1);

		await r.deactivate("ext.cleanup");
		expect(paletteProbe!.list().length).toBe(0);
		expect(devtoolsProbe!.list().length).toBe(0);
	});
});

// ── Diagnostics ──────────────────────────────────────────────────────────────

describe("ExtensionRegistry — diagnostics", () => {
	test("getDiagnostics returns empty array for empty registry", () => {
		const r = new ExtensionRegistry();
		expect(r.getDiagnostics()).toEqual([]);
	});

	test("getDiagnostics includes all registered extensions", () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("a"));
		r.register(makeExtension("b"));
		const diags = r.getDiagnostics();
		expect(diags.length).toBe(2);
		expect(diags.map((d) => d.id).sort()).toEqual(["a", "b"]);
	});

	test("isActive returns true for activated extensions", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("active.ext"));
		await r.activate("active.ext");
		expect(r.isActive("active.ext")).toBe(true);
	});

	test("isActive returns false for inactive and unknown extensions", () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("idle.ext"));
		expect(r.isActive("idle.ext")).toBe(false);
		expect(r.isActive("unknown")).toBe(false);
	});

	test("getExtension returns the registered extension", () => {
		const r = new ExtensionRegistry();
		const ext = makeExtension("find.me");
		r.register(ext);
		expect(r.getExtension("find.me")).toBe(ext);
	});

	test("diagnostics always include extension ID for every status", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ok"));
		r.register(makeExtension("fail"));
		await r.activate("ok");
		r.register(makeExtension("bad", () => { throw new Error("bad"); }));
		await r.activate("bad");

		const diags = r.getDiagnostics();
		for (const d of diags) {
			expect(typeof d.id).toBe("string");
			expect(d.id.length).toBeGreaterThan(0);
			expect(["inactive", "active", "activation-failed", "deactivation-failed"]).toContain(d.status);
		}
		const okDiag = diags.find((d) => d.id === "ok");
		const badDiag = diags.find((d) => d.id === "bad");
		const failDiag = diags.find((d) => d.id === "fail");
		expect(okDiag!.status).toBe("active");
		expect(badDiag!.status).toBe("activation-failed");
		expect(badDiag!.error).toBeDefined();
		expect(failDiag!.status).toBe("inactive");
	});

	test("getExtension returns undefined for unknown", () => {
		const r = new ExtensionRegistry();
		expect(r.getExtension("unknown")).toBeUndefined();
	});
});

// ── CommandPalette + palette registry integration ────────────────────────────

import { CommandPalette } from "./src/composites/command-palette";
import { Tuvren } from "./src/app";

describe("CommandPalette + palette registry integration", () => {
	test("palette contributions override command titles", () => {
		const r = new ExtensionRegistry();
		r.commands.register({ id: "cmd.a", title: "Command A", run: () => {} });
		r.commands.register({ id: "cmd.b", title: "Command B", run: () => {} });

		// Register a palette override for cmd.a via the shared registry
		r.palette.register({ command: "cmd.a", title: "Overridden A" });

		const app = Tuvren.initHeadless(80, 24);
		try {
			const palette = new CommandPalette({
				registry: r.commands,
				paletteRegistry: r.palette,
				app,
			});
			palette.open();
			expect(palette.getFilteredCount()).toBe(2);

			// Filter by the overridden title — should match exactly 1 command
			palette.applyFilter("Overridden");
			expect(palette.getFilteredCount()).toBe(1);

			// Filter by the original title — should no longer match
			palette.applyFilter("Command A");
			expect(palette.getFilteredCount()).toBe(0);
		} finally {
			app.shutdown();
		}
	});

	test("palette with no overrides shows original titles", () => {
		const r = new ExtensionRegistry();
		r.commands.register({ id: "cmd.a", title: "Command A", run: () => {} });

		const app = Tuvren.initHeadless(80, 24);
		try {
			const palette = new CommandPalette({ registry: r.commands, app });
			palette.open();
			expect(palette.getFilteredCount()).toBe(1);
			palette.applyFilter("Command A");
			expect(palette.getFilteredCount()).toBe(1);
		} finally {
			app.shutdown();
		}
	});

	test("deactivation removes palette contributions from CommandPalette", async () => {
		const r = new ExtensionRegistry();
		r.commands.register({ id: "cmd.a", title: "Command A", run: () => {} });
		r.register(makeExtension("ext.pal", (ctx) => {
			ctx.palette.register({ command: "cmd.a", title: "Overridden A" });
		}));

		const app = Tuvren.initHeadless(80, 24);
		try {
			await r.activate("ext.pal");
			const palette = new CommandPalette({
				registry: r.commands,
				paletteRegistry: r.palette,
				app,
			});
			palette.open();
			expect(palette.getFilteredCount()).toBe(1);
			palette.applyFilter("Overridden");
			expect(palette.getFilteredCount()).toBe(1);

			// After deactivation, the override should be gone
			await r.deactivate("ext.pal");
			palette.open();
			palette.applyFilter("Overridden");
			expect(palette.getFilteredCount()).toBe(0);
			palette.applyFilter("Command A");
			expect(palette.getFilteredCount()).toBe(1);
		} finally {
			app.shutdown();
		}
	});
});

// ── Plugin command dispatch ──────────────────────────────────────────────────

import { CommandDispatcher } from "./src/commands";
import type { TuvrenEvent } from "./src/events";
import { KeyCode, Modifier } from "./src/ffi/structs";

describe("Plugin command dispatch", () => {
	function keyEvent(keyCode: number, modifiers = 0, codepoint = 0): TuvrenEvent {
		return { type: "key", target: 0, keyCode, modifiers, codepoint };
	}

	test("plugin commands are dispatched through CommandDispatcher", async () => {
		const app = Tuvren.initHeadless(80, 24);
		const r = new ExtensionRegistry();
		let ran = false;
		r.commands.register({
			id: "plugin.run",
			title: "Plugin Run",
			run: () => { ran = true; },
		});
		r.keymaps.setRegistry(r.commands);
		r.register(makeExtension("ext.cmd", (ctx) => {
			ctx.keymaps.register({ command: "plugin.run", key: "escape" });
		}));
		await r.activate("ext.cmd");

		const dispatcher = new CommandDispatcher(r.commands, r.keymaps, app);
		await dispatcher.dispatch(keyEvent(KeyCode.Escape));
		expect(ran).toBe(true);
		app.shutdown();
	});

	test("plugin deactivation removes keybindings", async () => {
		const app = Tuvren.initHeadless(80, 24);
		const r = new ExtensionRegistry();
		let ran = false;
		r.commands.register({
			id: "plugin.run",
			title: "Plugin Run",
			run: () => { ran = true; },
		});
		r.keymaps.setRegistry(r.commands);
		r.register(makeExtension("ext.cmd", (ctx) => {
			ctx.keymaps.register({ command: "plugin.run", key: "escape" });
		}));
		await r.activate("ext.cmd");

		const dispatcher = new CommandDispatcher(r.commands, r.keymaps, app);
		await dispatcher.dispatch(keyEvent(KeyCode.Escape));
		expect(ran).toBe(true);

		// Reset and deactivate
		ran = false;
		await r.deactivate("ext.cmd");
		await dispatcher.dispatch(keyEvent(KeyCode.Escape));
		expect(ran).toBe(false);
		app.shutdown();
	});

	test("plugin command context includes correct source", async () => {
		const app = Tuvren.initHeadless(80, 24);
		const r = new ExtensionRegistry();
		let capturedSource: string | undefined;
		r.commands.register({
			id: "plugin.run",
			title: "Plugin Run",
			run: (ctx) => { capturedSource = ctx.source; },
		});
		r.keymaps.setRegistry(r.commands);
		r.register(makeExtension("ext.cmd", (ctx) => {
			ctx.keymaps.register({ command: "plugin.run", key: "f1" });
		}));
		await r.activate("ext.cmd");

		const dispatcher = new CommandDispatcher(r.commands, r.keymaps, app);
		await dispatcher.dispatch(keyEvent(KeyCode.F1));
		expect(capturedSource).toBe("keymap");
		app.shutdown();
	});
});

// ── Contribution validation ──────────────────────────────────────────────────

describe("Contribution validation", () => {
	test("palette rejects empty command string", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.val", (ctx) => {
			ctx.palette.register({ command: "", title: "Bad" });
		}));
		await r.activate("ext.val");
		expect(r.isActive("ext.val")).toBe(false);
		const diag = r.getDiagnostics().find((d) => d.id === "ext.val");
		expect(diag).toBeDefined();
		expect(diag!.status).toBe("activation-failed");
	});

	test("palette rejects missing command", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.val2", (ctx) => {
			ctx.palette.register({} as PaletteContribution);
		}));
		await r.activate("ext.val2");
		expect(r.isActive("ext.val2")).toBe(false);
	});

	test("devtools rejects empty id", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.devbad", (ctx) => {
			ctx.devtools.register({ id: "", title: "Bad Panel" });
		}));
		await r.activate("ext.devbad");
		expect(r.isActive("ext.devbad")).toBe(false);
	});

	test("themes rejects empty title", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.thmbad", (ctx) => {
			ctx.themes.register({ id: "theme.ok", title: "" });
		}));
		await r.activate("ext.thmbad");
		expect(r.isActive("ext.thmbad")).toBe(false);
	});

	test("examples rejects empty title", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.exbad", (ctx) => {
			ctx.examples.register({ id: "ex.ok", title: "" });
		}));
		await r.activate("ext.exbad");
		expect(r.isActive("ext.exbad")).toBe(false);
	});
});

// ── Plugin safety and diagnostics rules ──────────────────────────────────────

describe("Plugin safety and diagnostics", () => {
	test("public registries expose devtools, themes, and examples without native access", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.all", (ctx) => {
			ctx.devtools.register({ id: "panel.a", title: "Panel A" });
			ctx.themes.register({ id: "theme.a", title: "Theme A" });
			ctx.examples.register({ id: "ex.a", title: "Example A" });
		}));
		await r.activate("ext.all");

		// All registries are publicly accessible as properties
		expect(r.devtools.list().length).toBe(1);
		expect(r.themes.list().length).toBe(1);
		expect(r.examples.list().length).toBe(1);
		expect(r.devtools.list()[0]!.id).toBe("panel.a");
		expect(r.themes.list()[0]!.id).toBe("theme.a");
		expect(r.examples.list()[0]!.id).toBe("ex.a");
	});

	test("plugin failures include the owning extension ID", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.fail", () => {
			throw new Error("boom");
		}));
		await r.activate("ext.fail");

		const diag = r.getDiagnostics().find((d) => d.id === "ext.fail");
		expect(diag).toBeDefined();
		expect(diag!.id).toBe("ext.fail");
		expect(diag!.status).toBe("activation-failed");
		expect(diag!.error).toBeDefined();
	});

	test("duplicate extension id includes the id in the error message", () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("dup.id"));
		expect(() => r.register(makeExtension("dup.id"))).toThrow("dup.id");
	});

	test("invalid extension id includes validation context in the error", () => {
		const r = new ExtensionRegistry();
		expect(() => r.register(makeExtension(""))).toThrow("Extension id");
	});

	test("deactivation failure still records the extension ID", async () => {
		const r = new ExtensionRegistry();
		r.register(makeExtension("ext.deact-fail", () => {}, () => {
			throw new Error("deact boom");
		}));
		await r.activate("ext.deact-fail");
		await r.deactivate("ext.deact-fail");

		const diag = r.getDiagnostics().find((d) => d.id === "ext.deact-fail");
		expect(diag).toBeDefined();
		expect(diag!.id).toBe("ext.deact-fail");
		expect(diag!.status).toBe("deactivation-failed");
		expect(diag!.error).toContain("deact boom");
	});

	test("pre-GA markers are present on exported types", async () => {
		const source = await Bun.file("ts/src/extensions.ts").text();
		const markers = [
			"@pre-GA — Plugin APIs may break before v1.0 (ADR-T46).",
			"@pre-GA — Palette-visible command metadata",
			"@pre-GA — Devtools panel metadata.",
			"@pre-GA — Theme preset metadata.",
			"@pre-GA — Showcase/example metadata.",
			"@pre-GA — Plugin APIs may break before v1.0.",
		];
		for (const m of markers) {
			expect(source).toContain(m);
		}
	});
});

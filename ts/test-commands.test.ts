/**
 * Commands & Keymap Foundations — test suite (Epic R).
 *
 * Tests CommandRegistry, KeymapRegistry, CommandDispatcher, and
 * CommandPalette–registry integration, all against fixed inputs and
 * expected behavioral outcomes.
 *
 * Run: bun test ts/test-commands.test.ts
 */

import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import {
	CommandRegistry,
	CommandDispatcher,
} from "./src/commands";
import type {
	Command,
	CommandContext,
	Disposable,
} from "./src/commands";
import { KeymapRegistry } from "./src/keymap";
import type { KeyBinding } from "./src/keymap";
import { Tuvren } from "./src/app";
import { TuvrenError } from "./src/errors";
import type { TuvrenEvent } from "./src/events";
import { KeyCode, Modifier } from "./src/ffi/structs";
import { CommandPalette } from "./src/composites/command-palette";

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeContext(app: Tuvren, extra?: Partial<CommandContext>): CommandContext {
	return {
		app,
		source: "programmatic",
		...extra,
	};
}

function keyEvent(keyCode: number, modifiers = 0, codepoint = 0): TuvrenEvent {
	return { type: "key", target: 0, keyCode, modifiers, codepoint };
}

function charEvent(char: string, modifiers = 0): TuvrenEvent {
	const cp = char.codePointAt(0) ?? 0;
	return { type: "key", target: 0, keyCode: 0, modifiers, codepoint: cp };
}

// ── CommandRegistry ───────────────────────────────────────────────────────────

describe("CommandRegistry — registration", () => {
	let registry: CommandRegistry;

	beforeEach(() => { registry = new CommandRegistry(); });

	test("registers a valid command", () => {
		const cmd: Command = { id: "test.cmd", title: "Test", run: () => {} };
		const disposable = registry.register(cmd);
		expect(typeof disposable.dispose).toBe("function");
	});

	test("list() returns all registered commands", () => {
		registry.register({ id: "a", title: "A", run: () => {} });
		registry.register({ id: "b", title: "B", run: () => {} });
		const commands = registry.list();
		expect(commands.length).toBe(2);
		expect(commands.map(c => c.id).sort()).toEqual(["a", "b"]);
	});

	test("throws on duplicate command id", () => {
		registry.register({ id: "dup", title: "Dup", run: () => {} });
		expect(() =>
			registry.register({ id: "dup", title: "Dup 2", run: () => {} })
		).toThrow(TuvrenError);
	});

	test("throws on empty command id", () => {
		expect(() =>
			registry.register({ id: "", title: "Empty", run: () => {} })
		).toThrow(TuvrenError);
	});

	test("throws on whitespace-only command id", () => {
		expect(() =>
			registry.register({ id: "   ", title: "Space", run: () => {} })
		).toThrow(TuvrenError);
	});

	test("throws on missing title", () => {
		expect(() =>
			registry.register({ id: "no-title", title: "", run: () => {} })
		).toThrow(TuvrenError);
	});

	test("throws when run is not a function", () => {
		expect(() =>
			// biome-ignore lint/suspicious/noExplicitAny: testing invalid input
			registry.register({ id: "bad-run", title: "Bad", run: null as any })
		).toThrow(TuvrenError);
	});
});

describe("CommandRegistry — dispose (unregister)", () => {
	let registry: CommandRegistry;

	beforeEach(() => { registry = new CommandRegistry(); });

	test("dispose removes command from list()", () => {
		const d = registry.register({ id: "temp", title: "Temp", run: () => {} });
		expect(registry.list().length).toBe(1);
		d.dispose();
		expect(registry.list().length).toBe(0);
	});

	test("can re-register after dispose", () => {
		const d = registry.register({ id: "reuse", title: "Reuse", run: () => {} });
		d.dispose();
		expect(() =>
			registry.register({ id: "reuse", title: "Reuse", run: () => {} })
		).not.toThrow();
	});

	test("dispose is idempotent", () => {
		const d = registry.register({ id: "idem", title: "Idem", run: () => {} });
		d.dispose();
		expect(() => d.dispose()).not.toThrow();
		expect(registry.list().length).toBe(0);
	});
});

describe("CommandRegistry — execute", () => {
	let app: Tuvren;
	let registry: CommandRegistry;

	beforeEach(() => {
		app = Tuvren.initHeadless(80, 24);
		registry = new CommandRegistry();
	});
	afterEach(() => { app.shutdown(); });

	test("execute returns true and runs the command", async () => {
		let ran = false;
		registry.register({ id: "run.me", title: "Run Me", run: () => { ran = true; } });
		const result = await registry.execute("run.me", makeContext(app));
		expect(result).toBe(true);
		expect(ran).toBe(true);
	});

	test("execute returns false for unknown id", async () => {
		const result = await registry.execute("does.not.exist", makeContext(app));
		expect(result).toBe(false);
	});

	test("execute returns false after command is disposed", async () => {
		const d = registry.register({ id: "disposed", title: "D", run: () => {} });
		d.dispose();
		const result = await registry.execute("disposed", makeContext(app));
		expect(result).toBe(false);
	});

	test("execute passes context to command", async () => {
		let capturedCtx: CommandContext | undefined;
		registry.register({
			id: "capture",
			title: "Capture",
			run: (ctx) => { capturedCtx = ctx; },
		});
		const ctx = makeContext(app, { source: "palette" });
		await registry.execute("capture", ctx);
		expect(capturedCtx?.source).toBe("palette");
	});

	test("execute respects when predicate — true allows execution", async () => {
		let ran = false;
		registry.register({
			id: "when.true",
			title: "When True",
			run: () => { ran = true; },
			when: () => true,
		});
		await registry.execute("when.true", makeContext(app));
		expect(ran).toBe(true);
	});

	test("execute respects when predicate — false prevents execution", async () => {
		let ran = false;
		registry.register({
			id: "when.false",
			title: "When False",
			run: () => { ran = true; },
			when: () => false,
		});
		const result = await registry.execute("when.false", makeContext(app));
		expect(result).toBe(false);
		expect(ran).toBe(false);
	});

	test("execute supports async run", async () => {
		let resolved = false;
		registry.register({
			id: "async.cmd",
			title: "Async",
			run: async () => {
				await Promise.resolve();
				resolved = true;
			},
		});
		await registry.execute("async.cmd", makeContext(app));
		expect(resolved).toBe(true);
	});
});

// ── KeymapRegistry ────────────────────────────────────────────────────────────

describe("KeymapRegistry — registration and validation", () => {
	let keymaps: KeymapRegistry;

	beforeEach(() => { keymaps = new KeymapRegistry(); });

	test("registers a valid binding", () => {
		const registry = new CommandRegistry();
		registry.register({ id: "my.cmd", title: "My Cmd", run: () => {} });
		const d = keymaps.register({ command: "my.cmd", key: "ctrl+c" });
		expect(typeof d.dispose).toBe("function");
	});

	test("throws on empty key string", () => {
		expect(() =>
			keymaps.register({ command: "cmd", key: "" })
		).toThrow(TuvrenError);
	});

	test("throws on unknown key name", () => {
		expect(() =>
			keymaps.register({ command: "cmd", key: "ctrl+notakey" })
		).toThrow(TuvrenError);
	});

	test("throws on key string with no key after modifiers", () => {
		expect(() =>
			keymaps.register({ command: "cmd", key: "ctrl+shift" })
		).toThrow(TuvrenError);
	});

	test("dispose removes the binding", () => {
		const registry = new CommandRegistry();
		registry.register({ id: "rem", title: "Rem", run: () => {} });
		const d = keymaps.register({ command: "rem", key: "escape" });
		d.dispose();
		// After dispose, the key should no longer resolve
		const event = keyEvent(KeyCode.Escape);
		const cmd = keymaps.resolve(event, { app: null as unknown as Tuvren, source: "keymap" });
		expect(cmd).toBeUndefined();
	});
});

describe("KeymapRegistry — resolve special keys", () => {
	let keymaps: KeymapRegistry;
	let registry: CommandRegistry;
	let app: Tuvren;

	beforeEach(() => {
		app = Tuvren.initHeadless(80, 24);
		registry = new CommandRegistry();
		keymaps = new KeymapRegistry();
	});
	afterEach(() => { app.shutdown(); });

	function ctx(): CommandContext { return makeContext(app, { source: "keymap" }); }

	test("resolves 'escape' to escape key event", () => {
		registry.register({ id: "close", title: "Close", run: () => {} });
		keymaps.register({ command: "close", key: "escape" });
		const cmd = keymaps.resolve(keyEvent(KeyCode.Escape), ctx());
		expect(cmd?.id).toBe("close");
	});

	test("resolves 'enter' to enter key event", () => {
		registry.register({ id: "confirm", title: "Confirm", run: () => {} });
		keymaps.register({ command: "confirm", key: "enter" });
		// Provide registry so resolve can look up the command
		keymaps.setRegistry(registry);
		const cmd = keymaps.resolve(keyEvent(KeyCode.Enter), ctx());
		expect(cmd?.id).toBe("confirm");
	});

	test("resolves 'up' arrow key", () => {
		registry.register({ id: "prev", title: "Prev", run: () => {} });
		keymaps.register({ command: "prev", key: "up" });
		keymaps.setRegistry(registry);
		const cmd = keymaps.resolve(keyEvent(KeyCode.Up), ctx());
		expect(cmd?.id).toBe("prev");
	});

	test("resolves 'f5' function key", () => {
		registry.register({ id: "refresh", title: "Refresh", run: () => {} });
		keymaps.register({ command: "refresh", key: "f5" });
		keymaps.setRegistry(registry);
		const cmd = keymaps.resolve(keyEvent(0x0114 /* F5 */), ctx());
		expect(cmd?.id).toBe("refresh");
	});

	test("does not resolve non-matching key", () => {
		registry.register({ id: "x", title: "X", run: () => {} });
		keymaps.register({ command: "x", key: "enter" });
		keymaps.setRegistry(registry);
		const cmd = keymaps.resolve(keyEvent(KeyCode.Escape), ctx());
		expect(cmd).toBeUndefined();
	});

	test("does not resolve non-key events", () => {
		registry.register({ id: "y", title: "Y", run: () => {} });
		keymaps.register({ command: "y", key: "enter" });
		keymaps.setRegistry(registry);
		const mouseEvent: TuvrenEvent = { type: "mouse", target: 0, x: 0, y: 0 };
		const cmd = keymaps.resolve(mouseEvent, ctx());
		expect(cmd).toBeUndefined();
	});
});

describe("KeymapRegistry — resolve character keys", () => {
	let keymaps: KeymapRegistry;
	let registry: CommandRegistry;
	let app: Tuvren;

	beforeEach(() => {
		app = Tuvren.initHeadless(80, 24);
		registry = new CommandRegistry();
		keymaps = new KeymapRegistry();
		keymaps.setRegistry(registry);
	});
	afterEach(() => { app.shutdown(); });

	function ctx(): CommandContext { return makeContext(app, { source: "keymap" }); }

	test("resolves 'q' character binding", () => {
		registry.register({ id: "quit", title: "Quit", run: () => {} });
		keymaps.register({ command: "quit", key: "q" });
		const cmd = keymaps.resolve(charEvent("q"), ctx());
		expect(cmd?.id).toBe("quit");
	});

	test("char binding is case-insensitive (upper-case event codepoint)", () => {
		registry.register({ id: "q2", title: "Q2", run: () => {} });
		keymaps.register({ command: "q2", key: "q" });
		// Some terminals send uppercase Q for the 'q' key
		const cmd = keymaps.resolve(charEvent("Q"), ctx());
		expect(cmd?.id).toBe("q2");
	});

	test("resolves ctrl+c combination", () => {
		registry.register({ id: "copy", title: "Copy", run: () => {} });
		keymaps.register({ command: "copy", key: "ctrl+c" });
		const cmd = keymaps.resolve(charEvent("c", Modifier.Ctrl), ctx());
		expect(cmd?.id).toBe("copy");
	});

	test("ctrl+c does not match plain c", () => {
		registry.register({ id: "ctrl-c", title: "Ctrl-C", run: () => {} });
		keymaps.register({ command: "ctrl-c", key: "ctrl+c" });
		const cmd = keymaps.resolve(charEvent("c", 0), ctx());
		expect(cmd).toBeUndefined();
	});

	test("resolves ctrl+shift+k", () => {
		registry.register({ id: "action", title: "Action", run: () => {} });
		keymaps.register({ command: "action", key: "ctrl+shift+k" });
		const cmd = keymaps.resolve(charEvent("k", Modifier.Ctrl | Modifier.Shift), ctx());
		expect(cmd?.id).toBe("action");
	});
});

describe("KeymapRegistry — when predicate", () => {
	let keymaps: KeymapRegistry;
	let registry: CommandRegistry;
	let app: Tuvren;

	beforeEach(() => {
		app = Tuvren.initHeadless(80, 24);
		registry = new CommandRegistry();
		keymaps = new KeymapRegistry();
		keymaps.setRegistry(registry);
	});
	afterEach(() => { app.shutdown(); });

	function ctx(extra?: Partial<CommandContext>): CommandContext {
		return makeContext(app, { source: "keymap", ...extra });
	}

	test("binding with when=true resolves", () => {
		registry.register({ id: "w1", title: "W1", run: () => {} });
		keymaps.register({ command: "w1", key: "escape", when: () => true });
		const cmd = keymaps.resolve(keyEvent(KeyCode.Escape), ctx());
		expect(cmd?.id).toBe("w1");
	});

	test("binding with when=false does not resolve", () => {
		registry.register({ id: "w2", title: "W2", run: () => {} });
		keymaps.register({ command: "w2", key: "escape", when: () => false });
		const cmd = keymaps.resolve(keyEvent(KeyCode.Escape), ctx());
		expect(cmd).toBeUndefined();
	});

	test("first registered binding wins when multiple match same key", () => {
		registry.register({ id: "first", title: "First", run: () => {} });
		registry.register({ id: "second", title: "Second", run: () => {} });
		keymaps.register({ command: "first", key: "enter" });
		keymaps.register({ command: "second", key: "enter" });
		const cmd = keymaps.resolve(keyEvent(KeyCode.Enter), ctx());
		expect(cmd?.id).toBe("first");
	});
});

// ── CommandDispatcher ─────────────────────────────────────────────────────────

describe("CommandDispatcher — integration", () => {
	let app: Tuvren;
	let registry: CommandRegistry;
	let keymaps: KeymapRegistry;
	let dispatcher: CommandDispatcher;

	beforeEach(() => {
		app = Tuvren.initHeadless(80, 24);
		registry = new CommandRegistry();
		keymaps = new KeymapRegistry();
		keymaps.setRegistry(registry);
		dispatcher = new CommandDispatcher(registry, keymaps, app);
	});
	afterEach(() => { app.shutdown(); });

	test("dispatching a bound key event runs the command", async () => {
		let ran = false;
		registry.register({ id: "d.run", title: "D Run", run: () => { ran = true; } });
		keymaps.register({ command: "d.run", key: "escape" });
		await dispatcher.dispatch(keyEvent(KeyCode.Escape));
		expect(ran).toBe(true);
	});

	test("dispatching an unbound key event is a no-op", async () => {
		let ran = false;
		registry.register({ id: "d.skip", title: "D Skip", run: () => { ran = true; } });
		keymaps.register({ command: "d.skip", key: "enter" });
		await dispatcher.dispatch(keyEvent(KeyCode.Escape));
		expect(ran).toBe(false);
	});

	test("non-key events are ignored", async () => {
		let ran = false;
		registry.register({ id: "d.nokey", title: "No key", run: () => { ran = true; } });
		keymaps.register({ command: "d.nokey", key: "q" });
		const resize: TuvrenEvent = { type: "resize", target: 0, width: 80, height: 24 };
		await dispatcher.dispatch(resize);
		expect(ran).toBe(false);
	});

	test("dispatch passes source:keymap in context", async () => {
		let source: string | undefined;
		registry.register({
			id: "src.check",
			title: "Source Check",
			run: (ctx) => { source = ctx.source; },
		});
		keymaps.register({ command: "src.check", key: "f1" });
		await dispatcher.dispatch(keyEvent(KeyCode.F1));
		expect(source).toBe("keymap");
	});
});

// ── CommandPalette ────────────────────────────────────────────────────────────

describe("CommandPalette — registry integration", () => {
	let app: Tuvren;
	let registry: CommandRegistry;

	beforeEach(() => {
		app = Tuvren.initHeadless(80, 24);
		registry = new CommandRegistry();
		const root = new (require("./src/widgets/box").Box)();
		app.setRoot(root);
	});
	afterEach(() => { app.shutdown(); });

	test("palette lists commands from registry", () => {
		registry.register({ id: "p.a", title: "Alpha", run: () => {} });
		registry.register({ id: "p.b", title: "Beta", run: () => {} });
		const palette = new CommandPalette({ registry });
		palette.open();
		expect(palette.getFilteredCount()).toBe(2);
	});

	test("palette filters by title", () => {
		registry.register({ id: "p.alpha", title: "Alpha Action", run: () => {} });
		registry.register({ id: "p.beta", title: "Beta Thing", run: () => {} });
		const palette = new CommandPalette({ registry });
		palette.open();
		palette.applyFilter("alpha");
		expect(palette.getFilteredCount()).toBe(1);
	});

	test("executeSelected runs command through registry (tracks execution)", async () => {
		let ran = false;
		registry.register({ id: "p.exec", title: "Exec Me", run: () => { ran = true; } });
		const palette = new CommandPalette({ registry, app });
		palette.open();
		await palette.executeSelected();
		expect(ran).toBe(true);
	});

	test("static commands array still works for backward compatibility", () => {
		const palette = new CommandPalette({
			commands: [
				{ id: "s.one", title: "One", run: () => {} },
				{ id: "s.two", title: "Two", run: () => {} },
			],
		});
		palette.open();
		expect(palette.getFilteredCount()).toBe(2);
	});
});

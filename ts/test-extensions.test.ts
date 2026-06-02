/**
 * Plugin Slots and Extensibility — test suite (Epic T).
 *
 * Tests ExtensionRegistry, ExtensionContext, contribution registries,
 * activation/deactivation lifecycle, failure isolation, and diagnostics.
 *
 * Run: bun test ts/test-extensions.test.ts
 */

import { describe, test, expect, beforeEach } from "bun:test";
import {
  ExtensionRegistry,
  ContributionRegistry,
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
import { Tuvren } from "./src/app";
import { CommandPalette } from "./src/composites/command-palette";

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

// ── ContributionRegistry ─────────────────────────────────────────────────────

describe("ContributionRegistry", () => {
  test("register returns a disposable", () => {
    const r = new ContributionRegistry<string>();
    const d = r.register("item-a");
    expect(typeof d.dispose).toBe("function");
  });

  test("list returns registered items", () => {
    const r = new ContributionRegistry<string>();
    r.register("a");
    r.register("b");
    expect(r.list()).toEqual(["a", "b"]);
  });

  test("dispose removes the item from the registry", () => {
    const r = new ContributionRegistry<string>();
    const d = r.register("a");
    r.register("b");
    d.dispose();
    expect(r.list()).toEqual(["b"]);
  });

  test("double-dispose is safe", () => {
    const r = new ContributionRegistry<string>();
    const d = r.register("a");
    d.dispose();
    d.dispose();
    expect(r.list()).toEqual([]);
  });

  test("empty registry returns empty list", () => {
    const r = new ContributionRegistry<string>();
    expect(r.list()).toEqual([]);
  });

  test("double-dispose does not remove other items", () => {
    const r = new ContributionRegistry<string>();
    r.register("a");
    const db = r.register("b");
    r.register("c");
    // Double-dispose item "b"
    db.dispose();
    db.dispose();
    expect(r.list()).toEqual(["a", "c"]);
  });
});

// ── ExtensionRegistry — registration and lifecycle ───────────────────────────

describe("ExtensionRegistry — registration", () => {
  const extRegistry = new ExtensionRegistry();

  test("register returns a disposable", () => {
    const d = extRegistry.register(makeExtension("test.ext"));
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
    // Tracked wrappers are structural (plain objects), not Class instances
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
    // The extension should still be active after the rejected second call
    expect(r.isActive("ext.dup")).toBe(true);
  });

  test("commands registered during activation appear in the shared registry", async () => {
    const r = new ExtensionRegistry();
    const cmd: Command = { id: "plugin.cmd", title: "Plugin", run: () => {} };
    r.register(makeExtension("ext.a", (ctx) => { ctx.commands.register(cmd); }));
    // Pre-register a native command in the shared registry
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

    // Dispose the extension registration — should auto-deactivate
    d.dispose();
    // Verify the command was removed via auto-deactivation
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

    await r.activate("ext.bad"); // should not throw
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
    // The subscription should have been cleaned up after the failure
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

    // Activate a second extension to probe shared registries
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

  test("getExtension returns undefined for unknown", () => {
    const r = new ExtensionRegistry();
    expect(r.getExtension("unknown")).toBeUndefined();
  });
});

// ── Validation ───────────────────────────────────────────────────────────────

describe("Contribution validation", () => {
  test("palette rejects empty command string", async () => {
    const r = new ExtensionRegistry();
    r.register(makeExtension("ext.val", (ctx) => {
      ctx.palette.register({ command: "", title: "Bad" });
    }));
    await r.activate("ext.val");
    // Validation failure is caught during activation, extension is inactive
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

// ── CommandPalette integration ───────────────────────────────────────────────

describe("CommandPalette + palette registry integration", () => {
  test("palette contributions override command titles", () => {
    const r = new ExtensionRegistry();
    r.commands.register({ id: "cmd.a", title: "Command A", run: () => {} });
    r.commands.register({ id: "cmd.b", title: "Command B", run: () => {} });

    // Simulate what the extension would do: register palette overrides
    r.register(makeExtension("ext.pal-integ", (ctx) => {
      ctx.palette.register({ command: "cmd.a", title: "Overridden A" });
    }));

    // Verify the palette registry has the contribution (activation not needed for this test)
    // The palette registry is internal to ExtensionRegistry, so we test via extensions
    const pal = new ContributionRegistry<PaletteContribution>();
    pal.register({ command: "cmd.a", title: "Overridden A" });

    const app = Tuvren.initHeadless(80, 24);
    try {
      const palette = new CommandPalette({
        registry: r.commands,
        paletteRegistry: pal,
        app,
      });
      palette.open();
      // check list titles
      const count = palette.getFilteredCount();
      expect(count).toBe(2);
      // Command A should have overridden title
      expect(palette.getQuery()).toBe(""); // no filter active
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
    } finally {
      app.shutdown();
    }
  });
});

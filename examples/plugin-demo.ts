/**
 * Plugin Demo — Epic T example exercising the ExtensionRegistry with all
 * supported contribution types (commands, keymaps, palette, devtools,
 * themes, examples) plus activation, deactivation, and diagnostics.
 *
 * Run: bun run examples/plugin-demo.ts
 *
 * @pre-GA — Plugin APIs may break before v1.0.
 */

import {
  ExtensionRegistry,
  type Extension,
  type ExtensionContext,
} from "../ts/src/index";

// ── Helpers ──────────────────────────────────────────────────────────────────

function banner(title: string): void {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`  ${title}`);
  console.log(`${"=".repeat(50)}`);
}

function logDiag(reg: ExtensionRegistry): void {
  const diags = reg.getDiagnostics();
  for (const d of diags) {
    const status = d.status.toUpperCase().padEnd(20);
    const error = d.error ? ` (${d.error})` : "";
    console.log(`  [${status}] ${d.id}${error}`);
  }
}

// ── Extension definitions ────────────────────────────────────────────────────

const helloExtension: Extension = {
  id: "demo.hello",
  activate(ctx: ExtensionContext) {
    // Contribute a command
    ctx.commands.register({
      id: "demo.hello.greet",
      title: "Greet",
      category: "Demo",
      run: () => console.log("Hello from demo.hello!"),
    });

    // Contribute a keybinding
    ctx.keymaps.register({ command: "demo.hello.greet", key: "ctrl+h" });

    // Contribute palette metadata
    ctx.palette.register({ command: "demo.hello.greet", title: "Greet (Hello Extension)" });

    // Contribute a devtools panel
    ctx.devtools.register({ id: "hello-inspector", title: "Hello Inspector" });

    // Contribute a theme preset
    ctx.themes.register({ id: "hello-light", title: "Hello Light" });

    // Contribute a showcase example
    ctx.examples.register({ id: "hello-example", title: "Hello World Example" });

    // Manual subscription
    ctx.subscriptions.push({
      dispose: () => console.log("[demo.hello] manual subscription disposed"),
    });
  },
  deactivate() {
    console.log("[demo.hello] deactivated");
  },
};

const brokenExtension: Extension = {
  id: "demo.broken",
  activate() {
    throw new Error("Intentional activation failure for demo purposes");
  },
};

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const registry = new ExtensionRegistry();

  banner("1. Register extensions");
  const helloDisp = registry.register(helloExtension);
  const brokenDisp = registry.register(brokenExtension);
  console.log("Extensions registered:");
  for (const ext of registry.list()) {
    console.log(`  - ${ext.id}`);
  }

  banner("2. Activate helloExtension");
  const ok = await registry.activate("demo.hello");
  console.log(`Activation result: ${ok}`);

  // Verify command was registered
  const cmd = registry.commands.get("demo.hello.greet");
  console.log(`Command found: ${cmd ? cmd.id : "MISSING"}`);

  // Verify palette contributions
  const paletteItems = registry.palette.list();
  console.log(`Palette items: ${paletteItems.length}`);
  for (const pi of paletteItems) {
    console.log(`  - ${pi.command} => "${pi.title ?? pi.command}"`);
  }

  // Verify other contributions
  console.log(`Devtools panels: ${registry.devtools.list().length}`);
  console.log(`Themes: ${registry.themes.list().length}`);
  console.log(`Examples: ${registry.examples.list().length}`);

  banner("3. Activate brokenExtension (failure isolation)");
  const brokenOk = await registry.activate("demo.broken");
  console.log(`Activation result: ${brokenOk} (true = success, false = failed / unknown / already active)`);

  banner("4. Diagnostics");
  logDiag(registry);

  banner("5. Deactivate helloExtension");
  const deactivated = await registry.deactivate("demo.hello");
  console.log(`Deactivation result: ${deactivated}`);
  console.log(`Is active: ${registry.isActive("demo.hello")}`);
  console.log(`Command still registered: ${registry.commands.get("demo.hello.greet") ? "YES" : "NO"}`);

  banner("6. Dispose registrations");
  brokenDisp.dispose();
  helloDisp.dispose();
  console.log(`Remaining after cleanup: ${registry.list().length}`);

  banner("7. Final diagnostics");
  logDiag(registry);

  console.log("\nPlugin demo complete.");
}

main().catch((e) => {
  console.error("Plugin demo failed:", e);
  process.exit(1);
});

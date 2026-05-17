# Migration Guide: Kraken → Tuvren

This guide covers the hard-cut rename from `kraken-tui` to `tuvren-tui` and all associated symbol, environment variable, and artifact changes.

**Audience:** Early adopters consuming this repository as a git dependency, source checkout, or internal install. Neither `kraken-tui` nor `tuvren-tui` has been published to the public npm registry yet (binary publishing is staged for the first `@tuvren` release). If you have been importing from a local clone or git URL, this guide provides the complete migration map.

**This is a pre-1.0 breaking change.** No compatibility aliases are provided. Old names are removed outright rather than deprecated. Update all usages at once before resuming development against the new package.

---

## Quick Reference

| Category | Old name | New name |
|----------|----------|----------|
| npm package | `kraken-tui` | `tuvren-tui` |
| Subpath: root | `kraken-tui` | `tuvren-tui` |
| Subpath: JSX runtime | `kraken-tui/jsx-runtime` | `tuvren-tui/jsx-runtime` |
| Subpath: JSX dev runtime | `kraken-tui/jsx-dev-runtime` | `tuvren-tui/jsx-dev-runtime` |
| Subpath: Effect | `kraken-tui/effect` | `tuvren-tui/effect` |
| `tsconfig.json` `jsxImportSource` | `kraken-tui` | `tuvren-tui` |
| Host facade class | `Kraken` | `Tuvren` |
| Error type | `KrakenError` | `TuvrenError` |
| Event type | `KrakenEvent` | `TuvrenEvent` |
| Event type union | `KrakenEventType` | `TuvrenEventType` |
| JSX fragment re-export | `KrakenFragment` | `TuvrenFragment` |
| Resolver env var | `KRAKEN_LIB_PATH` | `TUVREN_LIB_PATH` |
| Shared library (Linux) | `libkraken_tui.so` | `libtuvren_tui.so` |
| Shared library (macOS) | `libkraken_tui.dylib` | `libtuvren_tui.dylib` |
| Shared library (Windows) | `kraken_tui.dll` | `tuvren_tui.dll` |
| Release asset pattern | `kraken-tui-<tag>-<platform>.<ext>` | `tuvren-tui-<tag>-<platform>.<ext>` |
| Aux native package scope | `@kraken/*` | `@tuvren/*` |

The `tui_*` C ABI prefix is **unchanged**. No ABI migration is required if you were calling FFI symbols directly.

---

## Step-by-step Migration

### 1. Update your package dependency

```bash
# Remove the old package
bun remove kraken-tui

# Add the new package
bun add tuvren-tui
```

### 2. Update all import paths

Replace every occurrence of `"kraken-tui"` with `"tuvren-tui"` in your source files.

```diff
-import { Kraken, Box, Text } from "kraken-tui";
+import { Tuvren, Box, Text } from "tuvren-tui";

-import { jsx } from "kraken-tui/jsx-runtime";
+import { jsx } from "tuvren-tui/jsx-runtime";

-import { effect } from "kraken-tui/effect";
+import { effect } from "tuvren-tui/effect";
```

### 3. Update `tsconfig.json`

```diff
 {
   "compilerOptions": {
     "jsx": "react-jsx",
-    "jsxImportSource": "kraken-tui"
+    "jsxImportSource": "tuvren-tui"
   }
 }
```

### 4. Rename host facade and type references

```diff
-const app = Kraken.init();
+const app = Tuvren.init();

-} catch (err: unknown) {
-  if (err instanceof KrakenError) {
+} catch (err: unknown) {
+  if (err instanceof TuvrenError) {

-function handleEvent(event: KrakenEvent): void {
+function handleEvent(event: TuvrenEvent): void {

-type Handler = (event: KrakenEvent) => void;
+type Handler = (event: TuvrenEvent) => void;
```

If you re-exported `KrakenFragment` from your application code, rename it to `TuvrenFragment`.

### 5. Update `KRAKEN_LIB_PATH` usages

If you have scripts, `.env` files, or CI configuration that sets `KRAKEN_LIB_PATH` to point to the native library:

```diff
-KRAKEN_LIB_PATH=/path/to/libkraken_tui.so bun run app.ts
+TUVREN_LIB_PATH=/path/to/libtuvren_tui.so bun run app.ts
```

Update any shell scripts, CI environment variable configuration, and local `.env` files.

### 6. Update native library paths (if managing manually)

If you vendor or manually place the native shared library:

| Platform | Old filename | New filename |
|----------|-------------|-------------|
| Linux | `libkraken_tui.so` | `libtuvren_tui.so` |
| macOS | `libkraken_tui.dylib` | `libtuvren_tui.dylib` |
| Windows | `kraken_tui.dll` | `tuvren_tui.dll` |

Most users do not manage the native library manually — it resolves through the auxiliary scoped package installed by `bun add tuvren-tui`.

### 7. Update release asset references

If you download release assets directly (for example in a custom installer or CI cache):

```diff
-kraken-tui-v0.1.0-linux-x64.so
+tuvren-tui-v0.1.0-linux-x64.so

-kraken-tui-v0.1.0-darwin-arm64.dylib
+tuvren-tui-v0.1.0-darwin-arm64.dylib
```

The full pattern changes from `kraken-tui-<tag>-<platform>.<ext>` to `tuvren-tui-<tag>-<platform>.<ext>`.

---

## What Did Not Change

- The `tui_*` C ABI function prefix — no FFI-level changes
- Widget classes: `Box`, `Text`, `Input`, `TextArea`, `Select`, `ScrollBox`, `Table`, `List`, `Tabs`, `Overlay`, `TranscriptView`, `SplitPane`
- Host composites: `CommandPalette`, `TracePanel`, `StructuredLogView`, `CodeView`, `DiffView`
- All other API surface: `Theme`, `AnimProp`, `Easing`, `KeyCode`, `EventType`, `Modifier`, `NodeType`, `AccessibilityRole`, `createLoop`, `render`, `signal`, `computed`, `createDevSession`, etc.
- The imperative lifecycle model: `Tuvren.init()`, `setRoot()`, `readInput()`, `drainEvents()`, `render()`, `shutdown()`
- Flexbox layout semantics, FFI error codes, handle conventions, and event routing behavior

---

## Verification

After applying changes:

```bash
# TypeScript compiler check (should find no remaining kraken-tui references)
bunx tsc --noEmit

# Search for any remaining old names
grep -r "kraken" --include="*.ts" --include="*.tsx" --include="*.json" . \
  --exclude-dir=node_modules --exclude-dir=".git" \
  --exclude-dir=dist --exclude-dir=build \
  --exclude="*.lock" --exclude="*.lockb"
```

Any remaining `kraken` occurrences outside of historical documentation or changelog entries are migration gaps.

---

## Background

This rename is part of the Tuvren productization wave (Epic P). The project moved from the working name `kraken-tui` / `Kraken` to the public product name `tuvren-tui` / `Tuvren` as a pre-1.0 hard cut. Semantic versioning guarantees and long-lived compatibility aliases begin at public `v1.0 GA`. Pre-GA releases, including this rename, may include breaking changes without a deprecation window.

See [TechSpec ADR-T42](../TechSpec.md#adr-t42-public-product-and-package-naming-move-to-tuvren) for the decision record and [TechSpec ADR-T43](../TechSpec.md#adr-t43-one-public-package-sits-above-internal-scoped-native-packages) for the auxiliary native package distribution contract.

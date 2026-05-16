/**
 * Headless native-library load smoke test.
 *
 * Resolves the Cargo source build artifact, dlopen's it, calls
 * tui_init_headless / tui_shutdown, and exits 0 on success.
 *
 * Used by the cross-platform-smoke CI job for all native runner targets.
 *
 * Usage: bun run audit/load-smoke.ts
 */

import { resolveSourceBuildPath } from "../ts/src/resolver";
import { dlopen } from "bun:ffi";

const libPath = resolveSourceBuildPath();
// Intentionally minimal: only two symbols to verify the binary loads and can
// round-trip through FFI. Routing through ts/src/ffi.ts would validate all
// 100+ symbols and make the smoke depend on the full symbol surface.
const lib = dlopen(libPath, {
	tui_init_headless: { args: ["u16", "u16"], returns: "i32" },
	tui_shutdown: { args: [], returns: "i32" },
});

try {
	const init = lib.symbols.tui_init_headless(80, 24);
	if (init !== 0) throw new Error("tui_init_headless failed: " + init);

	const shutdown = lib.symbols.tui_shutdown();
	if (shutdown !== 0) throw new Error("tui_shutdown failed: " + shutdown);

	console.log("Native library load smoke: PASS");
} finally {
	lib.close();
}

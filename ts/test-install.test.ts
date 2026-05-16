/**
 * Install smoke tests — verify artifact resolver and diagnostics.
 *
 * These tests validate the cross-platform distribution UX (Epic P, ADR-T42, ADR-T43)
 * without requiring the native library to be loaded.
 *
 * Run:  bun test ts/test-install.test.ts
 */

import { describe, test, expect, afterEach } from "bun:test";
import { existsSync } from "fs";
import { join, normalize, resolve, sep } from "path";
import { resolveLibraryPath, resolveSourceBuildPath, getLibraryName } from "./src/resolver";
import { formatLoadError } from "./src/diagnostics";

// ── Library name mapping ────────────────────────────────────────────────────

describe("getLibraryName", () => {
	test("returns .dylib for darwin", () => {
		expect(getLibraryName("darwin")).toBe("libtuvren_tui.dylib");
	});

	test("returns .dll for win32", () => {
		expect(getLibraryName("win32")).toBe("tuvren_tui.dll");
	});

	test("returns .so for linux", () => {
		expect(getLibraryName("linux")).toBe("libtuvren_tui.so");
	});

	test("returns .so for unknown platforms", () => {
		expect(getLibraryName("freebsd")).toBe("libtuvren_tui.so");
	});
});

// ── Resolver ────────────────────────────────────────────────────────────────

describe("resolveLibraryPath", () => {
	const originalEnv = process.env.TUVREN_LIB_PATH;
	const sourceBuild = resolve(
		import.meta.dir,
		`../native/target/release/${getLibraryName(process.platform)}`,
	);

	afterEach(() => {
		if (originalEnv === undefined) {
			delete process.env.TUVREN_LIB_PATH;
		} else {
			process.env.TUVREN_LIB_PATH = originalEnv;
		}
	});

	test("resolves source build path in repo checkout", () => {
		delete process.env.TUVREN_LIB_PATH;
		// In a source checkout the resolver falls through to the Cargo build.
		const libPath = resolveLibraryPath();
		expect(normalize(libPath)).toBe(normalize(sourceBuild));
	});

	test("respects TUVREN_LIB_PATH env override", () => {
		// Point to the actual source build so it resolves (platform-aware)
		process.env.TUVREN_LIB_PATH = sourceBuild;
		const libPath = resolveLibraryPath();
		expect(libPath).toBe(sourceBuild);
	});

	test("falls through to source build when TUVREN_LIB_PATH points to nonexistent file", () => {
		process.env.TUVREN_LIB_PATH = join(sep, "nonexistent", "path", "libtuvren_tui.so");
		// Falls through to source build because the env path does not exist.
		// NOTE: this test also implicitly relies on @tuvren/* aux packages NOT being installed
		// in node_modules (they aren't on the registry yet). Once Epic Q publishes them, the
		// resolver will return the aux-package path instead of the source build, and this test
		// will need to be updated to mock resolveAuxPackage or to assert the aux-package path.
		const libPath = resolveLibraryPath();
		expect(normalize(libPath)).toBe(normalize(sourceBuild));
	});
});

// ── Source build path ───────────────────────────────────────────────────────

describe("resolveSourceBuildPath", () => {
	test("returns the local Cargo build artifact path", () => {
		const libPath = resolveSourceBuildPath();
		expect(existsSync(libPath)).toBe(true);
		expect(libPath).toContain(join("native", "target", "release"));
		expect(libPath).toContain("tuvren_tui");
	});
});

// ── Diagnostics ─────────────────────────────────────────────────────────────

describe("formatLoadError", () => {
	test("includes platform and architecture in error message", () => {
		const msg = formatLoadError("linux", "x64", ["/path/a", "/path/b"]);
		expect(msg).toContain("linux-x64");
	});

	test("includes all searched paths", () => {
		const paths = ["/first/path", "/second/path", "/third/path"];
		const msg = formatLoadError("darwin", "arm64", paths);
		for (const p of paths) {
			expect(msg).toContain(p);
		}
	});

	test("includes linux-specific remediation for linux platform", () => {
		const msg = formatLoadError("linux", "x64", []);
		expect(msg).toContain("glibc");
		expect(msg).toContain("apt install");
	});

	test("mentions musl is unsupported for linux", () => {
		const msg = formatLoadError("linux", "x64", []);
		expect(msg).toContain("musl");
	});

	test("includes darwin-specific remediation for darwin platform", () => {
		const msg = formatLoadError("darwin", "arm64", []);
		expect(msg).toContain("Apple Silicon");
	});

	test("includes windows-specific remediation for win32 platform", () => {
		const msg = formatLoadError("win32", "x64", []);
		expect(msg).toContain("Visual C++");
	});

	test("includes source build instruction only when repoCheckout is true", () => {
		const repoMsg = formatLoadError("linux", "x64", [], { repoCheckout: true });
		expect(repoMsg).toContain("cargo build --manifest-path native/Cargo.toml --release");
		const publishedMsg = formatLoadError("linux", "x64", []);
		expect(publishedMsg).not.toContain("cargo build");
	});

	test("always includes TUVREN_LIB_PATH override instruction", () => {
		const msg = formatLoadError("linux", "x64", []);
		expect(msg).toContain("TUVREN_LIB_PATH");
	});

	test("uses tuvren naming in error message", () => {
		const msg = formatLoadError("linux", "x64", []);
		expect(msg).toContain("tuvren-tui");
		expect(msg).not.toContain("kraken");
	});
});

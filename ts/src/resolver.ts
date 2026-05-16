/**
 * Native library resolver — platform detection and artifact search.
 *
 * Resolves the path to the tuvren-tui native shared library using a deterministic
 * search order per TechSpec §4.3 (ADR-T42, ADR-T43, PROD-P005):
 *
 *   1. TUVREN_LIB_PATH env override
 *   2. Auxiliary scoped native package: @tuvren/tuvren-tui-<platform>-<arch>
 *   3. Source build fallback (repo checkouts only — proven by workspace markers)
 *   4. Diagnostic error
 *
 * Repo-side verification entrypoints use resolveSourceBuildPath() to bypass the
 * full search order and always target the local Cargo build artifact.
 */

import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { formatLoadError } from "./diagnostics";

/** Map process.platform to the native library filename. */
function getLibraryName(platform: string): string {
	switch (platform) {
		case "darwin":
			return "libtuvren_tui.dylib";
		case "win32":
			return "tuvren_tui.dll";
		default:
			return "libtuvren_tui.so";
	}
}

/**
 * Map platform and arch to the auxiliary scoped native package name.
 * Returns undefined for unsupported platform/arch combinations.
 */
function getAuxPackageName(platform: string, arch: string): string | undefined {
	const key = `${platform}-${arch}`;
	const packageNames: Record<string, string> = {
		"linux-x64": "@tuvren/tuvren-tui-linux-x64",
		"linux-arm64": "@tuvren/tuvren-tui-linux-arm64",
		"darwin-arm64": "@tuvren/tuvren-tui-darwin-arm64",
		"darwin-x64": "@tuvren/tuvren-tui-darwin-x64",
		"win32-x64": "@tuvren/tuvren-tui-win32-x64",
	};
	return packageNames[key];
}

/**
 * Attempt to resolve the auxiliary scoped native package and derive the library path.
 *
 * Uses import.meta.resolve() to locate the package.json of the aux package, then
 * derives the library path relative to the package root. This approach is
 * package-manager-layout agnostic per TechSpec §4.3.
 *
 * Returns the library path on success, or undefined if the package is not installed.
 */
function resolveAuxPackage(packageName: string, libName: string): string | undefined {
	try {
		// Resolve the package.json of the aux package to find the package root.
		// fileURLToPath handles Win32 drive letters (new URL().pathname breaks on Windows).
		const packageJsonUrl = import.meta.resolve(`${packageName}/package.json`);
		const packageJsonPath = fileURLToPath(packageJsonUrl);
		const packageRoot = dirname(packageJsonPath);
		const libPath = resolve(packageRoot, libName);
		if (existsSync(libPath)) {
			return libPath;
		}
	} catch {
		// Package is not installed — this is the expected case for unsupported platforms.
	}
	return undefined;
}

/**
 * Detect whether the resolver is running from a checked-out Tuvren workspace.
 *
 * A workspace checkout is proven by the presence of native/Cargo.toml as a sibling
 * directory (packageRoot/../native/Cargo.toml). The package.json check is omitted —
 * it always exists when resolver.ts loads and provides no discrimination signal.
 *
 * This guard prevents ordinary published installs from probing native/target/release.
 */
function isRepoCheckout(packageRoot: string): boolean {
	const cargoToml = resolve(packageRoot, "..", "native", "Cargo.toml");
	return existsSync(cargoToml);
}

/**
 * Resolve the native library path synchronously.
 *
 * Search order (per TechSpec §4.3, PROD-P005):
 *   1. TUVREN_LIB_PATH env var (explicit override)
 *   2. Auxiliary scoped native package for the current platform and arch
 *   3. Source build in repo checkout only (native/target/release/<libName>)
 *   4. Throw with diagnostic error
 */
export function resolveLibraryPath(): string {
	const platform = process.platform;
	const arch = process.arch;
	const libName = getLibraryName(platform);
	const searchPaths: string[] = [];

	// Package root is the ts/ directory (parent of src/)
	const packageRoot = resolve(import.meta.dir, "..");

	// 1. Environment override
	const envPath = process.env.TUVREN_LIB_PATH;
	if (envPath !== undefined) {
		if (envPath && existsSync(envPath)) {
			return envPath;
		}
		searchPaths.push(
			envPath
				? `${envPath} (TUVREN_LIB_PATH — not found)`
				: "(TUVREN_LIB_PATH set to empty string — ignored)",
		);
	}

	// 2. Auxiliary scoped native package
	const auxPackageName = getAuxPackageName(platform, arch);
	if (auxPackageName) {
		const auxPath = resolveAuxPackage(auxPackageName, libName);
		if (auxPath) {
			return auxPath;
		}
		searchPaths.push(`${auxPackageName} (not installed or missing ${libName})`);
	} else {
		searchPaths.push(`(no auxiliary package available for ${platform}-${arch})`);
	}

	// 3. Source build fallback — repo checkouts only
	const repoCheckout = isRepoCheckout(packageRoot);
	if (repoCheckout) {
		const sourceBuildPath = resolve(packageRoot, "..", "native", "target", "release", libName);
		searchPaths.push(sourceBuildPath);
		if (existsSync(sourceBuildPath)) {
			return sourceBuildPath;
		}
	} else {
		searchPaths.push("(source build skipped — not a repo checkout)");
	}

	// 4. Failure with diagnostics
	throw new Error(formatLoadError(platform, arch, searchPaths, { repoCheckout }));
}

/**
 * Resolve the local source-built native library for repo-side verification.
 *
 * This intentionally bypasses TUVREN_LIB_PATH and the auxiliary package search
 * so tests and benchmarks in a source checkout always validate the freshly built
 * branch artifact under native/target/release/. Published consumer installs must
 * not use this path.
 */
export function resolveSourceBuildPath(): string {
	const libName = getLibraryName(process.platform);
	const sourceBuildPath = resolve(
		import.meta.dir,
		"..",
		"..",
		"native",
		"target",
		"release",
		libName,
	);

	if (existsSync(sourceBuildPath)) {
		return sourceBuildPath;
	}

	throw new Error(
		`Source build not found at ${sourceBuildPath}. Run: cargo build --manifest-path native/Cargo.toml --release`,
	);
}

// Re-export for testing
export { getLibraryName };

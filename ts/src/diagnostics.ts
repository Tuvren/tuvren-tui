/**
 * Load-failure diagnostics — actionable error messages for native library resolution.
 *
 * Provides platform-specific remediation steps when the native library cannot be found
 * or loaded. Part of Epic P (ADR-T42, ADR-T43).
 */

/**
 * Format a detailed error message when the native library cannot be resolved.
 *
 * Includes detected platform/arch, all searched paths, and platform-specific remediation.
 */
export function formatLoadError(
	platform: string,
	arch: string,
	searchPaths: string[],
): string {
	const lines: string[] = [
		`Failed to load tuvren-tui native library for ${platform}-${arch}.`,
		"",
		"Searched paths:",
		...searchPaths.map((p) => `  - ${p}`),
		"",
		"Remediation:",
	];

	if (platform === "linux") {
		lines.push(
			"  - Ensure glibc is installed: sudo apt install libc6-dev (Debian/Ubuntu)",
			"    or: sudo dnf install glibc-devel (Fedora/RHEL)",
			"  - Note: musl/Alpine Linux is not supported in this release.",
		);
	} else if (platform === "darwin") {
		lines.push(
			"  - Ensure you are running on a supported architecture (x64 or arm64).",
			"  - If on Apple Silicon, verify the binary matches your architecture.",
		);
	} else if (platform === "win32") {
		lines.push(
			"  - Ensure the Microsoft Visual C++ Redistributable is installed.",
			"  - Download from: https://aka.ms/vs/17/release/vc_redist.x64.exe",
		);
	}

	lines.push(
		"  - To build from source: cargo build --manifest-path native/Cargo.toml --release",
		"  - To override the library path: set TUVREN_LIB_PATH=/path/to/libtuvren_tui.{so,dylib,dll}",
		"  - To download a prebuilt binary: see the GitHub Releases page for your platform asset.",
	);

	return lines.join("\n");
}

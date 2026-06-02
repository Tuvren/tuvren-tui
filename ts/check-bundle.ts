/**
 * Bundle budget check (TASK-L6).
 *
 * Bundles the tuvren-tui TypeScript layer and verifies it stays under 100KB.
 * Per PRD §5 and ADR-T35 addendum: budget increased from 50KB to 75KB to
 * accommodate host composites; further increased to 100KB for framework
 * services (commands/keymaps, Effect, plugin slots) shipped in Epics R–T.
 *
 * Run:  bun run ts/check-bundle.ts
 */

import { rmSync } from "fs";

const BUDGET_BYTES = 100 * 1024; // 100KB

// Resolve paths relative to this script, not cwd
const scriptDir = import.meta.dir;

const result = await Bun.build({
	entrypoints: [`${scriptDir}/src/index.ts`],
	outdir: `${scriptDir}/dist`,
	target: "bun",
	minify: true,
	external: ["bun:ffi"],
});

if (!result.success) {
	console.error("Build failed:");
	for (const msg of result.logs) {
		console.error(msg);
	}
	process.exit(1);
}

const output = result.outputs[0]!;
const size = output.size;
const sizeKB = (size / 1024).toFixed(1);
const budgetKB = (BUDGET_BYTES / 1024).toFixed(0);
const pct = ((size / BUDGET_BYTES) * 100).toFixed(0);

if (size <= BUDGET_BYTES) {
	console.log(`✓ Bundle size: ${sizeKB}KB / ${budgetKB}KB (${pct}% of budget)`);
} else {
	console.error(`✗ Bundle size: ${sizeKB}KB exceeds ${budgetKB}KB budget`);
	process.exit(1);
}

// Cleanup dist
rmSync(`${scriptDir}/dist`, { recursive: true, force: true });

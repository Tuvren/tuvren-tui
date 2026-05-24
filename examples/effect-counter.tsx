/** @jsxImportSource ../ts/effect */

/**
 * Tuvren TUI — Effect Package Example
 *
 * Demonstrates the package-first `tuvren-tui/effect` authoring model:
 * JSX primitives, package-owned commands and keybindings, keyboard hooks, and
 * terminal-size state without routine imports from the root imperative surface.
 *
 * Usage:
 *   cargo build --manifest-path native/Cargo.toml --release
 *   bun run examples/effect-counter.tsx
 *
 * Controls:
 *   i        — Increment counter
 *   h        — Show help text
 *   q / Esc  — Quit
 */

import {
	Box,
	KeyCode,
	Text,
	computed,
	render,
	testRender,
	useCommand,
	useKeyboard,
	useKeybinding,
	useSignal,
	useTerminalSize,
	useTuvren,
} from "../ts/effect/index";

function App() {
	const runtime = useTuvren();
	const count = useSignal(0);
	const status = useSignal("Press i to increment, h for help, q or Esc to quit.");
	const lastKey = useSignal("none");
	const size = useTerminalSize();

	useCommand({
		id: "app.increment",
		title: "Increment counter",
		run: () => {
			count.value += 1;
			status.value = "Incremented via package-owned command.";
		},
	});
	useCommand({
		id: "app.help",
		title: "Show help",
		run: () => {
			status.value = "Keys: i increment, h help, q or Esc quit.";
		},
	});

	useKeybinding({ command: "app.increment", key: "i" });
	useKeybinding({ command: "app.help", key: "h" });

	useKeyboard((event) => {
		if (event.keyCode === KeyCode.Escape) {
			status.value = "Stopping package-owned loop...";
			runtime.stop();
			return;
		}

		if (event.codepoint == null || event.codepoint <= 0) {
			return;
		}

		const key = String.fromCodePoint(event.codepoint);
		lastKey.value = key;

		if (key === "q") {
			status.value = "Stopping package-owned loop...";
			runtime.stop();
		}
	});

	return (
		<Box width="100%" height="100%" padding={1} gap={1} flexDirection="column" border="rounded">
			<Text content="Tuvren + Effect Package" bold fg="#7dd3fc" height={1} />
			<Text
				content="Package-owned commands, keybindings, hooks, and JSX over the same native runtime."
				fg="#94a3b8"
				height={2}
			/>
			<Text content={computed(() => `Count: ${count.value}`)} fg="#fde68a" height={1} />
			<Text
				content={computed(() => `Terminal: ${size.value.width}x${size.value.height}`)}
				fg="#c4b5fd"
				height={1}
			/>
			<Text content={computed(() => `Last key: ${lastKey.value}`)} fg="#a7f3d0" height={1} />
			<Text content={status} fg="#e2e8f0" height={2} />
		</Box>
	);
}

if (process.env.TUVREN_AUDIT_RENDER_ONCE === "1") {
	const harness = testRender(() => <App />, { width: 84, height: 18 });
	try {
		harness.inject({
			type: "key",
			target: 0,
			keyCode: 0,
			modifiers: 0,
			codepoint: "h".codePointAt(0) ?? 0,
		});
		await harness.tick();
		harness.inject({
			type: "key",
			target: 0,
			keyCode: 0,
			modifiers: 0,
			codepoint: "i".codePointAt(0) ?? 0,
		});
		await harness.tick();
	} finally {
		harness.shutdown();
	}
} else {
	await render(() => <App />);
}

/**
 * Effect package tests (Epic S / ADR-T45).
 *
 * Validates both the high-level `tuvren-tui/effect` package surface and the
 * advanced low-level helpers that remain public for expert workflows.
 *
 * Run: bun test ts/test-effect.test.ts
 */

import { afterEach, describe, expect, test } from "bun:test";
import { Buffer } from "buffer";
import { Chunk, Effect, Stream } from "effect";
import { resolve } from "path";
import { Tuvren } from "./src/app";
import type { CommandContext } from "./src/commands";
import { CommandDispatcher, CommandRegistry } from "./src/commands";
import type { TuvrenEvent } from "./src/events";
import {
	Box as EffectBox,
	Text as EffectText,
	acquireHeadlessApp,
	computed,
	createCommandService,
	makeTuvrenScope,
	render as renderEffectApp,
	renderScoped,
	streamEvents,
	testRender,
	useCommand,
	useCommands,
	useKeyboard,
	useKeybinding,
	useSignal,
	useTerminalSize,
	useTuvren,
} from "./effect/index";
import { jsx } from "./effect/jsx-runtime";
import { ffi } from "./src/ffi";
import { KeyCode } from "./src/ffi/structs";
import { reconcileChildren } from "./src/jsx/reconciler";
import { KeymapRegistry } from "./src/keymap";
import { Theme } from "./src/theme";
import { Box as WidgetBox } from "./src/widgets/box";

const ORIGINAL_AUDIT_RENDER_ONCE = process.env.TUVREN_AUDIT_RENDER_ONCE;
const ORIGINAL_AUDIT_TICKS = process.env.TUVREN_AUDIT_TICKS;

afterEach(() => {
	if (ORIGINAL_AUDIT_RENDER_ONCE === undefined) {
		delete process.env.TUVREN_AUDIT_RENDER_ONCE;
	} else {
		process.env.TUVREN_AUDIT_RENDER_ONCE = ORIGINAL_AUDIT_RENDER_ONCE;
	}

	if (ORIGINAL_AUDIT_TICKS === undefined) {
		delete process.env.TUVREN_AUDIT_TICKS;
	} else {
		process.env.TUVREN_AUDIT_TICKS = ORIGINAL_AUDIT_TICKS;
	}
});

function getContent(handle: number): string {
	const len = ffi.tui_get_content_len(handle);
	if (len <= 0) {
		return "";
	}
	const buffer = Buffer.alloc(len + 1);
	const written = ffi.tui_get_content(handle, buffer, len + 1);
	return buffer.toString("utf-8", 0, written);
}

function getChildAt(parentHandle: number, index: number): number {
	return ffi.tui_get_child_at(parentHandle, index);
}

function makeCharKeyEvent(char: string): TuvrenEvent {
	return {
		type: "key",
		target: 0,
		keyCode: 0,
		modifiers: 0,
		codepoint: char.codePointAt(0) ?? 0,
	};
}

describe("Effect package surface", () => {
	test("package self-reference resolves tuvren-tui/effect and its JSX runtime", async () => {
		const module = await import("tuvren-tui/effect");
		const runtime = await import("tuvren-tui/effect/jsx-runtime");

		expect(typeof module.render).toBe("function");
		expect(typeof module.testRender).toBe("function");
		expect(typeof module.useCommand).toBe("function");
		expect(typeof runtime.jsx).toBe("function");
	});

	test("jsxImportSource tuvren-tui/effect compiles inside the package", async () => {
		const fixture = await import("./fixtures/effect-jsx-fixture.tsx");
		const tree = fixture.makeEffectFixtureTree();

		expect(tree.type).toBe("box");
		expect(tree.children).toHaveLength(1);
		expect(tree.children[0]?.type).toBe("text");
	});
});

describe("High-level Effect authoring", () => {
	test("testRender owns commands, keybindings, keyboard hooks, and terminal size state", async () => {
		let service: ReturnType<typeof useCommands> | undefined;

		function App() {
			const count = useSignal(0);
			const lastKey = useSignal("none");
			const size = useTerminalSize();

			service = useCommands();

			useCommand({
				id: "counter.increment",
				title: "Increment",
				run: () => {
					count.value += 1;
				},
			});
			useKeybinding({ command: "counter.increment", key: "i" });
			useKeyboard((event) => {
				if (event.codepoint != null && event.codepoint > 0) {
					lastKey.value = String.fromCodePoint(event.codepoint);
				}
			});

			return jsx(EffectBox, {
				width: "100%",
				height: "100%",
				children: [
					jsx(EffectText, {
						key: "count",
						content: computed(() => `Count: ${count.value}`),
					}),
					jsx(EffectText, {
						key: "size",
						content: computed(() => `Size: ${size.value.width}x${size.value.height}`),
					}),
					jsx(EffectText, {
						key: "last",
						content: computed(() => `Last key: ${lastKey.value}`),
					}),
				],
			});
		}

		const harness = testRender(() => jsx(App, {}), { width: 30, height: 10 });

		try {
			if (service === undefined) {
				throw new Error("Expected command service to be captured during render");
			}

			const rootHandle = harness.instance.widget.handle;
			expect(getContent(getChildAt(rootHandle, 0))).toBe("Count: 0");
			expect(getContent(getChildAt(rootHandle, 1))).toBe("Size: 30x10");
			expect(getContent(getChildAt(rootHandle, 2))).toBe("Last key: none");

			const ran = await Effect.runPromise(service.execute("counter.increment"));
			expect(ran).toBe(true);
			expect(getContent(getChildAt(rootHandle, 0))).toBe("Count: 1");

			harness.inject(makeCharKeyEvent("i"));
			await harness.tick();
			expect(getContent(getChildAt(rootHandle, 0))).toBe("Count: 2");
			expect(getContent(getChildAt(rootHandle, 2))).toBe("Last key: i");

			harness.inject({
				type: "resize",
				target: 0,
				width: 90,
				height: 20,
			});
			await harness.tick();
			expect(getContent(getChildAt(rootHandle, 1))).toBe("Size: 90x20");
		} finally {
			harness.shutdown();
		}
	});

	test("useCommands execute injects the package-owned app context", async () => {
		let service: ReturnType<typeof useCommands> | undefined;
		let seenApp: Tuvren | undefined;

		function App() {
			service = useCommands();

			useCommand({
				id: "capture.app",
				title: "Capture app",
				run: (context) => {
					seenApp = context.app;
				},
			});

			return jsx(EffectBox, {
				width: "100%",
				height: "100%",
			});
		}

		const harness = testRender(() => jsx(App, {}), { width: 24, height: 8 });

		try {
			if (service === undefined) {
				throw new Error("Expected command service to be captured during render");
			}

			const executed = await Effect.runPromise(
				service.execute("capture.app", { app: undefined }),
			);
			expect(executed).toBe(true);
			expect(seenApp).toBe(harness.app);
		} finally {
			harness.shutdown();
		}
	});

	test("reconcileChildren disposes component hook cleanups when keyed children become intrinsic", () => {
		function CommandChild() {
			useCommand({
				id: "component.bound",
				title: "Component bound",
				run: () => {},
			});

			return jsx(EffectText, {
				content: "component child",
			});
		}

		const harness = testRender(
			() =>
				jsx(EffectBox, {
					width: "100%",
					height: "100%",
					children: jsx(CommandChild, { key: "same" }),
				}),
			{ width: 24, height: 8 },
		);

		try {
			expect(harness.runtime.commands.list().map((command) => command.id)).toContain("component.bound");

			reconcileChildren(harness.instance, [
				jsx(EffectText, {
					key: "same",
					content: "plain child",
				}),
			]);

			expect(harness.runtime.commands.list().map((command) => command.id)).not.toContain("component.bound");
		} finally {
			harness.shutdown();
		}
	});

	test("reconcileChildren rejects keyed component replacement with a different intrinsic type", () => {
		function CommandChild() {
			useCommand({
				id: "component.text",
				title: "Component text",
				run: () => {},
			});

			return jsx(EffectText, {
				content: "component child",
			});
		}

		const harness = testRender(
			() =>
				jsx(EffectBox, {
					width: "100%",
					height: "100%",
					children: jsx(CommandChild, { key: "same" }),
				}),
			{ width: 24, height: 8 },
		);

		try {
			expect(() =>
				reconcileChildren(harness.instance, [
					jsx(EffectBox, {
						key: "same",
						width: "100%",
						height: "100%",
					}),
				]),
			).toThrow('Changing intrinsic widget type to "box"');
			expect(harness.runtime.commands.list().map((command) => command.id)).toContain("component.text");
		} finally {
			harness.shutdown();
		}
	});

	test("failed component output validation rolls back component hook side effects", () => {
		function StableChild() {
			useCommand({
				id: "component.old",
				title: "Component old",
				run: () => {},
			});

			return jsx(EffectText, {
				content: "stable child",
			});
		}

		function InvalidChild() {
			useCommand({
				id: "component.new",
				title: "Component new",
				run: () => {},
			});

			return jsx(EffectBox, {
				width: "100%",
				height: "100%",
			});
		}

		const harness = testRender(
			() =>
				jsx(EffectBox, {
					width: "100%",
					height: "100%",
					children: jsx(StableChild, { key: "same" }),
				}),
			{ width: 24, height: 8 },
		);

		try {
			expect(harness.runtime.commands.list().map((command) => command.id)).toEqual(["component.old"]);

			expect(() =>
				reconcileChildren(harness.instance, [
					jsx(InvalidChild, { key: "same" }),
				]),
			).toThrow('Changing component output widget type to "box"');

			expect(harness.runtime.commands.list().map((command) => command.id)).toEqual(["component.old"]);
		} finally {
			harness.shutdown();
		}
	});

	test("failed component resolution rolls back component hook side effects", () => {
		function StableChild() {
			useCommand({
				id: "component.old",
				title: "Component old",
				run: () => {},
			});

			return jsx(EffectText, {
				content: "stable child",
			});
		}

		function ThrowingChild() {
			useCommand({
				id: "component.new",
				title: "Component new",
				run: () => {},
			});

			throw new Error("component boom");
		}

		const harness = testRender(
			() =>
				jsx(EffectBox, {
					width: "100%",
					height: "100%",
					children: jsx(StableChild, { key: "same" }),
				}),
			{ width: 24, height: 8 },
		);

		try {
			expect(harness.runtime.commands.list().map((command) => command.id)).toEqual(["component.old"]);

			expect(() =>
				reconcileChildren(harness.instance, [
					jsx(ThrowingChild, { key: "same" }),
				]),
			).toThrow("component boom");

			expect(harness.runtime.commands.list().map((command) => command.id)).toEqual(["component.old"]);
		} finally {
			harness.shutdown();
		}
	});

	test("keyboard listeners dispatch against a stable snapshot", () => {
		const harness = testRender(
			() =>
				jsx(EffectBox, {
					width: "100%",
					height: "100%",
				}),
			{ width: 24, height: 8 },
		);

		try {
			const seen: string[] = [];
			let disposeSecond: (() => void) | undefined;

			harness.runtime.addKeyboardListener(() => {
				seen.push("first");
				disposeSecond?.();
			});

			const second = harness.runtime.addKeyboardListener(() => {
				seen.push("second");
			});
			disposeSecond = () => second.dispose();

			harness.runtime.notifyEvent(makeCharKeyEvent("x"));
			expect(seen).toEqual(["first", "second"]);
		} finally {
			harness.shutdown();
		}
	});

	test("render() boots the package-owned loop and exits when runtime.stop() is called", async () => {
		const app = Tuvren.initHeadless(40, 12);
		const originalDrainEvents = app.drainEvents.bind(app);
		const batches: TuvrenEvent[][] = [[makeCharKeyEvent("q")], []];
		let batchIndex = 0;
		let observedStop = false;

		app.drainEvents = () => batches[batchIndex++] ?? [];

		function App() {
			const runtime = useTuvren();
			const lastKey = useSignal("none");

			useKeyboard((event) => {
				if (event.codepoint != null && event.codepoint > 0) {
					lastKey.value = String.fromCodePoint(event.codepoint);
				}
				if (event.codepoint === "q".codePointAt(0)) {
					observedStop = true;
					runtime.stop();
				}
			});

			return jsx(EffectBox, {
				width: "100%",
				height: "100%",
				children: jsx(EffectText, {
					content: computed(() => `Loop key: ${lastKey.value}`),
				}),
			});
		}

		try {
			await renderEffectApp(() => jsx(App, {}), {
				app,
				idleTimeout: 0,
			});

			expect(observedStop).toBe(true);
			expect(app.getNodeCount()).toBe(0);
		} finally {
			app.drainEvents = originalDrainEvents;
			app.shutdown();
		}
	});
});

describe("Advanced declarative lifecycle", () => {
	test("renderScoped mounts and unmounts the core declarative tree", async () => {
		const app = Tuvren.initHeadless(48, 16);
		try {
			let nodeCountDuringScope = 0;

			await Effect.runPromise(
				Effect.scoped(
					Effect.gen(function* () {
						const instance = yield* renderScoped(
							jsx(EffectBox, {
								width: "100%",
								height: "100%",
								children: jsx(EffectText, {
									content: "Effect renderScoped",
									height: 1,
								}),
							}),
							app,
						);
						expect(instance.widget.handle).toBeGreaterThan(0);
						nodeCountDuringScope = app.getNodeCount();
					}),
				),
			);

			expect(nodeCountDuringScope).toBeGreaterThan(0);
			expect(app.getNodeCount()).toBe(0);
		} finally {
			app.shutdown();
		}
	});
});

describe("Scope lifecycle", () => {
	test("makeTuvrenScope disposes widgets, themes, loops, and subscriptions deterministically", async () => {
		const app = Tuvren.initHeadless(80, 24);
		try {
			let widget: WidgetBox | undefined;
			let theme: Theme | undefined;
			let loopStops = 0;
			let subscriptionDisposals = 0;

			await Effect.runPromise(
				Effect.scoped(
					Effect.gen(function* () {
						const scope = yield* makeTuvrenScope(app);
						widget = yield* scope.manageWidget(new WidgetBox(), { destroy: "self" });
						theme = yield* scope.manageTheme(Theme.create());
						yield* scope.manageLoop({
							start: async () => {},
							stop: () => {
								loopStops += 1;
							},
						});
						yield* scope.manageSubscription({
							dispose: () => {
								subscriptionDisposals += 1;
							},
						});
					}),
				),
			);

			if (widget === undefined || theme === undefined) {
				throw new Error("Expected widget and theme to be initialized");
			}

			expect(() => widget.childCount()).toThrow();
			expect(() => theme.setForeground("red")).toThrow();
			expect(loopStops).toBe(1);
			expect(subscriptionDisposals).toBe(1);
		} finally {
			app.shutdown();
		}
	});

	test("cleanup failures surface through Effect runtime failure", async () => {
		const app = Tuvren.initHeadless(40, 12);
		try {
			await expect(
				Effect.runPromise(
					Effect.scoped(
						Effect.gen(function* () {
							const scope = yield* makeTuvrenScope(app);
							yield* scope.addFinalizer(() => {
								throw new Error("cleanup boom");
							});
						}),
					),
				),
			).rejects.toThrow("cleanup boom");
		} finally {
			app.shutdown();
		}
	});

	test("acquireHeadlessApp manages app shutdown through scope", async () => {
		let app: Tuvren | undefined;

		await Effect.runPromise(
			Effect.scoped(
				Effect.gen(function* () {
					const managedApp = yield* acquireHeadlessApp(32, 10);
					app = managedApp;
					const size = managedApp.getTerminalSize();
					expect(size.width).toBe(32);
					expect(size.height).toBe(10);
				}),
			),
		);

		if (app === undefined) {
			throw new Error("Expected app to be initialized");
		}

		expect(() => new WidgetBox()).toThrow();
	});
});

describe("Event streams", () => {
	test("streamEvents emits filtered events through the runner contract", async () => {
		process.env.TUVREN_AUDIT_RENDER_ONCE = "1";
		process.env.TUVREN_AUDIT_TICKS = "3";

		const app = Tuvren.initHeadless(80, 24);
		const root = new WidgetBox();
		app.setRoot(root);

		const originalDrainEvents = app.drainEvents.bind(app);
		const keyEvent = makeCharKeyEvent("q");
		const resizeEvent: TuvrenEvent = { type: "resize", target: 0, width: 80, height: 24 };
		const focusEvent: TuvrenEvent = { type: "focus", target: 0, fromHandle: 1, toHandle: 2 };
		const batches: TuvrenEvent[][] = [
			[keyEvent, resizeEvent],
			[focusEvent],
			[],
		];
		let batchIndex = 0;

		app.drainEvents = () => batches[batchIndex++] ?? [];

		try {
			const collected = await Effect.runPromise(
				Stream.runCollect(
					streamEvents({
						app,
						include: ["key", "focus"],
					}),
				),
			);

			expect(Chunk.toReadonlyArray(collected)).toEqual([keyEvent, focusEvent]);
		} finally {
			app.drainEvents = originalDrainEvents;
			app.shutdown();
		}
	});

	test("streamEvents fails when command dispatch fails inside the runner", async () => {
		process.env.TUVREN_AUDIT_RENDER_ONCE = "1";
		process.env.TUVREN_AUDIT_TICKS = "2";

		const app = Tuvren.initHeadless(80, 24);
		const root = new WidgetBox();
		app.setRoot(root);

		const registry = new CommandRegistry();
		const keymaps = new KeymapRegistry();
		registry.register({
			id: "explode",
			title: "Explode",
			run: () => {
				throw new Error("dispatch boom");
			},
		});
		keymaps.register({ command: "explode", key: "x" });
		const dispatcher = new CommandDispatcher(registry, keymaps, app);

		const originalDrainEvents = app.drainEvents.bind(app);
		const batches: TuvrenEvent[][] = [[makeCharKeyEvent("x")], []];
		let batchIndex = 0;
		app.drainEvents = () => batches[batchIndex++] ?? [];

		try {
			await expect(
				Effect.runPromise(
					Stream.runCollect(
						streamEvents({
							app,
							commandDispatcher: dispatcher,
						}),
					),
				),
			).rejects.toThrow("dispatch boom");
		} finally {
			app.drainEvents = originalDrainEvents;
			app.shutdown();
		}
	});
});

describe("Effect example", () => {
	test("effect-counter example completes in audit mode", async () => {
		process.env.TUVREN_AUDIT_RENDER_ONCE = "1";
		process.env.TUVREN_AUDIT_TICKS = "2";

		const examplePath = resolve(import.meta.dir, "../examples/effect-counter.tsx");
		await import(`${examplePath}?test=${Date.now()}-${Math.random()}`);
	});
});

describe("Command service", () => {
	test("execute defaults the command source to programmatic", async () => {
		const registry = new CommandRegistry();
		let source: CommandContext["source"] | undefined;

		registry.register({
			id: "capture-source",
			title: "Capture Source",
			run: (context) => {
				source = context.source;
			},
		});

		const service = createCommandService({ registry });
		const result = await Effect.runPromise(service.execute("capture-source"));

		expect(result).toBe(true);
		expect(source).toBe("programmatic");
	});

	test("dispatch routes a key event through the command dispatcher", async () => {
		const app = Tuvren.initHeadless(80, 24);
		const root = new WidgetBox();
		app.setRoot(root);

		try {
			const registry = new CommandRegistry();
			const keymaps = new KeymapRegistry();
			let runs = 0;

			registry.register({
				id: "run.q",
				title: "Run Q",
				run: () => {
					runs += 1;
				},
			});
			keymaps.register({ command: "run.q", key: "q" });

			const dispatcher = new CommandDispatcher(registry, keymaps, app);
			const service = createCommandService({ registry, dispatcher });

			await Effect.runPromise(service.dispatch(makeCharKeyEvent("q")));
			expect(runs).toBe(1);
		} finally {
			app.shutdown();
		}
	});

	test("dispatch surfaces command failures through Effect", async () => {
		const app = Tuvren.initHeadless(80, 24);
		const root = new WidgetBox();
		app.setRoot(root);

		try {
			const registry = new CommandRegistry();
			const keymaps = new KeymapRegistry();

			registry.register({
				id: "fail.q",
				title: "Fail Q",
				run: () => {
					throw new Error("command boom");
				},
			});
			keymaps.register({ command: "fail.q", key: "q" });

			const dispatcher = new CommandDispatcher(registry, keymaps, app);
			const service = createCommandService({ registry, dispatcher });

			await expect(
				Effect.runPromise(service.dispatch(makeCharKeyEvent("q"))),
			).rejects.toThrow("command boom");
		} finally {
			app.shutdown();
		}
	});
});

import { dispatchToJsxHandlers } from "../loop";
import { Tuvren } from "../app";
import type { RunOptions } from "../app";
import type { TuvrenEvent } from "../events";
import { render as mountTree, unmount, type RenderMountOptions } from "../jsx/reconciler";
import type { Instance, VNode } from "../jsx/types";
import {
	EFFECT_RUNTIME_CONTEXT,
	createEffectRuntime,
	type TuvrenEffectRuntime,
} from "./runtime";

export interface EffectRenderOptions extends Omit<RunOptions, "commandDispatcher" | "onEvent"> {
	app?: Tuvren;
	onEvent?: (event: TuvrenEvent, runtime: TuvrenEffectRuntime) => void;
}

export interface EffectTestRenderOptions {
	width?: number;
	height?: number;
}

export interface EffectTestHarness {
	readonly app: Tuvren;
	readonly runtime: TuvrenEffectRuntime;
	readonly instance: Instance;
	inject(event: TuvrenEvent): void;
	tick(): Promise<void>;
	shutdown(): void;
}

export async function render(
	root: () => VNode,
	options: EffectRenderOptions = {},
): Promise<void> {
	const app = options.app ?? Tuvren.init();
	const ownsApp = options.app == null;
	const runtime = createEffectRuntime(app);
	const contextOptions = makeContextOptions(runtime);
	let instance: Instance | null = null;

	try {
		instance = mountTree(root(), app, contextOptions);
		app.render();
		await app.run({
			debugOverlay: options.debugOverlay,
			disableJsxDispatch: options.disableJsxDispatch,
			fps: options.fps,
			idleTimeout: options.idleTimeout,
			mode: options.mode,
			onTick: options.onTick,
			commandDispatcher: runtime.dispatcher,
			onEvent: (event) => {
				runtime.notifyEvent(event);
				options.onEvent?.(event, runtime);
			},
		});
	} finally {
		if (instance != null) {
			unmount(instance);
		}
		if (ownsApp) {
			app.shutdown();
		}
	}
}

export function testRender(
	root: () => VNode,
	options: EffectTestRenderOptions = {},
): EffectTestHarness {
	const app = Tuvren.initHeadless(options.width ?? 80, options.height ?? 24);
	const runtime = createEffectRuntime(app);
	let instance: Instance;
	const queuedEvents: TuvrenEvent[] = [];
	let closed = false;

	try {
		instance = mountTree(root(), app, makeContextOptions(runtime));
		app.render();
	} catch (cause: unknown) {
		app.shutdown();
		throw cause;
	}

	return {
		app,
		runtime,
		instance,
		inject: (event: TuvrenEvent) => {
			queuedEvents.push(event);
		},
		tick: async () => {
			if (closed) {
				throw new Error("Effect test harness is already shut down");
			}

			const events = queuedEvents.splice(0);
			for (const event of events) {
				runtime.notifyEvent(event);
				dispatchToJsxHandlers(event);
				await runtime.dispatcher.dispatch(event);
			}

			app.render();
		},
		shutdown: () => {
			if (closed) {
				return;
			}
			closed = true;
			unmount(instance);
			app.shutdown();
		},
	};
}

function makeContextOptions(runtime: TuvrenEffectRuntime): RenderMountOptions {
	return {
		contexts: new Map([[EFFECT_RUNTIME_CONTEXT, runtime]]),
	};
}

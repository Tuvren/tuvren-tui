import type {
	ComponentConstHookState,
	ComponentEffectHookState,
	ComponentFrame,
	ComponentFunction,
	Instance,
	VNode,
} from "./types";

const EMPTY_CONTEXTS: ReadonlyMap<symbol, unknown> = new Map();

interface ActiveComponentRender {
	frame: ComponentFrame;
	hookIndex: number;
	contexts: ReadonlyMap<symbol, unknown>;
}

let currentRender: ActiveComponentRender | null = null;

export function resolveInstanceContexts(
	parentInstance: Instance | null,
	contexts?: ReadonlyMap<symbol, unknown>,
): ReadonlyMap<symbol, unknown> {
	if (contexts != null) {
		return contexts;
	}
	if (parentInstance != null) {
		return parentInstance.contexts;
	}
	return EMPTY_CONTEXTS;
}

export function createComponentFrame(vnode: VNode): ComponentFrame {
	return {
		fn: vnode.type as ComponentFunction,
		vnode,
		hooks: [],
	};
}

export function runComponentFrame(
	frame: ComponentFrame,
	contexts: ReadonlyMap<symbol, unknown>,
	render: () => VNode,
): VNode {
	const previous = currentRender;
	currentRender = {
		frame,
		hookIndex: 0,
		contexts,
	};

	try {
		const vnode = render();
		cleanupUnusedHooks(frame, currentRender.hookIndex);
		return vnode;
	} finally {
		currentRender = previous;
	}
}

export function useComponentConst<T>(create: () => T): T {
	const render = requireCurrentRender("useComponentConst");
	const hook = render.frame.hooks[render.hookIndex] as ComponentConstHookState<T> | undefined;
	render.hookIndex += 1;

	if (hook == null) {
		const value = create();
		render.frame.hooks.push({
			kind: "const",
			value,
		});
		return value;
	}

	if (hook.kind !== "const") {
		throw new Error("Hook order mismatch: expected const hook");
	}

	return hook.value;
}

export function useComponentEffect(
	setup: () => void | (() => void),
	deps?: readonly unknown[],
): void {
	const render = requireCurrentRender("useComponentEffect");
	const currentIndex = render.hookIndex;
	const hook = render.frame.hooks[currentIndex] as ComponentEffectHookState | undefined;
	render.hookIndex += 1;

	if (hook == null) {
		render.frame.hooks.push({
			kind: "effect",
			deps,
			cleanup: toCleanup(setup()),
		});
		return;
	}

	if (hook.kind !== "effect") {
		throw new Error("Hook order mismatch: expected effect hook");
	}

	if (!depsEqual(hook.deps, deps)) {
		hook.cleanup?.();
		hook.deps = deps;
		hook.cleanup = toCleanup(setup());
	}
}

export function readComponentContext<T>(token: symbol, label: string): T {
	const render = requireCurrentRender(label);
	if (!render.contexts.has(token)) {
		throw new Error(`${label} must be used within a matching package render context`);
	}
	return render.contexts.get(token) as T;
}

export function disposeComponentFrames(instance: Instance): void {
	if (instance.componentFrames == null) {
		return;
	}

	for (const frame of instance.componentFrames) {
		disposeComponentFrame(frame);
	}
	instance.componentFrames.length = 0;
}

export function disposeComponentFramesFrom(instance: Instance, index: number): void {
	if (instance.componentFrames == null || index >= instance.componentFrames.length) {
		return;
	}

	const removed = instance.componentFrames.splice(index);
	for (const frame of removed) {
		disposeComponentFrame(frame);
	}
}

export function disposeComponentFrame(frame: ComponentFrame): void {
	for (const hook of frame.hooks) {
		if (hook.kind === "effect") {
			hook.cleanup?.();
			hook.cleanup = undefined;
		}
	}
	frame.hooks.length = 0;
}

function cleanupUnusedHooks(frame: ComponentFrame, nextIndex: number): void {
	while (frame.hooks.length > nextIndex) {
		const removed = frame.hooks.pop();
		if (removed != null && removed.kind === "effect") {
			removed.cleanup?.();
		}
	}
}

function depsEqual(
	left: readonly unknown[] | undefined,
	right: readonly unknown[] | undefined,
): boolean {
	if (left === right) {
		return true;
	}
	if (left == null || right == null || left.length !== right.length) {
		return false;
	}
	for (let index = 0; index < left.length; index += 1) {
		if (!Object.is(left[index], right[index])) {
			return false;
		}
	}
	return true;
}

function toCleanup(result: void | (() => void)): (() => void) | undefined {
	if (typeof result === "function") {
		return result;
	}
	return undefined;
}

function requireCurrentRender(label: string): ActiveComponentRender {
	if (currentRender == null) {
		throw new Error(`${label} can only be called while rendering a component`);
	}
	return currentRender;
}

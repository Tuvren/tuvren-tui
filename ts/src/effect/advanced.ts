/**
 * Optional Effect integration for Tuvren TUI (ADR-T45).
 *
 * These APIs expose low-level Effect-native lifecycle and runner helpers over
 * the existing Tuvren runtime. They remain public as advanced escape hatches
 * even as the package-level `tuvren-tui/effect` surface grows into the primary
 * authoring path for Effect applications.
 */

import { Effect, Scope, Stream } from "effect";
import { Tuvren } from "../app";
import type { CommandContext, CommandDispatcher, CommandRegistry, Disposable } from "../commands";
import type { TuvrenEvent, TuvrenEventType } from "../events";
import type { Instance, VNode } from "../jsx/types";
import { render, unmount } from "../jsx/reconciler";
import { createLoop, type Loop, type LoopOptions } from "../loop";
import { DARK_THEME, LIGHT_THEME, type Theme } from "../theme";
import type { Widget } from "../widget";

type TuvrenCleanupResult = void | PromiseLike<void> | Effect.Effect<unknown, unknown, never>;

export type TuvrenFinalizer = () => TuvrenCleanupResult;

export interface ManagedWidgetOptions {
	destroy?: "self" | "subtree";
}

export interface TuvrenEffectScopeOptions {
	shutdownApp?: boolean;
}

export interface TuvrenEffectScope {
	readonly app: Tuvren;
	addFinalizer(finalizer: TuvrenFinalizer): Effect.Effect<void>;
	manageDisposable<T extends Disposable>(disposable: T): Effect.Effect<T>;
	manageInstance<T extends Instance>(instance: T): Effect.Effect<T>;
	manageLoop<T extends Loop>(loop: T): Effect.Effect<T>;
	manageSubscription<T extends Disposable>(subscription: T): Effect.Effect<T>;
	manageTheme<T extends Theme>(theme: T): Effect.Effect<T>;
	manageWidget<T extends Widget>(widget: T, options?: ManagedWidgetOptions): Effect.Effect<T>;
	render(element: VNode): Effect.Effect<Instance, TuvrenEffectError>;
}

export interface EffectEventStreamOptions extends Omit<
	LoopOptions,
	"app" | "onEvent" | "onTick"
> {
	app: Tuvren;
	include?: readonly TuvrenEventType[];
}

export interface EffectCommandOptions {
	registry: CommandRegistry;
}

export interface EffectCommandService {
	execute(id: string, context?: Partial<CommandContext>): Effect.Effect<boolean, TuvrenEffectError>;
}

export interface DispatchingEffectCommandService extends EffectCommandService {
	dispatch(event: TuvrenEvent): Effect.Effect<void, TuvrenEffectError>;
}

export class TuvrenEffectError extends Error {
	readonly operation: string;
	override readonly cause: unknown;

	constructor(operation: string, cause: unknown) {
		super(`${operation} failed: ${formatUnknownCause(cause)}`, { cause });
		this.name = "TuvrenEffectError";
		this.operation = operation;
		this.cause = cause;
	}
}

export function acquireApp(
	createApp: () => Tuvren,
): Effect.Effect<Tuvren, TuvrenEffectError, Scope.Scope> {
	return Effect.acquireRelease(
		trySync("effect.acquireApp", createApp),
		(app) => trySync("Tuvren.shutdown", () => app.shutdown()).pipe(Effect.orDie),
	);
}

export function acquireHeadlessApp(
	width: number,
	height: number,
): Effect.Effect<Tuvren, TuvrenEffectError, Scope.Scope> {
	return acquireApp(() => Tuvren.initHeadless(width, height));
}

export function renderScoped(
	element: VNode,
	app: Tuvren,
): Effect.Effect<Instance, TuvrenEffectError, Scope.Scope> {
	return Effect.acquireRelease(
		trySync("effect.renderScoped", () => render(element, app)),
		(instance) => trySync("effect.renderScoped.unmount", () => unmount(instance)).pipe(
			Effect.orDie,
		),
	);
}

export function makeTuvrenScope(
	app: Tuvren,
	options: TuvrenEffectScopeOptions = {},
): Effect.Effect<TuvrenEffectScope, never, Scope.Scope> {
	return Effect.gen(function* () {
		const currentScope = yield* Effect.scope;

		if (options.shutdownApp === true) {
			yield* Scope.addFinalizer(
				currentScope,
				trySync("Tuvren.shutdown", () => app.shutdown()).pipe(Effect.orDie),
			);
		}

		const registerFinalizer = (operation: string, finalizer: TuvrenFinalizer): Effect.Effect<void> =>
			Scope.addFinalizer(
				currentScope,
				finalizerEffect(operation, finalizer).pipe(Effect.orDie),
			);

		const manageResource = <T>(
			resource: T,
			operation: string,
			finalizer: TuvrenFinalizer,
		): Effect.Effect<T> =>
			registerFinalizer(operation, finalizer).pipe(Effect.map(() => resource));

		return {
			app,
			addFinalizer: (finalizer) => registerFinalizer("effect.addFinalizer", finalizer),
			manageDisposable: <T extends Disposable>(disposable: T) =>
				manageResource(
					disposable,
					"effect.manageDisposable",
					() => disposable.dispose(),
				),
			manageInstance: <T extends Instance>(instance: T) =>
				manageResource(
					instance,
					"effect.manageInstance",
					() => unmount(instance),
				),
			manageLoop: <T extends Loop>(loop: T) =>
				manageResource(
					loop,
					"effect.manageLoop",
					() => loop.stop(),
				),
			manageSubscription: <T extends Disposable>(subscription: T) =>
				manageResource(
					subscription,
					"effect.manageSubscription",
					() => subscription.dispose(),
				),
			manageTheme: <T extends Theme>(theme: T) =>
				isBuiltInThemeHandle(theme.handle)
					? Effect.succeed(theme)
					: manageResource(
						theme,
						"effect.manageTheme",
						() => theme.destroy(),
					),
			manageWidget: <T extends Widget>(widget: T, widgetOptions: ManagedWidgetOptions = {}) =>
				manageResource(
					widget,
					"effect.manageWidget",
					() => {
						if (widgetOptions.destroy === "self") {
							widget.destroy();
							return;
						}
						widget.destroySubtree();
					},
				),
			render: (element) =>
				trySync("effect.render", () => render(element, app)).pipe(
					Effect.flatMap((instance) =>
						manageResource(
							instance,
							"effect.render.unmount",
							() => unmount(instance),
						),
					),
				),
		};
	});
}

export function streamEvents(
	options: EffectEventStreamOptions,
): Stream.Stream<TuvrenEvent, TuvrenEffectError> {
	const include = options.include == null ? undefined : new Set(options.include);

	return Stream.asyncPush<TuvrenEvent, TuvrenEffectError>((emit) =>
		Effect.acquireRelease(
			Effect.sync(() => {
				let closed = false;
				let loop: Loop | undefined;

				loop = createLoop({
					app: options.app,
					commandDispatcher: options.commandDispatcher,
					disableJsxDispatch: options.disableJsxDispatch,
					fps: options.fps,
					idleTimeout: options.idleTimeout,
					mode: options.mode,
					onEvent: (event) => {
						if (closed) return;
						if (!shouldIncludeEvent(include, event.type)) return;
						if (!emit.single(event)) {
							closed = true;
							loop?.stop();
						}
					},
				});

				void loop.start()
					.then(() => {
						if (closed) return;
						closed = true;
						emit.end();
					})
					.catch((cause: unknown) => {
						if (closed) return;
						closed = true;
						emit.fail(new TuvrenEffectError("effect.streamEvents", cause));
					});

				return loop;
			}),
			(loop) =>
				Effect.sync(() => {
					loop.stop();
				}),
		),
	);
}

export function createCommandService(
	options: EffectCommandOptions,
): EffectCommandService;
export function createCommandService(
	options: EffectCommandOptions & { dispatcher: CommandDispatcher },
): DispatchingEffectCommandService;
export function createCommandService(
	options: EffectCommandOptions & { dispatcher?: CommandDispatcher },
): EffectCommandService | DispatchingEffectCommandService {
	const execute = (
		id: string,
		context: Partial<CommandContext> = {},
	): Effect.Effect<boolean, TuvrenEffectError> =>
		tryPromise("effect.commands.execute", () =>
			options.registry.execute(id, {
				...context,
				source: context.source ?? "programmatic",
			}),
		);

	if (options.dispatcher == null) {
		return { execute };
	}

	const dispatcher = options.dispatcher;

	return {
		execute,
		dispatch: (event: TuvrenEvent) =>
			tryPromise("effect.commands.dispatch", () => dispatcher.dispatch(event)),
	};
}

function finalizerEffect(
	operation: string,
	finalizer: TuvrenFinalizer,
): Effect.Effect<void, TuvrenEffectError> {
	return trySync(operation, finalizer).pipe(
		Effect.flatMap((result) => {
			if (Effect.isEffect(result)) {
				return result.pipe(
					Effect.asVoid,
					Effect.mapError((cause: unknown) => new TuvrenEffectError(operation, cause)),
				);
			}

			if (isPromiseLike(result)) {
				return tryPromise(operation, () => result);
			}

			return Effect.succeed(undefined);
		}),
	);
}

function isBuiltInThemeHandle(handle: number): boolean {
	return handle === DARK_THEME || handle === LIGHT_THEME;
}

function isPromiseLike(value: unknown): value is PromiseLike<void> {
	if (typeof value !== "object" || value == null) {
		return false;
	}
	return typeof (value as { then?: unknown }).then === "function";
}

function shouldIncludeEvent(
	include: ReadonlySet<TuvrenEventType> | undefined,
	eventType: TuvrenEventType,
): boolean {
	return include == null || include.has(eventType);
}

function tryPromise<A>(
	operation: string,
	run: () => PromiseLike<A>,
): Effect.Effect<A, TuvrenEffectError> {
	return Effect.tryPromise({
		try: () => run(),
		catch: (cause: unknown) => new TuvrenEffectError(operation, cause),
	});
}

function trySync<A>(
	operation: string,
	run: () => A,
): Effect.Effect<A, TuvrenEffectError> {
	return Effect.try({
		try: () => run(),
		catch: (cause: unknown) => new TuvrenEffectError(operation, cause),
	});
}

function formatUnknownCause(cause: unknown): string {
	if (cause instanceof Error) {
		return cause.message;
	}
	try {
		return String(cause);
	} catch {
		return "unknown cause";
	}
}

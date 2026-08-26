import type * as Effect from "effect/Effect";
import type * as Scope from "effect/Scope";
import type * as TestClock from "effect/TestClock";
import type {
  ComponentId,
  TerminalCapabilities,
  TuvrenError,
  View,
} from "./shared";

export interface SemanticMatch {
  readonly role: string;
  readonly name?: string | RegExp;
  readonly description?: string | RegExp;
  readonly state?: Readonly<Record<string, boolean | string | number>>;
}

export interface SemanticElement {
  readonly id: ComponentId;
  readonly role: string;
  readonly name?: string;
  readonly description?: string;
  readonly value?: string | number;
}

export interface TestDriver {
  key(key: string): Effect.Effect<void, TuvrenError>;
  type(text: string): Effect.Effect<void, TuvrenError>;
  paste(text: string): Effect.Effect<void, TuvrenError>;
  pointerMove(x: number, y: number): Effect.Effect<void, TuvrenError>;
  click(x: number, y: number): Effect.Effect<void, TuvrenError>;
  drag(
    from: readonly [number, number],
    to: readonly [number, number],
  ): Effect.Effect<void, TuvrenError>;
  scroll(deltaRows: number): Effect.Effect<void, TuvrenError>;
  resize(width: number, height: number): Effect.Effect<void, TuvrenError>;
  rawEvent(
    event: Readonly<Record<string, unknown>>,
  ): Effect.Effect<void, TuvrenError>;
  advanceTime(milliseconds: number): Effect.Effect<void>;
}

export interface TestHarness {
  readonly driver: TestDriver;
  readonly testClock: TestClock.TestClock;
  getByRole(
    role: string,
    options?: Omit<SemanticMatch, "role">,
  ): Effect.Effect<SemanticElement, TuvrenError>;
  queryByRole(
    role: string,
    options?: Omit<SemanticMatch, "role">,
  ): Effect.Effect<SemanticElement | undefined>;
  waitForVisualIdle(): Effect.Effect<void, TuvrenError>;
  snapshot(): Effect.Effect<unknown, TuvrenError>;
  saveTrace(path: string): Effect.Effect<void, TuvrenError>;
}

export interface TestRenderOptions {
  readonly width?: number;
  readonly height?: number;
  readonly terminal?: Partial<TerminalCapabilities>;
  readonly automaticTraceOnFailure?: boolean;
}

export function testRender(
  view: View,
  options?: TestRenderOptions,
): Effect.Effect<TestHarness, TuvrenError, Scope.Scope>;

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
  readonly states: Readonly<Record<string, boolean | string | number>>;
  readonly children: readonly ComponentId[];
}

export interface DiagnosticSnapshot {
  readonly schemaVersion: string;
  readonly snapshotId: string;
  readonly contextId: string;
  readonly transactionId: string;
  readonly renderRequestId: string;
  readonly surface: Readonly<{
    width: number;
    height: number;
    cells: readonly Readonly<{
      x: number;
      y: number;
      grapheme: string;
      width: number;
      continuation: boolean;
      style: Readonly<Record<string, unknown>>;
    }>[];
    cursor?: Readonly<{ x: number; y: number; visible: boolean }> | null;
  }>;
  readonly semanticTree: readonly SemanticElement[];
  readonly issues?: readonly Readonly<{
    code: string;
    category: string;
    operation: string;
    component?: string;
    message: string;
    remediation: string;
  }>[];
}

export interface DiagnosticTrace {
  readonly schemaVersion: string;
  readonly traceId: string;
  readonly createdAt: string;
  readonly records: readonly Readonly<{
    sequence: string;
    kind: string;
    timestampNanos: string;
  }>[];
  readonly snapshots: readonly DiagnosticSnapshot[];
  readonly wrapCount: number;
}

export interface FailureTrace {
  readonly error: TuvrenError;
  readonly trace: DiagnosticTrace;
  readonly lastSnapshot: DiagnosticSnapshot;
}

export interface LeakReport {
  readonly clean: boolean;
  readonly liveContexts: number;
  readonly liveNodes: number;
  readonly pendingRequests: number;
  readonly retainedBytes: number;
  readonly details: readonly string[];
}

export type SyntheticInput =
  | { readonly type: "key"; readonly key: string }
  | { readonly type: "text"; readonly text: string }
  | { readonly type: "paste"; readonly text: string }
  | { readonly type: "pointer-move"; readonly x: number; readonly y: number }
  | {
      readonly type: "pointer-button";
      readonly x: number;
      readonly y: number;
      readonly button: number;
      readonly pressed: boolean;
    }
  | { readonly type: "wheel"; readonly deltaRows: number }
  | {
      readonly type: "resize";
      readonly width: number;
      readonly height: number;
    };

export interface TestDriver {
  push(event: SyntheticInput): Effect.Effect<void, TuvrenError>;
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
  snapshot(): Effect.Effect<DiagnosticSnapshot, TuvrenError>;
  trace(): Effect.Effect<DiagnosticTrace, TuvrenError>;
  replay(
    input: string | DiagnosticTrace,
  ): Effect.Effect<DiagnosticSnapshot, TuvrenError>;
  failureTrace(): Effect.Effect<FailureTrace | undefined>;
  saveTrace(path: string): Effect.Effect<void, TuvrenError>;
  checkLeaks(): Effect.Effect<LeakReport, TuvrenError>;
  cleanup(): Effect.Effect<LeakReport, TuvrenError>;
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

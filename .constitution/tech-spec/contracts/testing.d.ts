import type * as Effect from "effect/Effect";
import type * as Scope from "effect/Scope";
import type * as TestClock from "effect/TestClock";
import type {
  Brand,
  ComponentId,
  TerminalProfile,
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

export interface DiagnosticIssue {
  readonly code: string;
  readonly category: string;
  readonly operation: string;
  readonly component?: string;
  readonly phase:
    | "input"
    | "event"
    | "command"
    | "effect"
    | "reconcile"
    | "transaction"
    | "mutation"
    | "layout"
    | "text"
    | "render"
    | "terminal"
    | "cleanup";
  readonly source: Readonly<{
    kind: "application" | "sdk" | "native" | "terminal";
    file?: string;
    line?: number;
    column?: number;
  }>;
  readonly cause: Readonly<{
    kind: "error" | "panic" | "terminal" | "validation" | "unknown";
    summary: string;
  }>;
  readonly preceding: Readonly<{
    eventId?: string;
    commandId?: string;
  }> | null;
  readonly traceInterval: Readonly<{
    startSequence: string;
    endSequence: string;
  }>;
  readonly message: string;
  readonly remediation: string;
  readonly actions: readonly ("report" | "trace" | "restart")[];
}

export interface DiagnosticSnapshot {
  readonly schemaVersion: "1.0.0";
  readonly snapshotId: string;
  readonly contextId: string;
  readonly transactionId: string;
  readonly renderRequestId: string;
  readonly surface: Readonly<{
    width: number;
    height: number;
    cellEncoding: "row-major-rle-v1";
    cellRuns: readonly Readonly<{
      count: number;
      grapheme: string;
      width: number;
      continuation: boolean;
      style: Readonly<Record<string, unknown>>;
    }>[];
    cursor?: Readonly<{ x: number; y: number; visible: boolean }> | null;
  }>;
  readonly semanticTree: readonly SemanticElement[];
  readonly issues?: readonly DiagnosticIssue[];
}

export interface DiagnosticTrace {
  readonly schemaVersion: "1.0.0";
  readonly traceId: string;
  readonly createdAt: string;
  readonly sdkVersion?: string;
  readonly terminalProfile: TerminalProfile;
  readonly redaction: Readonly<{
    fullContent: boolean;
    input: "redacted";
    clipboard: "redacted";
    terminalPayloads: "redacted";
    environment: "redacted";
    absolutePaths: "redacted";
  }>;
  readonly records: readonly Readonly<{
    sequence: string;
    kind:
      | "input"
      | "event"
      | "command"
      | "effect-span"
      | "reconcile"
      | "transaction"
      | "mutation"
      | "dirty"
      | "layout"
      | "text"
      | "render"
      | "diff"
      | "terminal-write"
      | "error"
      | "cleanup"
      | "unattributed";
    timestampNanos: string;
    correlation: Readonly<{
      contextId?: string;
      eventId?: string;
      commandId?: string;
      effectSpanId?: string;
      transactionId?: string;
      renderRequestId?: string;
      componentId?: string;
    }>;
    payload: Readonly<Record<string, unknown>>;
  }>[];
  readonly snapshots: readonly DiagnosticSnapshot[];
  readonly wrapCount: number;
}

export interface ApplicationReplayPayloadMap {
  readonly key: Readonly<{
    action: "press" | "repeat" | "release";
    keyCode: number;
    physicalCode?: number;
    text?: string;
    modifiers: readonly ("shift" | "control" | "alt" | "super")[];
  }>;
  readonly text: Readonly<{ text: string }>;
  readonly paste: Readonly<{ text: string; truncated: boolean }>;
  readonly "pointer-move": Readonly<{
    cellX: number;
    cellY: number;
    pixelX?: number;
    pixelY?: number;
    buttons: readonly number[];
    modifiers: readonly ("shift" | "control" | "alt" | "super")[];
  }>;
  readonly "pointer-button": Readonly<{
    action: "press" | "release";
    cellX: number;
    cellY: number;
    button: number;
    clickCount: number;
    modifiers: readonly ("shift" | "control" | "alt" | "super")[];
  }>;
  readonly wheel: Readonly<{
    cellX: number;
    cellY: number;
    deltaRows: number;
    deltaColumns: number;
    deltaPixelX?: number;
    deltaPixelY?: number;
    modifiers: readonly ("shift" | "control" | "alt" | "super")[];
  }>;
  readonly focus: Readonly<Record<never, never>>;
  readonly blur: Readonly<Record<never, never>>;
  readonly resize: Readonly<{
    widthCells: number;
    heightCells: number;
    widthPixels?: number;
    heightPixels?: number;
  }>;
  readonly "external-update": ExternalUpdatePayload;
  readonly clock: Readonly<{ elapsedMilliseconds: number }>;
}

export type JsonNumber = Brand<number, "JsonNumber">;
export type JsonScalar = null | boolean | JsonNumber | string;
export type ExternalUpdateValue =
  JsonScalar | readonly JsonScalar[] | Readonly<Record<string, JsonScalar>>;
export type ExternalUpdatePayload = Readonly<
  Record<string, ExternalUpdateValue>
>;

export function jsonNumber(value: number): JsonNumber;

export type ApplicationReplayEvent<
  Kind extends keyof ApplicationReplayPayloadMap =
    keyof ApplicationReplayPayloadMap,
> = {
  readonly [EventKind in Kind]: Readonly<{
    atMilliseconds: number;
    kind: EventKind;
    payload: ApplicationReplayPayloadMap[EventKind];
    redacted?: boolean;
  }>;
}[Kind];

export interface ApplicationReplay {
  readonly schemaVersion: "1.0.0";
  readonly name: string;
  readonly description?: string;
  readonly terminalProfile: TerminalProfile;
  readonly events: readonly ApplicationReplayEvent[];
  readonly expectations?: readonly Readonly<{
    afterEvent: number;
    snapshot: DiagnosticSnapshot;
  }>[];
}

export interface ReplayFile {
  readonly file: string | URL;
}

export type ReplayInput = ApplicationReplay | DiagnosticTrace | ReplayFile;

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
  | { readonly type: "focus" }
  | { readonly type: "blur" }
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
  focus(): Effect.Effect<void, TuvrenError>;
  blur(): Effect.Effect<void, TuvrenError>;
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
  snapshot(): Effect.Effect<DiagnosticSnapshot, TuvrenError>;
  trace(): Effect.Effect<DiagnosticTrace, TuvrenError>;
  replay(input: ReplayInput): Effect.Effect<DiagnosticSnapshot, TuvrenError>;
  failureTrace(): Effect.Effect<FailureTrace | undefined>;
  saveTrace(path: string): Effect.Effect<void, TuvrenError>;
  checkLeaks(): Effect.Effect<LeakReport, TuvrenError>;
  cleanup(): Effect.Effect<LeakReport, TuvrenError>;
}

export interface TestRenderOptions {
  readonly width?: number;
  readonly height?: number;
  readonly terminal?: Partial<TerminalProfile>;
  readonly automaticTraceOnFailure?: boolean;
}

export function testRender(
  view: View,
  options?: TestRenderOptions,
): Effect.Effect<TestHarness, TuvrenError, Scope.Scope>;

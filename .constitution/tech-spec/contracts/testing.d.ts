import type * as Effect from "effect/Effect";
import type * as Scope from "effect/Scope";
import type * as TestClock from "effect/TestClock";
import type {
  Brand,
  ComponentId,
  EventModifier,
  TerminalProfile,
  TuvrenError,
  TuvrenErrorCategory,
  TuvrenErrorCode,
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
  readonly relationships: Readonly<Record<string, readonly ComponentId[]>>;
}

export interface DiagnosticIssue {
  readonly code: TuvrenErrorCode;
  readonly category: TuvrenErrorCategory;
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
  readonly traceBasis?: DiagnosticSnapshotTraceBasis;
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

export type DiagnosticSnapshotTraceBasis =
  | Readonly<{
      kind: "retained";
      atSequence: string;
      baselineSnapshotId?: string;
    }>
  | Readonly<{ kind: "wrap-baseline"; boundarySequence: string }>;

export type EmbeddedDiagnosticSnapshot = DiagnosticSnapshot & {
  readonly traceBasis: DiagnosticSnapshotTraceBasis;
};

export interface DiagnosticTraceCorrelation {
  readonly recordId: string;
  readonly contextId: string;
  readonly parentRecordId?: string;
  readonly eventId?: string;
  readonly commandId?: string;
  readonly commandInstanceId?: string;
  readonly effectSpanId?: string;
  readonly transactionId?: string;
  readonly renderRequestId?: string;
  readonly componentId?: string;
  readonly subjectId?: string;
  readonly subjectKind?: "component" | "text-document";
}

export type DiagnosticTransactionPayload =
  | Readonly<{
      payloadVersion: "1.0.0";
      status: "committed";
      commandCount: number;
      redacted: boolean;
      failedCommandIndex?: never;
      encodedTransactionBase64?: string;
    }>
  | Readonly<{
      payloadVersion: "1.0.0";
      status: "rejected";
      commandCount: number;
      redacted: boolean;
      failedCommandIndex?: number;
      encodedTransactionBase64?: never;
    }>;

export interface DiagnosticTracePayloadMap {
  readonly context: Readonly<{
    phase: "initialized";
    abiMajor: number;
    abiMinor: number;
  }>;
  readonly input: Readonly<{
    payloadVersion: "1.0.0";
    inputKind: string;
    redacted: boolean;
    byteLength: number;
    encodedEventBatchBase64?: string;
  }>;
  readonly event: Readonly<{
    eventType: string;
    cancelable: boolean;
    target?: string;
    disposition?: string;
  }>;
  readonly command: Readonly<{
    commandId: string;
    phase: string;
    status: string;
    concurrency?: string;
  }>;
  readonly "effect-span": Readonly<{
    spanId: string;
    phase: string;
    parentSpanId?: string;
  }>;
  readonly reconcile: Readonly<{
    operation: string;
    component: string;
    source?: string;
  }>;
  readonly transaction: DiagnosticTransactionPayload;
  readonly mutation: Readonly<{
    payloadVersion: "1.0.0";
    resource: string;
    operation: string;
    generation: number;
    redacted: boolean;
    identity?: string;
  }>;
  readonly dirty: Readonly<{
    cause: string;
    component?: string;
    cellCount?: number;
  }>;
  readonly layout: Readonly<{
    component: string;
    durationNanos: number;
    changedNodes?: number;
  }>;
  readonly text: Readonly<{
    operation: string;
    startGrapheme: number;
    endGrapheme: number;
    contentEpoch?: number;
  }>;
  readonly render: Readonly<{
    dirtyCells: number;
    engineNanos: number;
    presentationTierHz?: number;
  }>;
  readonly diff: Readonly<{
    changedCells: number;
    bytes: number;
    fullRedraw?: boolean;
  }>;
  readonly "terminal-write": Readonly<{
    bytes: number;
    durationNanos: number;
    status: string;
  }>;
  readonly error: Readonly<{
    code: TuvrenErrorCode;
    category: TuvrenErrorCategory;
    operation: string;
    component?: string;
  }>;
  readonly cleanup: Readonly<{
    resource: string;
    count: number;
    retainedBytes?: number;
  }>;
  readonly unattributed:
    | Readonly<{
        reason: "ring-wrap";
        description: string;
        boundaryTransactionId: string;
        boundaryRenderRequestId: string;
        phase?: string;
      }>
    | Readonly<{
        reason: "tooling-defect";
        description: string;
        boundaryTransactionId?: never;
        boundaryRenderRequestId?: never;
        phase?: string;
      }>;
}

export type DiagnosticTraceRecord<
  Kind extends keyof DiagnosticTracePayloadMap =
    keyof DiagnosticTracePayloadMap,
> = {
  readonly [Selected in Kind]: Readonly<{
    sequence: string;
    kind: Selected;
    timestampNanos: string;
    correlation: Readonly<DiagnosticTraceCorrelation>;
    payload: DiagnosticTracePayloadMap[Selected];
  }>;
}[Kind];

export interface DiagnosticTrace<
  FullContent extends boolean = boolean,
  RuntimeReplay extends boolean = false,
> {
  readonly schemaVersion: "1.0.0";
  readonly traceId: string;
  readonly createdAt: string;
  readonly sdkVersion?: string;
  readonly terminalProfile: TerminalProfile;
  readonly redaction: FullContent extends true
    ? Readonly<{
        fullContent: true;
        input: "included";
        clipboard: "included";
        terminalPayloads: "included";
        environment: "redacted";
        absolutePaths: "redacted";
      }>
    : Readonly<{
        fullContent: false;
        input: "redacted";
        clipboard: "redacted";
        terminalPayloads: "redacted";
        environment: "redacted";
        absolutePaths: "redacted";
      }>;
  readonly replay: Readonly<{
    runtime: RuntimeReplay extends true ? "available" : "redacted";
    applicationInput: FullContent extends true ? "available" : "redacted";
  }>;
  readonly capture: RuntimeReplay extends true
    ? Readonly<{
        startedAt: "context-initialization";
        completePrefix: true;
      }>
    : Readonly<{
        startedAt: "context-initialization" | "attached";
        completePrefix: false;
      }>;
  readonly rootCorrelation: Readonly<{
    contextId: string;
    initialSequence: string;
    initialRecordId: string;
  }>;
  readonly records: readonly DiagnosticTraceRecord[];
  readonly snapshots: readonly EmbeddedDiagnosticSnapshot[];
  readonly wrapCount: number;
}

export interface ApplicationReplayPayloadMap {
  readonly key: Readonly<{
    action: "press" | "repeat" | "release";
    keyCode: number;
    physicalCode?: number;
    text?: string;
    modifiers: readonly EventModifier[];
  }>;
  readonly text: Readonly<{ text: string }>;
  readonly paste: Readonly<{ text: string; truncated: boolean }>;
  readonly "pointer-move": Readonly<{
    cellX: number;
    cellY: number;
    pixelX?: number;
    pixelY?: number;
    buttons: readonly number[];
    modifiers: readonly EventModifier[];
  }>;
  readonly "pointer-button": Readonly<{
    action: "press" | "release";
    cellX: number;
    cellY: number;
    button: number;
    clickCount: number;
    modifiers: readonly EventModifier[];
  }>;
  readonly wheel: Readonly<{
    cellX: number;
    cellY: number;
    deltaRows: number;
    deltaColumns: number;
    deltaPixelX?: number;
    deltaPixelY?: number;
    modifiers: readonly EventModifier[];
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

export type RuntimeReplayTrace = DiagnosticTrace<true, true>;
export type ReplayInput = ApplicationReplay | RuntimeReplayTrace | ReplayFile;

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

export interface TestHarness<RuntimeReplay extends boolean = false> {
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
  trace(): Effect.Effect<DiagnosticTrace<false, false>, TuvrenError>;
  trace(
    options: Readonly<{ fullContent: true; confirmed: true }>,
  ): Effect.Effect<DiagnosticTrace<true, false>, TuvrenError>;
  readonly replayTrace: RuntimeReplay extends true
    ? Effect.Effect<RuntimeReplayTrace, TuvrenError>
    : never;
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
  readonly runtimeReplayCapture?: never;
}

export interface RuntimeReplayTestRenderOptions extends Omit<
  TestRenderOptions,
  "runtimeReplayCapture"
> {
  readonly runtimeReplayCapture: Readonly<{
    fullContent: true;
    confirmed: true;
    start: "context-initialization";
  }>;
}

export function testRender<E, R>(
  view: View<E, R>,
  options: RuntimeReplayTestRenderOptions,
): Effect.Effect<TestHarness<true>, TuvrenError | E, Scope.Scope | R>;

export function testRender<E, R>(
  view: View<E, R>,
  options?: TestRenderOptions,
): Effect.Effect<TestHarness, TuvrenError | E, Scope.Scope | R>;

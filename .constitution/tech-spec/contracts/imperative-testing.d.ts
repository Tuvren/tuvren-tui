import type { TerminalProfile, TuvrenError } from "./shared";
import type { ImperativeApp } from "./imperative";
import type {
  DiagnosticSnapshot,
  DiagnosticIssue,
  DiagnosticTrace,
  FailureTrace,
  LeakReport,
  ReplayInput,
  RuntimeReplayTrace,
  SemanticElement,
  SemanticMatch,
  SyntheticInput,
} from "./testing";

export type {
  ApplicationReplay,
  ApplicationReplayEvent,
  ApplicationReplayPayloadMap,
  ReplayFile,
  ReplayInput,
  RuntimeReplayTrace,
} from "./testing";
export { jsonNumber } from "./testing";

export interface ImperativeTestOptions {
  readonly width?: number;
  readonly height?: number;
  readonly terminal?: Partial<TerminalProfile>;
  readonly automaticTraceOnFailure?: boolean;
  readonly runtimeReplayCapture?: never;
}

export interface ImperativeRuntimeReplayTestOptions extends Omit<
  ImperativeTestOptions,
  "runtimeReplayCapture"
> {
  readonly runtimeReplayCapture: Readonly<{
    fullContent: true;
    confirmed: true;
    start: "context-initialization";
  }>;
}

export interface ImperativeTestHarness<RuntimeReplay extends boolean = false> {
  readonly app: ImperativeApp;
  push(event: SyntheticInput): void;
  key(key: string): void;
  type(text: string): void;
  paste(text: string): void;
  pointerMove(x: number, y: number): void;
  click(x: number, y: number): void;
  drag(from: readonly [number, number], to: readonly [number, number]): void;
  scroll(deltaRows: number): void;
  resize(width: number, height: number): void;
  focus(): void;
  blur(): void;
  rawEvent(event: Readonly<Record<string, unknown>>): void;
  advanceTime(milliseconds: number): void;
  waitForVisualIdle(): void;
  getByRole(
    role: string,
    options?: Omit<SemanticMatch, "role">,
  ): SemanticElement;
  queryByRole(
    role: string,
    options?: Omit<SemanticMatch, "role">,
  ): SemanticElement | undefined;
  snapshot(): DiagnosticSnapshot;
  trace(): DiagnosticTrace<false, false>;
  trace(
    options: Readonly<{ fullContent: true; confirmed: true }>,
  ): DiagnosticTrace<true, false>;
  readonly replayTrace: RuntimeReplay extends true ? RuntimeReplayTrace : never;
  replay(input: ReplayInput): DiagnosticSnapshot;
  failureTrace(): FailureTrace | undefined;
  saveTrace(path: string): void;
  checkLeaks(): LeakReport;
  cleanup(): LeakReport;
  close(): LeakReport;
}

export class ImperativeHarnessError extends Error {
  readonly cause: TuvrenError;
}

export function createTestHarness(
  options: ImperativeRuntimeReplayTestOptions,
): ImperativeTestHarness<true>;
export function createTestHarness(
  options?: ImperativeTestOptions,
): ImperativeTestHarness;

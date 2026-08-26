import type { TerminalCapabilities } from "./shared";
import type { ImperativeApp } from "./imperative";

export interface ImperativeTestOptions {
  readonly width?: number;
  readonly height?: number;
  readonly terminal?: Partial<TerminalCapabilities>;
}

export interface ImperativeTestHarness {
  readonly app: ImperativeApp;
  key(key: string): void;
  type(text: string): void;
  paste(text: string): void;
  pointerMove(x: number, y: number): void;
  click(x: number, y: number): void;
  drag(from: readonly [number, number], to: readonly [number, number]): void;
  scroll(deltaRows: number): void;
  resize(width: number, height: number): void;
  rawEvent(event: Readonly<Record<string, unknown>>): void;
  advanceTime(milliseconds: number): void;
  waitForVisualIdle(): void;
  getByRole(role: string, options?: Readonly<Record<string, unknown>>): unknown;
  snapshot(): unknown;
  close(): void;
}

export function createTestHarness(
  options?: ImperativeTestOptions,
): ImperativeTestHarness;

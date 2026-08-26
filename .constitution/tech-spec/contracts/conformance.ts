import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import type * as Scope from "effect/Scope";
import {
  Box,
  Button,
  CommandPalette,
  Commands,
  ErrorBoundary,
  Input,
  Menu,
  MenuItem,
  Select,
  Terminal,
  Text,
  TextArea,
  ToggleButton,
  Transcript,
  commandId,
  componentId,
  defineTheme,
  graphemeIndex,
  mount,
  provideTheme,
  render,
  themeToken,
  useStream,
  useTranscriptController,
  withRequirements,
  type CommandService,
  type RangeLoadResult,
  type TuvrenError,
  type TextDocumentService,
  type View,
} from "./tuvren-tui";
import { jsx } from "./jsx-runtime";
import {
  testRender,
  type DiagnosticTrace,
  type ReplayInput,
  type RuntimeReplayTrace,
  type TestHarness,
} from "./testing";
import {
  Box as ImperativeBox,
  Text as ImperativeText,
  keyGrapheme as imperativeKeyGrapheme,
  keymapScopeId as imperativeKeymapScopeId,
  run as runImperative,
  type ImperativeCommand,
} from "./imperative";

const save = commandId<number, "save-failed">("app.save");
const root = Box({
  id: componentId("app.root"),
  children: [
    Text({ content: "Hello" }),
    Button({ command: save }),
    Select({
      dataSource: {
        getKey: (item: string) => item,
        loadRange: (request) =>
          Effect.succeed<RangeLoadResult<string>>({
            state: "ready",
            generation: request.generation,
            start: request.start,
            totalCount: 1,
            items: ["one"],
          }),
      },
      renderItem: (item: string) => Text({ content: item }),
      mutations: Stream.empty,
    }),
    Menu({
      items: ["open"],
      getKey: (item: string) => item,
      renderItem: (item: string) => Text({ content: item }),
      mutations: Stream.empty,
    }),
  ],
});

const theme = defineTheme(
  "contract",
  {
    accent: "#00ffff",
    emphasis: true,
    spacing: 1,
    border: { text: "rounded" },
  },
  {
    button: {
      name: "button",
      rules: {
        root: {
          foreground: themeToken("accent", "#ffffff"),
          bold: themeToken("emphasis", true),
          padding: themeToken("spacing", 0),
          border: themeToken("border", "single"),
        },
      },
    },
  },
);
const managed: Effect.Effect<void, TuvrenError | "save-failed"> = render(
  provideTheme(theme, root),
);
const jsxNode = jsx(Box, { children: "content" });

const terminalTag = Terminal;
const commandTag = Commands;
interface Database {
  readonly _tag: "Database";
}
declare const requiredLoad: Effect.Effect<
  RangeLoadResult<string>,
  "load-error",
  Database
>;
declare const failingHandler: Effect.Effect<void, "event-handler-error">;
declare const requiredCell: View<"cell-error", Database>;
declare const requiredStream: Stream.Stream<number, "stream-error", Database>;
declare const commandService: CommandService;
declare const textDocumentService: TextDocumentService;
declare const defaultTrace: DiagnosticTrace<false, false>;
declare const runtimeReplayTrace: RuntimeReplayTrace;
const requiredView = Select<string, "load-error", Database>({
  dataSource: {
    getKey: (item) => item,
    loadRange: () => requiredLoad,
  },
  renderItem: (item) => Text({ content: item }),
});
const requiredRoot = Box({ children: requiredView });
const requiredRender: Effect.Effect<
  void,
  TuvrenError | "load-error",
  Database
> = render(requiredRoot);
const observedSession: Effect.Effect<
  void,
  TuvrenError | "save-failed" | "event-handler-error",
  Scope.Scope
> = Effect.flatMap(
  mount(root, { onEvent: () => failingHandler }),
  (session) => session.awaitExit,
);
const rendererView = Select<string, never, never, "cell-error", Database>({
  items: ["one"],
  getKey: (item) => item,
  renderItem: () => requiredCell,
});
const rendererRender: Effect.Effect<
  void,
  TuvrenError | "cell-error",
  Database
> = render(rendererView);
const recoveredView = ErrorBoundary({
  children: requiredView,
  fallback: () => Text({ content: "recovered" }),
});
const recoveredRender: Effect.Effect<void, TuvrenError, Database> =
  render(recoveredView);
const streamRequirement = useStream(requiredStream, () => undefined);
const streamView = withRequirements(
  Text({ content: "stream" }),
  streamRequirement,
);
const streamRender: Effect.Effect<
  void,
  TuvrenError | "stream-error",
  Database
> = render(streamView);
const typedCommandId = commandId<number, "command-error", Database>(
  "typed.command",
);
const idInvocation: Effect.Effect<
  number,
  TuvrenError | "command-error",
  Database
> = commandService.invokeById(typedCommandId);
const typedCommandButton = Button({ command: typedCommandId });
const typedCommandToggle = ToggleButton({ command: typedCommandId });
const typedCommandMenuItem = MenuItem({ command: typedCommandId });
const typedCommandPalette = CommandPalette({
  items: ["typed"],
  getKey: (item: string) => item,
  renderItem: (item: string) => Text({ content: item }),
  commandForItem: () => typedCommandId,
});
const typedCommandButtonRender: Effect.Effect<
  void,
  TuvrenError | "command-error",
  Database
> = render(typedCommandButton);
const typedCommandToggleRender: Effect.Effect<
  void,
  TuvrenError | "command-error",
  Database
> = render(typedCommandToggle);
const typedCommandMenuItemRender: Effect.Effect<
  void,
  TuvrenError | "command-error",
  Database
> = render(typedCommandMenuItem);
const typedCommandPaletteRender: Effect.Effect<
  void,
  TuvrenError | "command-error",
  Database
> = render(typedCommandPalette);
// @ts-expect-error A bound Command cannot erase its failure or environment.
const erasedCommandButtonRender: Effect.Effect<void, TuvrenError> =
  render(typedCommandButton);
// @ts-expect-error A bound ToggleButton cannot erase Command requirements.
const erasedCommandToggleRender: Effect.Effect<void, TuvrenError> =
  render(typedCommandToggle);
// @ts-expect-error A bound MenuItem cannot erase Command requirements.
const erasedCommandMenuItemRender: Effect.Effect<void, TuvrenError> =
  render(typedCommandMenuItem);
// @ts-expect-error A CommandPalette cannot erase item Command requirements.
const erasedCommandPaletteRender: Effect.Effect<void, TuvrenError> =
  render(typedCommandPalette);
const initialCursor = graphemeIndex(0);
const boundTextArea = TextArea({ document: textDocumentService });
const transcriptControllerA = useTranscriptController();
const transcriptControllerB = useTranscriptController();
const transcriptViewA = Transcript({
  mode: "bounded-local",
  controller: transcriptControllerA,
});
const transcriptViewB = Transcript({
  mode: "bounded-local",
  controller: transcriptControllerB,
});
const acceptedReplayTrace: ReplayInput = runtimeReplayTrace;
const replayCaptureHarness: Effect.Effect<
  TestHarness<true>,
  TuvrenError | "save-failed",
  Scope.Scope
> = testRender(root, {
  runtimeReplayCapture: {
    fullContent: true,
    confirmed: true,
    start: "context-initialization",
  },
});

// @ts-expect-error A redacted/default Trace cannot be used for runtime replay.
const rejectedReplayTrace: ReplayInput = defaultTrace;

// @ts-expect-error A bound TextArea cannot also declare string state authority.
TextArea({ document: textDocumentService, value: "duplicate authority" });

// @ts-expect-error A control cannot have simultaneous authorities.
Input({ value: "controlled", defaultValue: "uncontrolled" });
// @ts-expect-error A Collection cannot have simultaneous authorities.
Select({
  items: ["one"],
  dataSource: {
    getKey: (item: string) => item,
    loadRange: () => Effect.never,
  },
  getKey: (item: string) => item,
  renderItem: (item: string) => Text({ content: item }),
});
// @ts-expect-error Controlled Collection selection requires an intent handler.
Select({
  items: ["one"],
  getKey: (item: string) => item,
  renderItem: (item: string) => Text({ content: item }),
  selectedKey: "one",
});
const imperativeSave: ImperativeCommand<number, "save-failed"> = {
  id: save,
  title: "Save",
  concurrency: "restart",
  enabled: () => true,
  run: () => ({ ok: true, value: 1 }),
};

const imperative: Promise<void> = runImperative((app) => {
  const box = new ImperativeBox({});
  box.append(new ImperativeText({ content: "Hello" }));
  app.setTheme(theme);
  app.setRoot(box);
  app.commands.register(imperativeSave);
  const editorScope = app.keymaps.createScope(
    imperativeKeymapScopeId("editor"),
  );
  app.keymaps.register({
    command: save,
    sequence: {
      strokes: [
        { key: imperativeKeyGrapheme("s"), modifiers: { control: true } },
      ],
    },
    scope: editorScope.id,
  });
});

void managed;
void jsxNode;
void save;
void terminalTag;
void commandTag;
void requiredRender;
void observedSession;
void rendererRender;
void recoveredRender;
void streamRender;
void idInvocation;
void typedCommandButtonRender;
void typedCommandToggleRender;
void typedCommandMenuItemRender;
void typedCommandPaletteRender;
void erasedCommandButtonRender;
void erasedCommandToggleRender;
void erasedCommandMenuItemRender;
void erasedCommandPaletteRender;
void initialCursor;
void boundTextArea;
void transcriptViewA;
void transcriptViewB;
void acceptedReplayTrace;
void replayCaptureHarness;
void rejectedReplayTrace;
void imperative;

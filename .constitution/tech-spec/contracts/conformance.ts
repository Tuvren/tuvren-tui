import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import {
  Box,
  Button,
  Commands,
  Menu,
  Select,
  Terminal,
  Text,
  commandId,
  componentId,
  defineTheme,
  provideTheme,
  render,
  themeToken,
  type RangeLoadResult,
  type TuvrenError,
} from "./tuvren-tui";
import { jsx } from "./jsx-runtime";
import {
  Box as ImperativeBox,
  Text as ImperativeText,
  keymapScopeId as imperativeKeymapScopeId,
  run as runImperative,
  type ImperativeCommand,
} from "./imperative";

const save = commandId("app.save");
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
      getKey: (item: string) => item,
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
const managed: Effect.Effect<void, TuvrenError> = render(
  provideTheme(theme, root),
);
const jsxNode = jsx(Box, { children: "content" });

const terminalTag = Terminal;
const commandTag = Commands;
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
    keys: "ctrl+s",
    scope: editorScope.id,
  });
});

void managed;
void jsxNode;
void save;
void terminalTag;
void commandTag;
void imperative;

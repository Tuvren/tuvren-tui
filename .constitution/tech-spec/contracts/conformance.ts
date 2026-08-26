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
  type RangeLoadResult,
  type TuvrenError,
} from "./tuvren-tui";
import { jsx } from "./jsx-runtime";
import {
  Box as ImperativeBox,
  Text as ImperativeText,
  run as runImperative,
} from "./imperative";

const root = Box({
  id: componentId("app.root"),
  children: [
    Text({ content: "Hello" }),
    Button({ onPress: () => undefined }),
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

const theme = defineTheme("contract", { accent: "#00ffff" }, {});
const managed: Effect.Effect<void, TuvrenError> = render(
  provideTheme(theme, root),
);
const jsxNode = jsx(Box, { children: "content" });
const save = commandId("app.save");

const terminalTag = Terminal;
const commandTag = Commands;

const imperative: Promise<void> = runImperative((app) => {
  const box = new ImperativeBox({});
  box.append(new ImperativeText({ content: "Hello" }));
  app.setTheme(theme);
  app.setRoot(box);
});

void managed;
void jsxNode;
void save;
void terminalTag;
void commandTag;
void imperative;

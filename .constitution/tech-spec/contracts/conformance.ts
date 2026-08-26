import * as Effect from "effect/Effect";
import {
  Box,
  Button,
  Commands,
  Select,
  Terminal,
  Text,
  commandId,
  componentId,
  render,
  type RangeResult,
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
          Effect.succeed<RangeResult<string>>({
            generation: request.generation,
            start: request.start,
            totalCount: 1,
            items: ["one"],
          }),
      },
      getKey: (item: string) => item,
      renderItem: (item: string) => Text({ content: item }),
    }),
  ],
});

const managed: Effect.Effect<void, TuvrenError> = render(root);
const jsxNode = jsx(Box, { children: "content" });
const save = commandId("app.save");

const terminalTag = Terminal;
const commandTag = Commands;

const imperative: Promise<void> = runImperative((app) => {
  const box = new ImperativeBox({});
  box.append(new ImperativeText({ content: "Hello" }));
  app.setRoot(box);
});

void managed;
void jsxNode;
void save;
void terminalTag;
void commandTag;
void imperative;

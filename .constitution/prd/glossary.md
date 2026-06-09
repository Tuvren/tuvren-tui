# Glossary

## 1. Ubiquitous Language

A strict three-column table defining canonical domain terms. Every term must be singular and canonical.

| Term | Definition | Do Not Use |
| :--- | :--- | :--- |
| **Widget** | A composable visual building block that can display content, accept input, or contain other Widgets. | Component, Element, Node, Control |
| **Developer** | A person using Tuvren to build terminal applications. | Author, User, Consumer, Client |
| **End User** | The person interacting with the terminal application a Developer built. | User, Customer, Operator |
| **Composition Tree** | The hierarchical arrangement of Widgets that defines the interface structure. | DOM, Widget Tree, Node Tree, Scene Graph |
| **Surface** | The terminal display area to which the Composition Tree is rendered. | Screen, Canvas, View, Buffer |
| **Handle** | An opaque reference to a Widget in the native performance layer. Owned by the system, not the Developer. | Pointer, Reference, ID, Key |
| **Layout Constraint** | Rules governing a Widget's position and dimensions relative to its parent and siblings. | Style, CSS, Layout Rule |
| **Render Pass** | A single cycle from state mutation to Surface update. Only changed regions are recomputed. | Frame, Draw, Paint, Tick |
| **Event** | A discrete unit of End User input routed to the appropriate Widget. | Callback, Signal, Message, Action |
| **Transcript** | A scrolling, block-oriented surface for long-lived log, message, and streaming-output workflows. | Log, Feed, Stream |
| **Theme** | A named collection of Style defaults that can be applied to a subtree of the Composition Tree. | Skin, Palette, Style Sheet |
| **Command** | A reusable, named action that can be triggered through keymaps, command palettes, or programmatically. | Action, Handler, Callback |
| **Keymap** | A mapping from a key sequence to a Command, optionally gated by a predicate. | Shortcut, Hotkey, Binding |
| **Plugin** | A contribution package that registers host-layer services through bounded extension slots. | Extension, Addon, Module |
| **Effect** | The sanctioned declarative integration path via `tuvren-tui/effect` using the Effect runtime. | JSX, React, Signals |
| **TextBuffer** | Native content storage for substantial text surfaces, keyed by an opaque Handle. | String, Content, Text Store |
| **TextView** | A viewport projection over a TextBuffer with wrap and scroll semantics. | Viewport, Text View, Wrap View |

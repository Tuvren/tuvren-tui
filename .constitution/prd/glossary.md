# Glossary

| Term | Definition | Do not use |
| :-- | :-- | :-- |
| Developer | A person who uses Tuvren to build a terminal application. | Author, Consumer, Client, User |
| End User | A person who interacts with an application built with Tuvren. | Developer, Customer, Operator, User |
| Integrator | A Developer who embeds Tuvren into an existing tool, runtime, or application lifecycle. | Adapter Author, Host Owner |
| Component Author | A Developer who packages reusable Components and related public contracts for other Developers. | Plugin Author, Widget Author |
| Release Maintainer | A person who publishes and verifies a Tuvren release across its supported targets. | Publisher, Release Engineer |
| Host Environment | The environment that runs application code, loads Tuvren, schedules work, and owns process lifecycle. | Host Runtime, Script Runtime |
| Terminal Environment | The terminal and any intermediary that provide input, output, dimensions, permissions, and capabilities. | Terminal Emulator, Console, Shell |
| Component | A public reusable authoring abstraction with properties, children, composition, and lifecycle behavior. | Widget, Element, Node, Control |
| Primitive | A low-level, native-backed public building block used directly or by a Component; concrete examples include `Box`, `Text`, and `Input`. | Widget, RuntimeNode, Element |
| RuntimeNode | An internal retained-tree record with identity, geometry, relationships, and runtime state; ordinary SDK workflows do not expose it. | Component, Primitive, Node |
| Composition Tree | The hierarchical arrangement of Components and Primitives that describes an interface. | DOM, Widget Tree, Node Tree, Scene Graph |
| Surface | A rectangular terminal display area produced from a Composition Tree. | Screen, Canvas, View, Buffer |
| Layout Constraint | A rule governing the position or dimensions of a Component or Primitive. | CSS Rule, Style, Layout Rule |
| Render Pass | One bounded cycle that reconciles accepted changes and updates a Surface. | Tick, Paint, Draw, Frame |
| Effect UI SDK | The preferred declarative SDK built around the Effect TypeScript ecosystem. | Effect SDK, Declarative SDK, JSX SDK |
| Imperative SDK | The public workflow in which a Developer explicitly creates and updates UI objects while using managed lifecycle defaults. | Raw API, Boundary API, Low-Level SDK |
| JSX syntax | The view-authoring syntax used by the Effect UI SDK; it does not imply browser, virtual-DOM, or React semantics. | JSX SDK, JSX Runtime, Component Model |
| Reactivity | The public capability that keeps a described view synchronized with accepted state; its mechanism remains private. | Signal, Signals API, Observable Model |
| Event | A normalized occurrence routed through an interaction hierarchy, such as input, focus, resize, or paste. | Callback, Signal, Message, Action |
| Command | A reusable named application action with metadata, availability conditions, execution behavior, and a stable identity. | Callback, Handler, Event, Action |
| Keymap | A scoped mapping from a key sequence to a Command. | Shortcut, Hotkey, Binding |
| StyleSpec | One typed declaration of visual properties and optional state or environment variants. | Style, Rule, CSS |
| StyleSheet | A registered collection of named StyleSpecs and supported conditions. | Theme, CSS File, Palette |
| Theme | A coherent collection of semantic values and reusable Component styling decisions. | Skin, Palette, StyleSheet |
| ThemeTokens | Semantic values shared across visual decisions, such as colors, spacing, and motion values. | Theme Token, Variables, Theme Values |
| ThemeRecipes | Reusable Component-level styling defaults. | Theme Recipe, StyleSheet, Skin |
| StyledText | The canonical structured rich-text value composed of content and styled spans. | Rich String, Attributed String, Markup |
| Text Document | Editable or inspectable textual content with grapheme-based public positions. | TextBuffer, String, Blob |
| Transcript | An ordered, block-oriented body of long-lived, streaming, or reloadable content. | Log, Feed, Stream |
| Transcript Block | A stable unit of Transcript content that can be inserted, streamed, replaced, collapsed, removed, or reloaded. | Line, Message, Row |
| Virtual Collection | A logical collection whose visible range can be presented without mounting every item. | Virtual List, Windowed List, Table Model |
| Data Source | A contract that supplies keyed ranges and incremental changes to a Virtual Collection. | Loader, Provider, Adapter |
| Resident Projection | The bounded in-memory portion of a larger Transcript or Virtual Collection needed for current interaction. | Cache, Window, Buffer |
| Focus Scope | A bounded focus-navigation region that can contain, restore, or trap focus. | Focus Group, Tab Scope |
| Semantic Tree | The roles, names, descriptions, values, states, and relationships that describe an interface independently of its visual cells. | Accessibility Tree, DOM, Component Tree |
| Terminal Capability | A detected terminal behavior that Tuvren can use or safely replace with a fallback. | Terminal Type, Emulator Brand, Feature Flag |
| Capability Tier | A set of behavior guarantees selected from detected Terminal Capabilities. | Terminal Allowlist, Compatibility Mode |
| Screen Mode | The way an application shares or owns terminal rows and scrollback. | Display Mode, Renderer Mode |
| Diagnostic Graph | A local causal model connecting Components, Primitives, layout, styles, Events, Commands, semantics, and Render Passes. | Debug Tree, Inspector DOM |
| Diagnostic Trace | A bounded, versioned record of causal runtime activity suitable for inspection and replay. | Log File, Event Dump, Recording |
| RuntimeExtension | A future contract for contributing runtime behavior with defined activation and cleanup; it is not part of the initial release. | Runtime Extension, Plugin, Addon, Hook |
| Plugin | A packaged, discoverable RuntimeExtension with lifecycle, installation, permissions, and compatibility guarantees. | Package, Component Library, Runtime Extension |

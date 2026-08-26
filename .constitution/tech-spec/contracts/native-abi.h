#ifndef TUVREN_TUI_NATIVE_ABI_H
#define TUVREN_TUI_NATIVE_ABI_H

#include <stddef.h>
#include <stdint.h>

#if defined(_WIN32)
#define TUVREN_API __declspec(dllexport)
#else
#define TUVREN_API __attribute__((visibility("default")))
#endif

#ifdef __cplusplus
extern "C" {
#endif

#define TUVREN_ABI_MAJOR 2u
#define TUVREN_ABI_MINOR 0u
#define TUVREN_TX_MAGIC 0x52565554u /* "TUVR" in little endian */
#define TUVREN_EVENT_MAGIC 0x45565554u /* "TUVE" in little endian */
#define TUVREN_DIAGNOSTIC_MAGIC 0x44565554u /* "TUVD" in little endian */
#define TUVREN_QUERY_MAGIC 0x51565554u /* "TUVQ" in little endian */
#define TUVREN_TX_FLAG_REQUEST_RENDER 0x00000001u
#define TUVREN_EVENT_FLAG_CANCELABLE 0x0001u
#define TUVREN_EVENT_FLAG_COALESCED 0x0002u
#define TUVREN_EVENT_FLAG_SYNTHETIC 0x0004u
#define TUVREN_RENDER_FLAG_FORCE_FULL 0x0001u
#define TUVREN_DIMENSION_HAS_MINIMUM 0x0001u
#define TUVREN_DIMENSION_HAS_PREFERRED 0x0002u
#define TUVREN_DIMENSION_HAS_MAXIMUM 0x0004u
#define TUVREN_RESPONSIVE_MIN_WIDTH_CELLS 0x00000001u
#define TUVREN_RESPONSIVE_MAX_WIDTH_CELLS 0x00000002u
#define TUVREN_RESPONSIVE_MIN_HEIGHT_CELLS 0x00000004u
#define TUVREN_RESPONSIVE_MAX_HEIGHT_CELLS 0x00000008u
#define TUVREN_RESPONSIVE_MIN_WIDTH_PERCENT 0x00000010u
#define TUVREN_RESPONSIVE_MAX_WIDTH_PERCENT 0x00000020u
#define TUVREN_RESPONSIVE_MIN_HEIGHT_PERCENT 0x00000040u
#define TUVREN_RESPONSIVE_MAX_HEIGHT_PERCENT 0x00000080u
#define TUVREN_STYLE_HAS_FOREGROUND 0x00000001u
#define TUVREN_STYLE_HAS_BACKGROUND 0x00000002u
#define TUVREN_STYLE_HAS_ATTRIBUTES 0x00000004u
#define TUVREN_STYLE_HAS_BORDER 0x00000008u
#define TUVREN_STYLE_HAS_PADDING 0x00000010u
#define TUVREN_STYLE_HAS_OPACITY 0x00000020u
#define TUVREN_STYLE_HAS_RULES 0x00000040u
#define TUVREN_STYLE_ATTR_BOLD 0x00000001u
#define TUVREN_STYLE_ATTR_ITALIC 0x00000002u
#define TUVREN_STYLE_ATTR_UNDERLINE 0x00000004u
#define TUVREN_STYLE_ATTR_DIM 0x00000008u
#define TUVREN_STYLE_ATTR_INVERSE 0x00000010u
#define TUVREN_ANIMATION_HAS_FROM 0x00000001u
#define TUVREN_ANIMATION_REPEAT_INFINITE 0x00000002u
#define TUVREN_ANIMATION_REVERSE 0x00000004u
#define TUVREN_STYLE_VALUE_HAS_FALLBACK 0x0001u
#define TUVREN_QUERY_FIND_BACKWARD 0x00000001u
#define TUVREN_QUERY_FIND_CASE_SENSITIVE 0x00000002u
#define TUVREN_QUERY_FIND_WHOLE_WORD 0x00000004u
#define TUVREN_QUERY_RESULT_CAN_UNDO 0x00000001ull
#define TUVREN_QUERY_RESULT_CAN_REDO 0x00000002ull
#define TUVREN_QUERY_RESULT_HAS_SELECTION 0x00000004ull
#define TUVREN_TEXT_EDIT_FIND_BACKWARD 0x00000001u
#define TUVREN_TEXT_EDIT_FIND_CASE_SENSITIVE 0x00000002u
#define TUVREN_TEXT_EDIT_FIND_WHOLE_WORD 0x00000004u
#define TUVREN_TEXT_CONFIG_READ_ONLY 0x00000001u
#define TUVREN_TEXT_CONFIG_SECURE 0x00000002u
#define TUVREN_TEXT_CONFIG_REQUIRED 0x00000004u
#define TUVREN_TEXT_CONFIG_HAS_MAX_LENGTH 0x00000008u
#define TUVREN_TEXT_VALIDATION_CASE_INSENSITIVE 0x00000001u
#define TUVREN_TEXT_VALIDATION_MULTILINE 0x00000002u
#define TUVREN_DRAG_CAPTURED 0x00000001u
#define TUVREN_DIAGNOSTIC_REDACTED 0x00000001u
#define TUVREN_DIAGNOSTIC_RING_WRAPPED 0x00000002u
#define TUVREN_DIAGNOSTIC_SNAPSHOT_BOUNDARY 0x00000004u
#define TUVREN_EVENT_MOD_SHIFT 0x00000001u
#define TUVREN_EVENT_MOD_CONTROL 0x00000002u
#define TUVREN_EVENT_MOD_ALT 0x00000004u
#define TUVREN_EVENT_MOD_SUPER 0x00000008u
#define TUVREN_CAP_SYNC_OUTPUT 0x0000000000000001ull
#define TUVREN_CAP_HYPERLINKS 0x0000000000000002ull
#define TUVREN_CAP_ENHANCED_KEYBOARD 0x0000000000000004ull
#define TUVREN_CAP_POINTER 0x0000000000000008ull
#define TUVREN_CAP_FOCUS 0x0000000000000010ull
#define TUVREN_CAP_PASTE_EVENTS 0x0000000000000020ull
#define TUVREN_CAP_RICH_CLIPBOARD 0x0000000000000040ull
#define TUVREN_CAP_PIXEL_GEOMETRY 0x0000000000000080ull
#define TUVREN_CAP_THEME_DETECTION 0x0000000000000100ull
#define TUVREN_CAP_PALETTE_DETECTION 0x0000000000000200ull
#define TUVREN_CAP_WIDTH_NEGOTIATION 0x0000000000000400ull
#define TUVREN_STYLE_STATE_FOCUSED 0x0000000000000001ull
#define TUVREN_STYLE_STATE_POINTER_OVER 0x0000000000000002ull
#define TUVREN_STYLE_STATE_ACTIVE 0x0000000000000004ull
#define TUVREN_STYLE_STATE_DISABLED 0x0000000000000008ull
#define TUVREN_STYLE_STATE_SELECTED 0x0000000000000010ull
#define TUVREN_STYLE_STATE_CHECKED 0x0000000000000020ull
#define TUVREN_STYLE_STATE_MIXED 0x0000000000000040ull
#define TUVREN_STYLE_STATE_EXPANDED 0x0000000000000080ull
#define TUVREN_STYLE_STATE_INVALID 0x0000000000000100ull
#define TUVREN_PASTE_TRUNCATED 0x0001u
#define TUVREN_CLIPBOARD_FINAL_CHUNK 0x00000001u
#define TUVREN_RANGE_RETRYABLE 0x00000001u
#define TUVREN_TRANSCRIPT_STREAMING 0x00000001u
#define TUVREN_TRANSCRIPT_COLLAPSED 0x00000002u
#define TUVREN_TRANSCRIPT_SELECTED 0x00000004u
#define TUVREN_TRANSCRIPT_LIVE_EDGE 0x00000008u
#define TUVREN_DIAGNOSTIC_CONFIG_INCLUDE_FULL_CONTENT 0x00000001u
#define TUVREN_DIAGNOSTIC_CONFIG_INCLUDE_SOURCE 0x00000002u
#define TUVREN_DIAGNOSTIC_CONFIG_RUNTIME_REPLAY_CAPTURE 0x00000004u
#define TUVREN_NODE_REF_LOCAL_BIT 0x80000000u
#define TUVREN_MAX_TRANSACTION_BYTES (8u * 1024u * 1024u)
#define TUVREN_MAX_TRANSACTION_COMMANDS 65535u
#define TUVREN_MAX_QUERY_INPUT_BYTES (8u * 1024u * 1024u)

#ifdef __cplusplus
#define TUVREN_STATIC_ASSERT(condition, message) static_assert(condition, message)
#else
#define TUVREN_STATIC_ASSERT(condition, message) _Static_assert(condition, message)
#endif

typedef uint32_t TuvrenContextId;
/* Context 0 is invalid for mutation. tui_error_copy accepts 0 only to copy a
 * process-scoped context-creation or loading diagnostic. */

typedef enum TuvrenStatus {
    TUVREN_STATUS_OK = 0,
    TUVREN_STATUS_BUFFER_TOO_SMALL = 1,
    TUVREN_STATUS_INVALID_INPUT = 2,
    TUVREN_STATUS_STALE_CONTEXT = 3,
    TUVREN_STATUS_UNAVAILABLE = 4,
    TUVREN_STATUS_PANIC_CONTAINED = 5
} TuvrenStatus;

typedef enum TuvrenContextMode {
    TUVREN_CONTEXT_INTERACTIVE = 1,
    TUVREN_CONTEXT_HEADLESS = 2
} TuvrenContextMode;

typedef enum TuvrenScreenMode {
    TUVREN_SCREEN_ALTERNATE = 1,
    TUVREN_SCREEN_INLINE = 2,
    TUVREN_SCREEN_SPLIT_FOOTER = 3,
    TUVREN_SCREEN_HEADLESS = 4
} TuvrenScreenMode;

typedef enum TuvrenExternalOutputMode {
    TUVREN_OUTPUT_CAPTURE = 1,
    TUVREN_OUTPUT_SCROLLBACK = 2,
    TUVREN_OUTPUT_PASSTHROUGH = 3,
    TUVREN_OUTPUT_DISABLED = 4
} TuvrenExternalOutputMode;

typedef enum TuvrenTransactionOpcode {
    TUVREN_TX_CREATE_NODE = 1,
    TUVREN_TX_DESTROY_NODE = 2,
    TUVREN_TX_INSERT_CHILD = 3,
    TUVREN_TX_REMOVE_CHILD = 4,
    TUVREN_TX_SET_ROOT = 5,
    TUVREN_TX_SET_PROPERTY_U64 = 6,
    TUVREN_TX_SET_PROPERTY_I64 = 7,
    TUVREN_TX_SET_PROPERTY_F64 = 8,
    TUVREN_TX_SET_PROPERTY_BYTES = 9,
    TUVREN_TX_TEXT_EDIT = 10,
    TUVREN_TX_COLLECTION_APPLY = 11,
    TUVREN_TX_TRANSCRIPT_APPLY = 12,
    TUVREN_TX_ANIMATION_APPLY = 13,
    TUVREN_TX_TERMINAL_REQUEST = 14,
    TUVREN_TX_DIAGNOSTIC_CONFIGURE = 15,
    TUVREN_TX_ANIMATION_CANCEL = 16,
    TUVREN_TX_ANIMATION_REPLACE = 17
} TuvrenTransactionOpcode;

typedef enum TuvrenValueTag {
    TUVREN_VALUE_NONE = 0,
    TUVREN_VALUE_U64 = 1,
    TUVREN_VALUE_I64 = 2,
    TUVREN_VALUE_F64 = 3,
    TUVREN_VALUE_UTF8 = 4,
    TUVREN_VALUE_BYTES = 5,
    TUVREN_VALUE_LAYOUT = 6,
    TUVREN_VALUE_STYLE = 7,
    TUVREN_VALUE_GRAPHEME_RANGE = 8,
    TUVREN_VALUE_SEMANTIC = 9,
    TUVREN_VALUE_TEXT_CONTENT = 10,
    TUVREN_VALUE_TEXT_DOCUMENT_CONFIG = 11
} TuvrenValueTag;

typedef enum TuvrenDimensionTag {
    TUVREN_DIMENSION_AUTO = 0,
    TUVREN_DIMENSION_CELLS = 1,
    TUVREN_DIMENSION_PERCENT = 2,
    TUVREN_DIMENSION_MIN_CONTENT = 3,
    TUVREN_DIMENSION_MAX_CONTENT = 4
} TuvrenDimensionTag;

typedef enum TuvrenDisplayMode {
    TUVREN_DISPLAY_FLEX = 1,
    TUVREN_DISPLAY_GRID = 2
} TuvrenDisplayMode;

typedef enum TuvrenPositionMode {
    TUVREN_POSITION_RELATIVE = 1,
    TUVREN_POSITION_ABSOLUTE = 2
} TuvrenPositionMode;

typedef enum TuvrenFlexDirection {
    TUVREN_FLEX_ROW = 1,
    TUVREN_FLEX_ROW_REVERSE = 2,
    TUVREN_FLEX_COLUMN = 3,
    TUVREN_FLEX_COLUMN_REVERSE = 4
} TuvrenFlexDirection;

typedef enum TuvrenFlexWrap {
    TUVREN_FLEX_NOWRAP = 1,
    TUVREN_FLEX_WRAP = 2,
    TUVREN_FLEX_WRAP_REVERSE = 3
} TuvrenFlexWrap;

typedef enum TuvrenAlignMode {
    TUVREN_ALIGN_AUTO = 0,
    TUVREN_ALIGN_START = 1,
    TUVREN_ALIGN_END = 2,
    TUVREN_ALIGN_CENTER = 3,
    TUVREN_ALIGN_STRETCH = 4,
    TUVREN_ALIGN_BASELINE = 5
} TuvrenAlignMode;

typedef enum TuvrenJustifyMode {
    TUVREN_JUSTIFY_START = 1,
    TUVREN_JUSTIFY_END = 2,
    TUVREN_JUSTIFY_CENTER = 3,
    TUVREN_JUSTIFY_SPACE_BETWEEN = 4,
    TUVREN_JUSTIFY_SPACE_AROUND = 5,
    TUVREN_JUSTIFY_SPACE_EVENLY = 6,
    TUVREN_JUSTIFY_STRETCH = 7
} TuvrenJustifyMode;

typedef enum TuvrenOverflowMode {
    TUVREN_OVERFLOW_CLIP = 1,
    TUVREN_OVERFLOW_SCROLL = 2,
    TUVREN_OVERFLOW_MINIMUM_SIZE_ERROR = 3
} TuvrenOverflowMode;

typedef enum TuvrenStylePayloadKind {
    TUVREN_STYLE_INLINE = 1,
    TUVREN_STYLE_SHEET = 2,
    TUVREN_STYLE_SLOT = 3,
    TUVREN_STYLE_THEME = 4
} TuvrenStylePayloadKind;

typedef enum TuvrenStyleValueKind {
    TUVREN_STYLE_VALUE_LITERAL = 1,
    TUVREN_STYLE_VALUE_TOKEN = 2
} TuvrenStyleValueKind;

typedef enum TuvrenThemeTokenValueTag {
    TUVREN_THEME_TOKEN_COLOR = 1,
    TUVREN_THEME_TOKEN_NUMBER = 2,
    TUVREN_THEME_TOKEN_UTF8 = 3,
    TUVREN_THEME_TOKEN_BOOLEAN = 4
} TuvrenThemeTokenValueTag;

typedef enum TuvrenQueryKind {
    TUVREN_QUERY_TEXT_SNAPSHOT = 1,
    TUVREN_QUERY_TEXT_FIND = 2,
    TUVREN_QUERY_TEXT_ENCODE = 3,
    TUVREN_QUERY_COLLECTION_VISIBLE_RANGE = 4,
    TUVREN_QUERY_TRANSCRIPT_VISIBLE_RANGE = 5,
    TUVREN_QUERY_TERMINAL_CAPABILITIES = 6,
    TUVREN_QUERY_COLLECTION_SCROLL_POSITION = 7
} TuvrenQueryKind;

typedef enum TuvrenTextEncoding {
    TUVREN_TEXT_ENCODING_UTF8 = 1,
    TUVREN_TEXT_ENCODING_UTF16_LE = 2,
    TUVREN_TEXT_ENCODING_UTF16_BE = 3
} TuvrenTextEncoding;

typedef enum TuvrenTextContentKind {
    TUVREN_TEXT_CONTENT_PLAIN = 1,
    TUVREN_TEXT_CONTENT_STYLED = 2,
    TUVREN_TEXT_CONTENT_MARKDOWN = 3,
    TUVREN_TEXT_CONTENT_CODE = 4,
    TUVREN_TEXT_CONTENT_ANSI = 5
} TuvrenTextContentKind;

typedef enum TuvrenLineEnding {
    TUVREN_LINE_ENDING_LF = 1,
    TUVREN_LINE_ENDING_CRLF = 2
} TuvrenLineEnding;

typedef enum TuvrenIndentationStyle {
    TUVREN_INDENTATION_TABS = 1,
    TUVREN_INDENTATION_SPACES = 2
} TuvrenIndentationStyle;

typedef enum TuvrenTextValidationKind {
    TUVREN_TEXT_VALIDATION_MINIMUM_LENGTH = 1,
    TUVREN_TEXT_VALIDATION_MAXIMUM_LENGTH = 2,
    TUVREN_TEXT_VALIDATION_PATTERN = 3
} TuvrenTextValidationKind;

typedef enum TuvrenThemeMode {
    TUVREN_THEME_ANY = 0,
    TUVREN_THEME_LIGHT = 1,
    TUVREN_THEME_DARK = 2
} TuvrenThemeMode;

typedef enum TuvrenCapabilityTier {
    TUVREN_CAPABILITY_ANY = 0,
    TUVREN_CAPABILITY_MODERN = 1,
    TUVREN_CAPABILITY_COMPATIBLE = 2
} TuvrenCapabilityTier;

typedef enum TuvrenOptionalBoolean {
    TUVREN_BOOLEAN_ANY = 0,
    TUVREN_BOOLEAN_FALSE = 1,
    TUVREN_BOOLEAN_TRUE = 2
} TuvrenOptionalBoolean;

typedef enum TuvrenDiagnosticMode {
    TUVREN_DIAGNOSTIC_OFF = 0,
    TUVREN_DIAGNOSTIC_PASSIVE = 1,
    TUVREN_DIAGNOSTIC_FULL_TRACE = 2
} TuvrenDiagnosticMode;

typedef enum TuvrenClipboardTarget {
    TUVREN_CLIPBOARD = 1,
    TUVREN_PRIMARY_SELECTION = 2
} TuvrenClipboardTarget;

typedef enum TuvrenReducedMotionMode {
    TUVREN_REDUCED_MOTION_FINISH = 1,
    TUVREN_REDUCED_MOTION_SKIP = 2,
    TUVREN_REDUCED_MOTION_REPLACE = 3
} TuvrenReducedMotionMode;

typedef enum TuvrenCollectionKeyTag {
    TUVREN_COLLECTION_KEY_UTF8 = 1,
    TUVREN_COLLECTION_KEY_NUMBER = 2
} TuvrenCollectionKeyTag;

typedef enum TuvrenGridTrackKind {
    TUVREN_GRID_TRACK_DIMENSION = 1,
    TUVREN_GRID_TRACK_FRACTION = 2,
    TUVREN_GRID_TRACK_MINMAX = 3
} TuvrenGridTrackKind;

typedef enum TuvrenBorderKind {
    TUVREN_BORDER_NONE = 0,
    TUVREN_BORDER_SINGLE = 1,
    TUVREN_BORDER_DOUBLE = 2,
    TUVREN_BORDER_ROUNDED = 3,
    TUVREN_BORDER_HEAVY = 4
} TuvrenBorderKind;

typedef enum TuvrenSemanticPayloadKind {
    TUVREN_SEMANTIC_STATES = 1,
    TUVREN_SEMANTIC_RELATIONSHIPS = 2,
    TUVREN_SEMANTIC_VALUE = 3
} TuvrenSemanticPayloadKind;

typedef enum TuvrenAnimationProperty {
    TUVREN_ANIMATE_FOREGROUND = 1,
    TUVREN_ANIMATE_BACKGROUND = 2,
    TUVREN_ANIMATE_OPACITY = 3,
    TUVREN_ANIMATE_POSITION_X = 4,
    TUVREN_ANIMATE_POSITION_Y = 5,
    TUVREN_ANIMATE_WIDTH = 6,
    TUVREN_ANIMATE_HEIGHT = 7,
    TUVREN_ANIMATE_SCROLL_ROW = 8,
    TUVREN_ANIMATE_SCROLL_COLUMN = 9
} TuvrenAnimationProperty;

typedef enum TuvrenAnimationEasing {
    TUVREN_EASING_LINEAR = 1,
    TUVREN_EASING_EASE_IN = 2,
    TUVREN_EASING_EASE_OUT = 3,
    TUVREN_EASING_EASE_IN_OUT = 4
} TuvrenAnimationEasing;

typedef enum TuvrenAnimationTimelineMode {
    TUVREN_TIMELINE_SEQUENCE = 1,
    TUVREN_TIMELINE_PARALLEL = 2
} TuvrenAnimationTimelineMode;

typedef enum TuvrenPointerButton {
    TUVREN_POINTER_PRIMARY = 1,
    TUVREN_POINTER_MIDDLE = 2,
    TUVREN_POINTER_SECONDARY = 3,
    TUVREN_POINTER_AUXILIARY_1 = 4,
    TUVREN_POINTER_AUXILIARY_2 = 5
} TuvrenPointerButton;

typedef enum TuvrenNamedKeyCode {
    TUVREN_KEY_ENTER = 0x00110000,
    TUVREN_KEY_ESCAPE = 0x00110001,
    TUVREN_KEY_BACKSPACE = 0x00110002,
    TUVREN_KEY_TAB = 0x00110003,
    TUVREN_KEY_DELETE = 0x00110004,
    TUVREN_KEY_INSERT = 0x00110005,
    TUVREN_KEY_HOME = 0x00110006,
    TUVREN_KEY_END = 0x00110007,
    TUVREN_KEY_PAGE_UP = 0x00110008,
    TUVREN_KEY_PAGE_DOWN = 0x00110009,
    TUVREN_KEY_ARROW_UP = 0x0011000A,
    TUVREN_KEY_ARROW_DOWN = 0x0011000B,
    TUVREN_KEY_ARROW_LEFT = 0x0011000C,
    TUVREN_KEY_ARROW_RIGHT = 0x0011000D,
    TUVREN_KEY_F1 = 0x00110101,
    TUVREN_KEY_F24 = 0x00110118
} TuvrenNamedKeyCode;
/* Function-key codes F1 through F24 are contiguous from TUVREN_KEY_F1. */

typedef enum TuvrenIdentityTag {
    TUVREN_IDENTITY_UTF8 = 1,
    TUVREN_IDENTITY_NUMBER = 2,
    TUVREN_IDENTITY_NODE = 3
} TuvrenIdentityTag;

typedef enum TuvrenTerminalTier {
    TUVREN_TERMINAL_MODERN = 1,
    TUVREN_TERMINAL_COMPATIBLE = 2
} TuvrenTerminalTier;

typedef enum TuvrenTerminalTheme {
    TUVREN_TERMINAL_THEME_UNKNOWN = 0,
    TUVREN_TERMINAL_THEME_LIGHT = 1,
    TUVREN_TERMINAL_THEME_DARK = 2
} TuvrenTerminalTheme;

typedef enum TuvrenTerminalMultiplexer {
    TUVREN_MULTIPLEXER_NONE = 0,
    TUVREN_MULTIPLEXER_TMUX = 1,
    TUVREN_MULTIPLEXER_ZELLIJ = 2,
    TUVREN_MULTIPLEXER_SCREEN = 3,
    TUVREN_MULTIPLEXER_UNKNOWN = 4
} TuvrenTerminalMultiplexer;

typedef enum TuvrenAmbiguousWidth {
    TUVREN_AMBIGUOUS_WIDTH_NEGOTIATED = 0,
    TUVREN_AMBIGUOUS_WIDTH_ONE = 1,
    TUVREN_AMBIGUOUS_WIDTH_TWO = 2
} TuvrenAmbiguousWidth;

typedef enum TuvrenTerminalEventKind {
    TUVREN_TERMINAL_CAPABILITIES_CHANGED = 1,
    TUVREN_TERMINAL_SUSPENDED = 2,
    TUVREN_TERMINAL_RESUMED = 3,
    TUVREN_TERMINAL_DISCONNECTED = 4,
    TUVREN_TERMINAL_WRITE_FAILED = 5
} TuvrenTerminalEventKind;

typedef enum TuvrenTextEditKind {
    TUVREN_TEXT_INSERT = 1,
    TUVREN_TEXT_DELETE = 2,
    TUVREN_TEXT_REPLACE = 3,
    TUVREN_TEXT_SET_CURSOR = 4,
    TUVREN_TEXT_SET_SELECTION = 5,
    TUVREN_TEXT_UNDO = 6,
    TUVREN_TEXT_REDO = 7,
    TUVREN_TEXT_REPLACE_ALL = 8
} TuvrenTextEditKind;

typedef enum TuvrenCollectionMutationKind {
    TUVREN_COLLECTION_INSERT = 1,
    TUVREN_COLLECTION_UPDATE = 2,
    TUVREN_COLLECTION_REMOVE = 3,
    TUVREN_COLLECTION_MOVE = 4,
    TUVREN_COLLECTION_RESET = 5,
    TUVREN_COLLECTION_VISIBLE_RANGE = 6,
    TUVREN_COLLECTION_FOCUS = 7,
    TUVREN_COLLECTION_RELOAD = 8,
    TUVREN_COLLECTION_SELECTION = 9
} TuvrenCollectionMutationKind;

typedef enum TuvrenTranscriptMutationKind {
    TUVREN_TRANSCRIPT_APPEND = 1,
    TUVREN_TRANSCRIPT_REPLACE = 2,
    TUVREN_TRANSCRIPT_REMOVE = 3,
    TUVREN_TRANSCRIPT_STREAM = 4,
    TUVREN_TRANSCRIPT_FINISH = 5,
    TUVREN_TRANSCRIPT_COLLAPSE = 6,
    TUVREN_TRANSCRIPT_RESET = 7,
    TUVREN_TRANSCRIPT_FOLLOW_LIVE = 8,
    TUVREN_TRANSCRIPT_INSERT = 9,
    TUVREN_TRANSCRIPT_PATCH = 10,
    TUVREN_TRANSCRIPT_EXPAND = 11,
    TUVREN_TRANSCRIPT_CLEAR = 12,
    TUVREN_TRANSCRIPT_EVICT = 13,
    TUVREN_TRANSCRIPT_RELOAD = 14
} TuvrenTranscriptMutationKind;

typedef enum TuvrenTerminalRequestKind {
    TUVREN_TERMINAL_READ_CLIPBOARD = 1,
    TUVREN_TERMINAL_WRITE_CLIPBOARD = 2,
    TUVREN_TERMINAL_ANNOUNCE = 3,
    TUVREN_TERMINAL_SUSPEND = 4,
    TUVREN_TERMINAL_RESUME = 5,
    TUVREN_TERMINAL_QUERY_CAPABILITIES = 6,
    TUVREN_TERMINAL_DISCOVER_CLIPBOARD_MEDIA_TYPES = 7
} TuvrenTerminalRequestKind;

typedef enum TuvrenPrimitiveKind {
    TUVREN_PRIMITIVE_BOX = 1,
    TUVREN_PRIMITIVE_TEXT = 2,
    TUVREN_PRIMITIVE_INPUT = 3,
    TUVREN_PRIMITIVE_TEXT_AREA = 4,
    TUVREN_PRIMITIVE_SCROLL = 5,
    TUVREN_PRIMITIVE_OVERLAY = 6,
    TUVREN_PRIMITIVE_COLLECTION = 7,
    TUVREN_PRIMITIVE_TRANSCRIPT = 8,
    TUVREN_PRIMITIVE_SPLIT = 9
} TuvrenPrimitiveKind;

typedef enum TuvrenProperty {
    TUVREN_PROP_LAYOUT_DISPLAY = 0x0101,
    TUVREN_PROP_LAYOUT_WIDTH = 0x0102,
    TUVREN_PROP_LAYOUT_HEIGHT = 0x0103,
    TUVREN_PROP_LAYOUT_MIN_WIDTH = 0x0104,
    TUVREN_PROP_LAYOUT_MAX_WIDTH = 0x0105,
    TUVREN_PROP_LAYOUT_MIN_HEIGHT = 0x0106,
    TUVREN_PROP_LAYOUT_MAX_HEIGHT = 0x0107,
    TUVREN_PROP_LAYOUT_GROW = 0x0108,
    TUVREN_PROP_LAYOUT_SHRINK = 0x0109,
    TUVREN_PROP_LAYOUT_GAP = 0x010A,
    TUVREN_PROP_LAYOUT_ASPECT_RATIO = 0x010B,
    TUVREN_PROP_LAYOUT_OVERFLOW = 0x010C,
    TUVREN_PROP_LAYOUT_GRID = 0x010D,
    TUVREN_PROP_LAYOUT_RESPONSIVE = 0x010E,
    TUVREN_PROP_LAYOUT_SPEC = 0x010F,
    TUVREN_PROP_LAYOUT_POSITION = 0x0110,
    TUVREN_PROP_STYLE_SHEET = 0x0201,
    TUVREN_PROP_STYLE_SLOT = 0x0202,
    TUVREN_PROP_STYLE_INLINE = 0x0203,
    TUVREN_PROP_THEME = 0x0204,
    TUVREN_PROP_TEXT_CONTENT = 0x0301,
    TUVREN_PROP_TEXT_SELECTION = 0x0302,
    TUVREN_PROP_TEXT_CURSOR = 0x0303,
    TUVREN_PROP_TEXT_WRAP = 0x0304,
    TUVREN_PROP_TEXT_TAB_WIDTH = 0x0305,
    TUVREN_PROP_TEXT_DOCUMENT_CONFIG = 0x0306,
    TUVREN_PROP_STATE_VISIBLE = 0x0401,
    TUVREN_PROP_STATE_DISABLED = 0x0402,
    TUVREN_PROP_STATE_SELECTED = 0x0403,
    TUVREN_PROP_STATE_CHECKED = 0x0404,
    TUVREN_PROP_STATE_EXPANDED = 0x0405,
    TUVREN_PROP_STATE_INVALID = 0x0406,
    TUVREN_PROP_STATE_REQUIRED = 0x0407,
    TUVREN_PROP_STATE_ERROR = 0x0408,
    TUVREN_PROP_SEMANTIC_ROLE = 0x0501,
    TUVREN_PROP_SEMANTIC_NAME = 0x0502,
    TUVREN_PROP_SEMANTIC_DESCRIPTION = 0x0503,
    TUVREN_PROP_SEMANTIC_VALUE = 0x0504,
    TUVREN_PROP_SEMANTIC_STATES = 0x0505,
    TUVREN_PROP_SEMANTIC_RELATIONSHIPS = 0x0506
} TuvrenProperty;

/* Command compatibility matrix (all other combinations are invalid):
 * CREATE_NODE/CreateNodePayload; DESTROY_NODE, SET_ROOT/no payload;
 * INSERT_CHILD, REMOVE_CHILD/ChildPayload; layout 0x0101..0x0110 requires
 * SET_PROPERTY_BYTES + VALUE_LAYOUT/LayoutPayload; style 0x0201..0x0204
 * requires SET_PROPERTY_BYTES + VALUE_STYLE/StylePayload; TEXT_CONTENT requires
 * SET_PROPERTY_BYTES + VALUE_TEXT_CONTENT/TextContentPayload; SEMANTIC_ROLE,
 * NAME and DESCRIPTION require SET_PROPERTY_BYTES + VALUE_UTF8;
 * SEMANTIC_VALUE requires SET_PROPERTY_BYTES +
 * VALUE_SEMANTIC/SemanticPayload;
 * TEXT_DOCUMENT_CONFIG requires SET_PROPERTY_BYTES +
 * VALUE_TEXT_DOCUMENT_CONFIG/TextDocumentConfigPayload; TEXT_SELECTION
 * requires SET_PROPERTY_BYTES + VALUE_GRAPHEME_RANGE/GraphemeRange;
 * TEXT_CURSOR, WRAP, TAB_WIDTH and state 0x0401..0x0407 require
 * SET_PROPERTY_U64 + VALUE_U64; STATE_ERROR requires SET_PROPERTY_BYTES +
 * VALUE_UTF8; semantic states and relationships require SET_PROPERTY_BYTES +
 * VALUE_SEMANTIC/SemanticPayload;
 * TEXT_EDIT/TextEditPayload; COLLECTION_APPLY/CollectionMutationPayload;
 * TRANSCRIPT_APPLY/TranscriptMutationPayload; ANIMATION_APPLY and
 * ANIMATION_REPLACE/AnimationPayload; ANIMATION_CANCEL/AnimationPayload with
 * only animation_id set; TERMINAL_REQUEST/TerminalRequestPayload;
 * DIAGNOSTIC_CONFIGURE/DiagnosticConfigPayload. Each fixed payload's size
 * field must equal sizeof(record); nested offsets are relative to the start of
 * the transaction, aligned to four bytes, disjoint, and wholly inside arena.
 */

typedef enum TuvrenEventType {
    TUVREN_EVENT_KEY = 1,
    TUVREN_EVENT_TEXT = 2,
    TUVREN_EVENT_POINTER_MOVE = 3,
    TUVREN_EVENT_POINTER_BUTTON = 4,
    TUVREN_EVENT_WHEEL = 5,
    TUVREN_EVENT_FOCUS = 6,
    TUVREN_EVENT_BLUR = 7,
    TUVREN_EVENT_RESIZE = 8,
    TUVREN_EVENT_PASTE = 9,
    TUVREN_EVENT_CLIPBOARD = 10,
    TUVREN_EVENT_RANGE = 11,
    TUVREN_EVENT_EVICTION = 12,
    TUVREN_EVENT_ANIMATION = 13,
    TUVREN_EVENT_ANNOUNCEMENT = 14,
    TUVREN_EVENT_TERMINAL = 15,
    TUVREN_EVENT_DRAG_START = 16,
    TUVREN_EVENT_DRAG = 17,
    TUVREN_EVENT_DROP = 18,
    TUVREN_EVENT_DRAG_END = 19,
    TUVREN_EVENT_POINTER_CAPTURE = 20
} TuvrenEventType;

typedef enum TuvrenDragPhase {
    TUVREN_DRAG_PHASE_START = 1,
    TUVREN_DRAG_PHASE_MOVE = 2,
    TUVREN_DRAG_PHASE_DROP = 3,
    TUVREN_DRAG_PHASE_END = 4
} TuvrenDragPhase;

typedef enum TuvrenKeyAction {
    TUVREN_KEY_PRESS = 1,
    TUVREN_KEY_REPEAT = 2,
    TUVREN_KEY_RELEASE = 3
} TuvrenKeyAction;

typedef enum TuvrenPointerButtonAction {
    TUVREN_POINTER_PRESS = 1,
    TUVREN_POINTER_RELEASE = 2
} TuvrenPointerButtonAction;

typedef enum TuvrenClipboardStatus {
    TUVREN_CLIPBOARD_UNAVAILABLE = 1,
    TUVREN_CLIPBOARD_DENIED = 2,
    TUVREN_CLIPBOARD_BUSY = 3,
    TUVREN_CLIPBOARD_COMPLETED = 4,
    TUVREN_CLIPBOARD_MALFORMED = 5,
    TUVREN_CLIPBOARD_TIMED_OUT = 6
} TuvrenClipboardStatus;

typedef enum TuvrenRangeState {
    TUVREN_RANGE_LOADING = 1,
    TUVREN_RANGE_EMPTY = 2,
    TUVREN_RANGE_READY = 3,
    TUVREN_RANGE_ERROR = 4
} TuvrenRangeState;

typedef enum TuvrenAnimationStatus {
    TUVREN_ANIMATION_COMPLETED = 1,
    TUVREN_ANIMATION_CANCELLED = 2,
    TUVREN_ANIMATION_REPLACED = 3
} TuvrenAnimationStatus;

typedef enum TuvrenAnnouncementPoliteness {
    TUVREN_ANNOUNCEMENT_POLITE = 1,
    TUVREN_ANNOUNCEMENT_ASSERTIVE = 2
} TuvrenAnnouncementPoliteness;

typedef enum TuvrenDiagnosticKind {
    TUVREN_DIAGNOSTIC_INPUT = 1,
    TUVREN_DIAGNOSTIC_EVENT = 2,
    TUVREN_DIAGNOSTIC_COMMAND = 3,
    TUVREN_DIAGNOSTIC_EFFECT_SPAN = 4,
    TUVREN_DIAGNOSTIC_RECONCILE = 5,
    TUVREN_DIAGNOSTIC_TRANSACTION = 6,
    TUVREN_DIAGNOSTIC_MUTATION = 7,
    TUVREN_DIAGNOSTIC_DIRTY = 8,
    TUVREN_DIAGNOSTIC_LAYOUT = 9,
    TUVREN_DIAGNOSTIC_TEXT = 10,
    TUVREN_DIAGNOSTIC_RENDER = 11,
    TUVREN_DIAGNOSTIC_DIFF = 12,
    TUVREN_DIAGNOSTIC_TERMINAL_WRITE = 13,
    TUVREN_DIAGNOSTIC_ERROR = 14,
    TUVREN_DIAGNOSTIC_CLEANUP = 15,
    TUVREN_DIAGNOSTIC_UNATTRIBUTED = 16,
    TUVREN_DIAGNOSTIC_CONTEXT = 17
} TuvrenDiagnosticKind;

typedef enum TuvrenDiagnosticSubjectKind {
    TUVREN_DIAGNOSTIC_SUBJECT_COMPONENT = 1,
    TUVREN_DIAGNOSTIC_SUBJECT_TEXT_DOCUMENT = 2
} TuvrenDiagnosticSubjectKind;

typedef struct TuvrenKeyEventPayload {
    uint16_t size;
    uint16_t action; /* TuvrenKeyAction */
    uint32_t modifiers;
    uint32_t key_code; /* Unicode scalar or TuvrenNamedKeyCode */
    uint32_t physical_code; /* USB HID usage ID; 0 when unavailable */
    uint32_t text_offset;
    uint32_t text_length;
} TuvrenKeyEventPayload;

typedef struct TuvrenTextEventPayload {
    uint16_t size;
    uint16_t reserved;
    uint32_t utf8_offset;
    uint32_t utf8_length;
} TuvrenTextEventPayload;

typedef struct TuvrenPointerMoveEventPayload {
    uint16_t size;
    uint16_t reserved;
    int32_t cell_x;
    int32_t cell_y;
    int32_t pixel_x;
    int32_t pixel_y;
    uint32_t buttons_mask; /* bit (TuvrenPointerButton - 1) */
    uint32_t modifiers;
} TuvrenPointerMoveEventPayload;

typedef struct TuvrenPointerButtonEventPayload {
    uint16_t size;
    uint16_t action; /* TuvrenPointerButtonAction */
    int32_t cell_x;
    int32_t cell_y;
    uint32_t button; /* TuvrenPointerButton */
    uint32_t click_count;
    uint32_t modifiers;
    uint32_t reserved;
} TuvrenPointerButtonEventPayload;

typedef struct TuvrenWheelEventPayload {
    uint16_t size;
    uint16_t reserved;
    int32_t cell_x;
    int32_t cell_y;
    int32_t delta_rows;
    int32_t delta_columns;
    int32_t delta_pixel_x;
    int32_t delta_pixel_y;
    uint32_t modifiers;
    uint32_t reserved1;
} TuvrenWheelEventPayload;

typedef struct TuvrenDragEventPayload {
    uint16_t size;
    uint16_t phase; /* TuvrenDragPhase, matching the Event type */
    uint32_t source;
    uint32_t drop_target; /* zero when no target */
    int32_t cell_x;
    int32_t cell_y;
    int32_t pixel_x;
    int32_t pixel_y;
    uint32_t button; /* TuvrenPointerButton */
    uint32_t flags; /* TUVREN_DRAG_* */
    uint32_t pointer_id; /* zero for terminals without pointer identity */
} TuvrenDragEventPayload;

typedef struct TuvrenPointerCaptureEventPayload {
    uint16_t size;
    uint16_t captured; /* zero or one */
    uint32_t owner;
    uint32_t pointer_id;
    uint32_t button; /* TuvrenPointerButton */
} TuvrenPointerCaptureEventPayload;

typedef struct TuvrenResizeEventPayload {
    uint16_t size;
    uint16_t reserved;
    uint32_t width_cells;
    uint32_t height_cells;
    uint32_t width_pixels;
    uint32_t height_pixels;
    uint32_t cell_width_pixels;
    uint32_t cell_height_pixels;
} TuvrenResizeEventPayload;

typedef struct TuvrenPasteEventPayload {
    uint16_t size;
    uint16_t flags;
    uint32_t utf8_offset;
    uint32_t utf8_length;
} TuvrenPasteEventPayload;

typedef struct TuvrenClipboardEventPayload {
    uint16_t size;
    uint16_t status; /* TuvrenClipboardStatus */
    uint32_t target; /* TuvrenClipboardTarget */
    uint32_t media_type_offset;
    uint32_t media_type_length;
    uint32_t data_offset;
    uint32_t data_length;
    uint64_t request_id;
    uint32_t flags;
    uint32_t reserved;
} TuvrenClipboardEventPayload;

typedef struct TuvrenRangeEventPayload {
    uint16_t size;
    uint16_t state; /* TuvrenRangeState */
    uint32_t start;
    uint32_t count;
    uint32_t total_count;
    uint32_t message_offset;
    uint32_t message_length;
    uint32_t flags;
    uint32_t reserved;
    uint64_t generation;
} TuvrenRangeEventPayload;

typedef struct TuvrenEvictionEventPayload {
    uint16_t size;
    uint16_t resource_kind; /* TUVREN_PRIMITIVE_COLLECTION or TRANSCRIPT */
    uint32_t identities_offset;
    uint32_t identity_count;
    uint32_t identity_record_bytes;
    uint64_t generation;
} TuvrenEvictionEventPayload;

typedef struct TuvrenIdentityRecord {
    uint16_t size;
    uint16_t tag; /* TuvrenIdentityTag */
    uint32_t utf8_offset;
    uint32_t utf8_length;
    uint32_t node_reference;
    double number;
} TuvrenIdentityRecord;

typedef struct TuvrenAnimationEventPayload {
    uint16_t size;
    uint16_t status; /* TuvrenAnimationStatus */
    uint32_t reserved;
    uint64_t animation_id;
} TuvrenAnimationEventPayload;

typedef struct TuvrenAnnouncementEventPayload {
    uint16_t size;
    uint16_t politeness; /* TuvrenAnnouncementPoliteness */
    uint32_t text_offset;
    uint32_t text_length;
} TuvrenAnnouncementEventPayload;

typedef struct TuvrenTerminalEventPayload {
    uint16_t size;
    uint16_t event_kind; /* TuvrenTerminalEventKind */
    uint32_t status; /* TuvrenStatus */
    uint32_t payload_offset;
    uint32_t payload_length;
} TuvrenTerminalEventPayload;

typedef struct TuvrenTerminalCapabilitiesPayload {
    uint16_t size;
    uint16_t tier; /* TuvrenTerminalTier */
    uint32_t color_depth; /* 16, 256, or 16777216 */
    uint64_t capability_flags; /* TUVREN_CAP_* */
    uint32_t width_cells;
    uint32_t height_cells;
    uint32_t terminal_width_pixels;
    uint32_t terminal_height_pixels;
    uint32_t cell_width_pixels;
    uint32_t cell_height_pixels;
    uint16_t theme; /* TuvrenTerminalTheme */
    uint16_t multiplexer; /* TuvrenTerminalMultiplexer */
    uint16_t ambiguous_width; /* TuvrenAmbiguousWidth */
    uint16_t reserved;
} TuvrenTerminalCapabilitiesPayload;

typedef struct TuvrenContextOptions {
    uint16_t size;
    uint16_t mode; /* TuvrenContextMode */
    uint32_t width_cells;
    uint32_t height_cells;
    uint32_t screen_mode; /* TuvrenScreenMode */
    uint32_t external_output_mode; /* TuvrenExternalOutputMode */
    uint16_t diagnostic_mode; /* TuvrenDiagnosticMode */
    uint16_t reserved;
    uint32_t diagnostic_flags; /* TUVREN_DIAGNOSTIC_CONFIG_* */
    uint64_t queue_byte_limit;
    uint64_t diagnostic_byte_limit;
} TuvrenContextOptions;

/* RUNTIME_REPLAY_CAPTURE is accepted only at context creation together with
 * FULL_TRACE and INCLUDE_FULL_CONTENT. The Host Environment requires explicit
 * confirmation before encoding it. Later DIAGNOSTIC_CONFIGURE transactions
 * may change ordinary tracing but cannot make a partial trace replay-capable. */

typedef struct TuvrenTransactionHeader {
    uint32_t magic;
    uint16_t abi_major;
    uint16_t abi_minor;
    uint64_t transaction_id;
    uint32_t command_count;
    uint32_t commands_offset;
    uint32_t commands_bytes;
    uint32_t arena_offset;
    uint32_t arena_bytes;
    uint32_t flags;
    uint32_t reserved;
} TuvrenTransactionHeader;

typedef struct TuvrenTransactionCommand {
    uint16_t opcode;
    uint16_t flags;
    uint32_t target;
    uint32_t property;
    uint32_t value_tag;
    uint32_t payload_offset;
    uint32_t payload_length;
    uint32_t argument0;
    uint32_t argument1;
    uint64_t generation;
} TuvrenTransactionCommand;

/* TransactionCommand.flags and every field named reserved must be zero in ABI
 * 2.0. Decoders reject nonzero values so later minor versions may assign them
 * without ambiguity. */

/* A create command uses target = TUVREN_NODE_REF_LOCAL_BIT | local_id. The
 * runtime allocates the private node ID and returns the mapping after the full
 * transaction commits. Other commands in the same transaction may use that
 * local reference. Local ID 0 and runtime node ID 0 are invalid. */
typedef struct TuvrenNodeMapping {
    uint32_t local_reference;
    uint32_t runtime_node_id;
} TuvrenNodeMapping;

typedef struct TuvrenCreateNodePayload {
    uint16_t size;
    uint16_t primitive_kind; /* TuvrenPrimitiveKind */
    uint32_t initial_generation;
} TuvrenCreateNodePayload;

typedef struct TuvrenChildPayload {
    uint16_t size;
    uint16_t reserved;
    uint32_t parent;
    uint32_t child;
    uint32_t index;
} TuvrenChildPayload;

typedef struct TuvrenDimensionAtom {
    uint16_t tag; /* TuvrenDimensionTag */
    uint16_t flags; /* must be zero in ABI 2.0 */
    float value;
} TuvrenDimensionAtom;

typedef struct TuvrenDimension {
    uint16_t size;
    uint16_t present_mask;
    TuvrenDimensionAtom minimum;
    TuvrenDimensionAtom preferred;
    TuvrenDimensionAtom maximum;
} TuvrenDimension;

typedef struct TuvrenGridTrack {
    uint16_t size;
    uint16_t kind; /* TuvrenGridTrackKind */
    float fraction;
    uint32_t reserved;
    TuvrenDimension minimum;
    TuvrenDimension maximum;
} TuvrenGridTrack;

typedef struct TuvrenResponsiveCondition {
    uint32_t present_mask;
    float min_width_cells;
    float max_width_cells;
    float min_height_cells;
    float max_height_cells;
    float min_width_percent;
    float max_width_percent;
    float min_height_percent;
    float max_height_percent;
} TuvrenResponsiveCondition;

typedef struct TuvrenLayoutPayload {
    uint16_t size;
    uint16_t display; /* TuvrenDisplayMode */
    uint16_t position; /* TuvrenPositionMode */
    uint16_t flex_direction; /* TuvrenFlexDirection */
    uint16_t flex_wrap; /* TuvrenFlexWrap */
    uint16_t align_items; /* TuvrenAlignMode */
    uint16_t align_self; /* TuvrenAlignMode */
    uint16_t align_content; /* TuvrenJustifyMode */
    uint16_t justify_content; /* TuvrenJustifyMode */
    TuvrenDimension width;
    TuvrenDimension height;
    TuvrenDimension min_width;
    TuvrenDimension max_width;
    TuvrenDimension min_height;
    TuvrenDimension max_height;
    TuvrenDimension flex_basis;
    TuvrenDimension top;
    TuvrenDimension right;
    TuvrenDimension bottom;
    TuvrenDimension left;
    float grow;
    float shrink;
    float row_gap;
    float column_gap;
    float aspect_ratio;
    uint32_t overflow; /* TuvrenOverflowMode */
    uint32_t row_tracks_offset;
    uint32_t row_track_count;
    uint32_t column_tracks_offset;
    uint32_t column_track_count;
    uint32_t grid_row;
    uint32_t grid_column;
    uint32_t grid_row_span;
    uint32_t grid_column_span;
    uint32_t responsive_rules_offset;
    uint32_t responsive_rule_count;
} TuvrenLayoutPayload;

typedef struct TuvrenResponsiveLayoutRule {
    TuvrenResponsiveCondition condition;
    uint32_t layout_offset;
    uint32_t layout_length;
} TuvrenResponsiveLayoutRule;

typedef struct TuvrenStyleValue {
    uint16_t size;
    uint16_t kind; /* TuvrenStyleValueKind */
    uint16_t value_tag; /* TuvrenThemeTokenValueTag */
    uint16_t flags; /* TUVREN_STYLE_VALUE_* */
    uint32_t token_offset;
    uint32_t token_length;
    uint64_t literal_bits;
} TuvrenStyleValue;

typedef struct TuvrenThemeTokenRecord {
    uint32_t name_offset;
    uint32_t name_length;
    uint16_t value_tag; /* TuvrenThemeTokenValueTag */
    uint16_t reserved;
    uint32_t value_offset;
    uint32_t value_length;
    uint64_t scalar_bits;
} TuvrenThemeTokenRecord;

typedef struct TuvrenStyleAttributeTokenRecord {
    uint32_t attribute; /* exactly one TUVREN_STYLE_ATTR_* bit */
    uint32_t token_offset;
    uint32_t token_length;
    uint32_t flags; /* TUVREN_STYLE_VALUE_* */
    uint32_t fallback_value; /* zero or one */
    uint32_t reserved;
} TuvrenStyleAttributeTokenRecord;

typedef struct TuvrenStylePayload {
    uint16_t size;
    uint16_t kind; /* TuvrenStylePayloadKind */
    uint32_t present_mask;
    TuvrenStyleValue foreground;
    TuvrenStyleValue background;
    uint32_t attributes; /* TUVREN_STYLE_ATTR_* */
    uint32_t attribute_tokens_offset;
    uint32_t attribute_token_count;
    uint32_t border; /* TuvrenBorderKind */
    uint32_t border_token_offset;
    uint32_t border_token_length;
    uint32_t border_token_flags; /* TUVREN_STYLE_VALUE_* */
    uint16_t padding_top;
    uint16_t padding_right;
    uint16_t padding_bottom;
    uint16_t padding_left;
    uint32_t padding_token_offset;
    uint32_t padding_token_length;
    uint32_t padding_token_flags; /* TUVREN_STYLE_VALUE_* */
    TuvrenStyleValue opacity;
    uint32_t rules_offset;
    uint32_t rule_count;
    uint32_t theme_tokens_offset;
    uint32_t theme_token_count;
} TuvrenStylePayload;

/* StyleValue literal_bits stores packed RGBA for COLOR, IEEE-754 bits for
 * NUMBER, and zero/one for BOOLEAN. TOKEN requires a nonempty UTF-8 name; its
 * fallback uses literal_bits only when HAS_FALLBACK is set. Boolean attribute
 * tokens use a packed TuvrenStyleAttributeTokenRecord array. Border and uniform
 * padding tokens use their dedicated UTF-8 name and flag fields; their literal
 * fields act as the fallback when HAS_FALLBACK is set. Theme StylePayload
 * records a packed TuvrenThemeTokenRecord array.
 * UTF8 token values use the record's value offset and length; scalar values
 * require both to be zero. */

typedef struct TuvrenStyleRulePayload {
    uint64_t state_mask; /* TUVREN_STYLE_STATE_* */
    TuvrenResponsiveCondition responsive;
    uint16_t mode; /* TuvrenThemeMode */
    uint16_t reduced_motion; /* TuvrenOptionalBoolean */
    uint16_t capability_tier; /* TuvrenCapabilityTier */
    uint16_t reserved0;
    uint32_t minimum_colors; /* 0, 16, 256, or 16777216 */
    uint32_t name_offset;
    uint32_t name_length;
    uint32_t style_offset;
    uint32_t style_length;
    uint32_t source_offset;
    uint32_t source_length;
} TuvrenStyleRulePayload;

typedef struct TuvrenGraphemeRange {
    uint32_t start;
    uint32_t end;
} TuvrenGraphemeRange;

typedef struct TuvrenSemanticPayload {
    uint16_t size;
    uint16_t kind; /* TuvrenSemanticPayloadKind */
    uint32_t entries_offset;
    uint32_t entry_count;
    uint32_t reserved;
} TuvrenSemanticPayload;

typedef struct TuvrenSemanticEntry {
    uint32_t key_offset;
    uint32_t key_length;
    uint32_t value_offset_or_low;
    uint32_t value_length_or_high;
    uint32_t value_tag; /* UTF8/U64/I64/F64; BYTES is packed u32 node refs */
    uint32_t reserved;
} TuvrenSemanticEntry;

/* Semantic VALUE contains exactly one entry with an empty key and UTF8 or F64
 * value. STATES uses nonempty UTF-8 keys and UTF8, F64, or U64 restricted to
 * zero/one. RELATIONSHIPS uses nonempty keys and BYTES containing packed u32
 * node references. UTF8/BYTES use value_offset_or_low and
 * value_length_or_high as an arena range. Numeric tags split the exact 64-bit
 * scalar representation into low/high 32-bit words; F64 must be finite. */

typedef struct TuvrenTextContentPayload {
    uint16_t size;
    uint16_t kind; /* TuvrenTextContentKind */
    uint32_t source_offset;
    uint32_t source_length;
    uint32_t language_offset;
    uint32_t language_length;
    uint32_t spans_offset;
    uint32_t span_count;
} TuvrenTextContentPayload;

typedef struct TuvrenStyledSpanRecord {
    uint32_t text_offset;
    uint32_t text_length;
    uint32_t style_offset;
    uint32_t style_length;
    uint32_t link_offset;
    uint32_t link_length;
} TuvrenStyledSpanRecord;

/* PLAIN, MARKDOWN, CODE, and ANSI use source. CODE may additionally use a
 * UTF-8 language; the other source kinds require zero language fields. STYLED
 * requires zero source/language fields and a packed StyledSpanRecord array.
 * Each nonzero style range contains one exact TuvrenStylePayload. Links are
 * validated URLs. Markdown and code are parsed natively; ANSI is sanitized to
 * approved styling and can never carry terminal control operations. */

typedef struct TuvrenTextDocumentConfigPayload {
    uint16_t size;
    uint16_t line_ending; /* TuvrenLineEnding */
    uint16_t indentation_style; /* TuvrenIndentationStyle */
    uint16_t indentation_width; /* ignored for tabs */
    uint32_t flags; /* TUVREN_TEXT_CONFIG_* */
    uint32_t tab_width;
    uint64_t max_graphemes;
    uint32_t validation_rules_offset;
    uint32_t validation_rule_count;
} TuvrenTextDocumentConfigPayload;

typedef struct TuvrenTextValidationRuleRecord {
    uint16_t size;
    uint16_t kind; /* TuvrenTextValidationKind */
    uint32_t flags; /* TUVREN_TEXT_VALIDATION_* */
    uint64_t grapheme_limit;
    uint32_t pattern_offset;
    uint32_t pattern_length;
    uint32_t message_offset;
    uint32_t message_length;
} TuvrenTextValidationRuleRecord;

/* Length rules use grapheme_limit and zero pattern fields. Pattern rules use a
 * bounded UTF-8 Rust-regex expression plus declared flags and set
 * grapheme_limit to zero. Every rule requires a bounded UTF-8 message. Native
 * input applies read-only, required, maximum-length, line-ending, indentation,
 * secure-entry, and validation rules before accepting an edit; Rust never
 * invokes a host validation callback. */

typedef struct TuvrenTextEditPayload {
    uint16_t size;
    uint16_t edit_kind; /* TuvrenTextEditKind */
    TuvrenGraphemeRange range;
    uint32_t utf8_offset;
    uint32_t utf8_length;
    uint32_t replacement_offset;
    uint32_t replacement_length;
    uint32_t search_flags; /* TUVREN_TEXT_EDIT_FIND_* */
    uint32_t reserved;
    uint64_t content_epoch;
} TuvrenTextEditPayload;

/* REPLACE_ALL uses UTF-8 as the query, replacement_offset/replacement_length as
 * replacement text, range.start as the optional starting grapheme, and search
 * flags as its options. Other text edits require replacement and search fields
 * to be zero. UNDO and REDO require all text and range fields to be zero. */

typedef struct TuvrenCollectionMutationPayload {
    uint16_t size;
    uint16_t mutation_kind; /* TuvrenCollectionMutationKind */
    uint16_t key_tag; /* TuvrenCollectionKeyTag */
    uint16_t reserved0;
    uint32_t key_offset;
    uint32_t key_length;
    double key_number;
    uint32_t items_offset;
    uint32_t item_count;
    uint32_t item_record_bytes;
    uint32_t keys_offset;
    uint32_t key_count;
    uint32_t key_record_bytes;
    uint32_t reserved1;
    uint64_t index;
    uint64_t secondary_index;
    uint64_t generation;
} TuvrenCollectionMutationPayload;

typedef struct TuvrenCollectionItemRecord {
    uint16_t size;
    uint16_t key_tag; /* TuvrenCollectionKeyTag */
    uint32_t key_offset;
    uint32_t key_length;
    double key_number;
    uint32_t node_reference;
    uint32_t estimated_height;
    uint32_t flags; /* reserved; zero in ABI 2.0 */
    uint32_t reserved;
} TuvrenCollectionItemRecord;

typedef struct TuvrenCollectionScrollPositionPayload {
    uint16_t size;
    uint16_t key_tag; /* TuvrenCollectionKeyTag; zero when no anchor exists */
    uint32_t key_offset;
    uint32_t key_length;
    uint32_t reserved;
    double key_number;
    int64_t offset_rows;
    int64_t offset_pixels; /* INT64_MIN when pixel position is unavailable */
    uint64_t generation;
    uint64_t observed_transaction_id;
    uint64_t observed_render_request_id;
} TuvrenCollectionScrollPositionPayload;

/* Numeric Collection keys are finite IEEE-754 doubles. Encoders normalize
 * negative zero to positive zero and reject NaN and infinities. UTF-8 keys use
 * key_offset/key_length; numeric keys require both fields to be zero. Host-side
 * T values never cross the ABI. INSERT and UPDATE use exactly one
 * TuvrenCollectionItemRecord; RESET uses a packed record array. Each record
 * carries the stable key, projected RuntimeNode reference, and estimated row
 * height needed by the native projection. MOVE and REMOVE use the single key.
 * SELECTION uses a packed TuvrenIdentityRecord array in keys_offset/key_count,
 * requires key_record_bytes == sizeof(TuvrenIdentityRecord), and sets the
 * single-key and item fields to zero. Other mutations set all keys fields to
 * zero. item_record_bytes must equal sizeof(TuvrenCollectionItemRecord) when
 * item_count is nonzero and be zero otherwise. */

typedef struct TuvrenTranscriptMutationPayload {
    uint16_t size;
    uint16_t mutation_kind; /* TuvrenTranscriptMutationKind */
    uint32_t block_id_offset;
    uint32_t block_id_length;
    uint32_t content_offset;
    uint32_t content_length;
    uint32_t records_offset;
    uint32_t record_count;
    uint64_t version;
    uint64_t generation;
    uint64_t index;
    TuvrenGraphemeRange range;
    uint32_t flags; /* TUVREN_TRANSCRIPT_* */
    uint32_t reserved;
} TuvrenTranscriptMutationPayload;

typedef struct TuvrenTranscriptBlockRecord {
    uint32_t block_id_offset;
    uint32_t block_id_length;
    uint32_t content_offset;
    uint32_t content_length;
    uint64_t version;
    uint32_t flags; /* TUVREN_TRANSCRIPT_* */
    uint32_t reserved;
} TuvrenTranscriptBlockRecord;

/* APPEND/INSERT/REPLACE content contains one exact TuvrenTextContentPayload;
 * INSERT additionally uses index. STREAM and PATCH content is raw bounded UTF-8
 * because it edits an existing Text Document, and PATCH additionally uses
 * range. FINISH/COLLAPSE/EXPAND/REMOVE have zero content fields. CLEAR uses
 * generation only. EVICT, RESET, and RELOAD use a packed array of
 * TuvrenTranscriptBlockRecord; RESET and RELOAD record content contains one
 * exact TuvrenTextContentPayload, EVICT requires zero content fields, and
 * RELOAD additionally uses index as the resident start. All nested text-content
 * offsets remain relative to the transaction start. */

typedef struct TuvrenAnimationPayload {
    uint16_t size;
    uint16_t property; /* TuvrenAnimationProperty */
    uint16_t value_tag;
    uint16_t reduced_motion; /* TuvrenReducedMotionMode */
    uint16_t easing; /* TuvrenAnimationEasing */
    uint16_t timeline_mode; /* TuvrenAnimationTimelineMode */
    uint64_t animation_id;
    uint64_t timeline_id;
    uint64_t duration_nanos;
    uint64_t delay_nanos;
    uint32_t repeat_count;
    uint32_t flags;
    uint32_t sequence_index;
    uint32_t reserved;
    double from_number;
    double to_number;
    uint32_t from_rgba;
    uint32_t to_rgba;
} TuvrenAnimationPayload;

/* Animation value_tag is F64 for opacity/position/dimension/scroll and U64 for
 * packed RGBA color. from fields are read only with TUVREN_ANIMATION_HAS_FROM.
 * repeat_count is ignored with REPEAT_INFINITE. */

typedef struct TuvrenTerminalRequestPayload {
    uint16_t size;
    uint16_t request_kind; /* TuvrenTerminalRequestKind */
    uint32_t target; /* TuvrenClipboardTarget or 0 when not applicable */
    uint32_t media_type_offset;
    uint32_t media_type_length;
    uint32_t data_offset;
    uint32_t data_length;
    uint64_t request_id;
    uint64_t timeout_nanos;
} TuvrenTerminalRequestPayload;

/* READ_CLIPBOARD uses target and zero data fields; WRITE_CLIPBOARD requires
 * target, media type, and data; ANNOUNCE requires UTF-8 data with target 0;
 * DISCOVER_CLIPBOARD_MEDIA_TYPES uses target and zero data fields, then emits
 * one Clipboard Event per media type and marks the final chunk; an empty result
 * emits one completed final Event with an empty media type. SUSPEND,
 * RESUME, and QUERY_CAPABILITIES require all arena fields and target to be
 * zero. Text convenience APIs use bounded UTF-8 with the text/plain media type
 * over the ordinary READ and WRITE requests. */

typedef struct TuvrenDiagnosticConfigPayload {
    uint16_t size;
    uint16_t mode; /* TuvrenDiagnosticMode */
    uint32_t flags; /* TUVREN_DIAGNOSTIC_CONFIG_INCLUDE_* */
    uint64_t record_byte_limit;
    uint64_t snapshot_byte_limit;
} TuvrenDiagnosticConfigPayload;

typedef struct TuvrenApplyResult {
    uint16_t size;
    uint16_t status;
    uint32_t failed_command_index;
    uint64_t transaction_id;
    uint64_t render_request_id;
    uint32_t mapping_count;
    uint32_t required_mapping_count;
    uint32_t command_result_count;
    uint32_t required_command_result_count;
} TuvrenApplyResult;

typedef struct TuvrenCommandResult {
    uint32_t command_index;
    uint32_t value_tag; /* TuvrenValueTag */
    uint64_t value0;
    uint64_t value1;
} TuvrenCommandResult;

/* Successful REPLACE_ALL commands return their replacement count in value0;
 * successful UNDO and REDO commands return zero or one in value0. Commands
 * ANIMATION_REPLACE returns its newly allocated animation ID in value0 so the
 * replacement handle has an independently observable completion. Commands
 * without a scalar result do not produce a TuvrenCommandResult. Result and
 * node-mapping capacities are preflighted before mutation, so an undersized
 * caller buffer returns BUFFER_TOO_SMALL without applying the transaction. */

typedef struct TuvrenQueryRequest {
    uint32_t magic;
    uint16_t size;
    uint16_t kind; /* TuvrenQueryKind */
    uint32_t target;
    uint32_t flags; /* query-kind-specific TUVREN_QUERY_* */
    uint32_t argument0;
    uint32_t payload_offset;
    uint32_t payload_length;
    uint32_t reserved;
    uint64_t generation;
    TuvrenGraphemeRange range;
} TuvrenQueryRequest;

typedef struct TuvrenQueryResult {
    uint16_t size;
    uint16_t status; /* TuvrenStatus */
    uint32_t value_tag; /* TuvrenValueTag */
    uint64_t generation;
    TuvrenGraphemeRange range;
    uint64_t value0;
    uint64_t value1;
    uint64_t required_bytes;
    uint64_t written_bytes;
} TuvrenQueryResult;

/* Query input and output are caller-owned and never retained. payload_offset
 * is relative to query_input and payload_length is bounded by both
 * query_input_length and TUVREN_MAX_QUERY_INPUT_BYTES. TEXT_SNAPSHOT writes
 * UTF-8 content, returns document version in generation, cursor (or UINT64_MAX)
 * in value0, canUndo/canRedo/hasSelection bits in value1, and selection in
 * range only when HAS_SELECTION is set. TEXT_FIND
 * reads its UTF-8 search term from the payload, uses argument0 as its starting
 * grapheme and TUVREN_QUERY_FIND_* flags as options, then writes matched UTF-8
 * and returns the match range; no match returns UNAVAILABLE. TEXT_ENCODE uses
 * argument0 as TuvrenTextEncoding and writes encoded bytes. Collection and
 * Transcript visible-range queries write no bytes and return their generation
 * and resident range. COLLECTION_SCROLL_POSITION writes exactly one
 * TuvrenCollectionScrollPositionPayload plus any UTF-8 anchor key in the same
 * output buffer; key_offset is relative to the output-buffer start. A missing
 * anchor uses key_tag/key offsets/key number zero. String and numeric anchors
 * follow the same canonical key rules as Collection mutations. The executor
 * copies committed results into the SDK controller cache; public
 * lastScrollPosition() access never calls this query synchronously.
 * TERMINAL_CAPABILITIES writes exactly one
 * TuvrenTerminalCapabilitiesPayload. Every BUFFER_TOO_SMALL response reports
 * required_bytes and writes no partial semantic value. */

typedef struct TuvrenRecordBatchHeader {
    uint32_t magic;
    uint16_t abi_major;
    uint16_t abi_minor;
    uint32_t record_count;
    uint32_t records_offset;
    uint32_t records_bytes;
    uint32_t arena_offset;
    uint32_t arena_bytes;
    uint32_t reserved;
} TuvrenRecordBatchHeader;

typedef struct TuvrenEventRecord {
    uint64_t event_id;
    uint64_t timestamp_nanos;
    uint16_t event_type;
    uint16_t flags;
    uint32_t target;
    uint32_t payload_offset;
    uint32_t payload_length;
    int32_t argument0;
    int32_t argument1;
    int32_t argument2;
    int32_t argument3;
} TuvrenEventRecord;

/* Event payload compatibility: KEY/KeyEventPayload, TEXT/TextEventPayload,
 * POINTER_MOVE/PointerMoveEventPayload, POINTER_BUTTON/PointerButtonEventPayload,
 * WHEEL/WheelEventPayload, RESIZE/ResizeEventPayload, PASTE/PasteEventPayload,
 * CLIPBOARD/ClipboardEventPayload, RANGE/RangeEventPayload,
 * EVICTION/EvictionEventPayload, ANIMATION/AnimationEventPayload,
 * ANNOUNCEMENT/AnnouncementEventPayload, TERMINAL/TerminalEventPayload,
 * DRAG_START/DRAG/DROP/DRAG_END/DragEventPayload, and
 * POINTER_CAPTURE/PointerCaptureEventPayload.
 * FOCUS and BLUR have payload_length 0. argument0..argument3 are reserved and
 * must be zero in ABI 2.0; typed data lives only in the named payload record.
 * Every nested offset is relative to the batch start and inside its arena. */
/* TERMINAL_CAPABILITIES_CHANGED requires TerminalEventPayload's nested payload
 * to be exactly one TerminalCapabilitiesPayload. Other Terminal Event kinds
 * require nested payload_length 0. Eviction identity_record_bytes must equal
 * sizeof(TuvrenIdentityRecord). */

typedef struct TuvrenDiagnosticRecord {
    uint64_t sequence;
    uint64_t timestamp_nanos;
    uint64_t record_id;
    uint64_t parent_record_id; /* zero only for a causal root */
    uint16_t kind; /* TuvrenDiagnosticKind */
    uint16_t flags; /* TUVREN_DIAGNOSTIC_* record flags */
    uint32_t reserved;
    uint64_t event_id;
    uint64_t command_instance_id;
    uint64_t effect_span_id;
    uint64_t transaction_id;
    uint64_t render_request_id;
    uint64_t diagnostic_subject_id;
    uint16_t diagnostic_subject_kind; /* TuvrenDiagnosticSubjectKind; zero if absent */
    uint16_t reserved1;
    uint32_t reserved2;
    uint32_t payload_offset;
    uint32_t payload_length;
} TuvrenDiagnosticRecord;

/* record_id is unique inside one context and serializes as correlation.recordId.
 * parent_record_id serializes as correlation.parentRecordId and must name an
 * earlier retained record. The drained context supplies correlation.contextId.
 * command_instance_id is the invocation identity; stable CommandId text lives
 * in the validated payload. effect_span_id maps Effect spans.
 * diagnostic_subject_id is a trace-scoped opaque identity—not a RuntimeNode or
 * TextDocument handle—and subject_kind distinguishes Component from standalone
 * Text Document work. Zero means unavailable. Domain IDs label the current
 * record and never substitute for parent_record_id. A RING_WRAPPED record has
 * kind UNATTRIBUTED and stores the current transaction/render identities in
 * their ordinary fields; serialization emits them as the typed boundary
 * payload used by wrap-baseline validation. */

typedef struct TuvrenRenderOptions {
    uint16_t size;
    uint16_t flags;
    uint32_t reserved;
    uint64_t elapsed_nanos;
} TuvrenRenderOptions;

typedef struct TuvrenRenderResult {
    uint16_t size;
    uint16_t presentation_tier_hz; /* 0, 60, 90, or 120 */
    uint32_t dirty_cells;
    uint64_t render_request_id;
    uint64_t engine_nanos;
    uint64_t write_nanos;
    uint64_t bytes_written;
} TuvrenRenderResult;

typedef struct TuvrenDrainResult {
    uint16_t size;
    uint16_t status;
    uint32_t record_count;
    uint64_t required_bytes;
    uint64_t written_bytes;
} TuvrenDrainResult;

/* Returns (TUVREN_ABI_MAJOR << 16) | TUVREN_ABI_MINOR. */
TUVREN_API uint32_t tui_abi_version(void);

TUVREN_API int32_t tui_context_create(
    const TuvrenContextOptions *options,
    TuvrenContextId *out_context
);

TUVREN_API int32_t tui_context_destroy(TuvrenContextId context);

TUVREN_API int32_t tui_transaction_apply(
    TuvrenContextId context,
    const uint8_t *transaction_bytes,
    size_t transaction_length,
    TuvrenNodeMapping *node_mappings,
    size_t node_mapping_capacity,
    TuvrenCommandResult *command_results,
    size_t command_result_capacity,
    TuvrenApplyResult *out_result
);

TUVREN_API int32_t tui_query_copy(
    TuvrenContextId context,
    const TuvrenQueryRequest *request,
    const uint8_t *query_input,
    size_t query_input_length,
    uint8_t *output,
    size_t output_capacity,
    TuvrenQueryResult *out_result
);

TUVREN_API int32_t tui_input_poll(TuvrenContextId context, uint32_t timeout_millis);

TUVREN_API int32_t tui_event_drain(
    TuvrenContextId context,
    uint8_t *output,
    size_t output_capacity,
    TuvrenDrainResult *out_result
);

TUVREN_API int32_t tui_render(
    TuvrenContextId context,
    const TuvrenRenderOptions *options,
    TuvrenRenderResult *out_result
);

TUVREN_API int32_t tui_diagnostic_drain(
    TuvrenContextId context,
    uint8_t *output,
    size_t output_capacity,
    TuvrenDrainResult *out_result
);

TUVREN_API int32_t tui_error_copy(
    TuvrenContextId context,
    uint8_t *output,
    size_t output_capacity,
    TuvrenDrainResult *out_result
);

/* Headless-only test protocol. Synthetic input uses the same Event batch wire
 * shape as tui_event_drain. Snapshot and leak output are bounded UTF-8 JSON
 * objects validated against their registered schemas. */
TUVREN_API int32_t tui_test_event_push(
    TuvrenContextId context,
    const uint8_t *event_batch,
    size_t event_batch_length
);
TUVREN_API int32_t tui_snapshot_copy(
    TuvrenContextId context,
    uint8_t *output,
    size_t output_capacity,
    TuvrenDrainResult *out_result
);
TUVREN_API int32_t tui_context_check_leaks(
    TuvrenContextId context,
    uint8_t *output,
    size_t output_capacity,
    TuvrenDrainResult *out_result
);

/* Drain buffers begin with TuvrenRecordBatchHeader. Event batches contain
 * TuvrenEventRecord entries; diagnostic batches contain TuvrenDiagnosticRecord
 * entries. Offsets are relative to the first byte of the caller-owned output.
 * tui_error_copy writes one bounded UTF-8 JSON object into caller-owned output.
 */

TUVREN_STATIC_ASSERT(sizeof(TuvrenContextOptions) == 48, "TuvrenContextOptions ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTransactionHeader) == 48, "TuvrenTransactionHeader ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTransactionCommand) == 40, "TuvrenTransactionCommand ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenNodeMapping) == 8, "TuvrenNodeMapping ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenCreateNodePayload) == 8, "TuvrenCreateNodePayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenChildPayload) == 16, "TuvrenChildPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenDimensionAtom) == 8, "TuvrenDimensionAtom ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenDimension) == 28, "TuvrenDimension ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenGridTrack) == 68, "TuvrenGridTrack ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenResponsiveCondition) == 36, "TuvrenResponsiveCondition ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenLayoutPayload) == 392, "TuvrenLayoutPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenResponsiveLayoutRule) == 44, "TuvrenResponsiveLayoutRule ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenStyleValue) == 24, "TuvrenStyleValue ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenThemeTokenRecord) == 32, "TuvrenThemeTokenRecord ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenStyleAttributeTokenRecord) == 24, "TuvrenStyleAttributeTokenRecord ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenStylePayload) == 144, "TuvrenStylePayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenStyleRulePayload) == 80, "TuvrenStyleRulePayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenGraphemeRange) == 8, "TuvrenGraphemeRange ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenSemanticPayload) == 16, "TuvrenSemanticPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenSemanticEntry) == 24, "TuvrenSemanticEntry ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTextContentPayload) == 28, "TuvrenTextContentPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenStyledSpanRecord) == 24, "TuvrenStyledSpanRecord ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTextDocumentConfigPayload) == 32, "TuvrenTextDocumentConfigPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTextValidationRuleRecord) == 32, "TuvrenTextValidationRuleRecord ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTextEditPayload) == 48, "TuvrenTextEditPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenCollectionMutationPayload) == 80, "TuvrenCollectionMutationPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenCollectionItemRecord) == 40, "TuvrenCollectionItemRecord ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenCollectionScrollPositionPayload) == 64, "TuvrenCollectionScrollPositionPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTranscriptMutationPayload) == 72, "TuvrenTranscriptMutationPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTranscriptBlockRecord) == 32, "TuvrenTranscriptBlockRecord ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenAnimationPayload) == 88, "TuvrenAnimationPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTerminalRequestPayload) == 40, "TuvrenTerminalRequestPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenDiagnosticConfigPayload) == 24, "TuvrenDiagnosticConfigPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenApplyResult) == 40, "TuvrenApplyResult ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenCommandResult) == 24, "TuvrenCommandResult ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenQueryRequest) == 48, "TuvrenQueryRequest ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenQueryResult) == 56, "TuvrenQueryResult ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenRecordBatchHeader) == 32, "TuvrenRecordBatchHeader ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenEventRecord) == 48, "TuvrenEventRecord ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenKeyEventPayload) == 24, "TuvrenKeyEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTextEventPayload) == 12, "TuvrenTextEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenPointerMoveEventPayload) == 28, "TuvrenPointerMoveEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenPointerButtonEventPayload) == 28, "TuvrenPointerButtonEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenWheelEventPayload) == 36, "TuvrenWheelEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenDragEventPayload) == 40, "TuvrenDragEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenPointerCaptureEventPayload) == 16, "TuvrenPointerCaptureEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenResizeEventPayload) == 28, "TuvrenResizeEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenPasteEventPayload) == 12, "TuvrenPasteEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenClipboardEventPayload) == 40, "TuvrenClipboardEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenRangeEventPayload) == 40, "TuvrenRangeEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenEvictionEventPayload) == 24, "TuvrenEvictionEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenIdentityRecord) == 24, "TuvrenIdentityRecord ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenAnimationEventPayload) == 16, "TuvrenAnimationEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenAnnouncementEventPayload) == 12, "TuvrenAnnouncementEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTerminalEventPayload) == 16, "TuvrenTerminalEventPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTerminalCapabilitiesPayload) == 48, "TuvrenTerminalCapabilitiesPayload ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenDiagnosticRecord) == 104, "TuvrenDiagnosticRecord ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenRenderOptions) == 16, "TuvrenRenderOptions ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenRenderResult) == 40, "TuvrenRenderResult ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenDrainResult) == 24, "TuvrenDrainResult ABI size");

#ifdef __cplusplus
}
#endif

#endif

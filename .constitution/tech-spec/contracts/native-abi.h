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
#define TUVREN_TX_FLAG_REQUEST_RENDER 0x00000001u
#define TUVREN_EVENT_FLAG_CANCELABLE 0x0001u
#define TUVREN_EVENT_FLAG_COALESCED 0x0002u
#define TUVREN_EVENT_FLAG_SYNTHETIC 0x0004u
#define TUVREN_RENDER_FLAG_FORCE_FULL 0x0001u
#define TUVREN_NODE_REF_LOCAL_BIT 0x80000000u
#define TUVREN_MAX_TRANSACTION_BYTES (8u * 1024u * 1024u)
#define TUVREN_MAX_TRANSACTION_COMMANDS 65535u

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
    TUVREN_TX_DIAGNOSTIC_CONFIGURE = 15
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
    TUVREN_VALUE_SEMANTIC = 9
} TuvrenValueTag;

typedef enum TuvrenDimensionTag {
    TUVREN_DIMENSION_AUTO = 0,
    TUVREN_DIMENSION_CELLS = 1,
    TUVREN_DIMENSION_PERCENT = 2,
    TUVREN_DIMENSION_MIN_CONTENT = 3,
    TUVREN_DIMENSION_MAX_CONTENT = 4,
    TUVREN_DIMENSION_FRACTION = 5,
    TUVREN_DIMENSION_MINMAX = 6
} TuvrenDimensionTag;

typedef enum TuvrenTextEditKind {
    TUVREN_TEXT_INSERT = 1,
    TUVREN_TEXT_DELETE = 2,
    TUVREN_TEXT_REPLACE = 3,
    TUVREN_TEXT_SET_CURSOR = 4,
    TUVREN_TEXT_SET_SELECTION = 5,
    TUVREN_TEXT_UNDO = 6,
    TUVREN_TEXT_REDO = 7
} TuvrenTextEditKind;

typedef enum TuvrenCollectionMutationKind {
    TUVREN_COLLECTION_INSERT = 1,
    TUVREN_COLLECTION_UPDATE = 2,
    TUVREN_COLLECTION_REMOVE = 3,
    TUVREN_COLLECTION_MOVE = 4,
    TUVREN_COLLECTION_RESET = 5,
    TUVREN_COLLECTION_VISIBLE_RANGE = 6,
    TUVREN_COLLECTION_FOCUS = 7,
    TUVREN_COLLECTION_RELOAD = 8
} TuvrenCollectionMutationKind;

typedef enum TuvrenTranscriptMutationKind {
    TUVREN_TRANSCRIPT_APPEND = 1,
    TUVREN_TRANSCRIPT_REPLACE = 2,
    TUVREN_TRANSCRIPT_REMOVE = 3,
    TUVREN_TRANSCRIPT_STREAM = 4,
    TUVREN_TRANSCRIPT_FINISH = 5,
    TUVREN_TRANSCRIPT_COLLAPSE = 6,
    TUVREN_TRANSCRIPT_RESET = 7,
    TUVREN_TRANSCRIPT_FOLLOW_LIVE = 8
} TuvrenTranscriptMutationKind;

typedef enum TuvrenTerminalRequestKind {
    TUVREN_TERMINAL_READ_CLIPBOARD = 1,
    TUVREN_TERMINAL_WRITE_CLIPBOARD = 2,
    TUVREN_TERMINAL_ANNOUNCE = 3,
    TUVREN_TERMINAL_SUSPEND = 4,
    TUVREN_TERMINAL_RESUME = 5,
    TUVREN_TERMINAL_QUERY_CAPABILITIES = 6
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
    TUVREN_PROP_STYLE_SHEET = 0x0201,
    TUVREN_PROP_STYLE_SLOT = 0x0202,
    TUVREN_PROP_STYLE_INLINE = 0x0203,
    TUVREN_PROP_THEME = 0x0204,
    TUVREN_PROP_TEXT_CONTENT = 0x0301,
    TUVREN_PROP_TEXT_SELECTION = 0x0302,
    TUVREN_PROP_TEXT_CURSOR = 0x0303,
    TUVREN_PROP_TEXT_WRAP = 0x0304,
    TUVREN_PROP_TEXT_TAB_WIDTH = 0x0305,
    TUVREN_PROP_STATE_VISIBLE = 0x0401,
    TUVREN_PROP_STATE_DISABLED = 0x0402,
    TUVREN_PROP_STATE_SELECTED = 0x0403,
    TUVREN_PROP_STATE_CHECKED = 0x0404,
    TUVREN_PROP_STATE_EXPANDED = 0x0405,
    TUVREN_PROP_STATE_INVALID = 0x0406,
    TUVREN_PROP_SEMANTIC_ROLE = 0x0501,
    TUVREN_PROP_SEMANTIC_NAME = 0x0502,
    TUVREN_PROP_SEMANTIC_DESCRIPTION = 0x0503,
    TUVREN_PROP_SEMANTIC_VALUE = 0x0504,
    TUVREN_PROP_SEMANTIC_STATES = 0x0505,
    TUVREN_PROP_SEMANTIC_RELATIONSHIPS = 0x0506
} TuvrenProperty;

/* Command compatibility matrix (all other combinations are invalid):
 * CREATE_NODE/CreateNodePayload; DESTROY_NODE, SET_ROOT/no payload;
 * INSERT_CHILD, REMOVE_CHILD/ChildPayload; layout 0x0101..0x010F requires
 * SET_PROPERTY_BYTES + VALUE_LAYOUT/LayoutPayload; style 0x0201..0x0204
 * requires SET_PROPERTY_BYTES + VALUE_STYLE/StylePayload; TEXT_CONTENT,
 * SEMANTIC_ROLE, NAME, DESCRIPTION, VALUE require SET_PROPERTY_BYTES +
 * VALUE_UTF8; TEXT_SELECTION requires SET_PROPERTY_BYTES +
 * VALUE_GRAPHEME_RANGE/GraphemeRange; TEXT_CURSOR, WRAP, TAB_WIDTH and state
 * 0x0401..0x0406 require SET_PROPERTY_U64 + VALUE_U64; semantic states and
 * relationships require SET_PROPERTY_BYTES + VALUE_SEMANTIC/SemanticPayload;
 * TEXT_EDIT/TextEditPayload; COLLECTION_APPLY/CollectionMutationPayload;
 * TRANSCRIPT_APPLY/TranscriptMutationPayload;
 * ANIMATION_APPLY/AnimationPayload; TERMINAL_REQUEST/TerminalRequestPayload;
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
    TUVREN_EVENT_TERMINAL = 15
} TuvrenEventType;

typedef struct TuvrenContextOptions {
    uint16_t size;
    uint16_t mode;
    uint32_t width_cells;
    uint32_t height_cells;
    uint32_t screen_mode;
    uint32_t external_output_mode;
    uint64_t queue_byte_limit;
    uint64_t diagnostic_byte_limit;
} TuvrenContextOptions;

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
    uint16_t primitive_kind;
    uint32_t initial_generation;
} TuvrenCreateNodePayload;

typedef struct TuvrenChildPayload {
    uint16_t size;
    uint16_t reserved;
    uint32_t parent;
    uint32_t child;
    uint32_t index;
} TuvrenChildPayload;

typedef struct TuvrenDimension {
    uint16_t tag;
    uint16_t flags;
    float value;
    float minimum;
    float maximum;
} TuvrenDimension;

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
    uint16_t display;
    uint16_t flex_direction;
    uint16_t flex_wrap;
    uint16_t align_items;
    uint16_t align_self;
    uint16_t align_content;
    uint16_t justify_content;
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
    uint32_t overflow;
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

typedef struct TuvrenStylePayload {
    uint16_t size;
    uint16_t kind;
    uint32_t present_mask;
    uint32_t foreground_rgba;
    uint32_t background_rgba;
    uint32_t attributes;
    uint32_t border;
    uint16_t padding_top;
    uint16_t padding_right;
    uint16_t padding_bottom;
    uint16_t padding_left;
    float opacity;
    uint32_t rules_offset;
    uint32_t rule_count;
} TuvrenStylePayload;

typedef struct TuvrenStyleRulePayload {
    uint64_t state_mask;
    TuvrenResponsiveCondition responsive;
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
    uint16_t kind;
    uint32_t entries_offset;
    uint32_t entry_count;
    uint32_t reserved;
} TuvrenSemanticPayload;

typedef struct TuvrenSemanticEntry {
    uint32_t key_offset;
    uint32_t key_length;
    uint32_t value_offset;
    uint32_t value_length;
    uint32_t value_tag;
    uint32_t reserved;
} TuvrenSemanticEntry;

typedef struct TuvrenTextEditPayload {
    uint16_t size;
    uint16_t edit_kind;
    TuvrenGraphemeRange range;
    uint32_t utf8_offset;
    uint32_t utf8_length;
    uint64_t content_epoch;
} TuvrenTextEditPayload;

typedef struct TuvrenCollectionMutationPayload {
    uint16_t size;
    uint16_t mutation_kind;
    uint32_t key_offset;
    uint32_t key_length;
    uint32_t item_offset;
    uint32_t item_length;
    uint64_t index;
    uint64_t secondary_index;
    uint64_t generation;
} TuvrenCollectionMutationPayload;

typedef struct TuvrenTranscriptMutationPayload {
    uint16_t size;
    uint16_t mutation_kind;
    uint32_t block_id_offset;
    uint32_t block_id_length;
    uint32_t content_offset;
    uint32_t content_length;
    uint64_t version;
    uint64_t generation;
    uint32_t flags;
    uint32_t reserved;
} TuvrenTranscriptMutationPayload;

typedef struct TuvrenAnimationPayload {
    uint16_t size;
    uint16_t property;
    uint16_t value_tag;
    uint16_t reduced_motion;
    uint64_t animation_id;
    uint64_t duration_nanos;
    uint64_t delay_nanos;
    uint32_t repeat_count;
    uint32_t flags;
    double from_number;
    double to_number;
    uint32_t from_rgba;
    uint32_t to_rgba;
} TuvrenAnimationPayload;

typedef struct TuvrenTerminalRequestPayload {
    uint16_t size;
    uint16_t request_kind;
    uint32_t target;
    uint32_t media_type_offset;
    uint32_t media_type_length;
    uint32_t data_offset;
    uint32_t data_length;
    uint64_t request_id;
    uint64_t timeout_nanos;
} TuvrenTerminalRequestPayload;

typedef struct TuvrenDiagnosticConfigPayload {
    uint16_t size;
    uint16_t mode;
    uint32_t flags;
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
} TuvrenApplyResult;

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

typedef struct TuvrenDiagnosticRecord {
    uint64_t sequence;
    uint64_t timestamp_nanos;
    uint16_t kind;
    uint16_t flags;
    uint32_t reserved;
    uint64_t event_id;
    uint64_t command_instance_id;
    uint64_t transaction_id;
    uint64_t render_request_id;
    uint32_t payload_offset;
    uint32_t payload_length;
} TuvrenDiagnosticRecord;

typedef struct TuvrenRenderOptions {
    uint16_t size;
    uint16_t flags;
    uint32_t reserved;
    uint64_t elapsed_nanos;
} TuvrenRenderOptions;

typedef struct TuvrenRenderResult {
    uint16_t size;
    uint16_t presentation_tier_hz;
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
    TuvrenApplyResult *out_result
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

TUVREN_STATIC_ASSERT(sizeof(TuvrenContextOptions) == 40, "TuvrenContextOptions ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTransactionHeader) == 48, "TuvrenTransactionHeader ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenTransactionCommand) == 40, "TuvrenTransactionCommand ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenNodeMapping) == 8, "TuvrenNodeMapping ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenApplyResult) == 32, "TuvrenApplyResult ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenRecordBatchHeader) == 32, "TuvrenRecordBatchHeader ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenEventRecord) == 48, "TuvrenEventRecord ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenDiagnosticRecord) == 64, "TuvrenDiagnosticRecord ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenRenderOptions) == 16, "TuvrenRenderOptions ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenRenderResult) == 40, "TuvrenRenderResult ABI size");
TUVREN_STATIC_ASSERT(sizeof(TuvrenDrainResult) == 24, "TuvrenDrainResult ABI size");

#ifdef __cplusplus
}
#endif

#endif

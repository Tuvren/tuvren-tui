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
    TUVREN_VALUE_BYTES = 5
} TuvrenValueTag;

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

typedef struct TuvrenApplyResult {
    uint16_t size;
    uint16_t status;
    uint32_t failed_command_index;
    uint64_t transaction_id;
    uint64_t render_request_id;
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

/* Drain buffers begin with TuvrenRecordBatchHeader. Event batches contain
 * TuvrenEventRecord entries; diagnostic batches contain TuvrenDiagnosticRecord
 * entries. Offsets are relative to the first byte of the caller-owned output.
 * tui_error_copy writes one bounded UTF-8 JSON object into caller-owned output.
 */

_Static_assert(sizeof(TuvrenContextOptions) == 40, "TuvrenContextOptions ABI size");
_Static_assert(sizeof(TuvrenTransactionHeader) == 48, "TuvrenTransactionHeader ABI size");
_Static_assert(sizeof(TuvrenTransactionCommand) == 40, "TuvrenTransactionCommand ABI size");
_Static_assert(sizeof(TuvrenApplyResult) == 24, "TuvrenApplyResult ABI size");
_Static_assert(sizeof(TuvrenRecordBatchHeader) == 32, "TuvrenRecordBatchHeader ABI size");
_Static_assert(sizeof(TuvrenEventRecord) == 48, "TuvrenEventRecord ABI size");
_Static_assert(sizeof(TuvrenDiagnosticRecord) == 64, "TuvrenDiagnosticRecord ABI size");
_Static_assert(sizeof(TuvrenRenderOptions) == 16, "TuvrenRenderOptions ABI size");
_Static_assert(sizeof(TuvrenRenderResult) == 40, "TuvrenRenderResult ABI size");
_Static_assert(sizeof(TuvrenDrainResult) == 24, "TuvrenDrainResult ABI size");

#ifdef __cplusplus
}
#endif

#endif

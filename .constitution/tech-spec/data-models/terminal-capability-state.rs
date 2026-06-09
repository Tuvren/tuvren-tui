// TerminalCapabilityState — terminal feature detection and reporting
// Schema snapshot — NOT COMPILED. Source: native/src/.

#![allow(dead_code)]

// NOT COMPILED — schema reference only.

pub mod terminal_capability {
    #![allow(dead_code)]
    pub const TRUECOLOR: u64 = 1 << 0;
    pub const COLOR_256: u64 = 1 << 1;
    pub const COLOR_16: u64 = 1 << 2;
    pub const MOUSE: u64 = 1 << 3;
    pub const UTF8: u64 = 1 << 4;
    pub const ALTERNATE_SCREEN: u64 = 1 << 5;
    pub const OSC52_CLIPBOARD_WRITE: u64 = 1 << 6;
    pub const OSC8_HYPERLINKS: u64 = 1 << 7;
    pub const KITTY_KEYBOARD_DISAMBIGUATE: u64 = 1 << 8;
    pub const PIXEL_SIZE: u64 = 1 << 9;
    pub const COLOR_DEPTH_QUERY: u64 = 1 << 10;
    pub const MULTIPLEXER_PRESENT: u64 = 1 << 11;
    pub const SYNCHRONIZED_OUTPUT: u64 = 1 << 12;
}

pub enum TerminalMultiplexer {
    None,
    Tmux,
    Screen,
    Zellij,
    Unknown,
}

pub struct TerminalCapabilityState {
    pub flags: u64,
    pub terminal_name: Option<String>,
    pub terminal_program: Option<String>,
    pub multiplexer: TerminalMultiplexer,
    pub cell_width_px: u32,
    pub cell_height_px: u32,
    pub screen_width_px: u32,
    pub screen_height_px: u32,
    pub color_depth_bits: u8,
    pub kitty_keyboard_enabled: bool,
}

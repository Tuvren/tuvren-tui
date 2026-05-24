/**
 * Keymap registry and key binding normalization (Epic R, ADR-T44).
 *
 * Key string syntax:  [modifier+]*key
 *   Modifiers (case-insensitive): ctrl, shift, alt, super
 *   Named keys: escape, enter, backspace, tab, backtab, delete, insert,
 *               up, down, left, right, home, end, pageup, pagedown, f1-f12
 *   Character keys: any single printable character (case-insensitive — "Q"
 *                   and "q" are equivalent; use "shift+q" to require Shift)
 *
 * Native-core reserved keys: Escape (dismissable overlays), Tab/BackTab
 * (focus traversal), and keys consumed by focused widgets (Input printable
 * chars, Enter→Submit, Backspace, arrows, etc.) are intercepted before the
 * host event drain — keymap bindings on those keys will not fire while the
 * relevant widget or overlay holds focus.
 *
 * Examples: "ctrl+c", "ctrl+shift+k", "escape", "f5", "q", "enter"
 */

import type { TuvrenEvent } from "./events";
import type { Command, CommandContext, CommandPredicate, Disposable } from "./commands";
import type { CommandRegistry } from "./commands";
import { TuvrenError } from "./errors";

// ── Key name tables ───────────────────────────────────────────────────────────

const SPECIAL_KEYS: Readonly<Record<string, number>> = {
	backspace: 0x0100,
	enter: 0x0101,
	left: 0x0102,
	right: 0x0103,
	up: 0x0104,
	down: 0x0105,
	home: 0x0106,
	end: 0x0107,
	pageup: 0x0108,
	pagedown: 0x0109,
	tab: 0x010a,
	backtab: 0x010b,
	delete: 0x010c,
	insert: 0x010d,
	escape: 0x010e,
	f1: 0x0110,
	f2: 0x0111,
	f3: 0x0112,
	f4: 0x0113,
	f5: 0x0114,
	f6: 0x0115,
	f7: 0x0116,
	f8: 0x0117,
	f9: 0x0118,
	f10: 0x0119,
	f11: 0x011a,
	f12: 0x011b,
} as const;

const MODIFIER_BITS: Readonly<Record<string, number>> = {
	ctrl: 0x02,
	shift: 0x01,
	alt: 0x04,
	super: 0x08,
} as const;

// ── Internal types ────────────────────────────────────────────────────────────

interface ParsedKey {
	keyCode: number;
	codepoint: number;
	modifiers: number;
}

interface StoredBinding {
	parsed: ParsedKey;
	command: string;
	when?: CommandPredicate;
}

// ── Key parser ────────────────────────────────────────────────────────────────

function parseKeyString(key: string): ParsedKey {
	if (!key || key.trim() === "") {
		throw new TuvrenError(`Invalid key binding: empty key string`, -1);
	}

	const rawParts = key.toLowerCase().split("+");
	let modifiers = 0;
	const keyParts: string[] = [];

	for (const part of rawParts) {
		const bit = MODIFIER_BITS[part];
		if (bit !== undefined) {
			modifiers |= bit;
		} else {
			keyParts.push(part);
		}
	}

	if (keyParts.length !== 1) {
		throw new TuvrenError(
			`Invalid key binding: "${key}" — must have exactly one key name after modifiers`,
			-1,
		);
	}

	const keyName = keyParts[0]!;
	const keyCode = SPECIAL_KEYS[keyName];
	if (keyCode !== undefined) {
		return { keyCode, codepoint: 0, modifiers };
	}

	// Must be a single printable character (check after lowercasing)
	const chars = [...keyName]; // Unicode-aware split
	if (chars.length !== 1) {
		throw new TuvrenError(
			`Unknown key in binding: "${keyName}" — not a recognised key name or single character`,
			-1,
		);
	}

	const codepoint = keyName.codePointAt(0);
	if (codepoint === undefined) {
		throw new TuvrenError(`Invalid key in binding: "${keyName}"`, -1);
	}

	return { keyCode: 0, codepoint, modifiers };
}

const SHIFT_BIT = MODIFIER_BITS.shift!;

function matchesEvent(binding: ParsedKey, event: TuvrenEvent): boolean {
	if (event.type !== "key") return false;
	const eventMods = event.modifiers ?? 0;

	if (binding.keyCode > 0) {
		// Named special key: require exact modifier match.
		if (eventMods !== binding.modifiers) return false;
		return (event.keyCode ?? 0) === binding.keyCode;
	}

	if (binding.codepoint > 0) {
		// Printable char: the native core sets the Shift modifier when an uppercase
		// character is typed (e.g. Shift+Q → modifiers=Shift, codepoint='Q'). When
		// the binding itself does not require Shift (e.g. key="q"), strip Shift from
		// the event before comparing so case-insensitive resolution still works.
		// When the binding explicitly requires Shift (e.g. key="shift+something"),
		// require the exact modifier set.
		const requiresShift = (binding.modifiers & SHIFT_BIT) !== 0;
		const effectiveEventMods = requiresShift ? eventMods : (eventMods & ~SHIFT_BIT);
		if (effectiveEventMods !== binding.modifiers) return false;
		const eventCp = event.codepoint ?? 0;
		if (eventCp === 0) return false;
		const normalizedCp =
			String.fromCodePoint(eventCp).toLowerCase().codePointAt(0) ?? 0;
		return normalizedCp === binding.codepoint;
	}

	return false;
}

// ── Public types ──────────────────────────────────────────────────────────────

export interface KeyBinding {
	command: string;
	key: string;
	when?: CommandPredicate;
}

// ── KeymapRegistry ────────────────────────────────────────────────────────────

export class KeymapRegistry {
	private _bindings: StoredBinding[] = [];
	private _registry?: CommandRegistry;

	/**
	 * Attach a CommandRegistry for command lookup during resolve().
	 * The registry is optional at registration time but required for resolve()
	 * to return Command objects (vs. undefined when command is not found).
	 */
	setRegistry(registry: CommandRegistry): void {
		this._registry = registry;
	}

	/**
	 * Register a keybinding. Throws TuvrenError on invalid key syntax.
	 * Returns a Disposable that removes the binding.
	 *
	 * When multiple bindings match the same key in the same context,
	 * the first registered binding takes priority.
	 */
	register(binding: KeyBinding): Disposable {
		const parsed = parseKeyString(binding.key);
		const stored: StoredBinding = {
			parsed,
			command: binding.command,
			when: binding.when,
		};
		this._bindings.push(stored);
		let removed = false;
		return {
			dispose: () => {
				if (removed) return;
				removed = true;
				const idx = this._bindings.indexOf(stored);
				if (idx !== -1) this._bindings.splice(idx, 1);
			},
		};
	}

	/**
	 * Resolve a TuvrenEvent to a Command using the attached registry.
	 * Returns the first matching Command whose key and `when` predicate match,
	 * or undefined if no binding matches.
	 *
	 * Focus context is supplied by the caller (typically from app.getFocused()
	 * in the event loop); this registry does not own focus state.
	 */
	resolve(event: TuvrenEvent, context: CommandContext): Command | undefined {
		if (event.type !== "key") return undefined;

		for (const binding of this._bindings) {
			if (!matchesEvent(binding.parsed, event)) continue;
			if (binding.when && !binding.when(context)) continue;

			if (!this._registry) continue;
			const cmd = this._registry.get(binding.command);
			if (cmd) {
				// Respect the command's own `when` predicate as well
				if (cmd.when && !cmd.when(context)) continue;
				return cmd;
			}
		}

		return undefined;
	}
}

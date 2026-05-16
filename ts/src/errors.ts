/**
 * Error handling — TuvrenError + error code mapping.
 */

import { ffi } from "./ffi";
import { CString } from "bun:ffi";

export class TuvrenError extends Error {
	public readonly code: number;

	constructor(message: string, code: number) {
		super(message);
		this.name = "TuvrenError";
		this.code = code;
	}
}

/**
 * Check a return code from an FFI call.
 * Throws TuvrenError on failure (-1 or -2).
 */
export function checkResult(code: number, context?: string): void {
	if (code >= 0) return;

	let message: string;
	if (code === -2) {
		message = "Internal panic in native core";
	} else {
		const errPtr = ffi.tui_get_last_error();
		if (errPtr) {
			message = new CString(errPtr).toString();
			ffi.tui_clear_error();
		} else {
			message = "Unknown error";
		}
	}

	if (context) {
		message = `${context}: ${message}`;
	}

	throw new TuvrenError(message, code);
}

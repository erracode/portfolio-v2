// Shared input state read by PlayerController each frame and written by the
// on-screen VirtualControls (mobile touch). Kept as a plain mutable module
// object to match the imperative style of the existing player controller.

export interface TouchInputState {
	/** Horizontal movement: -1 (left) .. 1 (right), camera-relative */
	moveX: number;
	/** Depth movement: -1 (back) .. 1 (forward), camera-relative */
	moveZ: number;
	/** Held jump (space equivalent) */
	jump: boolean;
	/** Edge-triggered axe throw request */
	throwQueued: boolean;
}

export const touchInput: TouchInputState = {
	moveX: 0,
	moveZ: 0,
	jump: false,
	throwQueued: false,
};

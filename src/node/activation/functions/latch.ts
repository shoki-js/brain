import { ActivationFunction } from "../types";

/**
 * A latch activation function
 *
 * When input is above 1, this node will keep that state, and return 1
 * until it receives an input below 0, at which point it will keep return 0 until set above 1 again.
 *
 * @param input The input value
 * @returns 1 or 0 depending on the last input value
 */
export const latchNode: ActivationFunction = (
	input,
	lastInput,
	lastOutput
): 0 | 1 => {
	if (input > 1) {
		return 1;
	}

	if (input < 0) {
		return 0;
	}

	return lastOutput as 0 | 1;
};

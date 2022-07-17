import { ActivationFunction } from "../types";

/**
 * A sigmoid activation function
 *
 * https://keisan.casio.com/exec/system/15157249643325
 *
 * @param input The input value
 * @returns The sigmoid of the input value
 */
export const sigmoidNode: ActivationFunction = (input) =>
	1 / (1 + Math.E ** (0 - input));

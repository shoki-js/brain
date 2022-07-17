import { ActivationFunction } from "../types";

/**
 * An absolute activation function
 *
 * @param input The input value
 * @returns Math.abs(input) capped at +100
 */
export const absoluteNeuron: ActivationFunction = (input) =>
	Math.min(Math.abs(input), 100);

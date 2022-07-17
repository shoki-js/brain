import { ActivationFunction } from "../types";

/**
 * A ReLU (rectified linear unit) activation function
 *
 * @param input The input value
 * @returns The input value capped between 0 and +100
 */
export const reluNeuron: ActivationFunction = (input) =>
	Math.max(Math.min(input, 100), 0);

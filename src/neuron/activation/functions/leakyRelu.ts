import { ActivationFunction } from "../types";

/**
 * A Leaky ReLU (rectified linear unit) activation function
 *
 * @param input The input value
 * @returns The input value with leaky relu of 0.01 applied, capped between -100 and +100
 */
export const leakyReLUNeuron: ActivationFunction = (input) =>
	input > 0 ? Math.min(input, 100) : Math.max(input * 0.01, -100);

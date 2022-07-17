import { ActivationFunction } from "../types";

/**
 * A gaussian activation function
 *
 * @param input The input value
 * @returns The input value on a gaussian curve ( f(x) = exp(-x**2) )
 */
export const gaussianNeuron: ActivationFunction = (input) =>
	1 / (1 + input ** 2);

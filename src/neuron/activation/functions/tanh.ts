import { ActivationFunction } from "../types";

/**
 * A hyperbolic tangent activation function
 *
 * https://keisan.casio.com/exec/system/15411343087697
 *
 * @param input The input value
 * @returns The input value on a hyperbolic tangent curve
 */
export const tanHNeuron: ActivationFunction = (input) => Math.tanh(input);

import { ActivationFunction } from "../types";

/**
 * A constant activation function
 *
 * @param input The input value
 * @returns The input value
 */
export const constantNeuron: ActivationFunction = (input) => input;

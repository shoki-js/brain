import { ActivationFunction } from "../types";

/**
 * A sine activation function
 *
 * @param input The input value
 * @returns The input value on a sin curve
 */
export const sineNode: ActivationFunction = (input) => Math.sin(input);

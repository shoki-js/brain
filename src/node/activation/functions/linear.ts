import { ActivationFunction } from "../types";

/**
 * A linear activation function
 *
 * @param input The input value
 * @returns The input value capped between -100 and +100
 */
export const linearNode: ActivationFunction = (input) =>
	Math.max(Math.min(input, 100), -100);

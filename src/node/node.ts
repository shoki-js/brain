import { ActivationFunctionType } from "./activation/types";

// TODO add innovation
export type Node = {
	/**
	 * The type of activation function to use for this node
	 */
	activation: ActivationFunctionType;

	/**
	 * A description of this node
	 */
	description: string;

	/**
	 * The current value of this node
	 */
	value: number;

	/**
	 * The last input value of this node
	 *
	 * This is used for the Differential activation function
	 */
	lastInput: number;

	/**
	 * The last output value of this node
	 *
	 * This is used for the Latch activation function
	 */
	lastOutput: number;
};

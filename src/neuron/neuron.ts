import { ActivationFunctionType } from "./activation/types";

// TODO add innovation
export type Neuron = {
	/**
	 * The type of activation function to use for this neuron
	 */
	activation: ActivationFunctionType;

	/**
	 * A description of this neuron
	 */
	description: string;

	/**
	 * The current value of this neuron
	 */
	value: number;

	/**
	 * The last input value of this neuron
	 *
	 * This is used for the Differential activation function
	 */
	lastInput: number;

	/**
	 * The last output value of this neuron
	 *
	 * This is used for the Latch activation function
	 */
	lastOutput: number;
};

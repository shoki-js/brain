export enum ActivationFunction {
	CONSTANT = "constant",
	SIGMOID = "sigmoid",
	LINEAR = "linear",
	TANH = "tanh",
	SIN = "sin",
	RELU = "relu",
	GAUSSIAN = "gaussian",
	LATCH = "latch",
	DIFF = "diff",
}

export type Node = {
	/**
	 * The type of activation function to use for this node
	 */
	activation: ActivationFunction;

	/**
	 * This nodes unique index
	 */
	index: number;

	/**
	 * Used to give this node a uniquer identifier based on when it was created.
	 *
	 * This can be used to track genes between generations.
	 */
	innovation: number;

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

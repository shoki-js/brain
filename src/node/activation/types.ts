// TODO add differential
export enum ActivationFunctionType {
	CONSTANT = "constant",
	SIGMOID = "sigmoid",
	LINEAR = "linear",
	TANH = "tanh",
	SIN = "sin",
	RELU = "relu",
	LEAKY_RELU = "leakyRelu",
	GAUSSIAN = "gaussian",
	LATCH = "latch",
}

export type ActivationFunction = (
	input: number,
	lastInput: number,
	lastOutput: number
) => number;

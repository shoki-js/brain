import { absoluteNeuron } from "./functions/absolute";
import { constantNeuron } from "./functions/constant";
import { gaussianNeuron } from "./functions/gaussian";
import { latchNeuron } from "./functions/latch";
import { leakyReLUNeuron } from "./functions/leakyRelu";
import { linearNeuron } from "./functions/linear";
import { reluNeuron } from "./functions/relu";
import { sigmoidNeuron } from "./functions/sigmoid";
import { sineNeuron } from "./functions/sin";
import { tanHNeuron } from "./functions/tanh";

// TODO add differential
export enum ActivationFunctionType {
	CONSTANT = "constant",
	ABSOLUTE = "absolute",
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

export const activationFunctions: {
	[key in ActivationFunctionType]: ActivationFunction;
} = {
	absolute: absoluteNeuron,
	constant: constantNeuron,
	gaussian: gaussianNeuron,
	latch: latchNeuron,
	leakyRelu: leakyReLUNeuron,
	linear: linearNeuron,
	relu: reluNeuron,
	sigmoid: sigmoidNeuron,
	sin: sineNeuron,
	tanh: tanHNeuron,
};

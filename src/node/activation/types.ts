import { absoluteNode } from "./functions/absolute";
import { constantNode } from "./functions/constant";
import { gaussianNode } from "./functions/gaussian";
import { latchNode } from "./functions/latch";
import { leakyReLUNode } from "./functions/leakyRelu";
import { linearNode } from "./functions/linear";
import { reluNode } from "./functions/relu";
import { sigmoidNode } from "./functions/sigmoid";
import { sineNode } from "./functions/sin";
import { tanHNode } from "./functions/tanh";

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
	absolute: absoluteNode,
	constant: constantNode,
	gaussian: gaussianNode,
	latch: latchNode,
	leakyRelu: leakyReLUNode,
	linear: linearNode,
	relu: reluNode,
	sigmoid: sigmoidNode,
	sin: sineNode,
	tanh: tanHNode,
};

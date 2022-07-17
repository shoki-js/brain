import { Brain } from "./brain";
import { ActivationFunctionType } from "./node/activation/types";

describe("brain", () => {
	let brain: Brain;

	beforeEach(() => {
		brain = new Brain();
	});

	describe("with a simple input-output brain", () => {
		let inputNodeIndex: number;
		let outputNodeIndex: number;
		let synapseIndex: number;

		beforeEach(() => {
			inputNodeIndex = brain.addNode({
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			outputNodeIndex = brain.addNode({
				activation: ActivationFunctionType.CONSTANT,
				description: "output",
			});

			synapseIndex = brain.addSynapse(inputNodeIndex, outputNodeIndex);

			brain.setValue(inputNodeIndex, 1);
		});

		test("should pass node values through correctly", () => {
			brain.think();

			expect(brain.getValue(outputNodeIndex)).toEqual(1);
		});

		describe("with a synapse weight of 4", () => {
			beforeEach(() => {
				brain.setSynapseWeight(synapseIndex, 4);
			});

			test("should apply synapse weight correctly", () => {
				brain.think();

				expect(brain.getValue(outputNodeIndex)).toEqual(4);
			});
		});

		describe("with an absolute activation function", () => {
			beforeEach(() => {
				brain.setNodeActivationType(
					outputNodeIndex,
					ActivationFunctionType.ABSOLUTE
				);
			});

			test("should apply activation function correctly", () => {
				brain.setValue(inputNodeIndex, -1);

				brain.think();

				expect(brain.getValue(outputNodeIndex)).toEqual(1);
			});
		});
	});
});

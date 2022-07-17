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

		describe("when inserting a new node between the two existing nodes", () => {
			let leftSynapseIndex: number;
			let rightSynapseIndex: number;

			beforeEach(() => {
				const {
					synapses: [left, right],
				} = brain.insertNode(synapseIndex, {
					description: "absolute hidden node",
					activation: ActivationFunctionType.ABSOLUTE,
				});

				leftSynapseIndex = left;
				rightSynapseIndex = right;
			});

			test("should apply hidden node correctly", () => {
				brain.setValue(inputNodeIndex, -1);

				// think twice because the hidden node needs its value updated as well
				// TODO consider a better solution...
				brain.think();
				brain.think();

				expect(brain.getValue(outputNodeIndex)).toEqual(1);
			});

			describe("when the new synapses are set to 0.5", () => {
				beforeEach(() => {
					brain.setSynapseWeight(leftSynapseIndex, 0.5);
					brain.setSynapseWeight(rightSynapseIndex, 0.5);
				});

				test("should apply hidden node correctly", () => {
					brain.setValue(inputNodeIndex, -1);

					// think twice because the hidden node needs its value updated as well
					// TODO consider a better solution...
					brain.think();
					brain.think();

					expect(brain.getValue(outputNodeIndex)).toEqual(0.25);
				});
			});
		});
	});

	describe("with a brain connecting two input nodes to an output node", () => {
		let inputNodeAIndex: number;
		let synapseAIndex: number;

		let inputNodeBIndex: number;
		let synapseBIndex: number;

		let outputNodeIndex: number;

		beforeEach(() => {
			inputNodeAIndex = brain.addNode({
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			inputNodeBIndex = brain.addNode({
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			outputNodeIndex = brain.addNode({
				activation: ActivationFunctionType.CONSTANT,
				description: "output",
			});

			synapseAIndex = brain.addSynapse(inputNodeAIndex, outputNodeIndex);
			synapseBIndex = brain.addSynapse(inputNodeBIndex, outputNodeIndex);

			brain.setValue(inputNodeAIndex, 1);
			brain.setValue(inputNodeBIndex, 1);
		});

		test("should add values correctly", () => {
			brain.think();

			expect(brain.getValue(outputNodeIndex)).toEqual(2);
		});

		describe("when there is a hidden node between the input nodes and the output node", () => {
			let hiddenNodeIndex: number;

			beforeEach(() => {
				const { node: hiddenNode } = brain.insertNode(synapseAIndex, {
					description: "hidden node",
					activation: ActivationFunctionType.CONSTANT,
				});

				hiddenNodeIndex = hiddenNode;

				brain.addSynapse(inputNodeBIndex, hiddenNodeIndex);

				brain.setSynapseEnabled(synapseBIndex, false);
			});

			test("should add values correctly", () => {
				// think twice to allow for hidden layers
				// TODO fix this
				brain.think();
				brain.think();

				expect(brain.getValue(outputNodeIndex)).toEqual(2);
			});

			describe("when hidden node has a latch activation type", () => {
				beforeEach(() => {
					brain.setNodeActivationType(
						hiddenNodeIndex,
						ActivationFunctionType.LATCH
					);
				});

				test("should add values correctly", () => {
					// think twice to allow for hidden layers
					// TODO fix this
					brain.think();
					brain.think();

					expect(brain.getValue(outputNodeIndex)).toEqual(1);
				});
			});
		});
	});
});

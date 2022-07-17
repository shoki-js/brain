import { Brain } from "./brain";
import { ActivationFunctionType } from "./neuron/activation/types";

describe("brain", () => {
	let brain: Brain;

	beforeEach(() => {
		brain = new Brain();
	});

	describe("with a simple input-output brain", () => {
		let inputNeuronIndex: number;
		let outputNeuronIndex: number;
		let synapseIndex: number;

		beforeEach(() => {
			inputNeuronIndex = brain.addNeuron({
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			outputNeuronIndex = brain.addNeuron({
				activation: ActivationFunctionType.CONSTANT,
				description: "output",
			});

			synapseIndex = brain.addSynapse(inputNeuronIndex, outputNeuronIndex);
		});

		test("should pass neuron values through correctly", () => {
			brain.think({
				[inputNeuronIndex]: 1,
			});

			expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(1);
		});

		describe("with a synapse weight of 4", () => {
			beforeEach(() => {
				brain.setSynapseWeight(synapseIndex, 4);
			});

			test("should apply synapse weight correctly", () => {
				brain.think({
					[inputNeuronIndex]: 1,
				});

				expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(4);
			});
		});

		describe("with an absolute activation function", () => {
			beforeEach(() => {
				brain.setNeuronActivationType(
					outputNeuronIndex,
					ActivationFunctionType.ABSOLUTE
				);
			});

			test("should apply activation function correctly", () => {
				brain.think({
					[inputNeuronIndex]: -1,
				});

				expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(1);
			});
		});

		describe("when inserting a new neuron between the two existing neurons", () => {
			let hiddenNeuronIndex: number;
			let leftSynapseIndex: number;
			let rightSynapseIndex: number;

			beforeEach(() => {
				const {
					neuron,
					synapses: [left, right],
				} = brain.insertNeuron(synapseIndex, {
					description: "absolute hidden neuron",
					activation: ActivationFunctionType.ABSOLUTE,
				});

				hiddenNeuronIndex = neuron;
				leftSynapseIndex = left;
				rightSynapseIndex = right;
			});

			test("should apply hidden neuron correctly", () => {
				brain.think({
					[inputNeuronIndex]: -1,
				});

				expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(1);
			});

			describe("when the new synapses are set to 0.5", () => {
				beforeEach(() => {
					brain.setSynapseWeight(leftSynapseIndex, 0.5);
					brain.setSynapseWeight(rightSynapseIndex, 0.5);
				});

				test("should apply hidden neuron correctly", () => {
					brain.think({
						[inputNeuronIndex]: -1,
					});

					expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(0.25);
				});
			});

			test("removeNeuron should remove the neuron and its synapses", () => {
				brain.removeNeuron(hiddenNeuronIndex);

				brain.think({
					[inputNeuronIndex]: -1,
				});

				// output now has no link to it
				expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(0);
			});
		});
	});

	describe("with a brain connecting two input neurons to an output neuron", () => {
		let inputNeuronAIndex: number;
		let synapseAIndex: number;

		let inputNeuronBIndex: number;
		let synapseBIndex: number;

		let outputNeuronIndex: number;

		beforeEach(() => {
			inputNeuronAIndex = brain.addNeuron({
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			inputNeuronBIndex = brain.addNeuron({
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			outputNeuronIndex = brain.addNeuron({
				activation: ActivationFunctionType.CONSTANT,
				description: "output",
			});

			synapseAIndex = brain.addSynapse(inputNeuronAIndex, outputNeuronIndex);
			synapseBIndex = brain.addSynapse(inputNeuronBIndex, outputNeuronIndex);
		});

		test("should add values correctly", () => {
			brain.think({
				[inputNeuronAIndex]: 1,
				[inputNeuronBIndex]: 1,
			});

			expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(2);
		});

		describe("when there is a hidden neuron between the input neurons and the output neuron", () => {
			let hiddenNeuronIndex: number;

			beforeEach(() => {
				const { neuron: hiddenNeuron } = brain.insertNeuron(synapseAIndex, {
					description: "hidden neuron",
					activation: ActivationFunctionType.CONSTANT,
				});

				hiddenNeuronIndex = hiddenNeuron;

				brain.addSynapse(inputNeuronBIndex, hiddenNeuronIndex);

				brain.setSynapseEnabled(synapseBIndex, false);
			});

			test("should add values correctly", () => {
				brain.think({
					[inputNeuronAIndex]: 1,
					[inputNeuronBIndex]: 1,
				});

				expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(2);
			});

			describe("when hidden neuron has a latch activation type", () => {
				beforeEach(() => {
					brain.setNeuronActivationType(
						hiddenNeuronIndex,
						ActivationFunctionType.LATCH
					);
				});

				test("should add values correctly", () => {
					brain.think({
						[inputNeuronAIndex]: 1,
						[inputNeuronBIndex]: 1,
					});

					expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(1);
				});
			});
		});
	});
});

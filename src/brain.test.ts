import { Brain } from "./brain";
import { createGenome, Genome, mutation } from "./genome";
import { ActivationFunctionType } from "./neuron/activation/types";

describe("brain", () => {
	let genome: Genome;

	beforeEach(() => {
		genome = createGenome();
	});

	describe("with a simple input-output brain", () => {
		let inputNeuronIndex: number;
		let outputNeuronIndex: number;
		let synapseIndex: number;

		beforeEach(() => {
			inputNeuronIndex = mutation.addNeuron(genome, {
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			outputNeuronIndex = mutation.addNeuron(genome, {
				activation: ActivationFunctionType.CONSTANT,
				description: "output",
			});

			synapseIndex = mutation.addSynapse(genome, {
				neuronIn: inputNeuronIndex,
				neuronOut: outputNeuronIndex,
			});
		});

		test("should pass neuron values through correctly", () => {
			const brain = new Brain(genome);

			brain.think({
				[inputNeuronIndex]: 1,
			});

			expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(1);
		});

		describe("with a synapse weight of 4", () => {
			beforeEach(() => {
				mutation.setSynapseWeight(genome, { index: synapseIndex, weight: 4 });
			});

			test("should apply synapse weight correctly", () => {
				const brain = new Brain(genome);

				brain.think({
					[inputNeuronIndex]: 1,
				});

				expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(4);
			});
		});

		describe("with an absolute activation function", () => {
			beforeEach(() => {
				mutation.setNeuronActivationType(genome, {
					index: outputNeuronIndex,
					activation: ActivationFunctionType.ABSOLUTE,
				});
			});

			test("should apply activation function correctly", () => {
				const brain = new Brain(genome);

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
				} = mutation.insertNeuron(genome, {
					synapseIndex,
					neuron: {
						description: "absolute hidden neuron",
						activation: ActivationFunctionType.ABSOLUTE,
					},
				});

				hiddenNeuronIndex = neuron;
				leftSynapseIndex = left;
				rightSynapseIndex = right;
			});

			test("should apply hidden neuron correctly", () => {
				const brain = new Brain(genome);

				brain.think({
					[inputNeuronIndex]: -1,
				});

				expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(1);
			});

			describe("when the new synapses are set to 0.5", () => {
				beforeEach(() => {
					mutation.setSynapseWeight(genome, {
						index: leftSynapseIndex,
						weight: 0.5,
					});
					mutation.setSynapseWeight(genome, {
						index: rightSynapseIndex,
						weight: 0.5,
					});
				});

				test("should apply hidden neuron correctly", () => {
					const brain = new Brain(genome);

					brain.think({
						[inputNeuronIndex]: -1,
					});

					expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(0.25);
				});
			});

			test("removeNeuron should remove the neuron and its synapses", () => {
				mutation.removeNeuron(genome, { index: hiddenNeuronIndex });

				const brain = new Brain(genome);

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
			inputNeuronAIndex = mutation.addNeuron(genome, {
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			inputNeuronBIndex = mutation.addNeuron(genome, {
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			outputNeuronIndex = mutation.addNeuron(genome, {
				activation: ActivationFunctionType.CONSTANT,
				description: "output",
			});

			synapseAIndex = mutation.addSynapse(genome, {
				neuronIn: inputNeuronAIndex,
				neuronOut: outputNeuronIndex,
			});
			synapseBIndex = mutation.addSynapse(genome, {
				neuronIn: inputNeuronBIndex,
				neuronOut: outputNeuronIndex,
			});
		});

		test("should add values correctly", () => {
			const brain = new Brain(genome);

			brain.think({
				[inputNeuronAIndex]: 1,
				[inputNeuronBIndex]: 1,
			});

			expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(2);
		});

		describe("when there is a hidden neuron between the input neurons and the output neuron", () => {
			let hiddenNeuronIndex: number;

			beforeEach(() => {
				const { neuron: hiddenNeuron } = mutation.insertNeuron(genome, {
					synapseIndex: synapseAIndex,
					neuron: {
						description: "hidden neuron",
						activation: ActivationFunctionType.CONSTANT,
					},
				});

				hiddenNeuronIndex = hiddenNeuron;

				mutation.addSynapse(genome, {
					neuronIn: inputNeuronBIndex,
					neuronOut: hiddenNeuronIndex,
				});

				mutation.setSynapseEnabled(genome, {
					index: synapseBIndex,
					enabled: false,
				});
			});

			test("should add values correctly", () => {
				const brain = new Brain(genome);

				brain.think({
					[inputNeuronAIndex]: 1,
					[inputNeuronBIndex]: 1,
				});

				expect(brain.getNeuronValue(outputNeuronIndex)).toEqual(2);
			});

			describe("when hidden neuron has a latch activation type", () => {
				beforeEach(() => {
					mutation.setNeuronActivationType(genome, {
						index: hiddenNeuronIndex,
						activation: ActivationFunctionType.LATCH,
					});
				});

				test("should add values correctly", () => {
					const brain = new Brain(genome);

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

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
				type: "input",
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			outputNeuronIndex = mutation.addNeuron(genome, {
				type: "output",
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
				type: "input",
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			inputNeuronBIndex = mutation.addNeuron(genome, {
				type: "input",
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			outputNeuronIndex = mutation.addNeuron(genome, {
				type: "output",
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

	/**
	 * A brain with 2 input nodes and 2 output nodes
	 * with 2 layers of hidden nodes between them
	 *
	 * both inputs are connected to both hidden A and B
	 * both hidden A and B are connected to both hidden C and D
	 *
	 * [input A] - - -> [hidden C] - - -> [hidden E] - - -> [output G]
	 *            \ /               \ /
	 * [input B] - - -> [hidden D] - - -> [hidden F] - - -> [output H]
	 *
	 * All tests below were calculated on paper
	 */
	describe("with a large and complex brain with multiple hidden layers", () => {
		let inputNeuronAIndex: number;
		let inputNeuronBIndex: number;

		let hiddenNeuronCIndex: number;
		let hiddenNeuronDIndex: number;
		let synapseACIndex: number;
		let synapseBDIndex: number;
		let synapseADIndex: number;
		let synapseBCIndex: number;

		let hiddenNeuronEIndex: number;
		let hiddenNeuronFIndex: number;
		let synapseCEIndex: number;
		let synapseDFIndex: number;
		let synapseCFIndex: number;
		let synapseDEIndex: number;

		let outputNeuronGIndex: number;
		let outputNeuronHIndex: number;
		let synapseEGIndex: number;
		let synapseFHIndex: number;

		beforeEach(() => {
			// layer 1
			inputNeuronAIndex = mutation.addNeuron(genome, {
				type: "input",
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			inputNeuronBIndex = mutation.addNeuron(genome, {
				type: "input",
				activation: ActivationFunctionType.CONSTANT,
				description: "input",
			});

			// layer 2

			hiddenNeuronCIndex = mutation.addNeuron(genome, {
				type: "hidden",
				activation: ActivationFunctionType.CONSTANT,
				description: "hidden",
			});

			hiddenNeuronDIndex = mutation.addNeuron(genome, {
				type: "hidden",
				activation: ActivationFunctionType.CONSTANT,
				description: "hidden",
			});

			synapseACIndex = mutation.addSynapse(genome, {
				neuronIn: inputNeuronAIndex,
				neuronOut: hiddenNeuronCIndex,
			});

			synapseBDIndex = mutation.addSynapse(genome, {
				neuronIn: inputNeuronBIndex,
				neuronOut: hiddenNeuronDIndex,
			});

			synapseADIndex = mutation.addSynapse(genome, {
				neuronIn: inputNeuronAIndex,
				neuronOut: hiddenNeuronDIndex,
			});

			synapseBCIndex = mutation.addSynapse(genome, {
				neuronIn: inputNeuronBIndex,
				neuronOut: hiddenNeuronCIndex,
			});

			// layer 3

			hiddenNeuronEIndex = mutation.addNeuron(genome, {
				type: "hidden",
				activation: ActivationFunctionType.CONSTANT,
				description: "hidden",
			});

			hiddenNeuronFIndex = mutation.addNeuron(genome, {
				type: "hidden",
				activation: ActivationFunctionType.CONSTANT,
				description: "hidden",
			});

			synapseCEIndex = mutation.addSynapse(genome, {
				neuronIn: hiddenNeuronCIndex,
				neuronOut: hiddenNeuronEIndex,
			});

			synapseDFIndex = mutation.addSynapse(genome, {
				neuronIn: hiddenNeuronDIndex,
				neuronOut: hiddenNeuronFIndex,
			});

			synapseCFIndex = mutation.addSynapse(genome, {
				neuronIn: hiddenNeuronCIndex,
				neuronOut: hiddenNeuronFIndex,
			});

			synapseDEIndex = mutation.addSynapse(genome, {
				neuronIn: hiddenNeuronDIndex,
				neuronOut: hiddenNeuronEIndex,
			});

			// output layer

			outputNeuronGIndex = mutation.addNeuron(genome, {
				type: "output",
				activation: ActivationFunctionType.CONSTANT,
				description: "output",
			});

			outputNeuronHIndex = mutation.addNeuron(genome, {
				type: "output",
				activation: ActivationFunctionType.CONSTANT,
				description: "output",
			});

			synapseEGIndex = mutation.addSynapse(genome, {
				neuronIn: hiddenNeuronEIndex,
				neuronOut: outputNeuronGIndex,
			});

			synapseFHIndex = mutation.addSynapse(genome, {
				neuronIn: hiddenNeuronFIndex,
				neuronOut: outputNeuronHIndex,
			});
		});

		describe("when both inputs are positive", () => {
			let inputs: Record<number, number>;

			beforeEach(() => {
				inputs = {
					[inputNeuronAIndex]: 1,
					[inputNeuronBIndex]: 1,
				};
			});

			test("should resolve the correct output values", () => {
				const brain = new Brain(genome);

				brain.think(inputs);

				expect(brain.getNeuronValue(outputNeuronGIndex)).toEqual(4);
				expect(brain.getNeuronValue(outputNeuronHIndex)).toEqual(4);
			});
		});

		describe("when both inputs are negative", () => {
			let inputs: Record<number, number>;

			beforeEach(() => {
				inputs = {
					[inputNeuronAIndex]: -1,
					[inputNeuronBIndex]: -1,
				};
			});

			test("should resolve the correct output values", () => {
				const brain = new Brain(genome);

				brain.think(inputs);

				expect(brain.getNeuronValue(outputNeuronGIndex)).toEqual(-4);
				expect(brain.getNeuronValue(outputNeuronHIndex)).toEqual(-4);
			});
		});

		describe("when one input is negative", () => {
			let inputs: Record<number, number>;

			beforeEach(() => {
				inputs = {
					[inputNeuronAIndex]: 1,
					[inputNeuronBIndex]: -1,
				};
			});

			test("should resolve the correct output values", () => {
				const brain = new Brain(genome);

				brain.think(inputs);

				expect(brain.getNeuronValue(outputNeuronGIndex)).toEqual(0);
				expect(brain.getNeuronValue(outputNeuronHIndex)).toEqual(0);
			});
		});

		describe("when one side of synapses are weighted to 0.5", () => {
			beforeEach(() => {
				mutation.setSynapseWeight(genome, {
					index: synapseACIndex,
					weight: 0.5,
				});
				mutation.setSynapseWeight(genome, {
					index: synapseADIndex,
					weight: 0.5,
				});
				mutation.setSynapseWeight(genome, {
					index: synapseCEIndex,
					weight: 0.5,
				});
				mutation.setSynapseWeight(genome, {
					index: synapseCFIndex,
					weight: 0.5,
				});
				mutation.setSynapseWeight(genome, {
					index: synapseEGIndex,
					weight: 0.5,
				});
			});

			describe("when both inputs are positive", () => {
				let inputs: Record<number, number>;

				beforeEach(() => {
					inputs = {
						[inputNeuronAIndex]: 1,
						[inputNeuronBIndex]: 1,
					};
				});

				test("should resolve the correct output values", () => {
					const brain = new Brain(genome);

					brain.think(inputs);

					expect(brain.getNeuronValue(outputNeuronGIndex)).toEqual(1.125);
					expect(brain.getNeuronValue(outputNeuronHIndex)).toEqual(2.25);
				});
			});

			describe("when both inputs are negative", () => {
				let inputs: Record<number, number>;

				beforeEach(() => {
					inputs = {
						[inputNeuronAIndex]: -1,
						[inputNeuronBIndex]: -1,
					};
				});

				test("should resolve the correct output values", () => {
					const brain = new Brain(genome);

					brain.think(inputs);

					expect(brain.getNeuronValue(outputNeuronGIndex)).toEqual(-1.125);
					expect(brain.getNeuronValue(outputNeuronHIndex)).toEqual(-2.25);
				});
			});

			describe("when one input is negative", () => {
				let inputs: Record<number, number>;

				beforeEach(() => {
					inputs = {
						[inputNeuronAIndex]: 1,
						[inputNeuronBIndex]: -1,
					};
				});

				test("should resolve the correct output values", () => {
					const brain = new Brain(genome);

					brain.think(inputs);

					expect(brain.getNeuronValue(outputNeuronGIndex)).toEqual(-0.375);
					expect(brain.getNeuronValue(outputNeuronHIndex)).toEqual(-0.75);
				});
			});
		});
	});
});

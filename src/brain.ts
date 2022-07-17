import {
	activationFunctions,
	ActivationFunctionType,
} from "./neuron/activation";
import { calculateLayers } from "./neuron/graph/layers";
import { Neuron } from "./neuron/neuron";
import { Synapse } from "./synapse/synapse";

type HasIndex<T> = T & {
	index: number;
};

type NeuronCreation = {
	activation: ActivationFunctionType;
	description: string;
};

export class Brain {
	neurons: HasIndex<Neuron>[] = [];
	synapses: HasIndex<Synapse>[] = [];

	/**
	 * Neurons to evaluate
	 */
	evaluations: { neuron: number; synapseIndices: number[] }[] = [];

	/**
	 * Thinks through the network and updates the values of all neurons
	 *
	 * @param inputs The input values to the network, keyed by their neuron index
	 */
	think(inputs: Record<number, number>) {
		for (const neuron of this.neurons) {
			neuron.value = 0;
		}

		for (const [indexStr, value] of Object.entries(inputs)) {
			const index = parseInt(indexStr, 10);

			this.neurons[index].value = value;
		}

		for (const evaluation of this.evaluations) {
			const neuron = this.neurons[evaluation.neuron];
			const inputs = [];

			for (const synapseIndex of evaluation.synapseIndices) {
				const synapse = this.synapses[synapseIndex];
				const inputValue = this.neurons[synapse.neuronIn].value;

				inputs.push(inputValue * synapse.weight);
			}

			const sum = inputs.reduce((a, b) => a + b, 0);

			neuron.value = activationFunctions[neuron.activation](
				sum,
				neuron.lastInput,
				neuron.lastOutput
			);

			neuron.lastInput = sum;
			neuron.lastOutput = neuron.value;
		}
	}

	/**
	 * Creates the internal structure of the network
	 */
	private createStructure() {
		const inputs = this.getInputNeurons().map((n) => n.index);
		const outputs = this.getOutputNeurons().map((n) => n.index);
		const connections = this.synapses
			.filter((s) => s.enabled)
			.map(
				(s) => [s.index, s.neuronIn, s.neuronOut] as [number, number, number]
			);

		const layers = calculateLayers(inputs, outputs, connections);

		const links: { neuron: number; synapseIndices: number[] }[] = [];

		for (const layer of layers) {
			for (const neuron of layer) {
				const synapseIndices: number[] = connections
					.filter(([index, left, right]) => right === neuron)
					.map(([index]) => index);

				links.push({
					neuron,
					synapseIndices,
				});
			}
		}

		this.evaluations = links;
	}

	/**
	 * Get all neurons without any input synapses
	 *
	 * @returns The neurons without any input synapses
	 */
	private getInputNeurons() {
		return this.neurons.filter((neuron) =>
			this.synapses.every((s) => s.neuronOut !== neuron.index)
		);
	}

	/**
	 * Get all neurons without any output synapses
	 *
	 * @returns The neurons without any output synapses
	 */
	private getOutputNeurons() {
		return this.neurons.filter((neuron) =>
			this.synapses.every((s) => s.neuronIn !== neuron.index)
		);
	}

	/**
	 * Adds a new neuron to the network
	 *
	 * @param neuron The neuron to add
	 *
	 * @returns The index of the neuron
	 */
	addNeuron(neuron: NeuronCreation) {
		const index = this.neurons.length;

		const newNeuron: HasIndex<Neuron> = {
			...neuron,
			index,
			value: 0,
			lastInput: 0,
			lastOutput: 0,
		};

		this.neurons[index] = newNeuron;

		this.createStructure();

		return index;
	}

	/**
	 * Gets the value of the neuron at the given index
	 *
	 * @param index The index of the neuron
	 *
	 * @returns The value of the neuron
	 */
	getNeuronValue(index: number) {
		return this.neurons[index].value;
	}

	/**
	 * Inserts a neuron in the middle of an existing synapse
	 *
	 * @param synapseIndex The synapse to insert into
	 * @param neuron The neuron to insert
	 *
	 * @returns The index of the new neuron
	 */
	insertNeuron(synapseIndex: number, neuron: NeuronCreation) {
		const synapse = this.synapses[synapseIndex];

		const newNeuronIndex = this.addNeuron(neuron);

		const leftSynapseIndex = this.addSynapse(
			synapse.neuronIn,
			newNeuronIndex,
			1
		);
		const rightSynapseIndex = this.addSynapse(
			newNeuronIndex,
			synapse.neuronOut,
			synapse.weight
		);

		this.setSynapseEnabled(synapseIndex, false);

		return {
			neuron: newNeuronIndex,
			synapses: [leftSynapseIndex, rightSynapseIndex],
		};
	}

	/**
	 * Sets the activation function of the neuron at the given index
	 *
	 * @param index The index of the neuron
	 *
	 * @param activation The activation function to set the neuron to
	 */
	setNeuronActivationType(index: number, activation: ActivationFunctionType) {
		this.neurons[index].activation = activation;
	}

	/**
	 * Adds a new synapse to the network
	 *
	 * @param neuronIn The index of the input neuron
	 * @param neuronOut The index of the output neuron
	 * @param weight The weight of the synapse
	 *
	 * @returns The index of the synapse
	 */
	addSynapse(neuronIn: number, neuronOut: number, weight: number = 1) {
		const index = this.synapses.length;

		const newSynapse: HasIndex<Synapse> = {
			index,
			neuronIn,
			neuronOut,
			weight,
			enabled: true,
		};

		this.synapses[index] = newSynapse;

		this.createStructure();

		return index;
	}

	/**
	 * Sets the enabled state of the synapse at the given index
	 *
	 * @param index The index of the synapse
	 *
	 * @param enabled The enabled state to set the synapse to
	 */
	setSynapseEnabled(index: number, enabled: boolean = true) {
		this.synapses[index].enabled = enabled;

		this.createStructure();
	}

	/**
	 * Sets the weight of the synapse at the given index
	 *
	 * @param index The index of the synapse
	 *
	 * @param weight The weight to set the synapse to
	 */
	setSynapseWeight(index: number, weight: number) {
		this.synapses[index].weight = weight;
	}
}

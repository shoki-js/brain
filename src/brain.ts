import { Genome } from "./genome";
import {
	activationFunctions,
	ActivationFunctionType,
} from "./neuron/activation";
import { calculateLayers } from "./neuron/graph/layers";
import { Neuron } from "./neuron/neuron";
import { Synapse } from "./synapse/synapse";
import { HasIndex } from "./types";

type NeuronCreation = {
	activation: ActivationFunctionType;
	description: string;
};

export class Brain {
	neurons: (HasIndex<Neuron> | null)[] = [];
	synapses: (HasIndex<Synapse> | null)[] = [];

	/**
	 * Neurons to evaluate
	 */
	evaluations: { neuron: number; synapseIndices: number[] }[] = [];

	constructor(genome: Genome) {
		this.neurons = genome.neurons;
		this.synapses = genome.synapses;

		this.evaluations = this.createStructure(this.neurons, this.synapses);
	}

	/**
	 * Thinks through the network and updates the values of all neurons
	 *
	 * @param inputs The input values to the network, keyed by their neuron index
	 */
	think(inputs: Record<number, number>) {
		for (const neuron of this.neurons) {
			if (!neuron) {
				continue;
			}

			neuron.value = 0;
		}

		for (const [indexStr, value] of Object.entries(inputs)) {
			const index = parseInt(indexStr, 10);

			const neuron = this.neurons[index];

			if (neuron) {
				neuron.value = value;
			}
		}

		for (const evaluation of this.evaluations) {
			const neuron = this.neurons[evaluation.neuron];

			if (!neuron) {
				console.error(`Could not find neuron with index ${evaluation.neuron}`);
				continue;
			}

			const inputs = [];

			for (const synapseIndex of evaluation.synapseIndices) {
				const synapse = this.synapses[synapseIndex];

				if (!synapse) {
					console.error(`Could not find synapse with index ${synapseIndex}`);
					continue;
				}

				const neuronIn = this.neurons[synapse.neuronIn];

				if (!neuronIn) {
					console.error(
						`Could not find neuronIn with index ${synapse.neuronIn}`
					);
					continue;
				}

				const inputValue = neuronIn.value;

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
	 * Gets the genome of the brain
	 *
	 * @returns The genome of the brain
	 */
	public getGenome() {
		// clone the genome so any mutations dont affect this brain
		const genome: Genome = {
			neurons: this.neurons.map((n) => (n === null ? null : { ...n })),
			synapses: this.synapses.map((s) => (s === null ? null : { ...s })),
		};

		return genome;
	}

	/**
	 * Gets the value of the neuron at the given index
	 *
	 * @param index The index of the neuron
	 *
	 * @returns The value of the neuron
	 */
	public getNeuronValue(index: number) {
		const neuron = this.neurons[index];

		if (!neuron) {
			return null;
		}

		return neuron.value;
	}

	/**
	 * Creates the internal structure of the network
	 */
	private createStructure(
		neurons: (HasIndex<Neuron> | null)[],
		synapses: (HasIndex<Synapse> | null)[]
	) {
		const validNeurons = neurons.filter(
			(neuron): neuron is HasIndex<Neuron> => neuron !== null
		);

		const inputs = validNeurons
			.filter((neuron) => synapses.every((s) => s?.neuronOut !== neuron.index))
			.map((n) => n.index);

		const outputs = validNeurons
			.filter((neuron) => synapses.every((s) => s?.neuronIn !== neuron.index))
			.map((n) => n.index);

		const connections = this.synapses
			.filter((s): s is HasIndex<Synapse> => Boolean(s?.enabled))
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

		return links;
	}
}

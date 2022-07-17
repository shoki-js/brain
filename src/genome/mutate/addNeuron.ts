import { ActivationFunctionType } from "../../neuron";
import { Neuron } from "../../neuron/neuron";
import { HasIndex } from "../../types";
import { Genome } from "../types";

export type AddNeuronPayload = {
	activation: ActivationFunctionType;
	description: string;
};

/**
 * Adds a new neuron to the genome
 *
 * @param genome The genome to mutate
 * @param payload The neuron to create
 *
 * @returns The index of the neuron
 */
export function addNeuron(genome: Genome, payload: AddNeuronPayload) {
	const index = genome.neurons.length;

	const newNeuron: HasIndex<Neuron> = {
		...payload,
		index,
		value: 0,
		lastInput: 0,
		lastOutput: 0,
	};

	genome.neurons[index] = newNeuron;

	return index;
}

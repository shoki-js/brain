import { Synapse } from "../../synapse";
import { HasIndex } from "../../types";
import { Genome } from "../types";
import { removeSynapse } from "./removeSynapse";

type RemoveNeuronPayload = {
	index: number;
};

/**
 * Remove a neuron from the genome
 *
 * @param genome The genome to mutate
 * @param payload.index The index of the neuron to remove
 *
 * @returns The index of the neuron
 */
export function removeNeuron(genome: Genome, { index }: RemoveNeuronPayload) {
	const neuron = genome.neurons[index];

	if (!neuron) {
		return;
	}

	const connectedSynapses = genome.synapses.filter(
		(s): s is HasIndex<Synapse> =>
			s !== null && (s.neuronIn === index || s.neuronOut === index)
	);

	for (const synapse of connectedSynapses) {
		removeSynapse(genome, { index: synapse.index });
	}

	genome.neurons[index] = null;

	return index;
}

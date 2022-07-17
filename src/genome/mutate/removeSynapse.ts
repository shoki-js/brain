import { Genome } from "../types";

type RemoveSynapsePayload = {
	index: number;
};

/**
 * Remove a synapse from the genome
 *
 * @param genome The genome to mutate
 * @param payload.index The index of the synapse to remove
 *
 * @returns The index of the neuron
 */
export function removeSynapse(genome: Genome, { index }: RemoveSynapsePayload) {
	const synapse = genome.synapses[index];

	if (!synapse) {
		return;
	}

	genome.synapses[index] = null;

	return index;
}

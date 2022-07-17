import { Synapse } from "../../synapse";
import { HasIndex } from "../../types";
import { Genome } from "../types";

type AddSynapsePayload = {
	neuronIn: number;
	neuronOut: number;
	weight?: number;
};

/**
 * Adds a new synapse to the genome
 *
 * @param genome The genome to mutate
 * @param payload.neuronIn The index of the input neuron
 * @param payload.neuronOut The index of the output neuron
 * @param payload.weight The weight of the synapse
 *
 * @returns The index of the synapse
 */
export function addSynapse(
	genome: Genome,
	{ neuronIn, neuronOut, weight = 1 }: AddSynapsePayload
) {
	const index = genome.synapses.length;

	const newSynapse: HasIndex<Synapse> = {
		index,
		neuronIn,
		neuronOut,
		weight,
		enabled: true,
	};

	genome.synapses[index] = newSynapse;

	return index;
}

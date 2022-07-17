import { Genome } from "../types";

type SetSynapseEnabledPayload = {
	index: number;
	weight: number;
};

/**
 * Sets the weight of a synapse
 *
 * @param genome The genome to mutate
 * @param payload.index The index of the synapse
 * @param payload.weight The new weight of the synapse
 *
 * @returns The index of the synapse
 */
export function setSynapseWeight(
	genome: Genome,
	{ index, weight }: SetSynapseEnabledPayload
) {
	const synapse = genome.synapses[index];

	if (!synapse) {
		console.error(`Could not find synapse with index ${index}`);
		return;
	}

	synapse.weight = weight;

	return index;
}

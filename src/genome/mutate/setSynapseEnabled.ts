import { Genome } from "../types";

type SetSynapseEnabledPayload = {
	index: number;
	enabled: boolean;
};

/**
 * Sets the enabled state of a synapse
 *
 * @param genome The genome to mutate
 * @param payload.index The index of the synapse
 * @param payload.enabled The enabled state of the synapse
 *
 * @returns The index of the synapse
 */
export function setSynapseEnabled(
	genome: Genome,
	{ index, enabled }: SetSynapseEnabledPayload
) {
	const synapse = genome.synapses[index];

	if (!synapse) {
		console.error(`Could not find synapse with index ${index}`);
		return;
	}

	synapse.enabled = enabled;

	return index;
}

import { Genome } from "../types";
import { addNeuron, AddNeuronPayload } from "./addNeuron";
import { addSynapse } from "./addSynapse";
import { setSynapseEnabled } from "./setSynapseEnabled";

type NeuronInsertionPayload = {
	synapseIndex: number;
	neuron: AddNeuronPayload;
};

/**
 * Inserts a new neuron within an existing synapse
 *
 * @param genome The genome to mutate
 * @param payload.synapseIndex The index of the synapse to insert the neuron within
 * @param payload.neuron The neuron to create
 *
 * @returns The index of the neuron
 */
export function insertNeuron(
	genome: Genome,
	{ synapseIndex, neuron }: NeuronInsertionPayload
) {
	const synapse = genome.synapses[synapseIndex];

	if (!synapse) {
		throw Error(`Could not find synapse with index ${synapseIndex}`);
	}

	const newNeuronIndex = addNeuron(genome, neuron);

	const leftSynapseIndex = addSynapse(genome, {
		neuronIn: synapse.neuronIn,
		neuronOut: newNeuronIndex,
		weight: 1,
	});
	const rightSynapseIndex = addSynapse(genome, {
		neuronIn: newNeuronIndex,
		neuronOut: synapse.neuronOut,
		weight: synapse.weight,
	});

	setSynapseEnabled(genome, { index: synapseIndex, enabled: false });

	return {
		neuron: newNeuronIndex,
		synapses: [leftSynapseIndex, rightSynapseIndex],
	};
}

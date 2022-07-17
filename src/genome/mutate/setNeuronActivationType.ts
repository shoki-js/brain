import { ActivationFunctionType } from "../../neuron";
import { Genome } from "../types";

type SetSynapseEnabledPayload = {
	index: number;
	activation: ActivationFunctionType;
};

/**
 * Sets the enabled state of a neuron
 *
 * @param genome The genome to mutate
 * @param payload.index The index of the neuron
 * @param payload.activation The activation function of the neuron
 *
 * @returns The index of the neuron
 */
export function setNeuronActivationType(
	genome: Genome,
	{ index, activation }: SetSynapseEnabledPayload
) {
	const neuron = genome.neurons[index];

	if (!neuron) {
		console.error(`Could not find neuron with index ${index}`);
		return;
	}

	neuron.activation = activation;

	return index;
}

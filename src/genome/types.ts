import { Neuron } from "../neuron/neuron";
import { Synapse } from "../synapse/synapse";
import { HasIndex } from "../types";

export type Genome = {
	// support `null` neurons/synapses to allow for deletion
	// TODO consider filtering these out as part of the mutations
	neurons: (HasIndex<Neuron> | null)[];
	synapses: (HasIndex<Synapse> | null)[];
};

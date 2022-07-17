// TODO add innovation
export type Synapse = {
	/**
	 * The index of the input neuron this synapse is connected to
	 */
	neuronIn: number;

	/**
	 * The index of the output neuron this synapse is connected to
	 */
	neuronOut: number;

	/**
	 * The weight of this synapse
	 */
	weight: number;

	/**
	 * Whether the synapse is enabled
	 */
	enabled: boolean;
};

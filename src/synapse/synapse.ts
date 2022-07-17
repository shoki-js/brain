// TODO add innovation
export type Synapse = {
	/**
	 * The index of the input node this synapse is connected to
	 */
	nodeIn: number;

	/**
	 * The index of the output node this synapse is connected to
	 */
	nodeOut: number;

	/**
	 * The weight of this synapse
	 */
	weight: number;

	/**
	 * Whether the synapse is enabled
	 */
	enabled: boolean;
};

export type Synapse = {
	/**
	 * Used to give this node a uniquer identifier based on when it was created.
	 *
	 * This can be used to track genes between generations.
	 */
	innovation: number;

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
};

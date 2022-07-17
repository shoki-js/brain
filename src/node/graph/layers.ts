/**
 * Get a list of the nodes which are required to calculate the network
 *
 * @param inputIndices A list of indices for input nodes
 * @param outputIndices A list of indices for output nodes
 * @param connections A list of [synapseIndex, nodeIn, nodeOut] connections between nodes
 *
 * @returns A list of indices for required nodes
 */
export function getRequiredNodes(
	inputIndices: number[],
	outputIndices: number[],
	connections: [number, number, number][]
) {
	let required = new Set(outputIndices);
	let remaining = new Set(outputIndices);

	while (true) {
		const validNodes = connections
			.filter(([index, a, b]) => !remaining.has(a) && remaining.has(b))
			.map(([index, a, b]) => a);

		if (!validNodes.length) {
			break;
		}

		const layerNodes = validNodes.filter(
			(index) => !inputIndices.includes(index)
		);

		if (!layerNodes.length) {
			break;
		}

		required = new Set([...required, ...layerNodes]);
		remaining = new Set([...remaining, ...validNodes]);
	}

	return required;
}

/**
 * Calculate the parallelisable layers of the graph, based on the given connections
 *
 * @param inputIndices A list of indices for input nodes
 * @param outputIndices A list of indices for output nodes
 * @param connections A list of [synapseIndex, nodeIn, nodeOut] connections between nodes
 *
 * @returns A list of list of node indices, representing the parallelisable layers
 */
export function calculateLayers(
	inputIndices: number[],
	outputIndices: number[],
	connections: [number, number, number][]
) {
	const required = getRequiredNodes(inputIndices, outputIndices, connections);

	const layers = [];

	let remaining = new Set(inputIndices);

	while (true) {
		const candidates = connections
			.filter(([index, a, b]) => remaining.has(a) && !remaining.has(b))
			.map(([index, a, b]) => b);

		const output = new Set<number>();

		for (const node of candidates) {
			const isRequired = required.has(node);

			const inputConnections = connections.filter(
				([index, a, b]) => b === node
			);
			const allInputsRemaining = inputConnections.every(([index, a, b]) =>
				remaining.has(a)
			);

			if (isRequired && allInputsRemaining) {
				output.add(node);
			}
		}

		if (!output.size) {
			break;
		}

		layers.push(Array.from(output));
		remaining = new Set([...remaining, ...output]);
	}

	return layers;
}

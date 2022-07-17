/**
 * Get a list of the neurons which are required to calculate the network
 *
 * @param inputIndices A list of indices for input neurons
 * @param outputIndices A list of indices for output neurons
 * @param connections A list of [synapseIndex, neuronIn, neuronOut] connections between neurons
 *
 * @returns A list of indices for required neurons
 */
export function getRequiredNeurons(
	inputIndices: number[],
	outputIndices: number[],
	connections: [number, number, number][]
) {
	let required = new Set(outputIndices);
	let remaining = new Set(outputIndices);

	while (true) {
		const validNeurons = connections
			.filter(([index, a, b]) => !remaining.has(a) && remaining.has(b))
			.map(([index, a, b]) => a);

		if (!validNeurons.length) {
			break;
		}

		const layerNeurons = validNeurons.filter(
			(index) => !inputIndices.includes(index)
		);

		if (!layerNeurons.length) {
			break;
		}

		required = new Set([...required, ...layerNeurons]);
		remaining = new Set([...remaining, ...validNeurons]);
	}

	return required;
}

/**
 * Calculate the parallelisable layers of the graph, based on the given connections
 *
 * @param inputIndices A list of indices for input neurons
 * @param outputIndices A list of indices for output neurons
 * @param connections A list of [synapseIndex, neuronIn, neuronOut] connections between neurons
 *
 * @returns A list of list of neuron indices, representing the parallelisable layers
 */
export function calculateLayers(
	inputIndices: number[],
	outputIndices: number[],
	connections: [number, number, number][]
) {
	const required = getRequiredNeurons(inputIndices, outputIndices, connections);

	const layers = [];

	let remaining = new Set(inputIndices);

	while (true) {
		const candidates = connections
			.filter(([index, a, b]) => remaining.has(a) && !remaining.has(b))
			.map(([index, a, b]) => b);

		const output = new Set<number>();

		for (const neuron of candidates) {
			const isRequired = required.has(neuron);

			const inputConnections = connections.filter(
				([index, a, b]) => b === neuron
			);
			const allInputsRemaining = inputConnections.every(([index, a, b]) =>
				remaining.has(a)
			);

			if (isRequired && allInputsRemaining) {
				output.add(neuron);
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

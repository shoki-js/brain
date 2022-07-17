import { activationFunctions, ActivationFunctionType } from "./node/activation";
import { calculateLayers } from "./node/graph/layers";
import { Node } from "./node/node";
import { Synapse } from "./synapse/synapse";

type HasIndex<T> = T & {
	index: number;
};

type NodeCreation = {
	activation: ActivationFunctionType;
	description: string;
};

export class Brain {
	nodes: HasIndex<Node>[] = [];
	synapses: HasIndex<Synapse>[] = [];

	/**
	 * Nodes to evaluate
	 */
	evaluations: { node: number; synapseIndices: number[] }[] = [];

	/**
	 * Thinks through the network and updates the values of all nodes
	 *
	 * @param inputs The input values to the network, keyed by their node index
	 */
	think(inputs: Record<number, number>) {
		for (const node of this.nodes) {
			node.value = 0;
		}

		for (const [indexStr, value] of Object.entries(inputs)) {
			const index = parseInt(indexStr, 10);

			this.nodes[index].value = value;
		}

		for (const evaluation of this.evaluations) {
			const node = this.nodes[evaluation.node];
			const inputs = [];

			for (const synapseIndex of evaluation.synapseIndices) {
				const synapse = this.synapses[synapseIndex];
				const inputValue = this.nodes[synapse.nodeIn].value;

				inputs.push(inputValue * synapse.weight);
			}

			const sum = inputs.reduce((a, b) => a + b, 0);

			node.value = activationFunctions[node.activation](
				sum,
				node.lastInput,
				node.lastOutput
			);

			node.lastInput = sum;
			node.lastOutput = node.value;
		}
	}

	/**
	 * Creates the internal structure of the network
	 */
	private createStructure() {
		const inputs = this.getInputNodes().map((n) => n.index);
		const outputs = this.getOutputNodes().map((n) => n.index);
		const connections = this.synapses
			.filter((s) => s.enabled)
			.map((s) => [s.index, s.nodeIn, s.nodeOut] as [number, number, number]);

		const layers = calculateLayers(inputs, outputs, connections);

		const links: { node: number; synapseIndices: number[] }[] = [];

		for (const layer of layers) {
			for (const node of layer) {
				const synapseIndices: number[] = connections
					.filter(([index, left, right]) => right === node)
					.map(([index]) => index);

				links.push({
					node,
					synapseIndices,
				});
			}
		}

		this.evaluations = links;
	}

	/**
	 * Get all nodes without any input synapses
	 *
	 * @returns The nodes without any input synapses
	 */
	private getInputNodes() {
		return this.nodes.filter((node) =>
			this.synapses.every((s) => s.nodeOut !== node.index)
		);
	}

	/**
	 * Get all nodes without any output synapses
	 *
	 * @returns The nodes without any output synapses
	 */
	private getOutputNodes() {
		return this.nodes.filter((node) =>
			this.synapses.every((s) => s.nodeIn !== node.index)
		);
	}

	/**
	 * Adds a new node to the network
	 *
	 * @param node The node to add
	 *
	 * @returns The index of the node
	 */
	addNode(node: NodeCreation) {
		const index = this.nodes.length;

		const newNode: HasIndex<Node> = {
			...node,
			index,
			value: 0,
			lastInput: 0,
			lastOutput: 0,
		};

		this.nodes[index] = newNode;

		this.createStructure();

		return index;
	}

	/**
	 * Gets the value of the node at the given index
	 *
	 * @param index The index of the node
	 *
	 * @returns The value of the node
	 */
	getNodeValue(index: number) {
		return this.nodes[index].value;
	}

	/**
	 * Inserts a node in the middle of an existing synapse
	 *
	 * @param synapseIndex The synapse to insert into
	 * @param node The node to insert
	 *
	 * @returns The index of the new node
	 */
	insertNode(synapseIndex: number, node: NodeCreation) {
		const synapse = this.synapses[synapseIndex];

		const newNodeIndex = this.addNode(node);

		const leftSynapseIndex = this.addSynapse(synapse.nodeIn, newNodeIndex, 1);
		const rightSynapseIndex = this.addSynapse(
			newNodeIndex,
			synapse.nodeOut,
			synapse.weight
		);

		this.setSynapseEnabled(synapseIndex, false);

		return {
			node: newNodeIndex,
			synapses: [leftSynapseIndex, rightSynapseIndex],
		};
	}

	/**
	 * Sets the activation function of the node at the given index
	 *
	 * @param index The index of the node
	 *
	 * @param activation The activation function to set the node to
	 */
	setNodeActivationType(index: number, activation: ActivationFunctionType) {
		this.nodes[index].activation = activation;
	}

	/**
	 * Adds a new synapse to the network
	 *
	 * @param nodeIn The index of the input node
	 * @param nodeOut The index of the output node
	 * @param weight The weight of the synapse
	 *
	 * @returns The index of the synapse
	 */
	addSynapse(nodeIn: number, nodeOut: number, weight: number = 1) {
		const index = this.synapses.length;

		const newSynapse: HasIndex<Synapse> = {
			index,
			nodeIn,
			nodeOut,
			weight,
			enabled: true,
		};

		this.synapses[index] = newSynapse;

		this.createStructure();

		return index;
	}

	/**
	 * Sets the enabled state of the synapse at the given index
	 *
	 * @param index The index of the synapse
	 *
	 * @param enabled The enabled state to set the synapse to
	 */
	setSynapseEnabled(index: number, enabled: boolean = true) {
		this.synapses[index].enabled = enabled;

		this.createStructure();
	}

	/**
	 * Sets the weight of the synapse at the given index
	 *
	 * @param index The index of the synapse
	 *
	 * @param weight The weight to set the synapse to
	 */
	setSynapseWeight(index: number, weight: number) {
		this.synapses[index].weight = weight;
	}
}

import { activationFunctions, ActivationFunctionType } from "./node/activation";
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
	 * Map of node index -> [synapse indices]
	 */
	targetNodes: Map<number, number[]> = new Map();

	private createStructure() {
		this.targetNodes.clear();

		for (const synapse of this.synapses) {
			const nodeOut = synapse.nodeOut;

			const existingLink = this.targetNodes.get(nodeOut);

			if (existingLink) {
				existingLink.push(synapse.index);
			} else {
				this.targetNodes.set(nodeOut, [synapse.index]);
			}
		}
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
		};

		this.synapses[index] = newSynapse;

		this.createStructure();

		return index;
	}

	/**
	 * Gets the value of the node at the given index
	 *
	 * @param index	The index of the node
	 *
	 * @param value The value to set the node to
	 */
	setValue(index: number, value: number) {
		// TODO only allow on nodes without any input synapses

		this.nodes[index].value = value;
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
	 * Gets the value of the node at the given index
	 *
	 * @param index The index of the node
	 *
	 * @returns The value of the node
	 */
	getValue(index: number) {
		return this.nodes[index].value;
	}

	/**
	 * Thinks through the network and updates the values of all nodes
	 */
	think() {
		for (const [nodeIndex, synapseIndices] of this.targetNodes.entries()) {
			const node = this.nodes[nodeIndex];

			let sum = 0;

			for (const synapseIndex of synapseIndices) {
				const synapse = this.synapses[synapseIndex];

				sum += synapse.weight * this.nodes[synapse.nodeIn].value;
			}

			node.value = activationFunctions[node.activation](
				sum,
				node.lastInput,
				node.lastOutput
			);
			node.lastInput = sum;
			node.lastOutput = node.value;
		}
	}
}

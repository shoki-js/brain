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
	 *
	 * If there are multiple hidden layers, you will need to think() multiple times
	 *
	 * TODO consider a better solution...
	 */
	think() {
		for (const [nodeIndex, synapseIndices] of this.targetNodes.entries()) {
			const node = this.nodes[nodeIndex];

			let sum = 0;

			for (const synapseIndex of synapseIndices) {
				const synapse = this.synapses[synapseIndex];

				if (!synapse.enabled) {
					continue;
				}

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

# brain

feedforward neural network

## Installation

```sh
$ yarn add @shoki/brain
```

## Usage

`@shoki/brain` makes it simple to set up a neural network.

### Genome

A Brain is created from a Genome. A Genome represents the "physical" structure of the brain.

You can create a basic 1-1 neuron network like so:

```ts
import { createGenome, mutation, Brain } from "@shoki/brain";

const genome = createGenome();

const inputNeuronIndex = mutation.addNeuron(genome, {
	type: "input",
	// 1 <-> 1 map from input value to output value
	activation: ActivationFunctionType.CONSTANT,
	description: "input",
});

const outputNeuronIndex = mutation.addNeuron(genome, {
	type: "output",
	// 1 <-> 1 map from input value to output value
	activation: ActivationFunctionType.CONSTANT,
	description: "output",
});

// synapse weight is 1 by default
mutation.addSynapse(genome, {
	neuronIn: inputNeuronIndex,
	neuronOut: outputNeuronIndex,
	weight: 1,
});

const brain = new Brain(genome);

brain.think({
	[inputNeuronIndex]: 1,
});

brain.getNeuronValue(outputNeuronIndex); // 1
```

![image of 1-1 network](/examples/simple_1_1_network.png)

The input value of `1` has the following journey:

- set to input neuron (type is `constant`, so it isn't modified)
- passed through synapse (weight is `1`, so value is `1 * 1`)
- set to output neuron (type is `constant` again, so it isn't modified)

### Activation functions

Activation functions allow you to manipulate a value within a neuron.

Let's see how we can make a neuron convert negative numbers to positive with the `absolute` activation function.

```ts
import { createGenome, mutation, Brain } from "@shoki/brain";

const genome = createGenome();

const inputNeuronIndex = mutation.addNeuron(genome, {
	type: "input",
	// 1 <-> 1 map from input value to output value
	activation: ActivationFunctionType.CONSTANT,
	description: "input",
});

const outputNeuronIndex = mutation.addNeuron(genome, {
	type: "output",
	// 1 <-> 1 map from input value to output value
	activation: ActivationFunctionType.ABSOLUTE,
	description: "output",
});

// synapse weight is 1 by default
mutation.addSynapse(genome, {
	neuronIn: inputNeuronIndex,
	neuronOut: outputNeuronIndex,
	weight: 1,
});

const brain = new Brain(genome);

brain.think({
	[inputNeuronIndex]: -1,
});

brain.getNeuronValue(outputNeuronIndex); // 1
```

![image of 1-1 network](/examples/simple_1_1_network_absolute.png)

Here you can see how the `absolute` activation type turns the negative input of `-1` into a positive input of `1`.

### Multiple inputs

One neuron can receive inputs from multiple synapses. The only aggregation function available here at the moment is `sum`.

You can create this simply by binding multiple `addSynapse` calls to the same output neuron.

![image of 2-1 network](/examples/2_1_network.png)

### Hidden neurons

You can create hidden neurons within the network at any point.

Inputs / outputs are only determined by finding neurons which don't have any input synapses, or output synapses, respectively.

To insert a neuron within an existing synapse, you can use `insertNeuron`.

```ts
mutation.insertNeuron(genome, {
	synapseIndex,
	neuron: {
		description: "hidden",
		activation: ActivationFunctionType.ABSOLUTE,
	},
});
```

When inserting a neuron within a synapse, the right-hand synapse carries the weight from the replaced synapse, while the left-hand synapse is given a weight of `0`.

![hidden inserted neuron](/examples/hidden_inserted_node.png)

## Future improvements

- Add other activation functions as required
- Add biases to neurons
- Implement innovation numbers for use with NEAT

## References

- **Efficient Evolution of Neural Network Topologies**

  _Kenneth O. Stanley and Risto Miikkulainen_

  https://nn.cs.utexas.edu/downloads/papers/stanley.cec02.pdf

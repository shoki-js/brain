# brain

feedforward neural network

## Installation

```sh
$ yarn add @shoki/brain
```

## Usage

`@shoki/brain` makes it simple to set up a neural network.

You can create a basic 1-1 node network like so:

```ts
import { Brain, ActivationFunctionType } from "@shoki/brain";

const inputNodeIndex = brain.addNode({
	// 1 <-> 1 map from input value to output value
	activation: ActivationFunctionType.CONSTANT,
	description: "input",
});

const outputNodeIndex = brain.addNode({
	// 1 <-> 1 map from input value to output value
	activation: ActivationFunctionType.CONSTANT,
	description: "output",
});

// synapse weight is 1 by default
brain.addSynapse(inputNodeIndex, outputNodeIndex);

brain.think({
	[inputNodeIndex]: 1,
});

brain.getValue(outputNodeIndex); // 1
```

![image of 1-1 network](/examples/simple_1_1_network.png)

The input value of `1` has the following journey:

- set to input node (type is `constant`, so it isn't modified)
- passed through synapse (weight is `1`, so value is `1 * 1`)
- set to output node (type is `constant` again, so it isn't modified)

### Activation functions

Activation functions allow you to manipulate a value within a node.

Let's see how we can make a node convert negative numbers to positive with the `absolute` activation function.

```ts
import { Brain, ActivationFunctionType } from "@shoki/brain";

const inputNodeIndex = brain.addNode({
	// 1 <-> 1 map from input value to output value
	activation: ActivationFunctionType.CONSTANT,
	description: "input",
});

const outputNodeIndex = brain.addNode({
	// Math.abs(input)
	activation: ActivationFunctionType.ABSOLUTE,
	description: "output",
});

// synapse weight is 1 by default
brain.addSynapse(inputNodeIndex, outputNodeIndex);

brain.think({
	[inputNodeIndex]: 1,
});

brain.getValue(outputNodeIndex); // 1
```

![image of 1-1 network](/examples/simple_1_1_network_absolute.png)

Here you can see how the `absolute` activation type turns the negative input of `-1` into a positive input of `1`.

### Multiple inputs

One node can receive inputs from multiple synapses. The only aggregation function available here at the moment is `sum`.

You can create this simply by binding multiple `addSynapse` calls to the same output node.

![image of 2-1 network](/examples/2_1_network.png)

### Hidden nodes

You can create hidden nodes within the network at any point.

Inputs / outputs are only determined by finding nodes which don't have any input synapses, or output synapses, respectively.

To insert a node within an existing synapse, you can use `insertNode`.

```ts
brain.insertNode(synapseIndex, {
	description: "hidden",
	activation: ActivationFunctionType.ABSOLUTE,
});
```

When inserting a node within a synapse, the right-hand synapse carries the weight from the replaced synapse, while the left-hand synapse is given a weight of `0`.

![hidden inserted node](/examples/hidden_inserted_node.png)

## References

- **Efficient Evolution of Neural Network Topologies**

  _Kenneth O. Stanley and Risto Miikkulainen_

  https://nn.cs.utexas.edu/downloads/papers/stanley.cec02.pdf

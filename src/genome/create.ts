import { Genome } from "./types";

export function createGenome(): Genome {
	return {
		neurons: [],
		synapses: [],
	};
}

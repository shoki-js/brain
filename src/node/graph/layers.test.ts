import { calculateLayers, getRequiredNodes } from "./layers";

describe("getRequiredNodes", () => {
	describe("when given a simple graph with 1 input and 1 output", () => {
		const inputIndices = [0];
		const outputIndices = [1];
		const connections = [[0, 1]] as [number, number][];

		it("should return the required nodes", () => {
			const required = getRequiredNodes(
				inputIndices,
				outputIndices,
				connections
			);

			expect(Array.from(required)).toEqual([1]);
		});
	});

	describe("when given a graph with 2 inputs and 1 output", () => {
		const inputIndices = [0, 1];
		const outputIndices = [2];
		const connections = [
			[0, 2],
			[1, 2],
		] as [number, number][];

		it("should return the required nodes", () => {
			const required = getRequiredNodes(
				inputIndices,
				outputIndices,
				connections
			);

			expect(Array.from(required)).toEqual([2]);
		});
	});

	describe("when given a complex brain with 3 inputs and 3 outputs", () => {
		const inputIndices = [0, 1, 2];
		const outputIndices = [3, 4, 5];
		const connections = [
			[0, 3],
			[1, 3],
			[2, 3],
			[3, 4],
			[3, 5],
		] as [number, number][];

		it("should return the required nodes", () => {
			const required = getRequiredNodes(
				inputIndices,
				outputIndices,
				connections
			);

			expect(Array.from(required)).toEqual([3, 4, 5]);
		});
	});

	describe("when given a complex brain 2 inputs, 2 outputs, and a hidden layer", () => {
		const inputIndices = [0, 1];
		const outputIndices = [2, 3];
		const connections = [
			[0, 4],
			[4, 5],
			[5, 2],
			[4, 2],
			[1, 2],
		] as [number, number][];

		it("should return the required nodes", () => {
			const required = getRequiredNodes(
				inputIndices,
				outputIndices,
				connections
			);

			expect(Array.from(required)).toEqual([2, 3, 5, 4]);
		});
	});
});

describe("calculateLayers", () => {
	describe("when given a simple graph with 1 input and 1 output", () => {
		const inputIndices = [0];
		const outputIndices = [1];
		const connections = [[0, 1]] as [number, number][];

		it("should return the correct layers", () => {
			const layers = calculateLayers(inputIndices, outputIndices, connections);

			expect(Array.from(layers)).toEqual([[1]]);
		});
	});

	describe("when given a simple graph with 2 inputs and 1 output", () => {
		const inputIndices = [0, 1];
		const outputIndices = [2];
		const connections = [
			[0, 2],
			[1, 2],
		] as [number, number][];

		it("should return the correct layers", () => {
			const layers = calculateLayers(inputIndices, outputIndices, connections);

			expect(Array.from(layers)).toEqual([[2]]);
		});
	});

	describe("when given a complex brain with 3 inputs and 3 outputs", () => {
		const inputIndices = [0, 1, 2];
		const outputIndices = [3, 4, 5];
		const connections = [
			[0, 3],
			[1, 3],
			[2, 3],
			[3, 4],
			[3, 5],
		] as [number, number][];

		it("should return the required nodes", () => {
			const layers = calculateLayers(inputIndices, outputIndices, connections);

			expect(Array.from(layers)).toEqual([[3], [4, 5]]);
		});
	});

	describe("when given a complex brain 2 inputs, 2 outputs, and a hidden layer", () => {
		const inputIndices = [0, 1];
		const outputIndices = [2, 3];
		const connections = [
			[0, 4],
			[4, 5],
			[5, 2],
			[4, 2],
			[1, 2],
		] as [number, number][];

		it("should return the required nodes", () => {
			const layers = calculateLayers(inputIndices, outputIndices, connections);

			expect(Array.from(layers)).toEqual([[4], [5], [2]]);
		});
	});

	describe("when given a very complex brain with a large hidden layer", () => {
		const inputIndices = [0, 1, 2, 3];
		const outputIndices = [11, 12, 13];
		const connections = [
			[0, 4],
			[1, 4],
			[1, 5],
			[2, 5],
			[2, 6],
			[3, 6],
			[3, 7],
			[4, 8],
			[5, 8],
			[5, 9],
			[5, 10],
			[6, 10],
			[6, 7],
			[8, 11],
			[8, 12],
			[8, 9],
			[9, 10],
			[7, 10],
			[10, 12],
			[10, 13],
		] as [number, number][];

		it("should return the required nodes", () => {
			const layers = calculateLayers(inputIndices, outputIndices, connections);

			expect(Array.from(layers)).toEqual([
				[4, 5, 6],
				[7, 8],
				[9, 11],
				[10],
				[12, 13],
			]);
		});
	});
});

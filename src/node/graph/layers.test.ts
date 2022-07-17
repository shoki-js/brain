import { calculateLayers, getRequiredNodes } from "./layers";

describe("getRequiredNodes", () => {
	describe("when given a simple graph with 1 input and 1 output", () => {
		const inputIndices = [0];
		const outputIndices = [1];
		const connections = [[0, 0, 1]] as [number, number, number][];

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
			[0, 0, 2],
			[1, 1, 2],
		] as [number, number, number][];

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
			[0, 0, 3],
			[1, 1, 3],
			[2, 2, 3],
			[3, 3, 4],
			[4, 3, 5],
		] as [number, number, number][];

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
			[0, 0, 4],
			[1, 4, 5],
			[2, 5, 2],
			[3, 4, 2],
			[4, 1, 2],
		] as [number, number, number][];

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
		const connections = [[0, 0, 1]] as [number, number, number][];

		it("should return the correct layers", () => {
			const layers = calculateLayers(inputIndices, outputIndices, connections);

			expect(Array.from(layers)).toEqual([[1]]);
		});
	});

	describe("when given a simple graph with 2 inputs and 1 output", () => {
		const inputIndices = [0, 1];
		const outputIndices = [2];
		const connections = [
			[0, 0, 2],
			[1, 1, 2],
		] as [number, number, number][];

		it("should return the correct layers", () => {
			const layers = calculateLayers(inputIndices, outputIndices, connections);

			expect(Array.from(layers)).toEqual([[2]]);
		});
	});

	describe("when given a complex brain with 3 inputs and 3 outputs", () => {
		const inputIndices = [0, 1, 2];
		const outputIndices = [3, 4, 5];
		const connections = [
			[0, 0, 3],
			[1, 1, 3],
			[2, 2, 3],
			[3, 3, 4],
			[4, 3, 5],
		] as [number, number, number][];

		it("should return the required nodes", () => {
			const layers = calculateLayers(inputIndices, outputIndices, connections);

			expect(Array.from(layers)).toEqual([[3], [4, 5]]);
		});
	});

	describe("when given a complex brain 2 inputs, 2 outputs, and a hidden layer", () => {
		const inputIndices = [0, 1];
		const outputIndices = [2, 3];
		const connections = [
			[0, 0, 4],
			[1, 4, 5],
			[2, 5, 2],
			[3, 4, 2],
			[4, 1, 2],
		] as [number, number, number][];

		it("should return the required nodes", () => {
			const layers = calculateLayers(inputIndices, outputIndices, connections);

			expect(Array.from(layers)).toEqual([[4], [5], [2]]);
		});
	});

	describe("when given a very complex brain with a large hidden layer", () => {
		const inputIndices = [0, 1, 2, 3];
		const outputIndices = [11, 12, 13];
		const connections = [
			[0, 0, 4],
			[1, 1, 4],
			[2, 1, 5],
			[3, 2, 5],
			[4, 2, 6],
			[5, 3, 6],
			[6, 3, 7],
			[7, 4, 8],
			[8, 5, 8],
			[9, 5, 9],
			[10, 5, 10],
			[11, 6, 10],
			[12, 6, 7],
			[13, 8, 11],
			[14, 8, 12],
			[15, 8, 9],
			[16, 9, 10],
			[17, 7, 10],
			[18, 10, 12],
			[19, 10, 13],
		] as [number, number, number][];

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

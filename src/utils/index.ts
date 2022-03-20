import { ICell } from "../types";

export function getNodesInShortestPathOrder(finishNode: ICell) {
	const nodesInShortestPathOrder = [];
	let currentNode = finishNode;
	while (currentNode !== null) {
		nodesInShortestPathOrder.unshift(currentNode);
		currentNode = currentNode.previousNode!!;
	}
	return nodesInShortestPathOrder;
}

function euclideanDistance(nodeA: ICell, nodeB: ICell) {
	const a = nodeA.row - nodeB.row;
	const b = nodeA.col - nodeB.col;
	return Math.sqrt(a * a + b * b);
}

function getNodeNeighbors(node: ICell, grid: ICell[][]) {
	const neighbors = [];
	const { col, row } = node;
	for (let i = row - 1; i <= row + 1; i++) {
		for (let j = col - 1; j <= col + 1; j++) {
			if (i === row && j === col) continue;
			if (i < 0 || i >= grid.length) continue;
			if (j < 0 || j >= grid[0].length) continue;
			const neighbor = grid[i][j];
			if (neighbor.isWall) continue;
			if (neighbor.isVisited) continue;
			neighbor.isVisited = true;
			neighbors.push(neighbor);
		}
	}
	return neighbors;
}

function getLowestFScoreNode(list: ICell[]) {
	const sortedList = list.sort((nodeA, nodeB) => nodeA.fScore - nodeB.fScore);

	return sortedList[0];
}

function equalNodes(nodeA: ICell, nodeB: ICell) {
	return nodeA.row === nodeB.row && nodeA.col === nodeB.col;
}

export function AstarSearch(
	grid: ICell[][],
	startNode: ICell,
	finishNode: ICell
) {
	startNode.gScore = 0;
	startNode.hScore = 0;
	startNode.fScore = 0;
	let openList: ICell[] = [startNode];
	let closedList: ICell[] = [];

	while (openList.length > 0) {
		let currentNode = getLowestFScoreNode(openList);
		if (equalNodes(currentNode, finishNode)) {
			return closedList;
		}
		openList = openList.filter((node) => !equalNodes(node, currentNode));
		let nodeNeighbors = getNodeNeighbors(currentNode, grid);
		for (let neighbor of nodeNeighbors) {
			let tentativeGScore = euclideanDistance(neighbor, currentNode);
			if (tentativeGScore < neighbor.gScore) {
				closedList.push(neighbor);
				neighbor.previousNode = currentNode;
				neighbor.gScore = tentativeGScore;
				neighbor.hScore = euclideanDistance(neighbor, finishNode);
				neighbor.fScore = neighbor.gScore + neighbor.hScore;
				if (!openList.includes(neighbor)) {
					openList.push(neighbor);
				}
			}
		}
	}
	return closedList;
}

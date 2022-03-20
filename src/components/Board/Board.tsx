import { Component } from "react";
import { ICell } from "../../types";
import { getNodesInShortestPathOrder, AstarSearch } from "../../utils";
import Cell from "../Cell";
import "./Board.css";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

interface StateProps {
	grid: ICell[][];
	mouseIsPressed: boolean;
}

export default class Board extends Component<any, StateProps> {
	constructor(props: any) {
		super(props);

		this.state = {
			grid: [],
			mouseIsPressed: false,
		};
	}

	componentDidMount() {
		const grid = getInitialGrid();
		this.setState({ grid });
	}

	handleMouseDown(row: number, col: number) {
		const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
		this.setState({ grid: newGrid, mouseIsPressed: true });
	}

	handleMouseEnter(row: number, col: number) {
		if (!this.state.mouseIsPressed) return;
		const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
		this.setState({ grid: newGrid });
	}

	handleMouseUp() {
		this.setState({ mouseIsPressed: false });
	}

	animateAstar(
		visitedNodesInOrder: ICell[],
		nodesInShortestPathOrder: ICell[]
	) {
		for (let i = 0; i <= visitedNodesInOrder.length; i++) {
			if (i === visitedNodesInOrder.length) {
				setTimeout(() => {
					this.animateShortestPath(nodesInShortestPathOrder);
				}, 10 * i);
				return;
			}
			setTimeout(() => {
				const node = visitedNodesInOrder[i];
				document.getElementById(`node-${node.row}-${node.col}`)!!.className =
					"node node-visited";
			}, 10 * i);
		}
	}

	animateShortestPath(nodesInShortestPathOrder: ICell[]) {
		for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
			setTimeout(() => {
				const node = nodesInShortestPathOrder[i];
				document.getElementById(`node-${node.row}-${node.col}`)!!.className =
					"node node-shortest-path";
			}, 50 * i);
		}
	}

	playAnimation() {
		const { grid } = this.state;
		const startNode = grid[START_NODE_ROW][START_NODE_COL];
		const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
		const visitedNodesInOrder = AstarSearch(grid, startNode, finishNode);
		const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
		this.animateAstar(visitedNodesInOrder, nodesInShortestPathOrder);
	}

	render() {
		const { grid, mouseIsPressed } = this.state;
		return (
			<>
				<button onClick={() => this.playAnimation()}>A* Search</button>
				<div className="grid">
					{grid.map((row, rowIdx) => {
						return (
							<div key={rowIdx}>
								{row.map((cell, cellIdx) => {
									const { row, col, isFinish, isStart, isWall } = cell;
									return (
										<Cell
											key={cellIdx}
											col={col}
											isFinish={isFinish}
											isStart={isStart}
											isWall={isWall}
											row={row}
											mouseIsPressed={mouseIsPressed}
											onMouseDown={(row, col) => this.handleMouseDown(row, col)}
											onMouseEnter={(row, col) =>
												this.handleMouseEnter(row, col)
											}
											onMouseUp={() => this.handleMouseUp()}
										/>
									);
								})}
							</div>
						);
					})}
				</div>
			</>
		);
	}
}

const createNode: (col: number, row: number) => ICell = (
	col: number,
	row: number
) => {
	return {
		col,
		row,
		isStart: row === START_NODE_ROW && col === START_NODE_COL,
		isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
		isVisited: false,
		isWall: false,
		previousNode: null,
		gScore: Infinity,
		hScore: Infinity,
		fScore: Infinity,
	};
};

const getInitialGrid = () => {
	const grid = [];
	for (let row = 0; row < 20; row++) {
		const currentRow = [];
		for (let col = 0; col < 49; col++) {
			currentRow.push(createNode(col, row));
		}
		grid.push(currentRow);
	}
	return grid;
};

const getNewGridWithWallToggled = (
	grid: ICell[][],
	row: number,
	col: number
) => {
	const newGrid = grid.slice();
	const node = newGrid[row][col];
	const newNode = {
		...node,
		isWall: !node.isWall,
	};
	newGrid[row][col] = newNode;
	return newGrid;
};

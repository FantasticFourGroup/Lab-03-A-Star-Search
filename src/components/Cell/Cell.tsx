import "./Cell.css";

interface CellProps {
	col: number;
	isFinish: boolean;
	isStart: boolean;
	isWall: boolean;
	row: number;
	mouseIsPressed: boolean;
	onMouseDown(row: number, col: number): void;
	onMouseEnter(row: number, col: number): void;
	onMouseUp(): void;
}

export default function Cell({
	col,
	isFinish,
	isStart,
	isWall,
	onMouseDown,
	onMouseEnter,
	onMouseUp,
	row,
	mouseIsPressed,
}: CellProps) {
	const extraClassName = isFinish
		? "node-finish"
		: isStart
		? "node-start"
		: isWall
		? "node-wall"
		: "";

	return (
		<div
			id={`node-${row}-${col}`}
			className={`node ${extraClassName}`}
			onMouseDown={() => onMouseDown(row, col)}
			onMouseEnter={() => onMouseEnter(row, col)}
			onMouseUp={() => onMouseUp()}
		></div>
	);
}

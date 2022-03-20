export interface ICell {
	col: number;
	row: number;
	isStart: boolean;
	isFinish: boolean;
	isVisited: boolean;
	isWall: boolean;
	previousNode: ICell | null;
	hScore: number;
	gScore: number;
	fScore: number;
}

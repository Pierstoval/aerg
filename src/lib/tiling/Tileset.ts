import Tile from './Tile';
import HexagonalCoordinateSystem, { HexagonalAngle } from './HexagonalCoordinateSystem';

export default class Tileset {
	private readonly _hexSize: number;
	private readonly _hcs: HexagonalCoordinateSystem;
	private readonly _xMax: number;
	private readonly _yMax: number;

	private readonly _tileHeight: number;
	private readonly _tileWidth: number;

	// Distance from a point/vertex to the opposite one.
	private readonly _verticesDiameter: number;

	// Distance from a side/edge to the opposite one.
	private readonly _edgesDiameter: number;

	// 1st level: rows, 2nd level: row cells
	private _board: Tile[][] = [];
	private readonly _boardHeight: number;
	private readonly _boardWidth: number;

	constructor(
		hexSize: number,
		xMax: number,
		yMax: number,
		hcs?: HexagonalCoordinateSystem | undefined
	) {
		this._hcs = hcs || HexagonalCoordinateSystem.default();
		this._hexSize = hexSize;
		this._xMax = xMax;
		this._yMax = yMax;
		this._verticesDiameter = applyPrecision((this._hexSize * 3) / 2);
		this._edgesDiameter = applyPrecision(this._hexSize * Math.sqrt(3));
		this._tileHeight =
			this._hcs.angle === HexagonalAngle.pointy ? this._edgesDiameter : this._verticesDiameter;
		this._tileWidth =
			this._hcs.angle === HexagonalAngle.pointy ? this._verticesDiameter : this._edgesDiameter;
		this._boardWidth =
			this._hcs.angle === HexagonalAngle.pointy
				? xMax * this._tileWidth + this._tileWidth / 2
				: xMax * (this._tileWidth * 0.75) + this._tileWidth * 0.25;
		this._boardHeight =
			this._hcs.angle === HexagonalAngle.pointy
				? yMax * (this._tileHeight * 0.75) + this._tileHeight * 0.25
				: yMax * this._tileHeight + this._tileHeight / 2;
		this.buildTiles();
	}

	get hcs(): HexagonalCoordinateSystem {
		return this._hcs;
	}

	get board(): Tile[][] {
		return this._board;
	}

	get boardHeight(): number {
		return this._boardHeight;
	}

	get boardWidth(): number {
		return this._boardWidth;
	}

	get edgesDiameter(): number {
		return this._edgesDiameter;
	}

	get hexSize(): number {
		return this._hexSize;
	}

	get tileHeight(): number {
		return this._tileHeight;
	}

	get tileWidth(): number {
		return this._tileWidth;
	}

	get verticesDiameter(): number {
		return this._verticesDiameter;
	}

	get xMax(): number {
		return this._xMax;
	}

	get yMax(): number {
		return this._yMax;
	}

	private buildTiles() {
		let board = [];

		for (let y = 0; y < this._yMax; y++) {
			let tiles = [];
			for (let x = 0; x < this._xMax; x++) {
				let tile: Tile = new Tile(x, y, this._tileWidth, this._tileHeight, this._hcs);
				tiles.push(tile);
			}
			board.push(tiles);
		}

		this._board = board;
	}
}

// Utils:

const mathPrecision = 5;
const calculatedPrecision = Math.pow(10, mathPrecision);

function applyPrecision(number: number): number {
	return Math.round((number + Number.EPSILON) * calculatedPrecision) / calculatedPrecision;
}

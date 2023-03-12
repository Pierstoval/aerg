import { xCoordInPixels, yCoordInPixels } from './mathFunctions';
import HexagonalCoordinateSystem, { HexagonalAngle } from './HexagonalCoordinateSystem';

export default class HexagonalObject {
	protected readonly _x: number;
	protected readonly _y: number;
	protected readonly _width: number;
	protected readonly _height: number;
	private readonly _hcs: HexagonalCoordinateSystem;

	constructor(
		x: number,
		y: number,
		w: number,
		h: number,
		hcs?: HexagonalCoordinateSystem | undefined
	) {
		this._x = x;
		this._y = y;
		this._width = w;
		this._height = h;
		this._hcs = hcs || HexagonalCoordinateSystem.default();
	}

	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
	}

	get width(): number {
		return this._width;
	}

	get height(): number {
		return this._height;
	}

	get hcs(): HexagonalCoordinateSystem {
		return this._hcs;
	}

	public topCoord(): number {
		return yCoordInPixels(this._x, this._y, this._height, this._hcs.angle);
	}

	public leftCoord(): number {
		return xCoordInPixels(this._x, this._y, this._width, this._hcs.angle);
	}
}

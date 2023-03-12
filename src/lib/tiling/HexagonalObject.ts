import { xCoordInPixels, yCoordInPixels } from './mathFunctions';
import HexagonalGridConfiguration, { HexagonalAngle } from './HexagonalGridConfiguration';

export default class HexagonalObject {
	protected readonly _x: number;
	protected readonly _y: number;
	protected readonly _width: number;
	protected readonly _height: number;
	private readonly _hexGridConfig: HexagonalGridConfiguration;

	constructor(
		x: number,
		y: number,
		w: number,
		h: number,
		hexGridConfig?: HexagonalGridConfiguration | undefined
	) {
		this._x = x;
		this._y = y;
		this._width = w;
		this._height = h;
		this._hexGridConfig = hexGridConfig || HexagonalGridConfiguration.default();
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

	get hexGridConfig(): HexagonalGridConfiguration {
		return this._hexGridConfig;
	}

	public topCoord(): number {
		return yCoordInPixels(this._x, this._y, this._height, this._hexGridConfig.angle);
	}

	public leftCoord(): number {
		return xCoordInPixels(this._x, this._y, this._width, this._hexGridConfig.angle);
	}
}

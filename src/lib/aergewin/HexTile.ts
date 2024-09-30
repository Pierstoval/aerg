import {
	createHexDimensions,
	createHexOrigin,
	defaultHexSettings,
	Hex,
	Orientation,
	type BoundingBox,
	type Ellipse,
	type HexConstructor,
	type HexCoordinates,
	type HexOffset,
	type HexOptions,
	type Point
} from 'honeycomb-grid';

export abstract class HexTile extends Hex {
	protected static _baseOptions: Partial<HexOptions> = {};

	protected _dimensions: number | Ellipse | BoundingBox;
	protected _orientation: Orientation;
	protected _origin: Point | 'topLeft';
	protected _offset: HexOffset;
	public cost: number = Infinity;

	constructor(
		coordinates: HexCoordinates,
		dimensions: number | Ellipse | BoundingBox,
		orientation: Orientation,
		origin: Point | 'topLeft',
		offset: HexOffset
	) {
		super(coordinates);
		this._dimensions = dimensions || HexTile._baseOptions.dimensions || 30;
		this._orientation = orientation || HexTile._baseOptions.orientation || Orientation.FLAT;
		this._origin = origin || HexTile._baseOptions.origin || 'topLeft';
		this._offset = offset || HexTile._baseOptions.offset || 1;
	}

	static set baseOptions(options: Partial<HexOptions>) {
		HexTile._baseOptions = options;
	}

	static get baseOptions(): Partial<HexOptions> {
		return HexTile._baseOptions;
	}

	get isPassable(): boolean {
		return this.cost < Infinity;
	}

	get dimensions(): Ellipse {
		const dimensions = this._dimensions || HexTile.baseOptions.dimensions;
		const orientation = this._orientation || HexTile.baseOptions.orientation;
		return createHexDimensions(dimensions as BoundingBox, orientation);
	}

	get orientation(): Orientation {
		return this._orientation || HexTile.baseOptions.orientation;
	}

	get origin(): Point {
		return createHexOrigin(
			(this._origin || HexTile.baseOptions.origin) as 'topLeft',
			this || HexTile.baseOptions.dimensions
		);
	}

	get offset(): HexOffset {
		return (
			typeof this._offset !== 'undefined' ? this._offset : HexTile.baseOptions.offset
		) as HexOffset;
	}
}

export const defaultHexTileSettings = { ...defaultHexSettings, dimensions: 30 };

export function defineHexTile(hexOptions?: Partial<HexOptions>): HexConstructor<HexTile> {
	const baseOptions = { ...defaultHexSettings, ...hexOptions };
	const {
		dimensions, //
		orientation, //
		origin, //
		offset //
	} = baseOptions;

	HexTile.baseOptions = baseOptions;

	return class extends HexTile {
		constructor(coordinates: HexCoordinates = [0, 0]) {
			super(coordinates, dimensions, orientation, origin, offset);
		}
	};
}

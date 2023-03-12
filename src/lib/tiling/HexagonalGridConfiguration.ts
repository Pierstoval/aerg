// Using "pointy top" style, the "hex size" or "hex diameter" is the height.
// Using "flat" hex style, the "hex size" or "hex diameter" is the actual width.
// Check https://www.redblobgames.com/grids/hexagons/#basics
export enum HexagonalAngle {
	pointy = 'pointy',
	flat = 'flat'
}

// Check out https://www.redblobgames.com/grids/hexagons/#coordinates;
export enum HexagonalCoordinateSystem {
	// Pointy style
	oddRow = 'oddRow',
	evenRow = 'evenRow',

	// Flat style
	oddColumns = 'oddColumns',
	evenColumns = 'evenColumns',

	axial = 'axial',
	cube = 'cube',
	doubled = 'doubled'
}

export default class HexagonalGridConfiguration {
	private readonly _angle: HexagonalAngle;
	private readonly _positioning: HexagonalCoordinateSystem;

	constructor(angle: HexagonalAngle, positioning: HexagonalCoordinateSystem) {
		HexagonalGridConfiguration.validateAngleAndPositioning(angle, positioning);
		this._angle = angle;
		this._positioning = positioning;
	}

	get angle(): HexagonalAngle {
		return this._angle;
	}

	get positioning(): HexagonalCoordinateSystem {
		return this._positioning;
	}

	public static default(): HexagonalGridConfiguration {
		return new HexagonalGridConfiguration(HexagonalAngle.pointy, HexagonalCoordinateSystem.oddRow);
	}

	private static validateAngleAndPositioning(
		angle: HexagonalAngle,
		positioning: HexagonalCoordinateSystem
	): void {
		if (
			angle === HexagonalAngle.pointy &&
			(positioning === HexagonalCoordinateSystem.oddRow ||
				positioning === HexagonalCoordinateSystem.oddColumns)
		) {
			// Ok
			return;
		}
	}
}

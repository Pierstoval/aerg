// Using "pointy top" style, the "hex size" or "hex diameter" is the height.
// Using "flat" hex style, the "hex size" or "hex diameter" is the actual width.
// Check https://www.redblobgames.com/grids/hexagons/#basics
export enum HexagonalAngle {
  pointy = "pointy",
  flat = "flat",
}

// Check out https://www.redblobgames.com/grids/hexagons/#coordinates;
export enum HexagonalCoordinatePositioning {
  // Pointy style
  oddRow = "oddRow",
  evenRow = "evenRow",

  // Flat style
  oddColumns = "oddColumns",
  evenColumns = "evenColumns",

  axial = "axial",
  cube = "cube",
  doubled = "doubled",
}

export default class HexagonalCoordinateSystem {
  private readonly _angle: HexagonalAngle;
  private readonly _positioning: HexagonalCoordinatePositioning;

  constructor(angle: HexagonalAngle, positioning: HexagonalCoordinatePositioning) {
    this._angle = angle;
    this._positioning = positioning;
  }

  get angle(): HexagonalAngle {
    return this._angle;
  }

  get positioning(): HexagonalCoordinatePositioning {
    return this._positioning;
  }

  public static default(): HexagonalCoordinateSystem {
    return new HexagonalCoordinateSystem(
      HexagonalAngle.pointy,
      HexagonalCoordinatePositioning.oddRow
    );
  }
}

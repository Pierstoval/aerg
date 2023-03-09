// Check out https://www.redblobgames.com/grids/hexagons/#coordinates;

// TODO: add axial/cube and doubled.

import HexStyle, { defaultHexStyle } from "./HexStyle";

enum HexCoordinateStyle {
  // Pointy style
  oddRow = "oddRow",
  evenRow = "evenRow",

  // Flat style
  oddColumns = "oddColumns",
  evenColumns = "evenColumns",
}

export default HexCoordinateStyle;

export function defaultHexCoordinateStyle(style?: HexStyle | undefined): HexCoordinateStyle {
  if (!style) {
    style = defaultHexStyle();
  }
  return style === HexStyle.pointy ? HexCoordinateStyle.oddRow : HexCoordinateStyle.evenRow;
}

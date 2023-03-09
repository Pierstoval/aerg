// Check https://www.redblobgames.com/grids/hexagons/#basics

// Using "pointy top" style, the "hex size" or "hex diameter" is the height.
// Using "flat" hex style, the "hex size" or "hex diameter" is the actual width.
enum HexStyle {
    pointy = 'pointy',
    flat = 'flat',
}

export default HexStyle;

export function defaultHexStyle(): HexStyle
{
    return HexStyle.pointy;
}

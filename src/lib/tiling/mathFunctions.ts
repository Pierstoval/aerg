import HexStyle, {defaultHexStyle} from "./HexStyle";

export function yCoordInPixels(x: number, y: number, hexHeight: number, style: HexStyle|undefined): number
{
    if (!style) {
        style = defaultHexStyle();
    }

    return style === HexStyle.pointy
        ? y * (hexHeight * 3/4)
        : y * hexHeight + (x % 2) * hexHeight / 2
    ;
}

export function xCoordInPixels(x: number, y: number, hexWidth: number, style: HexStyle|undefined): number
{
    if (!style) {
        style = defaultHexStyle();
    }

    return style === HexStyle.pointy
        ? x * hexWidth + (y % 2) * hexWidth / 2
        : x * (hexWidth * 3/4)
    ;
}

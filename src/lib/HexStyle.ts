export enum HexStyle {
    pointy = 'pointy',
    flat = 'flat',
}

export function defaultHexStyle(): HexStyle
{
    return HexStyle.pointy;
}

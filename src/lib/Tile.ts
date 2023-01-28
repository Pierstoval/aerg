import {HexStyle} from "./HexStyle";

export class Tile {
    private readonly _x: number;
    private readonly _y: number;
    private readonly _width: number;
    private readonly _height: number;
    private readonly _style: HexStyle;
    private readonly _content: string = '';

    get content() {
        return this._content;
    }

    public topCoord(): number {
        return this._style === HexStyle.pointy
            ? this._y * (this._height * 3/4)
            : this._y * this._height + (this._x % 2) * this._height / 2
        ;
    }

    public leftCoord(): number {
        return this._style === HexStyle.pointy
            ? this._x * this._width + (this._y % 2) * this._width / 2
            : this._x * (this._width * 3/4)
        ;
    }

    constructor(x: number, y: number, w: number, h: number, style: HexStyle) {
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this._style = style;
        this._content = `${x}:${y}`;
    }
}

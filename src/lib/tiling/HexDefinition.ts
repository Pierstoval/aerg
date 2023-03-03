import HexStyle, {defaultHexStyle} from "./HexStyle";
import {xCoordInPixels, yCoordInPixels} from "./mathFunctions";

export default class HexDefinition
{
    protected readonly _x: number;
    protected readonly _y: number;
    protected readonly _width: number;
    protected readonly _height: number;
    private readonly _style: HexStyle;

    constructor(x: number, y: number, w: number, h: number, style: HexStyle|undefined) {
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this._style = style || defaultHexStyle();
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

    get style(): HexStyle {
        return this._style;
    }

    public topCoord(): number {
        return yCoordInPixels(this._x, this._y, this._height, this._style);
    }

    public leftCoord(): number {
        return xCoordInPixels(this._x, this._y, this._width, this._style);
    }
}

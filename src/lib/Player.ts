import {xCoordInPixels, yCoordInPixels} from "./mathFunctions";
import {defaultHexStyle, HexStyle} from "./HexStyle";

export default class Player {
    static readonly DEFAULT_WIDTH_PIXELS = 10;
    static readonly DEFAULT_HEIGHT_PIXELS = 20;

    private readonly _x: number;
    private readonly _y: number;
    private readonly _width: number;
    private readonly _height: number;
    private readonly _style: HexStyle;

    constructor(x: number, y: number, w: number|undefined, h: number|undefined, style: HexStyle|undefined) {
        this._x = x;
        this._y = y;
        this._width = w || Player.DEFAULT_WIDTH_PIXELS;
        this._height = h || Player.DEFAULT_HEIGHT_PIXELS;
        this._style = style || defaultHexStyle();
    }

    public topCoord(): number {
        return yCoordInPixels(this._x, this._y, this._height, this._style);
    }

    public leftCoord(): number {
        return xCoordInPixels(this._x, this._y, this._width, this._style);
    }
}

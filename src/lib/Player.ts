import {xCoordInPixels, yCoordInPixels} from "./tiling/mathFunctions";
import type HexStyle from "./tiling/HexStyle";
import type Tileset from "./tiling/Tileset";

export enum PlayerEvent {
    MOVE = 'move',
}

export type PlayerEventCallback = (player: Player) => void;

export default class Player {
    private _x: number;
    private _y: number;
    private eventListeners: Map<PlayerEvent, PlayerEventCallback[]> = new Map();
    private readonly _width: number;
    private readonly _height: number;
    private readonly _style: HexStyle;
    private readonly _tileset: Tileset;

    constructor(
        x: number,
        y: number,
        tileset: Tileset,
        width: number|undefined,
        height: number|undefined,
    ) {
        this._x = x;
        this._y = y;
        this._tileset = tileset;
        this._width = width || tileset.tileWidth;
        this._height = height || tileset.tileHeight;
        this._style = tileset.style;
        this.initialize();
    }

    get topCoord(): number {
        return (this._height / 2) - (this._tileset.tileHeight / 2) + yCoordInPixels(this._x, this._y, this._tileset.tileHeight, this._style);
    }

    get leftCoord(): number {
        return (this._width / 2) - (this._tileset.tileWidth / 2) + xCoordInPixels(this._x, this._y, this._tileset.tileWidth, this._style);
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    public on(event: PlayerEvent, callback: any): void {
        let events = this.eventListeners.get(event) || [];
        events.push(callback);
        this.eventListeners.set(event, events);
    }

    public moveUp(): void {
        this._y -= 1;
        this.dispatch(PlayerEvent.MOVE);
    }

    public moveDown(): void {
        this._y += 1;
        this.dispatch(PlayerEvent.MOVE);
    }

    public moveLeft(): void {
        this._x -= 1;
        this.dispatch(PlayerEvent.MOVE);
    }

    public moveRight(): void {
        this._x += 1;
        this.dispatch(PlayerEvent.MOVE);
    }

    private initialize(): void {
        const p = this;
        this.on(PlayerEvent.MOVE, () => {
            if (p._x < 0) {
                p._x = 0;
            }
            if (p._y < 0) {
                p._y = 0;
            }

            // Doing "-1" here because index starts at 0
            if (p._x > (p._tileset.xMax - 1)) {
                p._x = p._tileset.xMax - 1;
            }
            if (p._y > (p._tileset.yMax - 1)) {
                p._y = p._tileset.yMax - 1;
            }
        });
    }

    private dispatch(event: PlayerEvent): void {
        let events = this.eventListeners.get(event) || [];

        events.forEach((callback: PlayerEventCallback) => callback(this));
    }
}

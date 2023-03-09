import {xCoordInPixels, yCoordInPixels} from "$lib/tiling/mathFunctions";
import HexStyle from "$lib/tiling/HexStyle";
import type HexCoordinateStyle from "$lib/tiling/HexCoordinateStyle";
import type Tileset from "$lib/tiling/Tileset";

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
    private readonly _coordinateStyle: HexCoordinateStyle;
    private readonly _tileset: Tileset;

    constructor(
        x: number,
        y: number,
        tileset: Tileset,
        width?: number|undefined,
        height?: number|undefined,
    ) {
        this._x = x;
        this._y = y;
        this._tileset = tileset;
        this._width = width || tileset.tileWidth;
        this._height = height || tileset.tileHeight;
        this._style = tileset.style;
        this._coordinateStyle = tileset.coordinateStyle; // TODO: implement this elsewhere
        this.initialize();
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
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

    // TODO: fix ALL methods based on coordinate system
    public moveUp(): void {
        this._y -= 1;
        this.dispatch(PlayerEvent.MOVE);
    }

    // TODO: fix ALL methods based on coordinate system
    public moveDown(): void {
        this._y += 1;
        this.dispatch(PlayerEvent.MOVE);
    }

    // TODO: fix ALL methods based on coordinate system
    public moveLeft(): void {
        this._x -= 1;
        this.dispatch(PlayerEvent.MOVE);
    }

    // TODO: fix ALL methods based on coordinate system
    public moveRight(): void {
        this._x += 1;
        this.dispatch(PlayerEvent.MOVE);
    }

    // TODO: fix ALL methods based on coordinate system
    public moveUpLeft(): void {
        this._x -= 1;
        this._y -= 1;
        this.dispatch(PlayerEvent.MOVE);
    }

    // TODO: fix ALL methods based on coordinate system
    public moveDownLeft(): void {
        if (this._style === HexStyle.pointy) {
            this._x += this._x % 2 === 0 ? 0 : -1;
            this._y += 1;
        } else {
            this._x += 1;
            this._y += this._y % 2 === 0 ? 0 : -1;
        }
        this.dispatch(PlayerEvent.MOVE);
    }

    // TODO: fix ALL methods based on coordinate system
    public moveUpRight(): void {
        this._x += 1;
        this._y -= 1;
        this.dispatch(PlayerEvent.MOVE);
    }

    // TODO: fix ALL methods based on coordinate system
    public moveDownRight(): void {
        this._x += 1;
        this._y += 1;
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

import type { Direction, Hex } from 'honeycomb-grid';
import { fromCoordinates, Grid, move } from 'honeycomb-grid';

export default class Foe {
    private readonly _type: string;
    private _position: Hex;
    private _grid: Grid<Hex>;

    private _actionsSpent = 0;

    constructor(
        type: string,
        orderIndex: number,
        numberOfPlayers: number,
        position: Hex,
        grid: Grid<Hex>
    ) {
        this._type = type;
        this._grid = grid;
        this._position = position;
        this._grid.setHexes([position]);
    }

    get type(): string {
        return this._type;
    }

    public goToDirection(direction: Direction) {
        this._grid.traverse([fromCoordinates(this._position), move(direction)]).map((p: Hex) => {
            const distance = this._grid.distance(this._position, p);
            this._actionsSpent += distance;
            this._position = p;

            return p;
        });
    }

    get position(): Hex {
        return this._position;
    }
}

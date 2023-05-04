import type {Hex} from 'honeycomb-grid';
import type { Grid } from 'honeycomb-grid';

export default class TerrainTile {
	private readonly _type: string;
	private readonly _position: Hex;
	private _grid: Grid<Hex>;

	constructor(type: string, position: Hex, grid: Grid<Hex>) {
		this._type = type;
		this._grid = grid;
		this._position = position;
		this._grid.setHexes([position]);
	}

	get type(): string {
		return this._type;
	}

	get position(): Hex {
		return this._position;
	}

	get text() {
		switch (this.type) {
			case 'village':
				return '🏡';
			case 'mountain':
				return '🗻';
			case 'lake':
				return '🐟';
			case 'forest':
				return '🌲';
			case 'plains':
				return '🌻';
			default:
				throw new Error(`Unrecoverable error: Unknown terrain type "${this.type}".`);
		}
	}
}

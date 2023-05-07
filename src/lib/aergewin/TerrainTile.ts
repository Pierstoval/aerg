import type { Hex } from 'honeycomb-grid';
import type { Grid } from 'honeycomb-grid';
import ZoneActivation, { getTerrainActions } from './ZoneActivation';
import type { TerrainType } from './GameData';

export default class TerrainTile {
	private readonly _type: TerrainType;
	private readonly _position: Hex;
	private _grid: Grid<Hex>;

	constructor(type: TerrainType, position: Hex, grid: Grid<Hex>) {
		this._type = type;
		this._grid = grid;
		this._position = position;
		this._grid.setHexes([position]);
	}

	get type(): TerrainType {
		return this._type;
	}

	get position(): Hex {
		return this._position;
	}

	get possibleActions(): ZoneActivation[] {
		return getTerrainActions(this);
	}

	get image() {
		switch (this.type) {
			case 'village':
				return '/tiles/compass.png';
			case 'mountain':
				return '/tiles/montagnes.png';
			case 'lake':
				return '/tiles/etang.png';
			case 'forest':
				return '/tiles/foret.png';
			case 'plains':
				return '/tiles/plaines.png';
			default:
				throw new Error(`Unrecoverable error: Unknown terrain type "${this.type}".`);
		}
	}
}

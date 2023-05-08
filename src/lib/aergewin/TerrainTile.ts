import type { Hex } from 'honeycomb-grid';
import type { Grid } from 'honeycomb-grid';
import { type ZoneActivation, getTerrainActions } from './ZoneActivation';
import type { TerrainType } from './GameData';
import { Assets } from './GameData';

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
		const asset: string | undefined = Assets[`tile.${this.type}`];

		if (!asset) {
			throw new Error(`Inexistent asset for tile type "${this.type}".`);
		}

		return asset;
	}

	public isType(type: TerrainType) {
		return this.type === type;
	}
}

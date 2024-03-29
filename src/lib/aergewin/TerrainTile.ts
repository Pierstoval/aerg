import type { HexCoordinates } from 'honeycomb-grid';
import type { Grid } from 'honeycomb-grid';
import { type ZoneActivation, getTerrainActions } from './ZoneActivation';
import { type TerrainType, type ResourceName, Assets } from './GameData';
import type { HexTile } from '$lib/aergewin/HexTile';

export type Inventory = Map<ResourceName, number>;

export type TerrainConstructor = {
	type: TerrainType;
	position: HexCoordinates;
};

export default class TerrainTile {
	private readonly _type: TerrainType;
	private readonly _position: HexTile;
	private _inventory: Inventory = new Map();
	private _grid: Grid<HexTile>;
	private _riskValue = 0;

	constructor(type: TerrainType, position: HexTile, grid: Grid<HexTile>) {
		this._type = type;
		this._grid = grid;
		this._position = position;
		this._grid.setHexes([position]);
	}

	get type(): TerrainType {
		return this._type;
	}

	get position(): HexTile {
		return this._position;
	}

	get inventory(): Inventory {
		return this._inventory;
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

	modifyRiskBy(amount: number) {
		this._riskValue += amount;
	}

	addResource(resource: ResourceName, amountToAdd: number) {
		const currentAmount = this._inventory.get(resource) || 0;
		this._inventory.set(resource, currentAmount + amountToAdd);
	}

	isType(type: TerrainType) {
		return this.type === type;
	}
}

import type { Hex } from 'honeycomb-grid';
import type { Grid } from 'honeycomb-grid';
import { type ZoneActivation, getTerrainActions } from './ZoneActivation';
import { type TerrainType, type ResourceName, Assets } from './GameData';

export type TerrainInventory = Map<ResourceName, number>;

export default class TerrainTile {
	private readonly _type: TerrainType;
	private readonly _position: Hex;
	private _inventory: TerrainInventory = new Map();
	private _grid: Grid<Hex>;
	private _riskValue = 0;

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

	get inventory(): TerrainInventory {
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

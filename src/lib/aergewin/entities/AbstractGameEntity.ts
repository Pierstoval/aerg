import type { Grid, Hex } from 'honeycomb-grid';
import type { ResourceName } from '../GameData';

export default abstract class AbstractGameEntity {
	protected _position: Hex;
	protected _grid: Grid<Hex>;
	protected _inventory: Map<ResourceName, number> = new Map();
	protected _hp: number;

	protected constructor(position: Hex, grid: Grid<Hex>) {
		this._grid = grid;
		this._position = position;
		this._grid.setHexes([position]);
		this._hp = this.maxHp();
	}

	public abstract maxHp(): number;

	get hp(): number {
		return this._hp;
	}

	get position(): Hex {
		return this._position;
	}

	get inventory(): Map<ResourceName, number> {
		return this._inventory;
	}

	hasResource(resource: ResourceName, amount: number = 1) {
		let currentAmount = this._inventory.get(resource) || 0;

		return currentAmount >= amount;
	}

	protected addItemToInventory(resource: ResourceName, amount: number = 1) {
		let currentAmount = this._inventory.get(resource) || 0;

		this._inventory.set(resource, currentAmount + amount);
	}
}

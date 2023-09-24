import type { Grid, Hex } from 'honeycomb-grid';
import type { OperatorType, ResourceName } from '../GameData';
import type AergewinGameEngine from '$lib/aergewin/AergewinGameEngine';
import type { TerrainTypeCondition } from '../GameData';

export default abstract class AbstractGameEntity {
	protected _position: Hex;
	protected readonly _engine: AergewinGameEngine;
	protected _grid: Grid<Hex>;
	protected _inventory: Map<ResourceName, number> = new Map();
	protected _hp: number;

	protected constructor(position: Hex, engine: AergewinGameEngine) {
		this._engine = engine;
		this._grid = engine.grid;
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

	isAtTerrain(terrain: TerrainTypeCondition): boolean {
		if (terrain === 'any') {
			return true;
		}

		const currentPosition = this._position.toString();

		const tiles = this._engine.terrain.filter((t) => t.type === terrain);

		for (const tile of tiles) {
			if (tile.position.toString() === currentPosition) {
				return true;
			}
		}

		console.info('No matching terrain for game entity and condition.', this, terrain);

		return false;
	}

	alterHp(operator: OperatorType, amount: number) {
		let value = this.hp;

		switch (operator) {
			case 'add':
				value = this.hp + amount;
				break;
			case 'substract':
				value = this.hp - amount;
				break;
			case 'multiply':
				break;
			case 'divide_floor':
				break;
			case 'divide_ceil':
				break;
		}
	}

	protected addItemToInventory(resource: ResourceName, amount: number = 1) {
		const currentAmount = this._inventory.get(resource) || 0;

		this._inventory.set(resource, currentAmount + amount);
	}
}

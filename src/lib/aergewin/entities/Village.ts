import AbstractGameEntity from './AbstractGameEntity';
import type { Grid, Hex } from 'honeycomb-grid';
import type TerrainTile from '../TerrainTile';

export default class Village extends AbstractGameEntity {
	private terrain: TerrainTile;

	constructor(terrain: TerrainTile, position: Hex, grid: Grid<Hex>) {
		super(position, grid);
		this.terrain = terrain;
	}

	get inventory() {
		return this.terrain.inventory;
	}

	public maxHp(): number {
		return 10;
	}
}

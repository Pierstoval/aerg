import AbstractGameEntity from './AbstractGameEntity';
import type { Grid, Hex } from 'honeycomb-grid';
import type TerrainTile from '../TerrainTile';
import type AergewinGameEngine from '$lib/aergewin/AergewinGameEngine';

export default class Village extends AbstractGameEntity {
	private terrain: TerrainTile;

	constructor(terrain: TerrainTile, position: Hex, engine: AergewinGameEngine) {
		super(position, engine);
		this.terrain = terrain;
	}

	get inventory() {
		return this.terrain.inventory;
	}

	public maxHp(): number {
		return 10;
	}
}

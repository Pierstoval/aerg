import AbstractGameEntity from './AbstractGameEntity';
import type TerrainTile from '../TerrainTile';
import type AergewinGameEngine from '$lib/aergewin/AergewinGameEngine';
import type { HexTile } from '$lib/aergewin/HexTile';

export default class Village extends AbstractGameEntity {
	private terrain: TerrainTile;

	constructor(terrain: TerrainTile, position: HexTile, engine: AergewinGameEngine) {
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

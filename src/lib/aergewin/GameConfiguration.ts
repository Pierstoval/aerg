import type { PlayerConstructor } from '$lib/aergewin/entities/Player';
import { Orientation } from 'honeycomb-grid';
import type { TerrainConstructor } from '$lib/aergewin/TerrainTile';

export type GameConfiguration = {
	max_actions_count_per_turn: number;
	hexSize: number;
	hexOrientation: Orientation;
	players?: Array<PlayerConstructor>;
	visibleTerrain?: Array<TerrainConstructor>;
};

export function defaultTerrain(): Array<TerrainConstructor> {
	return [
		{ type: 'village', position: [0, 0] },
		{ type: 'mountain', position: [1, 0] },
		{ type: 'forest', position: [0, -1] },
		{ type: 'plains', position: [-1, 1] }
	];
}

export function defaultGameConfiguration(): GameConfiguration {
	return {
		max_actions_count_per_turn: 7,
		hexSize: 70,
		hexOrientation: Orientation.FLAT
	};
}

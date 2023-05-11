import type TerrainTile from './TerrainTile';
import type { ZoneActionName, ResourceName } from './GameData';

export type ResourceCost = [ResourceName, number];

export function getTerrainActions(terrain: TerrainTile): ZoneActivation[] {
	switch (terrain.type) {
		case 'village':
			return [
				new ZoneActivation('repair_village', 2, [['wood', 1]]),
				new ZoneActivation('build_barricade', 2, [['wood', 3]], 1),
				new ZoneActivation('heal_self', 2)
			];

		case 'mountain':
			return [];

		case 'lake':
			return [new ZoneActivation('gather_food', 1)];

		case 'forest':
			return [new ZoneActivation('gather_food', 1), new ZoneActivation('gather_wood', 1)];

		case 'plains':
			return [];

		case 'mine':
			return [new ZoneActivation('gather_minerals', 2)];

		case 'sanctuary':
			return [new ZoneActivation('heal_self', 2)];

		default:
			throw new Error(`Unrecoverable error: Unknown terrain type "${terrain.type}".`);
	}
}

export class ZoneActivation {
	public readonly name: ZoneActionName;
	public readonly cost: number;
	public readonly experienceGain: number;
	public readonly resourceCost: ResourceCost[];

	constructor(
		name: ZoneActionName,
		actionCost: number,
		resourceCost: ResourceCost[] = [],
		experienceGain: number = 0
	) {
		this.name = name;
		this.cost = actionCost;
		this.resourceCost = resourceCost;
		this.experienceGain = experienceGain;
	}
}

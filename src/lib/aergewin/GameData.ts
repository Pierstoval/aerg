export type ResourceName = 'wood' | 'food' | 'minerals';

export type TerrainType = 'village' | 'mountain' | 'lake' | 'forest' | 'plains';

export type ActionName =
	| 'repair_village'
	| 'build_barricade'
	| 'heal_self'
	| 'gather_food'
	| 'gather_wood'
	| 'gather_minerals';

export const TerrainsDecks: TerrainType[] = [
	['mountain', 2],
	['lake', 2],
	['forest', 2],
	['plains', 3]
].reduce((finalArray: TerrainType[], [terrainType, quantity]) => {
	for (let i = 0; i < quantity; i++) {
		finalArray.push(terrainType as TerrainType);
	}
	return finalArray;
}, []);

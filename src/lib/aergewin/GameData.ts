export type ResourceName = 'wood' | 'food' | 'minerals';

export type TerrainType =
	| 'village'
	| 'mountain'
	| 'lake'
	| 'forest'
	| 'plains'
	| 'sanctuary'
	| 'mine';

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
	['plains', 3],
	['sanctuary', 2],
	['mine', 2]
].reduce((finalArray: TerrainType[], [terrainType, quantity]) => {
	for (let i = 0; i < quantity; i++) {
		finalArray.push(terrainType as TerrainType);
	}
	return finalArray;
}, []);

export const Assets = {
	'tile.village': '/tiles/compass.png',
	'tile.mountain': '/tiles/montagnes.png',
	'tile.lake': '/tiles/etang.png',
	'tile.forest': '/tiles/foret.png',
	'tile.plains': '/tiles/plaines.png',
	'tile.sanctuary': '/tiles/sanctuaire.png',
	'tile.mine': '/tiles/mine.png'
};

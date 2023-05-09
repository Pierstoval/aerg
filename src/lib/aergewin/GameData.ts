import type Player from './Player';
import type { ZoneActivation } from './ZoneActivation';

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

type ActionCondition = ['movement', TerrainType] | 'new_turn';

type Operator = 'add' | 'remove' | 'multiply' | 'divide_floor' | 'divide_ceil';

type EventCondition = ActionCondition;
type EventAlteration = {
	alterActionCost?: [Operator, number];
};

type DailyEvent = [
	string,
	'malus' | 'bonus',
	'persistant' | 'ponctuel',
	Array<EventCondition>,
	EventAlteration
];

export const DailyEvents: DailyEvent[] = [
	['Blizzard', 'malus', 'persistant', [['movement', 'mountain']], { alterActionCost: ['add', 1] }],

	['Brume', 'malus', 'persistant', [['movement', 'forest']], { alterActionCost: ['add', 1] }],

	['Crue', 'malus', 'persistant', [['movement', 'lake']], { alterActionCost: ['add', 1] }],

	['Famine', 'malus', 'persistant', ['new_turn'], {}],

	[
		'Glissement de terrain',
		'malus',
		'persistant',
		[['movement', 'plains']],
		{ alterActionCost: ['add', 1] }
	],

	['Mauvaises récoltes', 'malus', 'persistant', [], {}],

	['Surchauffe de métal', 'malus', 'persistant', [], {}],

	['Pandémie', 'malus', 'persistant', [], {}],

	['Blessure', 'malus', 'ponctuel', [], {}],

	['Chute de pierres', 'malus', 'ponctuel', [], {}],

	['Incendie', 'malus', 'ponctuel', [], {}],

	['Invasion', 'malus', 'ponctuel', [], {}],

	['Malédiction', 'malus', 'ponctuel', [], {}],

	['Mouvement du chaos', 'malus', 'ponctuel', [], {}],

	['Serpents', 'malus', 'ponctuel', [], {}],

	['Spectres', 'malus', 'ponctuel', [], {}],

	['Termites', 'malus', 'ponctuel', [], {}],

	['Vermine', 'malus', 'ponctuel', [], {}],

	['Beau temps', 'bonus', 'persistant', [], {}],

	['Bon filon', 'bonus', 'persistant', [], {}],

	['Chants guerriers', 'bonus', 'persistant', [], {}],

	['Haches neuves', 'bonus', 'persistant', [], {}],

	['Jour des esprits', 'bonus', 'persistant', [], {}],

	['Moisson', 'bonus', 'persistant', [], {}],

	['Outillage parfait', 'bonus', 'persistant', [], {}],

	['Bénédiction', 'bonus', 'persistant', [], {}],

	['Nature vengeresse', 'bonus', 'ponctuel', [], {}],

	['Formation martiale', 'bonus', 'ponctuel', [], {}],

	['Menuisier performant', 'bonus', 'ponctuel', [], {}],

	['Motivation', 'bonus', 'ponctuel', [], {}],

	['Abondance', 'bonus', 'ponctuel', [], {}],

	['Scierie', 'bonus', 'ponctuel', [], {}],

	['Recyclage', 'bonus', 'ponctuel', [], {}],

	['Médecins de guerre', 'bonus', 'ponctuel', [], {}],

	['Mine cachée', 'bonus', 'ponctuel', [], {}],

	['Voyance', 'bonus', 'ponctuel', [], {}]
];

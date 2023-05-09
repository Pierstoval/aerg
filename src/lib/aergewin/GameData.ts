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

type ActionCondition = ['movement' | 'gather_food', TerrainType] | 'new_turn';

type Operator = 'add' | 'substract' | 'multiply' | 'divide_floor' | 'divide_ceil';

type AlterationTarget = 'village' | 'current_player' | 'all_players';

type EventCondition = ActionCondition;
type EventAlteration = {
	alterActionCost?: [Operator, number];
	alterResourceQuantity?: [AlterationTarget, Operator, number, ResourceName];
};

type DailyEvent = [
	string,
	'malus' | 'bonus',
	'persistent' | 'one-off',
	Array<EventCondition>,
	EventAlteration
];

export const DailyEvents: DailyEvent[] = [
	['Blizzard', 'malus', 'persistent', [['movement', 'mountain']], { alterActionCost: ['add', 1] }],

	['Brume', 'malus', 'persistent', [['movement', 'forest']], { alterActionCost: ['add', 1] }],

	['Crue', 'malus', 'persistent', [['movement', 'lake']], { alterActionCost: ['add', 1] }],

	[
		'Famine',
		'malus',
		'persistent',
		['new_turn'],
		{ alterResourceQuantity: ['village', 'substract', 1, 'food'] }
	],

	[
		'Glissement de terrain',
		'malus',
		'persistent',
		[['movement', 'plains']],
		{ alterActionCost: ['add', 1] }
	],

	[
		'Mauvaises récoltes',
		'malus',
		'persistent',
		[['gather_food', 'lake']],
		{ alterActionCost: ['add', 1] }
	],

	// ['Surchauffe de métal', 'malus', 'persistent', [], {}],

	[
		'Pandémie',
		'malus',
		'persistent',
		['new_turn'],
		{ alterResourceQuantity: ['all_players', 'substract', 1, 'food'] }
	],

	// ['Blessure', 'malus', 'one-off', [], {}],

	['Chute de pierres', 'malus', 'one-off', [], {}],

	['Incendie', 'malus', 'one-off', [], {}],

	['Invasion', 'malus', 'one-off', [], {}],

	['Malédiction', 'malus', 'one-off', [], {}],

	['Mouvement du chaos', 'malus', 'one-off', [], {}],

	['Serpents', 'malus', 'one-off', [], {}],

	['Spectres', 'malus', 'one-off', [], {}],

	['Termites', 'malus', 'one-off', [], {}],

	['Vermine', 'malus', 'one-off', [], {}],

	['Beau temps', 'bonus', 'persistent', [], {}],

	['Bon filon', 'bonus', 'persistent', [], {}],

	['Chants guerriers', 'bonus', 'persistent', [], {}],

	['Haches neuves', 'bonus', 'persistent', [], {}],

	['Jour des esprits', 'bonus', 'persistent', [], {}],

	['Moisson', 'bonus', 'persistent', [], {}],

	['Outillage parfait', 'bonus', 'persistent', [], {}],

	['Bénédiction', 'bonus', 'persistent', [], {}],

	['Nature vengeresse', 'bonus', 'one-off', [], {}],

	['Formation martiale', 'bonus', 'one-off', [], {}],

	['Menuisier performant', 'bonus', 'one-off', [], {}],

	['Motivation', 'bonus', 'one-off', [], {}],

	['Abondance', 'bonus', 'one-off', [], {}],

	['Scierie', 'bonus', 'one-off', [], {}],

	['Recyclage', 'bonus', 'one-off', [], {}],

	['Médecins de guerre', 'bonus', 'one-off', [], {}],

	['Mine cachée', 'bonus', 'one-off', [], {}],

	['Voyance', 'bonus', 'one-off', [], {}]
];

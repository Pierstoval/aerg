export type ResourceName = 'wood' | 'food' | 'minerals';

export type TerrainType =
	| 'village'
	| 'mountain'
	| 'lake'
	| 'forest'
	| 'plains'
	| 'sanctuary'
	| 'mine';

export type ZoneActionName =
	| 'repair_village'
	| 'build_barricade'
	| 'heal_self'
	| 'gather_food'
	| 'gather_wood'
	| 'gather_minerals';

type TerrainDeckTypeDefinition = { type: TerrainType; quantity: number };

const TerrainDecksDefinition: Array<TerrainDeckTypeDefinition> = [
	{ type: 'mountain', quantity: 2 },
	{ type: 'lake', quantity: 2 },
	{ type: 'forest', quantity: 2 },
	{ type: 'plains', quantity: 3 },
	{ type: 'sanctuary', quantity: 2 },
	{ type: 'mine', quantity: 2 }
];

export const TerrainsDecks: Array<TerrainType> = TerrainDecksDefinition.reduce(
	(finalArray: TerrainType[], { type, quantity }) => {
		for (let i = 0; i < quantity; i++) {
			finalArray.push(type);
		}
		return finalArray;
	},
	[]
);

export const Assets = {
	'tile.village': '/tiles/compass.png',
	'tile.mountain': '/tiles/montagnes.png',
	'tile.lake': '/tiles/etang.png',
	'tile.forest': '/tiles/foret.png',
	'tile.plains': '/tiles/plaines.png',
	'tile.sanctuary': '/tiles/sanctuaire.png',
	'tile.mine': '/tiles/mine.png'
};

export type TerrainTypeCondition = TerrainType | 'any';

export type ActionCondition = [
	ZoneActionName | 'movement' | 'positioned_at',
	TerrainTypeCondition | Array<TerrainTypeCondition>
];

export type OperatorType = 'add' | 'substract' | 'multiply' | 'divide_floor' | 'divide_ceil';

export type AlterationTarget = 'village' | 'current_player' | 'all_players';

export type Reward = ResourceName;

export type TargetProperty = 'hp';

export type ResourceQuantityAlteration = [AlterationTarget, OperatorType, number, ResourceName];

export type EventCondition = ActionCondition;
export type EventAlteration = {
	alterActionCost?: { action: OperatorType; amount: number; cumulative: boolean };
	alterActionReward?: { action: OperatorType; amount: number; reward: Reward; cumulative: boolean };
	alterResourceQuantity?: ResourceQuantityAlteration;
	alterProperty?: [AlterationTarget, OperatorType, number, TargetProperty];
	replaceClosestTerrain?: { from: TerrainType; to: TerrainType };
};

export type DailyEvent = {
	name: string;
	description: string;
	type: 'malus' | 'bonus';
	duration: 'persistent' | 'one-off';
	conditions: Array<EventCondition>;
	alterations: EventAlteration | Array<EventAlteration>;
};

export const DailyEventsDeck: Array<DailyEvent> = [
	{
		name: 'Blizzard',
		description: 'Coûte une action de plus de se déplacer à travers une montagne',
		type: 'malus',
		duration: 'persistent',
		conditions: [['movement', 'mountain']],
		alterations: { alterActionCost: { action: 'add', amount: 1, cumulative: true } }
	},
	{
		name: 'Brume',
		description: 'Coûte une action de plus de se déplacer à travers une forêt',
		type: 'malus',
		duration: 'persistent',
		conditions: [['movement', 'forest']],
		alterations: { alterActionCost: { action: 'add', amount: 1, cumulative: true } }
	},
	{
		name: 'Crue',
		description: 'Coûte une action de plus de se déplacer à travers un lac',
		type: 'malus',
		duration: 'persistent',
		conditions: [['movement', 'lake']],
		alterations: { alterActionCost: { action: 'add', amount: 1, cumulative: true } }
	},
	{
		name: 'Famine',
		description: 'Le village consomme 1 nourriture de plus à chaque nouvelle journée',
		type: 'malus',
		duration: 'persistent',
		conditions: [],
		alterations: { alterResourceQuantity: ['village', 'substract', 1, 'food'] }
	},
	{
		name: 'Glissement de terrain',
		description: 'Coûte une action de plus de se déplacer à travers une plaine',
		type: 'malus',
		duration: 'persistent',
		conditions: [['movement', 'plains']],
		alterations: { alterActionCost: { action: 'add', amount: 1, cumulative: true } }
	},
	{
		name: 'Mauvaises récoltes',
		description: 'Chaque récolte de nourriture coûte 1 action de plus',
		type: 'malus',
		duration: 'persistent',
		conditions: [['gather_food', 'lake']],
		alterations: { alterActionCost: { action: 'add', amount: 1, cumulative: true } }
	},
	// {
	// 	name: 'Surchauffe de métal',
	// 	description: "La Forge est inutilisable",
	// 	type: 'malus',
	// 	duration: 'persistent',
	// 	conditions: [],
	// 	alterations: {}
	// },
	{
		name: 'Pandémie',
		description: "À l'aube, chaque joueur doit consommer 1 nourriture ou perdre 1 PV",
		type: 'malus',
		duration: 'persistent',
		conditions: [],
		alterations: { alterResourceQuantity: ['all_players', 'substract', 1, 'food'] }
	},
	// {
	// 	name: 'Blessure',
	// 	description: "Un soldat est retiré du jeu. S'il n'y a pas de soldat, le village 2 PV",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	conditions: [],
	// 	alterations: {}
	// },
	{
		name: 'Chute de pierres',
		description: 'Tous les personnages sur des cases Montagne subissent 2 points de dégâts',
		type: 'malus',
		duration: 'one-off',
		conditions: [['positioned_at', 'mountain']],
		alterations: { alterProperty: ['all_players', 'substract', 2, 'hp'] }
	},
	{
		name: 'Incendie',
		description:
			"La forêt la plus proche est incendiée. La tuile est retournée et est considérée comme une plaine jusqu'à la fin du jeu",
		type: 'malus',
		duration: 'one-off',
		conditions: [],
		alterations: { replaceClosestTerrain: { from: 'forest', to: 'plains' } }
	},
	// {
	// 	name: 'Invasion',
	// 	description: "2 monstres supplémentaires apparaissent",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	conditions: [],
	// 	alterations: {}
	// },
	// {
	// 	name: 'Malédiction',
	// 	description: "1 monstre apparait sur le cimetière",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	conditions: [],
	// 	alterations: {}
	// },
	// {
	// 	name: 'Mouvement du chaos',
	// 	description: "Chaque monstre se déplace vers le village",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	conditions: [],
	// 	alterations: {}
	// },
	// {
	// 	name: 'Serpents',
	// 	description: "Tous les joueurs ou soldats présents dans le village le quittent immédiatement vers une tuile adjacente",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	conditions: [],
	// 	alterations: {}
	// },
	// {
	// 	name: 'Spectres',
	// 	description: "Tous les joueurs à 2 cases ou moins du Cimetière perdent 1 action",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	conditions: [],
	// 	alterations: {}
	// },
	// {
	// 	name: 'Termites',
	// 	description: "Détruisez 2 barricades autour du village (aidez-vous de la tuile \"Directions\" pour déterminer lesquelles)",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	conditions: [],
	// 	alterations: {}
	// },
	{
		name: 'Vermine',
		description:
			'Le village perd immédiatement 2 unités de nourriture, et perd 1 PV pour chaque unité nourriture manquante.',
		type: 'malus',
		duration: 'one-off',
		conditions: [],
		alterations: { alterProperty: ['village', 'substract', 2, 'hp'] }
	},
	{
		name: 'Beau temps',
		description: 'Le premier déplacement de la journée coûte 1 action de moins',
		type: 'bonus',
		duration: 'persistent',
		conditions: [['movement', 'any']],
		alterations: { alterActionCost: { action: 'substract', amount: 1, cumulative: false } }
	},
	{
		name: 'Bon filon',
		description: '+1 unité de minerai à chaque récolte',
		type: 'bonus',
		duration: 'persistent',
		conditions: [['gather_minerals', 'mine']],
		alterations: {
			alterActionReward: { action: 'add', amount: 1, reward: 'minerals', cumulative: true }
		}
	},
	// {
	// 	name: 'Chants guerriers',
	// 	description: "Chaque personnage ou soldat qui combat ce jour-ci bénéficie d’un bonus de 1 à l’attaque",
	// 	type: 'bonus',
	// 	duration: 'persistent',
	// 	conditions: [],
	// 	alterations: {}
	// },
	{
		name: 'Haches neuves',
		description: '+1 unité de bois à chaque récolte',
		type: 'bonus',
		duration: 'persistent',
		conditions: [['gather_wood', 'forest']],
		alterations: {
			alterActionReward: { action: 'add', amount: 1, reward: 'wood', cumulative: true }
		}
	},
	// {
	// 	name: 'Jour des esprits',
	// 	description: "Pendant la Nuit, chaque personnage ou soldat à 1 cases ou moins du Sanctuaire regagne 2 PV",
	// 	type: 'bonus',
	// 	duration: 'persistent',
	// 	conditions: [],
	// 	alterations: {}
	// },
	{
		name: 'Moisson',
		description: '+1 unité de nourriture à chaque récolte',
		type: 'bonus',
		duration: 'persistent',
		conditions: [['gather_food', ['forest', 'lake']]],
		alterations: {
			alterActionReward: { action: 'add', amount: 1, reward: 'food', cumulative: true }
		}
	},
	// {
	// 	name: 'Outillage parfait',
	// 	description: "Forger ou améliorer une arme coûte 1 minerai de moins",
	// 	type: 'bonus',
	// 	duration: 'persistent',
	// 	conditions: [],
	// 	alterations: {}
	// },
	// {
	// 	name: 'Bénédiction',
	// 	description: "Pour 1 action supplémentaire, le sanctuaire permet de blesser 1 ennemi supplémentaire",
	// 	type: 'bonus',
	// 	duration: 'persistent',
	// 	conditions: [],
	// 	alterations: {}
	// },
	// {
	// 	name: 'Nature vengeresse',
	// 	description: "Tout monstre à 2 cases ou moins du sanctuaire subit 4 points de dégâts",
	// 	type: 'bonus',
	// 	duration: 'one-off',
	// 	conditions: [],
	// 	alterations: {}
	// },
	// {
	// 	name: 'Formation martiale',
	// 	description: "Ajoutez un soldat sur le village",
	// 	type: 'bonus',
	// 	duration: 'one-off',
	// 	conditions: [],
	// 	alterations: {}
	// },
	// {
	// 	name: 'Menuisier performant',
	// 	description: "Posez une nouvelle barricade sur l'un des côtés du village",
	// 	type: 'bonus',
	// 	duration: 'one-off',
	// 	conditions: [],
	// 	alterations: {}
	// },
	// {
	// 	name: 'Motivation',
	// 	description: "Tous les joueurs disposent d'une action supplémentaire aujourd'hui",
	// 	type: 'bonus',
	// 	duration: 'one-off',
	// 	conditions: [],
	// 	alterations: {}
	// },
	{
		name: 'Abondance',
		description: 'Le village gagne 1 unité de nourriture',
		type: 'bonus',
		duration: 'one-off',
		conditions: [],
		alterations: { alterResourceQuantity: ['village', 'add', 1, 'food'] }
	},
	{
		name: 'Scierie',
		description: 'Le village gagne 1 unité de bois',
		type: 'bonus',
		duration: 'one-off',
		conditions: [],
		alterations: { alterResourceQuantity: ['village', 'add', 1, 'wood'] }
	},
	{
		name: 'Recyclage',
		description: 'Le village gagne 1 minerai',
		type: 'bonus',
		duration: 'one-off',
		conditions: [],
		alterations: { alterResourceQuantity: ['village', 'add', 1, 'minerals'] }
	},
	{
		name: 'Médecins de guerre',
		description: 'Tous les alliés, personnages et soldats, regagnent 2 PV',
		type: 'bonus',
		duration: 'one-off',
		conditions: [],
		alterations: { alterProperty: ['all_players', 'add', 2, 'hp'] }
	},
	{
		name: 'Mine cachée',
		description: 'La tuile Montagne la plus proche devient une tuile Mine',
		type: 'bonus',
		duration: 'one-off',
		conditions: [],
		alterations: { replaceClosestTerrain: { from: 'mountain', to: 'mine' } }
	}
	// {
	// 	name: 'Voyance',
	// 	description: "Regardez la prochaine carte Monstre. Vous pouvez la défausser au prix de 2 minerais.",
	// 	type: 'bonus',
	// 	duration: 'one-off',
	// 	conditions: [],
	// 	alterations: {}
	// }
];

DailyEventsDeck.forEach((event) => {
	if (event.duration === 'one-off') {
		event.conditions.forEach((condition) => {
			const conditionType = condition[0];
			if (conditionType !== 'positioned_at') {
				throw new Error(`Condition type ${conditionType} is not supported for one-off events.`);
			}
		});
	}
});

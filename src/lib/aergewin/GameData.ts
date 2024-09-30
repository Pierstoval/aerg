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

export type TargetCondition = [
	ZoneActionName | 'movement' | 'positioned_at',
	TerrainTypeCondition | Array<TerrainTypeCondition>
];

export type OperatorType = 'add' | 'substract' | 'multiply' | 'divide_floor' | 'divide_ceil';

export type AlterationTarget =
	| 'village'
	| 'current_player'
	| 'player_matching_condition'
	| 'all_players'
	| 'enemy';

export type Reward = ResourceName;

export type TargetProperty = 'hp';

export type ResourceQuantityAlteration = [AlterationTarget, OperatorType, number, ResourceName];

export type AlterationCondition = {
	targetEntity?: AlterationTarget;
	targetCondition?: TargetCondition;
};

export type TargetPropertyAlteration = [OperatorType, number, TargetProperty];

export type EventAlteration = {
	alterActionCost?: { action: OperatorType; amount: number; cumulative: boolean };
	alterActionReward?: { action: OperatorType; amount: number; reward: Reward; cumulative: boolean };
	alterResourceQuantity?: ResourceQuantityAlteration;
	alterProperty?: TargetPropertyAlteration;
	replaceClosestTerrain?: { from: TerrainType; to: TerrainType };
	conditions?: AlterationCondition;
};

export type DailyEvent = {
	name: string;
	description: string;
	type: 'malus' | 'bonus';
	duration: 'persistent' | 'one-off';
	alterations: Array<EventAlteration>;
};

export const DailyEventsDeck: Array<DailyEvent> = [
	{
		name: 'Blizzard',
		description: 'Coûte une action de plus de se déplacer à travers une montagne',
		type: 'malus',
		duration: 'persistent',
		alterations: [
			{
				alterActionCost: { action: 'add', amount: 1, cumulative: true },
				conditions: { targetCondition: ['movement', 'mountain'] }
			}
		]
	},
	{
		name: 'Brume',
		description: 'Coûte une action de plus de se déplacer à travers une forêt',
		type: 'malus',
		duration: 'persistent',
		alterations: [
			{
				alterActionCost: { action: 'add', amount: 1, cumulative: true },
				conditions: { targetCondition: ['movement', 'forest'] }
			}
		]
	},
	{
		name: 'Crue',
		description: 'Coûte une action de plus de se déplacer à travers un lac',
		type: 'malus',
		duration: 'persistent',
		alterations: [
			{
				alterActionCost: { action: 'add', amount: 1, cumulative: true },
				conditions: { targetCondition: ['movement', 'lake'] }
			}
		]
	},
	{
		name: 'Famine',
		description: 'Le village consomme 1 nourriture de plus à chaque nouvelle journée',
		type: 'malus',
		duration: 'persistent',
		alterations: [{ alterResourceQuantity: ['village', 'substract', 1, 'food'] }]
	},
	{
		name: 'Glissement de terrain',
		description: 'Coûte une action de plus de se déplacer à travers une plaine',
		type: 'malus',
		duration: 'persistent',
		alterations: [
			{
				alterActionCost: { action: 'add', amount: 1, cumulative: true },
				conditions: { targetCondition: ['movement', 'plains'] }
			}
		]
	},
	{
		name: 'Mauvaises récoltes',
		description: 'Chaque récolte de nourriture coûte 1 action de plus',
		type: 'malus',
		duration: 'persistent',
		alterations: [
			{
				alterActionCost: { action: 'add', amount: 1, cumulative: true },
				conditions: { targetCondition: ['gather_food', 'any'] }
			}
		]
	},
	// {
	// 	name: 'Surchauffe de métal',
	// 	description: "La Forge est inutilisable",
	// 	type: 'malus',
	// 	duration: 'persistent',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	{
		name: 'Pandémie',
		description: "À l'aube, chaque joueur doit consommer 1 nourriture ou perdre 1 PV",
		type: 'malus',
		duration: 'persistent',
		alterations: [{ alterResourceQuantity: ['all_players', 'substract', 1, 'food'] }]
	},
	// {
	// 	name: 'Blessure',
	// 	description: "Un soldat est retiré du jeu. S'il n'y a pas de soldat, le village 2 PV",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	{
		name: 'Chute de pierres',
		description: 'Tous les personnages sur des cases Montagne subissent 2 points de dégâts',
		type: 'malus',
		duration: 'one-off',
		alterations: [
			{
				alterProperty: ['substract', 2, 'hp'],
				conditions: { targetCondition: ['positioned_at', 'mountain'] }
			}
		]
	},
	{
		name: 'Incendie',
		description:
			"La forêt la plus proche est incendiée. La tuile est retournée et est considérée comme une plaine jusqu'à la fin du jeu",
		type: 'malus',
		duration: 'one-off',
		alterations: [{ replaceClosestTerrain: { from: 'forest', to: 'plains' } }]
	},
	// {
	// 	name: 'Invasion',
	// 	description: "2 monstres supplémentaires apparaissent",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	// {
	// 	name: 'Malédiction',
	// 	description: "1 monstre apparait sur le cimetière",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	// {
	// 	name: 'Mouvement du chaos',
	// 	description: "Chaque monstre se déplace vers le village",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	// {
	// 	name: 'Serpents',
	// 	description: "Tous les joueurs ou soldats présents dans le village le quittent immédiatement vers une tuile adjacente",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	// {
	// 	name: 'Spectres',
	// 	description: "Tous les joueurs à 2 cases ou moins du Cimetière perdent 1 action",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	// {
	// 	name: 'Termites',
	// 	description: "Détruisez 2 barricades autour du village (aidez-vous de la tuile \"Directions\" pour déterminer lesquelles)",
	// 	type: 'malus',
	// 	duration: 'one-off',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	{
		name: 'Vermine',
		description:
			'Le village perd immédiatement 2 unités de nourriture, et perd 1 PV pour chaque unité nourriture manquante.',
		type: 'malus',
		duration: 'one-off',
		alterations: [
			{ alterProperty: ['substract', 2, 'hp'], conditions: { targetEntity: 'village' } }
		]
	},
	{
		name: 'Beau temps',
		description: 'Le premier déplacement de la journée coûte 1 action de moins',
		type: 'bonus',
		duration: 'persistent',
		alterations: [
			{
				alterActionCost: { action: 'substract', amount: 1, cumulative: false },
				conditions: { targetCondition: ['movement', 'any'] }
			}
		]
	},
	{
		name: 'Bon filon',
		description: '+1 unité de minerai à chaque récolte',
		type: 'bonus',
		duration: 'persistent',
		alterations: [
			{
				alterActionReward: { action: 'add', amount: 1, reward: 'minerals', cumulative: true },
				conditions: { targetCondition: ['gather_minerals', 'mine'] }
			}
		]
	},
	// {
	// 	name: 'Chants guerriers',
	// 	description: "Chaque personnage ou soldat qui combat ce jour-ci bénéficie d’un bonus de 1 à l’attaque",
	// 	type: 'bonus',
	// 	duration: 'persistent',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	{
		name: 'Haches neuves',
		description: '+1 unité de bois à chaque récolte',
		type: 'bonus',
		duration: 'persistent',
		alterations: [
			{
				alterActionReward: { action: 'add', amount: 1, reward: 'wood', cumulative: true },
				conditions: { targetCondition: ['gather_wood', 'forest'] }
			}
		]
	},
	// {
	// 	name: 'Jour des esprits',
	// 	description: "Pendant la Nuit, chaque personnage ou soldat à 1 cases ou moins du Sanctuaire regagne 2 PV",
	// 	type: 'bonus',
	// 	duration: 'persistent',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	{
		name: 'Moisson',
		description: '+1 unité de nourriture à chaque récolte',
		type: 'bonus',
		duration: 'persistent',
		alterations: [
			{
				alterActionReward: { action: 'add', amount: 1, reward: 'food', cumulative: true },
				conditions: { targetCondition: ['gather_food', ['any']] }
			}
		]
	},
	// {
	// 	name: 'Outillage parfait',
	// 	description: "Forger ou améliorer une arme coûte 1 minerai de moins",
	// 	type: 'bonus',
	// 	duration: 'persistent',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	// {
	// 	name: 'Bénédiction',
	// 	description: "Pour 1 action supplémentaire, le sanctuaire permet de blesser 1 ennemi supplémentaire",
	// 	type: 'bonus',
	// 	duration: 'persistent',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	// {
	// 	name: 'Nature vengeresse',
	// 	description: "Tout monstre à 2 cases ou moins du sanctuaire subit 4 points de dégâts",
	// 	type: 'bonus',
	// 	duration: 'one-off',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	// {
	// 	name: 'Formation martiale',
	// 	description: "Ajoutez un soldat sur le village",
	// 	type: 'bonus',
	// 	duration: 'one-off',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	// {
	// 	name: 'Menuisier performant',
	// 	description: "Posez une nouvelle barricade sur l'un des côtés du village",
	// 	type: 'bonus',
	// 	duration: 'one-off',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	// {
	// 	name: 'Motivation',
	// 	description: "Tous les joueurs disposent d'une action supplémentaire aujourd'hui",
	// 	type: 'bonus',
	// 	duration: 'one-off',
	// 	alterations: [
	// 	{ conditions: [] }
	// 	]
	// },
	{
		name: 'Abondance',
		description: 'Le village gagne 1 unité de nourriture',
		type: 'bonus',
		duration: 'one-off',
		alterations: [{ alterResourceQuantity: ['village', 'add', 1, 'food'] }]
	},
	{
		name: 'Scierie',
		description: 'Le village gagne 1 unité de bois',
		type: 'bonus',
		duration: 'one-off',
		alterations: [{ alterResourceQuantity: ['village', 'add', 1, 'wood'] }]
	},
	{
		name: 'Recyclage',
		description: 'Le village gagne 1 minerai',
		type: 'bonus',
		duration: 'one-off',
		alterations: [{ alterResourceQuantity: ['village', 'add', 1, 'minerals'] }]
	},
	{
		name: 'Médecins de guerre',
		description: 'Tous les alliés, personnages et soldats, regagnent 2 PV',
		type: 'bonus',
		duration: 'one-off',
		alterations: [{ alterProperty: ['add', 2, 'hp'], conditions: { targetEntity: 'all_players' } }]
	},
	{
		name: 'Mine cachée',
		description: 'La tuile Montagne la plus proche devient une tuile Mine',
		type: 'bonus',
		duration: 'one-off',
		alterations: [{ replaceClosestTerrain: { from: 'mountain', to: 'mine' } }]
	}
	// {
	// 	name: 'Voyance',
	// 	description: "Regardez la prochaine carte Monstre. Vous pouvez la défausser au prix de 2 minerais.",
	// 	type: 'bonus',
	// 	duration: 'one-off',
	// 	alterations: [
	// 	conditions: []
	// 	]
	// }
];

export function getEventIndexByName(name: string): number {
	for (let i = 0; i < DailyEventsDeck.length; i++) {
		const dailyEvent = DailyEventsDeck[i];
		if (dailyEvent.name === name) {
			return i;
		}
	}

	throw new Error(`Could not find event by name "${name}".`);
}

// Validate events types before running the game
DailyEventsDeck.forEach((event) => {
	if (event.duration !== 'one-off') {
		return;
	}

	let alterations = Array.isArray(event.alterations) ? event.alterations : [event.alterations];

	alterations.forEach((alteration) => {
		if (!alteration.conditions) {
			return;
		}

		let conditions = Array.isArray(alteration.conditions)
			? alteration.conditions
			: [alteration.conditions];

		conditions.forEach((condition) => {
			if (!condition.targetCondition && !condition.targetEntity) {
				throw new Error(
					'AlterationCondition object must at least have either an entity or a condition.'
				);
			}
			const target = condition.targetCondition;
			if (!target) {
				return;
			}
			let targetCondition = target[0];
			if (targetCondition !== 'positioned_at') {
				throw new Error(`Condition type ${targetCondition} is not supported for one-off events.`);
			}
		});
	});
});

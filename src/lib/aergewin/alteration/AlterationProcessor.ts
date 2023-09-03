import type AergewinGameEngine from '../AergewinGameEngine';
import type { TargetCondition, EventAlteration, ZoneActionName, TerrainTypeCondition } from '../GameData';
import type { AlterationTarget, EventCondition, OperatorType, ResourceName, ResourceQuantityAlteration } from '../GameData';
import Operator from './Operator';
import type AbstractGameEntity from '../entities/AbstractGameEntity';

export default class AlterationProcessor {
	private engine: AergewinGameEngine;

	constructor(engine: AergewinGameEngine) {
		this.engine = engine;
	}

	public process(alterations: EventAlteration[]) {
		alterations.forEach((alteration: EventAlteration) => this.processOne(alteration));
	}

	private processOne(alteration: EventAlteration) {
		let targets = this.getOneOffAlterationTargets(alteration);

		if (alteration.alterActionCost) {
			console.info('TODO');
		}
		if (alteration.alterActionReward) {
			console.info('TODO');
		}
		if (alteration.alterResourceQuantity) {
			console.info('TODO');
		}
		if (alteration.alterProperty) {
			console.info('TODO');
		}
		if (alteration.replaceClosestTerrain) {
			console.info('TODO');
		}
	}

	private getOneOffAlterationTargets(alteration: EventAlteration): Array<AbstractGameEntity> {
		if (!alteration.conditions) {
			console.warn('NO CONDITION in alteration. To fix.', alteration);
			// TODO: fix
			return [];
		}

		const conditions = Array.isArray(alteration.conditions) ? alteration.conditions : [alteration.conditions];

		const targets: Array<AbstractGameEntity> = [];

		const players = Array.from(this.engine.players.values());

		for (const condition of conditions) {
			const actionCondition: ZoneActionName | 'movement' | 'positioned_at' | undefined = condition.targetCondition?.[0];
			let conds = condition.targetCondition?.[1];
			if (conds) {
				conds = Array.isArray(conds) ? conds : [conds];
			}
			let terrainConditions: Array<TerrainTypeCondition> = conds || [];

			if (actionCondition && actionCondition !== 'positioned_at') {
				throw new Error('Unrecoverable error.');
			}

			const targetEntity = condition.targetEntity;

			if (terrainConditions.length) {
				console.warn('Is "terrainCondition && !targetEntity" a thing?');
				console.warn("It's a one-off call anyway, so usually should resolve to all players matching terrain.");

				for (const player of players) {
					for (const terrain of terrainConditions) {
						if (
							player.isAtTerrain(terrain) &&
							(!targetEntity ||
								targetEntity === 'all_players' ||
								targetEntity === 'player_matching_condition' ||
								(targetEntity === 'current_player' && player.isCurrentPlayer))
						) {
							targets.push(player);
						}
					}
				}
			}
		}

		return targets;

		// switch (targetType) {
		// 	case 'village':
		// 		return [this.engine.village];
		// 	case 'current_player':
		// 		return [this.engine.currentPlayer];
		// 	case 'all_players':
		// 		return [...this.engine.players.values()];
		// }
	}
}

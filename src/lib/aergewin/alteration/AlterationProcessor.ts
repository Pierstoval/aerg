import type AergewinGameEngine from '../AergewinGameEngine';
import type { TargetCondition, EventAlteration, ZoneActionName, TerrainTypeCondition, AlterationCondition } from '../GameData';
import type { AlterationTarget, EventCondition, OperatorType, ResourceName, ResourceQuantityAlteration } from '../GameData';
import Operator from './Operator';
import type AbstractGameEntity from '../entities/AbstractGameEntity';
import type Player from '$lib/aergewin/entities/Player';

export default class AlterationProcessor {
	private engine: AergewinGameEngine;

	constructor(engine: AergewinGameEngine) {
		this.engine = engine;
	}

	public processOneOff(alterations: EventAlteration[]) {
		alterations.forEach((alteration: EventAlteration) => this.processOneOffSingle(alteration));
	}

	private processOneOffSingle(alteration: EventAlteration) {
		const targets = this.getOneOffAlterationTargets(alteration);

		console.info(`Resolved targets: ${targets.length || '-'}`);

		if (alteration.alterActionCost || alteration.alterActionReward) {
			console.error('"alterActionCost" and "alterActionReward" are not applicable to one-off events.');
			return;
		}

		if (alteration.alterResourceQuantity) {
			console.info('TODO: alterResourceQuantity');
		}

		if (alteration.alterProperty) {
			console.info('TODO: alterProperty');
		}

		if (alteration.replaceClosestTerrain) {
			console.info('TODO: replaceClosestTerrain');
		}
	}

	private getOneOffAlterationTargets(alteration: EventAlteration): Array<AbstractGameEntity> {
		if (!alteration.conditions) {
			console.error('NO CONDITION in alteration. To fix.', alteration);
			// TODO: fix
			return [];
		}

		const conditions = Array.isArray(alteration.conditions) ? alteration.conditions : [alteration.conditions];

		const targets: Array<AbstractGameEntity> = this.getTargetsByTerrain(conditions).filter((target) => {
			console.info('TODO: reimplement targets gathering with proper filters instead of single function');
			return true; //return this.matchesTerrain(target, conditions);
		});

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

	private getTargetsByTerrain(conditions: Array<AlterationCondition>): Array<AbstractGameEntity> {
		const targets: Array<AbstractGameEntity> = [];

		const players = Array.from(this.engine.players.values());

		for (const condition of conditions) {
			const actionCondition: ZoneActionName | 'movement' | 'positioned_at' | undefined = condition.targetCondition?.[0];
			let conds = condition.targetCondition?.[1];
			if (conds) {
				conds = Array.isArray(conds) ? conds : [conds];
			}
			const terrainConditions: Array<TerrainTypeCondition> = conds || [];

			if (actionCondition && actionCondition !== 'positioned_at') {
				throw new Error('Unrecoverable error.');
			}

			const targetEntity = condition.targetEntity;

			for (const terrain of terrainConditions || []) {
				for (const player of players) {
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

		return targets;
	}
}

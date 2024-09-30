import type AergewinGameEngine from '../AergewinGameEngine';
import type {
	EventAlteration,
	ZoneActionName,
	TerrainTypeCondition,
	AlterationCondition,
	TargetPropertyAlteration
} from '../GameData';
import type AbstractGameEntity from '../entities/AbstractGameEntity';
import Player from '$lib/aergewin/entities/Player';

export default class AlterationProcessor {
	private readonly engine: AergewinGameEngine;

	constructor(engine: AergewinGameEngine) {
		this.engine = engine;
	}

	public processOneOff(alterations: EventAlteration[]) {
		alterations.forEach((alteration: EventAlteration) => this.processOneOffSingle(alteration));
	}

	private processOneOffSingle(alteration: EventAlteration) {
		const targets = this.getOneOffAlterationTargets(alteration);

		console.info(`Resolved targets: ${targets.length || '-'}`);

		targets.forEach((target) => this.applyAlterationToTarget(alteration, target));
	}

	private getOneOffAlterationTargets(alteration: EventAlteration): Array<AbstractGameEntity> {
		if (!alteration.conditions) {
			console.error('NO CONDITION in alteration. To fix.', alteration);
			// TODO: fix
			return [];
		}

		const conditions = Array.isArray(alteration.conditions)
			? alteration.conditions
			: [alteration.conditions];

		const targets: Array<AbstractGameEntity> = this.getAvailableTargets().filter((target) => {
			return this.matchesTerrain(target, conditions);
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

	private getAvailableTargets(): Array<AbstractGameEntity> {
		return [...this.engine.players.values()];
	}

	public matchesTerrain(
		target: AbstractGameEntity,
		conditions: Array<AlterationCondition>
	): boolean {
		if (target instanceof Player) {
			return this.playerMatchesTerrain(target, conditions);
		}

		return false;
	}

	private playerMatchesTerrain(target: Player, conditions: Array<AlterationCondition>) {
		for (const condition of conditions) {
			const actionCondition = condition.targetCondition?.[0];
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
				if (
					target.isAtTerrain(terrain) &&
					(!targetEntity ||
						targetEntity === 'all_players' ||
						targetEntity === 'player_matching_condition' ||
						(targetEntity === 'current_player' && target.isCurrentPlayer))
				) {
					return true;
				}
			}
		}

		return false;
	}

	private applyAlterationToTarget(alteration: EventAlteration, target: AbstractGameEntity) {
		if (alteration.alterActionCost || alteration.alterActionReward) {
			console.error(
				'"alterActionCost" and "alterActionReward" are not applicable to one-off events.'
			);
			return;
		}

		if (alteration.alterResourceQuantity) {
			console.info('TODO: alterResourceQuantity');
		}

		if (alteration.alterProperty) {
			this.alterTargetProperty(alteration.alterProperty, target);
		}

		if (alteration.replaceClosestTerrain) {
			console.info('TODO: replaceClosestTerrain');
		}
	}

	private alterTargetProperty(alterProperty: TargetPropertyAlteration, target: AbstractGameEntity) {
		const [operator, amount, property] = alterProperty;

		switch (property) {
			case 'hp':
				target.alterHp(operator, amount);
				break;
			default:
				throw new Error(`Unrecoverable error: could not alter property "${property}".`);
		}
	}
}

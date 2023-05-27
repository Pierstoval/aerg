import type AergewinGameEngine from '../AergewinGameEngine';
import type { ActionCondition, EventAlteration } from '../GameData';
import type {
	AlterationTarget,
	EventCondition,
	OperatorType,
	ResourceName,
	ResourceQuantityAlteration
} from '../GameData';
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

	private processOne(alteration: EventAlteration, conditions: Array<EventCondition>) {
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

	private getTargets(targetType: AlterationTarget): AbstractGameEntity[] {
		switch (targetType) {
			case 'village':
				return [this.engine.village];
			case 'current_player':
				return [this.engine.currentPlayer];
			case 'all_players':
				return [...this.engine.players.values()];
		}
	}
}

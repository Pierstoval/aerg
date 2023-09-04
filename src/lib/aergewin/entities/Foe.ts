import type { Direction, Hex } from 'honeycomb-grid';
import { fromCoordinates, Grid, move } from 'honeycomb-grid';
import AbstractGameEntity from './AbstractGameEntity';
import type AergewinGameEngine from '$lib/aergewin/AergewinGameEngine';

export default class Foe extends AbstractGameEntity {
	private readonly _type: string; // TODO: add enemies types

	private _actionsSpent = 0;

	constructor(type: string, orderIndex: number, numberOfPlayers: number, position: Hex, engine: AergewinGameEngine) {
		super(position, engine);
		this._type = type;
	}

	public maxHp(): number {
		return 5; // TODO: update this depending on type
	}

	get type(): string {
		return this._type;
	}

	public goToDirection(direction: Direction) {
		this._grid.traverse([fromCoordinates(this._position), move(direction)]).map((p: Hex) => {
			const distance = this._grid.distance(this._position, p);
			this._actionsSpent += distance;
			this._position = p;

			return p;
		});
	}
}

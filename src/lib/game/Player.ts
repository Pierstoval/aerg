import type { Hex } from 'honeycomb-grid';
import { Direction, fromCoordinates, Grid, move } from 'honeycomb-grid';
import { keymap } from '../keymap';

export enum PlayerEvent {
	MOVE = 'move'
}

export type PlayerEventCallback = (player: Player) => void;

export default class Player {
	private eventListeners: Map<PlayerEvent, PlayerEventCallback[]> = new Map();

	private _position: Hex;
	private _grid: Grid<any>;

	constructor(position: Hex, grid: Grid<any>) {
		this._grid = grid;
		this._position = position;
	}

	public keyDown(keyCode: number) {
		const direction: number | undefined = keymap[keyCode];

		if (direction === undefined) {
			return;
		}

		this._grid
			.traverse([fromCoordinates(this._position), move(direction)])
			.map((p) => (this._position = p));

		this.dispatch(PlayerEvent.MOVE);
	}

	public updatePosition(hex: Hex) {
		this._position = hex;
	}

	get position(): Hex {
		return this._position;
	}

	public on(event: PlayerEvent, callback: any): void {
		const events = this.eventListeners.get(event) || [];
		events.push(callback);

		this.eventListeners.set(event, events);
	}

	private initialize(): void {
		this.on(PlayerEvent.MOVE, () => {
			console.info('MOVED');
		});
	}

	private dispatch(event: PlayerEvent): void {
		const events = this.eventListeners.get(event) || [];

		events.forEach((callback: PlayerEventCallback) => callback(this));
	}
}

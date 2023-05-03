import type {Direction, Hex} from 'honeycomb-grid';
import { fromCoordinates, Grid, move } from 'honeycomb-grid';
import { keymap } from '../keymap';

export enum PlayerEvent {
	MOVE = 'move'
}

export type PlayerEventCallback = (player: Player) => void;

export default class Player {
	private eventListeners: Map<PlayerEvent, PlayerEventCallback[]> = new Map();

	private readonly _name: string;
	private _position: Hex;
	private _grid: Grid<Hex>;

	private _actionsSpent = 0;

	constructor(name: string, position: Hex, grid: Grid<Hex>) {
		this._name = name;
		this._grid = grid;
		this._position = position;
	}

	get name(): string {
		return this._name;
	}

	get actionsSpent(): number {
		return this._actionsSpent;
	}

	public keyDown(key: string) {
		const direction: Direction | undefined = keymap[key];

		if (direction === undefined) {
			return;
		}

		this._grid
			.traverse([fromCoordinates(this._position), move(direction)])
			.map((p: Hex) => {
				const distance = this._grid.distance(this._position, p);
				this._actionsSpent += distance;
				this._position = p;

				return p;
			});

		this.dispatch(PlayerEvent.MOVE);
	}

	public moveTo(hex: Hex) {
		const distance = this._grid.distance(this._position, hex);
		this._actionsSpent += distance;
		this._position = hex;
		this.dispatch(PlayerEvent.MOVE);
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

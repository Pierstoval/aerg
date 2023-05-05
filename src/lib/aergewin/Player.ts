import type { Direction, Hex } from 'honeycomb-grid';
import { fromCoordinates, Grid, move } from 'honeycomb-grid';
import { Color } from '@svgdotjs/svg.js';

export type PlayerName = string;

export type PlayerConstructor = {
	name: string;
};

export enum PlayerEvent {
	MOVE = 'move'
}

export type PlayerEventCallback = (player: Player) => void;

export default class Player {
	private eventListeners: Map<PlayerEvent, PlayerEventCallback[]> = new Map();

	private readonly _name: string;
	private readonly _orderIndex: number;
	private readonly _color: Color;
	private _position: Hex;
	private _grid: Grid<Hex>;
	private _isActive: boolean = false;

	private _actionsSpent = 0;

	constructor(
		name: string,
		orderIndex: number,
		numberOfPlayers: number,
		position: Hex,
		grid: Grid<Hex>
	) {
		this._name = name;
		this._orderIndex = orderIndex;
		this._grid = grid;
		this._position = position;
		this._color = new Color(((orderIndex - 1) / numberOfPlayers) * 360, 90, 50, 'hsl');
		this._grid.setHexes([position]);
	}

	get color(): Color {
		return this._color;
	}

	get index(): number {
		return this._orderIndex;
	}

	get name(): string {
		return this._name;
	}

	get actionsSpent(): number {
		return this._actionsSpent;
	}

	get isActive(): boolean {
		return this._isActive;
	}

	public activate() {
		this._isActive = true;
	}

	public deactivate() {
		this._isActive = false;
	}

	public goToDirection(direction: Direction) {
		this._grid.traverse([fromCoordinates(this._position), move(direction)]).map((p: Hex) => {
			const distance = this._grid.distance(this._position, p);
			this._actionsSpent += distance;
			this._position = p;

			return p;
		});

		this.dispatch(PlayerEvent.MOVE);
	}

	public moveTo(hex: Hex) {
		const distance = this._grid.distance(this._position, hex);
		if (distance === 0) {
			// Do nothing if player is not moving.
			return;
		}
		this._actionsSpent += distance;
		this._position = hex;
		this.dispatch(PlayerEvent.MOVE);
	}

	public canMoveTo(hex: Hex) {
		const distance = this._grid.distance(this._position, hex);
		if (distance === 0) {
			// Can't move to the current place
			return false;
		}

		// return this._actionsSpent + distance <= 7;

		return true; // TODO: remove when not debugging.
	}

	get position(): Hex {
		return this._position;
	}

	public on(event: PlayerEvent, callback: any): void {
		const events = this.eventListeners.get(event) || [];
		events.push(callback);

		this.eventListeners.set(event, events);
	}

	private dispatch(event: PlayerEvent): void {
		const events = this.eventListeners.get(event) || [];

		events.forEach((callback: PlayerEventCallback) => callback(this));
	}

	private initialize(): void {
		this.on(PlayerEvent.MOVE, () => {
			console.info('MOVED');
		});
	}
}

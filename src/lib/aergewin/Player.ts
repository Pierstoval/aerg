import type { Direction, Hex } from 'honeycomb-grid';
import { fromCoordinates, Grid, move } from 'honeycomb-grid';
import { Color } from '@svgdotjs/svg.js';
import type TerrainTile from './TerrainTile';
import type { ResourceName } from './GameData';
import type { ZoneActivation } from './ZoneActivation';
import AergewinGameEngine from './AergewinGameEngine';

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
	private _inventory: Map<ResourceName, number> = new Map();
	private _hp: number;

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
		this._hp = 10; // TODO: implement player classes to customize HP
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

	get inventory(): Map<ResourceName, number> {
		return this._inventory;
	}

	get actionsSpent(): number {
		return this._actionsSpent;
	}

	get isActive(): boolean {
		return this._isActive;
	}

	get position(): Hex {
		return this._position;
	}

	get hp(): number {
		return this._hp;
	}

	play() {
		this._isActive = true;
	}

	stopPlaying() {
		this._isActive = false;
	}

	goToDirection(direction: Direction) {
		this._grid.traverse([fromCoordinates(this._position), move(direction)]).map((p: Hex) => {
			const distance = this._grid.distance(this._position, p);
			this._actionsSpent += distance;
			this._position = p;

			return p;
		});
	}

	moveTo(hex: Hex) {
		const distance = this._grid.distance(this._position, hex);
		if (distance === 0) {
			// Do nothing if player is not moving.
			return;
		}
		this._actionsSpent += distance;
		this._position = hex;
	}

	explore(hex: Hex) {
		const distance = this._grid.distance(this._position, hex);
		if (distance === 0) {
			// Do nothing if player is not moving.
			return;
		}
		this._actionsSpent += distance + this.explorationCost();
		this._position = hex;
	}

	canMove(): boolean {
		const totalCost = this._actionsSpent + this.movementCost(1);

		return totalCost <= AergewinGameEngine.MAX_ACTIONS_COUNT_PER_TURN;
	}

	canMoveTo(hex: Hex): boolean {
		const distance = this._grid.distance(this._position, hex);
		if (distance === 0) {
			return false;
		}

		const totalCost = this._actionsSpent + this.movementCost(distance);

		return totalCost <= AergewinGameEngine.MAX_ACTIONS_COUNT_PER_TURN;
	}

	dropResource(resource: ResourceName) {
		let currentAmount = this._inventory.get(resource) || 0;
		if (currentAmount === 0) {
			throw new Error(
				`Unrecoverable error: cannot drop resource "${resource}" since current inventory contains none.`
			);
		}

		this._inventory.set(resource, currentAmount - 1);
		if (this._inventory.get(resource) === 0) {
			this._inventory.delete(resource);
		}
	}

	canExplore(hex: Hex): boolean {
		const distance = this._grid.distance(this._position, hex);
		if (distance === 0) {
			return false;
		}

		const totalCost = this._actionsSpent + distance + this.explorationCost();

		return totalCost <= AergewinGameEngine.MAX_ACTIONS_COUNT_PER_TURN;
	}

	canActivateZone(terrain: TerrainTile) {
		if (terrain.possibleActions.length === 0) {
			// No actions possible.
			return false;
		}

		// TODO: calculate depending on terrain type.
		const minimumTerrainActivationCost = 1;

		const totalCost = this._actionsSpent + minimumTerrainActivationCost;

		return totalCost <= AergewinGameEngine.MAX_ACTIONS_COUNT_PER_TURN;
	}

	gatherFoodAt(action: ZoneActivation, zone: TerrainTile) {
		// TODO: calculate amount based on player type and zone.
		const amount = 1;

		this.addItemToInventory('food', amount);
		this._actionsSpent += action.cost;
	}

	gatherWoodAt(action: ZoneActivation, zone: TerrainTile) {
		// TODO: calculate amount based on player type and zone.
		const amount = 1;

		this.addItemToInventory('wood', amount);
		this._actionsSpent += action.cost;
	}

	gatherMineralsAt(action: ZoneActivation, zone: TerrainTile) {
		// TODO: calculate amount based on player type and zone.
		const amount = 1;

		this.addItemToInventory('minerals', amount);
		this._actionsSpent += action.cost;
	}

	healAt(action: ZoneActivation, playerZone: TerrainTile) {
		// TODO: calculate amount based on player type and zone.
		const amount = 1;

		this._hp += amount;
		this._actionsSpent += action.cost;
	}

	hasResource(resource: ResourceName, amount: number = 1) {
		let currentAmount = this._inventory.get(resource) || 0;

		return currentAmount >= amount;
	}

	isFullHp() {
		return this._hp === 10; // FIXME when we have classes
	}

	canFight(): boolean {
		const fightCost = 1; // FIXME when we have classes

		return this._actionsSpent + fightCost <= AergewinGameEngine.MAX_ACTIONS_COUNT_PER_TURN;
	}

	resetActions() {
		this._actionsSpent = 0;
	}

	private addItemToInventory(resource: ResourceName, amount: number = 1) {
		let currentAmount = this._inventory.get(resource) || 0;

		this._inventory.set(resource, currentAmount + amount);
	}

	private movementCost(distance: number) {
		// TODO: "Traveller" may have a bonus here
		return distance;
	}

	private explorationCost() {
		// TODO: "Explorator" may have a bonus here
		return 1;
	}
}

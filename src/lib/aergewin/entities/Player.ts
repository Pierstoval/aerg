import type { Direction, Hex, HexCoordinates } from 'honeycomb-grid';
import { fromCoordinates, move } from 'honeycomb-grid';
import { Color } from '@svgdotjs/svg.js';
import type TerrainTile from '../TerrainTile';
import type { ResourceName } from '../GameData';
import type { ZoneActivation } from '../ZoneActivation';
import type AergewinGameEngine from '../AergewinGameEngine';
import AbstractGameEntity from './AbstractGameEntity';

export type PlayerName = string;

export type PlayerConstructor = {
	name: string;
	position?: HexCoordinates;
};

export default class Player extends AbstractGameEntity {
	private readonly _name: string;
	private readonly _orderIndex: number;
	private readonly _color: Color;
	private _isActive = false;
	private _actionsSpent = 0;

	constructor(name: string, orderIndex: number, numberOfPlayers: number, position: Hex, engine: AergewinGameEngine) {
		super(position, engine);
		this._name = name;
		this._orderIndex = orderIndex;
		this._color = new Color(((orderIndex - 1) / numberOfPlayers) * 360, 90, 40, 'hsl');
	}

	public maxHp(): number {
		return 10; // TODO: implement player classes to customize HP
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

	get hp(): number {
		return this._hp;
	}

	get isCurrentPlayer(): boolean {
		return this._engine.currentPlayer.name === this._name;
	}

	play() {
		this._isActive = true;
	}

	stopPlaying() {
		this._isActive = false;
	}

	goToDirection(direction: Direction) {
		this._engine.grid.traverse([fromCoordinates(this._position), move(direction)]).map((p: Hex) => {
			const distance = this._engine.grid.distance(this._position, p);
			this._actionsSpent += distance;
			this._position = p;

			return p;
		});
	}

	moveTo(hex: Hex) {
		const distance = this._engine.grid.distance(this._position, hex);
		if (distance === 0) {
			// Do nothing if player is not moving.
			return;
		}
		this._actionsSpent += distance;
		this._position = hex;
	}

	explore(hex: Hex) {
		const distance = this._engine.grid.distance(this._position, hex);
		if (distance === 0) {
			// Do nothing if player is not moving.
			return;
		}
		this._actionsSpent += distance + this.explorationCost();
		this._position = hex;
	}

	canMove(): boolean {
		const totalCost = this._actionsSpent + this.movementCost(1);

		return totalCost <= this._engine.configuration.max_actions_count_per_turn;
	}

	canMoveTo(hex: Hex): boolean {
		const distance = this._engine.grid.distance(this._position, hex);
		if (distance === 0) {
			return false;
		}

		const totalCost = this._actionsSpent + this.movementCost(distance);

		return totalCost <= this._engine.configuration.max_actions_count_per_turn;
	}

	dropResource(resource: ResourceName) {
		const currentAmount = this._inventory.get(resource) || 0;
		if (currentAmount === 0) {
			throw new Error(`Unrecoverable error: cannot drop resource "${resource}" since current inventory contains none.`);
		}

		this._inventory.set(resource, currentAmount - 1);
		if (this._inventory.get(resource) === 0) {
			this._inventory.delete(resource);
		}
	}

	canExplore(hex: Hex): boolean {
		const distance = this._engine.grid.distance(this._position, hex);
		if (distance === 0) {
			return false;
		}

		const totalCost = this._actionsSpent + distance + this.explorationCost();

		return totalCost <= this._engine.configuration.max_actions_count_per_turn;
	}

	canActivateZone(terrain: TerrainTile) {
		if (terrain.possibleActions.length === 0) {
			// No actions possible.
			return false;
		}

		// TODO: calculate depending on terrain type.
		const minimumTerrainActivationCost = 1;

		const totalCost = this._actionsSpent + minimumTerrainActivationCost;

		return totalCost <= this._engine.configuration.max_actions_count_per_turn;
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

	isFullHp() {
		return this._hp === 10; // FIXME when we have classes
	}

	canFight(): boolean {
		const fightCost = 1; // FIXME when we have classes

		return this._actionsSpent + fightCost <= this._engine.configuration.max_actions_count_per_turn;
	}

	newTurn() {
		this._actionsSpent = 0;
	}

	private movementCost(distance: number) {
		// TODO: "Traveller" may have a bonus here
		console.info('TODO: alter movement cost based on current events.');
		return distance;
	}

	private explorationCost() {
		// TODO: "Explorator" may have a bonus here
		console.info('TODO: alter exploration cost based on current events.');
		return 1;
	}
}

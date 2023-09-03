import type { PlayerName } from './entities/Player';
import Player, { type PlayerConstructor } from './entities/Player';
import { defineHex, Direction, Grid, type Hex, line, Orientation, spiral } from 'honeycomb-grid';
import Renderer from './rendering/Renderer';
import type SceneManager from '../SceneManagement/SceneManager';
import TerrainTile from './TerrainTile';
import type { GameEventCallback, GameEventType } from './Event';
import { TickEvent, GameEvent } from './Event';
import type Foe from './entities/Foe';
import type { ZoneActivation, ResourceCost } from './ZoneActivation';
import {
	Assets,
	TerrainsDecks,
	DailyEventsDeck,
	type TerrainType,
	type DailyEvent,
	type ResourceName,
	type EventCondition,
	type TargetCondition
} from './GameData';
import Village from './entities/Village';
import AlterationProcessor from './alteration/AlterationProcessor';

export default class AergewinGameEngine {
	public static readonly MAX_ACTIONS_COUNT_PER_TURN = 7;

	public static readonly options = {
		hexSize: 70,
		hexOrientation: Orientation.FLAT
	};

	private readonly sceneManager: SceneManager;
	private readonly renderer: Renderer;
	private readonly eventListeners: Map<GameEventType, GameEventCallback[]> = new Map();
	private readonly alterationProcessor: AlterationProcessor;
	private readonly _grid: Grid<Hex>;
	private readonly _currentEvents: Array<DailyEvent> = [];
	private readonly _players: Map<string, Player>;
	private readonly _terrain: Array<TerrainTile>;
	private readonly _foes: Array<Foe> = [];
	private readonly _village: Village;

	private _started = false;
	private _currentTurnIndex = 0;
	private _currentTurnFirstPlayer: PlayerName;
	private _currentPlayer: PlayerName;
	private terrainDeck: Array<TerrainType>;
	private eventsDeck: Array<DailyEvent>;

	constructor(
		sceneManager: SceneManager,
		hexGridElement: HTMLElement,
		hudElement: HTMLElement,
		players: Array<PlayerConstructor>
	) {
		this.sceneManager = sceneManager;
		this._grid = this.createGrid();
		this._players = this.createPlayers(players);
		this._terrain = this.createTerrain();
		this._currentTurnFirstPlayer = this.getFirstPlayerName();
		this._currentPlayer = this.getFirstPlayerName();
		this.renderer = new Renderer(this, this._grid, hexGridElement, hudElement);
		this.terrainDeck = TerrainsDecks;
		this.eventsDeck = [...DailyEventsDeck];
		this._village = new Village(this.getVillageTerrainTile(), this._grid.createHex([0, 0]), this._grid);
		this.alterationProcessor = new AlterationProcessor(this);
	}

	get players(): Map<string, Player> {
		return this._players;
	}

	get terrain(): Array<TerrainTile> {
		return this._terrain;
	}

	get isRunning(): boolean {
		return this._started;
	}

	get currentEvents(): Array<DailyEvent> {
		return this._currentEvents;
	}

	get currentTurnFirstPlayer(): PlayerName {
		return this._currentTurnFirstPlayer;
	}

	get currentTurn(): number {
		return this._currentTurnIndex;
	}

	get village(): Village {
		return this._village;
	}

	get grid(): Grid<Hex> {
		return this._grid;
	}

	start() {
		if (this._started) {
			throw new Error('Game already running.');
		}
		this._started = true;

		Promise.all([this.loadAssets()]).then(() => {
			this.newTurn();
		});
	}

	click(e: MouseEvent) {
		this.checkGameIsRunning();

		this.moveCurrentPlayerTo(this.getHexFromMouseEvent(e));
	}

	mouseMove(e: MouseEvent) {
		this.checkGameIsRunning();

		this.hoverCurrentPlayerPath(this.getHexFromMouseEvent(e));
	}

	playerCanFight(player: Player) {
		if (!player.canFight()) {
			return false;
		}

		let canFight = false;

		this._foes.forEach((foe: Foe) => {
			if (foe.position.toString() === player.position.toString()) {
				canFight = true;
			}
		});

		return canFight;
	}

	get currentPlayer(): Player {
		this.checkGameIsRunning();

		const player = this._players.get(this._currentPlayer);

		if (!player) {
			throw new Error('Unrecoverable error: cannot find current player.');
		}

		return player;
	}

	getPlayerZone(player: Player): TerrainTile {
		this.checkGameIsRunning();

		let zone: TerrainTile | undefined;

		this._terrain.forEach((terrain: TerrainTile) => {
			if (terrain.position.toString() === player.position.toString()) {
				zone = terrain;
			}
		});

		if (!zone) {
			throw new Error('Unrecoverable error: selected player is not on a terrain tile.');
		}

		return zone;
	}

	on(eventType: GameEventType, callback: GameEventCallback): void {
		const listeners = this.eventListeners.get(eventType) || [];
		listeners.push(callback);

		this.eventListeners.set(eventType, listeners);
	}

	playerCanActivateZone(player: Player, action: ZoneActivation): boolean {
		const playerActionSpent = player.actionsSpent;
		const currentZone = this.getPlayerZone(player);

		let hasResource = true;
		action.resourceCost.forEach((cost: ResourceCost) => {
			if (!player.hasResource(cost[0], cost[1])) {
				hasResource = false;
			}
		});

		const canExecute = hasResource && playerActionSpent + action.cost <= AergewinGameEngine.MAX_ACTIONS_COUNT_PER_TURN;

		if (!canExecute) {
			return false;
		}

		switch (action.name) {
			case 'repair_village':
				return this._village.hp < 10 && currentZone.isType('village');
			case 'build_barricade':
				return currentZone.isType('village');
			case 'heal_self':
				return !player.isFullHp() && (currentZone.isType('village') || currentZone.isType('sanctuary'));
			case 'gather_food':
				return currentZone.isType('lake') || currentZone.isType('forest');
			case 'gather_wood':
				return currentZone.isType('forest');
			case 'gather_minerals':
				return currentZone.isType('mine');
		}

		throw new Error(`Unrecoverable error: Unsupported action "${action.name}".`);
	}

	playerActivateZone(player: Player, action: ZoneActivation) {
		switch (action.name) {
			case 'repair_village':
				alert('TODO: repair village');
				break;
			case 'build_barricade':
				alert('TODO: build barricade');
				break;
			case 'heal_self':
				player.healAt(action, this.getPlayerZone(player));
				break;
			case 'gather_food':
				player.gatherFoodAt(action, this.getPlayerZone(player));
				break;
			case 'gather_wood':
				player.gatherWoodAt(action, this.getPlayerZone(player));
				break;
			case 'gather_minerals':
				player.gatherMineralsAt(action, this.getPlayerZone(player));
				break;
		}

		this.goToNextPlayer();
	}

	addResourceAt(resource: ResourceName, position: Hex) {
		const positionAsString = position.toString();
		const terrainsAtPosition = this._terrain.filter((item: TerrainTile) => {
			return item.position.toString() === positionAsString;
		});

		if (terrainsAtPosition.length > 1) {
			throw new Error('Unrecoverable error: more than one terrain were found at the same position');
		}

		if (terrainsAtPosition.length === 0) {
			throw new Error('Unrecoverable error: no terrain to add resource at');
		}

		terrainsAtPosition[0].addResource(resource, 1);

		this.tick();
	}

	goToNextPlayer() {
		this._players.forEach((p: Player) => {
			p.stopPlaying();
		});
		this._currentPlayer = this.getNextPlayerName(this._currentPlayer);
		this.currentPlayer.play();
		this.tick();
	}

	newTurn() {
		if (this._currentTurnIndex === 0) {
			this._currentPlayer = this.getFirstPlayerName();
		} else {
			this._currentPlayer = this.getNextPlayerName(this._currentTurnFirstPlayer);
		}
		this._currentTurnIndex++;

		this._currentTurnFirstPlayer = this._currentPlayer;

		this._players.forEach((player: Player) => {
			player.stopPlaying();
			player.newTurn();
		});

		this.pickNewDailyEvent();

		this.currentPlayer.play();

		this.tick();
	}

	private playerCanMoveOrExplore(player: Player, hexCoordinates: Hex) {
		const hexContainsTerrain = this.hexContainsTerrain(hexCoordinates);

		return (!hexContainsTerrain && player.canExplore(hexCoordinates)) || (hexContainsTerrain && player.canMoveTo(hexCoordinates));
	}

	private getHexFromMouseEvent(e: MouseEvent) {
		const offsetX = e.offsetX + this.renderer.getMinX();
		const offsetY = e.offsetY + this.renderer.getMinY();

		return this._grid.pointToHex(
			{ x: offsetX, y: offsetY },
			{
				allowOutside: false
			}
		);
	}

	private tick() {
		this.checkGameIsRunning();

		this.refreshGrid();

		this.renderer.draw(() => this.dispatch('tick', new TickEvent(this.sceneManager, this, this.renderer)));
	}

	private getNextPlayerName(currentPlayerName: string): PlayerName {
		const playersNames = [...this._players.keys()];

		let found = false;

		for (const playerName of playersNames) {
			if (found) {
				return playerName;
			}

			if (playerName === currentPlayerName) {
				// Set flag to "true" so *next iteration* will set next player.
				// If next iteration is empty (thus current iteration = last item),
				//   then next player is the first player in the list.
				found = true;
			}
		}

		if (!found) {
			throw new Error('Unrecoverable error: could not determine next player.');
		}

		// If found but it reaches this code, it means it iterated to the last item,
		// and did not iterate again, so this means next player is the first player in the list.
		return this._players.keys().next().value;
	}

	private checkGameIsRunning() {
		if (!this._started) {
			throw new Error('Game not running yet. Have you forgotten to run "game.start()"?');
		}
	}

	private getFirstPlayer(): Player {
		return this._players.values().next().value;
	}

	private getFirstPlayerName(): PlayerName {
		return this.getFirstPlayer().name;
	}

	private createGrid() {
		return new Grid(
			defineHex({
				dimensions: AergewinGameEngine.options.hexSize,
				orientation: AergewinGameEngine.options.hexOrientation,
				origin: { x: 0, y: 0 }
			}),
			spiral({
				radius: 1
			})
		);
	}

	private createPlayers(players: Array<PlayerConstructor>) {
		const map = new Map();

		let i = 1;
		for (const playerConstructor of players) {
			const player = new Player(playerConstructor.name, i, players.length, this._grid.createHex([0, 0]), this);
			map.set(playerConstructor.name, player);
			i++;
		}

		return map;
	}

	private createTerrain() {
		return [
			new TerrainTile('village', this._grid.createHex([0, 0]), this._grid),
			new TerrainTile('mountain', this._grid.createHex([1, 0]), this._grid),
			new TerrainTile('forest', this._grid.createHex([0, -1]), this._grid),
			new TerrainTile('plains', this._grid.createHex([-1, 1]), this._grid)
		];
	}

	private refreshGrid() {
		this._terrain.forEach((terrainTile: TerrainTile) => {
			const newHexes = this.getNewHexesAroundPosition(terrainTile.position);
			if (newHexes.length) {
				this._grid.setHexes(newHexes);
			}
		});

		this._players.forEach((player: Player) => {
			const newHexes = this.getNewHexesAroundPosition(player.position);
			if (newHexes.length) {
				this._grid.setHexes(newHexes);
			}
		});
	}

	private dispatch(eventType: GameEventType, event: GameEvent): void {
		const events = this.eventListeners.get(eventType) || [];

		events.forEach((callback: GameEventCallback) => callback(event));
	}

	private getNewHexesAroundPosition(position: Hex) {
		const directional = [];

		directional.push(this._grid.neighborOf(position, Direction.N));
		directional.push(this._grid.neighborOf(position, Direction.NE));
		directional.push(this._grid.neighborOf(position, Direction.E));
		directional.push(this._grid.neighborOf(position, Direction.SE));
		directional.push(this._grid.neighborOf(position, Direction.S));
		directional.push(this._grid.neighborOf(position, Direction.SW));
		directional.push(this._grid.neighborOf(position, Direction.W));
		directional.push(this._grid.neighborOf(position, Direction.NW));

		return directional.filter((hex: Hex) => !this._grid.hasHex(hex));
	}

	private hexContainsTerrain(hexCoordinates: Hex) {
		let found = false;

		this._terrain.forEach((tile: TerrainTile) => {
			if (tile.position.toString() === hexCoordinates.toString()) {
				found = true;
			}
		});

		return found;
	}

	private getVillageTerrainTile(): TerrainTile {
		const terrains = this._terrain.filter((terrain) => terrain.isType('village'));

		if (terrains.length === 0) {
			throw new Error('Unrecoverable error: could not find village.');
		}

		if (terrains.length > 1) {
			throw new Error('Unrecoverable error: found more than one village tile.');
		}

		return terrains[0];
	}
	private createNewTerrainAt(hexCoordinates: Hex) {
		if (!this.terrainDeck.length) {
			throw new Error('Tried to get new terrain but deck is empty.');
		}

		// Pop one random terrain off the deck.
		const spliceResult = this.terrainDeck.splice(Math.floor(Math.random() * this.terrainDeck.length), 1);

		return new TerrainTile(spliceResult[0], hexCoordinates, this._grid);
	}

	private moveCurrentPlayerTo(hexCoordinates: Hex | undefined) {
		this.renderer.updateHoverPositions([]);

		if (!hexCoordinates) {
			return;
		}

		const currentPlayer = this.currentPlayer;

		if (!this.hexContainsTerrain(hexCoordinates)) {
			// Exploration
			if (currentPlayer.canExplore(hexCoordinates)) {
				// Exploration
				this._terrain.push(this.createNewTerrainAt(hexCoordinates));
				currentPlayer.explore(hexCoordinates);
				currentPlayer.moveTo(hexCoordinates);
			} else {
				return;
			}
		} else if (currentPlayer.canMoveTo(hexCoordinates)) {
			// Simple movement
			currentPlayer.moveTo(hexCoordinates);
		} else {
			return;
		}

		this.goToNextPlayer();
	}

	private hoverCurrentPlayerPath(hexCoordinates: Hex | undefined) {
		const player = this.currentPlayer;
		const currentPlayerPosition = player.position.toString();

		if (hexCoordinates && this.playerCanMoveOrExplore(player, hexCoordinates)) {
			const hoverList = [
				...this._grid.traverse(line({ start: player.position, stop: hexCoordinates })).filter((hex: Hex) => {
					return hex.toString() !== currentPlayerPosition;
				})
			];
			this.renderer.updateHoverPositions(hoverList);
		}
	}

	private async loadAssets() {
		return Promise.all(
			Object.values(Assets).map((assetUrl) => {
				return fetch(assetUrl).then((res) => {
					if (res.ok) {
						console.info(`Successfully loaded "${assetUrl}".`);
					} else {
						throw new Error(`Could not load "${assetUrl}".`);
					}
				});
			})
		);
	}

	private pickNewDailyEvent() {
		if (!this.eventsDeck.length) {
			this.resetEventDeck();
		}

		const spliceResult = this.eventsDeck.splice(Math.floor(Math.random() * this.eventsDeck.length), 1);

		const newEvent: DailyEvent = spliceResult[0];
		if (newEvent.duration === 'one-off') {
			this.applyOneOffDailyEvent(newEvent);
			return;
		}

		if (this._currentEvents.length === 2) {
			// Remove last element if there are more than 2
			this._currentEvents.pop();
		}

		// Add event to the beginning of the current events
		this._currentEvents.unshift(newEvent);
	}

	private applyOneOffDailyEvent(event: DailyEvent) {
		if (event.duration !== 'one-off') {
			throw new Error('Unrecoverable error: tried to apply one-off event effets, but specified event is not one-off.');
		}

		console.info('Applying one-off event', event);

		const alterations = Array.isArray(event.alterations) ? event.alterations : [event.alterations];

		this.alterationProcessor.process(alterations);

		return;
	}

	private oneOffConditionMatches(event: DailyEvent): boolean {
		if (!event.conditions.length) {
			// No conditions = always apply event.
			return true;
		}

		for (const condition of event.conditions) {
			const conditionType = condition[0];
			if (conditionType !== 'positioned_at') {
				throw new Error(`Condition type ${conditionType} is not supported for one-off events.`);
			}
			const terrainConditions = Array.isArray(condition[1]) ? condition[1] : [condition[1]];
			debugger;
		}
		return false;
	}

	private resetEventDeck() {
		this.eventsDeck = [...DailyEventsDeck].filter((event: DailyEvent) => {
			let useEvent = true;

			this._currentEvents.forEach((currentEvent: DailyEvent) => {
				if (currentEvent == event || currentEvent === event) {
					useEvent = false;
				}
			});

			return useEvent;
		});
	}
}

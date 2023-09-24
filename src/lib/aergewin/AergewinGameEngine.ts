import type { PlayerName } from './entities/Player';
import Player, { type PlayerConstructor } from './entities/Player';
import { defineHex, Direction, Grid, type Hex, line, spiral } from 'honeycomb-grid';
import TerrainTile, { type TerrainConstructor } from './TerrainTile';
import type { GameEventCallback, GameEventType } from './Event';
import { TickEvent, GameEvent } from './Event';
import type Foe from './entities/Foe';
import type { ZoneActivation, ResourceCost } from './ZoneActivation';
import { TerrainsDecks, DailyEventsDeck, type TerrainType, type DailyEvent, type ResourceName } from './GameData';
import Village from './entities/Village';
import AlterationProcessor from './alteration/AlterationProcessor';
import type RendererFactory from '$lib/aergewin/rendering/RendererFactory';
import type RendererInterface from '$lib/aergewin/rendering/RendererInterface';
import type RandomnessProviderInterface from '$lib/aergewin/random/RandomnessProviderInterface';
import { getHexFromMouseEvent } from '$lib/aergewin/user_interaction/mouse_interaction';
import type { GameConfiguration } from '$lib/aergewin/GameConfiguration';

export default class AergewinGameEngine {
	private readonly _configuration: GameConfiguration;
	private readonly _currentEvents: Array<DailyEvent> = [];
	private readonly _foes: Array<Foe> = [];
	private readonly _grid: Grid<Hex>;
	private readonly _players: Map<string, Player>;
	private readonly _renderer: RendererInterface;
	private readonly _terrain: Array<TerrainTile>;
	private readonly _village: Village;
	private readonly alterationProcessor: AlterationProcessor;
	private readonly eventListeners: Map<GameEventType, GameEventCallback[]> = new Map();
	private readonly randomnessProvider: RandomnessProviderInterface;

	private _started = false;
	private _currentTurnIndex = 0;
	private _currentTurnFirstPlayer: PlayerName;
	private _currentPlayer: PlayerName;
	private terrainDeck: Array<TerrainType>;
	private eventsDeck: Array<DailyEvent>;

	constructor(
		rendererFactory: RendererFactory,
		randomnessProvider: RandomnessProviderInterface,
		configuration: GameConfiguration
	) {
		if (!configuration.players?.length) {
			throw new Error(
				'No players defined when starting the game. Did you forget to add the "players" key to the GameConfiguration object?'
			);
		}
		if (!configuration.visibleTerrain?.length) {
			throw new Error(
				'No terrain defined when starting the game. Did you forget to add the "visibleTerrain" key to the GameConfiguration object?'
			);
		}
		this.randomnessProvider = randomnessProvider;
		this._configuration = configuration;
		this._grid = this.createGrid();
		this._players = this.createPlayers(configuration.players);
		this._terrain = this.createTerrain(configuration.visibleTerrain);
		this._currentTurnFirstPlayer = this.getFirstPlayerName();
		this._currentPlayer = this.getFirstPlayerName();
		this.terrainDeck = TerrainsDecks;
		this.eventsDeck = [...DailyEventsDeck];
		this._village = new Village(this.getVillageTerrainTile(), this._grid.createHex([0, 0]), this);
		this.alterationProcessor = new AlterationProcessor(this);
		this._renderer = rendererFactory.getRenderer(this);
	}

	get configuration(): GameConfiguration {
		return this._configuration;
	}
	get currentEvents(): Array<DailyEvent> {
		return this._currentEvents;
	}
	get currentPlayer(): Player {
		this.checkGameIsRunning();
		const player = this._players.get(this._currentPlayer);
		if (!player) throw new Error('Unrecoverable error: cannot find current player.');
		return player;
	}
	get currentTurn(): number {
		return this._currentTurnIndex;
	}
	get currentTurnFirstPlayer(): PlayerName {
		return this._currentTurnFirstPlayer;
	}
	get grid(): Grid<Hex> {
		return this._grid;
	}
	get isRunning(): boolean {
		return this._started;
	}
	get players(): Map<string, Player> {
		return this._players;
	}
	get renderer(): RendererInterface {
		return this._renderer;
	}
	get terrain(): Array<TerrainTile> {
		return this._terrain;
	}
	get village(): Village {
		return this._village;
	}

	async start() {
		if (this._started) {
			throw new Error('Game already running.');
		}
		this._started = true;

		await this._renderer.loadAssets();

		this.newTurn();
	}

	click(e: MouseEvent) {
		this.checkGameIsRunning();

		this.moveCurrentPlayerTo(getHexFromMouseEvent(this._grid, this._renderer, e));
	}

	mouseMove(e: MouseEvent) {
		this.checkGameIsRunning();

		this.hoverCurrentPlayerPath(getHexFromMouseEvent(this._grid, this._renderer, e));
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

	moveCurrentPlayerTo(hexCoordinates: Hex | undefined) {
		this.checkGameIsRunning();

		this._renderer.updateHoverPositions([]);

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

		const canExecute = hasResource && playerActionSpent + action.cost <= this._configuration.max_actions_count_per_turn;

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
		this.updatePlayer(() => {
			const p = this.currentPlayer;
			p.play();
			return p;
		});
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
			this.updatePlayer(() => {
				player.stopPlaying();
				player.newTurn();
				return player;
			});
		});

		this.pickNewDailyEvent();

		this.updatePlayer(() => {
			const p = this.currentPlayer;
			p.play();
			return p;
		});

		this.tick();
	}

	private updatePlayer(callback: () => Player): void {
		const newPlayer = callback();
		if (!newPlayer) {
			throw new Error(
				'Callback used to update current player must return the instance of the player you just updated. Did you forget to write "return player;"?'
			);
		}
		this._players.set(newPlayer.name, newPlayer);
	}

	private playerCanMoveOrExplore(player: Player, hexCoordinates: Hex) {
		const hexContainsTerrain = this.hexContainsTerrain(hexCoordinates);

		return (!hexContainsTerrain && player.canExplore(hexCoordinates)) || (hexContainsTerrain && player.canMoveTo(hexCoordinates));
	}

	private tick() {
		this.checkGameIsRunning();

		this.refreshGrid();

		this._renderer.draw(() => this.dispatch('tick', new TickEvent(this, this._renderer)));
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
				dimensions: this._configuration.hexSize,
				orientation: this._configuration.hexOrientation,
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
			const coordinates = playerConstructor.position || [0, 0];
			const player = new Player(playerConstructor.name, i, players.length, this._grid.createHex(coordinates), this);
			map.set(playerConstructor.name, player);
			i++;
		}

		return map;
	}

	private createTerrain(terrains: Array<TerrainConstructor>): TerrainTile[] {
		return terrains.map((ctor) => {
			return new TerrainTile(ctor.type, this._grid.createHex(ctor.position), this._grid);
		});
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

		const randomNumber = this.randomnessProvider.provideKeyedNumberBetween('new_terrain', 0, this.terrainDeck.length);

		// Pop one random terrain off the deck.
		const spliceResult = this.terrainDeck.splice(randomNumber, 1);

		return new TerrainTile(spliceResult[0], hexCoordinates, this._grid);
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
			this._renderer.updateHoverPositions(hoverList);
		}
	}

	private pickNewDailyEvent() {
		if (!this.eventsDeck.length) {
			this.resetEventDeck();
		}

		const randomNumber = this.randomnessProvider.provideKeyedNumberBetween('new_daily_event', 0, this.eventsDeck.length);
		const spliceResult = this.eventsDeck.splice(randomNumber, 1);

		const newEvent: DailyEvent = spliceResult[0];
		if (newEvent.duration === 'one-off') {
			console.info('One-off event: ', newEvent);
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

		const alterations = Array.isArray(event.alterations) ? event.alterations : [event.alterations];

		this.alterationProcessor.processOneOff(alterations);

		return;
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

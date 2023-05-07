import type { PlayerName } from './Player';
import Player, { type PlayerConstructor, PlayerEvent } from './Player';
import { defineHex, Direction, Grid, type Hex, line, Orientation, spiral } from 'honeycomb-grid';
import Renderer from './Renderer';
import type Game from '../game/Game';
import TerrainTile from './TerrainTile';
import type { GameEventCallback, GameEventType } from './Event';
import { TickEvent, GameEvent } from './Event';
import type Foe from './Foe';
import type { TerrainType } from './GameData';
import { TerrainsDecks } from './GameData';
import type ZoneActivation from "./ZoneActivation";

export type CurrentGameAction = 'actions_list' | 'move' | 'fight' | 'activate_zone';

export default class AergewinGameEngine {
	public static readonly options = {
		hexSize: 70,
		hexOrientation: Orientation.FLAT
	};

	private readonly _game: Game;
	private readonly _grid: Grid<Hex>;
	private readonly _renderer: Renderer;
	private readonly _players: Map<string, Player>;
	private readonly _terrain: Array<TerrainTile>;
	private readonly _terrainDeck: Array<TerrainType>;
	private readonly _foes: Array<Foe> = [];

	private started: boolean = false;
	private eventListeners: Map<GameEventType, GameEventCallback[]> = new Map();
	private _currentPlayer: PlayerName;
	private _currentAction: CurrentGameAction = 'actions_list';

	constructor(
		game: Game,
		hexGridElement: HTMLElement,
		hudElement: HTMLElement,
		players: Array<PlayerConstructor>
	) {
		this._game = game;
		this._grid = this.createGrid();
		this._players = this.createPlayers(players);
		this._terrain = this.createTerrain();
		this._currentPlayer = this.getFirstPlayerName();
		this._renderer = new Renderer(this, hexGridElement, hudElement);
		this._terrainDeck = TerrainsDecks;
	}

	get currentAction(): CurrentGameAction {
		return this._currentAction;
	}

	get grid(): Grid<Hex> {
		return this._grid;
	}

	get players(): Map<string, Player> {
		return this._players;
	}

	get terrain(): Array<TerrainTile> {
		return this._terrain;
	}

	public start() {
		if (this.started) {
			throw new Error('Game already running.');
		}
		this.started = true;

		this._currentAction = 'actions_list';
		this.getFirstPlayer().play();

		this.tick();
	}

	public click(e: MouseEvent) {
		this.checkGameIsRunning();

		switch (this._currentAction) {
			case 'actions_list':
			case 'fight':
			case 'activate_zone':
				// Usually nothing to do, as it is handled by HUD.
				break;
			case 'move':
				this.moveCurrentPlayerTo(this.getHexFromMouseEvent(e));
				break;
		}
	}

	public mouseMove(e: MouseEvent) {
		this.checkGameIsRunning();

		switch (this._currentAction) {
			case 'actions_list':
			case 'activate_zone':
			case 'fight':
				this._renderer.updateHoverPositions([]);
				break;
			case 'move':
				this.hoverCurrentPlayerPath(this.getHexFromMouseEvent(e));
				break;
		}
	}

	public playerCanFight(player: Player) {
		let canFight = false;

		this._foes.forEach((foe: Foe) => {
			if (foe.position.toString() === player.position.toString()) {
				canFight = true;
			}
		});

		return canFight;
	}

	public playerCanActivateZone(player: Player) {
		let canActivate = false;

		this._terrain.forEach((terrain: TerrainTile) => {
			if (terrain.position.toString() === player.position.toString()) {
				canActivate = player.canActivateZone(terrain);
			}
		});

		return canActivate;
	}

	public getCurrentPlayer(): Player {
		this.checkGameIsRunning();

		const player = this._players.get(this._currentPlayer);

		if (!player) {
			throw new Error('Unrecoverable error: cannot find current player.');
		}

		return player;
	}

	public getPlayerZone(player: Player): TerrainTile {
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

	public on(eventType: GameEventType, callback: GameEventCallback): void {
		const listeners = this.eventListeners.get(eventType) || [];
		listeners.push(callback);

		this.eventListeners.set(eventType, listeners);
	}

	public changeCurrentActionState(state: CurrentGameAction) {
		this._currentAction = state;
		this.tick();
	}

	public playerExecuteAction(player: Player, action: ZoneActivation) {
		switch (action.name) {
			case "repair_village":
				alert('TODO: repair village');
				break;
			case "build_barricade":
				alert('TODO: build barricade');
				break;
			case "heal_self":
				player.healAt(this.getPlayerZone(player));
				break;
			case "gather_food":
				player.gatherFoodAt(this.getPlayerZone(player));
				break;
			case "gather_wood":
				player.gatherWoodAt(this.getPlayerZone(player));
				break;
			case "gather_minerals":
				player.gatherMineralsAt(this.getPlayerZone(player));
				break;
		}

		this.tick();
	}

	private playerCanMoveOrExplore(player: Player, hexCoordinates: Hex) {
		return (
			(!this.hexContainsTerrain(hexCoordinates) && player.canExplore(hexCoordinates)) ||
			(this.hexContainsTerrain(hexCoordinates) && player.canMoveTo(hexCoordinates))
		);
	}

	private getHexFromMouseEvent(e: MouseEvent) {
		const offsetX = e.offsetX + this._renderer.getMinX();
		const offsetY = e.offsetY + this._renderer.getMinY();

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

		this._renderer.draw(() =>
			this.dispatch('tick', new TickEvent(this._game, this, this._renderer))
		);
	}

	private getNextPlayer(currentPlayer: PlayerName): PlayerName {
		const firstPlayerName = this.getFirstPlayerName();
		const entries = this._players.entries();
		this._players.forEach((p: Player) => {
			p.stopPlaying();
		});

		let found = false;

		do {
			const entry = entries.next();
			if (entry.done) {
				// Last item, no value here
				this._currentPlayer = firstPlayerName;
				this.getFirstPlayer().play();
				return this._currentPlayer;
			}

			const player: Player = entry.value[1];

			if (found) {
				this._currentPlayer = player.name;
				player.play();
				return this._currentPlayer;
			}

			if (player.name === currentPlayer) {
				// Set flag to "true" so *next iteration* will set next player.
				// If next iteration is empty (thus current iteration = last item),
				//   then next player is the first player in the list.
				found = true;
			}
		} while (true);
	}

	private checkGameIsRunning() {
		if (!this.started) {
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
			const player = new Player(
				playerConstructor.name,
				i,
				players.length,
				this._grid.createHex([0, 0]),
				this._grid
			);
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

	private createNewTerrainAt(hexCoordinates: Hex) {
		// Pop one random terrain off the deck.
		const spliceResult = this._terrainDeck.splice(
			Math.floor(Math.random() * this._terrainDeck.length),
			1
		);
		if (!spliceResult.length) {
			throw new Error('Tried to get new terrain but deck is empty.');
		}

		return new TerrainTile(spliceResult[0], hexCoordinates, this._grid);
	}

	private moveCurrentPlayerTo(hexCoordinates: Hex | undefined) {
		this._renderer.updateHoverPositions([]);

		if (!hexCoordinates) {
			return;
		}

		const currentPlayer = this.getCurrentPlayer();

		if (!this.hexContainsTerrain(hexCoordinates)) {
			if (currentPlayer.canExplore(hexCoordinates)) {
				// Exploration
				this._terrain.push(this.createNewTerrainAt(hexCoordinates));
				currentPlayer.explore(hexCoordinates);
				currentPlayer.moveTo(hexCoordinates);
			} else {
				return;
			}
		} else if (currentPlayer.canMoveTo(hexCoordinates)) {
			currentPlayer.moveTo(hexCoordinates);
		} else {
			return;
		}

		this._currentPlayer = this.getNextPlayer(this._currentPlayer);
		this._currentAction = 'actions_list';
		this.tick();
	}

	private hoverCurrentPlayerPath(hexCoordinates: Hex | undefined) {
		const player = this.getCurrentPlayer();

		if (hexCoordinates && this.playerCanMoveOrExplore(player, hexCoordinates)) {
			const hoverList = [
				...this._grid.traverse(line({ start: player.position, stop: hexCoordinates }))
			];
			this._renderer.updateHoverPositions(hoverList);
		}
	}
}

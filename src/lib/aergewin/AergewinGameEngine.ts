import type {PlayerName} from './Player';
import Player, {type PlayerConstructor, PlayerEvent} from './Player';
import {defineHex, Direction, Grid, type Hex, line, Orientation, spiral} from 'honeycomb-grid';
import Renderer from './Renderer';
import type Game from '../game/Game';
import TerrainTile from './TerrainTile';
import type {GameEventCallback, GameEventType} from './Event';
import {DrawEvent, GameEvent} from './Event';

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

	private started: boolean = false;
	private eventListeners: Map<GameEventType, GameEventCallback[]> = new Map();
	private _currentPlayer: PlayerName;

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

		this.getFirstPlayer().activate();

		this._players.forEach((player: Player) => {
			player.on(PlayerEvent.MOVE, () => {
				this._currentPlayer = this.getNextPlayer(this._currentPlayer);
				this._renderer.updateHoverPositions([]);
				this.redraw();
			});
		});

		this.redraw();
	}

	public click(e: MouseEvent) {
		this.checkGameIsRunning();

		const hexCoordinates = this.getHexFromMouseEvent(e);

		if (!hexCoordinates) {
			this._renderer.updateHoverPositions([]);
			return;
		}

		const currentPlayer = this.getCurrentPlayer();

		if (currentPlayer.canExplore(hexCoordinates)) {
			if (!this.hexContainsTerrain(hexCoordinates)) {
				// Exploration
				this._terrain.push(this.createNewTerrainAt(hexCoordinates));
			}
			currentPlayer.moveTo(hexCoordinates);
			return;
		}

		if (currentPlayer.canMoveTo(hexCoordinates)) {
			currentPlayer.moveTo(hexCoordinates);
		}
	}

	public mouseMove(e: MouseEvent) {
		this.checkGameIsRunning();

		const hexCoordinates = this.getHexFromMouseEvent(e);

		if (!hexCoordinates) {
			this._renderer.updateHoverPositions([]);
			return;
		}

		const player = this.getCurrentPlayer();
		if (player.canMoveTo(hexCoordinates)) {
			const hoverList = [
				...this._grid.traverse(line({ start: player.position, stop: hexCoordinates }))
			];
			this._renderer.updateHoverPositions(hoverList);
		}
	}

	private getHexFromMouseEvent(e: MouseEvent) {
		const offsetX = e.offsetX + this._renderer.getMinX();
		const offsetY = e.offsetY + this._renderer.getMinY();

		return this._grid.pointToHex(
			{x: offsetX, y: offsetY},
			{
				allowOutside: false
			}
		);
	}

	public on(eventType: GameEventType, callback: GameEventCallback): void {
		const listeners = this.eventListeners.get(eventType) || [];
		listeners.push(callback);

		this.eventListeners.set(eventType, listeners);
	}

	private redraw() {
		this.checkGameIsRunning();

		this.refreshGrid();

		this._renderer.draw(() =>
			this.dispatch('draw', new DrawEvent(this._game, this, this._renderer.getViewbox()))
		);
	}

	private getNextPlayer(currentPlayer: PlayerName): PlayerName {
		const firstPlayerName = this.getFirstPlayerName();
		const entries = this._players.entries();
		this._players.forEach((p: Player) => {
			p.deactivate();
		});

		let found = false;

		do {
			const entry = entries.next();
			if (entry.done) {
				// Last item, no value here
				this._currentPlayer = firstPlayerName;
				this.getFirstPlayer().activate();
				return this._currentPlayer;
			}

			const player: Player = entry.value[1];

			if (found) {
				this._currentPlayer = player.name;
				player.activate();
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

	private getCurrentPlayer(): Player {
		this.checkGameIsRunning();

		const player = this._players.get(this._currentPlayer);

		if (!player) {
			throw new Error('Unrecoverable error: cannot find current player.');
		}

		return player;
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
		const terrainMap = ['mountain', 'lake', 'forest', 'plains'];

		const terrainType = terrainMap[Math.floor(Math.random() * terrainMap.length)];

		return new TerrainTile(terrainType, hexCoordinates, this._grid);
	}
}

import Player, {type PlayerConstructor} from "./Player";
import type {PlayerName} from "./Player";
import {Grid, type Hex, spiral} from "honeycomb-grid";
import Renderer from "./Renderer";
import {keymap} from "../keymap";
import {PlayerEvent} from "./Player";
import type Game from "../game/Game";
import {defineHex, Orientation, rectangle} from "honeycomb-grid";

export default class AergewinGameEngine {
    public static readonly options = {
        hexSize: 60,
        hexOrientation: Orientation.FLAT,
        baseXMax: 3,
        baseYMax: 3,
    };

    private readonly game: Game;
    private readonly grid: Grid<Hex>;
    private readonly renderer: Renderer;
    private started: boolean = false;
    private players: Map<string, Player>;
    private terrain: Array<object>;

    private currentPlayer: PlayerName;

    constructor(
        game: Game,
        hexGridElement: HTMLElement,
        hudElement: HTMLElement,
        players: Array<PlayerConstructor>,
    ) {
        this.game = game;
        this.grid = this.createGrid();
        this.players = this.createPlayers(players);
        this.currentPlayer = this.getFirstPlayerName();

        this.renderer = new Renderer(this.grid, this.players, hexGridElement, hudElement);

        this.terrain = [];
    }

    public get gridPixelWidth() {
        return this.grid.pixelWidth;
    }

    public get gridPixelHeight() {
        return this.grid.pixelHeight;
    }

    public start() {
        if (this.started) {
            throw new Error('Game already running.');
        }
        this.started = true;

        this.getFirstPlayer().activate();

        this.players.forEach((player: Player) => {
            player.on(PlayerEvent.MOVE, () => {
                this.currentPlayer = this.getNextPlayer(this.currentPlayer);
                this.redraw();
            });
        });

        this.redraw();
    }

    public getCurrentPlayer(): Player {
        this.checkGameIsRunning();

        const player = this.players.get(this.currentPlayer);

        if (!player) {
            throw new Error('Unrecoverable error: cannot find current player.');
        }

        return player;
    }

    public redraw() {
        this.checkGameIsRunning();

        this.renderer.draw();
    }

    public keyDown(key: string) {
        this.checkGameIsRunning();

        const action = keymap[key];

        if (action === undefined) {
            return;
        }

        this.getCurrentPlayer().goToDirection(action);
        this.redraw();
    }

    public click(e: MouseEvent) {
        this.checkGameIsRunning();

        const offsetX = e.offsetX - (this.grid.pixelWidth / 2);
        const offsetY = e.offsetY - (this.grid.pixelHeight / 2);
        const hexCoordinates = this.grid.pointToHex({x: offsetX, y: offsetY}, {
            allowOutside: false,
        });

        if (hexCoordinates) {
            this.getCurrentPlayer().moveTo(hexCoordinates);
        }
    }

    private checkGameIsRunning() {
        if (!this.started) {
            throw new Error('Game not running yet. Have you forgotten to run "game.start()"?');
        }
    }

    public getNextPlayer(currentPlayer: PlayerName): PlayerName {
        const firstPlayerName = this.getFirstPlayerName();
        const entries = this.players.entries();
        this.players.forEach((p: Player) => {
            p.deactivate();
        });

        let found = false;

        do {
            const entry = entries.next();
            if (entry.done) {
                // Last item, no value here
                this.currentPlayer = firstPlayerName;
                this.getFirstPlayer().activate();
                return this.currentPlayer;
            }

            const player: Player = entry.value[1];

            if (found) {
                this.currentPlayer = player.name;
                player.activate();
                return this.currentPlayer;
            }

            if (player.name === currentPlayer) {
                // Set flag to "true" so *next iteration* will set next player.
                // If next iteration is empty (thus current iteration = last item),
                //   then next player is the first player in the list.
                found = true;
            }
        } while (true);

        throw new Error('Unrecoverable error: could not determine next player for current turn.');
    }

    private getFirstPlayer(): Player {
        return this.players.values().next().value;
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
                radius: 2,
            }),
            // rectangle({
            //     width: AergewinGameEngine.options.baseXMax,
            //     height: AergewinGameEngine.options.baseYMax
            // })
        );
    }

    private createPlayers(players: Array<PlayerConstructor>) {
        const map = new Map();

        let i = 1;
        for (const playerConstructor of players) {
            map.set(
                playerConstructor.name,
                new Player(
                    playerConstructor.name,
                    i,
                    players.length,
                    this.grid.createHex([0, 0]),
                    this.grid
                )
            );
            i++;
        }

        return map;
    }
}

import type {Hex} from "honeycomb-grid";
import {Grid, defineHex, rectangle} from "honeycomb-grid";
import Player from "./Player";
import type {PlayerDefinition} from "./PlayerDefinition";
import type {GameOptions} from "./GameOptions";
import {getConfig} from "./GameOptions";
import {getRenderer} from "../renderer/getRenderer";
import type GridRenderer from "../renderer/GridRenderer";
import type {FeatureMode} from "./FeatureMode";
import type {FeatureState} from "./FeatureState";
import {writable, type Writable, type Readable, derived} from "svelte/store";

export default class Game {
    private readonly gameContainerElement: HTMLElement;
    private readonly rendererContainerElement: HTMLElement;
    private readonly _players: Map<string, Player> = new Map();
    private readonly _grid: Grid<Hex>;
    private readonly hexDefinition: typeof Hex;
    private readonly options: GameOptions;
    private readonly renderer: GridRenderer;

    private _currentPlayerStore: Writable<Player|undefined> = writable();
    private _currentFeatureModeStore: Writable<FeatureMode> = writable('default');
    private _currentFeatureStateStore: Writable<FeatureState|undefined> = writable();

    constructor(players: PlayerDefinition[], gameContainerElement: HTMLElement, options?: Partial<GameOptions>) {
        this.options = getConfig(options as GameOptions);

        this.gameContainerElement = gameContainerElement;
        this.gameContainerElement.innerHTML = '';

        this.rendererContainerElement = document.createElement('div');
        this.rendererContainerElement.className = "game_renderer";
        this.gameContainerElement.appendChild(this.rendererContainerElement);

        this.renderer = getRenderer(this, this.options.renderer.type, this.rendererContainerElement, this.options.renderer);

        this.hexDefinition = defineHex({
            dimensions: this.options.hexSize,
            orientation: this.options.hexOrientation,
            origin: 'topLeft'
        });

        this._grid = new Grid(this.hexDefinition, rectangle({
            width: this.options.baseXMax,
            height: this.options.baseYMax
        }));

        players.forEach((playerDefinition: PlayerDefinition) => {
            this._players.set(
                playerDefinition.name,
                new Player(this._grid.createHex([0,0]), this._grid)
            );
        });

        this.renderer.render();

        this.setupEvents();
    }

    get grid(): Grid<Hex> {
        return this._grid;
    }

    get players(): Map<string, Player> {
        return this._players;
    }

    get currentPlayerStore(): Readable<Player|undefined> {
        return derived(this._currentPlayerStore, i => i);
    }

    get currentFeatureModeStore(): Readable<FeatureMode> {
        return derived(this._currentFeatureModeStore, i => i);
    }

    get currentFeatureStateStore(): Readable<FeatureState | undefined> {
        return derived(this._currentFeatureStateStore, i => i);
    }

    private setupEvents() {
        this.gameContainerElement.addEventListener('click', () => console.info('click'));
        this.gameContainerElement.addEventListener('dblclick', () => console.info('dblclick'));
        this.gameContainerElement.addEventListener('mousedown', () => console.info('mousedown'));
        this.gameContainerElement.addEventListener('mouseup', () => console.info('mouseup'));
        this.gameContainerElement.addEventListener('mousemove', () => console.info('mousemove'));
        this.gameContainerElement.ownerDocument.addEventListener('keydown', () => console.info('keydown'));
        this.gameContainerElement.ownerDocument.addEventListener('keyup', () => console.info('keyup'));
        this.gameContainerElement.ownerDocument.addEventListener('keypress', () => console.info('keypress'));
    }

    start() {
        this._currentFeatureModeStore.set('list_players');
    }
}

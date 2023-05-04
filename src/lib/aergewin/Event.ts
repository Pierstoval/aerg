import type Game from "../game/Game";
import type AergewinGameEngine from "./AergewinGameEngine";
import type Renderer from "./Renderer";
import type {ViewBoxLike} from "@svgdotjs/svg.js";

export type GameEventType = 'draw';

export type GameEventCallback = (e: GameEvent) => void;

export abstract class GameEvent {
    public readonly game: Game;
    public readonly engine: AergewinGameEngine;

    protected constructor(game: Game, engine: AergewinGameEngine) {
        this.game = game;
        this.engine = engine;
    }
}

export class DrawEvent extends GameEvent {
    public readonly viewbox: ViewBoxLike;

    constructor(game: Game, engine: AergewinGameEngine, renderer: Renderer) {
        super(game, engine);
        this.viewbox = renderer.getViewbox();
    }
}

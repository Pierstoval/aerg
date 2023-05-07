import type Game from '../game/Game';
import type AergewinGameEngine from './AergewinGameEngine';
import type Renderer from './Renderer';

export type GameEventType = 'tick';

export type GameEventCallback = (e: GameEvent) => void;

export abstract class GameEvent {
	public readonly game: Game;
	public readonly engine: AergewinGameEngine;

	protected constructor(game: Game, engine: AergewinGameEngine) {
		this.game = game;
		this.engine = engine;
	}
}

export class TickEvent extends GameEvent {
	public readonly renderer: Renderer;

	constructor(game: Game, engine: AergewinGameEngine, renderer: Renderer) {
		super(game, engine);
		this.renderer = renderer;
	}
}

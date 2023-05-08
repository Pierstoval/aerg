import type SceneManager from '../game/SceneManager';
import type AergewinGameEngine from './AergewinGameEngine';
import type Renderer from './Renderer';

export type GameEventType = 'tick';

export type GameEventCallback = (e: GameEvent) => void;

export abstract class GameEvent {
	public readonly game: SceneManager;
	public readonly engine: AergewinGameEngine;

	protected constructor(game: SceneManager, engine: AergewinGameEngine) {
		this.game = game;
		this.engine = engine;
	}
}

export class TickEvent extends GameEvent {
	public readonly renderer: Renderer;

	constructor(game: SceneManager, engine: AergewinGameEngine, renderer: Renderer) {
		super(game, engine);
		this.renderer = renderer;
	}
}

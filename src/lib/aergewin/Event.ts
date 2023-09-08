import type SceneManager from '../SceneManagement/SceneManager';
import type AergewinGameEngine from './AergewinGameEngine';
import type RendererInterface from './rendering/RendererInterface';

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
	public readonly renderer: RendererInterface;

	constructor(game: SceneManager, engine: AergewinGameEngine, renderer: RendererInterface) {
		super(game, engine);
		this.renderer = renderer;
	}
}

import type SceneManager from '../SceneManagement/SceneManager';
import type AergewinGameEngine from './AergewinGameEngine';
import type RendererInterface from './rendering/RendererInterface';

export type GameEventType = 'tick';

export type GameEventCallback = (e: GameEvent) => void;

export abstract class GameEvent {
	public readonly engine: AergewinGameEngine;

	protected constructor(engine: AergewinGameEngine) {
		this.engine = engine;
	}
}

export class TickEvent extends GameEvent {
	public readonly renderer: RendererInterface;

	constructor(engine: AergewinGameEngine, renderer: RendererInterface) {
		super(engine);
		this.renderer = renderer;
	}
}

import { writable, type Writable } from 'svelte/store';
import type { SceneManagerOptions } from './SceneManagerOptions';
import { getConfig } from './SceneManagerOptions';
import type { SceneConstructor, SceneInstance } from './Scene';

export default class SceneManager {
	private readonly gameContainerElement: HTMLElement;
	private readonly _options: SceneManagerOptions;

	private _currentSceneStore: Writable<SceneConstructor> = writable();

	private _scenesCache: Map<SceneConstructor, SceneInstance> = new Map();

	constructor(gameContainerElement: HTMLElement, options: Partial<SceneManagerOptions>) {
		this._options = getConfig(options);

		this.gameContainerElement = gameContainerElement;
		this.gameContainerElement.innerHTML = '';

		this._currentSceneStore.set(this._options.defaultScene);
		this._currentSceneStore.subscribe((scene: SceneConstructor | undefined) => {
			if (!scene) {
				console.warn('Set an empty scene in the scene store.');
				return;
			}
			this.renderSceneInternal(scene);
		});
	}

	get options(): SceneManagerOptions {
		return { ...this._options };
	}

	public renderScene(scene: SceneConstructor) {
		this._currentSceneStore.set(scene);
	}

	private renderSceneInternal(scene: SceneConstructor) {
		const existingInstance = this._scenesCache.get(scene);
		if (existingInstance) {
			return existingInstance;
		}

		const sceneInstance: SceneInstance = new scene({
			target: this.gameContainerElement,
			hydrate: true,
			props: {
				game: this
			}
		});
		this._scenesCache.set(scene, sceneInstance);
	}
}

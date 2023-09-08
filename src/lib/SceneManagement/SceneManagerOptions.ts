import type { SceneConstructor } from './Scene';
import DefaultScene from './components/DefaultScene.svelte';

export type SceneManagerOptions = {
	gameContainerElement: HTMLElement;
	defaultScene: SceneConstructor;
};

export function getConfig(options?: Partial<SceneManagerOptions>): SceneManagerOptions {
	return Object.assign(defaults(), options || {});
}

function defaults(): SceneManagerOptions {
	return {
		defaultScene: DefaultScene
	} as SceneManagerOptions;
}

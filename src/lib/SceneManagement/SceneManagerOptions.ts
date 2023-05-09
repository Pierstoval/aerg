import type { SceneConstructor } from './Scene';
import DefaultScene from './components/DefaultScene.svelte';

export type SceneManagerOptions = {
	defaultScene: SceneConstructor;
};

export function getConfig(options: Partial<SceneManagerOptions>): SceneManagerOptions {
	const finalOptions = Object.assign(defaults(), options);

	return finalOptions as SceneManagerOptions;
}

function defaults(): Partial<SceneManagerOptions> {
	return {
		defaultScene: DefaultScene
	} as SceneManagerOptions;
}

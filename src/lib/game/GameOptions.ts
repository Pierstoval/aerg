import type { SceneConstructor } from './Scene';
import DefaultScene from './components/DefaultScene.svelte';

export type GameOptions = {
	defaultScene: SceneConstructor;
};

export function getConfig(options: Partial<GameOptions>): GameOptions {
	const finalOptions = Object.assign(defaults(), options);

	return finalOptions as GameOptions;
}

function defaults(): Partial<GameOptions> {
	return {
		defaultScene: DefaultScene
	} as GameOptions;
}

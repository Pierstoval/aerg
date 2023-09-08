import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import SceneManager from '$lib/SceneManagement/SceneManager';
import { initLocale } from '$lib/i18n';
import AergewinGameEngine from '$lib/aergewin/AergewinGameEngine';
import { FakeRendererFactory } from '$lib/aergewin/rendering/FakeRenderer';
import { Window } from 'happy-dom';
import DefaultScene from '$lib/SceneManagement/components/DefaultScene.svelte';

describe('GameHexBoard', () => {
	let gameEngine: AergewinGameEngine;

	const window = new Window({
		url: 'https://localhost:8080',
		width: 1024,
		height: 768
	});
	const document = window.document;
	const sceneContainer = document.createElement('div');

	const players = [
		// { name: 'Alex' },
		// { name: 'Hélène' },
		// { name: 'Aidan' },
		// { name: 'Jillian' },
		{ name: 'Jane' },
		{ name: 'John' },
		{ name: 'Ella' },
		{ name: 'Mario' }
	];

	beforeEach(() => {
		initLocale();
		const sceneManager = new SceneManager(sceneContainer as unknown as HTMLElement, {
			defaultScene: DefaultScene
		});
		const rendererFactory = new FakeRendererFactory();
		gameEngine = new AergewinGameEngine(sceneManager, rendererFactory, players);
	});

	it('is a game', () => {
		expect(gameEngine).toBeDefined();
	});
});

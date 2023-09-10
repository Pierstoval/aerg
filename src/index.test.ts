import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initLocale } from '$lib/i18n';
import AergewinGameEngine from '$lib/aergewin/AergewinGameEngine';
import { FakeRendererFactory } from '$lib/aergewin/rendering/FakeRenderer';

describe('Game engine', () => {
	let gameEngine: AergewinGameEngine;
	const players = [{ name: 'Jane' }, { name: 'John' }, { name: 'Ella' }, { name: 'Mario' }];

	beforeEach(() => {
		initLocale();
		const rendererFactory = new FakeRendererFactory();
		gameEngine = new AergewinGameEngine(rendererFactory, players);
	});

	it('is instantiated', () => {
		expect(gameEngine).toBeDefined();
	});

	it('has an empty default state when not started', () => {
		expect(() => gameEngine.currentPlayer).toThrow('Game not running yet. Have you forgot');
	});

	it('can be started and have a base game turn', () => {
		gameEngine.start();
		const player = gameEngine.currentPlayer;
		expect(player).toBeDefined();
		expect(player.name).toBe('Jane');
		expect(player.actionsSpent).toBe(0);
		expect(player.index).toBe(1);
		expect(gameEngine.getPlayerZone(player).type).toBe('village');

		// FIXME TODO: fix this which is false when tested
		// console.info(player);
		expect(player.isActive).toBe(true);
	});
});

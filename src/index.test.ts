import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initLocale } from '$lib/i18n';
import AergewinGameEngine from '$lib/aergewin/AergewinGameEngine';
import { FakeRendererFactory } from '$lib/aergewin/rendering/FakeRenderer';

describe('Game engine', () => {
	let game: AergewinGameEngine;
	const players = [
		{ name: 'Jane' }, // First player
		{ name: 'John' },
		{ name: 'Ella' },
		{ name: 'Mario' }
	];

	beforeEach(() => {
		initLocale();
		const rendererFactory = new FakeRendererFactory();
		game = new AergewinGameEngine(rendererFactory, players);
	});

	it('is instantiated', () => {
		expect(game).toBeDefined();
	});

	it('has an empty default state when not started', () => {
		expect(() => game.currentPlayer).toThrow('Game not running yet. Have you forgot');
	});

	it('has the right state at start', async () => {
		await game.start();

		expect(game.isRunning).toBe(true);
		expect(game.currentTurn).toBe(1);
		expect(game.currentTurnFirstPlayer).toBe(players[0].name);
	});

	it('has the right village state at start', async () => {
		await game.start();

		const village = game.village;
		expect(village).toBeDefined();
		expect(Array.from(village.inventory.values())).toStrictEqual([]);
		expect(village.hp).toBe(10);
	});

	it('has the right first player at start', async () => {
		await game.start();

		const player = game.currentPlayer;
		expect(player).toBeDefined();
		expect(player.name).toBe(players[0].name);
		expect(player.actionsSpent).toBe(0);
		expect(player.index).toBe(1);
		expect(game.getPlayerZone(player).type).toBe('village');
		expect(player.isActive).toBe(true);
	});
});

import { describe, it, expect, beforeEach, type TestOptions } from 'vitest';
import AergewinGameEngine from '$lib/aergewin/AergewinGameEngine';
import { FakeRendererFactory } from '$lib/aergewin/rendering/NoOutputRenderer';
import ConfigurableRandomnessProvider from '$lib/aergewin/random/ConfigurableRandomnessProvider';
import { getEventIndexByName } from '$lib/aergewin/GameData';
import { defaultGameConfiguration, defaultTerrain } from '$lib/aergewin/GameConfiguration';
import type { TerrainConstructor } from '$lib/aergewin/TerrainTile';
import type { PlayerConstructor } from '$lib/aergewin/entities/Player';

const testOpts: TestOptions = {
	repeats: parseInt(process.env.REPEAT || '1')
};

describe(
	'Game engine',
	() => {
		let randomnessProvider: ConfigurableRandomnessProvider;
		let game: AergewinGameEngine;

		let customTerrain: Array<TerrainConstructor> = [];

		let customPlayers: Array<PlayerConstructor> = [];
		const defaultPlayers = () => [
			{ name: 'Jane' }, // First player
			{ name: 'John' },
			{ name: 'Ella' },
			{ name: 'Mario' }
		];

		beforeEach(() => {
			randomnessProvider = new ConfigurableRandomnessProvider();

			const config = defaultGameConfiguration();
			config.players = customPlayers.length ? customPlayers : defaultPlayers();
			config.visibleTerrain = customTerrain.length ? customTerrain : defaultTerrain();

			game = new AergewinGameEngine(new FakeRendererFactory(), randomnessProvider, config);
			customTerrain = [];
			customPlayers = [];
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
			expect(game.currentTurnFirstPlayer).toBe(defaultPlayers()[0].name);
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
			expect(player.name).toBe(defaultPlayers()[0].name);
			expect(player.actionsSpent).toBe(0);
			expect(player.index).toBe(1);
			expect(game.getPlayerZone(player).type).toBe('village');
			expect(player.isActive).toBe(true);
		});

		it('has a configured negative event at start', async () => {
			const eventName = 'Blizzard';
			randomnessProvider.addNextNumberForKey('new_daily_event', getEventIndexByName(eventName));

			await game.start();

			const events = game.currentEvents;
			expect(events.length).toBe(1);
			const event = events[0];
			expect(event).toBeDefined();
			expect(event.type).toBe('malus');
			expect(event.name).toBe(eventName);
		});

		it('has a configured positive event at start', async () => {
			const eventName = 'Beau temps';
			randomnessProvider.addNextNumberForKey('new_daily_event', getEventIndexByName(eventName));

			await game.start();

			const events = game.currentEvents;
			expect(events.length).toBe(1);
			const event = events[0];
			expect(event).toBeDefined();
			expect(event.type).toBe('bonus');
			expect(event.name).toBe(eventName);
		});

		it('has a first player that can move to default forest', async () => {
			await game.start();

			expect(game.currentPlayer.position.toString()).toBe('(0,0)');
			game.moveCurrentPlayerTo(game.grid.getHex([0, -1]));
			expect(game.currentPlayer.name).toBe(defaultPlayers()[1].name);
			game.goToNextPlayer();
			expect(game.currentPlayer.name).toBe(defaultPlayers()[2].name);
			game.goToNextPlayer();
			expect(game.currentPlayer.name).toBe(defaultPlayers()[3].name);
			game.goToNextPlayer();
			expect(game.currentPlayer.name).toBe(defaultPlayers()[0].name);
			expect(game.currentPlayer.position.toString()).toBe('(0,-1)');
			expect(game.currentPlayer.actionsSpent).toBe(1);
		});

		it('makes user take damage with one-off event', async () => {
			customPlayers = defaultPlayers();
			customPlayers[0].position = [1, 0]; // Mountain

			const eventName = 'Chute de pierres';
			randomnessProvider.addNextNumberForKey('new_daily_event', getEventIndexByName(eventName));

			await game.start();
		});

		/*
		it('has a first player whose first move is free based on the "Beau temps" event', async () => {
			const eventName = 'Beau temps';
			randomnessProvider.addNextNumberForKey('new_daily_event', getEventIndexByName(eventName));

			await game.start();

			game.moveCurrentPlayerTo(game.grid.getHex([0, -1]));
			game.goToNextPlayer();
			game.goToNextPlayer();
			game.goToNextPlayer();
			expect(game.currentPlayer.position.toString()).toBe('(0,-1)');
			expect(game.currentPlayer.actionsSpent).toBe(0);
		});
		*/
	},
	testOpts
);

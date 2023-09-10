import { describe, it, expect, beforeEach } from 'vitest';
import AergewinGameEngine from '$lib/aergewin/AergewinGameEngine';
import { FakeRendererFactory } from '$lib/aergewin/rendering/NoOutputRenderer';
import ConfigurableRandomnessProvider from '$lib/aergewin/random/ConfigurableRandomnessProvider';
import { DailyEventsDeck } from '$lib/aergewin/GameData';

function getEventIndexByName(name: string): number {
	for (let i = 0; i < DailyEventsDeck.length; i++) {
		const dailyEvent = DailyEventsDeck[i];
		if (dailyEvent.name === name) {
			return i;
		}
	}

	throw new Error(`Could not find event by name "${name}".`);
}

describe('Game engine', () => {
	let randomnessProvider: ConfigurableRandomnessProvider;
	let game: AergewinGameEngine;

	const players = [
		{ name: 'Jane' }, // First player
		{ name: 'John' },
		{ name: 'Ella' },
		{ name: 'Mario' }
	];

	beforeEach(() => {
		randomnessProvider = new ConfigurableRandomnessProvider();
		const rendererFactory = new FakeRendererFactory();
		game = new AergewinGameEngine(rendererFactory, randomnessProvider, players);
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
});

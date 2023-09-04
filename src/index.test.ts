import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import GameHexBoard from '$lib/scenes/GameHexBoard.svelte';
import SceneManager from '$lib/SceneManagement/SceneManager';
import MainMenu from '$lib/scenes/MainMenu.svelte';
import { initLocale } from '$lib/i18n';
import { Window } from 'happy-dom';
describe('GameHexBoard', () => {
	let hexBoardElement: HTMLElement;

	beforeEach(() => {
		const window = new Window({
			url: 'https://localhost:8080',
			width: 1024,
			height: 768
		});
		const document = window.document;
		initLocale();
		hexBoardElement = document.createElement('div');
		const game = new SceneManager(document.createElement('div'), {
			defaultScene: MainMenu
		});
		new GameHexBoard({
			props: {
				game: game
			},
			target: hexBoardElement
		});
	});

	it('mounting component is working', () => {
		expect(hexBoardElement.children.length).toBe(1);
		const gameContainer = hexBoardElement.children[0];
		expect(gameContainer.id).toBe('game-container');

		expect(gameContainer.children.length).toBe(1);
		const boardContainer = gameContainer.children[0];
		expect(boardContainer.id).toBe('board-container');

		expect(boardContainer.children.length).toBe(2);
		const hud = boardContainer.children[0];
		expect(hud.id).toBe('HUD');
		const board = boardContainer.children[1];
		expect(board.id).toBe('board');

		expect(board.children.length).toBe(1);
		const grid = board.children[0];
		expect(grid.id).toBe('hexGrid');

		expect(grid.children.length).toBe(1);
		// const svg = grid.children[0];
		// expect(svg.getAttribute('version')).toBe('1.1');
		// expect(svg.children.length).toBe(4);
		// expect(hexBoardElement.querySelector('div#ZZZZZZZZZZ')).toBeDefined();
		// expect(hexBoardElement.querySelector('div#HUD')).toBeDefined();
		// expect(hexBoardElement.querySelector('div#board')).toBeDefined();
		// expect(hexBoardElement.querySelector('div#board div#hexGrid')).toBeDefined();
		// expect(hexBoardElement.querySelector('div#board div#hexGrid svg')).toBeDefined();
		// expect(hexBoardElement.querySelector('div#board div#hexGrid svg g.grid')).toBeDefined();
		// expect(hexBoardElement.querySelector('div#board div#hexGrid svg g.terrain')).toBeDefined();
		// expect(hexBoardElement.querySelector('div#board div#hexGrid svg g.players')).toBeDefined();
		// expect(hexBoardElement.querySelector('div#board div#hexGrid svg g.player-position')).toBeDefined();
		// expect(hexBoardElement.querySelector('div#board div#hexGrid svg g.hover')).toBeDefined();
	});

	// it('grid svg groups are in the proper order ', () => {
	// 	const groups = hexBoardElement.querySelectorAll('div#board div#hexGrid svg g');
	//
	// 	console.info('groups', groups);
	//
	// 	expect(groups[0]).toBeDefined();
	// 	expect(groups[0]).toContain('grid');
	//
	// 	expect(groups[1]).toBeDefined();
	// 	expect(groups[1]).toContain('terrain');
	//
	// 	expect(groups[2]).toBeDefined();
	// 	expect(groups[2]).toContain('players');
	//
	// 	expect(groups[3]).toBeDefined();
	// 	expect(groups[3]).toContain('player-position');
	//
	// 	expect(groups[4]).toBeDefined();
	// 	expect(groups[4]).toContain('hover');
	// });
});

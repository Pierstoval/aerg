<script lang="ts">
	import { onMount } from 'svelte';
	import AergewinGameEngine from '../aergewin/AergewinGameEngine';
	import type SceneManager from '../SceneManagement/SceneManager';
	import type { TickEvent, GameEvent, GameEventCallback } from '../aergewin/Event';
	import DefaultSvgRenderer, {SvgRendererFactory} from "$lib/aergewin/rendering/DefaultSvgRenderer";

	export let game: SceneManager;

	let gameEngine: AergewinGameEngine;
	let hexGridElement: HTMLElement;
	let hudElement: HTMLElement;

	let pixelWidth = 0;
	let pixelHeight = 0;

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

	function start() {
		const rendererFactory = new SvgRendererFactory(hexGridElement, hudElement);
		gameEngine = new AergewinGameEngine(game, rendererFactory, players);

		gameEngine.on('tick', function (e: TickEvent): void {
			const viewbox = e.renderer.getViewbox();
			pixelWidth = viewbox.width;
			pixelHeight = viewbox.height;
		} as GameEventCallback);

		gameEngine.start();

		window.gameEngine = gameEngine;
	}

	onMount(() => {
		start();
	});

	const clickGrid = (e: MouseEvent) => gameEngine.click(e);
	const mouseMoveGrid = (e: MouseEvent) => gameEngine.mouseMove(e);
</script>

<div id="game-container">
	<div id="board-container">
		<div id="HUD" bind:this={hudElement} />
		<div id="board" style="--board-width: {pixelWidth}px; --board-height: {pixelHeight}px;">
			<!-- svelte-ignore a11y -->
			<div
				id="hexGrid"
				bind:this={hexGridElement}
				on:click={clickGrid}
				on:mousemove={mouseMoveGrid}
			>
				…
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	#game-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 100%;
		z-index: 0;
	}
	#board-container {
		z-index: 2;
	}
	#board {
		z-index: 3;
		position: relative;
		top: 0;
		left: 0;
		outline: solid 1px #ddd;
		width: var(--board-width);
		height: var(--board-height);
		min-width: var(--board-width);
		min-height: var(--board-height);
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
		& > * {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
		}
	}
	#HUD {
		z-index: 4;
		position: fixed;
		top: 1rem;
		left: 1rem;
	}
</style>

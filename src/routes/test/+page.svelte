<script lang="ts">
	import { SVG } from '@svgdotjs/svg.js';
	import { defineHex, Grid, rectangle, Orientation, Hex, hexToPoint } from 'honeycomb-grid';
	import Player from '../../lib/game/Player';
	import { onMount } from 'svelte';
	import { PlayerEvent } from '../../lib/game/Player';

	let hexGridElement: HTMLElement;

	const orientation = Orientation.FLAT;
	const hexSize = 50;
	const xMax = 4;
	const yMax = 3;

	let svgContainer: SVG;
	let player: Player;
	let playerPosition: Hex;
	let hexDefinition;
	let grid: Grid<Hex>;

	$: hexDefinition = defineHex({
		dimensions: hexSize,
		orientation: orientation,
		origin: 'topLeft'
	});
	$: grid = new Grid(hexDefinition, rectangle({ width: xMax, height: yMax }));
	$: player = new Player(grid.createHex([0, 0]), grid);
	$: playerPosition = player.position;

	onMount(() => {
		if (!hexDefinition || !grid) {
			return;
		}

		// Clear the board
		for (const child of hexGridElement.children) {
			hexGridElement.removeChild(child);
		}

		player.on(PlayerEvent.MOVE, function () {
			redraw();
		});

		svgContainer = SVG().addTo(hexGridElement).size('100%', '100%');

		redraw();
	});

	function onKeyDown(e) {
		player.keyDown(e.keyCode);
		playerPosition = player.position;
	}

	function redraw() {
		svgContainer.clear();

		grid.forEach(function (hex: Hex) {
			const polygon = svgContainer
				// create a polygon from a hex's corner points
				.polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
				.fill('none')
				.stroke({ width: 2, color: '#999' });

			return svgContainer.group().add(polygon);
		});

		let playerPoint = hexToPoint(player.position);
		svgContainer.text('🧙‍♂️').move(playerPoint.x, playerPoint.y).fill('#f00');
	}
</script>

<svelte:window on:keydown={onKeyDown} />

<div id="controls">
	<div>
		Current character coordinates: <strong>{playerPosition.toString()}</strong>
	</div>
</div>

<div id="board-container">
	<div id="board" style="--board-width: {grid.pixelWidth}px; --board-height: {grid.pixelHeight}px;">
		<div id="hexGrid" bind:this={hexGridElement} />
		<div id="charactersOverlay">
			<!--			<PlayerDisplay {player} />-->
		</div>
	</div>
</div>

<style lang="scss">
	#controls {
		z-index: 100;
		position: absolute;
		top: 0;
		left: 0;
		padding: 1rem;
		font-family: 'Fira Code', monospace;
		#control-content {
			display: none;
			&.show {
				display: block;
			}
		}
	}
	#board-container {
		z-index: 0;
		position: relative;
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		#board {
			z-index: 1;
			position: relative;
			width: var(--board-width);
			height: var(--board-height);
			min-width: var(--board-width);
			min-height: var(--board-height);
			& > * {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
			}
		}
	}
</style>

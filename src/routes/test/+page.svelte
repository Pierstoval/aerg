<script lang="ts">
	import HexagonalShape from '$lib/tiling/components/HexagonalShape.svelte';
	import Tileset from '$lib/tiling/Tileset';

	import PlayerDisplay from '$lib/PlayerDisplay.svelte';
	import Player from '$lib/Player';
	import { PlayerEvent } from '$lib/Player';
	import { onMount } from 'svelte';
	import HexagonalCoordinateSystem, {
		HexagonalAngle,
		HexagonalCoordinatePositioning
	} from '$lib/tiling/HexagonalCoordinateSystem';

	let hexagonalAngle = HexagonalAngle.pointy;
	let hexagonalPositioning = HexagonalCoordinatePositioning.oddRow;

	let showControls = true;

	let hexSize = 30;
	let xMax = 8;
	let yMax = 6;

	$: tileset = new Tileset(
		hexSize,
		xMax,
		yMax,
		new HexagonalCoordinateSystem(hexagonalAngle, hexagonalPositioning)
	);
	$: player = new Player(Math.ceil(xMax / 2), Math.ceil(yMax / 2), tileset);

	let playerX: number = 0;
	let playerY: number = 0;

	onMount(() => {
		playerX = player.x;
		playerY = player.y;
		player.on(PlayerEvent.MOVE, () => {
			playerX = player.x;
			playerY = player.y;
		});
	});

	// FIXME: this is wrong yet
	const keymap = {
		97: (p: Player) =>
			hexagonalAngle === HexagonalAngle.pointy ? p.moveDownLeft() : p.moveDownLeft(), // numpad1
		98: (p: Player) => (hexagonalAngle === HexagonalAngle.pointy ? null : p.moveDown()), // numpad2
		99: (p: Player) => (hexagonalAngle === HexagonalAngle.pointy ? p.moveDownRight() : null), // numpad3
		100: (p: Player) => (hexagonalAngle === HexagonalAngle.pointy ? p.moveLeft() : p.moveUp()), // numpad4
		102: (p: Player) => (hexagonalAngle === HexagonalAngle.pointy ? p.moveRight() : p.moveRight()), // numpad6
		103: (p: Player) => (hexagonalAngle === HexagonalAngle.pointy ? p.moveLeft() : p.moveUpLeft()), // numpad7
		104: (p: Player) => (hexagonalAngle === HexagonalAngle.pointy ? null : p.moveUp()), // numpad8
		105: (p: Player) => (hexagonalAngle === HexagonalAngle.pointy ? p.moveUpRight() : null) // numpad9
	};

	function onKeyDown(e) {
		if (keymap[e.keyCode]) {
			keymap[e.keyCode](player);
		}
	}
</script>

<svelte:window on:keydown={onKeyDown} />

<div id="controls">
	<button id="control-toggle" type="button" on:click={() => (showControls = !showControls)}
		>Show controls</button
	>
	<div id="control-content" style="display:{showControls ? 'block' : 'none'};">
		<div>Max X: <input type="range" min="2" max="20" step="1" bind:value={xMax} /> ({xMax})</div>
		<div>Max Y: <input type="range" min="2" max="20" step="1" bind:value={yMax} /> ({yMax})</div>
		<div>
			Hex size: <input type="range" min="5" max="100" step="5" bind:value={hexSize} /> ({hexSize})
		</div>
		<div>
			Style: <button type="button" on:click={() => (hexagonalAngle = HexagonalAngle.pointy)}
				>Pointy</button
			><button type="button" on:click={() => (hexagonalAngle = HexagonalAngle.flat)}>Flat</button>
		</div>
		<div>Use the numpad to move your character.</div>
		<div>Current character position: <strong>{playerX}:{playerY}</strong></div>
	</div>
</div>

<div id="board-container">
	<div
		id="board"
		style="
        --board-width: {tileset.boardWidth}px;
        --board-height: {tileset.boardHeight}px;
        --tile-width: {tileset.tileWidth}px;
        --tile-height: {tileset.tileHeight}px;
        --tile-max-x: {tileset.xMax};
        --tile-max-y: {tileset.yMax};
    "
	>
		{#each tileset.board as tiles}
			<div class="tiles_row">
				{#each tiles as tile}
					<HexagonalShape {tile} content={`${tile.x}:${tile.y}`} />
				{/each}
			</div>
		{/each}
		{#key player}
			<PlayerDisplay {player} />
		{/key}
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
			border: solid 1px black;
			.tiles_row {
				width: 100%;
				position: absolute;
				height: calc(var(--tile-height));
			}
		}
	}
</style>

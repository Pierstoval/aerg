<script lang="ts">
	import HexagonalShape from '$lib/tiling/components/HexagonalShape.svelte';
	import Tileset from '$lib/tiling/Tileset';

	import PlayerDisplay from '$lib/PlayerDisplay.svelte';
	import Player from '$lib/Player';
	import HexStyle from '$lib/tiling/HexStyle';

	let hexSize = 30;
	let xMax = 6;
	let yMax = 6;

	const tileset = new Tileset(hexSize, xMax, yMax, HexStyle.flat);
	const player1 = new Player(0, 0, tileset);
</script>

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
					<HexagonalShape {tile} />
				{/each}
			</div>
		{/each}
		{#key player1}
			<PlayerDisplay player={player1} />
		{/key}
	</div>
</div>

<style lang="scss">
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

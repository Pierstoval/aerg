<script lang="ts">
    import TileShape from "$lib/tiling/components/TileShape.svelte";
    import HexStyle, {defaultHexStyle} from "$lib/tiling/HexStyle";
    import Tileset from "$lib/tiling/Tileset";

    import PlayerDisplay from "$lib/components/PlayerDisplay.svelte";
    import Player from "$lib/Player";

    let style = defaultHexStyle();

    let showControls = true;

    let hexSize = 30;
    let xMax = 8;
    let yMax = 6;

    $: tileset = new Tileset(hexSize, xMax, yMax, style);
    $: player = new Player(Math.ceil(xMax / 2), Math.ceil(yMax / 2), tileset);

    function onKeyDown(e) {
        switch(e.keyCode) {
            case 38:
                player.moveUp();
                break;
            case 40:
                player.moveDown();
                break;
            case 37:
                player.moveLeft();
                break;
            case 39:
                player.moveRight();
                break;
        }
    }
</script>


<svelte:window on:keydown={onKeyDown} />

<div id="controls">
    <button id="control-toggle" type="button" on:click={() => showControls = !showControls}>Show controls</button>
    <div id="control-content" style="display:{showControls ? 'block' : 'none'};">
        <div>Max X: <input type="range" min="2" max="20" step="1" bind:value={xMax}> ({xMax})</div>
        <div>Max Y: <input type="range" min="2" max="20" step="1" bind:value={yMax}> ({yMax})</div>
        <div>Hex size: <input type="range" min="5" max="100" step="5" bind:value={hexSize}> ({hexSize})</div>
        <div>Style: <button type="button" on:click={() => style = HexStyle.pointy}>Pointy</button><button type="button" on:click={() => style = HexStyle.flat}>Flat</button></div>
    </div>
</div>

<div id="board-container">
    <div id="board" style="
        --board-width: {tileset.boardWidth}px;
        --board-height: {tileset.boardHeight}px;
        --tile-width: {tileset.tileWidth}px;
        --tile-height: {tileset.tileHeight}px;
        --tile-max-x: {tileset.xMax};
        --tile-max-y: {tileset.yMax};
    ">
        {#each tileset.board as tiles}
            <div class="tiles_row">
                {#each tiles as tile}
                    <TileShape {tile} />
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
        .control-content {
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

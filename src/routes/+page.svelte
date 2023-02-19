<script lang="ts">
    import Tile from "$lib/Tile";
    import TileComponent from "$lib/components/Tile.svelte";
    import {HexStyle, defaultHexStyle} from "$lib/HexStyle";
    import Player from "$lib/Player";

    // Using "pointy top" style, the "hex size" or "hex diameter" is the height.
    // Using "flat" hex style, the "hex size" or "hex diameter" is the actual width.
    let style = defaultHexStyle();

    let showControls = true;

    let hexSize = 30;
    let xMax = 8;
    let yMax = 6;

    const precision = 5;

    const calculatedPrecision = Math.pow(10, precision);

    function applyPrecision(number: number): number {
        return Math.round((number + Number.EPSILON) * calculatedPrecision) / calculatedPrecision;
    }

    function buildTiles(xMax: number, yMax: number, tileWidth: number, tileHeight: number, hexStyle: HexStyle|undefined): Tile[]
    {
        if (!hexStyle) {
            hexStyle = defaultHexStyle();
        }
        let allTiles = [];

        for (let y = 0; y < yMax; y++) {
            let tiles = [];
            for (let x = 0; x < xMax; x++) {
                let tile: Tile = new Tile(x, y, tileWidth, tileHeight, hexStyle);
                tiles.push(tile);
            }
            allTiles.push(tiles);
        }

        return allTiles;
    }


    $: verticesDiameter = applyPrecision(hexSize * 3 / 2);
    $: edgesDiameter = applyPrecision(hexSize * Math.sqrt(3));

    $: tileHeight = (style === HexStyle.pointy ? edgesDiameter : verticesDiameter);
    $: tileWidth = (style === HexStyle.pointy ? verticesDiameter : edgesDiameter);

    $: boardWidth = style === HexStyle.pointy
        ? (xMax * tileWidth + (tileWidth / 2))
        : (xMax * (tileWidth * 0.75) + (tileWidth * 0.25))
    ;
    $: boardHeight = style === HexStyle.pointy
        ? (yMax * (tileHeight * 0.75) + (tileHeight * 0.25))
        : (yMax * tileHeight + (tileHeight / 2) )
    ;

    $: player = new Player(Math.ceil(xMax / 2), Math.ceil(yMax / 2));

    // 1st level: rows, 2nd level: row cells
    $: board = buildTiles(xMax, yMax, tileWidth, tileHeight, style);
</script>

<div id="controls">
    <button id="control-toggle" type="button" on:click={() => showControls = !showControls}>Show controls</button>
    <div id="control-content" style="display:{showControls ? 'block' : 'none'};">
        <div>Max X: <input type="range" min="2" max="20" step="1" bind:value={xMax}> ({xMax})</div>
        <div>Max Y: <input type="range" min="2" max="20" step="1" bind:value={yMax}> ({yMax})</div>
        <div>Hex size: <input type="range" min="5" max="100" step="5" bind:value={hexSize}> ({hexSize})</div>
        <div>Style: <button type="button" on:click={() => style = HexStyle.pointy}>Pointy</button><button type="button" on:click={() => style = HexStyle.flat}>Flat</button></div>
    </div>
</div>

<div style="display: none;">
    <!-- SVG reference -->
    <svg id="tile" viewBox="{-tileWidth/2} {-tileHeight/2} {tileWidth} {tileHeight}" width="{tileWidth}" height="{tileHeight}" xmlns="http://www.w3.org/2000/svg">
        <style>
            text {
                fill: #333;
                font-size: 0.7rem;
                width: 100%;
            }
            polygon {
                stroke: #222;
                stroke-width: 2;
                fill: lavender;
            }
        </style>
        <!-- from top-left point clockwise -->
        {#if style === HexStyle.pointy}
        <polygon points="{-tileWidth/2},{-tileHeight/4} 0,{-tileHeight/2} {tileWidth/2},{-tileHeight/4} {tileWidth/2},{tileHeight/4} 0,{tileHeight/2} {-tileWidth/2},{tileHeight/4}" />
        {:else}
        <polygon points="{-tileWidth/4},{-tileHeight/2} {-tileWidth/2},0 {-tileWidth/4},{tileHeight/2} {tileWidth/4},{tileHeight/2} {tileWidth/2},0 {tileWidth/4},{-tileHeight/2}" />
        {/if}
    </svg>
</div>

<div id="board-container">
    <div id="board" style="
        --board-width: {boardWidth}px;
        --board-height: {boardHeight}px;
        --tile-width: {tileWidth}px;
        --tile-height: {tileHeight}px;
        --tile-max-x: {xMax};
        --tile-max-y: {yMax};
    ">
        {#each board as tiles}
            <div class="tiles_row">
                {#each tiles as tile}
                    <TileComponent {tile} />
                {/each}
            </div>
        {/each}
        <div class="player">P</div>
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
                .tile {
                    position: absolute;
                }
            }
        }
    }
</style>

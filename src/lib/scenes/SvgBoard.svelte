<script lang="ts">
    import {Grid, type Hex, Orientation} from "honeycomb-grid";
    import {onMount} from "svelte";
    import {SVG} from "@svgdotjs/svg.js";
    import {defineHex, hexToPoint, rectangle} from "honeycomb-grid";
    import type Game from "../game/Game";
    import Player from "../aergewin/Player";

    export let game: Game;

    const options = {
        hexSize: 50,
        hexOrientation: Orientation.FLAT,
        baseXMax: 3,
        baseYMax: 3,
    };

    const hexDefinition = defineHex({
        dimensions: options.hexSize,
        orientation: options.hexOrientation,
        origin: 'topLeft'
    });

    let grid: Grid<Hex> = new Grid(hexDefinition, rectangle({
        width: options.baseXMax,
        height: options.baseYMax
    }));

    let players = new Map();

    let hexGridElement: HTMLElement;
    let svgContainer;

    onMount(() => {
        players.set("Foo", new Player(grid.createHex([0,0]), grid));

        // Clear the board
        for (const child of hexGridElement.children) {
            hexGridElement.removeChild(child);
        }

        svgContainer = SVG().addTo(hexGridElement).size('100%', '100%');

        redraw();
    });

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

        players.forEach((player: Player, name: string) => {
            const playerPoint = hexToPoint(player.position);
            svgContainer.text(name).move(playerPoint.x, playerPoint.y).fill('#800');
        });
    }
</script>

<div id="game-container">
    <div id="board-container">
        <div id="board" style="--board-width: {grid.pixelWidth}px; --board-height: {grid.pixelHeight}px;">
            <div id="hexGrid" bind:this={hexGridElement}></div>
            <div id="charactersOverlay"></div>
        </div>
    </div>
</div>

<style lang="scss">
    #game-container {
        position: relative;
        width: 100%;
        height: 100vh;
        z-index: 0;
    }
    #board-container {
        z-index: 2;
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #board {
        z-index: 3;
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
</style>

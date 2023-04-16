<script lang="ts">
    import type {Grid, Hex} from "honeycomb-grid";
    import {onMount} from "svelte";
    import {SVG} from "@svgdotjs/svg.js";
    import {hexToPoint} from "honeycomb-grid";
    import type Game from "../../game/Game";
    import type SvgJsRenderer from "../SvgJsRenderer";
    import type Player from "../../game/Player";
    import type {FeatureMode} from "../../game/FeatureMode";

    export let game: Game;
    export let renderer: SvgJsRenderer;

    let hexGridElement: HTMLElement;
    let svgContainer;

    let canStartGame = true;

    onMount(() => {
        // Clear the board
        for (const child of hexGridElement.children) {
            hexGridElement.removeChild(child);
        }

        svgContainer = SVG().addTo(hexGridElement).size('100%', '100%');

        game.currentFeatureModeStore.subscribe((feature: FeatureMode) => {
            console.info('NEW FEATURE', feature);
        });

        redraw();
    });

    function redraw() {
        svgContainer.clear();

        game.grid.forEach(function (hex: Hex) {
            const polygon = svgContainer
                // create a polygon from a hex's corner points
                .polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
                .fill('none')
                .stroke({ width: 2, color: '#999' });

            return svgContainer.group().add(polygon);
        });

        game.players.forEach((player: Player, name: string) => {
            const playerPoint = hexToPoint(player.position);
            svgContainer.text(name).move(playerPoint.x, playerPoint.y).fill('#800');
        });
    }

    function start() {
        canStartGame = false;
        game.start();
    }
</script>

<div id="game-container">
    <div id="controls">
        <button type="button" on:click={start} disabled={!canStartGame}>Start</button>
    </div>
    <div id="board-container">
        <div id="board" style="--board-width: {game.grid.pixelWidth}px; --board-height: {game.grid.pixelHeight}px;">
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
    #controls {
        z-index: 4;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
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

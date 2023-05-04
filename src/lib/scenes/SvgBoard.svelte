<script lang="ts">
    import {onMount} from "svelte";
    import AergewinGameEngine from "../aergewin/AergewinGameEngine";
    import Game from "../game/Game";

    export let game: Game;

    let gameEngine: AergewinGameEngine;
    let hexGridElement: HTMLElement;
    let hudElement: HTMLElement;

    const players = [
        // {name: 'Alex'},
        // {name: 'Hélène'},
        // {name: 'Aidan'},
        // {name: 'Jillian'},
        {name: 'Jane'},
        {name: 'John'},
        {name: 'Ella'},
        {name: 'Mario'},
    ];

    onMount(() => {
        gameEngine = new AergewinGameEngine(game, hexGridElement, hudElement, players);
        gameEngine.start();
    });

    const clickBody = (e: MouseEvent) => gameEngine.click(e);

    const keyDown = (e: KeyboardEvent) => gameEngine.keyDown(e.key);

    $: pixelWidth = gameEngine ? gameEngine.gridPixelWidth : 0;
    $: pixelHeight = gameEngine ? gameEngine.gridPixelHeight : 0;
</script>

<svelte:body on:keydown={keyDown} />

<div id="game-container">
    <div id="board-container">
        <div id="HUD" bind:this={hudElement}></div>
        <div id="board" style="--board-width: {pixelWidth}px; --board-height: {pixelHeight}px;">
            <div id="hexGrid" bind:this={hexGridElement} on:click={clickBody}></div>
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
        position: absolute;
        top: 1rem;
        left: 1rem;
    }
</style>

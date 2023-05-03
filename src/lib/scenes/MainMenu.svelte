<script lang="ts">
    import type Game from "../game/Game";
    import SvgBoard from "./SvgBoard.svelte";

    export let game: Game;

    function start() {
        game.renderScene(SvgBoard);
    }
</script>

<main>
    <h1>Hello!</h1>
    <p>Let's start a game:</p>
    <button type="button" on:click={start}>Start</button>
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        button {
            padding: 0.5rem 1rem;
            margin: 0.5rem;
            &:hover {
                cursor: pointer;
            }
        }
    }
</style>

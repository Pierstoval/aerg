<script lang="ts">
    import type Game from "../game/Game";
    import SvgBoard from "./SvgBoard.svelte";

    export let game: Game;

    function start() {
        game.renderScene(SvgBoard);
    }
</script>

<h1>Hello!</h1>

<p>Let's start a game:</p>

<button type="button" on:click={start}>Start</button>

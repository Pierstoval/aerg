<script lang="ts">
    import Game from "../../lib/game/Game";
    import {onMount} from "svelte";
    import MainMenu from "../../lib/scenes/MainMenu.svelte";

    let gameElement: HTMLElement;

    onMount(() => {
        const game = new Game(gameElement, {
            defaultScene: MainMenu
        });

        console.info('Game', game);
    });
</script>

<div id="game" bind:this={gameElement}>
    <h1>Loading...</h1>
</div>

<style lang="scss">
    #game {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>

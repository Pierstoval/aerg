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
    Loading...
</div>

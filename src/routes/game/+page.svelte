<script lang="ts">
    import Game from "../../lib/game/Game";
    import {onMount} from "svelte";

    let gameElement: HTMLElement;

    const players = [
        {name: 'Foo'},
    ];

    onMount(() => {
        const game = new Game(players, gameElement);

        console.info('Game', game);
    });
</script>

<div id="game" bind:this={gameElement}>
    Loading...
</div>

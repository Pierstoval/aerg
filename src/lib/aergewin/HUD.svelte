<svelte:options accessors />

<script lang="ts">
    import type Player from "./Player";

    export let currentPlayerIndex: number = 0;
    export let players: Map<string, Player>;
</script>

<h1>
    Players actions:
</h1>


{#each [...players.values()] as player}
    <p class:active={currentPlayerIndex === player.index}>
        <span class="player-pin" style="--player-color: {player.color.toString()}">{player.index}</span>
        <span>{player.name}: {player.actionsSpent}</span>
    </p>
{/each}

<style lang="scss">
    p.active {
        background: #ddd;
        border: solid 1px #ccc;
        border-radius: 1rem;
    }
    .player-pin {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        background-color: var(--player-color);
        border-radius: 50%;
        text-align: center;
        font-size: 14px;
        line-height: 100%;
        font-weight: bolder;
        color: white;
        text-shadow: 0 0 3px #000000;
        margin: 0;
        padding: 0;
    }
</style>

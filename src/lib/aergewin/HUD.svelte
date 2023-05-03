<svelte:options accessors />

<script lang="ts">
    import type Player from "./Player";

    export let players: Map<string, Player>;
</script>

<h1>
    Players actions:
</h1>


{#each [...players.values()] as player}
    <p>{player.name}: {player.actionsSpent}</p>
{/each}

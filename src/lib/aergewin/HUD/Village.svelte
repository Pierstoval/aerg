<script lang="ts">
    import AergewinGameEngine from "../AergewinGameEngine";
    import {_} from "svelte-i18n";
    import type {ResourceName} from "../GameData";

    export let gameEngine: AergewinGameEngine;

    let resources: Map<ResourceName, number> = new Map();

    gameEngine.on('tick', () => {
        const villagePosition = gameEngine.grid.createHex([0, 0]).toString();
        const villageResources = gameEngine.terrainsInventory.filter((item) => {
            return item.position.toString() === villagePosition;
        });

        if (villageResources.length > 1) {
            throw new Error('Unrecoverable error: village was found in more than one coordinates.');
        }

        if (villageResources.length === 1) {
            resources = villageResources[0].inventory;
        }
    });
</script>

<section>
    <h2>{$_('hud.village.title')}</h2>
    {#each [...resources.entries()] as [resource, amount]}
        <p>{$_(`resource.${resource}`)} ({amount})</p>
    {/each}
</section>

<style lang="scss">
    section {
        position: fixed;
        top: 1rem;
        left: 50%;
        width: 20rem;
        margin-left: -10rem;
        h2 {
            text-align: center;
        }
    }
</style>

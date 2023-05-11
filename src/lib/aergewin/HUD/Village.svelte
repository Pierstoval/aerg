<script lang="ts">
    import AergewinGameEngine from "../AergewinGameEngine";
    import {_} from "svelte-i18n";
    import type {ResourceName} from "../GameData";
    import type DailyEvent from "$lib/aergewin/DailyEvent";

    export let gameEngine: AergewinGameEngine;

    let resources: Map<ResourceName, number> = new Map();
    let currentEvents: Array<DailyEvent> = [];

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

        currentEvents = gameEngine.currentEvents;
    });
</script>

<section>
    {#if resources.size > 0}
        <h2>{$_('hud.village.title')}</h2>
        {#each [...resources.entries()] as [resource, amount]}
            <p>{$_(`resource.${resource}`)} ({amount})</p>
        {/each}
    {/if}

    {#if currentEvents.length > 0}
        <h3>{$_('hud.village.current_events')}</h3>
        {#each currentEvents as currentEvent}
            <p class="daily_event {currentEvent.type}">{currentEvent.name} : {currentEvent.description}</p>
        {/each}
    {/if}
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
      .daily_event {
        border-left: solid 0.5rem transparent;
        padding-left: 0.25rem;
        &.bonus {
          border-color: green;
        }
        &.malus {
          border-color: red;
        }
      }
    }
</style>

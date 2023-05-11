<script lang="ts">
    import AergewinGameEngine from '../../../AergewinGameEngine';
    import { _ } from 'svelte-i18n';
    import type Player from '../../../Player';
    import type {ResourceName} from "../../../GameData";

    export let gameEngine: AergewinGameEngine;
    let currentPlayer: Player;
    let hasItemsToDeposit = false;

    gameEngine.on('tick', () => {
        currentPlayer = gameEngine.getCurrentPlayer();
        hasItemsToDeposit = currentPlayer.inventory.size > 0;
    });

    function depositItem(resource: ResourceName) {
        if (!hasItemsToDeposit) {
            return;
        }
        currentPlayer.dropResource(resource);
        gameEngine.addResourceAt(resource, currentPlayer.position);
    }

    function nextPlayer() {
        gameEngine.goToNextPlayer();
    }

    function newTurn() {
        gameEngine.newTurn();
    }
</script>

<div>
    <button on:click={nextPlayer}>
        {$_('hud.generic_actions.next_player')}
    </button>

    <button on:click={newTurn}>
        {$_('hud.generic_actions.new_turn')}
    </button>

    {#if hasItemsToDeposit}
        <h2>{$_(`actions.drop_items`)}</h2>
        {#each [...currentPlayer.inventory.entries()] as [resource, amount]}
            <button
                on:click={() => depositItem(resource)}
            >
                {$_('hud.generic_actions.deposit_resource', {values: { resource: $_(`resource.${resource}`)}})}
            </button>
        {/each}
    {/if}
</div>

<style lang="scss">
    button {
        display: block;
        border: solid 1px transparent;
        background: #f0f8ff;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        &.disabled {
            background: #f7fbff;
            color: #888;
            &:hover {
                cursor: not-allowed;
            }
        }
        &:hover:not(.disabled) {
            background: #d3dfe8;
            cursor: pointer;
        }
    }
</style>

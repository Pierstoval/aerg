<script lang="ts">
    import type { ComponentType } from 'svelte/types/runtime/internal/dev';
    import ActionsListHUD from "./CurrentAction/ActionsList.svelte";
    import MoveHUD from "./CurrentAction/Move.svelte";
    import FightHUD from "./CurrentAction/Fight.svelte";
    import ActivateZoneHUD from "./CurrentAction/ActivateZone.svelte";
    import AergewinGameEngine, {type CurrentGameAction} from "../AergewinGameEngine";

    export let gameEngine: AergewinGameEngine;

    let currentHUDComponent: ComponentType | undefined;

    const actionsComponents: { [key: CurrentGameAction]: ComponentType } = {
        actions_list: ActionsListHUD,
        move: MoveHUD,
        fight: FightHUD,
        activate_zone: ActivateZoneHUD
    };

    gameEngine.on('tick', () => {
        currentHUDComponent = actionsComponents[gameEngine.currentAction];
    });
</script>

{#if currentHUDComponent}
    <section id="currentAction">
        <svelte:component this={currentHUDComponent} {gameEngine} />
    </section>
{/if}

<style lang="scss">
    #currentAction {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        position: fixed;
        bottom: 1rem;
    }
</style>

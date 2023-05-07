<script lang="ts">
	import type AergewinGameEngine from '../AergewinGameEngine';
	import {_} from "svelte-i18n";

	export let gameEngine: AergewinGameEngine;

	const currentPlayer = gameEngine.getCurrentPlayer();

	function activeMoveAction() {
		gameEngine.changeCurrentActionState('move');
	}

	function fightAction() {
		gameEngine.changeCurrentActionState('fight');
	}

	function activateZone() {
		gameEngine.changeCurrentActionState('activate_zone');
	}
</script>

{#if currentPlayer.canMove()}
	<button on:click={activeMoveAction}>{$_('hud.actions.move_or_explore')}</button>
{/if}

{#if gameEngine.playerCanFight(currentPlayer)}
	<button on:click={fightAction}>{$_('hud.actions.fight')}</button>
{/if}

{#if gameEngine.playerCanActivateZone(currentPlayer)}
	<button on:click={activateZone}>{$_('hud.actions.activate_current_zone')}</button>
{/if}

<style lang="scss">
	button {
		border: solid 1px transparent;
		background: #f0f8ff;
		padding: 1rem 2rem;
		border-radius: 1rem;
		&:hover {
			background: #d3dfe8;
			cursor: pointer;
		}
	}
</style>

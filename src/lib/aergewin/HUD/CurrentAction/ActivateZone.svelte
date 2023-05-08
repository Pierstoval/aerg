<script lang="ts">
	import type AergewinGameEngine from '../../AergewinGameEngine';
	import ZoneActivation from "../../ZoneActivation";
	import {_} from "svelte-i18n";
	import type TerrainTile from "../../TerrainTile";
	import type Player from "../../Player";

	export let gameEngine: AergewinGameEngine;
	let currentPlayer: Player|undefined;
	let currentZone: TerrainTile|undefined;
	let possibleActions: ZoneActivation[] = [];
	gameEngine.on('tick', () => {
		currentPlayer = gameEngine.getCurrentPlayer();
		currentZone = gameEngine.getPlayerZone(currentPlayer);
		possibleActions = currentZone.possibleActions;
	})

	function executeAction(action: ZoneActivation) {
		if (!currentPlayer) {
			throw new Error('Unrecoverable error: cannot find current player to execute action.');
		}
		gameEngine.playerExecuteAction(currentPlayer, action);
	}
</script>

<section>
	<h3>{$_('hud.activate_zone.current_zone')} <strong>{$_(`zone.${currentZone?.type}`)}</strong></h3>
	{#each possibleActions as action}
		<button on:click={() => executeAction(action)}>
			{$_(`actions.${action.name}`)}
			(
			{$_('hud.activate_zone.cost', {values: {action: action.cost}})}
			{#each action.resourceCost as resourceCost}
				, {resourceCost[1]} {$_(`resource.${resourceCost[0]}`)}
			{/each}
			{#if action.experienceGain}; {$_('hud.activate_zone.xp_gain', {values: {xp: action.experienceGain}})}{/if}
			)
		</button>
	{/each}
</section>

<style lang="scss">
	h3,
	h4 {
		display: block;
	}
	button {
		display: block;
		border: solid 1px transparent;
		background: #f0f8ff;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		&:hover {
			background: #d3dfe8;
			cursor: pointer;
		}
	}
</style>

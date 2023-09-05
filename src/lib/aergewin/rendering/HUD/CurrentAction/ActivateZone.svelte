<script lang="ts">
	import type AergewinGameEngine from '../../../AergewinGameEngine';
	import type { ZoneActivation } from '../../../ZoneActivation';
	import { _ } from 'svelte-i18n';
	import type TerrainTile from '../../../TerrainTile';
	import type Player from '../../../entities/Player';
	import {onMount} from "svelte";

	export let gameEngine: AergewinGameEngine;
	let currentPlayer: Player;
	let currentZone: TerrainTile;
	let possibleActions: ZoneActivation[] = [];

	gameEngine.on('tick', sync);
	onMount(() => {
		if (gameEngine.isRunning) {
			sync();
		}
	});

	function sync() {
		currentPlayer = gameEngine.currentPlayer;
		currentZone = gameEngine.getPlayerZone(currentPlayer);
		possibleActions = currentZone.possibleActions;
	}

	function canExecuteAction(action: ZoneActivation): boolean {
		if (!currentPlayer) {
			throw new Error('Unrecoverable error: cannot find current player to check if they can execute action.');
		}
		return gameEngine.playerCanActivateZone(currentPlayer, action);
	}

	function checkAndExecuteAction(action: ZoneActivation) {
		if (!canExecuteAction(action)) {
			return;
		}
		gameEngine.playerActivateZone(currentPlayer, action);
	}
</script>

<section>
	<h3>{$_('hud.activate_zone.current_zone')} <strong>{$_(`zone.${currentZone?.type}`)}</strong></h3>
	{#each possibleActions as action}
		<div>
			<button
				on:click={() => checkAndExecuteAction(action)}
				class:disabled="{!canExecuteAction(action)}"
			>
				{$_(`actions.${action.name}`)}
			</button>
			(
			{$_('hud.activate_zone.cost', { values: { action: action.cost } })}
			{#each action.resourceCost as resourceCost}
				, {resourceCost[1]} {$_(`resource.${resourceCost[0]}`)}
			{/each}
			{#if action.experienceGain}; {$_('hud.activate_zone.xp_gain', {
				values: { xp: action.experienceGain }
			})}{/if}
			)
		</div>
	{/each}
</section>

<style lang="scss">
	h3 {
		display: block;
	}
	button {
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

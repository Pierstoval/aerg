<svelte:options accessors />

<script lang="ts">
	import type AergewinGameEngine from './AergewinGameEngine';
	import type { CurrentGameAction } from './AergewinGameEngine';
	import type Player from './Player';
	import type { ComponentType, SvelteComponentTyped } from 'svelte/types/runtime/internal/dev';
	import ActionsListHUD from './HUD/ActionsListHUD.svelte';
	import MoveHUD from './HUD/MoveHUD.svelte';
	import FightHUD from './HUD/FightHUD.svelte';
	import ActivateZoneHUD from './HUD/ActivateZoneHUD.svelte';

	export let gameEngine: AergewinGameEngine;

	let players: Array<Player> = [];
	let currentPlayer: Player|undefined;
	let currentAction: string = '';
	let currentHUDComponent: SvelteComponentTyped | undefined;

	const actionsComponents: { [key: CurrentGameAction]: ComponentType } = {
		actions_list: ActionsListHUD,
		move: MoveHUD,
		fight: FightHUD,
		activate_zone: ActivateZoneHUD
	};

	gameEngine.on('tick', () => {
		players = [...gameEngine.players.values()];
		currentAction = gameEngine.currentAction;
		currentHUDComponent = actionsComponents[currentAction];
		currentPlayer = gameEngine.getCurrentPlayer();
	});
</script>

<section id="actions">
	<h1>Players:</h1>
	{#each players as player}
		<p class:active={currentPlayer?.index === player.index}>
			<span class="player-pin" style="--player-color: {player.color.toString()}"
				>{player.index}</span
			>
			<span>{player.name}: {player.actionsSpent}</span>
		</p>
	{/each}
</section>

{#if currentHUDComponent}
	<section id="currentAction">
		<svelte:component this={currentHUDComponent} {gameEngine} />
	</section>
{/if}

{#if currentPlayer}
	<section id="currentPlayer">
		<h3>Current player: {currentPlayer.name}</h3>
		<p>
			Inventory:
		</p>
		<ul id="inventoryList">
			{#each [...currentPlayer.inventory.entries()] as [resource, amount]}
				<li>{resource} ({amount})</li>
			{:else}
				<li>-</li>
			{/each}
		</ul>
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
	#currentPlayer {
		position: fixed;
		top: 1rem;
		right: 1rem;
		#inventoryList {
			list-style-type: none;
		}
	}
	#actions {
		position: absolute;
		width: 18rem;

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
		}
	}
</style>

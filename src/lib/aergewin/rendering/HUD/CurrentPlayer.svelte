<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Player from '../../entities/Player';
	import AergewinGameEngine from '../../AergewinGameEngine';

	export let gameEngine: AergewinGameEngine;

	let players: Array<Player> = [];
	let currentPlayer: Player | undefined;

	gameEngine.on('tick', () => {
		players = [...gameEngine.players.values()];
		currentPlayer = gameEngine.currentPlayer;
	});
</script>

<section id="currentPlayer">
	{#if currentPlayer}
		<h3>{$_('hud.current_player')} {currentPlayer.name}</h3>
		<p>
			{$_('hud.inventory')}
		</p>
		<ul id="inventoryList">
			{#each [...currentPlayer.inventory.entries()] as [resource, amount]}
				<li>{$_(`resource.${resource}`)} ({amount})</li>
			{:else}
				<li>-</li>
			{/each}
		</ul>
	{/if}
</section>

<style lang="scss">
	#currentPlayer {
		position: fixed;
		top: 1rem;
		right: 1rem;
		#inventoryList {
			list-style-type: none;
		}
	}
</style>

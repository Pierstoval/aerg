<svelte:options accessors />

<script lang="ts">
	import type AergewinGameEngine from './AergewinGameEngine';
	import type Player from './Player';

	export let gameEngine: AergewinGameEngine;
	export let currentPlayerIndex: number = 0;

	let players: Array<Player> = [];

	gameEngine.on('draw', () => {
		players = [...gameEngine.players.values()];
	});
</script>

<section>
	<h1>Players actions:</h1>
	{#each players as player}
		<p class:active={currentPlayerIndex === player.index}>
			<span class="player-pin" style="--player-color: {player.color.toString()}"
				>{player.index}</span
			>
			<span>{player.name}: {player.actionsSpent}</span>
		</p>
	{/each}
</section>

<style lang="scss">
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
		margin: 0;
		padding: 0;
	}
</style>

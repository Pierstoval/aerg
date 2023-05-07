<script lang="ts">
	import type AergewinGameEngine from '../AergewinGameEngine';

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
	<button on:click={activeMoveAction}>Move or explore</button>
{/if}

{#if gameEngine.playerCanFight(currentPlayer)}
	<button on:click={fightAction}>Move or explore</button>
{/if}

{#if gameEngine.playerCanActivateZone(currentPlayer)}
	<button on:click={activateZone}>Activate current zone</button>
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

<script lang="ts">
	import AergewinGameEngine from '../../AergewinGameEngine';
	import Fight from './CurrentAction/Fight.svelte';
	import ActivateZone from './CurrentAction/ActivateZone.svelte';
	import GenericActions from './CurrentAction/GenericActions.svelte';
	export let gameEngine: AergewinGameEngine;
</script>

<section id="currentAction">
	<div>
		<Fight {gameEngine} />
	</div>
	<div>
		<GenericActions {gameEngine} />
	</div>
	<div>
		<ActivateZone {gameEngine} />
	</div>
</section>

<style lang="scss">
	#currentAction {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		position: fixed;
		bottom: 1rem;
		& > div {
			margin: 0 0.5rem;
		}
	}
</style>

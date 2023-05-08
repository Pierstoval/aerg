<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import SceneManager from '../../lib/game/SceneManager';
	import MainMenu from '../../lib/scenes/MainMenu.svelte';

	let gameElement: HTMLElement;

	onMount(() => {
		const game = new SceneManager(gameElement, {
			defaultScene: MainMenu
		});
		console.info('Game', game);
	});
</script>

<div id="game" bind:this={gameElement}>
	<h1>{$_('home.loading')}</h1>
</div>

<style lang="scss">
	:global(body, html) {
		height: 100%;
	}
	#game {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 100%;
	}
</style>

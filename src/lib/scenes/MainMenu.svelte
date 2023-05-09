<script lang="ts">
	import type SceneManager from '../SceneManagement/SceneManager';
	import GameHexBoard from './GameHexBoard.svelte';
	import { _ } from 'svelte-i18n';

	export let game: SceneManager;

	function start() {
		game.renderScene(GameHexBoard);
	}
</script>

<main>
	<h1>Aergewin</h1>
	<button type="button" on:click={start}>{$_('main_menu.start_button')}</button>
</main>

<style lang="scss">
	main {
		text-align: center;
		button {
			padding: 0.5rem 1rem;
			margin: 0.5rem;
			&:hover {
				cursor: pointer;
			}
		}
	}
</style>

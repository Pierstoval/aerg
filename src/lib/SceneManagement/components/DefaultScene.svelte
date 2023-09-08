<script lang="ts">
	import type SceneManager from '../SceneManager';

	export let game: SceneManager;
</script>

<main>
	<h1>Game ready to be coded!</h1>

	<p>Here are the game options:</p>
	<pre>{JSON.stringify(game.options || {}, undefined, 4)}</pre>
</main>

<style lang="scss">
	main {
		max-width: 100%;
		min-width: 200px;
		width: 50%;
		margin: 0 auto;
	}
	h1 {
		text-align: center;
	}
</style>

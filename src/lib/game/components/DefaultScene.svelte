<script lang="ts">
	import Game from '../Game';

	export let game: Game;

	let options = game.options;
</script>

<main>
	<h1>Game ready to be coded!</h1>

	<p>Here are the game options:</p>
	<pre>{JSON.stringify(options, undefined, 4)}</pre>
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
	ul {
		list-style: circle inside;
	}
</style>

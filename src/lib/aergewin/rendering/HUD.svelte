<script lang="ts">
	import type AergewinGameEngine from '../AergewinGameEngine';
	import CharacterList from './HUD/CharacterList.svelte';
	import CurrentPlayer from './HUD/CurrentPlayer.svelte';
	import CurrentUserAction from './HUD/CurrentUserAction.svelte';
	import Village from './HUD/Village.svelte';
	import Parameters from './HUD/Parameters.svelte';

	export let gameEngine: AergewinGameEngine;
</script>

<CharacterList {gameEngine} />
<CurrentUserAction {gameEngine} />
<CurrentPlayer {gameEngine} />
<Village {gameEngine} />
<Parameters />

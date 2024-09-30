<script lang="ts">
	import AergewinGameEngine from '../../AergewinGameEngine';
	import { _ } from 'svelte-i18n';
	import type { DailyEvent, ResourceName } from '../../GameData';

	export let gameEngine: AergewinGameEngine;

	let villageResources: Map<ResourceName, number> = new Map();
	let currentEvents: Array<DailyEvent> = [];

	gameEngine.on('tick', () => {
		villageResources = gameEngine.village.inventory;
		currentEvents = gameEngine.currentEvents;
	});
</script>

<section>
	{#if villageResources.size > 0}
		<h2>{$_('hud.village.title')}</h2>
		{#each [...villageResources.entries()] as [resource, amount]}
			<p>{$_(`resource.${resource}`)} ({amount})</p>
		{/each}
	{/if}

	{#if currentEvents.length > 0}
		<h3>{$_('hud.village.current_events')}</h3>
		{#each currentEvents as currentEvent}
			<p class="daily_event {currentEvent.type}">
				{currentEvent.name} : {currentEvent.description}
			</p>
		{/each}
	{/if}
</section>

<style lang="scss">
	section {
		position: fixed;
		top: 1rem;
		left: 50%;
		width: 20rem;
		margin-left: -10rem;
		h2 {
			text-align: center;
		}
		.daily_event {
			border-left: solid 0.5rem transparent;
			padding-left: 0.25rem;
			&.bonus {
				border-color: green;
			}
			&.malus {
				border-color: red;
			}
		}
	}
</style>

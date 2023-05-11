<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Player, {type PlayerName} from '../../Player';
	import AergewinGameEngine from '../../AergewinGameEngine';

	export let gameEngine: AergewinGameEngine;

	let players: Array<Player> = [];
	let currentPlayer: Player | undefined;
	let currentTurnFirstPlayer: PlayerName|undefined;
	let currentTurn = 0;

	gameEngine.on('tick', () => {
		players = [...gameEngine.players.values()];
		currentPlayer = gameEngine.getCurrentPlayer();
		currentTurnFirstPlayer = gameEngine.currentTurnFirstPlayer;
		currentTurn = gameEngine.currentTurn;
	});
</script>

<section>
	<h1>{$_('hud.players_list.current_turn', {values: {current_turn: currentTurn}})}</h1>
	<h1>{$_('hud.players_list')}</h1>
	{#each players as player}
		<p class:active={currentPlayer?.index === player.index} class:first-player={currentTurnFirstPlayer === player.name}>
			<span class="player-pin" style="--player-color: {player.color.toString()}">
				{player.index}
			</span>
			<span>{player.name}: {player.actionsSpent}</span>
		</p>
	{/each}
</section>

<style lang="scss">
	section {
		position: fixed;
		width: 18rem;

		p {
			border: solid 1px transparent;
			position: relative;
			&.active {
				background: #ddd;
				border-color: #ccc;
				border-radius: 1rem;
			}
			&.first-player::after {
				content: "1️⃣";
				position: absolute;
				right: 1rem;
			}
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
		}
	}
</style>

<script lang="ts">
    import type AergewinGameEngine from '../../AergewinGameEngine';
    import { _ } from 'svelte-i18n';
    import type TerrainTile from '../../TerrainTile';
    import type Player from '../../Player';

    export let gameEngine: AergewinGameEngine;
    let currentPlayer: Player;
    let currentZone: TerrainTile;
    gameEngine.on('tick', () => {
        currentPlayer = gameEngine.getCurrentPlayer();
        currentZone = gameEngine.getPlayerZone(currentPlayer);
    });

</script>

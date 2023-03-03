<script lang="ts">
    import Player, {PlayerEvent} from "../Player";

    export let player: Player;

    let top = player.topCoord;
    let left = player.leftCoord;

    player.on(PlayerEvent.MOVE, () => {
        top = player.topCoord;
        left = player.leftCoord;
    });
</script>

<div class="player" style="
        top: {top}px;
        left: {left}px;
        width: {player.width}px;
        height: {player.height}px;
        --font-size: {player.width / 2}px;
    ">
    <span class="player-inner">🧙</span>
</div>

<style lang="scss">
    .player {
        z-index: 2;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        .player-inner {
            font-size: var(--font-size);
        }
    }
</style>

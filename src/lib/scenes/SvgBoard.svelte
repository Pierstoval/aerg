<script lang="ts">
    import {defineHex, Grid, type Hex, Orientation, rectangle} from "honeycomb-grid";
    import {onMount} from "svelte";
    import Player, {PlayerEvent} from "../aergewin/Player";
    import AergewinGameEngine from "../aergewin/AergewinGameEngine";

    const firstPlayerName = 'Foo';

    const options = {
        hexSize: 50,
        hexOrientation: Orientation.FLAT,
        baseXMax: 3,
        baseYMax: 3,
    };

    const hexDefinition = defineHex({
        dimensions: options.hexSize,
        orientation: options.hexOrientation,
        origin: 'topLeft'
    });

    let grid: Grid<Hex> = new Grid(hexDefinition, rectangle({
        width: options.baseXMax,
        height: options.baseYMax
    }));

    let players = new Map();

    let gameEngine: AergewinGameEngine;
    let hexGridElement: HTMLElement;
    let hudElement: HTMLElement;
    let currentPlayer: string = firstPlayerName;

    players.set(firstPlayerName, new Player(firstPlayerName, grid.createHex([0,0]), grid));
    players.set('Bar', new Player('Bar', grid.createHex([1,0]), grid));
    players.set('Baz', new Player('Baz', grid.createHex([0,1]), grid));

    onMount(() => {
        // Clear the board
        for (const child of hexGridElement.children) {
            hexGridElement.removeChild(child);
        }

        players.forEach((player: Player) => {
            player.on(PlayerEvent.MOVE, () => {
                currentPlayer = gameEngine.getNextPlayer(currentPlayer);
                redraw();
            });
        });

        gameEngine = new AergewinGameEngine(grid, hexGridElement, hudElement, players);
    });

    function clickGrid(e: MouseEvent) {
        const offsetX = e.offsetX;
        const offsetY = e.offsetY;
        const hexCoordinates = grid.pointToHex({x: offsetX, y: offsetY}, {
            allowOutside: false,
        });

        if (hexCoordinates) {
            gameEngine.getCurrentPlayer().moveTo(hexCoordinates);
        }
    }

    function keyDown(e: KeyboardEvent) {
        gameEngine.keyDown(e.key);
        redraw();
    }

    function redraw() {
        gameEngine.redraw();

        // TODO: find a better solution (a svelte store?)
        players = new Map(players); // Force svelte to refresh players everytime.
    }
</script>

<svelte:body on:keydown={keyDown} on:click={clickGrid} />

<div id="game-container">
    <div id="board-container">
        <div id="HUD" bind:this={hudElement}></div>
        <div id="board" style="--board-width: {grid.pixelWidth}px; --board-height: {grid.pixelHeight}px;">
            <div id="hexGrid" bind:this={hexGridElement}></div>
        </div>
    </div>
</div>

<style lang="scss">
    #game-container {
        position: relative;
        width: 100%;
        height: 100vh;
        z-index: 0;
    }
    #board-container {
        z-index: 2;
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #board {
        z-index: 3;
        position: relative;
        width: var(--board-width);
        height: var(--board-height);
        min-width: var(--board-width);
        min-height: var(--board-height);
        & > * {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
    }
    #HUD {
        z-index: 4;
        position: absolute;
        top: 1rem;
        left: 1rem;
    }
</style>

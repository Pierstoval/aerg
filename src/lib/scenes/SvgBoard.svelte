<script lang="ts">
    import {defineHex, Grid, type Hex, hexToPoint, Orientation, rectangle} from "honeycomb-grid";
    import {onMount} from "svelte";
    import {SVG} from "@svgdotjs/svg.js";
    import type Game from "../game/Game";
    import Player, {PlayerEvent} from "../aergewin/Player";

    export let game: Game;

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

    let hexGridElement: HTMLElement;
    let svgContainer;
    let currentPlayer: string = firstPlayerName;

    players.set(firstPlayerName, new Player(firstPlayerName, grid.createHex([0,0]), grid));
    players.set('Bar', new Player('Bar', grid.createHex([1,0]), grid));
    players.set('Baz', new Player('Baz', grid.createHex([0,1]), grid));

    onMount(() => {
        // Clear the board
        for (const child of hexGridElement.children) {
            hexGridElement.removeChild(child);
        }

        svgContainer = SVG().addTo(hexGridElement).size('100%', '100%');

        players.forEach((player: Player) => {
            player.on(PlayerEvent.MOVE, () => {
                goToNextPlayer();
            });
        });

        redraw();
    });

    function goToNextPlayer() {
        const entries = players.entries();
        let found = false;
        do {
            const entry = entries.next();
            if (entry.done) {
                // Last item, no value here
                currentPlayer = firstPlayerName;
                break;
            }

            let entryName = entry.value[1].name;

            if (found) {
                currentPlayer = entryName;
                break;
            }

            if (entryName === currentPlayer) {
                // Set flag to "true" so *next iteration* will set next player.
                // If next iteration is empty (thus current iteration = last item),
                //   then next player is the first player in the list.
                found = true;
            }
        } while (true);
        redraw();
    }

    function redraw() {
        svgContainer.clear();

        grid.forEach(function (hex: Hex) {
            drawPolygon(hex);
        });

        players.forEach((player: Player) => {
            drawPlayer(player);
        });

        players = new Map(players); // Force Svelte to refresh where "players" is used in the component
    }

    function drawPolygon(hex: Hex) {
        const polygon = svgContainer
            // create a polygon from a hex's corner points
            .polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
            .fill('none')
            .stroke({ width: 2, color: '#999' });

        svgContainer.group().add(polygon);
    }

    function drawPlayer(player: Player) {
        const playerPoint = hexToPoint(player.position);
        svgContainer.text(player.name).move(playerPoint.x, playerPoint.y).fill('#800');
    }

    function clickGrid(e: MouseEvent) {
        const offsetX = e.offsetX;
        const offsetY = e.offsetY;
        const hexCoordinates = grid.pointToHex({x: offsetX, y: offsetY}, {
            allowOutside: false,
        });

        if (hexCoordinates) {
            players.get(currentPlayer).moveTo(hexCoordinates);
        }
    }

    function keyDown(e: KeyboardEvent) {
        players.get(currentPlayer).keyDown(e.key);
    }
</script>

<svelte:body on:keydown={keyDown} on:click={clickGrid} />

<div id="game-container">
    <div id="board-container">
        <div id="HUD">
            <h2>Actions spent:</h2>
            {#each [...players.values()] as player}
                <p>{player.name} : {player.actionsSpent}</p>
            {/each}
        </div>
        <div id="board" style="--board-width: {grid.pixelWidth}px; --board-height: {grid.pixelHeight}px;">
            <div id="hexGrid" bind:this={hexGridElement}></div>
            <div id="charactersOverlay"></div>
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

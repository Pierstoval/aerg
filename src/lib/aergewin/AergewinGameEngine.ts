import type Player from "./Player";
import type {PlayerName} from "./Player";
import type {Grid, Hex} from "honeycomb-grid";
import type {ArrayXY, Svg} from "@svgdotjs/svg.js";
import Renderer from "./Renderer";
import type {Direction} from "honeycomb-grid";
import {keymap} from "../keymap";

export default class AergewinGameEngine {
    private renderer: Renderer;
    private players: Map<string, Player>;

    private currentPlayer: PlayerName;

    constructor(
        grid: Grid<Hex>,
        players: Map<string, Player>,
        svgContainer: Svg
    ) {
        this.renderer = new Renderer(grid, players, svgContainer);
        this.players = players;
        this.currentPlayer = this.getFirstPlayerName();
    }

    public getCurrentPlayer(): Player {
        const player = this.players.get(this.currentPlayer);

        if (!player) {
            throw new Error('Unrecoverable error: cannot find current player.');
        }

        return player;
    }

    public redraw() {
        this.renderer.draw();
    }

    public keyDown(key: string) {
        const direction: Direction | undefined = keymap[key];

        if (direction === undefined) {
            return;
        }

        this.getCurrentPlayer().goToDirection(direction);
        this.redraw();
    }

    public getNextPlayer(currentPlayer: PlayerName): PlayerName {
        const firstPlayerName = this.getFirstPlayerName();
        const entries = this.players.entries();

        let found = false;

        do {
            const entry = entries.next();
            if (entry.done) {
                // Last item, no value here
                this.currentPlayer = firstPlayerName;
                return this.currentPlayer;
            }

            let entryName = entry.value[1].name;

            if (found) {
                this.currentPlayer = entryName
                return this.currentPlayer;
            }

            if (entryName === currentPlayer) {
                // Set flag to "true" so *next iteration* will set next player.
                // If next iteration is empty (thus current iteration = last item),
                //   then next player is the first player in the list.
                found = true;
            }
        } while (true);

        throw new Error('Unrecoverable error: could not determine next player for current turn.');
    }

    private getFirstPlayerName(): PlayerName {
        return this.players.values().next().value.name;
    }
}

import type {Grid, Hex} from "honeycomb-grid";
import type Player from "./Player";
import type {ArrayXY, Svg} from "@svgdotjs/svg.js";
import {hexToPoint} from "honeycomb-grid";

export default class Renderer {
    private grid: Grid<Hex>;
    private players: Map<string, Player>;
    private svgContainer: Svg;

    constructor(grid: Grid<Hex>, players: Map<string, Player>, svgContainer: Svg) {
        this.grid = grid;
        this.players = players;
        this.svgContainer = svgContainer;
    }

    public draw() {
        this.svgContainer.clear();

        this.drawGrid();
        this.drawPlayers();
    }

    private drawGrid() {
        this.grid.forEach((hex: Hex) => {
            // create a polygon from a hex's corner points
            const points: ArrayXY[] = hex.corners.map(({ x, y }) => [x, y]);

            const polygon = this.svgContainer
                .polygon(points)
                .fill('none')
                .stroke({ width: 2, color: '#999' });

            this.svgContainer.group().add(polygon);
        });
    }

    private drawPlayers() {
        this.players.forEach((player: Player) => {
            const playerPoint = hexToPoint(player.position);

            this.svgContainer.text(player.name).move(playerPoint.x, playerPoint.y).fill('#800');
        });
    }
}

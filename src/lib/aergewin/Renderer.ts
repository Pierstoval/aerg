import type {Grid, Hex} from "honeycomb-grid";
import type Player from "./Player";
import type {ArrayXY, Svg} from "@svgdotjs/svg.js";
import {hexToPoint} from "honeycomb-grid";
import {SVG} from "@svgdotjs/svg.js";
import HUDComponent from './HUD.svelte';
import type {SvelteComponentTyped} from "svelte/types/runtime/internal/dev";

export default class Renderer {
    private grid: Grid<Hex>;
    private players: Map<string, Player>;
    private svgContainer: Svg;
    private hudElement: HTMLElement;
    private hudComponent: SvelteComponentTyped;

    constructor(grid: Grid<Hex>, players: Map<string, Player>, gridElement: HTMLElement, hudElement: HTMLElement) {
        this.grid = grid;
        this.players = players;

        const svgContainer = SVG();
        svgContainer.addTo(gridElement).size('100%', '100%');
        this.svgContainer = svgContainer;

        this.hudElement = hudElement;
        this.hudComponent = new HUDComponent({
            target: hudElement,
            hydrate: true,
            props: {
                players: players,
            }
        });
    }

    public draw() {
        this.svgContainer.clear();
        this.hudComponent.players = new Map(this.players); // Forces Svelte component to refresh iterator.

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

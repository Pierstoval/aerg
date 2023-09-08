import type { Hex } from 'honeycomb-grid';
import { hexToPoint } from 'honeycomb-grid';

import type { ArrayXY, Svg } from '@svgdotjs/svg.js';
import { SVG } from '@svgdotjs/svg.js';

import type { SvelteComponent } from 'svelte';

import type Player from '../entities/Player';
import type TerrainTile from '../TerrainTile';
import type RendererInterface from './RendererInterface';
import type RendererFactory from './RendererFactory';
import HUDComponent from './HUD.svelte';
import AergewinGameEngine from '../AergewinGameEngine';
import BaseRenderer from './BaseRenderer';

export class SvgRendererFactory implements RendererFactory {
	private readonly _gridElement: HTMLElement;
	private readonly _hudElement: HTMLElement;

	constructor(gridElement: HTMLElement, hudElement: HTMLElement) {
		this._gridElement = gridElement;
		this._hudElement = hudElement;
	}

	getRenderer(engine: AergewinGameEngine): RendererInterface {
		return new DefaultSvgRenderer(engine, this._gridElement, this._hudElement);
	}
}

export default class DefaultSvgRenderer extends BaseRenderer {
	private readonly svgContainer: Svg;
	private readonly hudComponent: SvelteComponent;
	private _hoverOnPositions: Array<Hex> = [];

	constructor(gameEngine: AergewinGameEngine, gridElement: HTMLElement, hudElement: HTMLElement) {
		super(gameEngine);

		// Clear the board
		hudElement.innerHTML = '';
		gridElement.innerHTML = '';

		const svgContainer = SVG();
		svgContainer.addTo(gridElement).size('100%', '100%');

		this.svgContainer = svgContainer;

		this.hudComponent = new HUDComponent({
			target: hudElement,
			hydrate: true,
			props: {
				gameEngine
			}
		});
	}

	public updateHoverPositions(hexes: Array<Hex>): void {
		const hasChanged = hexes.length !== this._hoverOnPositions.length || hexes.toString() !== this._hoverOnPositions.toString();

		if (hasChanged) {
			this._hoverOnPositions = hexes;
			this.draw();
		}
	}

	public draw(postDrawCallback?: () => void) {
		this.svgContainer.clear();

		this.svgContainer.viewbox(this.getViewbox());
		this.drawGrid();
		this.drawTerrain();
		this.drawPlayers();
		this.drawCurrentPlayerPosition();
		this.drawHUD();
		this.drawHoverTiles();

		if (postDrawCallback) {
			postDrawCallback();
		}
	}

	private drawHUD() {
		this.gameEngine.players.forEach((p: Player) => {
			if (p.isActive) {
				this.hudComponent.currentPlayerIndex = p.index;
			}
		});
	}

	private drawGrid() {
		const group = this.svgContainer.group().addClass('grid');

		this.grid.forEach((hex: Hex) => {
			// create a polygon from a hex's corner points
			const points: ArrayXY[] = hex.corners.map(({ x, y }) => [x, y]);

			const polygon = this.svgContainer.polygon(points).fill('none').stroke({ width: 1, color: '#dddddd' });

			group.add(polygon);
		});
	}

	private drawCurrentPlayerPosition() {
		const player = this.gameEngine.currentPlayer;

		const points: ArrayXY[] = player.position.corners.map(({ x, y }) => [x, y]);

		this.svgContainer
			.group()
			.addClass('player-position')
			.add(
				this.svgContainer
					.polygon(points)
					.fill('none')
					.stroke({ width: 4, color: player.color.toHex() })
					.addClass('animate-stroke')
			);
	}

	private drawPlayers() {
		const numberOfPlayers = this.gameEngine.players.size;

		const group = this.svgContainer.group().addClass('players');

		this.gameEngine.players.forEach((player: Player) => {
			const playerPoint = hexToPoint(player.position);

			const coordinateOffset = 10;
			const distanceToTheCenter = AergewinGameEngine.options.hexSize / 2;
			const t = (player.index - 1) / (numberOfPlayers / 2);

			const x = playerPoint.x - coordinateOffset;
			const y = playerPoint.y - coordinateOffset;

			const angleInRadians = t * Math.PI;
			const xOffset = Math.cos(angleInRadians) * distanceToTheCenter;
			const yOffset = Math.sin(angleInRadians) * distanceToTheCenter;

			const playerGroup = group.group().addClass('player');

			playerGroup
				.add(
					this.svgContainer
						.circle(coordinateOffset * 2)
						.move(x - xOffset, y - yOffset)
						.fill(player.color)
				)
				.add(
					this.svgContainer
						.text(String(player.index))
						.move(playerPoint.x - xOffset - coordinateOffset / 2, playerPoint.y - yOffset - coordinateOffset * 1.25)
						.fill('#ffffff')
				);
		});
	}

	private drawTerrain() {
		const group = this.svgContainer.group().addClass('terrain');

		this.gameEngine.terrain.forEach((terrainTile: TerrainTile) => {
			const corners = [...terrainTile.position.corners];

			group.add(
				this.svgContainer
					.image(terrainTile.image)
					.size(this.grid.hexPrototype.width, this.grid.hexPrototype.height)
					.move(corners[4].x, corners[5].y) // Top left
			);
		});
	}

	private drawHoverTiles() {
		const playerColor = this.gameEngine.currentPlayer.color;

		const group = this.svgContainer.group().addClass('hover');
		this._hoverOnPositions.forEach((hex: Hex) => {
			// create a polygon from a hex's corner points
			const points: ArrayXY[] = hex.corners.map(({ x, y }) => [x, y]);

			group.add(this.svgContainer.polygon(points).fill('#ffffff').opacity(0.3));
			group.add(this.svgContainer.polygon(points).opacity(0.8).fill('none').stroke({ width: 3, color: playerColor.toHex() }));
		});
	}
}

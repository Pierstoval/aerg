import type { Hex, Point } from 'honeycomb-grid';
import type Player from './Player';
import type { ArrayXY, Svg } from '@svgdotjs/svg.js';
import { hexToPoint } from 'honeycomb-grid';
import { SVG } from '@svgdotjs/svg.js';
import HUDComponent from './HUD.svelte';
import type { SvelteComponentTyped } from 'svelte/types/runtime/internal/dev';
import AergewinGameEngine from './AergewinGameEngine';
import type TerrainTile from './TerrainTile';

export default class Renderer {
	private gameEngine: AergewinGameEngine;
	private _hoverOnPositions: Array<Hex> = [];
	private readonly svgContainer: Svg;
	private readonly hudComponent: SvelteComponentTyped;

	constructor(gameEngine: AergewinGameEngine, gridElement: HTMLElement, hudElement: HTMLElement) {
		this.gameEngine = gameEngine;

		// Clear the board
		for (const child of gridElement.children) {
			gridElement.removeChild(child);
		}

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

	public updateHoverPositions(hexes: Array<Hex>) {
		const hasChanged =
			hexes.length !== this._hoverOnPositions.length ||
			hexes.toString() !== this._hoverOnPositions.toString();

		if (hasChanged) {
			this._hoverOnPositions = hexes;
			this.draw();
		}
	}

	public getMinX(): number {
		let min = Infinity;

		this.gameEngine.grid.forEach((hex: Hex) => {
			hex.corners.forEach((point: Point) => {
				if (min > point.x) {
					min = point.x;
				}
			});
		});

		return min;
	}

	public getMinY(): number {
		let min = Infinity;

		this.gameEngine.grid.forEach((hex: Hex) => {
			hex.corners.forEach((point: Point) => {
				if (min > point.y) {
					min = point.y;
				}
			});
		});

		return min;
	}

	public getViewbox() {
		const minX = this.getMinX();
		const minY = this.getMinY();
		const maxX = this.getMaxX();
		const maxY = this.getMaxY();

		return {
			x: minX,
			y: minY,
			width: maxX - minX,
			height: maxY - minY
		};
	}

	public draw(postDrawCallback?: () => any) {
		this.svgContainer.clear();

		this.svgContainer.viewbox(this.getViewbox());
		this.drawGrid();
		this.drawTerrain();
		this.drawPlayers();
		this.drawHUD();
		this.drawHoverTiles();

		if (postDrawCallback) {
			postDrawCallback();
		}
	}

	private getMaxX(): number {
		let max = -Infinity;

		this.gameEngine.grid.forEach((hex: Hex) => {
			hex.corners.forEach((point: Point) => {
				if (max < point.x) {
					max = point.x;
				}
			});
		});

		return max;
	}

	private getMaxY(): number {
		let max = -Infinity;

		this.gameEngine.grid.forEach((hex: Hex) => {
			hex.corners.forEach((point: Point) => {
				if (max < point.y) {
					max = point.y;
				}
			});
		});

		return max;
	}

	private drawHUD() {
		this.gameEngine.players.forEach((p: Player) => {
			if (p.isActive) {
				this.hudComponent.currentPlayerIndex = p.index;
			}
		});
	}

	private drawGrid() {
		this.gameEngine.grid.forEach((hex: Hex) => {
			// create a polygon from a hex's corner points
			const points: ArrayXY[] = hex.corners.map(({ x, y }) => [x, y]);

			const polygon = this.svgContainer
				.polygon(points)
				.fill('none')
				.stroke({ width: 1, color: '#ddd' });

			this.svgContainer.group().add(polygon);
		});
	}

	private drawPlayers() {
		const numberOfPlayers = this.gameEngine.players.size;

		this.gameEngine.players.forEach((player: Player) => {
			const playerPoint = hexToPoint(player.position);

			const coordinateOffset = 10;
			const distanceToTheCenter = AergewinGameEngine.options.hexSize / 2;
			const t = (player.index - 1) / (numberOfPlayers / 2);

			let x = playerPoint.x - coordinateOffset;
			let y = playerPoint.y - coordinateOffset;

			const angleInRadians = t * Math.PI;
			const xOffset = Math.cos(angleInRadians) * distanceToTheCenter;
			const yOffset = Math.sin(angleInRadians) * distanceToTheCenter;

			this.svgContainer
				.circle(coordinateOffset * 2)
				.move(x - xOffset, y - yOffset)
				.fill(player.color);

			this.svgContainer
				.text(String(player.index))
				.move(
					playerPoint.x - xOffset - coordinateOffset / 2,
					playerPoint.y - yOffset - coordinateOffset * 1.25
				)
				.fill('#fff');
		});
	}

	private drawTerrain() {
		this.gameEngine.terrain.forEach((terrainTile: TerrainTile) => {
			const points: ArrayXY[] = terrainTile.position.corners.map(({ x, y }) => [x, y]);

			const polygon = this.svgContainer
				.polygon(points)
				.fill('none')
				.stroke({ width: 1, color: '#000' });

			const corners = [...terrainTile.position.corners];
			this.svgContainer
				.image(terrainTile.image)
				.size(this.gameEngine.grid.hexPrototype.width, this.gameEngine.grid.hexPrototype.height)
				.move(corners[4].x, corners[5].y)
				.stroke({ width: 1, color: '#ff0000' })
				.fill('none');

			this.svgContainer.group().add(polygon);
		});
	}

	private drawHoverTiles() {
		this._hoverOnPositions.forEach((hex: Hex) => {
			// create a polygon from a hex's corner points
			const points: ArrayXY[] = hex.corners.map(({ x, y }) => [x, y]);

			const polygon = this.svgContainer
				.polygon(points)
				.fill('#000')
				.opacity(0.05)
				.stroke({ width: 1, color: '#ddd' });

			this.svgContainer.group().add(polygon);
		});
	}
}

import type { Hex, Point } from 'honeycomb-grid';
import type Player from '../entities/Player';
import type { ArrayXY, Svg } from '@svgdotjs/svg.js';
import { Grid, hexToPoint } from 'honeycomb-grid';
import { SVG } from '@svgdotjs/svg.js';
import HUDComponent from './HUD.svelte';
import type { SvelteComponent } from 'svelte';
import AergewinGameEngine from '../AergewinGameEngine';
import type TerrainTile from '../TerrainTile';

export default class Renderer {
	private readonly gameEngine: AergewinGameEngine;
	private readonly grid: Grid<Hex>;
	private readonly svgContainer: Svg;
	private readonly hudComponent: SvelteComponent;
	private _hoverOnPositions: Array<Hex> = [];

	constructor(
		gameEngine: AergewinGameEngine,
		grid: Grid<Hex>,
		gridElement: HTMLElement,
		hudElement: HTMLElement
	) {
		this.gameEngine = gameEngine;
		this.grid = grid;

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

		this.grid.forEach((hex: Hex) => {
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

		this.grid.forEach((hex: Hex) => {
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
		this.drawCurrentPlayerPosition();
		this.drawHUD();
		this.drawHoverTiles();

		if (postDrawCallback) {
			postDrawCallback();
		}
	}

	private getMaxX(): number {
		let max = -Infinity;

		this.grid.forEach((hex: Hex) => {
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

		this.grid.forEach((hex: Hex) => {
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
		const group = this.svgContainer.group().addClass('grid');

		this.grid.forEach((hex: Hex) => {
			// create a polygon from a hex's corner points
			const points: ArrayXY[] = hex.corners.map(({ x, y }) => [x, y]);

			const polygon = this.svgContainer
				.polygon(points)
				.fill('none')
				.stroke({ width: 1, color: '#dddddd' });

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
						.move(
							playerPoint.x - xOffset - coordinateOffset / 2,
							playerPoint.y - yOffset - coordinateOffset * 1.25
						)
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
			group.add(
				this.svgContainer
					.polygon(points)
					.opacity(0.8)
					.fill('none')
					.stroke({ width: 3, color: playerColor.toHex() })
			);
		});
	}
}

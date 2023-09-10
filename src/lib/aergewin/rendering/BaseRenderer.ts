import type RendererInterface from '$lib/aergewin/rendering/RendererInterface';
import type { Hex, Point } from 'honeycomb-grid';
import type { BaseViewbox } from '$lib/aergewin/rendering/BaseViewbox';
import type AergewinGameEngine from '$lib/aergewin/AergewinGameEngine';
import type { Array } from '@svgdotjs/svg.js';

export default abstract class BaseRenderer implements RendererInterface {
	protected gameEngine: AergewinGameEngine;

	protected constructor(engine: AergewinGameEngine) {
		this.gameEngine = engine;
	}

	abstract draw(postDrawCallback?: () => void): void;

	abstract loadAssets(): Promise<void>;

	abstract updateHoverPositions(hexes: Array<Hex>): void;

	protected get grid() {
		return this.gameEngine.grid;
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

	public getViewbox(): BaseViewbox {
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

	protected getMaxX(): number {
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

	protected getMaxY(): number {
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
}

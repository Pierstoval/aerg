import type { Array } from '@svgdotjs/svg.js';

import type { Hex } from 'honeycomb-grid';

import type AergewinGameEngine from '../AergewinGameEngine';
import type RendererInterface from './RendererInterface';
import type RendererFactory from './RendererFactory';
import BaseRenderer from './BaseRenderer';

export class FakeRendererFactory implements RendererFactory {
	getRenderer(engine: AergewinGameEngine): RendererInterface {
		return new FakeRenderer(engine);
	}
}

export class FakeRenderer extends BaseRenderer {
	constructor(engine: AergewinGameEngine) {
		super(engine);
	}

	draw(postDrawCallback?: () => void): void {}

	async loadAssets(): Promise<void> {
		return Promise.resolve();
	}

	updateHoverPositions(hexes: Array<Hex>): void {}
}

import type AergewinGameEngine from '../AergewinGameEngine';
import type RendererInterface from './RendererInterface';
import type RendererFactory from './RendererFactory';
import BaseRenderer from './BaseRenderer';

export class FakeRendererFactory implements RendererFactory {
	getRenderer(engine: AergewinGameEngine): RendererInterface {
		return new NoOutputRenderer(engine);
	}
}

export class NoOutputRenderer extends BaseRenderer {
	constructor(engine: AergewinGameEngine) {
		super(engine);
	}

	draw(postDrawCallback?: () => void): void {
		postDrawCallback && postDrawCallback();
	}

	async loadAssets(): Promise<void> {
		return Promise.resolve();
	}
}

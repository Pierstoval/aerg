import type { Hex } from 'honeycomb-grid';
import type { BaseViewbox } from '$lib/aergewin/rendering/BaseViewbox';

export default interface RendererInterface {
	draw(postDrawCallback?: () => void): void;

	loadAssets(): Promise<void>;

	updateHoverPositions(hexes: Array<Hex>): void;

	getViewbox(): BaseViewbox;

	getMinX(): number;

	getMinY(): number;
}

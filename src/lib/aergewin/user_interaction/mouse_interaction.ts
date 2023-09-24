import type AergewinGameEngine from '$lib/aergewin/AergewinGameEngine';
import type { Grid, Hex } from 'honeycomb-grid';
import type RendererInterface from '$lib/aergewin/rendering/RendererInterface';

export function getHexFromMouseEvent(grid: Grid<Hex>, renderer: RendererInterface, e: MouseEvent) {
	const offsetX = e.offsetX + renderer.getMinX();
	const offsetY = e.offsetY + renderer.getMinY();

	return grid.pointToHex(
		{ x: offsetX, y: offsetY },
		{
			allowOutside: false
		}
	);
}

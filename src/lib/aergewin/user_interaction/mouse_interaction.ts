import type { Grid } from 'honeycomb-grid';
import type RendererInterface from '$lib/aergewin/rendering/RendererInterface';
import type { HexTile } from '$lib/aergewin/HexTile';

export function getHexFromMouseEvent(
	grid: Grid<HexTile>,
	renderer: RendererInterface,
	e: MouseEvent
) {
	const offsetX = e.offsetX + renderer.getMinX();
	const offsetY = e.offsetY + renderer.getMinY();

	return grid.pointToHex(
		{ x: offsetX, y: offsetY },
		{
			allowOutside: false
		}
	);
}

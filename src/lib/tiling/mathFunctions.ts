import { Orientation } from 'honeycomb-grid';

export function yCoordInPixels(
	x: number,
	y: number,
	hexHeight: number,
	angle: Orientation
): number {
	return angle === Orientation.POINTY
		? y * ((hexHeight * 3) / 4)
		: y * hexHeight + ((x % 2) * hexHeight) / 2;
}

export function xCoordInPixels(x: number, y: number, hexWidth: number, angle: Orientation): number {
	return angle === Orientation.POINTY
		? x * hexWidth + ((y % 2) * hexWidth) / 2
		: x * ((hexWidth * 3) / 4);
}

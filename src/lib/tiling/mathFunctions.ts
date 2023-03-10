import { HexagonalAngle } from './HexagonalCoordinateSystem';

export function yCoordInPixels(
	x: number,
	y: number,
	hexHeight: number,
	angle: HexagonalAngle
): number {
	return angle === HexagonalAngle.pointy
		? y * ((hexHeight * 3) / 4)
		: y * hexHeight + ((x % 2) * hexHeight) / 2;
}

export function xCoordInPixels(
	x: number,
	y: number,
	hexWidth: number,
	angle: HexagonalAngle
): number {
	return angle === HexagonalAngle.pointy
		? x * hexWidth + ((y % 2) * hexWidth) / 2
		: x * ((hexWidth * 3) / 4);
}

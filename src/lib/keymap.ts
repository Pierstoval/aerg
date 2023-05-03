import { Direction } from 'honeycomb-grid';

export const keymap: { [key: string]: Direction } = {
	"1": Direction.SW,
	"2": Direction.S,
	"3": Direction.SE,
	"4": Direction.W,
	"6": Direction.E,
	"7": Direction.NW,
	"8": Direction.N,
	"9": Direction.NE,

	"ArrowUp": Direction.N,
	"ArrowDown": Direction.S,
	"ArrowLeft": Direction.W,
	"ArrowRight": Direction.E,
};

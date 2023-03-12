import { Direction } from 'honeycomb-grid';

export const keymap: { [key: number]: Direction } = {
	97: Direction.SW, // numpad1 / with numLock
	98: Direction.S, // numpad2
	99: Direction.SE, // numpad3
	100: Direction.W, // numpad4
	102: Direction.E, // numpad6
	103: Direction.NW, // numpad7
	104: Direction.N, // numpad8
	105: Direction.NE, // numpad9

	35: Direction.SW, // numpad1/* without numlock
	40: Direction.S, // numpad1/* without numlock
	34: Direction.SE, // numpad2/* without numlock
	37: Direction.W, // numpad3/* without numlock
	39: Direction.E, // numpad4/* without numlock
	36: Direction.NW, // numpad6/* without numlock
	38: Direction.N, // numpad7/* without numlock
	33: Direction.NE // numpad8/* without numlock
};

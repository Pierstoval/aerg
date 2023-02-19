import HexDefinition from "$lib/HexDefinition";

export default class Tile extends HexDefinition
{
    get content() {
        return `${this._x}:${this._y}`;
    }
}

import HexDefinition from "./HexDefinition";

export default class Tile extends HexDefinition
{
    get content() {
        return `${this._x}:${this._y}`;
    }
}

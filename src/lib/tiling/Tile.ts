import HexagonalObject from "./HexagonalObject";

export default class Tile extends HexagonalObject
{
    get content() {
        return `${this._x}:${this._y}`;
    }
}

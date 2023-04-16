import type {GridRendererType} from "./GridRendererType";
import type Game from "../game/Game";

export type GridRendererOptions = {
    type: GridRendererType,
    options: {[key: string]: never},
}

export default abstract class GridRenderer {
    protected readonly container: HTMLElement;
    protected readonly options: GridRendererOptions;
    protected readonly game: Game;

    constructor(game: Game, container: HTMLElement, options: GridRendererOptions) {
        this.game = game;
        this.container = container;
        this.options = options;
    }

    abstract render(): void;
}

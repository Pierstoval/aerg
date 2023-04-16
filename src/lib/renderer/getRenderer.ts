import type GridRenderer from "./GridRenderer";
import type {GridRendererType} from "./GridRendererType";
import type {GridRendererOptions} from "./GridRenderer";
import SvgJsRenderer from "./SvgJsRenderer";
import type Game from "../game/Game";

export function getRenderer(game: Game, rendererType: GridRendererType, container: HTMLElement, options: GridRendererOptions): GridRenderer {
    if (rendererType === 'svgjs') {
        return new SvgJsRenderer(game, container, options);
    }

    throw new Error(`Renderer type "${rendererType}" is not valid.`);
}

import {Orientation} from "honeycomb-grid";

import type {GridRendererOptions} from "../renderer/GridRenderer";

export type GameOptions = {
    renderer: GridRendererOptions,
    hexSize: number,
    hexOrientation: Orientation,
    baseXMax: number,
    baseYMax: number,
}

export function getConfig(options: Partial<GameOptions>): GameOptions {
    const finalOptions = Object.assign(
        defaults(),
        options,
    );

    return finalOptions as GameOptions;
}

function defaults(): Partial<GameOptions> {
    return {
        renderer: {
            type: "svgjs",
        },
        hexSize: 50,
        hexOrientation: Orientation.FLAT,
        baseXMax: 3,
        baseYMax: 3,
    } as GameOptions;
}

<script lang="ts">
    import Tile from "../Tile";
    import HexAngle from "../HexagonalCoordinateSystem";

    export let tile: Tile;

    // viewBox="0 0 {tile.width} {tile.height}"
    // viewBox="{-tile.width/2} {-tile.height/2} {tile.width} {tile.height}"
</script>

<svg class="tile"
     viewBox="{-tile.width/2} {-tile.height/2} {tile.width} {tile.height}"
     width="{tile.width}"
     height="{tile.height}"
     style="top:{tile.topCoord()}px;left:{tile.leftCoord()}px;"
>
    <style>
        text {
            fill: #333;
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 0.8rem;
            width: 100%;
        }
        polygon {
            stroke: #222;
            stroke-width: 2;
            fill: lavender;
        }
    </style>

    {#if tile.style === HexAngle.pointy}
        <polygon points="
            {-tile.width/2},{-tile.height/4}
            0,{-tile.height/2}
            {tile.width/2},{-tile.height/4}
            {tile.width/2},{tile.height/4}
            0,{tile.height/2}
            {-tile.width/2},{tile.height/4}
        " />
    {:else}
        <polygon points="
            {-tile.width/4},{-tile.height/2}
            {-tile.width/2},0
            {-tile.width/4},{tile.height/2}
            {tile.width/4},{tile.height/2}
            {tile.width/2},0
            {tile.width/4},{-tile.height/2}
        " />
    {/if}

    <text x="{-tile.width/5}" y="{tile.height/12}">
        {tile.content}
    </text>
</svg>

<style lang="scss">
    .tile {
        position: absolute;
    }
</style>

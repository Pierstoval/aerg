<script lang="ts">
    import Tile from "$lib/Tile";

    export let tile: Tile;
</script>

<svg class="tile"
     viewBox="0 0 {tile.width} {tile.height}" width="{tile.width}" height="{tile.height}"
     style="top:{tile.topCoord()}px;left:{tile.leftCoord()}px;"
>
    <use xlink:href="#tile" />
    <text text-anchor="middle" dominant-baseline="middle" x="{tile.width / 2}" y="{tile.height / 2}">{tile.content}</text>
</svg>

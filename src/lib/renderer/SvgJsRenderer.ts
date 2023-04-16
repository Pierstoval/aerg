import GridRenderer from "./GridRenderer";
import BoardComponent from "./components/SvgBoard.svelte";

export default class SvgJsRenderer extends GridRenderer {
    private boardComponent: BoardComponent|null = null;

    render() {
        if (!this.boardComponent) {
            this.boardComponent = new BoardComponent({
                target: this.container,
                hydrate: true,
                props: {
                    game: this.game,
                    renderer: this
                }
            });
        }

        // this.boardComponent.update();
    }
}

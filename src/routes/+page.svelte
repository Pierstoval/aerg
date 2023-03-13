<script lang="ts">
	import { beforeUpdate, onMount } from 'svelte';
	import 'phaser';
	import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin';

	let game;
	let gameContainer: HTMLElement;
	let gameCanvas: HTMLCanvasElement;

	function getConfig() {
		return {
			type: Phaser.WEBGL,
			width: 700,
			height: 600,
			parent: gameContainer,
			canvas: gameCanvas,
			scene: {
				preload: preload,
				create: create,
				update: update
			},
			dom: {
				createContainer: false
			},
			scale: {
				mode: Phaser.Scale.FIT,
				autoCenter: Phaser.Scale.CENTER_BOTH
			},
			plugins: {
				scene: [
					{
						key: 'rexBoard',
						plugin: BoardPlugin,
						mapping: 'rexBoard'
					}
				]
			}
		};
	}

	function boot() {
		console.info('boot');
		if (game) {
			game.destroy();
			game.runDestroy();
			game = undefined;
		}
		game = new Phaser.Game(getConfig());
	}

	function preload() {
		console.info('preload');
	}

	function create() {
		console.info('create');
		const board = this.rexBoard.add.board({
			grid: {
				gridType: 'hexagonGrid',
				x: 40,
				y: 40,
				size: 40,
				staggeraxis: 'y',
				staggerindex: 'odd'
			}
		});

		const tileXYArray = board.fit(this.rexBoard.hexagonMap.triangle(board, 0, 4));

		const graphics = this.add.graphics({
			lineStyle: {
				width: 1,
				color: 0xffffff,
				alpha: 1
			}
		});
		for (const i in tileXYArray) {
			const tileXY = tileXYArray[i];
			graphics.strokePoints(board.getGridPoints(tileXY.x, tileXY.y, true), true);
		}
	}

	function update() {
		// console.info('update');
	}

	onMount(() => {
		boot();
	});
</script>

<div bind:this={gameContainer}>
	<canvas bind:this={gameCanvas} />
</div>

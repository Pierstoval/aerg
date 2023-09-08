import type RendererInterface from '$lib/aergewin/rendering/RendererInterface';
import type AergewinGameEngine from '$lib/aergewin/AergewinGameEngine';

export default interface RendererFactory {
	getRenderer(engine: AergewinGameEngine): RendererInterface;
}

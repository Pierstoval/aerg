import type RandomnessProviderInterface from '$lib/aergewin/random/RandomnessProviderInterface';

export default class DefaultRandomnessProvider implements RandomnessProviderInterface {
	provideKeyedNumberBetween(uniqueKey: string, min: number, max: number): number {
		return min + Math.floor(Math.random() * max);
	}
}

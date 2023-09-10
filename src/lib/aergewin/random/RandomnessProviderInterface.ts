export default interface RandomnessProviderInterface {
	provideKeyedNumberBetween(uniqueKey: string, min: number, max: number): number;
}

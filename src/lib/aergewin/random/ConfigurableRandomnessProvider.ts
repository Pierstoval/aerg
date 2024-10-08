import type RandomnessProviderInterface from '$lib/aergewin/random/RandomnessProviderInterface';
import DefaultRandomnessProvider from '$lib/aergewin/random/DefaultRandomnessProvider';

export default class ConfigurableRandomnessProvider implements RandomnessProviderInterface {
	private readonly nextNumbers: Map<string, number[]>;
	private readonly trueRandomnessProvider: DefaultRandomnessProvider;

	constructor() {
		this.nextNumbers = new Map();
		this.trueRandomnessProvider = new DefaultRandomnessProvider();
	}

	provideKeyedNumberBetween(uniqueKey: string, min: number, max: number): number {
		const values = this.nextNumbers.get(uniqueKey) || [];

		if (values.length > 0) {
			const value = values.shift();

			if (value === undefined) {
				throw new Error(
					'Unrecoverable error: Next numbers had at least one value, but fetching a value returned undefined.'
				);
			}

			this.nextNumbers.set(uniqueKey, values);

			return value;
		}

		return this.trueRandomnessProvider.provideKeyedNumberBetween(uniqueKey, min, max);
	}

	addNextNumberForKey(uniqueKey: string, providedValue: number) {
		const values = this.nextNumbers.get(uniqueKey) || [];

		values.push(providedValue);

		this.nextNumbers.set(uniqueKey, values);
	}
}

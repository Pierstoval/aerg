import fr from './translations/_fr';
import en from './translations/_en';
import { init, locale as localeStore, addMessages, _ as translationsStore } from 'svelte-i18n';
import { get } from 'svelte/store';

const DEFAULT_LOCALE = 'fr';
const LOCALES = ['fr', 'en'];

export function initLocale() {
	let locale = DEFAULT_LOCALE;

	if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
		const localeFromLocalStorage = configureLocaleFromLocalStorage();
		if (localeFromLocalStorage) {
			locale = localeFromLocalStorage;
		}
	}

	addMessages('fr', fr);
	addMessages('en', en);

	localeStore.set(locale);

	init({
		fallbackLocale: locale,
		initialLocale: locale
	});
}

// To be used only when in need of retrieving a value without the original store.
// Mostly in Typescript files.
// In Svelte files, use the "_" store from the "svelte-i18n" package directly.
export function _(term: string) {
	return get(translationsStore)(term);
}

function configureLocaleFromLocalStorage(): string | null {
	const storedLocale = window.localStorage.getItem('current_locale');

	if (!(storedLocale && LOCALES.indexOf(storedLocale) >= 0)) {
		console.warn('');
		return null;
	}

	localeStore.subscribe((newLocale: string | null | undefined) => {
		if (!newLocale) {
			return;
		}
		window.localStorage.setItem('current_locale', newLocale);
	});

	return storedLocale;
}

import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
	await page.goto('/');

	await page.innerHTML('body');

	await page.getByRole('link', { name: 'Aller à la page du jeu' }).click();
	await page.getByRole('button', { name: 'Nouvelle partie' }).click();

	await page.locator('.hover > polygon').first().click();

	await page.getByRole('button', { name: 'Joueur/joueuse suivant(e)' }).click();
	await page.getByRole('button', { name: 'Joueur/joueuse suivant(e)' }).click();
	await page.getByRole('button', { name: 'Joueur/joueuse suivant(e)' }).click();

	await page.getByRole('button', { name: 'Récolter de la nourriture' }).click();

	await page.getByRole('button', { name: 'Joueur/joueuse suivant(e)' }).click();
	await page.getByRole('button', { name: 'Joueur/joueuse suivant(e)' }).click();
	await page.getByRole('button', { name: 'Joueur/joueuse suivant(e)' }).click();

	await page.locator('.hover > polygon').first().click();

	await page.getByRole('button', { name: 'Joueur/joueuse suivant(e)' }).click();
	await page.getByRole('button', { name: 'Joueur/joueuse suivant(e)' }).click();
	await page.getByRole('button', { name: 'Joueur/joueuse suivant(e)' }).click();

	await page.getByRole('button', { name: 'Déposer une unité de Nourriture' }).click();
});

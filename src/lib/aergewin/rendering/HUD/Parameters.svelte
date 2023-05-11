<script lang="ts">
	import { _, locale } from 'svelte-i18n';

	const locales = ['fr', 'en'];

	let showTab = false;
	let selectedLocale = $locale;

	function updateLocale() {
		locale.set(selectedLocale);
	}

	function openParametersPanel() {
		showTab = true;
	}
	function closeParametersPanel() {
		showTab = false;
	}
</script>

<section id="parameters">
	<button id="open-parameters" on:click={openParametersPanel}>⚙</button>
	<div id="parameters-tab" class:show={showTab}>
		<button id="close-parameters" on:click={closeParametersPanel}>&times</button>

		<section class="form-section">
			<h3>{$_('hud.parameters.change_language')}</h3>

			<div class="form-group">
				<div class="radio-group">
					<label for="locale-en">🇬🇧</label>
					<input
						type="radio"
						id="locale-en"
						bind:group={selectedLocale}
						value="en"
						on:change={updateLocale}
					/>
				</div>

				<div class="radio-group">
					<label for="locale-fr">🇫🇷</label>
					<input
						type="radio"
						id="locale-fr"
						bind:group={selectedLocale}
						value="fr"
						on:change={updateLocale}
					/>
				</div>
			</div>
		</section>
	</div>
</section>

<style lang="scss">
	#parameters {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		#open-parameters {
			font-size: 2rem;
		}
		#close-parameters {
			position: absolute;
			top: 1rem;
			right: 1rem;
			font-size: 2rem;
		}
		#parameters-tab {
			display: none;
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			padding: 2rem;
			background-color: rgba(255, 255, 255, 0.4);
			backdrop-filter: blur(1rem);
			align-items: center;
			justify-content: center;

			.form-section {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 1rem 0;
				.form-group {
					padding: 1rem;
				}
				.radio-group {
					label {
						width: 60%;
					}
					input[type='radio'] {
						width: 35%;
					}
				}
			}

			&.show {
				display: flex;
			}
		}
	}
</style>

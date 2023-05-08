<script lang="ts">
	import {_} from "svelte-i18n";
</script>

<nav>
	<div>
		<h1>{$_('homepage.aergewin_title')}</h1>
		<ul>
			<li>
				<a href="/game">{$_('homepage.link_game')}</a>
			</li>
		</ul>
	</div>
</nav>

<style lang="scss">
	nav {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		padding: 3rem;
		h1 {
			text-align: center;
			margin: 1rem auto;
		}
		ul {
			list-style: none;
			min-width: 50%;
			max-width: 300px;
			li {
				text-align: center;
				a {
					display: block;
					padding: 0.4rem 2rem;
					border: solid 1px transparent;
					border-radius: 1rem;
					background-color: #f1f1f1;
					color: #4169E1;
					&:hover {
						background-color: #e1e1e1;
						border-color: #ddd;
						color: #3c61ce;
					}
				}
			}
		}
	}
</style>

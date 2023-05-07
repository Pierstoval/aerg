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
		ul {
			list-style: none;
			min-width: 50%;
			max-width: 300px;
			li {
				text-align: center;
				a {
					display: inline-block;
					padding: 0.2rem 0.5rem;
					border: solid 1px transparent;
					border-radius: 1rem;
					&:hover {
						background-color: #eee;
						border-color: #ddd;
					}
				}
			}
		}
	}
</style>

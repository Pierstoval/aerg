<nav>
    <ul>
        <li>
            <a href="/test">Testing/benchmarking page</a>
        </li>
        <li>
            <a href="/game">Game page</a>
        </li>
    </ul>
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

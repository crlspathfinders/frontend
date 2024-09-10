<script>
    import "../app.css";
    import MainNav from "./MainNav.svelte";
    import { inject } from '@vercel/analytics'
</script>

<MainNav></MainNav>

<slot></slot>

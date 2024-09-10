<script>
    import { onMount } from "svelte";
    import Home from "./Home.svelte";
    import { getLoggedIn, toggleLoggedIn } from "../lib/auth/login";
    import { Toast } from 'flowbite-svelte';
    import { CheckCircleSolid, ExclamationCircleSolid, FireOutline, CloseCircleSolid } from 'flowbite-svelte-icons';
    import { user } from "../stores/auth";
    import { getUserDocData } from "../lib/user";

    let loggedIn = false;

    let email;
    let loggedInUser;

    function basicSetUp() {
        user.subscribe(async value => {
            if (value) {
                email = value.email;
                console.log(email);
                loggedInUser = await getUserDocData(email);
                console.log(loggedInUser);
            } else {
                email = '';
            }
        });
    }

    onMount(() => {
        if (getLoggedIn()) {
            loggedIn = true;
            basicSetUp();
            setTimeout(() => {
                toggleLoggedIn();
                loggedIn = false;
            }, 3000);
        }
    })
</script>

{#if loggedIn}

    <Toast color="green">
        <svelte:fragment slot="icon">
            <CheckCircleSolid class="w-5 h-5" />
            <!-- <span class="sr-only">Check icon</span> -->
        </svelte:fragment>
        Successfully logged in.
    </Toast>

{/if}

<Home></Home>
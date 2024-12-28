<script>
    import { onMount } from 'svelte';
    import Home from './Home.svelte';
    import HomeMainPage from './HomeMainPage.svelte';
    import { getLoggedIn, toggleLoggedIn } from '../lib/auth/login';
    import { Toast } from 'flowbite-svelte';
    import {
        CheckCircleSolid,
        ExclamationCircleSolid,
        FireOutline,
        CloseCircleSolid
    } from 'flowbite-svelte-icons';
    import { user } from '../stores/auth';
    import { getUserDocData } from '../lib/user';
    import { retrieveUserInfo } from "$lib/cache";
    import { getCollection, updateMentors, updateUsers, updateClubs, updateOpps, updateDemographics } from "$lib/api";
	import { retrieveDemographics } from '$lib/mentor';

    let loggedIn = false;

    let email;
    let loggedInUser;
    let userInfo;
    let mentors;
    let users;
    let clubs;
    let opps;
	let dems;

    onMount(async () => {
        if (getLoggedIn()) {
            loggedIn = true;
            await retrieveUserInfo();
            setTimeout(() => {
                toggleLoggedIn();
                loggedIn = false;
            }, 3000);
        }
        mentors = await getCollection("Mentors");
        users = await getCollection("Users");
        clubs = await getCollection("Clubs");
        opps = await getCollection("PeerMentorLinks");
		dems = await retrieveDemographics();
        updateMentors(mentors);
        updateUsers(users);
        updateClubs(clubs);
        updateOpps(opps);
		updateDemographics(dems);
    });
</script>

<div class="mainwrapper">
    <!-- <Home></Home> -->
     <HomeMainPage></HomeMainPage>
</div>

<style>
    @media (prefers-color-scheme: dark) {
        * {
            color-scheme: light;
            background-color: white;
        }
    }
</style>


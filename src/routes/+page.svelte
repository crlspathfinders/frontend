<script>
	import { onMount } from 'svelte';
	import Home from './Home.svelte';
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

	let loggedIn = false;

	let email;
	let loggedInUser;
	let userInfo;

	onMount(async () => {
		if (getLoggedIn()) {
			loggedIn = true;
			await retrieveUserInfo();
			setTimeout(() => {
				toggleLoggedIn();
				loggedIn = false;
			}, 3000);
		}
	});
</script>

<div class="mainwrapper">
	<Home></Home>
</div>

<style>
	@media (prefers-color-scheme: dark) {
		* {
			color-scheme: light;
			background-color: white;
		}
	}
</style>

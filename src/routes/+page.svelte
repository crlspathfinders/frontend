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

	let loggedIn = false;

	let email;
	let loggedInUser;

	function basicSetUp() {
		user.subscribe(async value => {
           if (value) {
               email = value.email;
               userInfo = window.localStorage.getItem("userInfo");
               if (window.localStorage.getItem("userInfo")) {
                  userInfo = window.localStorage.getItem("userInfo");
               } else {
                   userInfo = await getUserDocData(email);
                   window.localStorage.setItem("userInfo", userInfo);
               }
               console.log(userInfo);
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

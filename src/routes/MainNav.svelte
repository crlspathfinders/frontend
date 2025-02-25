<script>
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem,
		Avatar,
		Modal
	} from 'flowbite-svelte';
	import {
		getCollection,
		wholeWebsiteData,
		updateWholeWebsiteData,
		getCollectionDoc
	} from '$lib/api';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import { user, logout } from '../stores/auth';
	import { onMount } from 'svelte';
	import { getUserDocData, getCurrEmail, setCurrEmail } from '../lib/user';
	import VerifyClub from './VerifyClub.svelte';
	import { writable } from 'svelte/store';

	let openVerify = writable(false);
	let wholeReady = writable(false);

	$: activeUrl = $page.url.pathname;
	let activeClass = 'text-white bg-gray-700 md:bg-transparent md:text-gray-700';
	let nonActiveClass =
		'text-gray-400 hover:bg-gray-500 md:hover:bg-transparent md:border-0 md:hover:text-gray-500';

	$: email = getCurrEmail();

	let email;
	let loggedInUser = writable(null);

	function basicSetUp() {
		user.subscribe(async (value) => {
			if (value) {
				email = value.email;
				console.log(email);
				loggedInUser = await getUserDocData(email);
				console.log(loggedInUser);
				wholeReady.set(true);
			} else {
				email = '';
			}
		});
	}

	let navbar;
	let navBarList = [];
	let navGroups = [];
	let mainGroup = [];
	let groupsNum = 1;
	let groupedNav;
	let authNavs = [];

	onMount(async () => {
		wholeReady.set(false);
		try {
			let targetId = wholeWebsiteData.findIndex(item => item.id === "allinfo");
			console.log(targetId);
			if (targetId > -1) {
				const allInfo = wholeWebsiteData[targetId].info;
				for (let i = 0; i < allInfo.length; i++) {
					if (allInfo[i].id == "navbar") { navbar = allInfo[i].info; }
				}
			} else {
				const allInfo = await getCollection("AllInfo");
				for (let i = 0; i < allInfo.length; i++) {
					if (allInfo[i].id == "navbar") { navbar = allInfo[i]; console.log(navbar); }
				}
				updateWholeWebsiteData("allinfo", allInfo);
			}

			targetId = wholeWebsiteData.findIndex(item => item.id === "loggedInUser");
			console.log(targetId);
			if (targetId > -1) {
				loggedInUser.set(wholeWebsiteData[targetId].info);
				email = loggedInUser.email;
			} else {
				// user.subscribe(async (value) => {
				// 	if (value) {
				// 		email = value.email;
				// 		loggedInUser = await getUserDocData(email);
				// 		updateWholeWebsiteData("loggedInUser", loggedInUser);
				// 	} else {
				// 		email = '';
				// 	}
				// });
				user.subscribe(async (value) => {
					if (value) {
						email = value.email;
						console.log(email);
						loggedInUser.set(await getUserDocData(email));
						loggedInUser.subscribe(value => {
							console.log(value);
						});
						updateWholeWebsiteData("loggedInUser", loggedInUser);
					} else {
						email = '';
					}
				});
			}
			loggedInUser.subscribe(value => {
							console.log(value.role);
						});
		} catch (error) {
			console.log("navbar onmount error: " + error);
		} finally {
			navBarList = Object.entries(navbar).map(([key, value]) => ({ key, value }));
			navBarList.pop();
			console.log(navBarList);
			navBarList.sort((a, b) => a.value.order - b.value.order); // Sorts the list according to the "value" attribute (lowest num to greatest).
			// Find the dropdowns:
			let dropNames = [];
			for (let i = 0; i < navBarList.length - 1; i++) {
				const curr = navBarList[i].value;
				let currDropName;
				let currDrop = [];
				if (curr.master.length > 1 && !dropNames.includes(curr.master)) {
					currDropName = curr.master;
					dropNames.push(currDropName);
					for (let j = 0; j < navBarList.length; j++) {
						if (navBarList[j].value.master == currDropName) {
							currDrop.push(navBarList[j]);
						}
					}
					navGroups.push(currDrop);
				}
			}
			console.log(navGroups);
			groupsNum = navGroups.length;
			mainGroup = navGroups[0];
			groupedNav = navBarList.reduce((acc, item) => {
				if (!acc[item.value.master]) {
					acc[item.value.master] = [];
				}
					acc[item.value.master].push(item);
				return acc;
			}, {});
			console.log(groupedNav);
			console.log(loggedInUser);
			wholeReady.set(true);
		}
	});

	
</script>

<!-- {#if $openVerify} -->
	<Modal title="Verify Club" open={$openVerify} on:close={() => {openVerify.set(false)}}>
		<VerifyClub></VerifyClub>
	</Modal>
<!-- {/if} -->

{#if $wholeReady && $loggedInUser}

<Navbar let:NavContainer color="black">
	<NavBrand href="/">
		<img src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2Fpathfinderslogo_nobackground.png?alt=media&token=58a95374-adfd-4c0f-b724-a5bbd6ed7ea5" class="me-3 h-6 sm:h-9" alt="PathFinders Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold text-black">CRLS PathFinders</span>
	</NavBrand>
	<NavHamburger />
	<NavUl {activeUrl} {activeClass} {nonActiveClass}>
		<!-- <NavLi href="/">Home</NavLi>
		<NavLi href="/findaclub">Find a Club</NavLi>
		<NavLi href="/findamentor">Find a Mentor</NavLi>
		<NavLi class="cursor-pointer">Explore Resources <ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 inline" /></NavLi>
		<Dropdown class="w-44 z-20 text-gray-500" {activeUrl} {activeClass} {nonActiveClass}>
			<DropdownItem href="/opportunities">Opportunities</DropdownItem>
			<DropdownItem href="/events">Events in Cambridge</DropdownItem>
			<DropdownItem target="_blank" href="https://www.cycheadspace.org/">Mental Health</DropdownItem>
		</Dropdown>
		{#if $user}
			<NavLi class="cursor-pointer">
				{email}<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 inline" />
			</NavLi>
			<Dropdown class="w-44 z-20 text-gray-500" {activeUrl} {activeClass} {nonActiveClass}>
				{#if loggedInUser}
					{#if loggedInUser.role != 'Advisor'}
						<DropdownItem href="/registeryourclub">Register Your Club</DropdownItem>
						{#if loggedInUser.role != 'Mentor'}
							<DropdownItem href="/becomeamentor">Become a Mentor</DropdownItem>
						{/if}
					{/if}
					{#if loggedInUser.role == 'Admin' || loggedInUser.role == 'Super Admin'}
						<DropdownItem href="/admin">Admin</DropdownItem>
					{/if}
					{#if loggedInUser.role == 'Advisor' || loggedInUser.role == 'Super Admin' || loggedInUser.is_leader}
						<DropdownItem
							href="#"
							on:click={() => {
								openVerify.set(true);
							}}>Verify Club</DropdownItem
						>
					{/if}
				{/if}
				{#if $user}
					<DropdownItem on:click={logout} href="/">Sign Out</DropdownItem>
				{/if}
			</Dropdown>
		{:else}
			<NavLi href="/auth/login">Log In</NavLi>
			<NavLi href="/auth/signup">Sign Up</NavLi>
		{/if} -->
		<!-- {#each mainGroup as m}
			<NavLi href="{m.value.url}">{m.value.name}</NavLi>
		{/each}
		{#if groupsNum > 1}
			{#each Array.from({ length: groupsNum }, (_, i) => i) as g}
				{g}
			{/each}
		{/if} -->
		<!-- {#each navGroups as group}
			{#each group as g}
				<NavLi href="{g.value.url}">{g.value.name}</NavLi>
			{/each}
		{/each} -->
		{#each groupedNav.main as nav}
			{#if nav.value.reqlogin == -1}
				<NavLi href="{nav.value.url}">{nav.value.name}</NavLi>
			{:else}
				{#if $user}
					<NavLi href="{nav.value.url}">{nav.value.name}</NavLi>
				{/if}
			{/if}
		{/each}

		<!-- Dropdowns -->
		{#if $user}
			{#each Object.entries(groupedNav).filter(([key]) => key !== "main" && key !== "auth") as [master, items]}
				{#if master == "User"}
					<NavLi class="cursor-pointer">
						{email} <ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 inline" />
					</NavLi>
				{:else}
					<NavLi class="cursor-pointer">
						{master} <ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 inline" />
					</NavLi>
				{/if}
				<Dropdown class="w-44 z-20 text-gray-500" {activeUrl} {activeClass} {nonActiveClass}>
					{#each items as nav}
						{#if nav.value.id == "signout"}
						<!-- I have to hard code this here (until a better solution is found) -->
							<DropdownItem on:click={logout} href="">Sign Out</DropdownItem>
						{:else}
							{#if nav.value.url.includes("http")}
								<!-- For links - always open in another tab. -->
								<DropdownItem target="_blank" href="{nav.value.url}">{nav.value.name}</DropdownItem>
							{:else}
								{#if nav.value.perms.length > 1}
									{#if nav.value.perms.includes($loggedInUser.role)}
										<DropdownItem href="{nav.value.url}">{nav.value.name}</DropdownItem>
									{/if}
								{:else}
									<DropdownItem href="{nav.value.url}">{nav.value.name}</DropdownItem>
								{/if}
							{/if}
						{/if}
					{/each}
					{#if master == "User"}
					<!-- I have to hard code this here (until a better solution is found) -->
						<DropdownItem
								href=""
								on:click={() => {
									openVerify.set(true);
								}}>Verify Club</DropdownItem
							>
					{/if}
				</Dropdown>
			{/each}
		{:else}
			{#each Object.keys(groupedNav).filter(master => master !== "main" && master !== "auth") as master}
				{#if groupedNav[master].some(nav => nav.value.reqlogin === -1)}
					<NavLi class="cursor-pointer">
					{master} <ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 inline" />
					</NavLi>
					<Dropdown class="w-44 z-20 text-gray-500" {activeUrl} {activeClass} {nonActiveClass}>
					{#each groupedNav[master].filter(nav => nav.value.reqlogin === -1) as nav}
						<DropdownItem href="{nav.value.url}">{nav.value.name}</DropdownItem>
					{/each}
					</Dropdown>
				{/if}
			{/each}
		{/if}

		<!-- Auth -->
		{#if !$user}
			{#each groupedNav.auth as nav}
				<NavLi href="{nav.value.url}">{nav.value.name}</NavLi>
			{/each}
		{/if}
			
	</NavUl>
</Navbar>

{/if}

<script>
	import '../app.css';
	import MainNav from './MainNav.svelte';
	import { inject } from '@vercel/analytics';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Alert } from "flowbite-svelte";
	import { getCollectionDoc, getCollection } from "$lib/api";
	import { auth } from '../lib/auth/firebaseConfig';

	let alerts;

	// Adds dynamic title to each page, paired with svelte:head below
	const appName = 'CRLS PathFinders';
	$: title =
		appName +
		' | ' +
		[appName, ...$page.url.pathname.split('/').slice(1)]
			.filter(Boolean)
			.findLast(Boolean)
			.replace(/-/g, ' ')
			.replace(/\b\w/g, (l) => l.toUpperCase());

	onMount(async () => {
		alerts = await getCollectionDoc("AllInfo", "alerts");
		console.log(alerts);
	})
</script>

<div class="mainlayoutwrapper bg-gray-100" style="height:100%;">
	<MainNav></MainNav>

	{#if alerts}
		{#if alerts.bad_announcements}
			{#each alerts.bad_announcements as abad}
				{#if abad.show}
					<center>
						<Alert color="red" border>
							<span class="font-medium">{abad.data}</span>
							<br>
						</Alert>
					</center>
				{/if}
			{/each}
		{/if}
		{#if alerts.good_announcements}
			{#each alerts.good_announcements as agood}
				{#if agood.show}
					<center>
						<Alert color="blue" border>
							<span class="font-medium">{agood.data}</span>
							<br>
						</Alert>
					</center>
				{/if}
			{/each}
		{/if}
	{/if}

	<slot></slot>
</div>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style>
	/* @media (prefers-color-scheme: dark) {
		* {
			color-scheme: light;
			background-color: white;
		}
	} */
	/* 
    @media (prefers-color-scheme: dark) {
    .dark .bg-gray-900,
    .dark .bg-gray-800,
    .dark .bg-gray-700,
    .dark .bg-gray-600,
    .dark .text-white,
    .dark .text-gray-300 {
        background-color: var(--tw-bg-opacity) white !important;
        color: var(--tw-text-opacity) black !important;
    }
    } */
</style>

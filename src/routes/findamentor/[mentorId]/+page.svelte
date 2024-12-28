<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getCollectionDoc } from '$lib/api';

	let ready = false;

	const clubId = $page.params.clubId;

	console.log(clubId);

	let clubInfo;

	onMount(async () => {
		clubInfo = await getCollectionDoc('Clubs', clubId);
		ready = true;
		console.log(clubInfo);
	});
</script>

{#if ready}
	<h1>Club name: {clubInfo.club_name}</h1>
	<h2>Club description: {clubInfo.club_description}</h2>
	<h3>Club room number: {clubInfo.room_number}</h3>
{/if}

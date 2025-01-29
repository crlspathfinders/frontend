<script>
	import { onMount } from 'svelte';
	import {
		Spinner,
		ListPlaceholder,
	} from 'flowbite-svelte';
	import { getCollection } from '$lib/api.js';
	// import EditMentor from "./EditMentor.svelte";
	import { writable } from 'svelte/store';
	import OpportunitiesTable from '../../opportunities/OpportunitiesTable.svelte';

	let wholeReady = writable(false);
	let mentors = [];

	// function handleBio(bio) {
	// 	if (bio.length > 50) {
	// 		return bio.substring(0, 50) + ' ... ';
	// 	}
	// 	return bio;
	// }

	// function labelIncludesSearchTerm(label, searchTerm) {
	// 	if (typeof label === 'string' && typeof searchTerm === 'string') {
	// 		return label.toLowerCase().includes(searchTerm.toLowerCase());
	// 	}
	// 	return false;
	// }

	// const handleDelete = async (email) => {
	// 	removeLoading.set(true);
	// 	try {
	// 		const res = await deleteMentor(email);
	// 		console.log(res);
	// 	} catch (error) {
	// 		console.log('Failed to delete mentor: ' + error);
	// 	} finally {
	// 		mentors = await getCollection('Mentors');
	// 		removeLoading.set(false);
	// 		closedeleteMentorConfirmModal();
	// 	}
	// };
	// const closedeleteMentorConfirmModal = () => deleteMentorConfirmModal.set(false);
	// let deleteMentorConfirmModal = writable(false);

	onMount(async () => {
		wholeReady.set(false);
		try {
			mentors = await getCollection('Mentors');
			console.log(mentors);
		} catch (error) {
			console.log('Onmount failed: ' + error);
		} finally {
			wholeReady.set(true);
		}
	});

</script>

{#if $wholeReady}
	<OpportunitiesTable view={'Edit'}></OpportunitiesTable>
{:else}
	<div style="text-align: center;">
		Gathering Data ... <Spinner color="green" />
		<ListPlaceholder></ListPlaceholder>
	</div>
{/if}

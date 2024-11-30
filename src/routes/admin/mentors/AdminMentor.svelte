<script>
	import { onMount } from 'svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Button,
		Dropdown,
		DropdownItem,
		Checkbox,
		ButtonGroup,
		A,
		Modal,
		Spinner,
		ListPlaceholder,
		Search,
		Toggle,
		P,
		Badge
	} from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
	// import paginationData from '../utils/advancedTable.json'
	import {
		PlusOutline,
		ChevronDownOutline,
		FilterSolid,
		ChevronRightOutline,
		ChevronLeftOutline
	} from 'flowbite-svelte-icons';
	import { getCollection } from '../../../lib/api';
	import EditMentor from './EditMentor.svelte';
	import { writable } from 'svelte/store';
	import { deleteMentor, toggleMentorShow } from '../../../lib/mentor';
	import { TableHeader } from 'flowbite-svelte-blocks';

	let wholeReady = writable(false);
	let deleteMentorConfirmModal = writable(false);
	let removeLoading = writable(false);
	let showCatalogModal = writable(false);

	let mentors = [];

	let searching = '';

	let editOn = false;

	let currMentor;

	let statusOn = false;

	let currEmail;

	function handleBio(bio) {
		if (bio.length > 50) {
			return bio.substring(0, 50) + ' ... ';
		}
		return bio;
	}

	let openRow;
	let currI;

	function handleDesc(desc) {
		if (desc.length > 50) {
			return desc.substring(0, 50) + ' ... ';
		}
		return desc;
	}

	const toggleRow = (i, desc) => {
		currI = i;
		// findDescription(desc);
		openRow = openRow === i ? null : i;
	};

	function labelIncludesSearchTerm(label, searchTerm) {
		if (typeof label === 'string' && typeof searchTerm === 'string') {
			return label.toLowerCase().includes(searchTerm.toLowerCase());
		}
		return false;
	}

	const handleToggleMentorShow = async () => {
		try {
			await toggleMentorShow(currEmail);
		} catch (error) {
			console.log(error);
		} finally {
			mentors = await getCollection('Mentors');
		}
	}

	const handleDelete = async (email) => {
		removeLoading.set(true);
		try {
			const res = await deleteMentor(email);
			console.log(res);
		} catch (error) {
			console.log('Failed to delete mentor: ' + error);
		} finally {
			mentors = await getCollection('Mentors');
			removeLoading.set(false);
			closedeleteMentorConfirmModal();
		}
	};

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

	const opendeleteMentorConfirmModal = () => deleteMentorConfirmModal.set(true);
	const closedeleteMentorConfirmModal = () => deleteMentorConfirmModal.set(false);

	const openShowCatalogModal = () => showCatalogModal.set(true);
	const closeShowCatalogModal = () => showCatalogModal.set(false);
</script>

{#if $deleteMentorConfirmModal}
	<Modal
		title="Delete {currEmail}"
		open={$deleteMentorConfirmModal}
		on:close={closedeleteMentorConfirmModal}
	>
		<p class="text-base leading-relaxed text-gray-800">
			Are you sure you want to permanently remove <b>{currEmail}</b>? You cannot undo this action.
		</p>
		<Button
			outline
			color="red"
			on:click={() => {
				handleDelete(currEmail);
			}}
		>
			Delete
			{#if $removeLoading}
				<Spinner size={4} color="red" />
			{/if}
		</Button>
	</Modal>
{/if}

<!-- Mentor Catalog Modal: -->
<Modal class="min-w-full" open={$showCatalogModal} on:close={closeShowCatalogModal} size="lg">
	<P size="xl">Mentor Hours</P>
	<P size="md">Something doesn't look right? Let us know at <u><a target="_blank" href="https://mail.google.com/mail/?view=cm&fs=1&to=crlspathfinders25@gmail.com&su=CRLS%20PathFinders%20Support">crlspathfinders25@gmail.com</a></u></P>
	<div>
		<div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-gray-500">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50">
						<tr>
							<th scope="col" class="px-4 py-3">Mentee</th>
							<th scope="col" class="px-4 py-3">Description</th>
							<th scope="col" class="px-4 py-3">Hours</th>
							<th scope="col" class="px-4 py-3">Date</th>
							<th scope="col" class="px-4 py-3">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each currMentor.hours_worked_catalog as c, i}
							<tr class="border-b">
								<td class="px-4 py-3 text-gray-800">{i + 1} | {c.mentee}</td>
								{#if openRow === i}
									<td class="px-4 py-3 text-gray-700" style="cursor:pointer; height:10rem;max-width:20rem; word-wrap:break-word" on:click={() => toggleRow(i, c)}>
										<div class="mentordescription">
											{c.description}
										</div>
									</td>
								{:else}
									{#if c.description.length > 50 }
										<td class="px-4 py-3 text-gray-700" style="cursor:pointer;" on:click={() => toggleRow(i, c)}>
											<div class="mentordescription">
												{handleDesc(c.description)}
											</div>
										</td>
									{:else}
										<td class="px-4 py-3 text-gray-700">
											<div class="mentordescription">
												{handleDesc(c.description)}
											</div>
										</td>
									{/if}
								{/if}
								<td class="px-4 py-3 text-gray-700">{c.hours}</td>
								<td class="px-4 py-3 text-gray-700">{c.date}</td>
								{#if c.status == -1}
									<td class="px-4 py-3">
										<Badge color="yellow">Waiting for mentee confirmation</Badge>
									</td>
								{:else if c.status == 0}
									<td class="px-4 py-3">
										<Badge color="green">Confirmed</Badge>
									</td>
								{/if}
							</tr>
						{/each}
						<tr class="border-b">
							<td class="px-4 py-3 text-gray-800">
								<Badge color="green">Total hours worked: <b> {currMentor.total_hours_worked}</b></Badge>
							</td>
						</tr>
						</tbody>
				</table>
			</div>
		</div>
	</div>
</Modal>

{#if $wholeReady}
	<EditMentor {editOn} {currMentor}></EditMentor>

	<section class="bg-gray-50 p-3 sm:p-5">
		<div>
			<TableHeader headerType="search">
				<Search
					bind:value={searching}
					slot="search"
					placeholder="Search {mentors.length} mentors"
					size="md"
				/>
				<div class=""></div>
			</TableHeader>
		</div>
		<br />
		<div>
			<div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full text-sm text-left text-gray-500">
						<thead class="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th scope="col" class="px-4 py-3">Edit</th>
								<th scope="col" class="px-4 py-3">Delete</th>
								<th scope="col" class="px-4 py-3">Show</th>
								<th scope="col" class="px-4 py-3">Catalog</th>
								<th scope="col" class="px-4 py-3">First Name</th>
								<th scope="col" class="px-4 py-3">Last Name</th>
								<th scope="col" class="px-4 py-3">Email</th>
								<th scope="col" class="px-4 py-3">Bio</th>
								<th scope="col" class="px-4 py-3">Hours</th>
								<th scope="col" class="px-4 py-3">Gender</th>
								<th scope="col" class="px-4 py-3">Language(s)</th>
								<th scope="col" class="px-4 py-3">Race(s)</th>
								<th scope="col" class="px-4 py-3">Religion(s)</th>
								<th scope="col" class="px-4 py-3">Academic(s)</th>
							</tr>
						</thead>
						<tbody>
							{#each mentors as m, i}
								{#if labelIncludesSearchTerm(m.email, searching)}
									<tr class="border-b">
										<td>
											<Button
												style="margin-left:1rem; margin-top:1rem;"
												outline
												color="dark"
												size="xs"
												on:click={() => {
													currMentor = m;
													editOn = !editOn;
												}}>Edit</Button
											>
										</td>
										<td class="px-2 py-1">
											<Button
												style="margin-left:1rem; margin-top:1rem;"
												outline
												color="red"
												size="xs"
												on:click={() => {
													currEmail = m.email;
													opendeleteMentorConfirmModal();
												}}
											>
												Delete
											</Button>
										</td>
										<td class="px-4 py-3">
											<Toggle
												color="green"
												checked={m.show}
												on:click={() => {
													currEmail = m.email;
													handleToggleMentorShow();
												}}
											></Toggle>
										</td>
										<td class="px-4 py-3">
											<Button size="xs" style="margin-left:1rem; margin-top:1rem;" outline color="purple" on:click={() => {openShowCatalogModal(); currMentor = m;}}>
												Show Mentor Catalog
											</Button>
										</td>
										<td class="px-4 py-3">{i + 1} | {m.firstname}</td>
										<td class="px-4 py-3">{m.lastname}</td>
										<td class="px-4 py-3"
											><a target="_blank" href="mailto:{m.email}"><u><b>{m.email}</b></u></a></td
										>
										<td class="px-4 py-3">{handleBio(m.bio)}</td>
										<td class="px-4 py-3">{m.total_hours_worked}</td>
										<td class="px-4 py-3">{m.gender}</td>
										<td class="px-4 py-3">{m.languages}</td>
										<td class="px-4 py-3">{m.races}</td>
										<td class="px-4 py-3">{m.religions}</td>
										<td class="px-4 py-3">{m.academics}</td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</section>
{:else}
	<center>
		Gathering Data ... <Spinner color="green" />
		<ListPlaceholder></ListPlaceholder>
	</center>
{/if}

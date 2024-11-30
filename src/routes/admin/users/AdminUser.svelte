<script>
	import { onMount } from 'svelte';
	import {
		Button,
		Modal,
		Select,
		Label,
		Spinner,
		P,
		ListPlaceholder,
		Search,
		Toggle
	} from 'flowbite-svelte';
	import { getCollection } from '../../../lib/api';
	import { writable } from 'svelte/store';
	import {
		roleChoices,
		changeUserRole,
		deleteUser,
		getUserDocData,
		toggleLeaderMentor
	} from '../../../lib/user';
	import { user } from '../../../stores/auth';
	import { TableHeader } from 'flowbite-svelte-blocks';

	let wholeReady = writable(false);
	let roleModalOpen = writable(false);
	let deleteModalOpen = writable(false);
	let isLoading = writable(false);
	let showMenteeLogs = writable(false);

	let users = [];

	let currUser;
	let currRole;
	let roleColor;
	let email;
	let loggedInUser;

	let searching = '';

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

	function setTableClass(email) {
		let tableClass = 'border-b';
		if (email.localeCompare(loggedInUser.email) === 0) {
			tableClass = 'border-b bg-gray-200';
			return tableClass;
		}
		return tableClass;
	}

	function setRoleColor(role) {
		const roleInd = roleChoices.findIndex((p) => p.name == role);
		roleColor = roleChoices[roleInd].color;
		return roleColor;
	}

	function setRoleChoices(role) {
		if (role.localeCompare('Admin') === 0) {
			let newRoleChoices = [];
			for (let i = 0; i < roleChoices.length - 2; i++) {
				// Copy all except admin & super admin
				newRoleChoices.push(roleChoices[i]);
			}
			console.log(newRoleChoices);
			return newRoleChoices;
		}
		return roleChoices;
	}

	const handleToggleLeaderMentor = async (email, leaderMentor, toggle) => {
		try {
			const res = await toggleLeaderMentor(email, leaderMentor, toggle);
			console.log(res);
		} catch (error) {
			console.log('Failed to toggle leader mentor: ' + error);
		}
	};

	const handleRoleChange = async () => {
		isLoading.set(true);
		try {
			const res = await changeUserRole(currUser.email, currRole);
			console.log(res);
		} catch (error) {
			console.log("Failed to change user's role: " + error);
		} finally {
			users = await getCollection('Users');
			isLoading.set(false);
			closeRoleModal();
		}
	};

	const handleDelete = async (email) => {
		isLoading.set(true);
		try {
			const res = await deleteUser(email);
			console.log(res);
		} catch (error) {
			console.log('Failed to delete user: ' + error);
		} finally {
			users = await getCollection('Users');
			isLoading.set(false);
			closeDeleteModal();
		}
	};

	onMount(async () => {
		wholeReady.set(false);
		try {
			users = await getCollection('Users');
			console.log(users);
			user.subscribe((value) => {
				if (value) {
					email = value.email;
				} else {
					email = '';
				}
			});
			loggedInUser = await getUserDocData(email);
			console.log(loggedInUser);
		} catch (error) {
			console.log('Onmount failed: ' + error);
		} finally {
			wholeReady.set(true);
		}
	});

	const openRoleModal = () => roleModalOpen.set(true);
	const closeRoleModal = () => roleModalOpen.set(false);

	const openDeleteMModal = () => deleteModalOpen.set(true);
	const closeDeleteModal = () => deleteModalOpen.set(false);

	const openShowMenteeLogs = () => showMenteeLogs.set(true);
	const closeShowMenteeLogs = () => showMenteeLogs.set(false);
</script>

<!-- Role Modal: -->
{#if $roleModalOpen}
	<Modal title="Change {currUser.email} role" open={$roleModalOpen} on:close={closeRoleModal}>
		<p class="text-base leading-relaxed text-gray-800">
			<Label>
				Current role:
				<Select class="mt-2" items={setRoleChoices(loggedInUser.role)} bind:value={currRole} />
			</Label>
			<br />
			<Button outline color={setRoleColor(currRole)} type="submit" on:click={handleRoleChange}>
				Change Role
				{#if $isLoading}
					<Spinner size={4} color="purple" />
				{/if}
			</Button>
		</p>
	</Modal>
{/if}

<!-- Delete Modal: -->
{#if $deleteModalOpen}
	<Modal title="Delete Member" open={$deleteModalOpen} on:close={closeDeleteModal}>
		<p class="text-base leading-relaxed text-gray-800">
			Deleting <b>{currUser.email}</b> will permanently delete their account. They will have sign back
			up to rejoin the site. You cannot undo this action.
		</p>
		<Button outline color="red" on:click={handleDelete(currUser.email)}>
			Delete
			{#if $isLoading}
				<Spinner size={4} color="red" />
			{/if}
		</Button>
	</Modal>
{/if}

<!-- Mentee Logs Modal: -->
<Modal title="Mentee Logs" open={$showMenteeLogs} on:close={closeShowMenteeLogs} size="lg">
	<div>
		<div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-gray-500">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50">
						<tr>
							<th scope="col" class="px-4 py-3">Mentor</th>
							<th scope="col" class="px-4 py-3">Hours</th>
							<th scope="col" class="px-4 py-3">Description</th>
							<th scope="col" class="px-4 py-3">Date Confirmed</th>
							<th scope="col" class="px-4 py-3">Date Met</th>
						</tr>
					</thead>
					<tbody>
						{#each currUser.mentee_logs as c, i}
							<tr class="border-b">
								<td class="px-4 py-3 text-gray-800">{i + 1} | {c.mentor}</td>
								<td class="px-4 py-3 text-gray-700">{c.hours}</td>
								<!-- <td class="px-4 py-3 text-gray-700">{c.description}</td> -->
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
								<td class="px-4 py-3 text-gray-700">{c.date_confirmed}</td>
								<td class="px-4 py-3 text-gray-700">{c.date_met}</td>
								<!-- {#if c.status == -1}
									<td class="px-4 py-3">
										<Badge color="yellow">Waiting for mentee confirmation</Badge>
									</td>
								{:else if c.status == 0}
									<td class="px-4 py-3">
										<Badge color="green">Confirmed</Badge>
									</td>
								{/if} -->
							</tr>
						{/each}
						<!-- <tr class="border-b">
							<td class="px-4 py-3 text-gray-800">Total hours worked: <b>{currMentor.total_hours_worked}</b></td>
						</tr> -->
						</tbody>
				</table>
			</div>
		</div>
	</div>
</Modal>

{#if $wholeReady}
	<section class="bg-gray-50 p-3 sm:p-5">
		<div>
			<TableHeader headerType="search">
				<Search
					bind:value={searching}
					slot="search"
					placeholder="Search {users.length} users"
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
								<th scope="col" class="px-4 py-3">Role</th>
								<th scope="col" class="px-4 py-3">Delete</th>
								<th scope="col" class="px-4 py-3">Email</th>
								<th scope="col" class="px-4 py-3">Grade</th>
								<th scope="col" class="px-4 py-3">Joined Clubs</th>
								<th scope="col" class="px-4 py-3">Is Leader</th>
								<th scope="col" class="px-4 py-3">Is Mentor-Eligible</th>
								<th scope="col" class="px-4 py-3">Is Mentor</th>
								<th scope="col" class="px-4 py-3">Is Mentee</th>
							</tr>
						</thead>
						<tbody>
							{#each users as user, i}
								{#if labelIncludesSearchTerm(user.email, searching) || labelIncludesSearchTerm(user.role, searching)}
									<tr class={setTableClass(user.email)}>
										<td class="px-4 py-3">
											{#if loggedInUser.role == 'Admin' && user.role == 'Super Admin'}
												<Button outline color={setRoleColor(user.role)} size="xs" disabled>
													{user.role}
												</Button>
											{:else}
												<Button
													outline
													color={setRoleColor(user.role)}
													size="xs"
													on:click={() => {
														currUser = user;
														currRole = user.role;
														openRoleModal();
													}}
												>
													{user.role}
												</Button>
											{/if}
										</td>
										{#if loggedInUser.role == 'Admin'}
											<td class="px-2 py-1">
												<Button outline color="red" size="xs" disabled>Delete</Button>
											</td>
										{:else}
											<td class="px-2 py-1">
												<Button
													outline
													color="red"
													size="xs"
													on:click={() => {
														currUser = user;
														currRole = user.role;
														openDeleteMModal();
													}}>Delete</Button
												>
											</td>
										{/if}
										<th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap"
											>{i + 1} | <b><u>{user.email}</u></b></th
										>
										<th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap"
											>{user.grade}</th
										>
										<td class="px-4 py-3">{user.joined_clubs}</td>
										<td class="px-4 py-3">
											<Toggle
												color="green"
												checked={user.is_leader}
												on:change={handleToggleLeaderMentor(user.email, 'Leader', !user.is_leader)}
											></Toggle>
										</td>
										<td class="px-4 py-3">
											<Toggle
												color="yellow"
												checked={user.mentor_eligible}
												on:change={handleToggleLeaderMentor(
													user.email,
													'Mentor-Eligible',
													!user.mentor_eligible
												)}
											></Toggle>
										</td>
										<td class="px-4 py-3">
											<Toggle
												color="blue"
												checked={user.is_mentor}
												on:change={handleToggleLeaderMentor(user.email, 'Mentor', !user.is_mentor)}
											></Toggle>
										</td>
										<td class="px-4 py-3">
											{#if user.is_mentee}
												<!-- <b>Yes</b> -->
												<Button color="purple" outline size="xs" on:click={() => {
													currUser = user;
													openShowMenteeLogs()}}>
													Logs
												</Button>
											{:else}
												<b>No</b>
											{/if}
										</td>
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

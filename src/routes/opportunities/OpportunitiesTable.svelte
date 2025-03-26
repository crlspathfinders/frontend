<script>
	import { onMount } from 'svelte';
	import {
		Search,
		Button,
		Modal,
		Spinner,
		Skeleton,
		Heading,
		Span,
		P,
		Tabs,
		TabItem
	} from 'flowbite-svelte';
	import { TableHeader } from 'flowbite-svelte-blocks';
	import {
		getCollection,
		wholeWebsiteData,
		updateWholeWebsiteData,
		getCollectionDoc
	} from '$lib/api.js';
	import { writable } from 'svelte/store';
	import {
		Label,
		Input,
		Textarea,
		MultiSelect,
		Badge,
		Dropdown,
		DropdownItem,
		Checkbox
	} from 'flowbite-svelte';
	import {
		addLink,
		deleteLink,
		editLink,
		makeSelectCategoriesOk,
		editCategories,
		addCategory,
		deleteCategory
	} from '$lib/opportunities.js';
	import BaseTable from './BaseTable.svelte';
	let allReady = writable(false);
	let deleteLinkConfirmModal = writable(false);
	let isLoading = writable(false);
	let showCreateLinkModal = writable(false);
	let showEditLinkModal = writable(false);
	let showManageLinkCategories = writable(false);
	let addLoading = writable(false);
	let deleteLoading = writable(false);
	let filtersSelected = writable([]);

	let searching = '';
	let opportunities = [];
	let categories = [];
	let selectedCategories = [];
	let currCats = [];
	let currEditCat = '';
	let newCat = '';
	let deleteCat = '';

	let linkName = '';
	let linkUrl = '';

	let oldLinkName = '';
	let currLinkName = '';
	let currLinkUrl = '';

	let bio = '';
	let deadline = '';
	let currBio = '';
	let currDeadline = '';
	let all_opportunities;

	let info;

	function toggleFilters(item) {
		filtersSelected.update((currentItems) => {
			// Check if the item exists in the array
			if (currentItems.includes(item)) {
				// Remove the item if it exists
				return currentItems.filter((i) => i !== item);
			} else {
				// Add the item if it doesn't exist
				return [...currentItems, item];
			}
		});
	}

	$: filteredLinks = opportunities.filter((obj) => {
		// Only apply filters to fields that have values in the arrays
		return $filtersSelected.every((filter) => {
			return obj.categories.length > 0 && obj.categories.includes(filter);
		});
	});

	function labelIncludesSearchTerm(label, searchTerm) {
		if (typeof label === 'string' && typeof searchTerm === 'string') {
			return label.toLowerCase().includes(searchTerm.toLowerCase());
		}
		return false;
	}

	const handleDeleteLink = async () => {
		isLoading.set(true);
		try {
			const res = await deleteLink(currLinkName);
			console.log(res);
			closedeleteLinkConfirmModal();
		} catch (error) {
			console.log('Failed to delete link: ' + error);
		} finally {
			if (all_opportunities) {
				console.log('found opps');
				opportunities = all_opportunities;
			} else {
				console.log('not found opps');
				opportunities = await getCollection('Opportunities');
			}
			for (let i = 0; i < categories.length; i++) {
				if (categories[i].id === 'Opportunities') {
					categories = categories[i].categories;
				}
			}
			categories = makeSelectCategoriesOk(categories);
			isLoading.set(false);
		}
	};

	const handleAddLink = async () => {
		isLoading.set(true);
		try {
			// const correctedCats = selectedCategories.join(", ");
			// console.log(correctedCats);
			await addLink(linkName, linkUrl, selectedCategories, bio, deadline);

			opportunities = await getCollection('Opportunities');

			console.log('Successfully added link');
			linkName = '';
			linkUrl = '';
			bio = '';
			deadline = '';
		} catch (error) {
			console.log(`Failed to add link ${error}`);
		} finally {
			isLoading.set(false);
			opportunities = await getCollection('Opportunities');
		}
	};

	const handleEditLink = async () => {
		isLoading.set(true);
		try {
			await editLink(oldLinkName, currLinkName, currLinkUrl, currCats, currBio, currDeadline);
			// UPDATE locstor
			console.log('Successfully edited link');
			currLinkName = '';
			currLinkUrl = '';
			oldLinkName = '';
			selectedCategories = [];
			currBio = '';
			currDeadline = '';
		} catch (error) {
			console.log(`Failed to edit link ${error}`);
		} finally {
			isLoading.set(false);
			opportunities = await getCollection('Opportunities');
			closeshowEditLinkModal();
		}
	};

	const handleEditCategory = async (newCatId, newCat) => {
		isLoading.set(true);
		let oldCat = '';
		try {
			oldCat = categories[newCatId].value;
			console.log('Old cat: ' + oldCat + '. New cat: ' + newCat);
			await editCategories(oldCat, newCat);
		} catch (error) {
			console.log('Failed to edit category: ' + error);
		} finally {
			// Update the demographics collection:
			// LEAVE FOR NOW
			categories = await getCollection('Demographics');
			for (let i = 0; i < categories.length; i++) {
				if (categories[i].id === 'Opportunities') {
					categories = categories[i].categories;
				}
			}
			categories = makeSelectCategoriesOk(categories);
			opportunities = await getCollection('Opportunities');

			let currOppCats;
			for (let i = 0; i < opportunities.length; i++) {
				currOppCats = opportunities[i].categories;
				for (let j = 0; j < currOppCats.length; j++) {
					if (currOppCats[i] === oldCat) {
						currOppCats[i] = newCat;
						oldLinkName = opportunities[i].name;
						currLinkName = opportunities[i].name;
						currLinkUrl = opportunities[i].src;
						currCats = currOppCats;
						currBio = opportunities[i].bio;
						currDeadline = opportunities[i].deadline;
						await handleEditLink();
					}
				}
			}
			isLoading.set(false);
		}
	};

	const handleAddCategory = async () => {
		addLoading.set(true);
		try {
			await addCategory(newCat);
			newCat = '';
		} catch (error) {
			console.log('Failed to create category: ' + error);
		} finally {
			categories = await getCollection('Demographics');
			for (let i = 0; i < categories.length; i++) {
				if (categories[i].id === 'Opportunities') {
					categories = categories[i].categories;
				}
			}
			categories = makeSelectCategoriesOk(categories);
			addLoading.set(false);
		}
	};

	const handleDeleteCategory = async () => {
		deleteLoading.set(true);
		try {
			await deleteCategory(deleteCat);
			newCat = '';
		} catch (error) {
			console.log('Failed to delete category: ' + error);
		} finally {
			categories = await getCollection('Demographics');
			for (let i = 0; i < categories.length; i++) {
				if (categories[i].id === 'Opportunities') {
					categories = categories[i].categories;
				}
			}
			categories = makeSelectCategoriesOk(categories);
			deleteLoading.set(false);
		}
	};

	onMount(async () => {
		allReady.set(false);
		let targetId = wholeWebsiteData.findIndex((item) => item.id === 'opportunities');
		if (targetId > -1) {
			opportunities = wholeWebsiteData[targetId].info;
		} else {
			opportunities = await getCollection('Opportunities');
			updateWholeWebsiteData('opportunities', opportunities);
		}

		all_opportunities = opportunities;

		targetId = wholeWebsiteData.findIndex((item) => item.id === 'categories');
		if (targetId > -1) {
			categories = wholeWebsiteData[targetId].info;
		} else {
			categories = await getCollectionDoc('Demographics', 'Opportunities');
			updateWholeWebsiteData('categories', categories);
		}

		targetId = wholeWebsiteData.findIndex(item => item.id === "allinfo");
		if (targetId > -1) {
			const allInfo = wholeWebsiteData[targetId].info;
			for (let i = 0; i < allInfo.length; i++) {
				if (allInfo[i].id == "opportunities") { info = allInfo[i].info; }
			}
		} else {
			const allInfo = await getCollection("AllInfo");
			for (let i = 0; i < allInfo.length; i++) {
				if (allInfo[i].id == "opportunities") { info = allInfo[i].info; }
			}
			updateWholeWebsiteData("allinfo", allInfo);
		}

		categories = categories.categories;

		categories = makeSelectCategoriesOk(categories);
		console.log(categories);
		allReady.set(true);
	});

	export let view = 'View';

	const opendeleteLinkConfirmModal = () => deleteLinkConfirmModal.set(true);
	const closedeleteLinkConfirmModal = () => deleteLinkConfirmModal.set(false);

	const openShowCreateLinkModal = () => showCreateLinkModal.set(true);
	const closeShowCreateLinkModal = () => showCreateLinkModal.set(false);

	const openShowEditLinkModal = () => showEditLinkModal.set(true);
	const closeshowEditLinkModal = () => showEditLinkModal.set(false);

	const openShowManageLinkCategories = () => showManageLinkCategories.set(true);
	const closeShowManageLinkCategories = () => showManageLinkCategories.set(false);
</script>

{#if $deleteLinkConfirmModal}
	<Modal title="Delete link" open={$deleteLinkConfirmModal} on:close={closedeleteLinkConfirmModal}>
		<p class="text-base leading-relaxed text-gray-800">
			Are you sure you want to permanently remove <b></b>? You cannot undo this action.
		</p>
		<Button outline color="red" on:click={handleDeleteLink}>
			Delete
			{#if $isLoading}
				<Spinner size={4} color="red" />
			{/if}
		</Button>
	</Modal>
{/if}

<!-- Create link: -->
{#if $showCreateLinkModal}
	<Modal title="Add a link" open={$showCreateLinkModal} on:close={closeShowCreateLinkModal}>
		<form on:submit={handleAddLink}>
			<div class="w-full">
				<Label for="category" class="mb-2">Category</Label>
				<MultiSelect
					placeholder="Select a category"
					items={categories}
					bind:value={selectedCategories}
				/>
			</div>
			<div class="w-full">
				<Label for="name" class="mb-2">Name</Label>
				<Input type="text" id="name" placeholder="Name123" bind:value={linkName} required />
			</div>
			<div class="w-full">
				<Label for="linkurl" class="mb-2">Link url</Label>
				<Input
					type="text"
					id="linkurl"
					placeholder="https://name123link.com"
					bind:value={linkUrl}
					required
				/>
			</div>
			<div class="w-full">
				<Label for="linkurl" class="mb-2">Deadline</Label>
				<Input
					type="text"
					id="deadline"
					placeholder="May 10, 2025"
					bind:value={deadline}
					required
				/>
			</div>
			<div class="w-full">
				<Label for="linkbio" class="mb-2">Bio</Label>
				<Textarea id="linkbio" rows="10" placeholder="Link Bio" bind:value={bio} required
				></Textarea>
			</div>
			<br />
			<Button outline color="purple" type="submit" class="w-32">
				Add link
				{#if $isLoading}
					<Spinner size={5} color="purple" />
				{/if}
			</Button>
		</form>
	</Modal>
{/if}

<!-- Edit link: -->
{#if $showEditLinkModal}
	<Modal title="Add a link!" open={$showEditLinkModal} on:close={closeshowEditLinkModal}>
		<form on:submit={handleEditLink}>
			<div class="w-full">
				<Label for="category" class="mb-2">Category</Label>
				<MultiSelect placeholder="Select a category" items={categories} bind:value={currCats} />
			</div>
			<div class="w-full">
				<Label for="name" class="mb-2">Name</Label>
				<Input type="text" id="name" placeholder="Name123" bind:value={currLinkName} required />
			</div>
			<div class="w-full">
				<Label for="linkurl" class="mb-2">Link url</Label>
				<Input
					type="text"
					id="linkurl"
					placeholder="https://name123link.com"
					bind:value={currLinkUrl}
					required
				/>
			</div>
			<div class="w-full">
				<Label for="linkurl" class="mb-2">Deadline</Label>
				<Input
					type="text"
					id="deadline"
					placeholder="May 10, 2025"
					bind:value={currDeadline}
					required
				/>
			</div>
			<div class="w-full">
				<Label for="linkbio" class="mb-2">Bio</Label>
				<Textarea id="linkbio" rows="10" placeholder="Link Bio" bind:value={currBio} required
				></Textarea>
			</div>
			<br />
			<Button outline color="purple" type="submit" class="w-32">
				Edit link
				{#if $isLoading}
					<Spinner size={5} color="purple" />
				{/if}
			</Button>
		</form>
	</Modal>
{/if}

<!-- Manage link categories: -->
{#if $showManageLinkCategories}
	<Modal
		title="Manage categories"
		open={$showManageLinkCategories}
		on:close={closeShowManageLinkCategories}
	>
		<table class="w-full text-sm text-left text-gray-500">
			<tbody>
				<tr class="border-b" style="padding:2rem;">
					<td class="px-2 py-1">
						<form on:submit={handleAddCategory}>
							<div class="editcatsformwrapper" style="display:flex;gap:.5rem;">
								<Input placeholder="Add new category" bind:value={newCat} />
								<Button outline color="green" type="submit"
									>Add
									{#if $addLoading}
										<Spinner color="blue" size={4} />
									{/if}
								</Button>
							</div>
						</form>
					</td>
				</tr>
				{#each categories as cat}
					<tr class="border-b" style="padding:2rem;">
						<td class="px-2 py-1">
							<form
								on:submit={() => {
									currEditCat = cat.name;
									handleEditCategory(cat.catId, currEditCat);
								}}
							>
								<div class="editcatsformwrapper" style="display:flex;gap:.5rem;">
									<Input bind:value={cat.name} />
									{#if $isLoading}
										<Button disabled outline color="blue" type="submit"
											>Update
											{#if $isLoading && cat.name === currEditCat}
												<Spinner color="blue" size={4} />
											{/if}
										</Button>
									{:else}
										<Button outline color="blue" type="submit"
											>Update
											{#if $isLoading && cat.name === currEditCat}
												<Spinner color="blue" size={4} />
											{/if}
										</Button>
									{/if}
								</div>
							</form>
						</td>
						<td class="px-2 py-1">
							<Button
								outline
								color="red"
								on:click={() => {
									deleteCat = cat.name;
									handleDeleteCategory();
								}}
							>
								Delete
								{#if $deleteLoading && deleteCat === cat.name}
									<Spinner color="red" size={4} />
								{/if}
							</Button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Modal>
{/if}

<div class="opportunitieswrapper">
	{#if $allReady}
	<div class="infowrapper" style="margin-left:3rem;margin-right:3rem;margin-top:1rem;">
		<Heading tag="h4" customSize="text-4xl font-extrabold" class="dark:text-gray-100"
			><Span underline decorationClass="decoration-8 decoration-red-800 dark:decoration-red-600">Opportunities</Span></Heading
		>
		<br>
		{#each info as inf, i}
			{#if i == 0}
				<P size="xl">{inf}</P>
			{:else if i == 1}
				<P size="lg">{inf}</P>
			{:else}
				<P size="sm">{inf}</P>
			{/if}
		{/each}
	</div>
		<section class="bg-gray-50 p-3 sm:p-5">
			<div>
				<TableHeader headerType="search">
					<Search bind:value={searching} slot="search" placeholder="Search" size="md" />
					<div class=""></div>
					{#if view === 'Edit'}
						<Button
							outline
							color="purple"
							on:click={() => {
								openShowCreateLinkModal();
							}}
						>
							Create link
						</Button>
						<Button
							outline
							color="purple"
							on:click={() => {
								openShowManageLinkCategories();
							}}
						>
							Manage categories
						</Button>
					{/if}
					<Button outline color="purple">Filters</Button>
					<Dropdown class="w-48 p-3 space-y-2 text-sm">
						{#each categories as cat}
							<DropdownItem class="flex items-center justify-between">
								{#if $filtersSelected.includes(cat.name)}
									<Checkbox
										checked
										on:change={() => {
											toggleFilters(cat.name);
										}}
										><li>{cat.name}</li>
									</Checkbox>
								{:else}
									<Checkbox
										on:change={() => {
											toggleFilters(cat.name);
											console.log($filtersSelected);
										}}
										><li>{cat.name}</li>
									</Checkbox>
								{/if}
							</DropdownItem>
						{/each}
					</Dropdown>
					<Button
						outline
						color="dark"
						on:click={() => {
							filtersSelected.set([]);
						}}>Reset filters</Button
					>
				</TableHeader>
				{#if $filtersSelected.length > 0}
					<br />
					{#if $filtersSelected.length > 0}
						{#each $filtersSelected as f}
							<Badge color="purple" style="margin-right:1rem;">{f}</Badge>
						{/each}
					{/if}
				{/if}
			</div>
			<br />
			<Tabs tabStyle="underline">
				<TabItem open title="All">
					<BaseTable {view} {opportunities} {searching} {filteredLinks} {labelIncludesSearchTerm}/>
				</TabItem>
				<TabItem title="Scholarships">
					<BaseTable {view} {opportunities} {searching} {filteredLinks} {labelIncludesSearchTerm} extraFilterField="categories" extraFilter="Scholarships"/>
				</TabItem>
				<TabItem title="Programs / Opportunties">
					<BaseTable {view} {opportunities} {searching} {filteredLinks} {labelIncludesSearchTerm} extraFilterField="categories" extraFilter="Programs / Opportunities"/>
				</TabItem>
			</Tabs>
		</section>
	{:else}
		<div style="text-align: center;">
			<div class="loadingwrapper" style="font-size:large; margin-top:1rem;">
				Loading Opportunities Links ... <Spinner color="blue" />
			</div>
		</div>

		<Skeleton size="sm" class="my-8" />
	{/if}
</div>

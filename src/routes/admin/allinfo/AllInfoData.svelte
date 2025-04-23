<script>
	import { onMount } from 'svelte';
	import { getCollectionDoc, getCollection, deleteDoc } from '../../../lib/api';
	import {
		TableHeader,
		Section,
		SidebarBottomNav,
		SidebarBottomNavItem
	} from 'flowbite-svelte-blocks';
	import {
		Search,
		Button,
		Table,
		TableBody,
		TableBodyRow,
		Toggle,
		Spinner,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		Dropdown,
		DropdownItem,
		A,
		Badge,
		Input,
		Modal,
		P,
        ButtonGroup
	} from 'flowbite-svelte';
	import { writable } from 'svelte/store';
	import { CheckCircleOutline, CloseOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { updateAllInfo } from '$lib/allinfo';

	let wholeReady = writable(false);
	let isLoading = writable(false);
	let showEdit = writable(false);
	let showDeleteModal = writable(false);
	let showUpdateModal = writable(false);
	let addLocation = writable('');
	let editValue = writable('');
	let confirmDeleteDoc = writable(false);

	let allInfo;
	let data;
	let specInfo = [];
	let searching = '';
	let selectedItem = '';
	let newVal = '';
	let selectedItemLocation = '';
	let addItem;
	let editItem = '';
	let isObj = false;

	let isDict = writable(false);
	let dictMiniColl;
	let isDictUpdate = writable(false);
	let isDictNewItem = writable(false);
	let newDictItem;

	export let clickedCollection = 'rehaan';
	export let wholeCollection = {};

	const handleDeleteDoc = async () => {
		try {
			await deleteDoc('AllInfo', clickedCollection);
		} catch (error) {
			console.log(error);
		} finally {
			confirmDeleteDoc.set(false);
		}
	};

	const handleEdit = async (oldVal, toggle = false) => {
		if (toggle) console.log('TOGGLE FOUND');
		isLoading.set(true);
		try {
			console.log(clickedCollection);
			for (let i = 0; i < allInfo.length; i++) {
				if (allInfo[i]['id'] == clickedCollection) {
					console.log(selectedItemLocation);
					let newVals = allInfo[i][selectedItemLocation];
					console.log(newVals);
					if (typeof newVals[0] == 'object') {
						// newVals is a list of dictionaries (alerts, for ex)
						oldVal = oldVal.data;
						console.log('oldVal:', oldVal);
						for (let j = 0; j < newVals.length; j++) {
							console.log(newVals[j], oldVal);
							if (newVals[j].data === oldVal) {
								// "data" is the hard-coded key. Make sure every kind has editable key called data or else bug here.
								if (toggle) {
									console.log('toggle ok');
									let temp = newVals[j];
									temp.show = !temp.show;
									console.log(temp);
									newVals[j] = temp;
									break;
								} else {
									console.log('no toggle ok');
									let temp = newVals[j];
									temp.data = editItem;
									// console.log(temp);
									newVals[i] = temp;
									break;
								}
							} else console.log('not found');
						}
					} else {
						newVals[newVals.indexOf(oldVal)] = editItem;
					}
					console.log(newVals);
					let send = {};
					send[selectedItemLocation] = newVals;
					console.log(send);
					const result = await updateAllInfo(clickedCollection, send);
					if (result['status'] == 0) {
						allInfo = await getCollection('AllInfo');
						data = await getCollectionDoc('AllInfo', allInfo[i].id);
						const spec = {
							id: allInfo[i].id,
							info: data
						};
						specInfo.push(spec);
						isLoading.set(false);
						return 0;
					} // If some failure
					console.log(result.error_message);
				}
			}
		} catch (error) {
			console.log(error);
			return -1;
		} finally {
			isLoading.set(false);
		}
	};

	const handleAddNewItem = async () => {
		isLoading.set(true);
		try {
			for (let i = 0; i < allInfo.length; i++) {
				if (allInfo[i]['id'] == clickedCollection) {
					let newVals = allInfo[i][selectedItemLocation];
					if (typeof newVals[0] == 'object') {
						// newVals is a list of dictionaries (alerts, for ex)
						let temp = { show: false, data: addItem };
						newVals.push(temp);
					} else {
						newVals.push(addItem);
					}
					let send = {};
					send[selectedItemLocation] = newVals;
					console.log(send);
					const result = await updateAllInfo(clickedCollection, send);
					if (result['status'] == 0) {
						allInfo = await getCollection('AllInfo');
						data = await getCollectionDoc('AllInfo', allInfo[i].id);
						const spec = {
							id: allInfo[i].id,
							info: data
						};
						specInfo.push(spec);
						isLoading.set(false);
						return 0;
					} // If some failure
					console.log(result);
				}
			}
		} catch (error) {
			return -1;
		} finally {
			isLoading.set(false);
		}
	};

	const handleDelete = async () => {
		console.log('delete starting');
		isLoading.set(true);
		try {
			console.log(clickedCollection);
			for (let i = 0; i < allInfo.length; i++) {
				if (allInfo[i]['id'] == clickedCollection) {
					let newVals = allInfo[i][selectedItemLocation];
					console.log(newVals);
					selectedItem = selectedItem.replace(/-/g, ' ');
					if (isObj) {
						for (let j = 0; j < newVals.length; j++) {
							console.log(newVals[j]);
							if (newVals[j].data === selectedItem) {
								newVals.splice(newVals.indexOf(newVals[j]), newVals.indexOf(newVals[j]));
							}
						}
					} else {
						newVals.splice(newVals.indexOf(selectedItem), newVals.indexOf(selectedItem));
					}
					console.log(newVals);
					let send = {};
					send[selectedItemLocation] = newVals;
					console.log(send);
					const result = await updateAllInfo(clickedCollection, send);
					if (result['status'] == 0) {
						allInfo = await getCollection('AllInfo');
						data = await getCollectionDoc('AllInfo', allInfo[i].id);
						const spec = {
							id: allInfo[i].id,
							info: data
						};
						specInfo.push(spec);
						isLoading.set(false);
						return 0;
					} // If some failure
					console.log(result);
				}
			}
		} catch (error) {
			return -1;
		} finally {
			isLoading.set(false);
		}
	};

	const handleDictUpdate = async () => {
		if ($isDictNewItem) { console.log("updating list dict", newDictItem); }
		console.log('dict delete starting');
		isLoading.set(true);
		try {
			console.log(clickedCollection);
			for (let i = 0; i < allInfo.length; i++) {
				if (allInfo[i]['id'] == clickedCollection) {
					let newVals = allInfo[i][selectedItemLocation];
					console.log(dictMiniColl);
					console.log(newVals);
					console.log(newVals[dictMiniColl]);
					let tempList = newVals[dictMiniColl];
					console.log(typeof tempList);
					if (typeof tempList === "string" || typeof tempList === "number") {
						if ($isDictUpdate) {
							newVals[dictMiniColl] = $editValue;
						} else {
							newVals[dictMiniColl] = "";
						}
					} else {
						if ($isDictNewItem) {
							console.log("dictisnewitem")
							tempList.push(newDictItem);
							console.log(tempList);
							// break;
						} else {
							for (let j = 0; j < tempList.length; j++) {
							console.log(typeof tempList[j], tempList[j]);
							if (tempList[j] === selectedItem) {
								console.log("found", tempList.indexOf(tempList[j]));
								if ($isDictUpdate) {
									tempList[j] = $editValue;
									break;
								}
								} else {
									if (j == 0) { tempList.splice(j, j+1)}
									else { tempList.splice(j, j); }
									break;
								}
								
							}
							console.log(tempList);
							newVals[dictMiniColl] = tempList;
						}
						
					}
					let send = newVals;
					console.log(send);
					// console.log(newVals);
					console.log(clickedCollection);
					const result = await updateAllInfo(clickedCollection, send);
					if (result['status'] == 0) {
						allInfo = await getCollection('AllInfo');
						data = await getCollectionDoc('AllInfo', allInfo[i].id);
						const spec = {
							id: allInfo[i].id,
							info: data
						};
						specInfo.push(spec);
						isLoading.set(false);
						return 0;
					} // If some failure
					console.log(result);
				}
			}
		} catch (error) {
			return -1;
		} finally {
			isLoading.set(false);
		}
	};

	onMount(async () => {
		wholeReady.set(false);
		allInfo = await getCollection('AllInfo');
		for (let i = 0; i < allInfo.length; i++) {
			data = await getCollectionDoc('AllInfo', allInfo[i].id);
			console.log(data);
			const spec = {
				id: allInfo[i].id,
				info: data
			};
			specInfo.push(spec);
		}
		wholeReady.set(true);
	});
</script>

<!-- Confirm delete modal -->
<Modal
	title="Delete"
	open={$showDeleteModal}
	on:close={() => {
		showDeleteModal.set(false);
	}}
>
	<p class="text-base leading-relaxed text-gray-800">
		Confirm delete <Badge color="blue">{selectedItem}</Badge>. You can't undo this.
	</p>
	<Button outline color="red" on:click={() => {
		if ($isDict) { console.log("starting dict delete"); handleDictUpdate() }
		else { console.log("not starting dict delete"); handleDelete() }
	}}>
		Delete
		{#if $isLoading}
			<Spinner size={4} color="red" />
		{/if}
	</Button>
</Modal>

<!-- Confirm update modal -->
<Modal
	title="Update"
	open={$showUpdateModal}
	on:close={() => {
		showUpdateModal.set(false);
	}}
>
	<p class="text-base leading-relaxed text-gray-800">
		Confirm update <Badge color="red">{selectedItem}</Badge> to <Badge color="green">{newVal}</Badge
		>
	</p>
	<Button outline color="red" on:click={handleDelete}>
		Delete
		{#if $isLoading}
			<Spinner size={4} color="red" />
		{/if}
	</Button>
</Modal>

<section class="bg-gray-50 p-3 sm:p-5">
	<div>
		<TableHeader headerType="search">
			<Search
				bind:value={searching}
				slot="search"
				placeholder="Search {clickedCollection}"
				size="md"
			/>
			<div class=""></div>
			{#if $showEdit}
				<Button
					outline
					color="blue"
					on:click={() => {
						showEdit.set(!$showEdit);
					}}>Editing {clickedCollection}</Button
				>
			{:else}
				<Button
					outline
					color="blue"
					on:click={() => {
						showEdit.set(!$showEdit);
					}}>Edit {clickedCollection}</Button
				>
			{/if}
			{#if $confirmDeleteDoc}
                <ButtonGroup>
                    <Button outline color="blue" on:click={() => {confirmDeleteDoc.set(false);}}>
                        Cancel
                    </Button>
                    <Button outline color="purple" on:click={handleDeleteDoc}>
                        Confirm <TrashBinOutline></TrashBinOutline>
                    </Button>
                </ButtonGroup>
			{:else}
				<Button
					outline
					color="red"
					on:click={() => {
						confirmDeleteDoc.set(true);
					}}>
					Delete Document <TrashBinOutline></TrashBinOutline>
				</Button>
			{/if}
			<!-- <Button outline color="green">Add a(n) {clickedCollection}</Button>
            <Button outline color="red">Delete a(n) {clickedCollection}</Button> -->
		</TableHeader>
	</div>
	<br />
	<div>
		<div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-gray-500">
					<thead class="text-lg text-gray-700 bg-gray-50">
						<tr>
							{#each Object.entries(wholeCollection.info) as [key, value]}
								{#if key != 'id'}
									<th scope="col" class="px-4 py-3">{key}</th>
								{/if}
							{/each}
						</tr>
					</thead>
					<tbody>
						<tr class="border-b tablerow">
							{#each Object.entries(wholeCollection.info) as [key, value]}
								<!-- key = column, value = data in that column (could be a list, etc.) -->
								{#if key != 'id'}
									<!-- {console.log(typeof value, value)} -->
									{#if typeof value == 'boolean'}
										<td class="px-4 py-3">
											<Toggle color="green" checked={value}></Toggle>
										</td>
									{:else if typeof value == 'object'}
										<td class="px-4 py-3">
											{#if Array.isArray(value)}
												<!-- {console.log("array")} -->
											{#each value as v}
												<!-- {console.log(typeof v, v)} -->
                                                <div class="listwrapper">
													<div class="indlistbadge">
														<div class="wholebadge">
															<Badge color="blue" style="padding: .5rem;">
																{#if $showEdit}
																	{#if typeof v == 'object'}
																		<div class="deleteitem">
																			<Button
																				outline
																				size="xs"
																				color="blue"
																				on:click={() => {
																					selectedItem = v.data.replace(/ /g, '-'); // Replaces all the spaces with dashes
																					selectedItemLocation = key;
																					showDeleteModal.set(true);
																					isObj = true;
																				}}><CloseOutline></CloseOutline></Button
																			>
																		</div>
																		{#if $editValue.length > 1 && selectedItemLocation == key + '_' + v.data.replace(/ /g, '-')}
																			<Input
																				size="sm"
																				bind:value={editItem}
																				on:input={() => {
																					selectedItemLocation = key;
																					selectedItem = v.data.replace(/ /g, '-');
																				}}
																			/>
																		{:else}
																			<Input
																				size="sm"
																				id="{key}_{v.data.replace(/ /g, '-')}"
																				value={v.data}
																				on:input={() => {
																					selectedItemLocation = key;
																					selectedItem = v.data.replace(/ /g, '-');
																					editValue.set(v.data.replace(/ /g, '-'));
																					editItem = document.querySelector(
																						'#' + key + '_' + v.data.replace(/ /g, '-')
																					).value;
																				}}
																			/>
																		{/if}
																		<Button
																			size="xs"
																			outline
																			color="blue"
																			on:click={async () => {
																				await handleEdit(v);
																			}}
																		>
																			{#if $isLoading}
																				<Spinner color="green" size={4} />
																			{:else}
																				<CheckCircleOutline style="cursor:pointer;"
																				></CheckCircleOutline>
																			{/if}
																		</Button>
																	{:else}
																		<div class="deleteitem">
																			<Button
																				outline
																				size="xs"
																				color="blue"
																				on:click={() => {
																					selectedItem = v;
																					selectedItemLocation = key;
																					showDeleteModal.set(true);
																				}}><CloseOutline></CloseOutline></Button
																			>
																		</div>
																		{#if $editValue.length > 1 && selectedItemLocation == key + '_' + v.replace(/ /g, '-')}
																			<Input
																				size="sm"
																				bind:value={editItem}
																				on:input={() => {
																					selectedItemLocation = key;
																					selectedItem = v;
																				}}
																			/>
																		{:else}
																			<Input
																				size="sm"
																				id="{key}_{v.replace(/ /g, '-')}"
																				value={v}
																				on:input={() => {
																					selectedItemLocation = key;
																					selectedItem = v;
																					editValue.set(v);
																					editItem = document.querySelector(
																						'#' + key + '_' + v.replace(/ /g, '-')
																					).value;
																				}}
																			/>
																		{/if}
																		<Button
																			size="xs"
																			outline
																			color="blue"
																			on:click={async () => {
																				await handleEdit(v);
																			}}
																		>
																			{#if $isLoading}
																				<Spinner color="green" size={4} />
																			{:else}
																				<CheckCircleOutline style="cursor:pointer;"
																				></CheckCircleOutline>
																			{/if}
																		</Button>
																	{/if}
																{:else if typeof v == 'object'}
																	<Toggle
																		checked={v.show}
																		color="blue"
																		on:click={async () => {
																			selectedItemLocation = key;
																			selectedItem = v;
																			await handleEdit(v, true);
																		}}
																	></Toggle>
																	<div class="showv">{v.data}</div>
																{:else}
																	<div class="showv">{v}</div>
																{/if}
															</Badge>
														</div>
													</div>
												</div>
											{/each}
											<!-- Add new item below -->
											{#if $showEdit}
												<div class="additem">
													{#if $addLocation == key}
														<Input size="sm" id={key} placeholder="Add Item" bind:value={addItem} />
														<Button size="xs" color="purple" on:click={handleAddNewItem}>
															{#if $isLoading}
																<Spinner color="purple" size={4} />
															{:else}
																Confirm
															{/if}
														</Button>
													{:else}
														<Input
															size="sm"
															id="temp_{key}"
															placeholder="Add Item"
															on:change={() => {
																addLocation.set(key);
																selectedItemLocation = key;
																addItem = document.querySelector('#temp_' + key).value;
															}}
														/>
														<Button size="xs" color="blue">Add Item</Button>
													{/if}
												</div>
											{/if}
											{:else}
											<!-- Showing dicts -->
											<table>
												<thead class="text-lg text-gray-700 bg-gray-50">
													<tr>
														{#each Object.entries(value) as [key1, value1]}
															{#if key1 != 'id'}
																<th scope="col" class="px-4 py-3">{key1}</th>
															{/if}
														{/each}
													</tr>
												</thead>
												<tbody>
													<tr class="border-b">
														{#each Object.entries(value) as [key1, value1]}
														<td class="px-4 py-3" style="overflow:visible">
															{#if key1 != "id"}
															<div class="listwrapper">
																<div class="indlistbadge">
																	<div class="wholebadge">
																		{#if Array.isArray(value1)}
																		<div class="dictlistwrapper">
																			{#each value1 as v1}
																				<Badge color="blue" style="padding: .5rem;">
																					{#if $showEdit}
																						<div class="deleteitem">
																							<Button
																								outline
																								size="xs"
																								color="blue"
																								on:click={() => {
																									selectedItem = v1.replace(/ /g, '-'); // Replaces all the spaces with dashes
																									selectedItemLocation = key;
																									showDeleteModal.set(true);
																									isObj = true;
																									isDict.set(true);
																									dictMiniColl = key1;
																								}}><CloseOutline></CloseOutline></Button
																							>
																						</div>
																						{#if $editValue.length > 1 && selectedItemLocation == key + '_' + v1.replace(/ /g, '-')}
																							<Input
																								size="sm"
																								bind:value={editItem}
																								on:input={() => {
																									selectedItemLocation = key1;
																									selectedItem = v1;
																								}}
																							/>
																						{:else}
																							<Input
																								size="sm"
																								id="{key1}_{v1.replace(/ /g, '-')}"
																								value={v1}
																								on:input={() => {
																									selectedItemLocation = key;
																									selectedItem = v1;
																									editValue.set(v1);
																									editItem = document.querySelector(
																										'#' + key1 + '_' + v1.replace(/ /g, '-')
																									).value;
																									console.log(editItem);
																									editValue.set(editItem);
																								}}
																							/>
																						{/if}
																						<Button
																							size="xs"
																							outline
																							color="blue"
																							on:click={async () => {
																								// alert(v1);
																								selectedItem = v1.replace(/ /g, '-'); // Replaces all the spaces with dashes
																								selectedItemLocation = key;
																								showDeleteModal.set(true);
																								isObj = true;
																								isDict.set(true);
																								dictMiniColl = key1;
																								isDictUpdate.set(true);
																								await handleDictUpdate();
																								// await handleEdit(v1);
																							}}
																						>
																							{#if $isLoading}
																								<Spinner color="green" size={4} />
																							{:else}
																								<CheckCircleOutline style="cursor:pointer;"
																								></CheckCircleOutline>
																							{/if}
																						</Button>
																					{/if}
																					<div class="eachdictlist">
																						{v1}
																					</div>
																				</Badge>
																			{/each}
																			<!-- Add new list item to dict -->
																			{#if $showEdit}
																			<div class="additem">
																				{#if $addLocation == key}
																					<Input size="sm" id={key} placeholder="Add Item" bind:value={addItem} />
																					<Button size="xs" color="purple" on:click={handleDictUpdate}>
																						{#if $isLoading}
																							<Spinner color="purple" size={4} />
																						{:else}
																							Confirm
																						{/if}
																					</Button>
																				{:else}
																					<Input
																						size="sm"
																						id="dicttemp_{key}"
																						placeholder="Add Item"
																						on:change={() => {
																							addLocation.set(key);
																							selectedItemLocation = key;
																							// selectedItem = v1.replace(/ /g, '-'); // Replaces all the spaces with dashes
																							selectedItemLocation = key;
																							// showDeleteModal.set(true);
																							isObj = true;
																							dictMiniColl = key1;
																							isDictUpdate.set(false);
																							isDictNewItem.set(true);
																							newDictItem = document.querySelector('#dicttemp_' + key).value;
																						}}
																					/>
																					<Button size="xs" color="blue">Add Item</Button>
																				{/if}
																			</div>
																		{/if}
																		</div>
																		{:else}
																			<Badge color="blue" style="padding: .5rem;">
																				{#if $showEdit}
																					<div class="deleteitem">
																						<Button
																							outline
																							size="xs"
																							color="blue"
																							on:click={() => {
																								selectedItem = value1.replace(/ /g, '-'); // Replaces all the spaces with dashes
																								selectedItemLocation = key;
																								showDeleteModal.set(true);
																								isObj = true;
																								isDict.set(true);
																								dictMiniColl = key1;
																							}}><CloseOutline></CloseOutline></Button
																						>
																					</div>
																					{#if $editValue.length > 1 && selectedItemLocation == key + '_' + value1.replace(/ /g, '-')}
																							<Input
																								size="sm"
																								bind:value={editItem}
																								on:input={() => {
																									selectedItemLocation = key1;
																									selectedItem = value1;
																								}}
																							/>
																						{:else}
																							<Input
																								size="sm"
																								id="rehaan"
																								value={value1}
																								on:input={() => {
																									selectedItemLocation = key;
																									selectedItem = value1;
																									editValue.set(value1);
																									editItem = document.querySelector(
																										'#' + key1 + '_' + value1.replace(/ /g, '-')
																									).value;
																									console.log(editItem);
																									editValue.set(editItem);
																								}}
																							/>
																						{/if}
																						<Button
																							size="xs"
																							outline
																							color="blue"
																							on:click={async () => {
																								// alert(v1);
																								selectedItem = value1.replace(/ /g, '-'); // Replaces all the spaces with dashes
																								selectedItemLocation = key;
																								showDeleteModal.set(true);
																								isObj = true;
																								isDict.set(true);
																								dictMiniColl = key1;
																								isDictUpdate.set(true);
																								await handleDictUpdate();
																								// await handleEdit(v1);
																							}}
																						>
																							{#if $isLoading}
																								<Spinner color="green" size={4} />
																							{:else}
																								<CheckCircleOutline style="cursor:pointer;"
																								></CheckCircleOutline>
																							{/if}
																						</Button>
																					
																				{/if}
																				<div class="showv">{value1}</div>
																			</Badge>
																		{/if}
																	</div>
																</div>
															</div>
															{/if}
														</td>
														{/each}
													</tr>
												</tbody>
											</table>
											{/if}
										</td>
									{:else if typeof value == "string" || typeof value == "number"}
										<td class="px-4 py-3">
											<Badge color="blue" style="padding: .5rem;">
												{value}
											</Badge>
										</td>
									{:else}
										PRESET NOT MADE (YET)! Contact support ASAP
										<td class="px-4 py-3">
											<Badge color="blue" style="padding: .5rem;">
												{value}
											</Badge>
										</td>
									{/if}
								{/if}
							{/each}
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</section>

<style>
	/* .tablerow {
		display: grid;
	} */

	.listwrapper {
		margin-bottom: 0.5rem;
	}

	.showv {
		font-size: medium;
	}

	.indlistbadge {
		font-size: large;
		/* border-bottom: 1px solid black; */
	}

	.deleteitem {
		border-radius: 50%;
		font-size: smaller;
		margin-right: 0.3rem;
	}

	.additem {
		display: grid;
		gap: 0.3rem;
	}

	.dictlistwrapper {
		display: grid;
		gap: 1rem;
	}

	.eachdictlist {
		font-size: large;
	}
</style>

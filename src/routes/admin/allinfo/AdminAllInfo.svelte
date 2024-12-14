<script>
    import { onMount } from "svelte";
    import { getCollectionDoc, getCollection } from "../../../lib/api";
    import { TableHeader } from "flowbite-svelte-blocks";
    import { Search, Button, Table, TableBody, TableBodyRow, Toggle } from "flowbite-svelte";
    import { writable } from "svelte/store";

    let wholeReady = writable(false);

    let allInfo;
    let specInfo = [];
    let searching = "";

    // const handleClick = async (email, clubId) => {
	// 	removeLoading.set(true);
	// 	try {
	// 		const res = await toggleClub(email, clubId);
	// 	} catch (error) {
	// 		console.log('Failed to toggle club! ' + error);
	// 	} finally {
	// 		clubs = await getCollection('Clubs');
	// 		for (let i = 0; i < clubs.length; i++) {
	// 			if (clubs[i].id.localeCompare(clubId) === 0) {
	// 				console.log(clubs[i]);
	// 				currClub = clubs[i];
	// 				clubMembers = currClub.members;
	// 			}
	// 		}
	// 		// toggleRow(currI, currClub);
	// 		removeLoading.set(false);
	// 		closeDeleteConfirmModal();
	// 		setTimeout(() => {
	// 			showToast.set(false);
	// 		}, 3000);
	// 		// clubMembers.set()
	// 		showToast.set(true);
	// 	}
	// };

    onMount(async() => {
        wholeReady.set(false);
        allInfo = await getCollection("AllInfo");
        for (let i = 0; i < allInfo.length; i++) {
            const data = await getCollectionDoc("AllInfo", allInfo[i].id)
            console.log(data);
            const spec = {
                id: allInfo[i].id,
                info: data
            }
            specInfo.push(spec)

        }
        wholeReady.set(true);
    })
</script>

{#if $wholeReady}

{#each allInfo as a}
    <section class="bg-gray-50 p-3 sm:p-5">
        <div>
            <TableHeader headerType="search">
                <Search
                    bind:value={searching}
                    slot="search"
                    placeholder="Search {a.id}"
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
                                <th scope="col" class="px-4 py-3">{a.id}</th>
                                <th scope="col" class="px-4 py-3">Edit</th>
                                <th scope="col" class="px-4 py-3">Delete</th>
                                {#each specInfo as spec, i}
                                    {#if spec.id == a.id}
                                        {#each Object.entries(spec.info) as [key, value]}
                                            <th scope="col" class="px-4 py-3">{key}</th>
                                        {/each}
                                    {/if}
                                {/each}

                            </tr>
                        </thead>
                        <tbody>
                            {#each specInfo as spec, i}
                                {#if spec.id == a.id}
                                <tr class="border-b">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    {#each Object.entries(spec.info) as [key, value]}
                                        {#if typeof value == "boolean"}
                                            <td class="px-4 py-3">
                                                <Toggle color="green" checked={value}></Toggle>
                                            </td>
                                        {:else}
                                            <td class="px-4 py-3">
                                                {value}
                                            </td>
                                        {/if}
                                    {/each}
                                </tr>
                                {/if}
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
{/each}

{:else}

    loading ...

{/if}
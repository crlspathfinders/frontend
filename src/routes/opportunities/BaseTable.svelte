<script>
    import { Button, Badge } from 'flowbite-svelte';

    export let view;
    export let filteredLinks = [];
    export let searching = "";
    export let labelIncludesSearchTerm = (name, search) => name.toLowerCase().includes(search.toLowerCase());
    export let extraFilter;
    export let extraFilterField;
    export let currLinkName;
    export let currLinkUrl;
    export let oldLinkName;
    export let currBio;
    export let currDeadline;
    export let currCats;
    export let openShowEditLinkModal = () => {};
    export let opendeleteLinkConfirmModal = () => {};
</script>

<div>
    <div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        {#if view === 'Edit'}
                            <th scope="col" class="px-4 py-3">Edit</th>
                            <th scope="col" class="px-4 py-3">Delete</th>
                        {/if}

                        <th scope="col" class="px-4 py-3">Name</th>
                        <th scope="col" class="px-4 py-3">Bio</th>
                        <th scope="col" class="px-4 py-3">Link</th>
                        <th scope="col" class="px-4 py-3">Categories</th>
                        <th scope="col" class="px-4 py-3">Deadline</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filteredLinks as opp}
                        {#if labelIncludesSearchTerm(opp.name, searching)
                            && (
                                !extraFilter ||
                                (Array.isArray(opp[extraFilterField])
                                    ? opp[extraFilterField].some(item => labelIncludesSearchTerm(item, extraFilter))
                                    : labelIncludesSearchTerm(opp[extraFilterField], extraFilter))
                            )}
                            {#if opp.id !== 'Categories'}
                                <tr class="border-b" style="padding:2rem;">
                                    {#if view === 'Edit'}
                                        <td>
                                            <Button
                                                style="margin-left:1rem; margin-top:1rem;"
                                                outline
                                                color="dark"
                                                size="xs"
                                                on:click={() => {
                                                    currLinkName = opp.name;
                                                    currLinkUrl = opp.src;
                                                    oldLinkName = currLinkName;
                                                    currBio = opp.bio;
                                                    currDeadline = opp.deadline;
                                                    openShowEditLinkModal();
                                                    currCats = opp.categories;
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
                                                    currLinkName = opp.name;
                                                    opendeleteLinkConfirmModal();
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    {/if}

                                    <td class="px-2 py-1 text-gray-700" style="font-size:medium;padding:1rem;">
                                        <b>{opp.name}</b>
                                    </td>
                                    <td class="px-2 py-1 text-gray-700">
                                        {opp.bio}
                                    </td>
                                    <td class="px-2 py-1 text-gray-700">
                                        <u><a target="_blank" href={opp.src}>{opp.src}</a></u>
                                    </td>
                                    <td class="px-2 py-1">
                                        <div class="catbadgewrapper">
                                            {#each opp.categories as cat}
                                                <div class="catbadge" style="margin-top:1rem;">
                                                    <Badge color="purple">{cat}</Badge>
                                                </div>
                                            {/each}
                                        </div>
                                    </td>
                                    <td class="px-2 py-1 text-gray-700">
                                        <b>{opp.deadline}</b>
                                    </td>
                                </tr>
                            {/if}
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
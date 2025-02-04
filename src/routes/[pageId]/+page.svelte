<head>
    <link rel="styles/css" >
</head>

<script>
    import { page } from '$app/stores';
    import { getCollection } from "$lib/api";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    /* Steps:

    1) Check page parameter (const newPage = $page.params.pageId;)
    (Assume the page exists in AllInfo)
    2) Pull in data from all info
    3) Determine specific value of data.
        - collection = thing.id
            - Pull in from getCollection, etc.
        - If string, or id == "info" - then it's the main info at top of page.
            - Find from AllInfo.
    4) Populate and render page with results.
    

    */

    let wholeReady = writable(false);

    let data;

    async function findPage(newPage) {
        let targetId = wholeWebsiteData.findIndex(item => item.id === newPage);
			console.log("target id: ", targetId)
			if (targetId > -1) {
				clubs = wholeWebsiteData[targetId].info;
			} else {
				clubs = await getCollection('Clubs');
				updateWholeWebsiteData("clubs", clubs);
			}

			targetId = wholeWebsiteData.findIndex(item => item.id === "allinfo");
			if (targetId > -1) {
				const allInfo = wholeWebsiteData[targetId].info;
				for (let i = 0; i < allInfo.length; i++) {
					if (allInfo[i].id == newPage) { info = allInfo[i].info; }
				}
			} else {
				const allInfo = await getCollection("AllInfo");
				for (let i = 0; i < allInfo.length; i++) {
					if (allInfo[i].id == newPage) { info = allInfo[i].info; }
				}
				updateWholeWebsiteData("allinfo", allInfo);
			}
        console.log(temp);
        data = temp;
    }

    onMount(async () => {
        const newPage = $page.params.pageId;
        await findPage(newPage);
        wholeReady.set(true);
    })

</script>

{#if $wholeReady}
    {#each data as d}
        {d.id}
    {/each}
{:else}
    ... waiting
{/if}
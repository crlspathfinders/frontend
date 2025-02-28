<head>
    <link rel="styles/css" >
</head>

<script>
    import { page } from '$app/stores';
    import { getCollection } from "$lib/api";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { wholeWebsiteData, updateWholeWebsiteData, getCollectionDoc } from "$lib/api";

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
    let info;

    async function findPage(newPage) {

        let targetId = wholeWebsiteData.findIndex(item => item.id === "allinfo");
        if (targetId > -1) {
            const allInfo = wholeWebsiteData[targetId].info;
            for (let i = 0; i < allInfo.length; i++) {
                if (allInfo[i].id == newPage) { data = allInfo[i]; info = allInfo[i].info; }
            }
        } else {
            const allInfo = await getCollection("AllInfo");
            for (let i = 0; i < allInfo.length; i++) {
                if (allInfo[i].id == newPage) { data = allInfo[i]; info = allInfo[i].info; }
            }
            updateWholeWebsiteData("allinfo", allInfo);
        }
        return data;
    }

    onMount(async () => {
        wholeReady.set(false);
        const newPage = $page.params.pageId;
        const temp = await findPage(newPage);
        console.log(temp);
        wholeReady.set(true);
    })

</script>
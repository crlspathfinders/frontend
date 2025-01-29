<script>
    import { onMount } from "svelte";
    import { getCollectionDoc, getCollection } from "$lib/api.js";
    import {
        Button,
        Spinner,
        Sidebar,
        SidebarGroup,
        SidebarItem,
        Modal,
        Label,
        Input,
        Select,
        SidebarWrapper
    } from "flowbite-svelte";
    import { writable } from "svelte/store";
    import { page } from "$app/stores";
    import { ArrowRightAltSolid, BarsFromLeftOutline, CalendarEditOutline, CircleMinusSolid, CirclePlusSolid } from 'flowbite-svelte-icons';
    import AllInfoData from "./AllInfoData.svelte";
    import { addDocument } from "$lib/allinfo";
    let wholeReady = writable(false);
    let currCollection = writable("");
    let showSidebar = writable(true);
    let showAddInfo = writable(false);
    let isLoading = writable(false);
    let allInfo;
    let specInfo = [];
    let clickedCollection = "";
    let wholeCollection = {};
    let selected;
    let fieldCount = 1;
    let currDoc = {};
    let docName;
    let currField;
    let currVal;
    let listFieldsCount = 1;
    let currListVal;
    let dictCount = 1;
    let currDictField;
    let dictSelected;
    let dictCurrVal;
    let dictListFieldsCount = 1;
    let dictCurrListValue;
    let currDictDoc = {}

    let types = [
        { value: "list", name: "list" },
        { value: "string", name: "string" },
        { value: "int", name: "int" },
        { value: "dict", name: "dict" }
    ];

    let spanClass = 'flex-1 ms-3 whitespace-nowrap';
  
    $: activeUrl = $page.url.pathname;
    const showData = (clicked, spec) => {
        console.log(clicked + " has been clicked!", spec);
        currCollection.set(clicked);
        clickedCollection = clicked;
        wholeCollection = spec;
    }

    function assignIntOrString(val) {
        currDoc[currField] = val;
    }

    function dictAssignIntOrString(val) {
        currDictDoc[currDictField] = val;
        console.log(currDictDoc);
    }

    function assignList(val) {
        if (currDoc[currField] === undefined) {
            currDoc[currField] = [];
            currDoc[currField].push(val);
        }
        else {
            currDoc[currField].push(val);
        }
    }

    function dictAssignList(val) {
        if (currDictDoc[currDictField] === undefined) {
            currDictDoc[currDictField] = [];
            currDictDoc[currDictField].push(val);
        }
        else {
            currDictDoc[currDictField].push(val);
        }
        console.log(currDictDoc);
    }

    const handleAddItem = async () => {
        isLoading.set(true);
        console.log(currDictDoc);
        if (currDictDoc.id) { currDoc[currDictDoc.id] = currDictDoc; }
        try {
            await addDocument(currDoc);
        } catch (error) {
            console.log(error);
        } finally {
            isLoading.set(false);
        }
    }
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
        console.log(specInfo);
        wholeReady.set(true);
    })
</script>

<style>
    .wholeallinfowrapper {
        display: flex;
        justify-content: space-between;
    }
    .allinfodatawrapper {
        overflow: auto;
    }
    .showhidesidebarwrapper {
        padding-right: 1rem;
    }
    /*
				.listwrapper {
						padding: 1;
				} */
    .fieldwrapper {
        margin-top: 1rem;
        display: flex;
        justify-content: space-evenly;
        float: left;
        gap: 3rem;
        /* align-items: center; */
        /* gap: 5rem; */
    }
    .minusbuttonwrapper {
        display: flex;
        padding: 1.3rem;
    }
</style>

<Modal
  title="Add Info"
  open={$showAddInfo}
  on:close={() => {showAddInfo.set(false);}}>
    <form on:submit={handleAddItem}>
        <div>
            <div class="sm:col-span-2">
                <Label for="docname" class="mb-2">Document Name</Label>
                <Input type="text" id="docname" placeholder="Doc name" required bind:value={docName} on:change={() => {
                    currDoc["id"] = docName;
                    console.log(currDoc); }}/>
            </div>
            {#each {length: fieldCount} as _, i}
                <div class="w-full">
                    <div class="fieldwrapper">
                        <div class="field">
                            <Label for="field_{i+1}" class="mb-2">Field { i + 1 }</Label>
                            <Input type="text" id="field_{i+1}" placeholder="field123" bind:value={currField} required/>
                        </div>
                        <Label>
                            Field Type { i + 1 }
                            <Select class="mt-2" items={types} bind:value={selected} required />
                        </Label>
                    </div>
                    {#if selected === "string"}
                        <div class="w-full">
                            <Label for="{selected}_value_{i+1}" class="mb-2">Value</Label>
                            <Input type="text" id="{selected}_value_{i+1}" placeholder="string value" bind:value={currVal} required on:change={() => {
                                assignIntOrString(currVal);
                            }}/>
                        </div>
                    {:else if selected === "int"}
                        <div class="w-full">
                            <Label for="{selected}_value_{i+1}" class="mb-2">Value</Label>
                            <Input type="number" id="{selected}_value_{i+1}" placeholder="number value" bind:value={currVal} required on:change={() => {
                                assignIntOrString(currVal);
                            }}/>
                        </div>
                    {:else if selected === "list"}
                        <div class="w-full">
                            <div class="listwrapper" style="margin-left:2rem;">
                                {#each {length: listFieldsCount} as _, j}
                                    <div class="listdivone">
                                        <Label for="{selected}_value_{j+1}" class="mb-2">Value</Label>
                                        <Input type="text" id="{selected}_value_{j+1}" placeholder="string value" bind:value={currListVal} required on:change={() => {
                                            assignList(currListVal);
                                        }}/>
                                    </div>
                                    <Button size="xs" outline color="purple" on:click={() => {listFieldsCount++;}}><CirclePlusSolid></CirclePlusSolid></Button>
                                    <Button size="xs" outline color="red" on:click={() => {listFieldsCount--;}}><CircleMinusSolid></CircleMinusSolid></Button>
                                {/each}
                            </div>
                        </div>
                    {:else if selected === "dict"}
                    <div class="w-full">
                        <div class="listwrapper" style="margin-left:2rem;">
                            {#each {length: dictCount} as _, j}
                                <div class="dictdiv">
                                    <div class="dictfieldwrapper">
                                        <div class="dictfield">
                                            <Label for="dictfield_{j+1}" class="mb-2">Dict Field { j + 1}</Label>
                                            <Input type="text" id="dictfield_{i+1}" placeholder="dictfield123" bind:value={currDictField} required on:change={() => {
                                                currDictDoc["id"] = currField;
                                                // console.log(currDictDoc);
                                            }}/>
                                        </div>
                                        <Label>
                                            Dict Field Type { j + 1 }
                                            <Select class="mt-2" items={types} bind:value={dictSelected} required />
                                        </Label>
                                    </div>
                                    {#if dictSelected === "string"}
                                        <div class="w-full">
                                            <Label for="{dictSelected}_value_{j+1}" class="mb-2">Dict String Value</Label>
                                            <Input type="text" id="{dictSelected}_value_{j+1}" placeholder="dict string value" bind:value={dictCurrVal} required on:change={() => {
                                                dictAssignIntOrString(dictCurrVal);
                                            }}/>
                                        </div>
                                    {:else if dictSelected === "int"}
                                        <div class="w-full">
                                            <Label for="{dictSelected}_value_{j+1}" class="mb-2">Dict Int Value</Label>
                                            <Input type="number" id="{dictSelected}_value_{j+1}" placeholder="dict number value" bind:value={dictCurrVal} required on:change={() => {
                                                dictAssignIntOrString(dictCurrVal);
                                            }}/>
                                        </div>
                                    {:else if dictSelected === "list"}
                                        <div class="w-full">
                                            <div class="listwrapper" style="margin-left:2rem;">
                                                {#each {length: dictListFieldsCount} as _, k}
                                                    <div class="listdivone">
                                                        <Label for="{dictSelected}_value_{k+1}" class="mb-2">Dict List Value</Label>
                                                        <Input type="text" id="{dictSelected}_value_{k+1}" placeholder="dict list value" bind:value={dictCurrListValue} required on:change={() => {
                                                            dictAssignList(dictCurrListValue);
                                                        }}/>
                                                    </div>
                                                    <Button size="xs" outline color="purple" on:click={() => {dictListFieldsCount++;}}><CirclePlusSolid></CirclePlusSolid></Button>
                                                    <Button size="xs" outline color="red" on:click={() => {dictListFieldsCount--;}}><CircleMinusSolid></CircleMinusSolid></Button>
                                                {/each}
                                            </div>
                                        </div>
                                    {/if}
                                <Button size="xs" outline color="purple" on:click={() => {dictCount++;}}><CirclePlusSolid></CirclePlusSolid></Button>
                                <Button size="xs" outline color="red" on:click={() => {dictCount--;}}><CircleMinusSolid></CircleMinusSolid></Button>
                                </div>
                            {/each}
                        </div>
                    </div>
                    {/if}
                    <br>
                    <div class="minusbuttonwrapper">
                        <Button outline size="sm" color="dark" on:click={() => {fieldCount --; }}><CircleMinusSolid></CircleMinusSolid></Button>
                    </div>
                </div>
                <br>
            {/each}
        </div>
        <br>
        <div class="w-full">
            <Button outline color="purple" class="w-32" on:click={() => {fieldCount++; }}>Add field</Button>
        </div>
        <br>
        <Button class="w-full" type="submit" color="blue">
            {#if $isLoading}
                Loading <Spinner color="blue" size={4}/>
            {:else}
                Add Item
            {/if}
        </Button>
    </form>
</Modal>

{#if $wholeReady}

    <div class="wholeallinfowrapper">


        {#if $showSidebar}
            <div class="sidebarwrapper">
                <div class="showhidesidebarwrapper">
                    <Button size="sm" outline color="light" on:click={() => {
                        console.log("clicked");
                        showSidebar.set(!$showSidebar);
                    }}>
                        <BarsFromLeftOutline color="black" size="lg" style="cursor:pointer;"></BarsFromLeftOutline>
                    </Button>
                </div>


                <Sidebar {activeUrl}>
                    <SidebarWrapper>
                        <SidebarGroup>
                            {#each specInfo as spec, i}
                                <SidebarItem label={spec.id} on:click={() => {
                                    try { 
                                        console.log(spec.id, spec);
                                    } catch (error) {
                                        console.log("ERROR: " + error);
                                    }
                                showData(spec.id, spec)
                            }}>
                                    <svelte:fragment slot="icon">
                                        <ArrowRightAltSolid></ArrowRightAltSolid>
                                    </svelte:fragment>
                                </SidebarItem>
                            {/each}
                            <SidebarItem label="Add Info" on:click={() => {showAddInfo.set(true);}}>
                                <svelte:fragment slot="icon">
                                    <CalendarEditOutline size="lg"></CalendarEditOutline>
                                </svelte:fragment>
                            </SidebarItem>
                        </SidebarGroup>
                    </SidebarWrapper>
                </Sidebar>
            </div>
        {:else}
            <div class="showhidesidebarwrapper">
                <Button size="sm" outline color="light" on:click={() => {
                    showSidebar.set(!$showSidebar);
                }}>
                    <BarsFromLeftOutline color="black" size="lg" style="cursor:pointer;"></BarsFromLeftOutline>
                </Button>
            </div>
        {/if}
        <div class="allinfodatawrapper">
            {#if $currCollection.length > 1}
                <AllInfoData {clickedCollection} {wholeCollection}></AllInfoData>
            {/if}
        </div>
    </div>

{:else}
                          
    <div style="text-align: center;">Loading ... <Spinner color="red"/></div>

{/if}

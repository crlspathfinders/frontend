<script>
    import { onMount } from 'svelte';
    import { Section } from 'flowbite-svelte-blocks';
    import { Label, Input, Button, Select, Textarea, MultiSelect, P, Spinner } from 'flowbite-svelte';
    import { getCollectionDoc } from "$lib/api";
    import { createMentor, editMentor, races, religions, genders, languages, academics } from "../../lib/mentor";
    import { user } from "../../stores/auth";
    import { writable } from 'svelte/store';

    let isLoading = writable(false);

    let email = "";

    let racesSelected = [];
    let religionsSelected = [];
    let genderSelected = [];
    let languagesSelected = [];
    let academicsSelected = [];

    let newRaces = [];
    let newReligions = [];
    let newGender = [];
    let newLanguages = [];
    let newAcademics = [];

    let importRaces = [];

    const handleSubmit = async () => {
        try {
            isLoading.set(true);
            const firstName = document.querySelector("#firstname").value;
            const lastName = document.querySelector("#lastname").value;
            const races = document.querySelector("#races").value;
            const religions = document.querySelector("#religions").value;
            const gender = document.querySelector("#gender").value;
            const languages = document.querySelector("#languages").value;
            const academics = document.querySelector("#academics").value;

            if (view.localeCompare("Register") === 0) {
                const mes = await createMentor(firstName, lastName, currEmail, racesSelected, religionsSelected, genderSelected, languagesSelected, academicsSelected);
                console.log(mes);
            } else if (view.localeCompare("Edit") === 0) {
                await editMentor(firstName, lastName, currMentor.email, newRaces, newReligions, newGender, newLanguages, newAcademics);
            }
        } catch (error) {
            console.log("Failed to edit mentor: " + error);
        } finally {
            isLoading.set(false);
        }
    }

    let newImportRaces = [];

    onMount(async () => {
        importRaces = await getCollectionDoc("Demographics", "9qHHDN65kY2yIfV4BnnK");
        importRaces = importRaces.races;
        console.log(importRaces);

        for (let i = 0; i < importRaces.length; i++) {
            const temp = {value: importRaces[i], name: importRaces[i]}
            newImportRaces.push(temp);
        }

        console.log(newImportRaces);
        
        if (showVals) {
            racesSelected = currMentor.races;
            religionsSelected = currMentor.religions;
            genderSelected = currMentor.gender;
            languagesSelected = currMentor.languages;
            academicsSelected = currMentor.academics;
            newRaces = currMentor.races;
            newReligions = currMentor.religions;
            newGender = currMentor.gender;
            newLanguages = currMentor.languages;
            newAcademics = currMentor.academics;
            
        }
    });

    export let view = "";
    export let showVals = false;
    export let currMentor = {}
    export let currEmail = "";

</script>

<!-- <MultiSelect class="mt-2" id="languages" items={languages} placeholder="Select your language(s)" bind:value={languagesSelected}/> -->

<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">{view} Mentor</h2>
<form on:submit={handleSubmit}>
    <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
    <div class="w-full">
        <Label for="firstname" class="mb-2">First Name</Label>
        {#if showVals}
            <Input type="text" id="firstname" placeholder="First Name" value={currMentor.firstname}/>
        {:else}
            <Input type="text" id="firstname" placeholder="First Name" required/>
        {/if}
    </div>
    <div class="w-full">
        <Label for="lastname" class="mb-2">Last Name</Label> 
        {#if showVals}
            <Input type="text" id="lastname" placeholder="Last Name" value={currMentor.lastname}/>
        {:else}
            <Input type="text" id="lastname" placeholder="Last Name" required/>
        {/if}
    </div>
    <div class="w-full">
        <Label>Races
            {#if showVals}
                <MultiSelect class="mt-2" id="races" size="lg" items={races} placeholder="Select your race(s)" bind:value={newRaces}/>
            {:else}
                <MultiSelect class="mt-2" id="races" items={newImportRaces} placeholder="Select your race(s)" bind:value={racesSelected}/>
            {/if}
        </Label>
    </div>
    <div class="w-full">
        <Label>Religions
            {#if showVals}
                <MultiSelect class="mt-2" id="religions" size="lg" items={religions} placeholder="Select your religion(s)" bind:value={newReligions}/>
            {:else}
                <MultiSelect class="mt-2" id="religions" items={religions} placeholder="Select your religion(s)" bind:value={religionsSelected}/>
            {/if}
        </Label>
    </div>
    <div class="w-full">
        <Label>Gender
            {#if showVals}
                <MultiSelect class="mt-2" id="gender" items={genders} placeholder="Select your gender(s)" bind:value={newGender}/>
            {:else}
                <MultiSelect class="mt-2" id="gender" items={genders} placeholder="Select your gender(s)" bind:value={genderSelected}/>
            {/if}
        </Label>
    </div>
    <div class="w-full">
        <Label>Languages
            {#if showVals}
                <MultiSelect class="mt-2" id="languages" items={languages} placeholder="Select your language(s)" bind:value={newLanguages}/>
            {:else}
                <MultiSelect class="mt-2" id="languages" items={languages} placeholder="Select your language(s)" bind:value={languagesSelected}/>
            {/if}
        </Label>
    </div>
    <div class="w-full">
        <Label>Academics
            {#if showVals}
                <MultiSelect class="mt-2" id="academics" items={academics} placeholder="Select your academics(s)" bind:value={newAcademics}/>
            {:else}
                <MultiSelect class="mt-2" id="academics" items={academics} placeholder="Select your academics(s)" bind:value={academicsSelected}/>
            {/if}
        </Label>
    </div>
    <div class="w-full">
    </div>
    <Button color="green" type="submit">
        {view} Club
        {#if $isLoading}
            <Spinner color="green"/>
        {/if}
    </Button>
    </div>
</form>
<script>
    import { onMount } from 'svelte';
    import { Section } from 'flowbite-svelte-blocks';
    import { Label, Input, Button, Select, Textarea, MultiSelect } from 'flowbite-svelte';
    import { getCollection } from "$lib/api";
    import { createMentor, editMentor } from "../../lib/mentor";
    import { user } from "../../stores/auth";

    let email = "";

    // $: {
    //   user.subscribe(value => {
    //     if (value) {
    //       email = value.email;
    //     } else {
    //       email = '';
    //     }
    //   });
    // }

    let races = [
        { value: "Asian / South Asian", name: "Asian / South Asian" },
        { value: "Black", name: "Black" },
        { value: "Hispanic", name: "Hispanic" },
        { value: "White", name: "White" },
        { value: "Arab", name: "Arab" },
    ]

    let racesSelected = [];

    let religions = [
        { value: "Christian", name: "Christian" },
        { value: "Muslim", name: "Muslim" },
        { value: "Jewish", name: "Jewish" },
        { value: "Hindu", name: "Hindu" },
        { value: "Buddhist", name: "Buddhist" },
        { value: "Atheist", name: "Atheist" }
    ]

    let religionsSelected = [];

    let genders = [
        { value: "Male", name: "Male" },
        { value: "Female", name: "Female" },
        { value: "Non-binary", name: "Non-binary" }
    ]

    let genderSelected = [];

    let languages = [
        { value: "Amharic", name: "Amharic" },
        { value: "Bangla", name: "Bangla" },
        { value: "Spanish", name: "Spanish" },
        { value: "Hindi", name: "Hindi" },
        { value: "Portuguese", name: "Portuguese" },
        { value: "Chinese", name: "Chinese" },
        { value: "Korean", name: "Korean "},
        { value: "Japanese", name: "Japanese" }
    ]

    let languagesSelected = [];

    let academics = [
        { value: "English", name: "English" },
        { value: "History", name: "History" },
        { value: "Chemistry", name: "Chemistry" },
        { value: "Physics", name: "Physics" },
        { value: "Biology", name: "Biology" },
        { value: "Computer Science", name: "Computer Science" }
    ]

    let academicsSelected = [];

    export let view = "";
    export let showVals = false;
    export let currMentor = {}

</script>

<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">{view} Mentor</h2>
<form on:submit={() => {
    const firstName = document.querySelector("#firstname").value;
    const lastName = document.querySelector("#lastname").value;
    const races = document.querySelector("#races").value;
    const religions = document.querySelector("#religions").value;
    const gender = document.querySelector("#gender").value;
    const languages = document.querySelector("#languages").value;
    const academics = document.querySelector("#academics").value;

    // if (view.loc)
    // createMentor(firstName, lastName, email, racesSelected, religionsSelected, genderSelected, languagesSelected, academicsSelected)

    editMentor(firstName, lastName, currMentor.email, races, religions, gender, languages, academics);

}}>
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
                <MultiSelect class="mt-2" id="races" items={races} placeholder="Select your race(s)" value={currMentor.races}/>
            {:else}
                <MultiSelect class="mt-2" id="races" items={races} placeholder="Select your race(s)" bind:value={racesSelected}/>
            {/if}
        </Label>
    </div>
    <div class="w-full">
        <Label>Religions
            {#if showVals}
                <MultiSelect class="mt-2" id="religions" items={religions} placeholder="Select your religion(s)" value={currMentor.religions}/>
            {:else}
                <MultiSelect class="mt-2" id="religions" items={religions} placeholder="Select your religion(s)" bind:value={religionsSelected}/>
            {/if}
        </Label>
    </div>
    <div class="w-full">
        <Label>Gender
            {#if showVals}
                <MultiSelect class="mt-2" id="gender" items={genders} placeholder="Select your gender(s)" value={currMentor.gender}/>
            {:else}
                <MultiSelect class="mt-2" id="gender" items={genders} placeholder="Select your gender(s)" bind:value={genderSelected}/>
            {/if}
        </Label>
    </div>
    <div class="w-full">
        <Label>Languages
            {#if showVals}
                <MultiSelect class="mt-2" id="languages" items={languages} placeholder="Select your language(s)" value={currMentor.languages}/>
            {:else}
                <MultiSelect class="mt-2" id="languages" items={languages} placeholder="Select your language(s)" bind:value={languagesSelected}/>
            {/if}
        </Label>
    </div>
    <div class="w-full">
        <Label>Academics
            {#if showVals}
                <MultiSelect class="mt-2" id="academics" items={academics} placeholder="Select your academics(s)" bind:value={currMentor.academics}/>
            {:else}
                <MultiSelect class="mt-2" id="academics" items={academics} placeholder="Select your academics(s)" bind:value={academicsSelected}/>
            {/if}
        </Label>
    </div>
    <Button color="green" type="submit">{view} Club</Button>
    </div>
</form>
<script>
    import { onMount } from 'svelte';
    import { Section } from 'flowbite-svelte-blocks';
    import { Label, Input, Button, Select, Textarea, MultiSelect } from 'flowbite-svelte';
    import { getCollection } from "$lib/api";
    import { createMentor, editMentor } from "../../lib/mentor";
    import { user } from "../../stores/auth";

    let email = "";

    $: {
      user.subscribe(value => {
        if (value) {
          email = value.email;
        } else {
          email = '';
        }
      });
    }

    let clubDays;

    let daysoftheweek = [
        { value: 'Monday', name: 'Monday' },
        { value: 'Tuesday', name: 'Tuesday' },
        { value: 'Wednesday', name: 'Wednesday' },
        { value: 'Thursday', name: 'Thursday'},
        { value: 'Friday', name: "Friday"}
    ];

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
    export let currClub = {}

    onMount(() => {
        if (showVals) {
            clubDays = currClub.club_days;
        }
    })
</script>

<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">{view} Your Club</h2>
<form on:submit={() => {
    const firstName = document.querySelector("#firstname").value;
    const lastName = document.querySelector("#lastname").value;

    createMentor(firstName, lastName, email, racesSelected, religionsSelected, genderSelected, languagesSelected, academicsSelected)

}}>
    <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
    <div class="w-full">
        <Label for="firstname" class="mb-2">First Name</Label>
        {#if showVals}
            <Input type="text" id="firstname" placeholder="First Name" value={currClub.club_name}/>
        {:else}
            <Input type="text" id="firstname" placeholder="First Name" required/>
        {/if}
    </div>
    <div class="w-full">
        <Label for="lastname" class="mb-2">Last Name</Label> 
        {#if showVals}
            <Input type="text" id="lastname" placeholder="Last Name" value={currClub.president_email}/>
        {:else}
            <Input type="text" id="lastname" placeholder="Last Name" required/>
        {/if}
    </div>
    <div class="w-full">
        <Label>Races
            <MultiSelect class="mt-2" items={races} placeholder="Select your race(s)" bind:value={racesSelected}/>
        </Label>
    </div>
    <div class="w-full">
        <Label>Religions
            <MultiSelect class="mt-2" items={religions} placeholder="Select your religion(s)" bind:value={religionsSelected}/>
        </Label>
    </div>
    <div class="w-full">
        <Label>Gender
            <MultiSelect class="mt-2" items={genders} placeholder="Select your gender(s)" bind:value={genderSelected}/>
        </Label>
    </div>
    <div class="w-full">
        <Label>Languages
            <MultiSelect class="mt-2" items={languages} placeholder="Select your language(s)" bind:value={languagesSelected}/>
        </Label>
    </div>
    <div class="w-full">
        <Label>Academics
            <MultiSelect class="mt-2" items={academics} placeholder="Select your academics(s)" bind:value={academicsSelected}/>
        </Label>
    </div>
    <Button color="green" type="submit">{view} Club</Button>
    </div>
</form>
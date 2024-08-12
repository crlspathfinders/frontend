<script>
    import { onMount } from 'svelte';
    import { Section } from 'flowbite-svelte-blocks';
    import { Label, Input, Button, Select, Textarea, MultiSelect } from 'flowbite-svelte';
    import { getCollection } from "$lib/api";
    import { createClub, editClub } from "../../lib/club";

    let clubDays;

    let daysoftheweek = [
        { value: 'Monday', name: 'Monday' },
        { value: 'Tuesday', name: 'Tuesday' },
        { value: 'Wednesday', name: 'Wednesday' },
        { value: 'Thursday', name: 'Thursday'},
        { value: 'Friday', name: "Friday"}
    ];

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
    
    const advisor_email = document.querySelector("#advisoremail").value;
    // Just send clubDays as is.
    const desc = document.querySelector("#clubdescription").value;
    const name = document.querySelector("#clubname").value;
    const presEmail = document.querySelector("#presidentemail").value;
    const roomNum = document.querySelector("#roomnumber").value;
    const startTime = document.querySelector("#clubstarttime").value;
    const status = "Pending";
    let veepsEmails = [];
    for (let i = 1; i < 4; i++) {
        try {
            const veep = document.querySelector("#vicepresidentemail" + i).value;
            veepsEmails.push(veep);
        } catch {
            veepsEmails.push("");
        }
    }
    console.log(veepsEmails);

    if (view.localeCompare("Register") === 0) {
        createClub(advisor_email, clubDays, desc, name, presEmail, roomNum, startTime, status, veepsEmails);
    } else if (view.localeCompare("Edit") === 0) {
        const secretPassword = document.querySelector("#secret_password").value;
        editClub(advisor_email, clubDays, desc, name, presEmail, roomNum, startTime, status, veepsEmails, secretPassword);
    }

}}>
    <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
    <div class="sm:col-span-2">
        <Label for="clubname" class="mb-2">Club Name</Label>
        {#if showVals}
            <Input type="text" id="clubname" placeholder="Type club name" value={currClub.club_name}/>
        {:else}
            <Input type="text" id="clubname" placeholder="Type club name" required/>
        {/if}
    </div>
    <div class="w-full">
        <Label for="presidentemail" class="mb-2">President Email</Label> 
        {#if showVals}
            <Input type="text" id="presidentemail" placeholder="President email" value={currClub.president_email}/>
        {:else}
            <Input type="text" id="presidentemail" placeholder="President email" required/>
        {/if}
    </div>
    <div class="w-full">
        <Label for="vicepresidentemail1" class="mb-2">Vice President Email 1</Label>
        {#if showVals}
            <Input type="text" id="vicepresidentemail1" value={currClub.vice_presidents_emails[0]} placeholder="Vice President Email 1"/>
        {:else}
            <Input type="text" id="vicepresidentemail1" placeholder="Vice President Email 1"/>
        {/if}
    </div>
    <div class="w-full">
        <Label for="vicepresidentemail2" class="mb-2">Vice President Email 2</Label>
        {#if showVals}
            <Input type="text" id="vicepresidentemail2" value={currClub.vice_presidents_emails[1]} placeholder="Vice President Email 2"/>
        {:else}
            <Input type="text" id="vicepresidentemail2" placeholder="Vice President Email 2"/>
        {/if}
    </div>
    <div class="w-full">
        <Label for="vicepresidentemail3" class="mb-2">Vice President Email 3</Label>
        {#if showVals}
            <Input type="text" id="vicepresidentemail3" value={currClub.vice_presidents_emails[2]} placeholder="Vice President Email 3"/>
        {:else}
            <Input type="text" id="vicepresidentemail3" placeholder="Vice President Email 3"/>
        {/if}
    </div>
    <div class="w-full">
        <Label for="advisoremail" class="mb-2">Advisor Email</Label>
        {#if showVals}
            <Input type="text" id="advisoremail" value={currClub.advisor_email} placeholder="Advisor Email" />
        {:else}
            <Input type="text" id="advisoremail" placeholder="Advisor Email" required/>
        {/if}
    </div>
    <div class="w-full">
        <Label for="roomnumber" class="mb-2">Room Number</Label>
        {#if showVals}
            <Input type="number" id="roomnumber" value={currClub.room_number} placeholder="Room Number"/>
        {:else}
            <Input type="number" id="roomnumber" placeholder="Room Number" required/>
        {/if}
    </div>
    <div class="w-full">
        <Label>
            Days your club meets
            {#if showVals}
                <MultiSelect class="mt-2" placeholder="Select day(s)" items={daysoftheweek} value={currClub.club_days} />
            {:else}
                <MultiSelect class="mt-2" placeholder="Select day(s)" items={daysoftheweek} bind:value={clubDays} required />
            {/if}
        </Label>
    </div>
    <div class="w-full">
        <Label for="clubstarttime" class="mb-2">Club Start Time</Label>
        {#if showVals}
            <Input type="time" id="clubstarttime" placeholder="12" value={currClub.start_time} />
        {:else}
            <Input type="time" id="clubstarttime" placeholder="12" value={currClub.start_time} required />
        {/if}
    </div>
    <div class="sm:col-span-2">
        <Label for="description" class="mb-2">Description</Label>
        {#if showVals}
            <Textarea id="clubdescription" placeholder="Any additional information that club members should know before joining your club!" rows="4" name="description" value={currClub.club_description} />
        {:else}
            <Textarea id="clubdescription" placeholder="Any additional information that club members should know before joining your club!" rows="4" name="description" required />
        {/if}
    </div>
    {#if showVals}
        <input type="text" id="secret_password" value={currClub.secret_password} hidden readonly>
    {/if}
    <Button color="green" type="submit">{view} Club</Button>
    </div>
</form>
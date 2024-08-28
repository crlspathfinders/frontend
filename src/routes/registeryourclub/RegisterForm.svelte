<script>
    import { onMount } from 'svelte';
    import { Section } from 'flowbite-svelte-blocks';
    import { Label, Input, Button, Select, Textarea, MultiSelect, Spinner, Modal, Alert } from 'flowbite-svelte';
    import { getCollection } from "$lib/api";
    import { createClub, editClub } from "../../lib/club";
    import { get, writable } from 'svelte/store';
    import { getUserDocData } from "../../lib/user";
    import { user } from "../../stores/auth";

    let isLoading = writable(false);
    let confirmRegisterModal = writable(false);
    let errorMessage = writable("");
    let successMessage = writable("");

    let clubDays = [];

    let selectedClubDays;

    let currDays = [];

    let loggedInEmail;

    let daysoftheweek = [
        { value: 'Monday', name: 'Monday' },
        { value: 'Tuesday', name: 'Tuesday' },
        { value: 'Wednesday', name: 'Wednesday' },
        { value: 'Thursday', name: 'Thursday'},
        { value: 'Friday', name: "Friday"}
    ];

    const checkAllInfo = async () => {
        const advisor_email = document.querySelector("#advisoremail").value;
        const name = document.querySelector("#clubname").value;
        const presEmail = document.querySelector("#presidentemail").value;
        let veepsEmails = [];
        for (let i = 1; i < 4; i++) {
            try {
                const veep = document.querySelector("#vicepresidentemail" + i).value;
                veepsEmails.push(veep);
            } catch {
                veepsEmails.push("");
            }
        }

        // Make sure advisor is already signed up with role "Advisor":
        const advisor = await getUserDocData(advisor_email);
        console.log(advisor);
        if (!advisor) {
            errorMessage.set("Your advisor needs to have already made an account with CRLS PathFinders prior to registering your club.")
            return false;
        }

        // Make sure this club name hasn't been taken:
        const allClubs = await getCollection("Clubs");
        for (let i = 0; i < allClubs.length; i++) {
            if (allClubs[i].club_name.localeCompare(name) === 0) {
                errorMessage.set("There is already a club registered as " + name);
                return false;
            }
        }

        // Make sure presEmail == currLoggedIn.email
        if (loggedInEmail.localeCompare(presEmail) !== 0) {
            errorMessage.set("Only the president of " + name + " can register.");
            return false;
        }

        return true;
    }

    const handleSubmit = async () => {
        isLoading.set(true);
        if (await checkAllInfo() || showVals) {
            try {
                const advisor_email = document.querySelector("#advisoremail").value;
                console.log(currClub.club_days);
                const desc = document.querySelector("#clubdescription").value;
                const name = document.querySelector("#clubname").value;
                const presEmail = document.querySelector("#presidentemail").value;
                const roomNum = document.querySelector("#roomnumber").value;
                const startTime = document.querySelector("#clubstarttime").value;
                let status;
                if (showVals) { status = "Approved"; }
                else { status = "Pending"; } 
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
                    await createClub(advisor_email, clubDays, desc, name, presEmail, roomNum, startTime, status, veepsEmails)
                } else if (view.localeCompare("Edit") === 0) {
                    const secretPassword = document.querySelector("#secret_password").value;
                    await editClub(advisor_email, currDays, desc, name, presEmail, roomNum, startTime, status, veepsEmails, secretPassword);
                }
                errorMessage.set("");
                if (!showVals) {
                    successMessage.set(name + " has been successfully registered. In order to view your club on the website, your advisor first needs to verify it. They should have gotten an email with a code to verify the club. Once they do so, " + name + " will be visible on the PathFinders website.");
                } else {
                    successMessage.set("Successfully edited " + name + "! Reload the page to see the changes.");
                }
            } catch (error) {
                errorMessage.set("" + error);
                console.log("Failed to edit club: " + error);
            } finally {
                isLoading.set(false);
            }
        } else {
            console.log("Club registration criteria not met!");
            isLoading.set(false);
        }
        
    }

    export let view = "";
    export let showVals = false;
    export let currClub = {}

    onMount(() => {
        console.log("onmount");
        if (showVals) {
            console.log("showvals");
            console.log(currClub);
            clubDays = currClub.club_days;
            console.log(clubDays);
            currDays = currClub.club_days;
        }
        user.subscribe(value => {
            if (value) {
                loggedInEmail = value.email;
            } else {
                loggedInEmail = '';
            }
        });
    });

    const openConfirmRegisterModal = () => confirmRegisterModal.set(true);
    const closeConfirmRegisterModal = () => confirmRegisterModal.set(false);
</script>

<!-- Confirm register club: -->

{#if $confirmRegisterModal}

  <Modal title="Register New Club" open={$confirmRegisterModal} on:close={openConfirmRegisterModal} >
    <p class="text-base leading-relaxed text-gray-800 dark:text-gray-400">
        <center>
            rehaan
            <br>
        </center>
    </p>
  </Modal>

{/if}

<br>
<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">{view} Your Club</h2>
<form on:submit={() => {
    handleSubmit();
    // checkAllInfo();
    // openConfirmRegisterModal();
}}>
    {#if !showVals}
        {#if $errorMessage.length > 1}
            <Alert color="red">
                <span class="font-medium">Registration failed:</span>
                {$errorMessage}
            </Alert>
        {:else if $successMessage.length > 1}
            <Alert color="blue">
                <span class="font-medium">Next steps:</span>
                {$successMessage}
            </Alert>
        {/if}
    {:else}
        {#if $errorMessage.length > 1}
            <Alert color="red">
                <span class="font-medium">Club editing failed:</span>
                {$errorMessage}
            </Alert>
        {:else if $successMessage.length > 1}
            <Alert color="blue">
                <span class="font-medium">Success:</span>
                {$successMessage}
            </Alert>
        {/if}
    {/if}
    <br>
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
                <MultiSelect class="mt-2" id="clubdays" placeholder="Select day(s)" items={daysoftheweek} bind:value={currDays} />
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
    <Button color="green" type="submit">
        {#if $isLoading}
            Loading .. <Spinner color="green"/>
        {:else}
            {view} Club
        {/if}
    </Button>
    </div>
    <br>
    <br><br>
</form>
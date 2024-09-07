<script>
    import { onMount } from 'svelte';
    import { Section } from 'flowbite-svelte-blocks';
    import { Label, Input, Button, Select, Textarea, MultiSelect, P, Spinner, Alert, Avatar, Heading } from 'flowbite-svelte';
    import { getCollectionDoc } from "$lib/api";
    import { createMentor, editMentor, races, religions, genders, languages, academics, UploadMentorImage, SetMentorImage, sendMentorPitch } from "../../lib/mentor";
    import { user } from "../../stores/auth";
    import { writable } from 'svelte/store';
    import { getUserDocData } from '../../lib/user';

    let isLoading = writable(false);
    let imgLoading = writable(false);
    let showSubmitImage = writable(false);
    let errorMessage = writable("");
    let successMessage = writable("");

    let email = "";
    let loggedInUser;

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

    let bio;

    let importRaces = [];

    let pitch = "";

    const handleMentorPitch = async () => {
        if (pitch.length < 2) {
            successMessage.set("");
            errorMessage.set("Application is too short");
            return -1;
        }
        try {
            isLoading.set(true);
            email = loggedInUser.email;
            await sendMentorPitch(email, pitch);
            errorMessage.set("");
            successMessage.set("Your application has been sent. Expect a response in 1-3 days.");
        } catch (error) {
            console.log("Failed to handlementorpitch: " + error);
            successMessage.set("");
            errorMessage.set("" + error);
        } finally {
            isLoading.set(false);
        }
    }

    const handleSubmitImage = async (file) => {
        // First make sure it is the correct dimensions, type, etc.
        if (file.length < 1) { 
            errorMessage.set("Please select a file.");
            return -1;
        }
        console.log(file);
        imgLoading.set(true);
        errorMessage.set("");
        successMessage.set("");
        try {
            const res = await UploadMentorImage(file);
            console.log(res, currEmail);
            if (showVals) {
                const res2 = await SetMentorImage(res, currMentor.email);
                console.log(res2);
                successMessage.set("Successfully uploaded profile picture.");
            } else {
                const res2 = await SetMentorImage(res, currEmail);
                console.log(res2);
                successMessage.set("Successfully uploaded profile picture.");
            }
            
        } catch (error) {
            console.log("failure in handling submit img: " + error);
            errorMessage.set("Image upload failure: " + error);
        } finally {
            imgLoading.set(false);
        }
    }

    const handleSubmit = async () => {
        try {
            showSubmitImage.set(false);
            isLoading.set(true);
            const firstName = document.querySelector("#firstname").value;
            const lastName = document.querySelector("#lastname").value;
            const bio = document.querySelector("#bio").value;

            if (view.localeCompare("Register") === 0) {
                if (academicsSelected.length < 1) {
                    errorMessage.set("Please select at least one academic interest.");
                    showSubmitImage.set(false);
                    isLoading.set(false);
                    return -1;
                }
                const mes = await createMentor(firstName, lastName, bio, currEmail, racesSelected, religionsSelected, genderSelected, languagesSelected, academicsSelected);
                console.log(mes);
                errorMessage.set("");
                successMessage.set("You are successfully registered as a mentor! Add a profile picture below:");
                showSubmitImage.set(true);
            } else if (view.localeCompare("Edit") === 0) {
                await editMentor(firstName, lastName, bio, currMentor.email, newRaces, newReligions, newGender, newLanguages, newAcademics);
                errorMessage.set("");
                successMessage.set("Successfully edited. Reload the page to see the changes.");
            }
        } catch (error) {
            console.log("Failed to register / edit mentor: " + error);
            errorMessage.set("" + error);
        } finally {
            if (academicsSelected.length < 1) {
                showSubmitImage.set(false);
                isLoading.set(false);
            } else {
                isLoading.set(false);
                showSubmitImage.set(true);
            }
        }
    }

    let newImportRaces = [];

    function basicSetUp() {
        user.subscribe(async value => {
            if (value) {
                email = value.email;
                console.log(email);
                loggedInUser = await getUserDocData(email);
                console.log(loggedInUser);
            } else {
                email = '';
            }
        });
    }

    onMount(async () => {
        importRaces = await getCollectionDoc("Demographics", "9qHHDN65kY2yIfV4BnnK");
        importRaces = importRaces.races;
        console.log(importRaces);
        basicSetUp();

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
            console.log(currMentor);
        }
    });

    export let view = "";
    export let showVals = false;
    export let currMentor = {}
    export let currEmail = "";

    let file = ""

</script>

<br>

{#if loggedInUser}

    {#if !showVals && !loggedInUser.mentor_eligible}

        <Heading tag="h2" customSize="text-4xl font-extrabold ">Become a mentor</Heading>

        <div class="mentoreligibilewrapper" style="border-radius:10px;margin-top:1rem;">

            <P class="mb-3" weight="light" color="text-gray-600">
                By becoming a mentor, you agree to work one-on-one with freshmen or sophomores in one or more specialized areas of study. It is up to you and your mentee to decide what to study, where, and for how long.
            </P>
            <P class="mb-3" weight="light" color="text-gray-600">
                Write a response as to why you want to be a mentor. Include what you can bring to the table and how you can ensure that your mentees will be supported to the best of your ability. Once you respond, we will read over your application and send you an email for the next steps.
            </P>
            <P class="mb-3" weight="light" color="text-gray-600">
                Thank you and send us an <a target="_blank" href="mailto:crlsclubfinders@gmail.com"><u>email</u></a> if you have any questions!
            </P>
            <form>
                <Textarea id="mentorpitch" rows="10" placeholder="I want to become a mentor because ..." bind:value={pitch}></Textarea>
                <Button outline color="blue" on:click={handleMentorPitch}>
                    Submit
                    {#if $isLoading}
                        <Spinner size={5} color="blue"/>
                    {/if}
                </Button>
            </form>

            {#if $errorMessage.length > 1}
                <Alert color="red">
                    <span class="font-medium">Application failed:</span>
                    {$errorMessage}
                </Alert>
            {:else if $successMessage.length > 1}
                <Alert color="blue">
                    <span class="font-medium">Success:</span>
                    {$successMessage}
                </Alert>
            {/if}

        </div>

    
    {:else}

        <h2 class="mb-4 text-xl font-bold text-gray-900">{view} Mentor</h2>
        <form on:submit={handleSubmit}>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div class="w-full">
                <Label for="firstname" class="mb-2">First Name <i style="color: red;">*</i></Label>
                {#if showVals}
                    <Input type="text" id="firstname" placeholder="First Name" value={currMentor.firstname}/>
                {:else}
                    <Input type="text" id="firstname" placeholder="First Name" required/>
                {/if}
            </div>
            <div class="w-full">
                <Label for="lastname" class="mb-2">Last Name <i style="color: red;">*</i></Label> 
                {#if showVals}
                    <Input type="text" id="lastname" placeholder="Last Name" value={currMentor.lastname}/>
                {:else}
                    <Input type="text" id="lastname" placeholder="Last Name" required/>
                {/if}
            </div>
            <div class="w-full">
                <Label>
                    Races
                    {#if showVals}
                        <MultiSelect class="mt-2" id="races" size="lg" items={races} placeholder="Select your race(s)" bind:value={newRaces}/>
                    {:else}
                        <MultiSelect class="mt-2" id="races" items={newImportRaces} placeholder="Select your race(s)" bind:value={racesSelected}/>
                    {/if}
                </Label>
            </div>
            <div class="w-full">
                <Label>
                    Religions
                    {#if showVals}
                        <MultiSelect class="mt-2" id="religions" size="lg" items={religions} placeholder="Select your religion(s)" bind:value={newReligions}/>
                    {:else}
                        <MultiSelect class="mt-2" id="religions" items={religions} placeholder="Select your religion(s)" bind:value={religionsSelected}/>
                    {/if}
                </Label>
            </div>
            <div class="w-full">
                <Label>
                    Gender
                    {#if showVals}
                        <MultiSelect class="mt-2" id="gender" items={genders} placeholder="Select your gender(s)" bind:value={newGender}/>
                    {:else}
                        <MultiSelect class="mt-2" id="gender" items={genders} placeholder="Select your gender(s)" bind:value={genderSelected}/>
                    {/if}
                </Label>
            </div>
            <div class="w-full">
                <Label>
                    Languages
                    {#if showVals}
                        <MultiSelect class="mt-2" id="languages" items={languages} placeholder="Select your language(s)" bind:value={newLanguages}/>
                    {:else}
                        <MultiSelect class="mt-2" id="languages" items={languages} placeholder="Select your language(s)" bind:value={languagesSelected}/>
                    {/if}
                </Label>
            </div>
            <div class="w-full">
                <Label>
                    Academics <i style="color: red;">*</i>
                    {#if showVals}
                        <MultiSelect class="mt-2" id="academics" items={academics} placeholder="Select your academics(s)" bind:value={newAcademics}/>
                    {:else}
                        <MultiSelect class="mt-2" id="academics" items={academics} placeholder="Select your academics(s)" bind:value={academicsSelected}/>
                    {/if}
                </Label>
            </div>
            <div class="sm:col-span-2">
                <Label>
                    Bio <i style="color: red;">*</i>
                    {#if showVals}
                        <Textarea id="bio" placeholder="Leave a short bio so mentees can get to know you." rows="4" name="bio" bind:value={currMentor.bio}/>
                    {:else}
                        <Textarea id="bio" placeholder="Leave a short bio so mentees can get to know you." rows="4" name="bio" required/>
                    {/if}
                </Label>
            </div>
            <Button color="green" type="submit">
                {view}
                {#if $isLoading}
                    <Spinner color="green"/>
                {/if}
            </Button>
            </div>
        </form>
        
        <br>
        {#if !showVals}
            {#if $errorMessage.length > 1}
                <Alert color="red">
                    <span class="font-medium">Registration failed:</span>
                    {$errorMessage}
                </Alert>
            {:else if $successMessage.length > 1}
                <Alert color="blue">
                    <span class="font-medium">Success:</span>
                    {$successMessage}
                </Alert>
            {/if}
        {:else}
            {#if $errorMessage.length > 1}
                <Alert color="red">
                    <span class="font-medium">Mentor editing failed:</span>
                    {$errorMessage}
                </Alert>
            {:else if $successMessage.length > 1}
                <Alert color="blue">
                    <span class="font-medium">Success:</span>
                    {$successMessage}
                </Alert>
            {/if}
        {/if}
        
        {#if $showSubmitImage || showVals}
        
            <Avatar size="xl" src={currMentor.profile_pic} border/>  
        
            <div class="w-full" style="margin-top:2rem;margin-bottom:2rem;">
                <Label> Upload profile picture </Label>
                <input style="border:1px solid black;border-radius:5px;" type="file" accept="image/*" required on:change={e => file = e.target.files[0]} />
                <!-- <br> -->
                <Button size="md" outline color="blue" on:click={async () => {
                    console.log(file);
                    await handleSubmitImage(file);
                }}>
                    Upload
                    {#if $imgLoading}
                        <Spinner size={5} color="blue"/>
                    {/if}
                </Button>
            </div>
        
        {/if}


    {/if}

{/if}


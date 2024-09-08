<script>
    import { onMount } from 'svelte';
    import { Card, Button, ButtonGroup, Spinner, Avatar, Toast, P, A, CardPlaceholder, Modal, Dropdown, Checkbox, Heading } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';
    import { getCollection } from "$lib/api";
    import { user } from "../../stores/auth";
    import { getUserDocData, toggleClub, fetchUserInfo } from "../../lib/user";
    import { writable } from 'svelte/store';
    import { PenOutline } from 'flowbite-svelte-icons';
    import RegisterForm from '../becomeamentor/RegisterForm.svelte';
    import { TableHeader } from 'flowbite-svelte-blocks';
    import { Search } from 'flowbite-svelte';
    import { createMentor, editMentor, races, religions, genders, languages, academics, UploadMentorImage, SetMentorImage, sendMentorPitch, listAcademics, listGenders, listLanguages, listRaces, listReligions } from "../../lib/mentor";

    let wholeReady = writable(false);
    let showEditModal = writable(false);
    let filters = writable([]);

    let ready = false;

    let mentors = [];

    let email = "";

    let userInfo;

    let view = "Edit";
    let showVals = true;

    let currMentor;

    let searching = "";

    // Filter functionality

    function toggleFilters(item) {
        filters.update(currentItems => {
        // Check if the item exists in the array
        if (currentItems.includes(item)) {
            // Remove the item if it exists
            return currentItems.filter(i => i !== item);
        } else {
            // Add the item if it doesn't exist
            return [...currentItems, item];
        }
        });
    }

    $: filteredMentors = mentors.filter(obj => {
        // Only apply filters to fields that have values in the arrays
        return $filters.every(filter => {
        return (
            (obj.academics.length > 0 && obj.academics.includes(filter)) ||
            (obj.races.length > 0 && obj.races.includes(filter)) ||
            (obj.languages.length > 0 && obj.languages.includes(filter)) ||
            (obj.religions.length > 0 && obj.religions.includes(filter)) ||
            (obj.gender.length > 0 && obj.gender.includes(filter))
        );
        });
    });

    function labelIncludesSearchTerm(label, searchTerm) {
      if (typeof label === 'string' && typeof searchTerm === 'string') {
        return label.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    }

    function filtersIncluded(mentor) {
        console.log(mentor);
        let all_info = [];
        if (mentor.academics.length > 0) { all_info.push(mentor.academics); }
        if (mentor.gender.length > 0) { all_info.push(mentor.gender); }
        if (mentor.languages.length > 0) { all_info.push(mentor.languages); }
        if (mentor.races.length > 0) { all_info.push(mentor.races); }
        if (mentor.religions.length > 0) { all_info.push(mentor.religions); }
        console.log(all_info);
        console.log($filters.length);        
        // if any of these are in filters, then return true.
        for (let i = 0; i < all_info.length; i++) {
            for (let j = 0; j < $filters.length; j++) {
                if (all_info[i].localeCompare($filters[j]) === 0) {return true};
            }
        }
        return false;
    }

    onMount(async () => {
        wholeReady.set(false);
        user.subscribe(async value => {
            if (value) {
                email = value.email;
                userInfo = await getUserDocData(email);
                console.log(userInfo);
            }
        });
        try {
            mentors = await getCollection("Mentors");
            console.log(mentors);
            console.log("subscribe start");
            
            console.log("subscribe end");
        } catch(error) {
            console.log("Onmount failed: " + error);
        } finally {
            wholeReady.set(true);
        }
    });

    const openshowEditModal = () => showEditModal.set(true);
    const closeshowEditModal = () => showEditModal.set(false);

</script>

<style>
   .card-container {
        padding: 3rem;
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
   }

   /* .maincard {
      background: #fff;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
   } */

   @media (max-width: 1200px) {
      .card-container {
         grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
   }

   @media (max-width: 800px) {
      .card-container {
         grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
   }

   @media (max-width: 500px) {
      .card-container {
         grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }
   }
</style>

<Modal class="min-w-full" open={$showEditModal} on:close={closeshowEditModal}>
    <RegisterForm {view} {currMentor} {showVals}></RegisterForm>
</Modal>

{#if $wholeReady}

    <div class="infowrapper" style="margin-left:3rem;margin-right:3rem;margin-top:1rem;">
        <Heading tag="h4" customSize="text-4xl font-extrabold ">Find a mentor</Heading>
        <P class="mb-2" weight="light" color="text-gray-500 dark:text-gray-400">
            Below you can search for and filter juniors and seniors who you believe can best support your academic interests.
        </P>
        <P class="mb-2" weight="light" color="text-gray-500 dark:text-gray-400">
            Through one-on-one support, you can learn about opportunities in Cambridge and CRLS, which classes to take, and how to best find success in highschool.
        </P>
        <P class="mb-2" weight="light" color="text-gray-500 dark:text-gray-400">
            Simply click "message" for whichever mentor you believe can best help you achieve your goals. Send them an email and start your journey today.
        </P>
    </div>

    <div class="searchwrapper" style="margin-right:3rem;margin-left:3rem;margin-top:1rem;">
        <TableHeader headerType="search">
            <Search bind:value={searching} slot="search" placeholder="Search {mentors.length} mentors" size="md"/>
            <div class=""></div> 
            <Button color='alternative'>Academics</Button>
            <Dropdown class="w-48 p-3 space-y-2 text-sm">
                {#each listAcademics as r}
                    {#if $filters.includes(r)}
                        <Checkbox checked on:change={() => {
                            toggleFilters(r)
                            console.log($filters);
                        }}><li>{r}</li></Checkbox>
                    {:else}
                        <Checkbox on:change={() => {
                            toggleFilters(r)
                            console.log($filters);
                        }}><li>{r}</li></Checkbox>
                    {/if}
                {/each}
            </Dropdown>
            <Button color='alternative'>Race</Button>
            <Dropdown class="w-48 p-3 space-y-2 text-sm">
                {#each listRaces as r}
                    {#if $filters.includes(r)}
                        <Checkbox checked on:change={() => {
                            toggleFilters(r)
                            console.log($filters);
                        }}><li>{r}</li></Checkbox>
                    {:else}
                        <Checkbox on:change={() => {
                            toggleFilters(r)
                            console.log($filters);
                        }}><li>{r}</li></Checkbox>
                    {/if}
                {/each}
            </Dropdown>
            <Button color='alternative'>Religion</Button>
            <Dropdown class="w-48 p-3 space-y-2 text-sm">
                {#each listReligions as r}
                    {#if $filters.includes(r)}
                        <Checkbox checked on:change={() => {
                            toggleFilters(r)
                            console.log($filters);
                        }}><li>{r}</li></Checkbox>
                    {:else}
                        <Checkbox on:change={() => {
                            toggleFilters(r)
                            console.log($filters);
                        }}><li>{r}</li></Checkbox>
                    {/if}
                {/each}
            </Dropdown>
            <Button color='alternative'>Language</Button>
            <Dropdown class="w-48 p-3 space-y-2 text-sm">
                {#each listLanguages as r}
                    {#if $filters.includes(r)}
                        <Checkbox checked on:change={() => {
                            toggleFilters(r)
                            console.log($filters);
                        }}><li>{r}</li></Checkbox>
                    {:else}
                        <Checkbox on:change={() => {
                            toggleFilters(r)
                            console.log($filters);
                        }}><li>{r}</li></Checkbox>
                    {/if}       
                {/each}
            </Dropdown>
            <Button color='alternative'>Gender</Button>
            <Dropdown class="w-48 p-3 space-y-2 text-sm">
                {#each listGenders as r}
                    {#if $filters.includes(r)}
                        <Checkbox checked on:change={() => {
                            toggleFilters(r)
                            console.log($filters);
                        }}><li>{r}</li></Checkbox>
                    {:else}
                        <Checkbox on:change={() => {
                            toggleFilters(r)
                            console.log($filters);
                        }}><li>{r}</li></Checkbox>
                    {/if}
                {/each}
            </Dropdown>
            <Button outline color="dark" on:click={() => {
                filters.set([]);
            }}>Reset filters</Button>
        </TableHeader>   
        {#if $filters.length > 0}
        <br>
            <P class="mb-2" weight="light" color="text-gray-700">
                Filters: {$filters.join(", ")}
            </P>
        {/if}
    
    </div>

    <div class="card-container">
        {#each filteredMentors as m}

            {#if labelIncludesSearchTerm(m.firstname, searching) ||labelIncludesSearchTerm(m.lastname, searching) || labelIncludesSearchTerm(m.bio, searching) ||
            labelIncludesSearchTerm(m.firstname + " " + m.lastname, searching) }
               
                <Card padding="md">
                    <div class="flex flex-col items-center pb-4">
                    <Avatar size="xl" src={m.profile_pic} border class="ring-blue-400"/>
                    <h5 class="mb-1 text-xl font-medium text-gray-900">
                        {m.firstname} {m.lastname}
                        {#if m.email == email}
                            <Button size="xs" pill outline color="dark" on:click={() => {
                                console.log("clicked");
                                currMentor = m;
                                console.log(currMentor);
                                openshowEditModal();
                            }}><PenOutline size="xs"></PenOutline></Button>
                        {/if}
                    </h5>
                    <span class="text-sm text-gray-500">
                        <center><u>Academic Interests:</u> <b>{m.academics.join(", ")}</b></center>
                    </span>
                    <span class="text-sm text-gray-500">
                        {#if m.languages.length > 0}
                            <center><i>Language I Speak:</i> {m.languages}</center>
                        {/if}
                    </span>
                    <span class="text-sm text-gray-500">
                        <center>{m.races}</center>
                    </span>
                    <span class="text-sm text-gray-500">
                        <center>{m.religions}</center>
                    </span>
                    <span class="text-sm text-gray-500">
                        <center>{m.gender}</center>
                    </span>
                    <span style="border-top: 1px solid black;" class="text-sm text-gray-800">
                        <center>{m.bio}</center>
                    </span>
                    <div class="flex mt-4 space-x-3 rtl:space-x-reverse lg:mt-6">
                        <Button outline color="blue" class="">
                            <A target="_blank" href="https://mail.google.com/mail/?view=cm&fs=1&to={m.email}&su=CRLS%20PathFinders%20Mentee" class="font-medium hover:underline">Message</A>
                        </Button>
                    </div>
                    </div>
                </Card>

            {/if}
          
        {/each}
    </div>

{:else}

    <div class="card-container">
        <CardPlaceholder />
        <CardPlaceholder />
        <CardPlaceholder />
        <CardPlaceholder />
        <CardPlaceholder />
    </div>

{/if}

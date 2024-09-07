<script>
    import { onMount } from 'svelte';
    import { Card, Button, ButtonGroup, Spinner, Avatar, Toast, P, CardPlaceholder, Modal } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';
    import { getCollection } from "$lib/api";
    import { user } from "../../stores/auth";
    import { getUserDocData, toggleClub, fetchUserInfo } from "../../lib/user";
    import { writable } from 'svelte/store';
    import { PenOutline } from 'flowbite-svelte-icons';
    import RegisterForm from '../becomeamentor/RegisterForm.svelte';

    let wholeReady = writable(false);
    let showEditModal = writable(false);

    let ready = false;

    let mentors = [];

    let email = "";

    let userInfo;

    let view = "Edit";
    let showVals = true;

    let currMentor;

    onMount(async () => {
        wholeReady.set(false);
        user.subscribe(async value => {
            console.log("val");
            if (value) {
                console.log("OK");
                email = value.email;
                userInfo = await getUserDocData(email);
                console.log(userInfo);
            }
            console.log("done ok");
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

    <div class="card-container">
        {#each mentors as m}

            <Card padding="md">
                <div class="flex flex-col items-center pb-4">
                <Avatar size="xl" src={m.profile_pic} border class="ring-blue-400"/>
                <h5 class="mb-1 text-xl font-medium text-gray-900">
                    {m.firstname} {m.lastname}
                    {#if m.email == email}
                        <Button size="xs" pill outline color="blue" on:click={() => {
                            console.log("clicked");
                            currMentor = m;
                            console.log(currMentor);
                            openshowEditModal();
                        }}><PenOutline></PenOutline></Button>
                    {/if}
                </h5>
                <span class="text-sm text-gray-500">
                    <i>Academic Interests: </i>{m.academics}
                </span>
                <span class="text-sm text-gray-500">
                    <i>Language I Speak: </i>{m.languages}
                </span>
                <span class="text-sm text-gray-500">
                    {m.races}
                </span>
                <span class="text-sm text-gray-500">
                    {m.religions}
                </span>
                <span class="text-sm text-gray-500">
                    {m.gender}
                </span>
                <span style="border-top: 1px solid black;" class="text-sm text-gray-800">
                    {m.bio}
                </span>
                <div class="flex mt-4 space-x-3 rtl:space-x-reverse lg:mt-6">
                    <Button outline color="dark">Add friend</Button>
                    <Button color="light" class="">Message</Button>
                </div>
                </div>
            </Card>
          
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

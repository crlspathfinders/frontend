<script>
    import { onMount } from 'svelte';
    import { Card, Button, ButtonGroup, Spinner, Toast } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';
    import { getCollection } from "$lib/api";
    import { user } from "../../stores/auth";
    import { getUserDocData, toggleClub } from "../../lib/user";
    import { writable } from 'svelte/store';
    import { fly } from 'svelte/transition';

    let inClubs = writable([]);
    let isLoading = writable(null);
    let showToast = writable(false);

    let ready = false;

    let clubs = [];

    let myClubs = [];

    let email;

    let currClick = "";

    const handleClick = async (clubId) => {
        try {
            isLoading.set(true);
            const res = await toggleClub(email, clubId);
        } catch(error) {
            console.log("Failed to toggle club! " + error)
        } finally {
            isLoading.set(false);
            const userInfo = await getUserDocData(email);
            myClubs = userInfo.joined_clubs;
            inClubs.set(myClubs);
            setTimeout(() => {
                showToast.set(false);
            }, 3000);
            showToast.set(true)
        }
    }

    onMount(async () => {
        // userInfo = await fetchUserInfo();
        // if (userInfo["uid"] !== null) { console.log(userInfo["uid"]); }
        // console.log(userInfo);
        user.subscribe(async value => {
            if (value) {
                email = value.email;
                const userInfo = await getUserDocData(email);
                myClubs = userInfo.joined_clubs;
                inClubs.set(myClubs);
                console.log(myClubs);
            }
        });
    });

    onMount(async () => {
        clubs = await getCollection("Clubs");
        ready = true;
    })

</script>

<style>
   .card-container {
        padding: 3rem;
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(3, minmax(100px, 1fr));
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

{#if $showToast}

    <div class="toastwrapper" style="z-index:10;">
        <Toast transition={fly} params={{ x: 200 }} position="bottom-right" color="green" class="mb-4">
            <!-- <DownloadOutline slot="icon" class="w-6 h-6" /> -->
            Successfully joined / left club
        </Toast>
    </div>

{/if}

{#if ready}

    <div class="card-container">

        {#each clubs as club}

            {#if club.status == "Approved"}

                <div class="space-y-4">
                    <Card img="https://imagedelivery.net/Gm-NkdakOalj7eMFrJcZPA/5c4b45b8-8a42-4068-9796-658093028500/public">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{club.club_name}</h5>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">{club.club_description}</p>
                    <ButtonGroup>
                        <Button pill color="yellow">
                            <a href="/findaclub/{club.id}">View Club</a>
                        </Button>
                        {#if myClubs.includes(club.id)}
                            <Button pill color="red" on:click={() => {
                                    currClick = club.id;
                                    handleClick(club.id);
                                }}>
                                Leave Club
                                 {#if $isLoading} 
                                    {#if currClick == club.id}
                                        <Spinner size={4} color="red"/> 
                                    {/if}
                                {/if}
                            </Button>
                        {:else}
                            <Button pill color="green" on:click={() => {
                                    currClick = club.id;
                                    handleClick(club.id)
                                }}>
                                Join Club 
                                {#if $isLoading} 
                                    {#if currClick == club.id}
                                        <Spinner size={4} color="green"/> 
                                    {/if}
                                {/if}
                            </Button>
                        {/if}
                    </ButtonGroup>
                    </Card>
                </div>

            {/if}

        {/each}
    </div>
    
{/if}
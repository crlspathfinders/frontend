<script>
    import { onMount } from 'svelte';
    import { Card, Button, ButtonGroup, Spinner, Avatar, Toast, P, CardPlaceholder } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';
    import { getCollection } from "$lib/api";
    import { user } from "../../stores/auth";
    import { getUserDocData, toggleClub } from "../../lib/user";
    import { writable } from 'svelte/store';

    let wholeReady = writable(false);
    let inClubs = writable([]);
    let isLoading = writable(null);

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
        wholeReady.set(false);
        try {
            clubs = await getCollection("Clubs");
            ready = true;
        } catch(error) {
            console.log("Onmount failed: " + error);
        } finally {
            wholeReady.set(true);
        }
    })

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

{#if $wholeReady}

    <div class="card-container">
        {#each clubs as club}

        <Card padding="md">
            <div class="flex flex-col items-center pb-4">
              <Avatar size="lg" src="https://imagedelivery.net/Gm-NkdakOalj7eMFrJcZPA/5c4b45b8-8a42-4068-9796-658093028500/public" />
              <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Bonnie Green</h5>
              <span class="text-sm text-gray-500 dark:text-gray-400">Visual Designer</span>
              <div class="flex mt-4 space-x-3 rtl:space-x-reverse lg:mt-6">
                <Button>Add friend</Button>
                <Button color="light" class="dark:text-white">Message</Button>
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

<script>
    import { onMount } from 'svelte';
    import { Card, Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';
    import { getCollection } from "$lib/api";

    let ready = false;

    let clubs = [];

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
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
   }

   .maincard {
      background: #fff;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
   }

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

{#if ready}

    <div class="card-container">
        {#each clubs as club}

            {#if club.status == "Approved"}

                <div class="maincard max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <a href="/">
                        <!-- <img class="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" /> -->
                    </a>
                    <div class="p-5">
                        <a href="/findaclub/{club.id}">
                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{club.club_name}</h5>
                        </a>
                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{club.club_description}.</p>
                        <a href="/findaclub/{club.id}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Read more
                            <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </a>
                    </div>
                </div>

            {/if}

        {/each}
    </div>
    

{/if}

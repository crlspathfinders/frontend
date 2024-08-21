<script>
    import { onMount } from 'svelte';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup, Modal, Spinner, Toast } from 'flowbite-svelte';
    import { Section } from 'flowbite-svelte-blocks';
    // import paginationData from '../utils/advancedTable.json'
    import { PlusOutline, ChevronDownOutline, FilterSolid, ChevronRightOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';
    import { getCollection } from "../../../lib/api";
    import EditClub from './EditClub.svelte';
    import StatusModal from './StatusModal.svelte';
    import { writable } from 'svelte/store';
    import { changeStatus } from '../../../lib/club';
    import { DotsHorizontalOutline, DotsVerticalOutline } from 'flowbite-svelte-icons';
    import { ToolbarButton, DropdownDivider } from 'flowbite-svelte';
    import { fly } from 'svelte/transition';

    let isLoading = writable(false);
    let modalOpen = writable(false);
    let status = writable(null);
    let showToast = writable(false);

    let message = "";

    const handleStatus = async (secPass, status) => {
        isLoading.set(true);
        try {
            message = await changeStatus(secPass, status);
            console.log(message);
        } catch (error) {
            console.log("Failed to change status: " + error);
        } finally {
            // status.set(currClub.status);
            isLoading.set(false);
            clubs = await getCollection("Clubs");
            closeModal();
            setTimeout(() => {
                showToast.set(false);
            }, 6000);
            showToast.set(true)
        }
    }

    let divClass='bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
    let innerDivClass='flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
    let searchClass='w-full md:w-1/2 relative';
    let svgDivClass='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
    let classInput="text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10";

    let clubs = [];

    let searching = "";

    let editOn = false;

    let currClub;

    let statusOn = false;

    onMount(async () => {
        clubs = await getCollection("Clubs");
        console.log(clubs);
    });

    const openModal = () => modalOpen.set(true);
    const closeModal = () => modalOpen.set(false);

</script>


{#if $showToast}

  <div class="toastwrapper" style="z-index:10;">
      <Toast transition={fly} params={{ x: 200 }} position="bottom-right" color="green" class="mb-4">
          <!-- <DownloadOutline slot="icon" class="w-6 h-6" /> -->
          <p class="text-gray-700">
            Changed <b>{currClub.club_name}</b> status to <b>{currClub.status}</b>
          </p>
      </Toast>
  </div>

{/if}

{#if $modalOpen}

  <Modal title="Change {currClub.club_name} status" open={$modalOpen} on:close={closeModal} >
    <p class="text-base leading-relaxed text-gray-800 dark:text-gray-400">
        <center>
            <!-- Status: <b>{$status}</b> -->
            Status: <b>{currClub.status}</b>
            <br>
            {#if currClub.status == "Pending"}
                <Button on:click={() => { handleStatus(currClub.secret_password, currClub.status) }} color="green">
                  {#if $isLoading}
                    Loading ... <Spinner color="green"/>
                  {:else}
                    Approve {currClub.club_name}
                  {/if}
                </Button>
            {:else}
                <Button on:click={() => {
                    handleStatus(currClub.secret_password, currClub.status)
                }} color="red">
                  {#if $isLoading}
                    Loading ... <Spinner color="green"/>
                  {:else}
                    Revoke {currClub.club_name} approval
                  {/if} 
                </Button>
            {/if}
            
            <br>
        </center>
    </p>
  </Modal>

{/if}

<EditClub {editOn} {currClub}></EditClub>

<section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
  <div>
      <!-- Start coding here -->
      <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                          <th scope="col" class="px-4 py-3">Edit</th>
                          <th scope="col" class="px-4 py-3">Status</th>
                          <th scope="col" class="px-4 py-3">Name</th>
                          <th scope="col" class="px-4 py-3">President</th>
                          <th scope="col" class="px-4 py-3">Vice Presidents</th>
                          <th scope="col" class="px-4 py-3">Advisor</th>
                          <th scope="col" class="px-4 py-3">Days</th>
                          <th scope="col" class="px-4 py-3">Description</th>
                          <th scope="col" class="px-4 py-3">Room</th>
                          <th scope="col" class="px-4 py-3">Password</th>
                          <th scope="col" class="px-4 py-3">Start Time</th>
                          <th scope="col" class="px-4 py-3">
                              <span class="sr-only">Actions</span>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                    {#each clubs as club, i}
                      <tr class="border-b dark:border-gray-700">
                        <td>
                          <Button style="margin-left:1rem; margin-top:1rem;" outline color="dark" size="xs" on:click={() => {
                            console.log(club);
                            currClub = club;
                            console.log(club);
                            editOn = !editOn;
                        }}>Edit</Button>
                        </td>
                        <td class="px-2 py-1">
                          {#if club.status == "Approved"}
                          <Button style="margin-right:1rem; margin-top:1rem;" outline color="green" size="xs" on:click={() => {
                            // statusOn = !statusOn;
                            currClub = club;
                            // console.log(club);
                            // clubs = await getCollection("Clubs");
                            openModal();
                          }}>{club.status}</Button>
                        {:else}
                          <Button style="margin-right:1rem; margin-top:1rem;" outline color="red" size="xs" on:click={async () => {
                            // statusOn = !statusOn;
                            currClub = club;
                            // clubs = await getCollection("Clubs");
                            openModal();
                          }}>
                            {club.status}
                          </Button>
                        {/if}
                        </td>
                          <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{i + 1} | <b><u><a href="/findaclub/{club.id}">{club.club_name}</a></u></b></th>
                          <td class="px-4 py-3">{club.president_email}</td>
                          <td class="px-4 py-3">{club.vice_presidents_emails}</td>
                          <td class="px-4 py-3">{club.advisor_email}</td>
                          <td class="px-4 py-3">{club.club_days}</td>
                          <td class="px-4 py-3">{club.club_description}</td>
                          <td class="px-4 py-3">{club.room_number}</td>
                          <td class="px-4 py-3">{club.secret_password}</td>
                          <td class="px-4 py-3">{club.start_time}</td>
                          <!-- <b><td class="px-4 py-3">{club.status}</td></b> -->
                      </tr>
                    {/each}
                  </tbody>
              </table>
          </div>
      </div>
  </div>
</section>

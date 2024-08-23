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
    import { ToolbarButton, DropdownDivider, Popover } from 'flowbite-svelte';
    import { fly } from 'svelte/transition';
    import { toggleClub } from "../../../lib/user";

    let isLoading = writable(false);
    let modalOpen = writable(false);
    let status = writable(null);
    let showToast = writable(false);
    let removeLoading = writable(false);
    let deleteConfirmModal = writable(false);
    
    let clubMembers = []

    let currI;

    let message = "";

    const findClubMembers = (club) => {
      clubMembers = club.members;
      return clubMembers;
    }

    const handleStatus = async (secPass, status) => {
        isLoading.set(true);
        try {
            message = await changeStatus(secPass, status);
            console.log(message);
        } catch (error) {
            console.log("Failed to change status: " + error);
        } finally {
            // status.set(currClub.status);
            closeModal();
            isLoading.set(false);
            clubs = await getCollection("Clubs");
            setTimeout(() => {
                showToast.set(false);
            }, 6000);
            showToast.set(true)
        }
    }

    const handleClick = async (email, clubId) => {
        removeLoading.set(true);
        try {
            const res = await toggleClub(email, clubId);
        } catch (error) {
            console.log("Failed to toggle club! " + error);
        } finally {
            clubs = await getCollection("Clubs");
            for (let i = 0; i < clubs.length; i++) {
              if (clubs[i].id.localeCompare(clubId) === 0) {
                console.log(clubs[i]);
                currClub = clubs[i];
                clubMembers = currClub.members;
              }
            }
            // toggleRow(currI, currClub);
            removeLoading.set(false);
            closeDeleteConfirmModal();
            setTimeout(() => {
                showToast.set(false);
            }, 3000);
            // clubMembers.set()
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

    let openRow;
    let details;

    let currId;
    let currName;

    let currClick;

    const toggleRow = (i, club) => {
      currI = i;
      findClubMembers(club);
      openRow = openRow === i ? null : i
    }

    onMount(async () => {
        clubs = await getCollection("Clubs");
        console.log(clubs);
    });

    const openModal = () => modalOpen.set(true);
    const closeModal = () => modalOpen.set(false);

    const openDeleteConfirmModal = () => deleteConfirmModal.set(true);
    const closeDeleteConfirmModal = () => deleteConfirmModal.set(false);

</script>

<!-- {#if $showToast}

  <div class="toastwrapper" style="z-index:10;">
      <Toast transition={fly} params={{ x: 200 }} position="bottom-right" color="green" class="mb-4">
          <p class="text-gray-700">
            Changed <b>{currClub.club_name}</b> status to <b>{currClub.status}</b>
          </p>
      </Toast>
  </div>

{/if} -->

{#if $deleteConfirmModal}

  <Modal title="Delete Member" open={$deleteConfirmModal} on:close={closeDeleteConfirmModal}>
    <p class="text-base leading-relaxed text-gray-800 dark:text-gray-400">Deleting <b>{currClick}</b> from <b>{currName}</b> will permanently remove them from this club. They will have to join back themselves. You cannot undo this action.</p>
    <Button outline color="red" on:click={() => handleClick(currClick, currId) }>
      Delete
      {#if $removeLoading}
        <Spinner size={4} color="red"/>
      {/if}
    </Button>
  </Modal>

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
      <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                          <th scope="col" class="px-4 py-3">Edit</th>
                          <th scope="col" class="px-4 py-3">Status</th>
                          <th scope="col" class="px-4 py-3">Name</th>
                          <th scope="col" class="px-4 py-3">Members</th>
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
                            currClub = club;
                            openModal();
                          }}>
                            {club.status}
                          </Button>
                        {/if}
                        </td>
                          <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{i + 1} | <b><u><a href="/findaclub/{club.id}">{club.club_name}</a></u></b></th>
                          <td class="px-4 py-3" style="cursor:pointer;" id="members" on:click={() => toggleRow(i, club)}><u>{club.members.length}</u></td>
                          <td class="px-4 py-3">{club.president_email}</td>
                          <td class="px-4 py-3">{club.vice_presidents_emails}</td>
                          <td class="px-4 py-3">{club.advisor_email}</td>
                          <td class="px-4 py-3">{club.club_days}</td>
                          <td class="px-4 py-3">{club.club_description}</td>
                          <td class="px-4 py-3">{club.room_number}</td>
                          <td class="px-4 py-3">{club.secret_password}</td>
                          <td class="px-4 py-3">{club.start_time}</td>
                      </tr>

                      {#if openRow === i}

                        <td class="px-4 py-3">

                          <Table>

                            {#each clubMembers as mem, i}

                              <TableBodyRow>
                                <TableBodyCell>
                                  <Button outline color="red" size="xs" on:click={() => {
                                    currClick = mem;
                                    currId = club.id
                                    currName = club.club_name;
                                    openDeleteConfirmModal();
                                  }}>
                                  Remove
                                </Button>
                                </TableBodyCell>
                                <TableBodyCell>{i + 1} | {mem}</TableBodyCell>
                              </TableBodyRow>
                             
                            {/each}
                            
                          </Table>
                          
                        </td>

                      {/if}

                    {/each}

                  </tbody>
              </table>
          </div>
      </div>
  </div>
</section>

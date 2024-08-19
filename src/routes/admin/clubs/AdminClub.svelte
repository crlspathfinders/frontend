<script>
    import { onMount } from 'svelte';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup } from 'flowbite-svelte';
    import { Section } from 'flowbite-svelte-blocks';
    // import paginationData from '../utils/advancedTable.json'
    import { PlusOutline, ChevronDownOutline, FilterSolid, ChevronRightOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';
    import { getCollection } from "../../../lib/api";
    import EditClub from './EditClub.svelte';
    import StatusModal from './StatusModal.svelte';

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

</script>

<StatusModal {statusOn} {currClub}></StatusModal>

<EditClub {editOn} {currClub}></EditClub>

{#if clubs.length > 0}

<p class="text-xl">
  {clubs.length} Clubs
</p>

<!-- <Section name="advancedTable" classSection='bg-gray-50 p-3 sm:p-5'> -->
    <TableSearch placeholder="Search" hoverable={true} bind:value={searching} {divClass} {innerDivClass} {searchClass} {classInput} >
      <TableHead>
        <TableHeadCell padding="px-4 py-3" scope="col"></TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Name</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">President</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Vice Presidents</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Advisor</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Days</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Description</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Room</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Password</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Start Time</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Status</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each clubs as club, i}
          {#if club.club_name.includes(searching)}
            <TableBodyRow >
            <Button style="margin-left:1rem; margin-top:1rem;" outline color="red" size="xs" on:click={() => {
              currClub = club;
              editOn = !editOn;
          }}>
              <TableBodyCell tdClass="px-4 py-3"><b>Edit</b></TableBodyCell>
            </Button>
                <TableBodyCell tdClass="px-4 py-3">{i + 1} | <a href="/findaclub/{club.id}"><b><u>{club.club_name}</u></b></a></TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{club.president_email}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{club.vice_presidents_emails}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{club.advisor_email}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{club.club_days}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{club.club_description}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{club.room_number}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{club.secret_password}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{club.start_time}</TableBodyCell>
                {#if club.status == "Approved"}
                  <Button style="margin-right:1rem; margin-top:1rem;" outline color="green" size="xs" on:click={() => {
                    statusOn = !statusOn;
                    currClub = club;
                  }}>
                    <TableBodyCell tdClass="px-4 py-3"><b>{club.status}</b></TableBodyCell>
                  </Button>
                {:else}
                  <Button style="margin-right:1rem; margin-top:1rem;" outline color="red" size="xs" on:click={() => {
                    statusOn = !statusOn;
                    currClub = club;
                  }}>
                    <TableBodyCell tdClass="px-4 py-3"><b>{club.status}</b></TableBodyCell>
                  </Button>
                {/if}
            </TableBodyRow>
            {/if}

        {/each}
      </TableBody>
      <div slot="footer" class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
      <!-- <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing
        <span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
        of
        <span class="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
      </span> -->
        <!-- <ButtonGroup>
          <Button on:click={loadPreviousPage} disabled={currentPosition === 0}><ChevronLeftOutline size='xs' class='m-1.5'/></Button>
          {#each pagesToShow as pageNumber}
            <Button on:click={() => goToPage(pageNumber)}>{pageNumber}</Button>
          {/each}
          <Button on:click={loadNextPage} disabled={ totalPages === endPage }><ChevronRightOutline size='xs' class='m-1.5'/></Button>
        </ButtonGroup> -->
      </div>
    </TableSearch>
<!-- </Section> -->

{/if}
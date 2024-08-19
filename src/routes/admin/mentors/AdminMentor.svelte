<script>
    import { onMount } from 'svelte';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup } from 'flowbite-svelte';
    import { Section } from 'flowbite-svelte-blocks';
    // import paginationData from '../utils/advancedTable.json'
    import { PlusOutline, ChevronDownOutline, FilterSolid, ChevronRightOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';
    import { getCollection } from "../../../lib/api";
    import EditMentor from "./EditMentor.svelte";

    let divClass='bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
    let innerDivClass='flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
    let searchClass='w-full md:w-1/2 relative';
    let svgDivClass='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
    let classInput="text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10";

    let mentors = [];

    let searching = "";

    let editOn = false;

    let currMentor;

    let statusOn = false;

    onMount(async () => {
        mentors = await getCollection("Mentors");
        console.log(mentors);
    });

</script>

<!-- <StatusModal {statusOn} {currClub}></StatusModal> -->

<EditMentor {editOn} {currMentor}></EditMentor>

{#if mentors.length > 0}

<p class="text-xl">
  {mentors.length} Mentors
</p>

<Section name="advancedTable" classSection='bg-gray-50 dark:bg-gray-900 p-3 sm:p-5'>
    <TableSearch placeholder="Search" hoverable={true} bind:value={searching} {divClass} {innerDivClass} {searchClass} {classInput} >

    <div slot="header" class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
      <Button color='alternative'>Actions<ChevronDownOutline class="w-3 h-3 ml-2 " /></Button>
        <Dropdown class="w-44 divide-y divide-gray-100">
          <DropdownItem>Mass Edit</DropdownItem>
          <DropdownItem>Delete all</DropdownItem>
        </Dropdown>
      <Button color='alternative'>Filter<FilterSolid class="w-3 h-3 ml-2 " /></Button>
        <Dropdown class="w-48 p-3 space-y-2 text-sm">
          <h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Choose brand</h6>
          <li>
            <Checkbox>Apple (56)</Checkbox>
          </li>
          <li>
            <Checkbox>Microsoft (16)</Checkbox>
          </li>
          <li>
            <Checkbox>Razor (49)</Checkbox>
          </li>
          <li>
            <Checkbox>Nikon (12)</Checkbox>
          </li>
          <li>
            <Checkbox>BenQ (74)</Checkbox>
          </li>
        </Dropdown>
    </div>
      <TableHead>
        <TableHeadCell padding="px-4 py-3" scope="col"></TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">First Name</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Last Name</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Email</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Gender</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Language(s)</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Race(s)</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Religion(s)</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Academic(s)</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each mentors as mentor, i}
            <TableBodyRow >
            <Button style="margin-left:1rem; margin-top:1rem;" outline color="red" size="xs" on:click={() => {
              currMentor = mentor;
              editOn = !editOn;
          }}>
              <TableBodyCell tdClass="px-4 py-3"><b>Edit</b></TableBodyCell>
            </Button>
                <TableBodyCell tdClass="px-4 py-3">{i + 1} | {mentor.firstname}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{mentor.lastname}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{mentor.email}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{mentor.gender}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{mentor.languages}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{mentor.races}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{mentor.religions}</TableBodyCell>
                <TableBodyCell tdClass="px-4 py-3">{mentor.academics}</TableBodyCell>
            </TableBodyRow>

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
</Section>

{/if}
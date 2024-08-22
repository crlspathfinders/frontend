<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { getCollectionDoc } from "$lib/api";
    import { Section, News, HeroHeader, HeroBody } from 'flowbite-svelte-blocks';
    import { Button, P, Toast, Spinner, A } from 'flowbite-svelte';
    import { ArrowRightOutline, VideoCameraSolid } from 'flowbite-svelte-icons';
    import { user } from "../../../stores/auth";
    import { writable } from "svelte/store";
    import { toggleClub } from "../../../lib/user";
	import { fly } from "svelte/transition";
    import { getUserDocData } from "../../../lib/user";
    import { Li, List, DescriptionList } from 'flowbite-svelte';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { slide } from 'svelte/transition';

    let isLoading = writable(false);
    let showToast = writable(false);

    let ready = false;

    const clubId = $page.params.clubId;

    console.log(clubId);

    let clubInfo;

    let email;

    let userInfo;

    let userClubs = [];

    let vice_presidents;

    let members = [];

    let openRow
    let details

    const toggleRow = (i) => {
        openRow = openRow === i ? null : i
    }

    const handleClick = async (email, clubId) => {
        try {
            isLoading.set(true);
            const res = await toggleClub(email, clubId);
        } catch (error) {
            console.log("Failed to toggle club! " + error);
        } finally {
            isLoading.set(false);
            const userInfo = await getUserDocData(email);
            userClubs = userInfo.joined_clubs;
            clubInfo = await getCollectionDoc("Clubs", clubId);
            members = clubInfo.members;
            setTimeout(() => {
                showToast.set(false);
            }, 3000);
            showToast.set(true)
        }
    }

    onMount(async () => {
        clubInfo = await getCollectionDoc("Clubs", clubId);
        vice_presidents = clubInfo.vice_presidents_emails;
        members = clubInfo.members;
        console.log(vice_presidents);
        ready = true;
        console.log(clubInfo);
        user.subscribe(async value => {
            if (value) {
                email = value.email;
                const userInfo = await getUserDocData(email);
                console.log(userInfo);
                userClubs = userInfo.joined_clubs;
                console.log(userClubs);
                // myClubs = userInfo.joined_clubs;
                // inClubs.set(myClubs);
                // console.log(myClubs);
            }
        });

    })

</script>

{#if $showToast}

    <div class="toastwrapper" style="z-index:10;">
        <Toast transition={fly} params={{ x: 200 }} position="bottom-right" color="green" class="mb-4">
            <!-- <DownloadOutline slot="icon" class="w-6 h-6" /> -->
            Successfully joined / left club
        </Toast>
    </div>

{/if}

{#if ready}

    <Section name="heroDefault">
        <HeroHeader>
          <svelte:fragment slot="h1">{clubInfo.club_name}</svelte:fragment>
          <svelte:fragment slot="paragraph">{clubInfo.club_description}</svelte:fragment>
        </HeroHeader>
      
        <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            {#if userClubs.includes(clubId)}
                <Button pill color="red" on:click={() => {
                        // currClick = club.id;
                        handleClick(email, clubId);
                    }}>
                    Leave Club
                    {#if $isLoading} 
                        <Spinner size={4} color="red"/> 
                    {/if}
                </Button>
            {:else}
                <Button pill color="green" on:click={() => {
                        // currClick = club.id;
                        handleClick(email, clubId)
                    }}>
                    Join Club 
                    {#if $isLoading} 
                        <Spinner size={4} color="green"/> 
                    {/if}
                </Button>
            {/if}
        </div>
        <HeroBody>

            <div class="clubinfolistwrapper" style="text-align:left;">

                <List tag="dl" class="text-gray-900 dark:text-white divide-y divide-gray-200  dark:divide-gray-700">

                    <div class="flex flex-col pb-3">
                      <DescriptionList tag="dt" class="mb-1">President</DescriptionList>
                      <DescriptionList tag="dd"><a target="_blank" href="mailto:{clubInfo.president_email}"><b><u>{clubInfo.president_email}</u></b></a></DescriptionList>
                    </div>
        
                    {#each vice_presidents as vp, i}
        
                        {#if vp.length > 0}
        
                            <div class="flex flex-col pb-3">
                                <DescriptionList tag="dt" class="mb-1">Vice President {i + 1}</DescriptionList>
                                <DescriptionList tag="dd"><a target="_blank" href="mailto:{vp}"><u>{vp}</u></a></DescriptionList>
                            </div>
        
                        {/if}
        
                    {/each}
                
                    <div class="flex flex-col pb-3">
                      <DescriptionList tag="dt" class="mb-1">Room</DescriptionList>
                      <DescriptionList tag="dd">{clubInfo.room_number}</DescriptionList>
                    </div>
                    <div class="flex flex-col pb-3">
                        <DescriptionList tag="dt" class="mb-1">Start Time</DescriptionList>
                        <DescriptionList tag="dd">{clubInfo.start_time}</DescriptionList>
                    </div>
                    <div class="flex flex-col pb-3">
                        <DescriptionList tag="dt" class="mb-1">Advisor</DescriptionList>
                        <DescriptionList tag="dd"><a target="_blank" href="mailto:{clubInfo.advisor_email}"><u>{clubInfo.advisor_email}</u></a></DescriptionList>
                    </div>

                  </List>

            </div>

          
        </HeroBody>

        <Table>
            <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
              Members
              <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">See who else is in {clubInfo.club_name}</p>
            </caption>
            <TableHead>
              <!-- <TableHeadCell>Name</TableHeadCell> -->
              <TableHeadCell>Email</TableHeadCell>
              <!-- <TableHeadCell>Role</TableHeadCell> -->
              <TableHeadCell>
                <span class="sr-only">Remove Member</span>
              </TableHeadCell>
            </TableHead>
            <TableBody tableBodyClass="divide-y">
                {#each members as mem, i}
                    <TableBodyRow>
                        <!-- <TableBodyCell>Apple MacBook Pro 17"</TableBodyCell> -->
                        <TableBodyCell>{i + 1} | {mem}</TableBodyCell>
                        <!-- <TableBodyCell>Laptop</TableBodyCell> -->
                        <TableBodyCell>
                        <Button color="red" on:click={() => {
                            handleClick(mem, clubId);
                        }}>Remove</Button>
                        </TableBodyCell>
                    </TableBodyRow>
              {/each}
            </TableBody>
          </Table>

      </Section>

{/if}
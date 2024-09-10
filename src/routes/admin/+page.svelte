<script>
    import { onMount } from 'svelte';
    import { Tabs, TabItem, Spinner, ListPlaceholder } from 'flowbite-svelte';
    import AdminClub from "./clubs/AdminClub.svelte"
    import AdminMentor from './mentors/AdminMentor.svelte';
    import AdminUser from './users/AdminUser.svelte';
    import AdminAllInfo from './allinfo/AdminAllInfo.svelte';
    import { user } from '../../stores/auth';
    import { getUserDocData } from '../../lib/user';
    import { writable } from 'svelte/store';
    import NoAccessPage from '../NoAccessPage.svelte';

    let wholeReady = writable(false);

    let email = "";
    let userInfo;

    onMount(async () => {
        wholeReady.set(false);
        user.subscribe(async value => {
            if (value) {
                email = value.email;
                console.log(email);
                userInfo = await getUserDocData(email);
            } else {
                email = '';
            }
        });
        wholeReady.set(true);
        
    })
</script>

{#if $wholeReady}

    {#if userInfo}

        {#if userInfo.role == "Super Admin" || userInfo.role == "Admin"}

            <div style="margin:3rem; margin-top:0" class="admincontainer">
                <p class="text-xl">Admin Dashboard</p>

                <Tabs tabStyle="underline">
                    <TabItem open title="Users">
                        <AdminUser></AdminUser>
                    </TabItem>
                    <TabItem title="Mentors">
                        <AdminMentor></AdminMentor>
                    </TabItem>
                    <TabItem title="Clubs">
                        <AdminClub></AdminClub>
                    </TabItem>
                    <TabItem title="All Info">
                        <AdminAllInfo></AdminAllInfo>
                    </TabItem>
                </Tabs>

            </div>
        
        {:else}

            <NoAccessPage></NoAccessPage>
            
        {/if}

    {:else}

        <center>
            Gathering Data ... <Spinner color="green"/>
            <ListPlaceholder></ListPlaceholder>
        </center>

    {/if}

{/if}
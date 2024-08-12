<script>
    import { Tabs, TabItem } from 'flowbite-svelte';
    import AdminClub from "./clubs/AdminClub.svelte"
    import AdminMentor from './mentors/AdminMentor.svelte';
    import AdminUser from './users/AdminUser.svelte';
</script>

<div style="margin:3rem; margin-top:0" class="admincontainer">
    <p class="text-xl">Admin Dashboard</p>

    <Tabs tabStyle="underline">
        <TabItem open title="Clubs">
            <AdminClub></AdminClub>
        </TabItem>
        <TabItem title="Mentors">
            <AdminMentor></AdminMentor>
        </TabItem>
        <TabItem title="Users">
            <AdminUser></AdminUser>
        </TabItem>
    </Tabs>

</div>

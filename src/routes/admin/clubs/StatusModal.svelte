<script>
    import { Button, Modal } from 'flowbite-svelte';
    import { changeStatus } from '../../../lib/club';
    
    export let statusOn = false;
    export let currClub = {};

</script>

<Modal title="Change {currClub.club_name} status" bind:open={statusOn} >
    <p class="text-base leading-relaxed text-gray-800 dark:text-gray-400">
        <center>
            Status: <b>{currClub.status}</b>
            <br>
            {#if currClub.status == "Pending"}
                <Button on:click={() => {
                    changeStatus(currClub.secret_password, currClub.status)
                }} outline color="green">Approve {currClub.club_name}</Button>
            {:else}
                <Button on:click={() => {
                    changeStatus(currClub.secret_password, currClub.status)
                }} outline color="red">Revoke {currClub.club_name} Approval</Button>
            {/if}
        </center>
    </p>
</Modal>
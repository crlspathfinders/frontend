<script>
    import { Button, Modal, Spinner } from 'flowbite-svelte';
    import { changeStatus } from '../../../lib/club';
    import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

    let isLoading = writable(false);
    let modalOpen = writable(false);
    let status = writable(null);

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
            closeModal();
        }
    }

    const openModal = () => modalOpen.set(true);
    const closeModal = () => modalOpen.set(false);
    
    export let statusOn = false;
    export let currClub = {};

    modalOpen.set(statusOn);

    onMount(() => {
        console.log(statusOn);
        if (statusOn) { openModal(); }
        status.set(currClub.status);
        console.log(currClub.status);
        console.log($status);
    })

</script>

<!-- {#if $modalOpen} -->

    <Modal title="Change {currClub.club_name} status" open={statusOn} on:close={closeModal}>
        <p class="text-base leading-relaxed text-gray-800">
            <center>
                <!-- Status: <b>{$status}</b> -->
                 Status: <b>{currClub.status}</b>
                <br>
                {#if currClub.status == "Pending"}
                    <Button on:click={() => { handleStatus(currClub.secret_password, currClub.status) }} outline color="green">Approve {currClub.club_name}</Button>
                {:else}
                    <Button on:click={() => {
                        handleStatus(currClub.secret_password, currClub.status)
                    }} outline color="red">Revoke {currClub.club_name} Approval</Button>
                {/if}
                {#if $isLoading}
                    Loading ... <Spinner color="purple"/>
                {/if}
                <br>
            </center>
        </p>
    </Modal>

<!-- {/if} -->
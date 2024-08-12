<script>
    import { Label, Input, Button, Modal, Textarea, Select } from 'flowbite-svelte';
    import RegisterForm from '../../registeryourclub/RegisterForm.svelte';
	import Register from '../../registeryourclub/Register.svelte';
    
    let selected = "";
    let view = "Edit";
    let showVals = true;

    export let editOn = false;
    export let currClub = {};

</script>

<Modal bind:open={editOn} class="min-w-full">
    <RegisterForm {view} {currClub} {showVals}></RegisterForm>
</Modal>
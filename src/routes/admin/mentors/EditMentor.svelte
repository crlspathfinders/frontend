<script>
	import { Label, Input, Button, Modal, Textarea, Select } from 'flowbite-svelte';
	import RegisterForm from '../../becomeamentor/RegisterForm.svelte';
	import Register from '../../becomeamentor/Register.svelte';

	let selected = '';
	let view = 'Edit';
	let showVals = true;

	export let editOn = false;
	export let currMentor = {};
</script>

<Modal bind:open={editOn} class="min-w-full">
	<RegisterForm {view} {currMentor} {showVals}></RegisterForm>
</Modal>

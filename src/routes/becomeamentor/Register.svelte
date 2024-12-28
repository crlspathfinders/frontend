<script>
	import { onMount } from 'svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import { Label, Input, Button, Select, Textarea, MultiSelect } from 'flowbite-svelte';
	import { getCollection } from '$lib/api';
	import { createClub } from '../../lib/club';
	import RegisterForm from './RegisterForm.svelte';
	import { user } from '../../stores/auth';

	let view = 'Register';

	let currEmail = '';

	onMount(() => {
		user.subscribe((value) => {
			if (value) {
				currEmail = value.email;
			} else {
				currEmail = '';
			}
		});
	});
</script>

<Section name="crudcreateform">
	<RegisterForm {view} {currEmail}></RegisterForm>
</Section>

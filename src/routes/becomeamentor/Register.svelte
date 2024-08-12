<script>
    import { onMount } from 'svelte';
    import { Section } from 'flowbite-svelte-blocks';
    import { Label, Input, Button, Select, Textarea, MultiSelect } from 'flowbite-svelte';
    import { getCollection } from "$lib/api";
    import { createClub } from "../../lib/club";
    import RegisterForm from './RegisterForm.svelte';
    
    let view = "Register";
</script>
  
<Section name="crudcreateform">
    <RegisterForm {view}></RegisterForm>
</Section>
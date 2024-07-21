<script>
    import { onMount } from 'svelte';
    import { Section } from 'flowbite-svelte-blocks';
    import { Label, Input, Button, Select, Textarea, MultiSelect } from 'flowbite-svelte';
    import { getCollection } from "$lib/api";

    const handleSubmit = () => {
      alert('Form submited.');
    };

    let selected;

    let daysoftheweek = [
      { value: 'monday', name: 'Monday' },
      { value: 'tuesday', name: 'Tuesday' },
      { value: 'wednesday', name: 'Wednesday' },
      { value: 'thursday', name: 'Thursday'},
      { value: 'friday', name: "Friday"}
    ];
    
</script>
  
<Section name="crudcreateform">
<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Register Your Club</h2>
<form on:submit={handleSubmit}>
    <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
    <div class="sm:col-span-2">
        <Label for="clubname" class="mb-2">Club Name</Label>
        <Input type="text" id="clubname" placeholder="Type club name" required/>
    </div>
    <div class="w-full">
        <!-- Have to verify, etc. -->
        <Label for="presidentemail" class="mb-2">President Email</Label> 
        <Input type="text" id="presidentemail" placeholder="President email" required/>
    </div>
    <div class="w-full">
        <Label for="vicepresidentemail1" class="mb-2">Vice President Email 1</Label>
        <Input type="text" id="vicepresidentemail1" placeholder="Vice President Email 1"/>
    </div>
    <div class="w-full">
        <Label for="vicepresidentemail2" class="mb-2">Vice President Email 2</Label>
        <Input type="text" id="vicepresidentemail2" placeholder="Vice President Email 2"/>
    </div>
    <div class="w-full">
        <Label for="vicepresidentemail3" class="mb-2">Vice President Email 3</Label>
        <Input type="text" id="vicepresidentemail3" placeholder="Vice President Email 3"/>
    </div>
    <div class="w-full">
        <Label for="advisoremail" class="mb-2">Advisor Email</Label>
        <Input type="text" id="advisoremail" placeholder="Advisor Email" required/>
    </div>
    <div class="w-full">
        <Label for="roomnumber" class="mb-2">Room Number</Label>
        <Input type="number" id="roomnumber" placeholder="Room Number" required/>
    </div>
    <div class="w-full">
        <Label>
            Days your club meets
            <MultiSelect class="mt-2" placeholder="Select day(s)" items={daysoftheweek} bind:value={selected} required />
        </Label>
    </div>
    <div class="w-full">
        <Label for="clubstarttime" class="mb-2">Club Start Time</Label>
        <Input type="time" id="clubstarttime" placeholder="12" required />
    </div>
    <div class="sm:col-span-2">
        <Label for="description" class="mb-2">Description</Label>
        <Textarea id="description" placeholder="Any additional information that club members should know before joining your club!" rows="4" name="description" required />
    </div>
    <Button color="dark" type="submit" class="w-32">Submit Club for Review</Button>
    </div>
</form>
</Section>
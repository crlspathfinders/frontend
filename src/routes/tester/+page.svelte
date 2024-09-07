<script>
    import MultiSelect from 'svelte-multiselect'
    import {Label} from "flowbite-svelte";
    import { createMentor, editMentor, races, religions, genders, languages, academics, UploadMentorImage, SetMentorImage, sendMentorPitch } from "../../lib/mentor";
    const languagesok = ["1", "2", "3", "4", "5", "6"]
</script>

<Label>
    Languages
    <MultiSelect id="languages" options={languagesok} placeholder="What languages do you know?"></MultiSelect>
</Label>

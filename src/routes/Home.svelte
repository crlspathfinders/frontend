<script lang="js">
    import { onMount } from 'svelte';
    import { Section, ContentWithImage } from 'flowbite-svelte-blocks';
    import { user } from "../stores/auth"
    import { fetchUserInfo } from "../lib/user"

    let email = "";

    onMount(async () => {
        user.subscribe(value => {
        if (value) {
            email = value.email;
        } else {
            email = '';
        }
      });
      const userInfo = await fetchUserInfo();
      if (userInfo["uid"] !== null) { console.log(userInfo["uid"]); }
    })
</script>
  
<Section name="contentwithimg">
    <ContentWithImage>
        <svelte:fragment slot="h2">{email}</svelte:fragment>
        <p class="mb-4">We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need.</p>
        <p>We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and quick.</p>

        <svelte:fragment slot="image">
        <img class="w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png" alt="office content 1" />
        <img class="mt-4 w-full lg:mt-10 rounded-lg" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png" alt="office content 2" />
        </svelte:fragment>
    </ContentWithImage>
</Section>
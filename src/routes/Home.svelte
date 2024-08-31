<script lang="js">
    import { onMount } from 'svelte';
    import { Section, ContentWithImage } from 'flowbite-svelte-blocks';
    import { News, HeroHeader, HeroBody } from 'flowbite-svelte-blocks';
    import { Button } from "flowbite-svelte";
    import { user } from "../stores/auth"
    import { fetchUserInfo } from "../lib/user"
    import { ArrowRightOutline } from 'flowbite-svelte-icons';

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

<Section name="heroVisual">
    <div class="mr-auto place-self-center lg:col-span-7">
      <HeroHeader h1Class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white" pClass="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
        <svelte:fragment slot="h1">CRLS PathFinders</svelte:fragment>
        <p>
            Bringing autonomy back to students, PathFinders seeks to provide 9th and 10th grade students with all of the resources that CRLS and Cambridge have to offer.
        </p>
        <p>
            Through one on one tutoring, class shadowing, and more, everything you need to create the best high school experience for you is here.
        </p>
        <br>
        {#if $user}
            <a href="/findaclub">
                <Button size="xl" outline color="green" class="inline-flex items-center justify-center mr-3">
                    Find a club<ArrowRightOutline size="md" class="ml-2 -mr-1" />
                </Button>
            </a>
            <a href="/findamentor">
                <Button size="xl" outline color="blue" class="inline-flex items-center justify-center mr-3">
                    Find a mentor<ArrowRightOutline size="md" class="ml-2 -mr-1" />
                </Button>
            </a>
        {:else}
            <a href="/auth/signup">
                <Button size="xl" outline color="green" class="inline-flex items-center justify-center mr-3">
                    Sign Up<ArrowRightOutline size="md" class="ml-2 -mr-1" />
                </Button>
            </a>
            <a href="/auth/login">
                <Button size="xl" outline color="blue" class="inline-flex items-center justify-center mr-3">
                    Log In<ArrowRightOutline size="md" class="ml-2 -mr-1" />
                </Button>
            </a>
        {/if}
      </HeroHeader>
    </div>
    <!-- <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
      <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png" alt="mockup" />
    </div> -->
  </Section>
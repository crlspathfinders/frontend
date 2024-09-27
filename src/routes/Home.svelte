<script lang="js">
    import { onMount } from 'svelte';
    import { Section, ContentWithImage } from 'flowbite-svelte-blocks';
    import { News, HeroHeader, HeroBody, Faq, FaqItem } from 'flowbite-svelte-blocks';
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
        // const userInfo = await fetchUserInfo();
        // if (userInfo["uid"] !== null) { console.log(userInfo["uid"]); }
    })
</script>

<!-- <Section name="heroVisual">
    <div class="mr-auto place-self-center lg:col-span-7">
      <HeroHeader h1Class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl" pClass="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">
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
  </Section> -->

  <Section name="heroDefault">
    <!-- <News>
      <span class="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">New</span>
      <span class="text-sm font-medium">Flowbite is out! See what's new</span>
    </News> -->
    <div style="margin-top:1rem;"></div>
    <HeroHeader>
      <svelte:fragment slot="h1">CRLS PathFinders</svelte:fragment>
      <svelte:fragment slot="paragraph">Bringing autonomy back to students, PathFinders seeks to provide 9th and 10th grade students with all of the resources that CRLS and Cambridge have to offer.</svelte:fragment>
    </HeroHeader>
  
    
    <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
        {#if $user}
            <a href="/findaclub">
                <Button size="xl" color="green" class="inline-flex items-center justify-center mr-3">
                    Find a club<ArrowRightOutline size="md" class="ml-2 -mr-1" />
                </Button>
            </a>
            <a href="/findamentor">
                <Button size="xl" color="blue" class="inline-flex items-center justify-center mr-3">
                    Find a mentor<ArrowRightOutline size="md" class="ml-2 -mr-1" />
                </Button>
            </a>
        {:else}
            <a href="/auth/signup">
                <Button size="xl" color="green" class="inline-flex items-center justify-center mr-3">
                    Sign Up<ArrowRightOutline size="md" class="ml-2 -mr-1" />
                </Button>
            </a>
            <a href="/auth/login">
                <Button size="xl" color="blue" class="inline-flex items-center justify-center mr-3">
                    Log In<ArrowRightOutline size="md" class="ml-2 -mr-1" />
                </Button>
            </a>
        {/if}
      <!-- <a href="/">
        <Button size="lg" color="red">
          Learn more <ArrowRightOutline size="md" class="ml-2 -mr-1" />
        </Button>
      </a>
      <a href="/">
        <Button size="lg" color="light">
          Watch video
        </Button>
      </a> -->
    </div>
    <HeroBody>
      <svelte:fragment slot="head">About us</svelte:fragment>
      <Faq>
        <div>
          <FaqItem>
            <svelte:fragment slot="h3">What does PathFinders do?</svelte:fragment>
            <p class="text-gray-600">
                Our goal with PathFinders is to create one place within CRLS where all students can access all the help and resources that they need to succeed both in school and out.
            </p>
          </FaqItem>
          <FaqItem>
            <svelte:fragment slot="h3">What can I do?</svelte:fragment>
            <p class="text-gray-600">
                Feel free to explore the website. We are still adding new features, but feel free to check out all the <u><a href="/findaclub">clubs</a></u> and <u><a href="/findamentor">mentors</a></u>.
            </p> 
          </FaqItem>
          <FaqItem>
            <svelte:fragment slot="h3">How can I get involved?</svelte:fragment>
            <p class="text-gray-600">
                If you are interested in helping us out on our project, send us an <u><a target="_blank" href="https://mail.google.com/mail/?view=cm&fs=1&to=crlspathfinders25@gmail.com&su=CRLS%20PathFinders%20Mentee">email</a></u> and we will get back to you!
            </p>
          </FaqItem>
        </div>
      </Faq>
    </HeroBody>
  </Section>
  
  <!-- <Section name="faq">
    <h2 class="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Frequently asked questions</h2>
    <Faq>
      <div>
        <FaqItem>
          <svelte:fragment slot="h3">What do you mean by "Figma assets"?</svelte:fragment>
          <p class="text-gray-500 dark:text-gray-400">You will have access to download the full Figma project including all of the pages, the components, responsive pages, and also the icons, illustrations, and images included in the screens.</p>
        </FaqItem>
        <FaqItem>
          <svelte:fragment slot="h3">What does "lifetime access" exactly mean?</svelte:fragment>
          <p class="text-gray-500 dark:text-gray-400">Once you have purchased either the design, code, or both packages, you will have access to all of the future updates based on the roadmap, free of charge.</p>
        </FaqItem>
        <FaqItem>
          <svelte:fragment slot="h3">How does support work?</svelte:fragment>
          <p class="text-gray-500 dark:text-gray-400">We're aware of the importance of well qualified support, that is why we decided that support will only be provided by the authors that actually worked on this project.</p>
          <p class="text-gray-500 dark:text-gray-400">
            Feel free to <a href="/" class="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline" target="_blank" rel="noreferrer">contact us</a> and we'll help you out as soon as we can.
          </p>
        </FaqItem>
        <FaqItem>
          <svelte:fragment slot="h3">I want to build more than one project. Is that allowed?</svelte:fragment>
          <p class="text-gray-500 dark:text-gray-400">You can use Windster for an unlimited amount of projects, whether it's a personal website, a SaaS app, or a website for a client. As long as you don't build a product that will directly compete with Windster either as a UI kit, theme, or template, it's fine.</p>
          <p class="text-gray-500 dark:text-gray-400">
            Find out more information by <a href="/" class="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline">reading the license</a>.
          </p>
        </FaqItem>
      </div>
      <div>
        <FaqItem>
          <svelte:fragment slot="h3">What does "free updates" include?</svelte:fragment>
          <p class="text-gray-500 dark:text-gray-400">
            The free updates that will be provided is based on the <a href="/" class="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline">roadmap</a> that we have laid out for this project. It is also possible that we will provide extra updates outside of the roadmap as well.
          </p>
        </FaqItem>
        <FaqItem>
          <svelte:fragment slot="h3">What does the free version include?</svelte:fragment>
          <p class="text-gray-500 dark:text-gray-400">
            The <a href="/" class="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline">free version</a> of Windster includes a minimal style guidelines, component variants, and a dashboard page with the mobile version alongside it.
          </p>
          <p class="text-gray-500 dark:text-gray-400">You can use this version for any purposes, because it is open-source under the MIT license.</p>
        </FaqItem>
        <FaqItem>
          <svelte:fragment slot="h3">What is the difference between Windster and Tailwind UI?</svelte:fragment>
          <p class="text-gray-500 dark:text-gray-400">Although both Windster and Tailwind UI are built for integration with Tailwind CSS, the main difference is in the design, the pages, the extra components and UI elements that Windster includes.</p>
          <p class="text-gray-500 dark:text-gray-400">Additionally, Windster is a project that is still in development, and later it will include both the application, marketing, and e-commerce UI interfaces.</p>
        </FaqItem>
        <FaqItem>
          <svelte:fragment slot="h3">Can I use Windster in open-source projects?</svelte:fragment>
          <p class="text-gray-500 dark:text-gray-400">Generally, it is accepted to use Windster in open-source projects, as long as it is not a UI library, a theme, a template, a page-builder that would be considered as an alternative to Windster itself.</p>
          <p class="text-gray-500 dark:text-gray-400">With that being said, feel free to use this design kit for your open-source projects.</p>
          <p class="text-gray-500 dark:text-gray-400">
            Find out more information by <a href="/" class="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline">reading the license</a>.
          </p>
        </FaqItem>
      </div>
    </Faq>
  </Section> -->
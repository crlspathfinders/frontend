<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { Section, Register } from 'flowbite-svelte-blocks';
    import { Button, Checkbox, Label, Input, Spinner } from 'flowbite-svelte';
    import { auth } from '../../../lib/auth/firebaseConfig';
    import { signInWithEmailAndPassword } from 'firebase/auth';
    import { user } from '../../../stores/auth';
    import { toggleLoggedIn } from "../../../lib/auth/login";

    let email = '';
    let password = '';
    let errorMessage = '';

    let loading = false;

    async function login() {
      try {
        loading = true;
        const res = await signInWithEmailAndPassword(auth, email, password);
        if (res) {
          toggleLoggedIn();
          goto("/")
        }
        // Redirect or handle successful login
      } catch (error) {
        errorMessage = error.message;
        console.error("Login failed", error);
        goto("/auth/login");
      }
    }

  onMount(() => {
    console.log(user);
    user.subscribe(value => {
      if (value) {
        goto('/'); // Redirect to home if already logged in
      }
    });
  });

</script>
  
  <Section name="login">
    <Register href="/">
      <svelte:fragment slot="top">
        Flowbite
      </svelte:fragment>
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <form class="flex flex-col space-y-6" action="/" on:submit={() => { login(); }}>
          <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Change Password</h3>
          <Label class="space-y-2">
            <span>Your email</span>
            <Input bind:value={email} type="email" name="email" placeholder="name@company.com" required />
          </Label>
          <Label class="space-y-2">
            <span>Your password</span>
            <Input bind:value={password} type="password" name="password" placeholder="•••••" required />
          </Label>
          <div class="flex items-start">
            <Checkbox>Remember me</Checkbox>
            <a href="/" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Forgot password?</a>
          </div>
          <Button color="green" type="submit" class="w-full1">Sign in {#if loading}<Spinner></Spinner>{/if}</Button>
          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Don’t have an account yet? <a href="/" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
          </p>
        </form>
      </div>
    </Register>
  </Section>
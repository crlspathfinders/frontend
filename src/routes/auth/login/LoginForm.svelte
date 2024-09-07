<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { Section, Register } from 'flowbite-svelte-blocks';
    import { Button, Checkbox, Label, Input, Spinner, Alert } from 'flowbite-svelte';
    import { auth } from '../../../lib/auth/firebaseConfig';
    import { signInWithEmailAndPassword } from 'firebase/auth';
    import { user } from '../../../stores/auth';
    import { toggleLoggedIn } from "../../../lib/auth/login";
    import { writable } from 'svelte/store';

    let email;
    let password;
    let errorMessage = writable("");
    let loginLoading = writable(false);
    
    async function login() {
      loginLoading.set(true);
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        if (res) {
          toggleLoggedIn();
          loginLoading.set(false);
          goto("/")
        }
      } catch (error) {
        errorMessage.set("Incorrect email or password.");
        // console.error("Login failed", error);
        loginLoading.set(false);
      }
    }

</script>
  
  <Section name="login">
    <Register>
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <form class="flex flex-col space-y-6" on:submit={() => { login(); }}>
          <h3 class="text-xl font-medium text-gray-900 p-0">Login</h3>
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
            <a href="/" class="ml-auto text-sm text-blue-700 hover:underline">Forgot password?</a>
          </div>
          <Button color="green" type="submit" class="w-full1">
            Log in
            {#if $loginLoading}
              <Spinner color="green"/>
            {/if}
          </Button>
          <p class="text-sm font-light text-gray-500">
            Don’t have an account yet? <a href="/auth/signup" class="font-medium text-primary-600 hover:underline">Sign up</a>
          </p>
        </form>
        {#if $errorMessage.length > 1}
          <Alert color="red">
            <span class="font-medium">Login failed:</span>
            {$errorMessage}
          </Alert>
        {/if}
      </div>
    </Register>
  </Section>
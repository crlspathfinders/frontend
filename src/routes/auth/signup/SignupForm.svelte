<script>
    import { onMount } from 'svelte';
    import { Section, Register } from 'flowbite-svelte-blocks';
    import { Button, Checkbox, Label, Input } from 'flowbite-svelte';
    import { auth } from '../../../lib/auth/firebaseConfig';
    import { createUserWithEmailAndPassword } from 'firebase/auth';
    import { user } from '../../../stores/auth';
    import { makeUser } from "../../../lib/auth/signup";

    let email = '';
    let password = '';
    let errorMessage = '';
  
    async function signup() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      await fetch('http://127.0.0.1:8000/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      // Now sign up the user with more info (two empty strings for leading and joined_clubs):
      const tryMakeUser = await makeUser(email, false, "Member", [], []);

      const status = await tryMakeUser.JSON();
      return status;

    } catch (error) {
      errorMessage = error.message;
      console.error("Signup failed", error);
    }
  }
  
</script>
  
<Section name="login">
    <Register href="/signup">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <form on:submit={() => {
            signup();
        }} class="flex flex-col space-y-6" action="/">
            <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Sign up</h3>
            <Label class="space-y-2">
                <span>Your email</span>
                <Input bind:value={email} type="email" name="email" id="email" placeholder="name@company.com" required/>
            </Label>
            <Label class="space-y-2">
                <span>Your password</span>
                <Input bind:value={password} type="password" name="password" id="password" placeholder="•••••" required/>
            </Label>
            <Label class="space-y-2">
                <span>Confirm password</span>
                <Input type="password" name="confirmpassword" placeholder="•••••" required/>
            </Label>
            <div class="flex items-start">
                <Checkbox>Remember me</Checkbox>
                <a href="/" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Forgot password?</a>
            </div>
            <Button color="green" type="submit" class="w-full1">Sign in</Button>
        </form>
        </div>
    </Register>
</Section>
<!--   
<h1>Sign Up</h1>
<input type="email" bind:value={email} placeholder="Email" />
<input type="password" bind:value={password} placeholder="Password" />
<button on:click={signup}>Sign Up</button>
{#if errorMessage}
<p style="color: red;">{errorMessage}</p>
{/if} -->

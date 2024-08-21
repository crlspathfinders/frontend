<script>
    import "../app.css";
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
    import { ChevronDownOutline } from 'flowbite-svelte-icons';
    import { page } from '$app/stores';
    import { user, logout } from "../stores/auth";

    $: activeUrl = $page.url.pathname;
    let activeClass = 'text-white bg-gray-700 md:bg-transparent md:text-gray-700';
    let nonActiveClass = 'text-gray-400 hover:bg-gray-500 md:hover:bg-transparent md:border-0 md:hover:text-gray-500';

</script>

<Navbar let:NavContainer color="blue">
    <NavBrand href="/">
        <span class="self-center whitespace-nowrap text-xl font-semibold text-black">CRLS PathFinders</span>
    </NavBrand>
    <NavHamburger />
    <NavUl {activeUrl} {activeClass} {nonActiveClass}>
        {#if $user }
            <NavLi href="/">Home</NavLi>   
            <NavLi href="/findaclub">Find a Club</NavLi>
            <NavLi href="/findamentor">Find a Mentor</NavLi>
            <NavLi class="cursor-pointer">
            More<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
            </NavLi>
            <Dropdown class="w-44 z-20 text-gray-500">
                <DropdownItem href="/registeryourclub">Register Your Club</DropdownItem>
                <DropdownItem href="/becomeamentor">Become a Mentor</DropdownItem>
                <DropdownItem href="/account">Account</DropdownItem>
                <DropdownItem href="/admin">Admin</DropdownItem>                
                <DropdownItem on:click={logout} href="/">Sign Out</DropdownItem>
            </Dropdown>
        {:else}
            <NavLi class="text-gray-800" href="/auth/login">Log In</NavLi>   
            <NavLi class="text-gray-800" href="/auth/signup">Sign Up</NavLi>
        {/if}
    </NavUl>
</Navbar>

<slot></slot>

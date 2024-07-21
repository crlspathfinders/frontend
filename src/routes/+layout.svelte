<script>
    import "../app.css";
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
    import { ChevronDownOutline } from 'flowbite-svelte-icons';
    import { page } from '$app/stores';
    $: activeUrl = $page.url.pathname;
</script>

<Navbar>
    <NavBrand href="/">
        <!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
        <span class="self-center whitespace-nowrap text-xl font-semibold text-black">CRLS PathFinders</span>
    </NavBrand>
    <NavHamburger />
    <NavUl {activeUrl}>
        <NavLi class="text-gray-800" href="/">Home</NavLi>   
        <NavLi class="text-gray-800" href="/findaclub">Find a Club</NavLi>
        <NavLi class="text-gray-800" href="/becomeamentor">Become a Mentor</NavLi>
        <NavLi class="cursor-pointer text-gray-800">
        Dropdown<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
        </NavLi>
        <Dropdown class="w-44 z-20">
        <DropdownItem href="/registeryourclub">Register Your Club</DropdownItem>
        <DropdownItem href="/">Settings</DropdownItem>
        <DropdownItem href="/">Earnings</DropdownItem>
        <DropdownDivider />
        <DropdownItem href="/">Sign out</DropdownItem>
        </Dropdown>
    </NavUl>
</Navbar>

<slot></slot>

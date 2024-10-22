<script>
    import "../app.css";
    import MainNav from "./MainNav.svelte";
    import { inject } from '@vercel/analytics'
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    // Adds dynamic title to each page, paired with svelte:head below
    const appName = "CRLS PathFinders"; 
    $: title = appName + " | " + [appName, ...$page.url.pathname
                                                                .split("/")
                                                                .slice(1)
                                                              ]
                                                                .filter(Boolean)
                                                                .findLast(Boolean)
                                                                .replace(/-/g, " ")
                                                                .replace(/\b\w/g, l => l.toUpperCase());
</script>

<style>
    @media (prefers-color-scheme: dark) {
      * {
        color-scheme: light;
        background-color: white;
      }
    }
/* 
    @media (prefers-color-scheme: dark) {
    .dark .bg-gray-900,
    .dark .bg-gray-800,
    .dark .bg-gray-700,
    .dark .bg-gray-600,
    .dark .text-white,
    .dark .text-gray-300 {
        background-color: var(--tw-bg-opacity) white !important;
        color: var(--tw-text-opacity) black !important;
    }
    } */
  </style>

<div class="mainlayoutwrapper" style="height:100%;">
    <MainNav></MainNav>
    
    <slot></slot>
    
</div>

<svelte:head>
    <title>{title}</title>
</svelte:head>
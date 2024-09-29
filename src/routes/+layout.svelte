<script>
    import "../app.css";
    import MainNav from "./MainNav.svelte";
    import { inject } from '@vercel/analytics'
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
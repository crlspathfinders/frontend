/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{html,js,svelte,ts}', 
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
    './components/**/*.{html,js}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"),
    require("daisyui"),
    // require("flowbite-typography")
    ],
}

module.exports = config;
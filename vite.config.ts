import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { crx, defineManifest, } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: "Counter",
  version: "1.0.0",
  permissions: [],
  action: {
    default_popup: "index.html",
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), crx({ manifest })]

})

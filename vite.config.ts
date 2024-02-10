import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { crx, defineManifest } from "@crxjs/vite-plugin";
//import { viteStaticCopy } from "vite-plugin-static-copy"; // ↓ この行を追加

const manifest = defineManifest({
  manifest_version: 3,
  name: "svelte chrome extension test",
  description: "A test simple counter extension",
  version: "1.0.0",
  action: {
    //default_popup: "src/popup/index.html",
    default_title: "Click to open panel",
  },
  options_ui: {
    page: "src/options/index.html",
  },
  side_panel: {
    default_path: "src/sidepanel/index.html",
  },
  background: {
    service_worker: "src/background/index.ts",
  },
  permissions: ["storage", "sidePanel"],
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    /*
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
          dest: ".",
        },
        {
          src: "node_modules/bootstrap/dist/css/bootstrap.min.css",
          dest: ".",
        },
      ],
    }),
    */
    svelte(),
    crx({ manifest }),
  ],
});

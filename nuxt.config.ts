// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // nitro: {
  //   preset: "vercel",
  // },
  ssr: false,
  runtimeConfig: {
    public: {
      // Only expose non-sensitive configuration to client
      HOME_URL: process.env.HOME_URL || "http://localhost:3000",
      persistedState: {
        storage: "cookies",
        debug: false,
        cookieOptions: {},
      },
    },
  },

  // Build-time environment replacement
  vite: {
    define: {
      // Replace sensitive URLs at build time
      __API_BASE_URL__: JSON.stringify(process.env.API_BASE_URL),
      __USSD_API_BASE_URL__: JSON.stringify(process.env.USSD_API_BASE_URL),
      __X_APP_ID__: JSON.stringify(process.env.X_APP_ID),
      __X_APP_VERSION__: JSON.stringify(process.env.X_APP_VERSION),
    },
  },

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  app: {
    head: {
      title: "CBE Admin Console",
      link: [],
    },
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia-plugin-persistedstate/nuxt",
    // "@nuxtjs/color-mode",
    "@davestewart/nuxt-scrollbar",
    "nuxt-icon",
    "@pinia/nuxt",
    "@nuxt/image",
    // "@babel/plugin-syntax-dynamic-import",
  ],

  // presets: [
  //  '@nuxt/babel-preset-app',
  // ],
  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },

  // colorMode: {
  //   classSuffix: "",
  // },
  hooks: {
    "components:dirs": (dirs) => {
      dirs.unshift({
        path: "~/components/ui",
        // this is required else Nuxt will autoImport `.ts` file
        extensions: [".vue"],
        // prefix for your components, eg: UiButton
        prefix: "Ui",
        // prevent adding another prefix component by it's path.
        pathPrefix: false,
      });
    },
  },

  imports: {
    dirs: [
      // Scan top-level modules
      "composables",
      // ... or scan modules nested one level deep with a specific name and file extension
      "composables/*/index.{ts,js,mjs,mts}",
      // ... or scan all modules within given directory
      "composables/**",
    ],
  },

  router: {
    middleware: ["protected"],
  },

  experimental: {
    modern: true,
  },

  plugins: ["~/plugins/fontawesome.ts", "~/plugins/session-sync.client.ts"],
  build: {
    transpile: ["@fortawesome/vue-fontawesome", "lodash-es"],
  },

  compatibilityDate: "2024-12-16",
});

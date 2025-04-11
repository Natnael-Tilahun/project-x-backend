// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // nitro: {
  //   preset: "vercel",
  // },
  ssr: false,
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
      USSD_API_BASE_URL: process.env.USSD_API_BASE_URL,
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
      title: "Project X Backend",
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

  plugins: ["~/plugins/fontawesome.ts"],
  build: {
    transpile: ["@fortawesome/vue-fontawesome", "lodash-es"],
  },

  compatibilityDate: "2024-12-16",
});

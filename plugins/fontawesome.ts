// plugins/fontawesome.ts
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

config.autoAddCss = false;

export default defineNuxtPlugin((nuxtApp) => {
  library.add(fas);
});

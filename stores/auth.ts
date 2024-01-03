import { defineStore } from "pinia";

export const useAuthStore = defineStore("counter", () => {
  const userName = ref("Natnael Tilahun");
  const email = ref("test@cbe.com.et");
  const isLoggedIn = ref(true);
  const userRole = ref("");
  //   const doubleCount = computed(() => count.value * 2);
  //   function increment() {
  //     count.value++;
  //   }

  return { userName, isLoggedIn, email, userRole };
});

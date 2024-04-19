import { defineStore } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export const useAuthStore = defineStore("auth", {
  state() {
    return {
      username: "",
      email: "",
      isAuthenticated: false,
      userRole: "",
      accessToken: "",
      refreshToken: "",
      refreshTokenExpiresIn: "",
    };
  },

  actions: {
    setAuth(auth: any) {
      this.isAuthenticated = auth?.isAuthenticated;
      this.email = auth?.email;
      this.username = auth?.username;
      this.userRole = auth?.role;
      this.accessToken = auth?.accessToken;
      this.refreshToken = auth?.refreshToken;
      this.refreshTokenExpiresIn = auth?.refreshTokenExpiresIn;
    },

    $reset() {
      this.refreshToken = "";
      this.isAuthenticated = false;
      (this.username = ""),
        (this.email = ""),
        (this.userRole = ""),
        (this.accessToken = ""),
        (this.refreshTokenExpiresIn = "");
    },
  },
  persist: {
    storage: persistedState.cookies,
  },
  // persist: {
  //   storage: persistedState.localStorage,
  // },
});

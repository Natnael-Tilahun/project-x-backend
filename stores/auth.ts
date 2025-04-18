import { defineStore } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

interface AuthState {
  username: string;
  email: string;
  isAuthenticated: boolean;
  userRole: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresIn: string;
  permissions: string[];
  roles: string[];
}

interface AuthPayload {
  isAuthenticated: boolean;
  email: string;
  username: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresIn: string;
  permissions: string[];
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    username: "",
    email: "",
    isAuthenticated: false,
    userRole: "",
    accessToken: "",
    refreshToken: "",
    refreshTokenExpiresIn: "",
    permissions: [],
    roles: []
  }),

  actions: {
    setAuth(auth: Partial<AuthPayload>) {
      this.isAuthenticated = auth?.isAuthenticated ?? false;
      this.email = auth?.email ?? "";
      this.username = auth?.username ?? "";
      this.userRole = auth?.role ?? "";
      this.accessToken = auth?.accessToken ?? "";
      this.refreshToken = auth?.refreshToken ?? "";
      this.refreshTokenExpiresIn = auth?.refreshTokenExpiresIn ?? "";
    },

    setPermissions(auth: { permissions: string[] }) {
      this.permissions = auth?.permissions ?? [];
    },

    setRoles(auth: { roles: string[] }) {
      this.roles = auth?.roles ?? [];
    },

    $reset() {
      this.isAuthenticated = false;
      this.username = "";
      this.email = "";
      this.userRole = "";
      this.accessToken = "";
      this.refreshToken = "";
      this.refreshTokenExpiresIn = "";
      this.permissions = [];
    },
  },
  getters: {
    hasPermissions: (state) => {
      return (permission: string) => state.permissions.includes(permission);
    },

    hasRole: (state) => {
      return (role: string) => state.roles.includes(role);
    }
  },
  // persist: {
  //   storage: persistedState.cookies,
  // },
  persist: {
    storage: sessionStorage,
    paths: ['isAuthenticated', 'accessToken', 'refreshToken', 'refreshTokenExpiresIn']
  },
});

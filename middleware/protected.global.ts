import { isTokenExpired } from "~/utils/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const api = useApi();

  const publicRoutes = ["/login", "/invalid-2fa", "/forgotPassword", "/activateNewUser"];
  if (publicRoutes.includes(to.path)) {
    return;
  }

  if (!authStore.isAuthenticated || !authStore.accessToken) {
    authStore.$reset();
    return navigateTo("/login", { replace: true });
  }

  if (isTokenExpired(authStore.accessToken)) {
    if (authStore.refreshToken) {
      try {
        const { data, error } = await api.fetch(
          "/api/v1/internal/refresh-token",
          {
            method: "POST",
            body: {
              refreshToken: authStore.refreshToken,
            },
            includeAuth: false, // No need to send expired access token
          }
        );

        if (error.value || !data.value) {
          throw new Error("Error refreshing token");
        }

        authStore.$patch({
          refreshToken: data.value.refreshToken,
          accessToken: data.value.accessToken,
          refreshTokenExpiresIn: data.value.refreshTokenExpiresIn,
        });
      } catch (error) {
        console.error("Token refresh failed:", error);
        authStore.$reset();
        return navigateTo("/login");
      }
    } else {
      authStore.$reset();
      return navigateTo("/login");
    }
  }
});
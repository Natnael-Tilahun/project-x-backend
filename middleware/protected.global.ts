import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const { getRefreshToken } = await useAuth();
  const runtimeConfig = useRuntimeConfig();

  // Allow access to login page
  if (to.path === "/login" || to.path === "/a" || to.path === "/forgotPassword" || to.path === "/activateNewUser") {
    return;
  }

  // If not authenticated or no access token, redirect to login
  if (!authStore.isAuthenticated || !authStore.accessToken) {
    console.log("No auth or token, redirecting to login");
    authStore.$reset();
    return navigateTo('/login', { replace: true });
  }

  // Check if access token is expired
  try {
    const isExpired = isTokenExpired(authStore.accessToken);
    console.log("Token expired status:", isExpired);

    if (isExpired && authStore.refreshToken) {
      try {
        const { data, error, status } = await useFetch(
          `${runtimeConfig.public.API_BASE_URL}/api/v1/auth/refresh-token`,
          {
            method: "POST",
            body: {
              refreshToken: authStore.refreshToken,
            },
          }
        );

        if (status.value === "error" || !data.value) {
          throw new Error("Error refreshing token");
        }

        // Update tokens in store
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
    } else if (isExpired) {
      // No refresh token available
      authStore.$reset();
      return navigateTo("/login");
    }
  } catch (error) {
    console.error("Token validation error:", error);
    authStore.$reset();
    return navigateTo("/login");
  }

  // Function to check if the token is expired
  function isTokenExpired(token: string) {
    if (!token) return true;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  }
});

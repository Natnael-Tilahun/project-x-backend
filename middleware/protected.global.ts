import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const { getRefreshToken, isLoading } = await useAuth();
  const runtimeConfig = useRuntimeConfig();

  if (!authStore.isAuthenticated && to.path !== "/login") {
    return navigateTo("/login");
  }

  // If the access token is expired and there's a refresh token available
  if (
    authStore.isAuthenticated &&
    authStore.accessToken &&
    isTokenExpired(authStore.accessToken) &&
    authStore.refreshToken &&
    to.path !== "/login"
  ) {
    try {
      // Send a request to your refresh token endpoint
      const { data, pending, error, status } = await useFetch(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/auth/refresh-token`,
        {
          method: "POST",
          body: {
            refreshToken: authStore.refreshToken,
          },
        }
      );

      if (status.value === "error") {
        throw new Error("Error refreshing token: " + error.value);
      }

      // Update the access token in the store with the new token from the response

      authStore.$patch({
        refreshToken: data.value.refreshToken,
        accessToken: data.value.accessToken,
        refreshTokenExpiresIn: data.value.refreshTokenExpiresIn,
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      // Handle token refresh failure, e.g., redirect to login page
      return "/login";
    }
  }

  // Function to check if the token is expired
  function isTokenExpired(token) {
    // Decode the JWT token
    const decodedToken = jwtDecode(token);
    // Check if the expiration time (exp) is in the past
    return decodedToken.exp * 1000 < Date.now();
  }
});

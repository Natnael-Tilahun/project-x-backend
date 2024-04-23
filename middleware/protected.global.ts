import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const { getRefreshToken, isLoading } = await useAuth();
  const runtimeConfig = useRuntimeConfig();

  if (authStore?.accessToken) {
    const decodedToken = jwtDecode(authStore?.accessToken);
    console.log("token: ", decodedToken.exp * 1000 < Date.now());
  }

  if (!authStore.isAuthenticated && to.path !== "/login") {
    return navigateTo("/login");
  }

  // If the access token is expired and there's a refresh token available
  if (
    authStore.isAuthenticated &&
    isTokenExpired(authStore.accessToken) &&
    authStore.refreshToken &&
    to.path !== "/login"
  ) {
    try {
      // const response = await getRefreshToken();
      //   // authStore.setAccessToken(response.data.accessToken);
      const { data, pending, error, status } = await useFetch(
        `${runtimeConfig.public.API_BASE_URL}/v1/api/auth/refresh-token`,
        {
          method: "POST",
          body: {
            refreshToken: authStore.refreshToken,
          },
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        }
      );

      if (status.value === "error") {
        throw new Error("Error refreshing token: " + error.value);
      }
      console.log("Refresh token data: ", response);
    } catch (error) {
      console.error("Error refreshing token:", error);
      // return navigateTo("/login");
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

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useAuthStore();

  if (!user.isAuthenticated && to.path !== "/login") {
    return navigateTo("/login");
  }
});

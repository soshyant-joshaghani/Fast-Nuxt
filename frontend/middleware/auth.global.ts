export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, isLoading, ensureHydrated } = useAuth();
  await ensureHydrated();

  const isDashboardRoute =
    to.path === '/' ||
    to.path.startsWith('/admin') ||
    to.path.startsWith('/sample');

  if (isDashboardRoute && !isLoading.value && !isAuthenticated.value) {
    return navigateTo('/login');
  }

  if (to.path === '/login' && isAuthenticated.value) {
    return navigateTo('/');
  }
});

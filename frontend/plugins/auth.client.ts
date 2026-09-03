export default defineNuxtPlugin(async () => {
  const { ensureHydrated } = useAuth();
  await ensureHydrated();
});

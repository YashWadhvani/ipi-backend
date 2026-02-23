export default defineNuxtRouteMiddleware((to) => {
    if (!to.path.startsWith('/member')) return;
    if (import.meta.server) return;
  
    const auth = useAuthStore();
    if (!auth.accessToken && typeof auth.loadFromStorage === 'function') auth.loadFromStorage();
  
    const role = auth.user?.role;
    if (!role || role !== 'MEMBER') {
      return navigateTo('/login');
    }
  });
  
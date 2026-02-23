import { useAuthStore } from '@/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  // Skip SSR to avoid redirecting before the client hydrates
  if (import.meta.server) return;

  const auth = useAuthStore();
  if (!auth.accessToken && typeof auth.loadFromStorage === 'function') {
    auth.loadFromStorage();
  }

  const publicRoutes = ['/login', '/_error'];
  if (publicRoutes.includes(to.path)) return;

  if (!auth.accessToken) return navigateTo('/login');
});
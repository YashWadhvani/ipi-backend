import { useAuthStore } from '@/stores/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) return;

  // Skip SSR – check on client after hydration
  if (import.meta.server) return;

  const auth = useAuthStore();
  if (!auth.accessToken && typeof auth.loadFromStorage === 'function') {
    auth.loadFromStorage();
  }

  // Best effort: fetch current user if missing (so role is available)
  if (!auth.user) {
    try {
      const { getCurrentUser } = await import('@/services/authServices');
      const me = await getCurrentUser();
      if (me) auth.setUser(me);
    } catch (_) {
      // ignore – fall through to role check
    }
  }

  const role = auth.user?.role; // 'ADMIN' | 'STAFF' | 'MEMBER'
  if (!role || !['ADMIN', 'STAFF'].includes(role)) {
    return navigateTo('/login');
  }
});

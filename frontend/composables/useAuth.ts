import { fetchCurrentUser } from '~/lib/modules/global/utils/auth-api';

export type AuthUser = {
  id?: string;
  email: string;
  full_name?: string | null;
  is_active?: boolean;
  is_superuser?: boolean;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const STORAGE_TOKEN = 'authToken';
const STORAGE_USER = 'currentUser';

const state = reactive<AuthState>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
});

function clearStoredAuth() {
  if (!import.meta.client) return;
  localStorage.removeItem(STORAGE_TOKEN);
  localStorage.removeItem(STORAGE_USER);
}

function readStoredCredentials(): { token: string; user: AuthUser } | null {
  if (!import.meta.client) return null;

  const token = localStorage.getItem(STORAGE_TOKEN);
  const raw = localStorage.getItem(STORAGE_USER);

  if (!token || !raw) return null;

  try {
    return { token, user: JSON.parse(raw) as AuthUser };
  } catch {
    clearStoredAuth();
    return null;
  }
}

let hydratePromise: Promise<void> | null = null;

async function hydrateAuth() {
  const stored = readStoredCredentials();
  if (!stored) {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;
    state.isLoading = false;
    return;
  }

  try {
    const user = await fetchCurrentUser(stored.token);
    if (import.meta.client) {
      localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    }
    state.user = user;
    state.token = stored.token;
    state.isAuthenticated = true;
    state.isLoading = false;
  } catch {
    clearStoredAuth();
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;
    state.isLoading = false;
  }
}

export function useAuth() {
  function login(token: string, user: AuthUser) {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_TOKEN, token);
      localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    }
    state.user = user;
    state.token = token;
    state.isAuthenticated = true;
    state.isLoading = false;
  }

  function logout() {
    clearStoredAuth();
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;
    state.isLoading = false;
  }

  function getToken() {
    return state.token;
  }

  async function ensureHydrated() {
    if (!hydratePromise) {
      hydratePromise = hydrateAuth();
    }
    await hydratePromise;
  }

  return {
    ...toRefs(state),
    login,
    logout,
    getToken,
    ensureHydrated,
  };
}

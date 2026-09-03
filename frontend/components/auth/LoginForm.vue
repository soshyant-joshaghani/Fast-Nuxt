<script setup lang="ts">
import { fetchCurrentUser, loginWithPassword, signupWithPrivateRoute } from '~/lib/modules/global/utils/auth-api';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

const props = withDefaults(defineProps<{ redirectTo?: string }>(), {
  redirectTo: '/',
});

type Tab = 'login' | 'signup';

const { login } = useAuth();

const tab = ref<Tab>('login');
const email = ref('');
const password = ref('');
const fullName = ref('');
const error = ref('');
const isLoading = ref(false);

function switchTab(next: Tab) {
  tab.value = next;
  error.value = '';
  email.value = '';
  password.value = '';
  fullName.value = '';
}

async function afterAuth(token: string) {
  const user = await fetchCurrentUser(token);
  login(token, user);
  await navigateTo(props.redirectTo);
}

async function handleLogin() {
  error.value = '';
  isLoading.value = true;
  try {
    const token = await loginWithPassword(email.value, password.value);
    await afterAuth(token);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to connect to server. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

async function handleSignup() {
  error.value = '';
  if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    error.value = 'Invalid email format';
    return;
  }
  if (!password.value || password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long';
    return;
  }
  isLoading.value = true;
  try {
    await signupWithPrivateRoute(email.value, password.value, fullName.value);
    const token = await loginWithPassword(email.value, password.value);
    await afterAuth(token);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to connect to server. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="w-full space-y-6">
    <div class="text-center">
      <h2 class="text-2xl font-bold tracking-tight text-slate-100">Welcome back</h2>
      <p class="mt-2 font-mono text-xs text-slate-500">POST /api/v1/private/users/ · dev signup</p>
    </div>

    <div class="flex border-b border-slate-800">
      <button
        type="button"
        :class="
          cn(
            'flex-1 py-3 text-sm font-medium transition',
            tab === 'login'
              ? 'border-b-2 border-sky-400/70 bg-sky-900/30 text-slate-100'
              : 'text-slate-500 hover:text-slate-300',
          )
        "
        @click="switchTab('login')"
      >
        Login
      </button>
      <button
        type="button"
        :class="
          cn(
            'flex-1 py-3 text-sm font-medium transition',
            tab === 'signup'
              ? 'border-b-2 border-emerald-400/70 bg-emerald-900/30 text-slate-100'
              : 'text-slate-500 hover:text-slate-300',
          )
        "
        @click="switchTab('signup')"
      >
        Sign up
      </button>
    </div>

    <div class="space-y-4">
      <form v-if="tab === 'login'" class="space-y-4" @submit.prevent="handleLogin">
        <Input v-model="email" type="email" placeholder="Email" :disabled="isLoading" required />
        <Input
          v-model="password"
          type="password"
          placeholder="Password"
          :disabled="isLoading"
          required
        />
        <Button type="submit" class="w-full" :disabled="isLoading">
          {{ isLoading ? 'Logging in…' : 'Login' }}
        </Button>
      </form>

      <form v-else class="space-y-4" @submit.prevent="handleSignup">
        <Input v-model="email" type="email" placeholder="Email" :disabled="isLoading" required />
        <Input
          v-model="fullName"
          type="text"
          placeholder="Full name (optional)"
          :disabled="isLoading"
        />
        <Input
          v-model="password"
          type="password"
          placeholder="Password (min. 8 characters)"
          :disabled="isLoading"
          required
        />
        <Button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-400" :disabled="isLoading">
          {{ isLoading ? 'Creating account…' : 'Create account' }}
        </Button>
      </form>
    </div>

    <div
      v-if="error"
      class="rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-3 text-center text-sm text-red-400"
    >
      {{ error }}
    </div>
  </div>
</template>

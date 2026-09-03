<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue';
import { APP_NAME } from '~/lib/modules/global';

definePageMeta({
  layout: false,
});

const { isAuthenticated, isLoading } = useAuth();
</script>

<template>
  <div
    v-if="isLoading || isAuthenticated"
    class="flex min-h-screen items-center justify-center text-muted-foreground"
  >
    Loading…
  </div>
  <div v-else class="flex min-h-screen flex-col items-center justify-center bg-background p-6">
    <div class="mb-8 text-center">
      <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Welcome to</p>
      <h1 class="text-3xl font-bold">{{ APP_NAME }}</h1>
    </div>
    <div class="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
      <LoginForm redirect-to="/" />
    </div>
  </div>
</template>

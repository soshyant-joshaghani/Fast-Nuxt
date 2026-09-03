<script setup lang="ts">
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
import AppSidebar from '~/components/layout/AppSidebar.vue';
import Header from '~/components/layout/Header.vue';

const { isAuthenticated, isLoading } = useAuth();
</script>

<template>
  <div v-if="isLoading" class="flex min-h-screen items-center justify-center text-muted-foreground">
    Restoring session…
  </div>
  <SidebarProvider v-else-if="isAuthenticated">
    <AppSidebar />
    <SidebarInset>
      <Header />
      <main class="flex-1 p-6">
        <NuxtPage />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

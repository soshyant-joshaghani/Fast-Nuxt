<script setup lang="ts">
import { SidebarInset, SidebarProvider } from '~/lib/modules/base/ui/sidebar';
import AppSidebar from '~/lib/modules/base/AppSidebar.vue';
import Header from '~/lib/modules/base/Header.vue';

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

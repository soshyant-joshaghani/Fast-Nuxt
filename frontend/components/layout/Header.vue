<script setup lang="ts">
import { SidebarTrigger } from '~/components/ui/sidebar';
import { Separator } from '~/components/ui/separator';
import ThemeToggle from '~/components/layout/ThemeToggle.vue';
import UserNav from '~/components/layout/UserNav.vue';
</script>

<template>
  <header class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
    <SidebarTrigger class="-ml-1" />
    <Separator orientation="vertical" class="mr-2 h-4" />
    <div class="flex flex-1 items-center justify-end gap-2">
      <ThemeToggle />
      <UserNav />
    </div>
  </header>
</template>

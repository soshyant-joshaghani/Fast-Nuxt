<script setup lang="ts">
import { SidebarTrigger } from '~/lib/modules/base/ui/sidebar';
import { Separator } from '~/lib/modules/base/ui/separator';
import ThemeToggle from '~/lib/modules/base/ThemeToggle.vue';
import UserNav from '~/lib/modules/base/UserNav.vue';
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

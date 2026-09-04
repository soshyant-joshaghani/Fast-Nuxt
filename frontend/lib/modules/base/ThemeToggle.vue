<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next';
import { Button } from '~/lib/modules/base/ui/button';

const isDark = ref(true);

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark');
});

function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
}
</script>

<template>
  <Button variant="ghost" size="icon" aria-label="Toggle theme" @click="toggleTheme">
    <Sun class="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <Moon class="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
  </Button>
</template>

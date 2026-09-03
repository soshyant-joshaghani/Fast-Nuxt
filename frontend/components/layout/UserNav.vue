<script setup lang="ts">
import { LogOut } from 'lucide-vue-next';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';

const { user, logout } = useAuth();

const initials = computed(() => user.value?.email.slice(0, 2).toUpperCase() ?? '');

function handleLogout() {
  logout();
  navigateTo('/login');
}
</script>

<template>
  <div v-if="user" class="flex items-center gap-3">
    <div class="hidden items-center gap-2 sm:flex">
      <Avatar class="h-8 w-8">
        <AvatarFallback>{{ initials }}</AvatarFallback>
      </Avatar>
      <div class="text-right text-sm leading-tight">
        <p class="font-medium">{{ user.email }}</p>
        <p class="text-xs text-muted-foreground">
          {{ user.is_superuser ? 'SuperAdmin' : 'User' }}
        </p>
      </div>
    </div>
    <Button variant="outline" size="sm" @click="handleLogout">
      <LogOut class="h-4 w-4" />
      Log out
    </Button>
  </div>
</template>

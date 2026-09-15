<script setup lang="ts">
import { Briefcase, Home, Users } from 'lucide-vue-next';
import { APP_NAME } from '~/lib/modules/base';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/lib/modules/base/ui/sidebar';

const route = useRoute();
const { user } = useAuth();

const baseItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Sample Notes', url: '/sample/notes', icon: Briefcase },
];

const items = computed(() =>
  user.value?.is_superuser
    ? [...baseItems, { title: 'Admin', url: '/admin', icon: Users }]
    : baseItems,
);
</script>

<template>
  <Sidebar>
    <SidebarHeader class="border-b border-sidebar-border p-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dashboard</p>
      <p class="text-lg font-bold">{{ APP_NAME }}</p>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.url">
              <SidebarMenuButton as-child :is-active="route.path === item.url">
                <NuxtLink :to="item.url">
                  <component :is="item.icon" class="h-4 w-4" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter class="border-t border-sidebar-border p-4 text-xs text-muted-foreground">
      Fast-Nuxt From FoxG
    </SidebarFooter>
  </Sidebar>
</template>

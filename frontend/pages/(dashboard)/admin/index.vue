<script setup lang="ts">
import { ApiError } from '~/lib/modules/global/utils/api-error';
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
  type ManagedUser,
} from '~/lib/modules/base/users-api';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';

const { user, token, isLoading, logout } = useAuth();

const users = ref<ManagedUser[]>([]);
const selectedId = ref<string | null>(null);
const email = ref('');
const fullName = ref('');
const password = ref('');
const isActive = ref(false);
const isSuperuser = ref(false);
const status = ref('');
const loading = ref(false);
const saving = ref(false);

function handleUnauthorized() {
  logout();
  navigateTo('/login');
}

async function refresh() {
  if (!token.value) return;
  loading.value = true;
  status.value = '';
  try {
    const data = await listUsers(token.value);
    users.value = data;
    status.value = `${data.length} user(s)`;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      handleUnauthorized();
      return;
    }
    users.value = [];
    status.value = e instanceof Error ? e.message : 'Failed to load users';
  } finally {
    loading.value = false;
  }
}

watch(
  user,
  (u) => {
    if (u && !u.is_superuser) navigateTo('/');
  },
  { immediate: true },
);

watch(
  [isLoading, token, user],
  () => {
    if (!isLoading.value && token.value && user.value?.is_superuser) void refresh();
  },
  { immediate: true },
);

function clearForm() {
  selectedId.value = null;
  email.value = '';
  fullName.value = '';
  password.value = '';
  isActive.value = false;
  isSuperuser.value = false;
  status.value = 'New user';
}

function selectUser(managedUser: ManagedUser) {
  selectedId.value = managedUser.id;
  email.value = managedUser.email;
  fullName.value = managedUser.full_name ?? '';
  password.value = '';
  isActive.value = managedUser.is_active;
  isSuperuser.value = managedUser.is_superuser;
  status.value = `Editing: ${managedUser.email}`;
}

async function handleSave() {
  if (!token.value) return;
  const trimmedEmail = email.value.trim();
  if (!trimmedEmail) {
    status.value = 'Email is required';
    return;
  }
  saving.value = true;
  status.value = '';
  try {
    if (selectedId.value) {
      await updateUser(token.value, selectedId.value, {
        email: trimmedEmail,
        full_name: fullName.value.trim() || null,
        password: password.value || undefined,
        is_active: isActive.value,
        is_superuser: isSuperuser.value,
      });
      status.value = 'User updated';
    } else {
      if (password.value.length < 8) {
        status.value = 'Password must be at least 8 characters';
        saving.value = false;
        return;
      }
      await createUser(token.value, {
        email: trimmedEmail,
        password: password.value,
        full_name: fullName.value.trim() || null,
        is_active: isActive.value,
        is_superuser: isSuperuser.value,
      });
      status.value = 'User created';
    }
    clearForm();
    await refresh();
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      handleUnauthorized();
      return;
    }
    status.value = e instanceof Error ? e.message : 'Save failed';
  } finally {
    saving.value = false;
  }
}

async function handleDelete() {
  if (!token.value || !selectedId.value) return;
  if (user.value?.id === selectedId.value) {
    status.value = 'Cannot delete your own account here';
    return;
  }
  saving.value = true;
  status.value = '';
  try {
    await deleteUser(token.value, selectedId.value);
    status.value = 'User deleted';
    clearForm();
    await refresh();
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      handleUnauthorized();
      return;
    }
    status.value = e instanceof Error ? e.message : 'Delete failed';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div v-if="user?.is_superuser" class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Users</h1>
        <p class="text-muted-foreground">Manage user accounts and permissions</p>
      </div>
      <Button type="button" variant="secondary" @click="clearForm">Add user</Button>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
          <CardDescription>{{ loading ? 'Loading…' : status }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-2">
          <p v-if="!loading && users.length === 0" class="text-sm text-muted-foreground">No users yet</p>
          <Button
            v-for="managedUser in users"
            :key="managedUser.id"
            type="button"
            :variant="managedUser.id === selectedId ? 'default' : 'outline'"
            class="h-auto w-full justify-start py-2 text-left"
            @click="selectUser(managedUser)"
          >
            <span class="truncate">
              {{ managedUser.email }}{{ managedUser.is_superuser ? ' (superuser)' : '' }}
            </span>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{{ selectedId ? 'Edit user' : 'New user' }}</CardTitle>
          <CardDescription>
            {{ selectedId ? 'Update account details' : 'Create a new account' }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="handleSave">
            <div class="space-y-2">
              <Label for="admin-email">Email</Label>
              <Input id="admin-email" v-model="email" type="email" required />
            </div>
            <div class="space-y-2">
              <Label for="admin-full-name">Full name</Label>
              <Input id="admin-full-name" v-model="fullName" />
            </div>
            <div class="space-y-2">
              <Label for="admin-password">
                Password {{ selectedId ? '(leave blank to keep)' : '(required)' }}
              </Label>
              <Input id="admin-password" v-model="password" type="password" autocomplete="new-password" />
            </div>
            <div class="flex items-center justify-between gap-4">
              <Label for="admin-active">Is active</Label>
              <Switch id="admin-active" v-model:checked="isActive" />
            </div>
            <div class="flex items-center justify-between gap-4">
              <Label for="admin-superuser">Is superuser</Label>
              <Switch id="admin-superuser" v-model:checked="isSuperuser" />
            </div>
            <div class="flex flex-wrap gap-2 pt-2">
              <Button type="submit" :disabled="saving">{{ saving ? 'Saving…' : 'Save' }}</Button>
              <Button
                type="button"
                variant="destructive"
                :disabled="saving || !selectedId"
                @click="handleDelete"
              >
                Delete
              </Button>
            </div>
            <p v-if="status" :class="cn('text-sm', status.includes('failed') && 'text-destructive')">
              {{ status }}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

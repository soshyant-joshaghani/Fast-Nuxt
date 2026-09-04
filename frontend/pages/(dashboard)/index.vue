<script setup lang="ts">
import { toSameOriginApiUrl } from '~/lib/config/api-url';
import { apiBaseUrl } from '~/lib/config/backend';
import { fetchCurrentUser } from '~/lib/modules/base/utils/auth-api';
import { Badge } from '~/lib/modules/base/ui/badge';
import { Button } from '~/lib/modules/base/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/lib/modules/base/ui/card';

const { getToken } = useAuth();

const health = ref<boolean | null>(null);
const sample = ref('…');
const apiError = ref<string | null>(null);
const meCheck = ref('not tested');
const meLoading = ref(false);

onMounted(async () => {
  try {
    const healthRes = await fetch(toSameOriginApiUrl(`${apiBaseUrl()}/utils/health-check`));
    health.value = healthRes.ok ? await healthRes.json() : false;

    const sampleRes = await fetch(toSameOriginApiUrl(`${apiBaseUrl()}/sample`));
    if (sampleRes.ok) {
      const body = (await sampleRes.json()) as { message?: string };
      sample.value = body.message ?? 'ok';
    } else {
      sample.value = `HTTP ${sampleRes.status}`;
    }
  } catch (e) {
    apiError.value = e instanceof Error ? e.message : 'Request failed';
  }
});

async function testAuthenticatedMe() {
  const token = getToken();
  if (!token) {
    meCheck.value = 'no token in store';
    return;
  }
  meLoading.value = true;
  try {
    const user = await fetchCurrentUser(token);
    meCheck.value = `${user.email}${user.is_superuser ? ' (superuser)' : ''}`;
  } catch (e) {
    meCheck.value = e instanceof Error ? e.message : 'request failed';
  } finally {
    meLoading.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p class="text-muted-foreground">
        API health checks and session verification. Default superuser:
        <code class="rounded bg-muted px-1.5 py-0.5 text-sm">admin@example.com</code>
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Authenticated /me</CardTitle>
          <CardDescription>Test GET /base/login/me with stored JWT</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <Button :disabled="meLoading" @click="testAuthenticatedMe">
            {{ meLoading ? 'Calling /me…' : 'Test GET /base/login/me' }}
          </Button>
          <p class="font-mono text-sm text-muted-foreground">{{ meCheck }}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health check</CardTitle>
          <CardDescription>GET /api/v1/utils/health-check/</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2">
            <Badge :variant="apiError ? 'destructive' : health ? 'default' : 'secondary'">
              {{ apiError ? 'ERR' : health === null ? '…' : health ? '200' : '503' }}
            </Badge>
            <span class="font-mono text-sm">
              {{ apiError ?? (health === null ? 'checking…' : String(health)) }}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample module</CardTitle>
          <CardDescription>GET /api/v1/sample/</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="font-mono text-sm">{{ sample }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

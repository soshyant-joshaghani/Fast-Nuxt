<script setup lang="ts">
import { moduleUrl } from '~/lib/modules/apps/myfeature/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/lib/modules/base/ui/card';
</script>

<template>
  <Card>
    <CardHeader>
      <CardDescription class="uppercase tracking-[0.2em]">Myfeature</CardDescription>
      <CardTitle>Myfeature</CardTitle>
    </CardHeader>
    <CardContent>
      <p class="text-muted-foreground">
        Implement UI in
        <code class="text-foreground">lib/modules/apps/myfeature/</code>.
        API base: <code class="text-foreground">{ moduleUrl() }</code>
      </p>
    </CardContent>
  </Card>
</template>

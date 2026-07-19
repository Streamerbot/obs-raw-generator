<script setup lang="ts">
const open = ref(false);
</script>

<template>
  <USlideover
    v-model:open="open"
    title="OBS WebSocket Settings"
    :ui="{ title: 'font-logo tracking-tight' }"
  >
    <UButton
      color="neutral"
      variant="subtle"
      trailing-icon="mdi:cog"
      class="cursor-pointer"
      slot="trigger"
    >
      OBS WebSocket Settings
    </UButton>

    <template #body>
      <ObsWebsocketConnectionForm @submit="open = false" />
    </template>
  </USlideover>
</template>

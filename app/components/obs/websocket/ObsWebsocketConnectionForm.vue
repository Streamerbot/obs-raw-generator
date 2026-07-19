<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod';

const emit = defineEmits<{
  (e: 'submit', event: FormSubmitEvent<Schema>): void;
}>();

const { host, port, password, connect } = useObsWebsocket();

const schema = z.object({
  host: z.ipv4().default('127.0.0.1'),
  port: z.number().int().min(1024).max(49151).default(4455),
  password: z.string().optional().default(''),
});
type Schema = z.infer<typeof schema>;

const state = reactive<Schema>({
  host: host.value || '127.0.0.1',
  port: port.value || 4455,
  password: password.value || '',
});

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  host.value = event.data.host;
  port.value = event.data.port;
  password.value = event.data.password;

  connect();

  emit('submit', event);
};
</script>

<template>
  <UForm
    :schema
    :state
    class="flex flex-col gap-4 divide-y divide-muted/50 *:pb-4"
    @submit="onSubmit"
  >
    <UFormField
      name="host"
      label="Host"
      description="Enter the host of the OBS WebSocket server"
      help="Leave as 127.0.0.1 unless you know what you are doing"
      required
    >
      <UInput
        v-model="state.host"
        type="text"
        placeholder="Enter the host"
        class="w-full font-mono"
        autocomplete="off"
      />
    </UFormField>

    <UFormField
      name="port"
      label="Port"
      description="Enter the port of the OBS WebSocket server"
      help="Default is 4455"
      required
    >
      <UInput
        v-model="state.port"
        type="number"
        min="1024"
        max="49151"
        placeholder="Enter the port"
        class="w-full font-mono"
        autocomplete="off"
      />
    </UFormField>

    <UFormField
      name="password"
      label="Password"
      description="Enter the password of the OBS WebSocket server"
      help="Leave blank if no password is set"
    >
      <UInput
        v-model="state.password"
        type="password"
        placeholder="Enter the password"
        class="w-full font-mono"
        autocomplete="off"
      />
    </UFormField>

    <div>
      <UButton type="submit" color="neutral" variant="subtle" trailing-icon="mdi:send" block>
        Save and Connect
      </UButton>
    </div>
  </UForm>
</template>

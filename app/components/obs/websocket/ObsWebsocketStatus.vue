<script setup lang="ts">
const { obs, obsInfo, isConnected, error, url, connect, disconnect, connecting } =
  useObsWebsocket();
</script>

<template>
  <div>
    <UTheme :props="{ badge: { variant: 'soft', size: 'md' } }">
      <div class="flex items-center gap-1">
        <UFieldGroup>
          <UBadge v-if="isConnected" color="success" icon="mdi:wifi-check">Connected</UBadge>
          <UTooltip v-else-if="error" :text="`Error connecting to OBS WebSocket: ${error}`">
            <UBadge color="error" leading-icon="mdi:wifi-alert">Error</UBadge>
          </UTooltip>
          <UBadge
            v-else-if="connecting"
            color="warning"
            leading-icon="mdi:wifi"
            class="animate-pulse"
          >
            Connecting...
          </UBadge>
          <UBadge v-else color="neutral" leading-icon="mdi:wifi-cancel">Disconnected</UBadge>

          <UTooltip v-if="isConnected" text="Disconnect">
            <UButton
              size="xs"
              color="success"
              variant="soft"
              trailing-icon="mdi:power"
              @click="disconnect"
            />
          </UTooltip>
          <UTooltip v-else-if="!connecting" text="Connect">
            <UButton
              size="xs"
              :color="error ? 'error' : 'neutral'"
              variant="soft"
              trailing-icon="mdi:power"
              @click="connect"
            />
          </UTooltip>
        </UFieldGroup>

        <template v-if="obsInfo">
          <UBadge
            color="neutral"
            leading-icon="simple-icons:obsstudio"
            class="text-muted font-mono"
          >
            OBS Studio {{ obsInfo.obsVersion }}
          </UBadge>
          <UBadge color="neutral" leading-icon="mdi:connection" class="text-muted font-mono">
            OBS WebSocket {{ obsInfo.obsWebSocketVersion }}
          </UBadge>
          <UBadge color="neutral" leading-icon="mdi:code-json" class="text-muted font-mono">
            RPC v{{ obsInfo.rpcVersion }}
          </UBadge>
          <UBadge
            color="neutral"
            leading-icon="mdi:desktop-tower-monitor"
            class="text-muted font-mono"
          >
            {{ obsInfo.platformDescription }}
          </UBadge>
        </template>
        <UBadge
          v-else-if="url"
          color="neutral"
          leading-icon="mdi:remote-desktop"
          class="text-muted font-mono"
          >{{ url }}</UBadge
        >
      </div>
    </UTheme>
  </div>
</template>

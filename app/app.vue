<script setup>
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en',
  },
});

const title = 'OBS Raw Generator | Streamer.bot';
const description =
  'Generate Streamer.bot OBS Raw requests for OBS Studio v28 and OBS WebSocket v5';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
});
</script>

<template>
  <UApp :tooltip="{ delayDuration: 0 }">
    <UDashboardGroup storage="local" storage-key="streamerbot:obs:main" unit="px">
      <UDashboardSidebar
        :min-size="300"
        :default-size="300"
        :ui="{
          body: 'p-0',
        }"
      >
        <template #header>
          <UDashboardNavbar>
            <AppLogo class="w-auto h-6 shrink-0" />
          </UDashboardNavbar>
        </template>

        <ObsRawNavigationMenu />
      </UDashboardSidebar>

      <UDashboardPanel>
        <UDashboardNavbar>
          <template #left>
            <ObsWebsocketStatus />
          </template>
          <template #right>
            <ObsWebsocketSlideover />
          </template>
        </UDashboardNavbar>

        <UMain class="px-8 overflow-y-auto">
          <NuxtPage />
        </UMain>
      </UDashboardPanel>
    </UDashboardGroup>
  </UApp>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { kebabCase } from 'scule';

const { value, obsInfo } = defineProps<{
  value?: ObsRequestTypeOption;
  obsInfo?: any;
}>();

const selectedRequest = defineModel();

const search = ref('');
const searchDebounced = debouncedRef(search, 500);
const items = computed<NavigationMenuItem[]>(() => {
  const items = obsRequestTypeOptions.map((item) => ({
    label: item.name,
    text: item.name,
    description: item.description,
    group: item.group,
    tooltip: {
      text: item.description,
    },
    to: `/${kebabCase(item.name)}`,
  }));

  const groups = Array.from(new Set(items.map((item) => item.group)));
  return groups.map((group) => ({
    label: group,
    defaultOpen: true,
    children: items.filter((item) => item.group === group),
  }));
});

const filteredItems = computed(() => {
  if (!searchDebounced.value) return items.value;

  return items.value.filter((group) => {
    const filteredChildren = group.children?.filter((item) => {
      const text = `${item.label} ${item.description} ${group.label}`;
      return !!text.match(new RegExp(searchDebounced.value, 'i'));
    });

    return filteredChildren?.length;
  });
});
</script>

<template>
  <UInput
    v-model="search"
    label="Search"
    placeholder="Search all requests..."
    icon="lucide:search"
    clearable
    variant="subtle"
    size="lg"
    class="w-full"
    :ui="{
      base: 'rounded-none',
    }"
  >
    <template v-if="search?.length" #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        icon="lucide:circle-x"
        aria-label="Clear input"
        @click="search = ''"
      />
    </template>
  </UInput>
  <div class="overflow-y-auto">
    <UNavigationMenu :items="filteredItems" orientation="vertical" />
  </div>
</template>

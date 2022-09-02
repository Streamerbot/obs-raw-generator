<script lang="ts" setup>
import { obsRequestTypeOptions, type ObsRequestTypeOption } from '@/common/obs.constants';
import { debouncedRef, useVModel } from '@vueuse/core';
import { computed, ref } from 'vue';

type Props = {
  value?: ObsRequestTypeOption,
  obsInfo?: any
}
const props = defineProps<Props>();
const selectedRequest = useVModel(props, 'value');

const search = debouncedRef<string>(ref(''), 500);
const filteredRequestItems = computed(() => {
  if (!search.value) return obsRequestTypeOptions;

  return obsRequestTypeOptions.filter(item => {
    const text = `${item.name} ${item.description} ${item.group}`;
    return !!text.match(new RegExp(search.value ?? '', 'i'));
  });
});
</script>

<template>
  <v-sheet class="rounded-lg">
    <v-text-field
      v-model="search"
      search
      label="Search"
      density="compact"
      variety="solo"
      hide-details
      clearable
    />

    <v-list
      color="primary"
      nav
      outlined
      class="request-list overflow-y-auto"
    >
      <template v-for="(item, idx) in filteredRequestItems" :key="item.name">
        <v-list-subheader
          v-if="item.group !== filteredRequestItems[idx-1]?.group"
          class="bg-grey-darken-4 mt-3"
        >
          <span class="text-primary text-uppercase font-weight-bold">{{
            item.group
            }}</span>
        </v-list-subheader>
        <v-list-item
          :active="selectedRequest && selectedRequest.name === item.name"
          :disabled="obsInfo && selectedRequest && !obsInfo.availableRequests.includes(selectedRequest.name)"
          color="primary"
          @click="selectedRequest = item"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
        </v-list-item>
      </template>
    </v-list>
  </v-sheet>
</template>

<style scoped>
.request-list {
  max-height: calc(100vh - 115px);
}
</style>
<script lang="ts" setup>
import { obsRequestTypeOptions, type ObsRequestTypeOption } from '@/common/obs.constants';
import { useVModel } from '@vueuse/core';
import { computed } from 'vue';

type Props = {
  value?: ObsRequestTypeOption,
  obsInfo?: any
}
const props = defineProps<Props>();
const selectedRequest = useVModel(props, 'value');

// add group headers for request autocomplete
const requestItems = computed<Array<ObsRequestTypeOption | { header: string; }>>(
  () => {
    const items = [];
    let prevGroup = null;
    for (const requestType of obsRequestTypeOptions) {
      if (prevGroup && prevGroup === requestType.group) {
        items.push({
          ...requestType,
        });
      } else {
        prevGroup = requestType.group;
        items.push({
          header: `${requestType.group}`,
        });
        items.push({
          ...requestType,
        });
      }
    }
    return items;
  }
);
</script>

<template>
  <v-list
    color="primary"
    nav
    outlined
    class="request-list overflow-y-auto py-0 rounded-lg"
  >
    <template v-for="item in requestItems">
      <v-list-subheader
        v-if="item.header"
        :key="item.header"
        class="bg-grey-darken-4 mt-3"
      >
        <span class="text-primary text-uppercase font-weight-bold">{{
           item.header
          }}</span>
      </v-list-subheader>
      <v-list-item
        v-else
        :key="item.name"
        :active="selectedRequest && selectedRequest.name === item.name"
        :disabled="obsInfo && selectedRequest && !obsInfo.availableRequests.includes(selectedRequest.name)"
        color="primary"
        @click="selectedRequest = item"
      >
        <v-list-item-title>{{  item.name  }}</v-list-item-title>
        <v-list-item-subtitle>{{  item.description  }}</v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-list>
</template>
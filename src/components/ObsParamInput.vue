<script lang="ts" setup>
import { ObsParamType, type ObsRequestParam } from '@/common/obs.constants';
import { useVModel } from '@vueuse/core';

type Props = {
  param: ObsRequestParam,
  value: any
};
const props = defineProps<Props>();
const value = useVModel(props, 'value');
</script>

<template>
  <v-select
    v-if="param.type === ObsParamType.BOOLEAN"
    v-model="value"
    :items="[
      { value: true, title: 'True' },
      { value: false, title: 'False' }
    ]"
    :label="param.name"
    :placeholder="param.description"
    density="comfortable"
    hide-details
    class="mr-2 flex-grow-1"
  />
  <v-text-field
    v-else
    v-model="value"
    :label="param.name"
    :placeholder="param.description"
    density="comfortable"
    hide-details
    class="mr-2"
  />
</template>
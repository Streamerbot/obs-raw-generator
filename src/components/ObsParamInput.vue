<script lang="ts" setup>
import { ObsParamType, type ObsRequestParam } from '@/common/obs.constants';
import { useVModel } from '@vueuse/core';

type Props = {
  param: ObsRequestParam,
  value: any
};
const props = defineProps<Props>();
const value = useVModel(props, 'value');

function isValidJson(v) {
  try {
    JSON.parse(v);
    return true;
  } catch (e) {
    return false;
  }
}
</script>

<template>
  <v-select
    v-if="param.type === ObsParamType.BOOLEAN"
    v-model="value"
    :items="[
      { value: true, title: 'True' },
      { value: false, title: 'False' }
    ]"
    label="Value"
    density="compact"
    :hint="param.description"
    persistent-hint
    class="mr-2 mb-2"
  />

  <v-textarea
    v-else-if="param.type === ObsParamType.OBJECT"
    v-model="value"
    label="JSON Value"
    density="compact"
    :hint="param.description"
    persistent-hint
    class="mr-2 mb-2"
    validate-on-blur
    auto-grow
    :rules="[isValidJson(value) || 'Invalid JSON']"
  />

  <v-text-field
    v-else
    v-model="value"
    label="Value"
    density="compact"
    :hint="param.description"
    persistent-hint
    class="mr-2 mb-2"
  />
</template>
<script lang="ts" setup>
import { ObsParamType, type ObsRequestContext, type ObsRequestParam } from '@/common/obs.constants';
import { useVModel } from '@vueuse/core';
import type OBSWebSocket from 'obs-websocket-js';
import { computed, onMounted, ref, watch } from 'vue';

type Props = {
  param: ObsRequestParam,
  value: any,
  obs?: OBSWebSocket,
  ctx?: ObsRequestContext,
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

const selectOptions = ref<string[]>([]);
const isSelect = computed<boolean>(() => !!props.obs?.identified && !!props.param?.getOptions);

onMounted(async () => selectOptions.value = await getSelectOptions());
watch([
  () => props.obs?.identified,
  () => props.param,
  () => props.ctx,
  isSelect,
], async () => selectOptions.value = await getSelectOptions());

async function getSelectOptions(): Promise<string[]> {
  console.log('test');
  if (props.param.getOptions && props.obs) {
    try {
      const options = (await props.param.getOptions(props.obs, props.ctx)) as string[];
      if (value.value && !options.includes(value.value)) value.value = null;
      return options;
    } catch (e) {
      return [];
    }
  }
  return [];
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

  <v-select v-else-if="isSelect && selectOptions?.length"
    v-model="value"
    :items="selectOptions"
    label="Value"
    density="compact"
    :hint="param.description"
    persistent-hint
    class="mr-2 mb-2"
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
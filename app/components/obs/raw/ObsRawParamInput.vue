<script lang="ts" setup>
const { obs } = useObsWebsocket();

const { param, ctx } = defineProps<{
  param: ObsRequestParam;
  ctx?: ObsRequestContext;
}>();
const value = defineModel<any>();

function isValidJson(v) {
  try {
    JSON.parse(v);
    return true;
  } catch (e) {
    return false;
  }
}

const selectOptions = ref<string[] | SelectOptionType[]>([]);

onMounted(loadValues);
watch([() => obs?.identified, () => param, () => ctx], loadValues);

async function loadValues(): Promise<void> {
  if (param.getOptions && obs?.identified) {
    try {
      const options = await param.getOptions(obs, ctx);

      if (typeof options[0] === 'object') {
        if (
          value.value &&
          !(options as SelectOptionType[]).find((option) => option.value === value.value)
        ) {
          value.value = null;
        }
        selectOptions.value = options as SelectOptionType[];
      } else if (value.value && !options.includes(value.value)) {
        value.value = null;
      }
      selectOptions.value = options as string[];
    } catch (e) {
      console.error(e);
      return;
    }
  } else if (param.getValue && obs?.identified) {
    try {
      const newVal = await param.getValue(obs, ctx);
      if (!newVal) return;

      if (ObsParamType.OBJECT) {
        value.value = JSON.stringify(newVal);
      }
    } catch (e) {
      return;
    }
  }
}
</script>

<template>
  <USelect
    v-if="param.type === ObsParamType.BOOLEAN"
    v-model="value"
    :items="[
      { value: true, label: 'True' },
      { value: false, label: 'False' },
    ]"
    label-key="label"
    value-key="value"
    label="Value"
    density="compact"
    :hint="param.description"
    persistent-hint
  />

  <UTextarea
    v-else-if="param.type === ObsParamType.OBJECT"
    v-model="value"
    label="JSON Value"
    density="compact"
    :hint="param.description"
    persistent-hint
    validate-on-blur
    auto-grow
    :rules="[isValidJson(value) || 'Invalid JSON']"
  />

  <USelect
    v-else-if="selectOptions?.length"
    v-model="value"
    :items="selectOptions"
    label-key="title"
    value-key="value"
    label="Value"
    density="compact"
    :hint="param.description"
  />

  <UInput v-else v-model="value" label="Value" density="compact" :hint="param.description" />
</template>

<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';
import { computed } from 'vue';

type Props = {
  value: string | object;
};
const props = defineProps<Props>();

const text = computed(() => {
  if (typeof props.value === 'string') return props.value;
  return JSON.stringify(props.value);
});
const { copy, isSupported } = useClipboard();

function copyText() {
  console.log('copying', text.value, 'isSupported', isSupported.value);
  copy(text.value);
}
</script>

<template>
  <div class="bg-grey-darken-4 my-3 pa-3 position-relative" style="min-height: 3rem;">
    <pre><code>{{ value }}</code></pre>
    <span class="position-absolute" style="top: 0.5rem; right: 0.5rem">
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <span v-bind="props">
            <v-btn
              size="x-small"
              icon
              @click="copyText"
              :disabled="!isSupported"
            >
              <v-icon size="small">mdi-content-copy</v-icon>
            </v-btn>
          </span>
        </template>
        <small class="text-white">{{
          isSupported ? 'Copy' : 'Clipboard Permission Required'
        }}</small>
      </v-tooltip>
    </span>
  </div>
</template>
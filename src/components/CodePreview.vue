<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';
import Prism from "prismjs";
import 'prismjs/themes/prism-tomorrow.css';
import { computed, nextTick, onMounted, watch } from 'vue';

type Props = {
  value?: string | object | undefined;
};
const props = defineProps<Props>();

onMounted(() => refreshPrism);
watch(() => props.value, refreshPrism);

function refreshPrism() {
  nextTick(() => Prism.highlightAll());
}


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
  <div class="bg-grey-darken-4 position-relative">
    <pre class="pa-3 overflow-y-auto" style="min-height: 100px; max-height: 500px;"><code class="language-javascript">{{ value || '{}' }}</code></pre>
    <span class="position-absolute" style="top: 1rem; right: 1.5rem">
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
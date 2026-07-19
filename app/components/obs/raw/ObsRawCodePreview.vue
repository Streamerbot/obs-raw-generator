<script lang="ts" setup>
const { value } = defineProps<{
  value?: string | object | undefined;
}>();

const text = computed(() => {
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
});
const { copy, isSupported } = useClipboard();

function copyText() {
  copy(text.value);
  useToast().add({
    id: 'preview-copy',
    title: 'Copied to clipboard!',
    icon: 'mdi:content-copy',
    color: 'success',
    duration: 2000,
  });
}
</script>

<template>
  <div class="relative bg-muted size-full p-3 rounded-md min-h-10">
    <Shiki
      lang="json"
      :code="text || '// No response... \n// Did you send your request?'"
      theme="vesper"
      class="*:bg-transparent!"
    />

    <UTooltip
      class="absolute top-2 right-2"
      :text="isSupported ? 'Copy' : 'Clipboard Permission Required'"
      :content="{ side: 'top' }"
    >
      <UButton
        color="neutral"
        variant="ghost"
        icon
        class="cursor-pointer"
        @click="copyText"
        :disabled="!isSupported"
      >
        <UIcon name="mdi-content-copy" />
      </UButton>
    </UTooltip>
  </div>
</template>

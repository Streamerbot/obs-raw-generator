<script setup lang="ts">
import { pascalCase } from 'scule';

const { isConnected, sendRequest } = useObsWebsocket();
const { copy, isSupported } = useClipboard();

const route = useRoute();
const requestParam = route.params.request as string || 'get-version';

const selectedRequest = computed(() => {
  return obsRequestTypeOptions.find((option) => option.name === requestName.value);
});
const requestName = computed(() => {
  return requestParam ? pascalCase(requestParam) : 'No Request';
});
const description = computed(() => selectedRequest.value?.description || '');

useSeoMeta({
  title: `${requestName.value} | Streamer.bot OBS Raw Generator`,
  description: description.value || '',
  ogTitle: `${requestName.value} | Streamer.bot OBS Raw Generator`,
  ogDescription: description.value || '',
});

defineOgImage('OgImageDefault', {
  headline: 'OBS Raw Request',
  title: requestName.value || 'OBS Raw Generator',
  description: description.value || '',
});

const formatStyle = ref<RequestFormatType>(RequestFormatType.STREAMERBOT_RAW);
const formattedRequest = computed(() => {
  const data = getFormattedRequestInternal() || {};
  return formatRequest(formatStyle.value, selectedRequest.value?.name, data);
});
const selectedParams = ref<Record<string, any[]>>({});
const response = ref<any>({});

watch(
  selectedRequest,
  (val, prev) => {
    if (!val) return;

    if (val?.name !== prev?.name) response.value = '';

    const defaultParams = val.params?.map((param) => ({ ...param, value: null })) ?? [];

    if (!selectedParams.value[val.name] || !Array.isArray(selectedParams.value[val.name])) {
      selectedParams.value = Object.assign(selectedParams.value, {
        [val.name]: defaultParams,
      });
    }

    for (const param of defaultParams) {
      if (!selectedParams.value[val.name]?.find((p) => p.name === param.name)) {
        selectedParams.value[val.name]?.push({ ...param, value: null });
      }
    }
  },
  { immediate: true },
);

function getFormattedRequestInternal() {
  if (!selectedRequest.value || !selectedParams.value[selectedRequest.value.name]) {
    return {};
  }

  let resp: Record<string, any> = {};

  selectedParams.value[selectedRequest.value.name]?.forEach((param) => {
    resp[param.name] = formatParam(param);
  });

  return resp;
}

async function sendSelectedRequest() {
  if (!selectedRequest.value) return;

  try {
    response.value = await sendRequest(selectedRequest.value.name, getFormattedRequestInternal());
  } catch (e) {
    response.value = e;
  }
}

function addParam() {
  if (!selectedRequest.value) return;

  selectedParams.value[selectedRequest.value.name]?.push({
    type: ObsParamType.STRING,
    name: '',
    value: '',
  });
}

function removeParam(index: number) {
  if (!selectedRequest.value) return;

  selectedParams.value[selectedRequest.value.name]?.splice(index, 1);
}

function copyObsRaw() {
  copy(
    JSON.stringify(
      formatRequest(
        RequestFormatType.STREAMERBOT_RAW,
        selectedRequest.value?.name,
        getFormattedRequestInternal() ?? {},
      ),
    ),
  );
  useToast().add({
    id: 'copy-obs-raw',
    title: 'Copied to clipboard!',
    icon: 'mdi:content-copy',
    color: 'success',
    duration: 2000,
  });
}
function copyObsRawCPH() {
  copy(
    `${formatRequest(
      RequestFormatType.STREAMERBOT_RAW_CPH,
      selectedRequest.value?.name,
      getFormattedRequestInternal() ?? {},
    )}`,
  );
  useToast().add({
    id: 'copy-obs-raw',
    title: 'Copied to clipboard!',
    icon: 'mdi:content-copy',
    color: 'success',
    duration: 2000,
  });
}
</script>

<template>
  <UPageHeader
    headline="OBS WebSocket Request"
    :title="requestName"
    :description
    :ui="{
      title: 'font-logo tracking-tight',
      description: 'font-logo tracking-tight',
      headline: 'font-logo tracking-tight',
    }"
  />

  <div class="grid grid-cols-2 gap-4 py-4">
    <UCard v-if="selectedRequest" :ui="{ body: 'p-0!', header: 'px-4!' }">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-logo font-semibold tracking-tight">Parameters</span>
          <UButton
            v-if="selectedRequest"
            size="sm"
            color="neutral"
            variant="subtle"
            trailing-icon="mdi:plus-circle"
            :disabled="!selectedRequest"
            @click="addParam()"
          >
            Add Parameter
          </UButton>
        </div>
      </template>

      <UForm class="flex flex-col gap-1">
        <UAlert
          v-if="!selectedParams[selectedRequest.name]?.length"
          color="neutral"
          variant="soft"
          description="No parameters defined for this request. You can add parameters manually if needed."
          class="text-toned"
        />

        <UFormField
          v-for="(param, index) in selectedParams[selectedRequest.name]"
          :key="index"
          :label="param?.name || `Parameter ${index + 1}`"
          :description="param?.description"
          :ui="{
            root: 'bg-muted/50 hover:bg-muted transition-colors p-4',
            container: 'flex items-start gap-1 w-full',
          }"
        >
          <template #hint>
            <UButton
              v-if="!param.required"
              variant="ghost"
              color="error"
              size="xs"
              label="Remove"
              trailing-icon="mdi:close-circle"
              class="shrink ml-auto"
              :disabled="param.required"
              @click="removeParam(index)"
            />
          </template>

          <USelect
            v-model="param.type"
            :items="obsParamTypeOptions"
            label="Type"
            :variant="param.required ? 'subtle' : 'outline'"
            label-key="title"
            value-key="value"
            :disabled="param.required"
          ></USelect>
          <UInput
            v-model="param.name"
            label="Name"
            :variant="param.required ? 'subtle' : 'outline'"
            :readonly="param.required"
            :disabled="param.required"
          />
          <div v-if="param.type === ObsParamType.OBJECT && param.params" class="grow *:w-full">
            <ObsRawParamInput
              v-for="objParam in param.params"
              :key="`${param.name}-${objParam.name}`"
              v-model="objParam.value"
              :param="objParam"
            />
          </div>
          <div v-else class="grow *:w-full">
            <ObsRawParamInput
              v-model="param.value"
              :param="param"
              :ctx="{
                ...selectedRequest,
                params: selectedParams[selectedRequest.name],
              }"
            />
          </div>
        </UFormField>
      </UForm>
    </UCard>

    <UCard :ui="{ body: 'p-0! *:rounded-none size-full', header: 'px-4!' }">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-logo font-semibold tracking-tight">Request</span>

          <UFieldGroup size="sm">
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:content-copy"
              :disabled="!isSupported"
              @click="copyObsRawCPH"
            >
              Copy CPH
            </UButton>
            <UButton
              color="neutral"
              variant="subtle"
              trailing-icon="mdi:content-copy"
              :disabled="!isSupported"
              @click="copyObsRaw"
            >
              Copy OBS Raw
            </UButton>
          </UFieldGroup>
        </div>
      </template>
      <ObsRawCodePreview :value="formattedRequest" />
    </UCard>

    <UCard
      class="col-span-full"
      title="Response"
      :ui="{ body: 'p-0! *:rounded-none size-full', header: 'px-4!' }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-logo font-semibold tracking-tight">Execute</span>

          <UFieldGroup size="lg">
            <UButton
              color="success"
              variant="subtle"
              trailing-icon="mdi:send"
              :disabled="!isConnected || !selectedRequest"
              @click="sendSelectedRequest"
            >
              Send Request
            </UButton>
          </UFieldGroup>
        </div>
      </template>
      <ObsRawCodePreview :value="response" class="text-sm" />
    </UCard>
  </div>
</template>

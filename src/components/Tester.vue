<script lang="ts" setup>
import {
ObsParamType,
obsParamTypeOptions,
obsRequestTypeOptions, RequestFormatType, type ObsRequestParam,
type ObsRequestTypeOption
} from '@/common/obs.constants';
import { useStorage } from '@vueuse/core';
import OBSWebSocket, {
type OBSEventTypes,
type OBSRequestTypes
} from 'obs-websocket-js';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import CodePreview from './CodePreview.vue';
import ObsParamInput from './ObsParamInput.vue';

type Schema = {
  requests?: (keyof OBSRequestTypes)[];
  events: (keyof OBSEventTypes)[];
  types: string[];
};

const obs = new OBSWebSocket();

const host = useStorage('obs-store:host', '127.0.0.1');
const port = useStorage('obs-store:port', 4455);
const url = computed<string>(() => `ws://${host.value}:${port.value}`);
const password = ref<string>('');
const connecting = ref<boolean>(false);
const error = ref<string | null>();
const isConnected = ref<boolean>(false);

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
const selectedRequest = ref<ObsRequestTypeOption>();
// disable local storage for now
// const selectedParams = useStorage<Record<string, any[]>>(
//   'obs-store:params',
//   {}
// );
const selectedParams = ref<Record<string, any[]>>({});
const response = ref<any>({});

onMounted(() => {
  initEventListeners();
  connect();
});

onUnmounted(() => {
  disconnect();
});

const formatStyle = ref<RequestFormatType>(RequestFormatType.STREAMERBOT_RAW);
const formattedRequest = computed(() => {
  const data = getFormattedRequestInternal() || {};

  switch(formatStyle.value) {
    case RequestFormatType.OBS:
      return {
        'request-type': selectedRequest.value?.name,
        ...data
      };

    case RequestFormatType.STREAMERBOT_RAW:
    default:
      return {
        'requestType': selectedRequest.value?.name,
        'requestData': data
      };
  }
});

watch(selectedRequest, (val, prev) => {
  if (!val) return;

  if (val?.name !== prev?.name) response.value = '';

  const defaultParams =
    val.params?.map((param) => ({ ...param, value: null })) ?? [];

  if (
    !selectedParams.value[val.name] ||
    !Array.isArray(selectedParams.value[val.name])
  ) {
    selectedParams.value = Object.assign(selectedParams.value, {
      [val.name]: defaultParams,
    });
  }

  for (const param of defaultParams) {
    if (!selectedParams.value[val.name].find((p) => p.name === param.name)) {
      selectedParams.value[val.name].push({ ...param, value: null });
    }
  }
});

async function connect() {
  error.value = null;
  connecting.value = true;

  try {
    if (isConnected.value) await obs.disconnect();
    await obs.connect(url.value, password.value);
  } catch (e: Error) {
    error.value = e.message || 'Connection error';
  } finally {
    connecting.value = false;
  }
}

async function disconnect() {
  error.value = null;

  try {
    await obs.disconnect();
  } catch (e: Error) {
    error.value = e.message;
  }
}

function initEventListeners() {
  obs.on('ConnectionClosed', () => (isConnected.value = false));
  obs.on('ConnectionError', () => (isConnected.value = false));
  obs.on('ConnectionOpened', () => (isConnected.value = true));
}

async function sendRequest() {
  if (!selectedRequest.value) return;

  try {
    response.value = await obs.call(
      selectedRequest.value.name,
      getFormattedRequestInternal()
    );
  } catch (e) {
    response.value = e;
  }
}

function addParam() {
  if (!selectedRequest.value) return;

  selectedParams.value[selectedRequest.value.name].push({
    type: ObsParamType.STRING,
    name: '',
    value: '',
  });
}

function removeParam(index: number) {
  if (!selectedRequest.value) return;

  selectedParams.value[selectedRequest.value.name].splice(index, 1);
}

function getFormattedRequestInternal() {
  if (
    !selectedRequest.value ||
    !selectedParams.value[selectedRequest.value.name]
  ) {
    return {};
  }

  let resp: Record<string, any> = {};

  selectedParams.value[selectedRequest.value.name].forEach((param) => {
    resp[param.name] = formatParam(param);
  });

  return resp;
}

function formatParam(param: ObsRequestParam & { value: any; }) {
  if (param.type === ObsParamType.NUMBER) {
    return Number(param.value);
  } else if (param.type === ObsParamType.BOOLEAN) {
    return Boolean(param.value);
  } else if (param.type === ObsParamType.OBJECT) {
    if (param.params) {
      const nestedResp: Record<string, any> = {};
      param.params.forEach(nestedParam => nestedResp[nestedParam.name] = formatParam(nestedParam));
      return nestedResp;
    }
    return Object(param.value);
  } else {
    return param.value;
  }
}
</script>

<template>
  <v-toolbar
    density="compact"
    color="#222"
  >
    <v-toolbar-title>Streamer.bot OBS Raw Generator</v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <v-text-field
        v-model="host"
        type="text"
        label="Host"
        density="compact"
        variant="filled"
        class="mr-2"
        hide-details
        :disabled="isConnected"
        style="min-width: 150px;"
      />
      <v-text-field
        v-model.number="port"
        type="number"
        label="Port"
        density="compact"
        variant="filled"
        class="mr-2"
        hide-details
        :disabled="isConnected"
        style="min-width: 75px;"
      />
      <v-text-field
        v-model="password"
        type="password"
        label="Password"
        density="compact"
        variant="filled"
        class="mr-2"
        hide-details
        :disabled="isConnected"
        style="min-width: 150px;"
      />
      <v-btn
        v-if="isConnected"
        color="error"
        variant="text"
        class="ml-2"
        @click="disconnect"
      >Disconnect</v-btn>
      <v-btn
        v-else
        color="success"
        variant="text"
        class="ml-2"
        :loading="connecting"
        @click="connect"
      >Connect</v-btn>
    </v-toolbar-items>
  </v-toolbar>
  <v-container>
    <div>
      <v-alert
        v-if="error"
        type="error"
        density="compact"
        class="mb-3"
      >
        {{ error }}
      </v-alert>

      <div class="mt-5">
        <h2>Request</h2>
        <form style="display: relative">
          <v-autocomplete
            v-model="selectedRequest"
            :items="requestItems"
            label="Request Type"
            density="comfortable"
            item-title="name"
            item-value="name"
            return-object
            menu-icon="mdi-chevron-down"
            clearable
          >
            <template #item="{ props, item }">
              <v-list-subheader
                v-if="item.raw.header"
                :key="props.key"
                class="bg-grey-darken-3"
              >
                <span class="text-uppercase font-weight-bold">{{
                  item.raw.header
                  }}</span>
              </v-list-subheader>
              <v-list-item
                v-else
                v-bind="props"
                :title="item.raw.name"
                :subtitle="item.raw.description"
                density="compact"
              ></v-list-item>
            </template>
          </v-autocomplete>

          <code-preview
            v-if="selectedRequest"
            :value="formattedRequest"
          ></code-preview>

          <div
            v-if="selectedRequest"
            class="d-flex align-center my-2"
            v-for="(param, index) in selectedParams[selectedRequest.name]"
          >
            <v-select
              v-model="param.type"
              :items="obsParamTypeOptions"
              label="Type"
              density="comfortable"
              hide-details
              :disabled="param.required"
              class="mr-2"
              style="max-width: 200px;"
            ></v-select>
            <v-text-field
              v-model="param.name"
              label="Name"
              density="comfortable"
              hide-details
              :disabled="param.required"
              class="mr-2"
              style="max-width: 350px;"
            />

            <div
              v-if="param.type === ObsParamType.OBJECT && param.params"
              class="d-flex flex-column"
              style="width: 50%;"
            >
              <ObsParamInput
                v-for="objParam in param.params"
                v-model:value="objParam.value"
                :param="objParam"
                :key="objParam.name"
              />
            </div>
            <template v-else>
              <ObsParamInput
                v-model:value="param.value"
                :param="param"
              />
            </template>

            <v-btn
              icon
              variant="plain"
              size="small"
              class="ml-2"
              :disabled="param.required"
              @click="removeParam(index)"
            >
              <v-icon size="small">mdi-close-circle</v-icon>
            </v-btn>
          </div>
        </form>

        <div class="d-flex align-center">
          <v-btn
            v-if="selectedRequest"
            @click="addParam()"
            type="button"
            class="my-2 mr-2"
            :disabled="!selectedRequest"
          >
            Add Param
          </v-btn>
          <v-btn
            class="my-3"
            color="success"
            :disabled="!isConnected || !selectedRequest"
            @click="sendRequest"
          >
            Send Request
          </v-btn>
        </div>
      </div>

      <div class="my-3">
        <h2>Response</h2>
        <code-preview :value="response"></code-preview>
      </div>
    </div>
  </v-container>
</template>
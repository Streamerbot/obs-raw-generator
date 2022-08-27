<script lang="ts" setup>
import {
ObsParamType,
obsParamTypeOptions,
obsRequestTypeOptions,
type ObsRequestTypeOption
} from '@/common/obs.constants';
import { useStorage } from '@vueuse/core';
import OBSWebSocket, {
type OBSEventTypes,
type OBSRequestTypes
} from 'obs-websocket-js';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import CodePreview from './CodePreview.vue';

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
const requestItems = computed<Array<ObsRequestTypeOption | { header: string }>>(
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
const selectedParams = useStorage<Record<string, any[]>>(
  'obs-store:params',
  {}
);
const response = ref<any>({});

onMounted(() => {
  initEventListeners();
  connect();
});

onUnmounted(() => {
  disconnect();
});

const formattedRequest = computed(() => {
  let resp = getFormattedRequestInternal() || {};

  resp['request-type'] = selectedRequest.value?.name;
  resp['message-id'] = '123';

  return resp;
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
    if (param.type === ObsParamType.NUMBER) {
      resp[param.name] = Number(param.value);
    } else if (param.type === ObsParamType.BOOLEAN) {
      resp[param.name] = Boolean(param.value);
    } else if (param.type === ObsParamType.OBJECT) {
      resp[param.name] = Object(param.value);
    } else {
      resp[param.name] = param.value;
    }
  });

  return resp;
}
</script>

<template>
  <v-container>
    <div>
      <v-alert
        v-if="error"
        type="error"
        density="compact"
        class="mb-3"
      >{{
        error
        }}</v-alert>

      <div style="grid-area: header">
        <h2>Config</h2>
        <form class="d-flex align-center">
          <v-text-field
            v-model="host"
            type="text"
            label="Host"
            density="comfortable"
            hide-details
            :disabled="isConnected"
          />
          <v-text-field
            v-model.number="port"
            type="number"
            label="Port"
            density="comfortable"
            hide-details
            :disabled="isConnected"
          />
          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            density="comfortable"
            hide-details
            :disabled="isConnected"
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
        </form>
      </div>

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

            <v-select
              v-if="param.type === ObsParamType.BOOLEAN"
              v-model="param.value"
              :items="[
                { value: true, title: 'True' },
                { value: false, title: 'False' }
              ]"
              label="Value"
              :placeholder="param.description"
              density="comfortable"
              hide-details
              class="mr-2 flex-grow-1"
            />
            <v-text-field
              v-else
              v-model="param.value"
              label="Value"
              :placeholder="param.description"
              density="comfortable"
              hide-details
              class="mr-2"
            />

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
            class="my-2"
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
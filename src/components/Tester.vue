<script lang="ts" setup>
import {
obsRequestTypeOptions,
type ObsRequestTypeOption
} from '@/common/obs.constants';
import { useStorage } from '@vueuse/core';
import OBSWebSocket, {
type OBSEventTypes,
type OBSRequestTypes
} from 'obs-websocket-js';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

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
const error = ref<string | null>();
const isConnected = ref<boolean>(false);

// TODO: remove this
const schema = ref<Schema>({
  events: ['CurrentProgramSceneChanged', 'CurrentPreviewSceneChanged'],
  types: ['String', 'Number', 'Boolean'],
});

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
const selectedRequest = ref<keyof OBSRequestTypes>();
const selectedParams = useStorage<Record<string, any[]>>('obs-store:params', {});
const response = ref<any>({});
const emits = ref([]);

onMounted(() => {
  initEventListeners();
  connect();
});

onUnmounted(() => {
  disconnect();
});

const formattedRequest = computed(() => {
  let resp = getFormattedRequestInternal() || {};

  resp['request-type'] = selectedRequest.value;
  resp['message-id'] = '123';

  return resp;
});

const reverseEmits = computed(() => emits.value.slice().reverse());

watch(selectedRequest, (newValue) => {
  if (!newValue) return;

  if (!selectedParams.value[newValue]) {
    selectedParams.value = Object.assign(selectedParams.value, {
      [newValue]: [],
    });
  }
});

async function connect() {
  error.value = null;

  try {
    if (isConnected.value) await obs.disconnect();
    await obs.connect(url.value, password.value);
  } catch (e: Error) {
    error.value = e.message || 'Connection error';
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
      selectedRequest.value,
      getFormattedRequestInternal()
    );
  } catch (e) {
    response.value = e;
  }
}

function addParam() {
  if (!selectedRequest.value) return;

  selectedParams.value[selectedRequest.value].push({
    type: 'String',
    name: '',
    value: '',
  });
}

function removeParam(index: number) {
  if (!selectedRequest.value) return;

  selectedParams.value[selectedRequest.value].splice(index, 1);
}

function getFormattedRequestInternal() {
  if (!selectedRequest.value || !selectedParams.value[selectedRequest.value]) {
    return {};
  }

  let resp: Record<string, any> = {};

  selectedParams.value[selectedRequest.value].forEach((param) => {
    if (param.type === 'Number') {
      resp[param.name] = Number(param.value);
    } else if (param.type === 'Boolean') {
      resp[param.name] = Boolean(param.value);
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
      <v-alert v-if="error" type="error" density="compact" class="mb-3">{{
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
          <v-btn v-if="isConnected" color="error" @click="disconnect"
            >Disconnect</v-btn
          >
          <v-btn v-else color="success" @click="connect">Connect</v-btn>
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
            :disabled="!isConnected"
            menu-icon="mdi-chevron-down"
            :transition="false"
            clearable
          >
            <template v-slot:item="{ props, item }">
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

          <v-btn
            v-if="selectedRequest != ''"
            @click="addParam()"
            type="button"
            class="my-2"
          >
            Add Param
          </v-btn>

          <div
            class="d-flex align-center"
            v-for="(param, index) in selectedParams[selectedRequest]"
          >
            <v-select
              v-model="param.type"
              :items="schema.types"
              label="Type"
              density="comfortable"
              hide-details
            ></v-select>
            <v-text-field
              v-model="param.name"
              label="Name"
              density="comfortable"
              hide-details
            />
            <v-text-field
              v-model="param.value"
              label="Value"
              density="comfortable"
              hide-details
            />
            <v-btn icon size="x-small" @click="removeParam(index)">
              <v-icon size="small">mdi-trash-can-outline</v-icon>
            </v-btn>
          </div>
        </form>
        <v-btn
          class="my-3"
          color="success"
          :disabled="!selectedRequest"
          @click="sendRequest"
        >
          Send Request
        </v-btn>

        <div class="my-3 bg-grey-darken-4">
          <pre><code>{{ formattedRequest }}</code></pre>
        </div>
      </div>

      <div class="my-3">
        <h2>Response</h2>
        <div class="bg-grey-darken-4">
          <pre><code>{{ response }}</code></pre>
        </div>
      </div>

      <!-- <div style="grid-area: footer">
        <h2>Events</h2>
        <div class="events">
          <div class="event" v-for="emit in reverseEmits">
            <b>{{ emit.event }} - {{ emit.timestamp | date('%T') }}</b>
            <pre>{{ emit.data }}</pre>
          </div>
        </div>
      </div> -->
    </div>
  </v-container>
</template>
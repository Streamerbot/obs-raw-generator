<script lang="ts" setup>
import {
ObsParamType,
obsParamTypeOptions,
obsRequestTypeOptions,
RequestFormatType,
type ObsRequestParam,
type ObsRequestTypeOption
} from '@/common/obs.constants';
import { useClipboard, useStorage } from '@vueuse/core';
import OBSWebSocket, {
type OBSEventTypes,
type OBSRequestTypes
} from 'obs-websocket-js';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import CodePreview from './CodePreview.vue';
import ObsParamInput from './ObsParamInput.vue';
import RequestMenu from './RequestMenu.vue';

type Schema = {
  requests?: (keyof OBSRequestTypes)[];
  events: (keyof OBSEventTypes)[];
  types: string[];
};

const obs = new OBSWebSocket();

const host = useStorage('obs-store:host', '127.0.0.1');
const port = useStorage('obs-store:port', 4455);
const password = useStorage('obs-store:password', '');
const url = computed<string>(() => `ws://${host.value}:${port.value}`);
const connecting = ref<boolean>(false);
const error = ref<string | null>();
const isConnected = ref<boolean>(false);
const obsInfo = ref<any>();

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

watch(isConnected, async (val) => {
  if (!val) return (obsInfo.value = null);

  // auto select first item on connect
  selectedRequest.value = obsRequestTypeOptions.find((item) => !!item.name);

  // fetch obs version info on connect
  nextTick(async () => {
    obsInfo.value = await sendRequest('GetVersion');
    console.log(obsInfo.value);
  });
});

const formatStyle = ref<RequestFormatType>(RequestFormatType.STREAMERBOT_RAW);
const formattedRequest = computed(() => {
  const data = getFormattedRequestInternal() || {};
  return formatRequest(formatStyle.value, selectedRequest.value?.name, data);
});

function formatRequest(
  formatType: RequestFormatType = RequestFormatType.STREAMERBOT_RAW,
  requestType: string = '',
  requestData = {}
) {
  switch (formatType) {
    case RequestFormatType.OBS:
      return {
        'request-type': requestType,
        ...requestData,
      };

    case RequestFormatType.STREAMERBOT_RAW_CPH:
      return `CPH.ObsSendRaw("${requestType}", ${JSON.stringify(
        JSON.stringify(requestData)
      )}, 1)`;

    case RequestFormatType.STREAMERBOT_RAW:
    default:
      return {
        requestType,
        requestData,
      };
  }
}

const { copy, isSupported: clipboardSupported } = useClipboard();
function copyObsRaw() {
  copy(
    JSON.stringify(
      formatRequest(
        RequestFormatType.STREAMERBOT_RAW,
        selectedRequest.value?.name,
        getFormattedRequestInternal() ?? {}
      )
    )
  );
}
function copyObsRawCPH() {
  copy(
    `${formatRequest(
      RequestFormatType.STREAMERBOT_RAW_CPH,
      selectedRequest.value?.name,
      getFormattedRequestInternal() ?? {}
    )}`
  );
}

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
    isConnected.value = true;
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
}

async function sendRequest(
  name: keyof OBSRequestTypes,
  data: Record<string, any> = {}
) {
  return await obs.call(name, data);
}

async function sendSelectedRequest() {
  if (!selectedRequest.value) return;

  try {
    response.value = await sendRequest(
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

function formatParam(param: ObsRequestParam & { value: any }) {
  if (param.type === ObsParamType.NUMBER) {
    return Number(param.value);
  } else if (param.type === ObsParamType.BOOLEAN) {
    return Boolean(param.value);
  } else if (param.type === ObsParamType.OBJECT) {
    if (param.params) {
      const nestedResp: Record<string, any> = {};
      param.params.forEach(
        (nestedParam) =>
          (nestedResp[nestedParam.name] = formatParam(nestedParam))
      );
      return nestedResp;
    } else {
      try {
        return JSON.parse(param.value);
      } catch (e) {
        return {};
      }
    }
  } else {
    return param.value;
  }
}
</script>

<template>
  <v-toolbar density="compact" color="#1d1d1d">
    <span class="d-flex flex-column mx-5">
      <span>OBS Raw Generator</span>
      <small class="text-grey">for Streamer.bot</small>
    </span>
    <v-spacer />
    <v-toolbar-items>
      <span class="d-flex align-center mx-5">
        <v-text-field
          v-model="host"
          type="text"
          label="Host"
          density="compact"
          variant="filled"
          class="mr-2 my-1"
          hide-details
          :disabled="isConnected"
          style="min-width: 150px"
        />
        <v-text-field
          v-model.number="port"
          type="number"
          label="Port"
          density="compact"
          variant="filled"
          class="mr-2 my-1"
          hide-details
          :disabled="isConnected"
          style="min-width: 75px"
        />
        <v-text-field
          v-model="password"
          type="password"
          label="Password"
          density="compact"
          variant="filled"
          class="mr-2 my-1"
          hide-details
          :disabled="isConnected"
          style="min-width: 150px"
        />
        <v-btn
          v-if="isConnected"
          color="pink"
          variant="outlined"
          class="ml-2"
          @click="disconnect"
          >Disconnect <v-icon class="ml-2">mdi-close-circle</v-icon>
        </v-btn>
        <v-btn
          v-else
          color="success"
          variant="outlined"
          class="ml-2"
          :loading="connecting"
          @click="connect"
          >Connect <v-icon class="ml-2">mdi-chevron-right-circle</v-icon>
        </v-btn>
      </span>
    </v-toolbar-items>
  </v-toolbar>

  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="4" xl="3">
        <RequestMenu
          v-model:value="selectedRequest"
          :obs-info="obsInfo"
        ></RequestMenu>
      </v-col>
      <v-col cols="12" sm="8" xl="9">
        <div>
          <v-slide-y-transition>
            <v-alert v-if="error" type="error" density="compact" class="my-3">
              {{ error }}
            </v-alert>
          </v-slide-y-transition>

          <v-slide-y-transition>
            <v-sheet
              class="rounded-lg pa-3 text-grey d-flex align-center"
              v-if="obsInfo"
            >
              <span class="mr-5 text-success d-flex align-center">
                <v-icon size="small" color="success">mdi-check-circle</v-icon>
                <span class="ml-1">Connected</span>
              </span>
              <small> OBS Studio {{ obsInfo.obsVersion }} </small>
              <span class="mx-2"></span>
              <small> OBS WebSocket {{ obsInfo.obsWebSocketVersion }} </small>
              <span class="mx-2"></span>
              <small> RPC v{{ obsInfo.rpcVersion }} </small>
              <span class="mx-2"></span>
              <small>
                {{ obsInfo.platformDescription }}
              </small>
            </v-sheet>
          </v-slide-y-transition>

          <div class="mt-5">
            <h2>Request</h2>
            <form>
              <code-preview
                v-if="selectedRequest"
                :value="formattedRequest"
              ></code-preview>

              <v-slide-y-transition group>
                <v-sheet
                  v-if="selectedRequest"
                  v-for="(param, index) in selectedParams[selectedRequest.name]"
                  :key="index"
                  class="rounded-lg my-3 pa-2"
                >
                  <div class="d-flex justify-space-between">
                    <span class="px-2 pt-2 text-grey">
                      Param {{ index + 1 }}
                    </span>
                    <v-btn
                      icon
                      variant="plain"
                      size="small"
                      class="ml-2"
                      color="error"
                      :disabled="param.required"
                      @click="removeParam(index)"
                    >
                      <v-icon size="small">mdi-close-circle</v-icon>
                    </v-btn>
                  </div>
                  <div class="d-flex align-center">
                    <v-select
                      v-model="param.type"
                      :items="obsParamTypeOptions"
                      label="Type"
                      density="compact"
                      :disabled="param.required"
                      class="mr-2 align-self-start"
                      style="max-width: 200px"
                    ></v-select>

                    <v-text-field
                      v-model="param.name"
                      label="Name"
                      density="compact"
                      :disabled="param.required"
                      class="mr-2 align-self-start"
                      style="max-width: 350px"
                    />

                    <div
                      v-if="param.type === ObsParamType.OBJECT && param.params"
                      class="d-flex flex-column"
                      style="width: 50%"
                    >
                      <ObsParamInput
                        v-for="objParam in param.params"
                        :key="`${param.name}-${objParam.name}`"
                        v-model:value="objParam.value"
                        :param="objParam"
                      />
                    </div>
                    <div v-else style="width: 50%">
                      <ObsParamInput
                        v-model:value="param.value"
                        :param="param"
                        :obs="obs"
                        :ctx="{
                          ...selectedRequest,
                          params: selectedParams[selectedRequest.name],
                        }"
                      />
                    </div>
                  </div>
                </v-sheet>
              </v-slide-y-transition>
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
                <v-icon class="ml-2">mdi-plus</v-icon>
              </v-btn>
              <v-spacer class="ml-auto" />
              <v-btn
                class="my-2 mr-2"
                color="primary"
                variant="text"
                :disabled="!clipboardSupported"
                @click="copyObsRawCPH"
              >
                Copy CPH
                <v-icon class="ml-2">mdi-content-copy</v-icon>
              </v-btn>
              <v-btn
                class="my-2 mr-2"
                color="primary"
                variant="text"
                :disabled="!clipboardSupported"
                @click="copyObsRaw"
              >
                Copy OBS Raw
                <v-icon class="ml-2">mdi-content-copy</v-icon>
              </v-btn>
              <v-btn
                class="my-2"
                color="success"
                :disabled="!isConnected || !selectedRequest"
                @click="sendSelectedRequest"
              >
                Send Request
                <v-icon class="ml-2">mdi-send</v-icon>
              </v-btn>
            </div>
          </div>

          <div class="my-3">
            <h2>Response</h2>
            <code-preview :value="response"></code-preview>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
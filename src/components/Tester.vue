<script lang="ts" setup>
import OBSWebSocket, { type OBSEventTypes, type OBSRequestTypes } from 'obs-websocket-js';
import { computed, onMounted, ref, watch } from 'vue';

type Schema = {
  requests: (keyof OBSRequestTypes)[],
  events: (keyof OBSEventTypes)[],
  types: string[],
};

const obs = new OBSWebSocket();

const host = ref<string>('127.0.0.1');
const port = ref<number>(4455);
const url = computed<string>(() => `ws://${host.value}:${port.value}`);
const password = ref<string>('');
const error = ref<string | null>();
const isConnected = ref<boolean>(false);

const schema = ref<Schema>({
  requests: [
    'PressInputPropertiesButton',
    'GetHotkeyList',
    'OpenInputInteractDialog',
    'SaveSourceScreenshot',
    'GetVersion',
    'SetInputName',
    'SetSceneName',
    'GetStats',
    'TriggerStudioModeTransition',
    'SetInputAudioSyncOffset',
    'GetSceneCollectionList',
    'BroadcastCustomEvent',
    'Sleep',
    'SetSceneSceneTransitionOverride',
    'CallVendorRequest',
    'CreateSceneCollection',
    'SetStudioModeEnabled',
    'TriggerHotkeyByName',
    'OpenVideoMixProjector',
    'TriggerHotkeyByKeySequence',
    'GetPersistentData',
    'SetSceneItemIndex',
    'SetPersistentData',
    'SetCurrentSceneCollection',
    'SetInputMute',
    'SetCurrentPreviewScene',
    'SetCurrentProgramScene',
    'OpenSourceProjector',
    'GetProfileList',
    'SetCurrentProfile',
    'RemoveProfile',
    'CreateProfile',
    'GetProfileParameter',
    'SetProfileParameter',
    'GetInputPropertiesListPropertyItems',
    'GetInputAudioBalance',
    'GetStreamServiceSettings',
    'GetVideoSettings',
    'SetVideoSettings',
    'SetInputAudioBalance',
    'SetInputVolume',
    'SetStreamServiceSettings',
    'GetInputDefaultSettings',
    'GetSpecialInputs',
    'GetInputKindList',
    'GetRecordDirectory',
    'GetInputMute',
    'GetCurrentPreviewScene',
    'GetReplayBufferStatus',
    'GetSourceActive',
    'GetSourceScreenshot',
    'GetSourcePrivateSettings',
    'SetSourcePrivateSettings',
    'SetSourceFilterEnabled',
    'GetInputList',
    'GetSceneList',
    'GetGroupList',
    'SetInputSettings',
    'GetCurrentProgramScene',
    'GetSceneItemId',
    'RemoveScene',
    'CreateScene',
    'GetSceneSceneTransitionOverride',
    'RemoveInput',
    'CreateInput',
    'GetSceneItemLocked',
    'GetInputSettings',
    'ToggleInputMute',
    'SetCurrentSceneTransition',
    'GetInputVolume',
    'GetInputAudioSyncOffset',
    'GetInputAudioMonitorType',
    'SetInputAudioMonitorType',
    'StartVirtualCam',
    'GetInputAudioTracks',
    'SetInputAudioTracks',
    'GetTransitionKindList',
    'GetSceneItemTransform',
    'GetSceneTransitionList',
    'GetVirtualCamStatus',
    'GetCurrentSceneTransition',
    'SetCurrentSceneTransitionDuration',
    'SetCurrentSceneTransitionSettings',
    'GetCurrentSceneTransitionCursor',
    'SetTBarPosition',
    'StopOutput',
    'ToggleOutput',
    'GetSourceFilterList',
    'GetSourceFilterDefaultSettings',
    'CreateSourceFilter',
    'RemoveSourceFilter',
    'SetSourceFilterName',
    'GetSourceFilter',
    'StopRecord',
    'ToggleRecord',
    'SetSourceFilterIndex',
    'SetSourceFilterSettings',
    'SetSceneItemTransform',
    'GetSceneItemList',
    'GetGroupSceneItemList',
    'CreateSceneItem',
    'RemoveSceneItem',
    'DuplicateSceneItem',
    'GetSceneItemEnabled',
    'SetSceneItemEnabled',
    'SetSceneItemLocked',
    'GetSceneItemIndex',
    'StartReplayBuffer',
    'GetSceneItemBlendMode',
    'SetSceneItemBlendMode',
    'GetSceneItemPrivateSettings',
    'SetSceneItemPrivateSettings',
    'StopVirtualCam',
    'ToggleVirtualCam',
    'StopReplayBuffer',
    'ToggleReplayBuffer',
    'SaveReplayBuffer',
    'GetLastReplayBufferReplay',
    'GetOutputList',
    'GetOutputStatus',
    'StartOutput',
    'GetOutputSettings',
    'SetOutputSettings',
    'GetStreamStatus',
    'StopStream',
    'ToggleStream',
    'StartStream',
    'SendStreamCaption',
    'GetRecordStatus',
    'StartRecord',
    'ToggleRecordPause',
    'PauseRecord',
    'ResumeRecord',
    'SetMediaInputCursor',
    'GetMediaInputStatus',
    'OffsetMediaInputCursor',
    'TriggerMediaInputAction',
    'GetStudioModeEnabled',
    'OpenInputPropertiesDialog',
    'OpenInputFiltersDialog',
    'GetMonitorList'
  ],
  events: [
    'CurrentProgramSceneChanged',
    'CurrentPreviewSceneChanged',
  ],
  types: [
    "String",
    "Number",
    "Boolean"
  ]
});
const selectedName = ref<keyof OBSRequestTypes>('GetCurrentProgramScene');
const selectedParams = ref<Record<string, any[]>>({});
const response = ref<any>({});
const emits = ref([]);

onMounted(() => {
  loadLocalStorage();
  initEventListeners();
  connect();
});

const formattedRequest = computed(() => {
  let resp = getFormattedRequestInternal() || {};

  resp['request-type'] = selectedName.value;
  resp['message-id'] = '123';

  return resp;
});

const reverseEmits = computed(() => emits.value.slice().reverse());

watch(selectedName, (newValue) => {
  if (!selectedParams.value[newValue]) {
    selectedParams.value = Object.assign(selectedParams.value, { [newValue]: [] });
    addParam();
  }
});

watch(selectedParams, (newValue) => {
  saveLocalStorage();
}, { deep: true });

async function connect() {
  error.value = null;

  try {
    if (isConnected.value) await obs.disconnect();
    await obs.connect(url.value, password.value);
  } catch (e) {
    error.value = e.message;
  }
}

async function disconnect() {
  error.value = null;

  try {
    if (isConnected.value) await obs.connect(url.value, password.value);
    await obs.disconnect();
  } catch (e) {
    error.value = e.message;
  }
}

function initEventListeners() {
  obs.on('ConnectionClosed', () => isConnected.value = false);
  obs.on('ConnectionError', () => isConnected.value = false);
  obs.on('ConnectionOpened', () => isConnected.value = true);
}

async function sendRequest() {
  try {
    response.value = await obs.call(selectedName.value, getFormattedRequestInternal());
  } catch (e) {
    response.value = e;
  }
}

function addParam() {
  selectedParams.value[selectedName.value].push({
    type: 'String',
    name: '',
    value: ''
  });
}

function removeParam(index: number) {
  selectedParams.value[selectedName.value].splice(index, 1);
}

function getFormattedRequestInternal() {
  if (!selectedName.value || !selectedParams.value[selectedName.value]) {
    return {};
  }

  let resp: Record<string, any> = {};

  selectedParams.value[selectedName.value].forEach((param) => {
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

function saveLocalStorage() {
  if (Object.keys(selectedParams.value).length) {
    localStorage.setItem('obs-store', JSON.stringify(selectedParams.value));
    localStorage.setItem('obs-store:host', host.value);
    localStorage.setItem('obs-store:port', `${port.value}`);
  }
}

function loadLocalStorage() {
  selectedParams.value = JSON.parse(localStorage.getItem('obs-store') || '{}');
  host.value = localStorage.getItem('obs-store:host') || '127.0.0.1';
  port.value = Number(localStorage.getItem('obs-store:port') || 4455);
}
</script>

<template>
  <v-container>
    <div>
      <v-alert v-if="error" type="error" density="compact" class="mb-3">{{ error }}</v-alert>

      <div style="grid-area: header">
        <h2>Config</h2>
        <form class="d-flex align-center">
          <v-text-field v-model="host" type="text" label="Host" density="comfortable" hide-details />
          <v-text-field v-model.number="port" type="number"  label="Port" density="comfortable" hide-details />
          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            density="comfortable" hide-details
          />
          <v-btn v-if="isConnected" color="error" @click="disconnect">Disconnect</v-btn>
          <v-btn v-else color="success" @click="connect">Connect</v-btn>
        </form>
      </div>

      <div class="mt-5">
        <h2>Request</h2>
        <form>
          <v-select v-model="selectedName" :items="schema.requests" label="Request Type"></v-select>

          <v-btn
            v-if="selectedName != ''"
            @click="addParam()"
            type="button"
            class="my-2"
          >
            Add Param
          </v-btn>

          <div
            class="d-flex align-center"
            v-for="(param, index) in selectedParams[selectedName]"
          >
            <v-select v-model="param.type" :items="schema.types" label="Type" density="comfortable" hide-details></v-select>
            <v-text-field v-model="param.name" label="Name" density="comfortable" hide-details/>
            <v-text-field v-model="param.value" label="Value" density="comfortable" hide-details/>
            <v-btn icon size="x-small" @click="removeParam(index)">
              <v-icon size="small">mdi-trash-can-outline</v-icon>
            </v-btn>
          </div>
        </form>
        <v-btn v-if="selectedName != ''" class="my-3" @click="sendRequest">Send Request</v-btn>

        <div class="my-3">
          <pre><code>{{ formattedRequest }}</code></pre>
        </div>
      </div>

      <div class="my-3">
        <h2>Response</h2>
        <div class="response">
          <pre><code>{{ response }}</code></pre>
        </div>
      </div>

      <div style="grid-area: footer">
        <h2>Events</h2>
        <div class="events">
          <div class="event" v-for="emit in reverseEmits">
            <b>{{ emit.event }} - {{ emit.timestamp | date('%T') }}</b>
            <pre>{{ emit.data }}</pre>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

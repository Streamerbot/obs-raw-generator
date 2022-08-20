<script lang="ts" setup>
import OBSWebSocket, { type OBSRequestTypes } from 'obs-websocket-js';
import { computed, onMounted, ref, watch } from 'vue';

const obs = new OBSWebSocket();

const host = ref<string>('127.0.0.1');
const port = ref<number>(4455);
const url = computed<string>(() => `ws://${host.value}:${port.value}`);
const password = ref<string>('');

const schema = ref({
  requests: ['GetCurrentProgramScene', 'RequestStatus'],
  events: ['CurrentProgramSceneChanged'],
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
  obsLogin();
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

async function obsLogin() {
  await obs.connect(url.value, password.value);
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
  <div id="app">
    <div class="grid">
      <div style="grid-area: header">
        <h2>Config</h2>
        <form class="login form" v-on:submit.prevent="obsLogin()">
          <input type="text" v-model="host" placeholder="Host" />
          <input type="number" v-model.number="port" placeholder="Port" />
          <input
            type="password"
            v-model="password"
            placeholder="Password"
          />
          <button type="submit">Connect</button>
        </form>
      </div>

      <div style="grid-area: left-top">
        <h2>Request</h2>
        <form class="request form" v-on:submit.prevent="sendRequest()">
          <label>Request Type:</label>
          <select v-model="selectedName">
            <option v-for="request in schema.requests">{{ request }}</option>
          </select>

          <button
            v-if="selectedName != ''"
            v-on:click="addParam()"
            type="button"
          >
            Add Param
          </button>

          <div
            class="param"
            v-for="(param, index) in selectedParams[selectedName]"
          >
            <select v-model="param.type">
              <option v-for="type in schema.types">{{ type }}</option>
            </select>
            <input type="text" v-model="param.name" placeholder="Name" />
            <input type="text" v-model="param.value" placeholder="Value" />
            <button v-on:click="removeParam(index)" type="button">x</button>
          </div>

          <button v-if="selectedName != ''" type="submit">Send Request</button>
        </form>

        <div class="request raw">
          <pre>{{ formattedRequest }}</pre>
        </div>
      </div>

      <div style="grid-area: right-top">
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
  </div>
</template>

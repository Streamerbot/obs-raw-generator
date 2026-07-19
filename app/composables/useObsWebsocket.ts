import OBSWebSocket, { type OBSRequestTypes, type OBSResponseTypes } from 'obs-websocket-js';

export const useObsWebsocket = createSharedComposable(() => {
  const obs = new OBSWebSocket();

  const host = useLocalStorage('obs-store:host', '127.0.0.1');
  const port = useLocalStorage('obs-store:port', 4455);
  const password = useLocalStorage('obs-store:password', '');
  const url = computed<string>(() => `ws://${host.value}:${port.value}`);
  const connecting = ref<boolean>(false);
  const error = ref<string | null>();
  const isConnected = ref<boolean>(false);
  const obsInfo = ref<OBSResponseTypes['GetVersion']>();

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

  async function sendRequest(name: keyof OBSRequestTypes, data: Record<string, any> = {}) {
    return await obs.call(name, data);
  }

  function initEventListeners() {
    obs.on('ConnectionClosed', () => (isConnected.value = false));
    obs.on('ConnectionError', () => (isConnected.value = false));
  }

  onMounted(() => {
    initEventListeners();
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  watch(isConnected, async (val) => {
    if (!val) return (obsInfo.value = undefined);

    // fetch obs version info on connect
    nextTick(async () => {
      obsInfo.value = (await sendRequest('GetVersion')) as OBSResponseTypes['GetVersion'];
      console.log(obsInfo.value);
    });
  });

  return {
    obs,
    host,
    port,
    password,
    url,
    connecting,
    error,
    isConnected,
    obsInfo,
    connect,
    disconnect,
    sendRequest,
  };
});

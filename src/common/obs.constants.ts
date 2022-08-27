import type { OBSRequestTypes } from 'obs-websocket-js';

export enum ObsParamType {
  STRING = 'String',
  NUMBER = 'Number',
  BOOLEAN = 'Boolean',
  OBJECT = 'Object',
}

export const obsParamTypeOptions = [
  { title: ObsParamType.STRING, value: ObsParamType.STRING },
  { title: ObsParamType.NUMBER, value: ObsParamType.NUMBER },
  { title: ObsParamType.BOOLEAN, value: ObsParamType.BOOLEAN },
  { title: ObsParamType.OBJECT, value: ObsParamType.OBJECT },
];

export enum ObsRequestTypeGroup {
  GENERAL = 'General',
  CONFIG = 'Configuration',
  SOURCE = 'Sources',
  SCENE = 'Scenes',
  INPUT = 'Inputs',
  TRANSITION = 'Transitions',
  FILTER = 'Filters',
  SCENE_ITEM = 'Scene Items',
  OUTPUT = 'Outputs',
  STREAM = 'Stream',
  RECORD = 'Record',
  MEDIA = 'Media Inputs',
  UI = 'UI',
}

export type ObsRequestParam = {
  name: string;
  type: ObsParamType;
  description: string;
  required?: boolean;
  params?: ObsRequestParam[];
};

export type ObsRequestTypeOption = {
  name: keyof OBSRequestTypes;
  description: string;
  group: ObsRequestTypeGroup;
  params?: ObsRequestParam[];
};

export const obsRequestTypeOptions: ObsRequestTypeOption[] = [
  // Lines that are commented out are ones listed in documentation, but don't exist in the source code.
  {
    name: 'GetVersion',
    description: 'Retrieve OBS version information',
    group: ObsRequestTypeGroup.GENERAL,
  },
  {
    name: 'GetStats',
    description: 'Retrieve various OBS statistics',
    group: ObsRequestTypeGroup.GENERAL,
  },
  {
    name: 'BroadcastCustomEvent',
    description: 'Broadcasts a CustomEvent to all WebSocket clients.',
    group: ObsRequestTypeGroup.GENERAL,
    params: [
      {
        name: 'eventData',
        type: ObsParamType.OBJECT,
        description: 'Data payload to emit',
        required: true,
      },
    ],
  },
  {
    name: 'CallVendorRequest',
    description: 'Call a request registered to a vendor.',
    group: ObsRequestTypeGroup.GENERAL,
    params: [
      {
        name: 'vendorName',
        type: ObsParamType.STRING,
        description: 'Name of vendor',
        required: true,
      },
      {
        name: 'requestType',
        type: ObsParamType.STRING,
        description: 'The request type to call',
        required: true,
      },
      {
        name: 'requestData',
        type: ObsParamType.OBJECT,
        description: 'Object containing request data',
        required: true,
      },
    ],
  },
  {
    name: 'GetHotkeyList',
    description: 'Retrieves a list of all available hotkey names.',
    group: ObsRequestTypeGroup.GENERAL,
  },
  {
    name: 'TriggerHotkeyByName',
    description: 'Triggers a hotkey using its name.',
    group: ObsRequestTypeGroup.GENERAL,
    params: [
      {
        name: 'hotkeyName',
        type: ObsParamType.STRING,
        description: 'Name of hotkey to trigger',
        required: true,
      },
    ],
  },
  {
    name: 'TriggerHotkeyByKeySequence',
    description: 'Triggers a hotkey using a sequence of keys.',
    group: ObsRequestTypeGroup.GENERAL,
    params: [
      {
        name: 'keyId',
        type: ObsParamType.STRING,
        description: 'The OBS Key ID to use',
        required: true,
      },
      {
        name: 'keyModifiers',
        type: ObsParamType.OBJECT,
        description: 'Object containing key modifiers to apply.',
        required: false,
        params: [
          {
            name: 'shift',
            type: ObsParamType.BOOLEAN,
            description: 'Press Shift',
            required: false,
          },
          {
            name: 'control',
            type: ObsParamType.BOOLEAN,
            description: 'Press CTRL',
            required: false,
          },
          {
            name: 'alt',
            type: ObsParamType.BOOLEAN,
            description: 'Press ALT',
            required: false,
          },
          {
            name: 'command',
            type: ObsParamType.BOOLEAN,
            description: 'Press CMD (Mac OS Only)',
            required: false,
          },
        ],
      },
    ],
  },
  {
    name: 'Sleep',
    description:
      'Sleeps for a time duration or number of frames. Only available in request batches with types SERIAL_REALTIME or SERIAL_FRAME.',
    group: ObsRequestTypeGroup.GENERAL,
    params: [
      {
        name: 'sleepMillis',
        type: ObsParamType.NUMBER,
        description:
          'Number of milliseconds to sleep for (if `SERIAL_REALTIME` mode)',
        required: false,
      },
      {
        name: 'sleepFrames',
        type: ObsParamType.NUMBER,
        description: 'Number of frames to sleep for (if `SERIAL_FRAME` mode).',
        required: false,
      },
    ],
  },

  {
    name: 'GetPersistentData',
    description:
      'Gets the value of a "slot" from the selected persistent data realm.',
    group: ObsRequestTypeGroup.CONFIG,
    params: [
      {
        name: 'realm',
        type: ObsParamType.STRING,
        description:
          'The data realm to select. `OBS_WEBSOCKET_DATA_REALM_GLOBAL` or `OBS_WEBSOCKET_DATA_REALM_PROFILE`',
        required: true,
      },
      {
        name: 'slotName',
        type: ObsParamType.STRING,
        description: 'The name of the slot to retrieve data from.',
        required: true,
      },
    ],
  },
  {
    name: 'SetPersistentData',
    description:
      'Sets the value of a "slot" from the selected persistent data realm.',
    group: ObsRequestTypeGroup.CONFIG,
    params: [
      {
        name: 'realm',
        type: ObsParamType.STRING,
        description:
          'The data realm to select. `OBS_WEBSOCKET_DATA_REALM_GLOBAL` or `OBS_WEBSOCKET_DATA_REALM_PROFILE`',
        required: true,
      },
      {
        name: 'slotName',
        type: ObsParamType.STRING,
        description: 'The name of the slot to retrieve data from.',
        required: true,
      },
      {
        name: 'slotValue',
        type: ObsParamType.STRING,
        description: 'The value to apply to the slot.',
        required: true,
      },
    ],
  },
  {
    name: 'GetSceneCollectionList',
    description: 'Gets an array of all scene collections.',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'SetCurrentSceneCollection',
    description: 'Switches to a scene collection.',
    group: ObsRequestTypeGroup.CONFIG,
    params: [
      {
        name: 'sceneCollectionName',
        type: ObsParamType.STRING,
        description: 'Name of the scene collection to switch to.',
        required: true,
      },
    ],
  },
  {
    name: 'CreateSceneCollection',
    description:
      'Creates a new scene collection, switching to it in the process. Note: This will block until the collection has finished changing.',
    group: ObsRequestTypeGroup.CONFIG,
    params: [
      {
        name: 'sceneCollectionName',
        type: ObsParamType.STRING,
        description: 'Name for the new scene collection.',
        required: true,
      },
    ],
  },
  {
    name: 'GetProfileList',
    description: 'Gets an array of all profiles.',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'SetCurrentProfile',
    description: 'Switches to a profile.',
    group: ObsRequestTypeGroup.CONFIG,
    params: [
      {
        name: 'profileName',
        type: ObsParamType.STRING,
        description: 'Name of the profile to switch to.',
        required: true,
      },
    ],
  },
  {
    name: 'CreateProfile',
    description: 'Creates a new profile, switching to it in the process',
    group: ObsRequestTypeGroup.CONFIG,
    params: [
      {
        name: 'profileName',
        type: ObsParamType.STRING,
        description: 'Name for the new profile.',
        required: true,
      },
    ],
  },
  {
    name: 'RemoveProfile',
    description:
      'Removes a profile. If the current profile is chosen, it will change to a different profile first.',
    group: ObsRequestTypeGroup.CONFIG,
    params: [
      {
        name: 'profileName',
        type: ObsParamType.STRING,
        description: 'Name of the profile to remove.',
        required: true,
      },
    ],
  },
  {
    name: 'GetProfileParameter',
    description: "Gets a parameter from the current profile's configureation",
    group: ObsRequestTypeGroup.CONFIG,
    params: [
      {
        name: 'parameterCategory',
        type: ObsParamType.STRING,
        description: 'Category of the parameter to get.',
        required: true,
      },
      {
        name: 'parameterName',
        type: ObsParamType.STRING,
        description: 'Name of the parameter to get.',
        required: true,
      },
    ],
  },
  {
    name: 'SetProfileParameter',
    description:
      "Sets the value of a parameter in the current profile's configuration.",
    group: ObsRequestTypeGroup.CONFIG,
    params: [
      {
        name: 'parameterCategory',
        type: ObsParamType.STRING,
        description: 'Category of the parameter to set.',
        required: true,
      },
      {
        name: 'parameterName',
        type: ObsParamType.STRING,
        description: 'Name of the parameter to set.',
        required: true,
      },
      {
        name: 'parameterValue',
        type: ObsParamType.STRING,
        description: 'Value of the parameter to set. Use `null` to delete.',
        required: true,
      },
    ],
  },
  {
    name: 'GetVideoSettings',
    description: 'Gets the current video settings.',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'SetVideoSettings',
    description:
      'Sets the current video settings. (Note: Fields must be in pairs. Ex. You cannot set baseWidth without also setting baseHeight.)',
    group: ObsRequestTypeGroup.CONFIG,
    params: [
      {
        name: 'fpsNumerator',
        type: ObsParamType.NUMBER,
        description: 'Numerator of the fractional FPS value.',
        required: false,
      },
      {
        name: 'fpsDenominator',
        type: ObsParamType.NUMBER,
        description: 'Denominator of the fractional FPS value.',
        required: false,
      },
      {
        name: 'baseWidth',
        type: ObsParamType.NUMBER,
        description: 'Width of the base (canvas) resolution in pixels.',
        required: false,
      },
      {
        name: 'baseHeight',
        type: ObsParamType.NUMBER,
        description: 'Height of the base (canvas) resolution in pixels.',
        required: false,
      },
      {
        name: 'outputWidth',
        type: ObsParamType.NUMBER,
        description: 'Width of the output resolution in pixels.',
        required: false,
      },
      {
        name: 'outputHeight',
        type: ObsParamType.NUMBER,
        description: 'Height of the output resolution in pixels.',
        required: false,
      },
    ],
  },
  {
    name: 'GetStreamServiceSettings',
    description:
      'Gets the current stream service settings (stream destination).',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'SetStreamServiceSettings',
    description:
      'Sets the current stream service settings (stream destination).',
    group: ObsRequestTypeGroup.CONFIG,
    params: [
      {
        name: 'streamServiceType',
        type: ObsParamType.STRING,
        description:
          'Type of stream service to apply. Example: `rtmp_common` or `rtmp_custom`',
        required: true,
      },
      {
        name: 'streamServiceSettings',
        type: ObsParamType.OBJECT,
        description: 'Settings to apply to the service.',
        required: true,
      },
    ],
  },
  {
    name: 'GetSourceActive',
    description: 'Gets the active and show state of a source',
    group: ObsRequestTypeGroup.SOURCE,
    params: [
      {
        name: 'sourceName',
        type: ObsParamType.STRING,
        description: 'Source to get the state of',
        required: true,
      },
    ],
  },
  {
    name: 'GetSourceScreenshot',
    description: 'Gets a Base64-encoded screenshot of a source',
    group: ObsRequestTypeGroup.SOURCE,
    params: [
      {
        name: 'sourceName',
        type: ObsParamType.STRING,
        description: 'Name of the source to take a screenshot of',
        required: true,
      },
      {
        name: 'imageFormat',
        type: ObsParamType.STRING,
        description:
          'Image compression format to use. Use `GetVersion` to get compatible image formats',
        required: true,
      },
      {
        name: 'imageWidth',
        type: ObsParamType.NUMBER,
        description: 'Width to scale the screenshot to',
        required: false,
      },
      {
        name: 'imageHeight',
        type: ObsParamType.NUMBER,
        description: 'Height to scale the screenshot to',
        required: false,
      },
      {
        name: 'imageCompressionQuality',
        type: ObsParamType.NUMBER,
        description:
          'Compression quality to use. 0 for high compression, 100 for uncompressed.',
        required: false,
      },
    ],
  },
  {
    name: 'SaveSourceScreenshot',
    description: 'Saves a screenshot of a source to the filesystem',
    group: ObsRequestTypeGroup.SOURCE,
    params: [
      {
        name: 'sourceName',
        type: ObsParamType.STRING,
        description: 'Name of the source to take a screenshot of',
        required: true,
      },
      {
        name: 'imageFormat',
        type: ObsParamType.STRING,
        description:
          'Image compression format to use. Use `GetVersion` to get compatible image formats',
        required: true,
      },
      {
        name: 'imageFilePath',
        type: ObsParamType.STRING,
        description:
          'Path to save the screenshot file to. Example, `C:Users<user>Desktopscreenshot.png`',
        required: true,
      },
      {
        name: 'imageWidth',
        type: ObsParamType.NUMBER,
        description: 'Width to scale the screenshot to',
        required: false,
      },
      {
        name: 'imageHeight',
        type: ObsParamType.NUMBER,
        description: 'Height to scale the screenshot to',
        required: false,
      },
      {
        name: 'imageCompressionQuality',
        type: ObsParamType.NUMBER,
        description:
          'Compression quality to use. 0 for high compression, 100 for uncompressed.',
        required: false,
      },
    ],
  },
  {
    name: 'GetSceneList',
    description: 'Gets an array of all scenes in OBS.',
    group: ObsRequestTypeGroup.SCENE,
  },
  {
    name: 'GetGroupList',
    description: 'Gets an array of all groups in OBS',
    group: ObsRequestTypeGroup.SCENE,
  },
  {
    name: 'GetCurrentProgramScene',
    description: 'Gets the current program scene',
    group: ObsRequestTypeGroup.SCENE,
  },
  {
    name: 'SetCurrentProgramScene',
    description: 'Sets the current program scene',
    group: ObsRequestTypeGroup.SCENE,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Scene to set as the current program scene.',
        required: true,
      },
    ],
  },
  {
    name: 'GetCurrentPreviewScene',
    description: 'Gets the current preview scene',
    group: ObsRequestTypeGroup.SCENE,
  },
  {
    name: 'SetCurrentPreviewScene',
    description: 'Sets the current preview scene',
    group: ObsRequestTypeGroup.SCENE,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Scene to set as the current preview scene.',
        required: true,
      },
    ],
  },
  {
    name: 'CreateScene',
    description: 'Creates a new scene in OBS',
    group: ObsRequestTypeGroup.SCENE,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name for the new scene.',
        required: true,
      },
    ],
  },
  {
    name: 'RemoveScene',
    description: 'Removes a scene from OBS',
    group: ObsRequestTypeGroup.SCENE,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene to remove.',
        required: true,
      },
    ],
  },
  {
    name: 'SetSceneName',
    description: 'Sets the name of a scene',
    group: ObsRequestTypeGroup.SCENE,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene to be renamed',
        required: true,
      },
      {
        name: 'newSceneName',
        type: ObsParamType.STRING,
        description: 'New name for the scene.',
        required: true,
      },
    ],
  },
  {
    name: 'GetSceneSceneTransitionOverride',
    description: 'Gets the scene transition overridden for a scene',
    group: ObsRequestTypeGroup.SCENE,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene.',
        required: true,
      },
    ],
  },
  {
    name: 'SetSceneSceneTransitionOverride',
    description: 'Sets the scene transition overridden for a scene',
    group: ObsRequestTypeGroup.SCENE,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene.',
        required: true,
      },
      {
        name: 'transitionName',
        type: ObsParamType.STRING,
        description:
          'Name of the scene transition to use as override. Specify `null` to remove.',
        required: false,
      },
      {
        name: 'transitionDuration',
        type: ObsParamType.NUMBER,
        description:
          'Duration to use for any overridden transition. Specify `null` to remove.',
        required: false,
      },
    ],
  },
  {
    name: 'GetInputList',
    description: 'Gets an array of all inputs in OBS',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputKind',
        type: ObsParamType.STRING,
        description: 'Restrict the array to only inputs of the specified kind.',
        required: false,
      },
    ],
  },
  {
    name: 'GetInputKindList',
    description: 'Gets an array of all available input kinds in OBS',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'unversioned',
        type: ObsParamType.BOOLEAN,
        description:
          'true = Return all kinds as unversions, false = Return with version suffixes (if available).',
        required: false,
      },
    ],
  },
  {
    name: 'GetSpecialInputs',
    description: 'Gets the names of all special inputs',
    group: ObsRequestTypeGroup.INPUT,
  },
  {
    name: 'CreateInput',
    description:
      'Creates a new input, adding it as a scene item to the specified scene',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene to add the input to as a scene item.',
        required: true,
      },
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the new input to create.',
        required: true,
      },
      {
        name: 'inputKind',
        type: ObsParamType.STRING,
        description: 'The kind of input to be created.',
        required: true,
      },
      {
        name: 'inputSettings',
        type: ObsParamType.OBJECT,
        description: 'Settings object to initialize the input with.',
        required: false,
      },
      {
        name: 'sceneItemEnabled',
        type: ObsParamType.BOOLEAN,
        description:
          'Whether to set the created scene item to enabled or disabled.',
        required: false,
      },
    ],
  },
  {
    name: 'RemoveInput',
    description: 'Removes an existing input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to remove.',
        required: true,
      },
    ],
  },
  {
    name: 'SetInputName',
    description: 'Sets the name of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Current input name.',
        required: true,
      },
      {
        name: 'newInputName',
        type: ObsParamType.STRING,
        description: 'New name for the input.',
        required: true,
      },
    ],
  },
  {
    name: 'GetInputDefaultSettings',
    description: 'Gets the default settings for an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputKind',
        type: ObsParamType.STRING,
        description: 'Input kind to get the default settings for.',
        required: true,
      },
    ],
  },
  {
    name: 'GetInputSettings',
    description: 'Gets the settings of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to get the settings of.',
        required: true,
      },
    ],
  },
  {
    name: 'SetInputSettings',
    description: 'Sets the settings of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to set the settings of.',
        required: true,
      },
      {
        name: 'inputSettings',
        type: ObsParamType.OBJECT,
        description: 'Object of settings to apply.',
        required: true,
      },
      {
        name: 'overlay',
        type: ObsParamType.BOOLEAN,
        description:
          'true = apply the settings on top of existing ones, false = reset the input to its defaults, then apply settings.',
        required: false,
      },
    ],
  },
  {
    name: 'GetInputMute',
    description: 'Gets the audio mute state of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of input to get the mute state of.',
        required: true,
      },
    ],
  },
  {
    name: 'SetInputMute',
    description: 'Sets the audio mute state of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to set the mute state of.',
        required: true,
      },
      {
        name: 'inputMuted',
        type: ObsParamType.BOOLEAN,
        description: 'Whether to mute the input or not.',
        required: true,
      },
    ],
  },
  {
    name: 'ToggleInputMute',
    description: 'Toggles the audio mute state of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to toggle the mute state of.',
        required: true,
      },
    ],
  },
  {
    name: 'GetInputVolume',
    description: 'Gets the current volume setting of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to get the volume of.',
        required: true,
      },
    ],
  },
  {
    name: 'SetInputVolume',
    description: 'Sets the volume setting of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to set the volume of.',
        required: true,
      },
      {
        name: 'inputVolumeMul',
        type: ObsParamType.NUMBER,
        description: 'Volume setting in mul.',
        required: false,
      },
      {
        name: 'inputVolumeDb',
        type: ObsParamType.NUMBER,
        description: 'Volume setting in dB.',
        required: false,
      },
    ],
  },
  {
    name: 'GetInputAudioBalance',
    description: 'Gets the audio balance of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to get the audio balance of.',
        required: true,
      },
    ],
  },
  {
    name: 'SetInputAudioBalance',
    description: 'Sets the audio balance of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to set the audio balance of.',
        required: true,
      },
      {
        name: 'inputAudioBalance',
        type: ObsParamType.NUMBER,
        description: 'New audio balance value.',
        required: true,
      },
    ],
  },
  {
    name: 'GetInputAudioSyncOffset',
    description:
      'Gets the audio sync offset of an input. Note: The audio synce offset can be negative too.',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to get the audio sync offset of.',
        required: true,
      },
    ],
  },
  {
    name: 'SetInputAudioSyncOffset',
    description: 'Sets the audio sync offset of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to set the audio sync offset for.',
        required: true,
      },
      {
        name: 'inputAudioSyncOffset',
        type: ObsParamType.NUMBER,
        description: 'New audio synce offset in milliseconds.',
        required: true,
      },
    ],
  },
  {
    name: 'GetInputAudioMonitorType',
    description: 'Gets the audio monitor type of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to set the audio monitor of.',
        required: true,
      },
    ],
  },
  {
    name: 'SetInputAudioMonitorType',
    description: 'Sets the audio monitor type of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to set the audio monitor type for.',
        required: true,
      },
      {
        name: 'monitorType',
        type: ObsParamType.STRING,
        description: 'Audio monitor type.',
        required: true,
      },
    ],
  },
  {
    name: 'GetInputAudioTracks',
    description: 'Gets the enable state of all audio tracks of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input.',
        required: true,
      },
    ],
  },
  {
    name: 'SetInputAudioTracks',
    description: 'Sets the enable state of audio tracks of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input.',
        required: true,
      },
      {
        name: 'inputAudioTracks',
        type: ObsParamType.OBJECT,
        description: 'Track settings to apply.',
        required: true,
      },
    ],
  },
  {
    name: 'GetInputPropertiesListPropertyItems',
    description: 'Gets the items of a list property from an input properties',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input.',
        required: true,
      },
      {
        name: 'propertyName',
        type: ObsParamType.STRING,
        description: 'Name of the list property to get the items of.',
        required: true,
      },
    ],
  },
  {
    name: 'PressInputPropertiesButton',
    description: 'Presses a button in the properties of an input',
    group: ObsRequestTypeGroup.INPUT,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input.',
        required: true,
      },
      {
        name: 'propertyName',
        type: ObsParamType.STRING,
        description: 'Name of the button property to press.',
        required: true,
      },
    ],
  },

  {
    name: 'GetTransitionKindList',
    description: 'Gets an array of all available transition kinds',
    group: ObsRequestTypeGroup.TRANSITION,
  },
  {
    name: 'GetSceneTransitionList',
    description: 'Gets an array of all scene transitions in OBS',
    group: ObsRequestTypeGroup.TRANSITION,
  },
  {
    name: 'GetCurrentSceneTransition',
    description: 'Gets information about the current scene transition',
    group: ObsRequestTypeGroup.TRANSITION,
  },
  {
    name: 'SetCurrentSceneTransition',
    description: 'Sets the current scene transition',
    group: ObsRequestTypeGroup.TRANSITION,
    params: [
      {
        name: 'transitionName',
        type: ObsParamType.STRING,
        description: 'Name of the transition to make active.',
        required: true,
      },
    ],
  },
  {
    name: 'SetCurrentSceneTransitionDuration',
    description: 'Sets the duration of the current scene transition',
    group: ObsRequestTypeGroup.TRANSITION,
    params: [
      {
        name: 'transitionDuration',
        type: ObsParamType.NUMBER,
        description: 'Duration in milliseconds',
        required: true,
      },
    ],
  },
  {
    name: 'SetCurrentSceneTransitionSettings',
    description: 'Sets the settings of the current scene transition',
    group: ObsRequestTypeGroup.TRANSITION,
    params: [
      {
        name: 'transitionSettings',
        type: ObsParamType.OBJECT,
        description: 'Settings object to apply to the transition. Can be {}',
        required: true,
      },
      {
        name: 'overlay',
        type: ObsParamType.BOOLEAN,
        description:
          'Whether to overlay over the current settings or replace them.',
        required: false,
      },
    ],
  },
  {
    name: 'GetCurrentSceneTransitionCursor',
    description: 'Gets the cursor position of the current scene transition',
    group: ObsRequestTypeGroup.TRANSITION,
  },
  {
    name: 'TriggerStudioModeTransition',
    description: 'Triggers the current scene transition',
    group: ObsRequestTypeGroup.TRANSITION,
  },
  {
    name: 'SetTBarPosition',
    description: 'Sets the position of the TBar',
    group: ObsRequestTypeGroup.TRANSITION,
    params: [
      {
        name: 'position',
        type: ObsParamType.NUMBER,
        description: 'New position.',
        required: true,
      },
      {
        name: 'release',
        type: ObsParamType.BOOLEAN,
        description:
          'Whether to release the TBar. Only set to false if you know that you will be sending another position update.',
        required: false,
      },
    ],
  },

  {
    name: 'GetSourceFilterList',
    description: 'Gets an array of all of a source filters',
    group: ObsRequestTypeGroup.FILTER,
    params: [
      {
        name: 'sourceName',
        type: ObsParamType.STRING,
        description: 'Name of the source.',
        required: true,
      },
    ],
  },
  {
    name: 'GetSourceFilterDefaultSettings',
    description: 'Gets the default settings for a filter',
    group: ObsRequestTypeGroup.FILTER,
    params: [
      {
        name: 'filterKind',
        type: ObsParamType.STRING,
        description: 'Filter kind to get the default settigns for.',
        required: true,
      },
    ],
  },
  {
    name: 'CreateSourceFilter',
    description: 'Creates a new filter, adding it to the specified source',
    group: ObsRequestTypeGroup.FILTER,
    params: [
      {
        name: 'sourceName',
        type: ObsParamType.STRING,
        description: 'Name of the source to add the filter to.',
        required: true,
      },
      {
        name: 'filterName',
        type: ObsParamType.STRING,
        description: 'Name of the new filter to be created.',
        required: true,
      },
      {
        name: 'filterKind',
        type: ObsParamType.STRING,
        description: 'The kind of filter to be created.',
        required: true,
      },
      {
        name: 'filterSettings',
        type: ObsParamType.OBJECT,
        description: 'Settings object to initialize the filter with.',
        required: false,
      },
    ],
  },
  {
    name: 'RemoveSourceFilter',
    description: 'Removes a filter from a source',
    group: ObsRequestTypeGroup.FILTER,
    params: [
      {
        name: 'sourceName',
        type: ObsParamType.STRING,
        description: 'Name of the source the filter is on.',
        required: true,
      },
      {
        name: 'filterName',
        type: ObsParamType.STRING,
        description: 'Name of the filter to remove.',
        required: true,
      },
    ],
  },
  {
    name: 'SetSourceFilterName',
    description: 'Sets the name of a source filter',
    group: ObsRequestTypeGroup.FILTER,
    params: [
      {
        name: 'sourceName',
        type: ObsParamType.STRING,
        description: 'Name of the source the filter is on.',
        required: true,
      },
      {
        name: 'filterName',
        type: ObsParamType.STRING,
        description: 'Current name of the filter.',
        required: true,
      },
      {
        name: 'newFilterName',
        type: ObsParamType.STRING,
        description: 'New name of the filter.',
        required: true,
      },
    ],
  },
  {
    name: 'GetSourceFilter',
    description: 'Gets the info for a specific source filter',
    group: ObsRequestTypeGroup.FILTER,
    params: [
      {
        name: 'sourceName',
        type: ObsParamType.STRING,
        description: 'Name of the source.',
        required: true,
      },
      {
        name: 'filterName',
        type: ObsParamType.STRING,
        description: 'Name of the filter.',
        required: true,
      },
    ],
  },
  {
    name: 'SetSourceFilterIndex',
    description: 'Sets the index position of a filter on a source',
    group: ObsRequestTypeGroup.FILTER,
    params: [
      {
        name: 'sourceName',
        type: ObsParamType.STRING,
        description: 'Name of the source the filter is on.',
        required: true,
      },
      {
        name: 'filterName',
        type: ObsParamType.STRING,
        description: 'Name of the filter.',
        required: true,
      },
      {
        name: 'filterIndex',
        type: ObsParamType.NUMBER,
        description: 'New index position of the filter.',
        required: true,
      },
    ],
  },
  {
    name: 'SetSourceFilterSettings',
    description: 'Sets the settings of a source filter',
    group: ObsRequestTypeGroup.FILTER,
    params: [
      {
        name: 'sourceName',
        type: ObsParamType.STRING,
        description: 'Name of the source the filter is on.',
        required: true,
      },
      {
        name: 'filterName',
        type: ObsParamType.STRING,
        description: 'Name of the filter to set the settings of.',
        required: true,
      },
      {
        name: 'filterSettings',
        type: ObsParamType.OBJECT,
        description: 'Object of settings to apply.',
        required: true,
      },
      {
        name: 'overlay',
        type: ObsParamType.BOOLEAN,
        description:
          'true = apply the settings on top of existing ones, false = reset the input to its default, then apply settings.',
        required: false,
      },
    ],
  },
  {
    name: 'SetSourceFilterEnabled',
    description: 'Sets the enable state of a source filter',
    group: ObsRequestTypeGroup.FILTER,
    params: [
      {
        name: 'sourceName',
        type: ObsParamType.STRING,
        description: 'Name of the source the filter is on.',
        required: true,
      },
      {
        name: 'filterName',
        type: ObsParamType.STRING,
        description: 'Name of the filter.',
        required: true,
      },
      {
        name: 'filterEnabled',
        type: ObsParamType.BOOLEAN,
        description: 'New enable state of the filter.',
        required: true,
      },
    ],
  },

  {
    name: 'GetSceneItemList',
    description: 'Gets a list of all scene items in a scene',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene to get the items of.',
        required: true,
      },
    ],
  },
  {
    name: 'GetGroupSceneItemList',
    description: 'Gets a list of all scene item groups in a scene',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the group to get the items of.',
        required: true,
      },
    ],
  },
  {
    name: 'GetSceneItemId',
    description: 'Searches a scene for a source, and returns its id',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene or group to search in.',
        required: true,
      },
      {
        name: 'sourceName',
        type: ObsParamType.STRING,
        description: 'Name of the source to find.',
        required: true,
      },
      {
        name: 'searchOffset',
        type: ObsParamType.NUMBER,
        description:
          'Number of matches to skip during search. >=0 means first forward, -1 means last (top) item.',
        required: false,
      },
    ],
  },
  {
    name: 'CreateSceneItem',
    description: 'Creates a new scene item using a source',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene to create the new item in.',
        required: true,
      },
      {
        name: 'sourceName',
        type: ObsParamType.STRING,
        description: 'Name of the source to add to the scene.',
        required: true,
      },
      {
        name: 'sceneItemEnabled',
        type: ObsParamType.BOOLEAN,
        description: 'Enable state to apply to the scene item on creation.',
        required: false,
      },
    ],
  },
  {
    name: 'RemoveSceneItem',
    description: 'Removes a scene item from a scene',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene the item is in.',
        required: true,
      },
      {
        name: 'sceneItemId',
        type: ObsParamType.NUMBER,
        description: 'Numeric ID of the scene item.',
        required: true,
      },
    ],
  },
  {
    name: 'DuplicateSceneItem',
    description: 'Duplicates a scene item, copying all transform and crop info',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene the item is in.',
        required: true,
      },
      {
        name: 'sceneItemId',
        type: ObsParamType.NUMBER,
        description: 'Numeric ID of the scene item.',
        required: true,
      },
      {
        name: 'destinationSceneName',
        type: ObsParamType.STRING,
        description:
          'Name of the scene to create the dupicated item in. (`sceneName` is assumed)',
        required: false,
      },
    ],
  },
  {
    name: 'GetSceneItemTransform',
    description: 'Gets the transform and crop info of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene the item is in.',
        required: true,
      },
      {
        name: 'sceneItemId',
        type: ObsParamType.NUMBER,
        description: 'Numeric ID of the scene item.',
        required: true,
      },
    ],
  },
  {
    name: 'SetSceneItemTransform',
    description: 'Sets the transform and crop info of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene the item is in.',
        required: true,
      },
      {
        name: 'sceneItemId',
        type: ObsParamType.NUMBER,
        description: 'Numeric ID of the scene item.',
        required: true,
      },
      {
        name: 'sceneItemTransform',
        type: ObsParamType.OBJECT,
        description: 'Object containing scene item transform info to update.',
        required: true,
      },
    ],
  },
  {
    name: 'GetSceneItemEnabled',
    description: 'Gets the enable state of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene the item is in.',
        required: true,
      },
      {
        name: 'sceneItemId',
        type: ObsParamType.NUMBER,
        description: 'Numeric ID of the scene item.',
        required: true,
      },
    ],
  },
  {
    name: 'SetSceneItemEnabled',
    description: 'Sets the enable state of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene the item is in.',
        required: true,
      },
      {
        name: 'sceneItemId',
        type: ObsParamType.NUMBER,
        description: 'Numeric ID of the scene item.',
        required: true,
      },
      {
        name: 'sceneItemEnabled',
        type: ObsParamType.BOOLEAN,
        description: 'New enable state of the scene item.',
        required: true,
      },
    ],
  },
  {
    name: 'GetSceneItemLocked',
    description: 'Gets the lock state of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene the item is in.',
        required: true,
      },
      {
        name: 'sceneItemId',
        type: ObsParamType.NUMBER,
        description: 'Numeric ID of the scene item.',
        required: true,
      },
    ],
  },
  {
    name: 'SetSceneItemLocked',
    description: 'Sets the lock state of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene the item is in.',
        required: true,
      },
      {
        name: 'sceneItemId',
        type: ObsParamType.NUMBER,
        description: 'Numeric ID of the scene item.',
        required: true,
      },
      {
        name: 'sceneItemLocked',
        type: ObsParamType.BOOLEAN,
        description: 'New lock state of the scene item.',
        required: true,
      },
    ],
  },
  {
    name: 'GetSceneItemIndex',
    description: 'Gets the index position of a scene item in a scene',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene the item is in.',
        required: true,
      },
      {
        name: 'sceneItemId',
        type: ObsParamType.NUMBER,
        description: 'Numeric ID of the scene item.',
        required: true,
      },
    ],
  },
  {
    name: 'SetSceneItemIndex',
    description: 'Sets the index position of a scene item in a scene',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene the item is in.',
        required: true,
      },
      {
        name: 'sceneItemId',
        type: ObsParamType.NUMBER,
        description: 'Numeric ID of the scene item.',
        required: true,
      },
      {
        name: 'sceneItemIndex',
        type: ObsParamType.NUMBER,
        description: 'New index position of the scene item.',
        required: true,
      },
    ],
  },
  {
    name: 'GetSceneItemBlendMode',
    description: 'Gets the blend mode of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene the item is in.',
        required: true,
      },
      {
        name: 'sceneItemId',
        type: ObsParamType.NUMBER,
        description: 'Numeric ID of the scene item.',
        required: true,
      },
    ],
  },
  {
    name: 'SetSceneItemBlendMode',
    description: 'Sets the blend mode of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
    params: [
      {
        name: 'sceneName',
        type: ObsParamType.STRING,
        description: 'Name of the scene the item is in.',
        required: true,
      },
      {
        name: 'sceneItemId',
        type: ObsParamType.NUMBER,
        description: 'Numeric ID of the scene item.',
        required: true,
      },
      {
        name: 'sceneItemBlendMode',
        type: ObsParamType.STRING,
        description: 'New blend mode.',
        required: true,
      },
    ],
  },

  {
    name: 'GetVirtualCamStatus',
    description: 'Gets the status of the virtualcam output',
    group: ObsRequestTypeGroup.OUTPUT,
  },
  {
    name: 'ToggleVirtualCam',
    description: 'Toggles the state of the virtualcam output',
    group: ObsRequestTypeGroup.OUTPUT,
  },
  {
    name: 'StartVirtualCam',
    description: 'Starts the virtualcam output',
    group: ObsRequestTypeGroup.OUTPUT,
  },
  {
    name: 'StopVirtualCam',
    description: 'Stops the virtualcam output',
    group: ObsRequestTypeGroup.OUTPUT,
  },
  {
    name: 'GetReplayBufferStatus',
    description: 'Gets the status of the replay buffer output',
    group: ObsRequestTypeGroup.OUTPUT,
  },
  {
    name: 'ToggleReplayBuffer',
    description: 'Toggles the state of the replay buffer output',
    group: ObsRequestTypeGroup.OUTPUT,
  },
  {
    name: 'StartReplayBuffer',
    description: 'Starts the replay buffer output',
    group: ObsRequestTypeGroup.OUTPUT,
  },
  {
    name: 'StopReplayBuffer',
    description: 'Stops the replay buffer output',
    group: ObsRequestTypeGroup.OUTPUT,
  },
  {
    name: 'SaveReplayBuffer',
    description: 'Saves the contents of the replay buffer output',
    group: ObsRequestTypeGroup.OUTPUT,
  },
  {
    name: 'GetLastReplayBufferReplay',
    description: 'Gets the filename of the last replay buffer save file',
    group: ObsRequestTypeGroup.OUTPUT,
  },
  // { name: 'GetOutputList', description: 'Gets the list of available outputs.', group: ObsRequestTypeGroup.OUTPUT },
  // { name: 'GetOutputStatus', description: 'Gets the status of an output', group: ObsRequestTypeGroup.OUTPUT, },
  // { name: 'ToggleOutput', description: '', group: ObsRequestTypeGroup.OUTPUT },
  // { name: 'StartOutput', description: '', group: ObsRequestTypeGroup.OUTPUT },
  // { name: 'StopOutput', description: '', group: ObsRequestTypeGroup.OUTPUT },
  // { name: 'GetOutputSettings', description: '', group: ObsRequestTypeGroup.OUTPUT },
  // { name: 'SetOutputSettings', description: '', group: ObsRequestTypeGroup.OUTPUT },

  {
    name: 'GetStreamStatus',
    description: 'Gets the status of the stream output',
    group: ObsRequestTypeGroup.STREAM,
  },
  {
    name: 'ToggleStream',
    description: 'Toggles the status of the stream output',
    group: ObsRequestTypeGroup.STREAM,
  },
  {
    name: 'StartStream',
    description: 'Starts the stream output',
    group: ObsRequestTypeGroup.STREAM,
  },
  {
    name: 'StopStream',
    description: 'Stops the stream output',
    group: ObsRequestTypeGroup.STREAM,
  },
  {
    name: 'SendStreamCaption',
    description: 'Sends CEA-608 caption text over the stream output',
    group: ObsRequestTypeGroup.STREAM,
    params: [
      {
        name: 'captionText',
        type: ObsParamType.STRING,
        description: 'Caption text.',
        required: true,
      },
    ],
  },

  {
    name: 'GetRecordStatus',
    description: 'Gets the status of the record output',
    group: ObsRequestTypeGroup.RECORD,
  },
  {
    name: 'ToggleRecord',
    description: 'Toggles the status of the record output',
    group: ObsRequestTypeGroup.RECORD,
  },
  {
    name: 'StartRecord',
    description: 'Starts the record output',
    group: ObsRequestTypeGroup.RECORD,
  },
  {
    name: 'StopRecord',
    description: 'Stops the record output',
    group: ObsRequestTypeGroup.RECORD,
  },
  {
    name: 'ToggleRecordPause',
    description: 'Toggles pause on the record output',
    group: ObsRequestTypeGroup.RECORD,
  },
  {
    name: 'PauseRecord',
    description: 'Pauses the record output',
    group: ObsRequestTypeGroup.RECORD,
  },
  {
    name: 'ResumeRecord',
    description: 'Resumes the record output',
    group: ObsRequestTypeGroup.RECORD,
  },

  {
    name: 'GetMediaInputStatus',
    description: 'Gets the status of a media input',
    group: ObsRequestTypeGroup.MEDIA,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the media input.',
        required: true,
      },
    ],
  },
  {
    name: 'SetMediaInputCursor',
    description: 'Sets the cursor position of a media input',
    group: ObsRequestTypeGroup.MEDIA,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the media input.',
        required: true,
      },
      {
        name: 'mediaCursor',
        type: ObsParamType.NUMBER,
        description: 'New cursor position to set.',
        required: true,
      },
    ],
  },
  {
    name: 'OffsetMediaInputCursor',
    description:
      'Offsets the current cursor position of a media input by the specified value',
    group: ObsRequestTypeGroup.MEDIA,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the media input.',
        required: true,
      },
      {
        name: 'mediaCursorOffset',
        type: ObsParamType.NUMBER,
        description: 'Value to offset the current cursor position by.',
        required: true,
      },
    ],
  },
  {
    name: 'TriggerMediaInputAction',
    description: 'Triggers an action on a media input',
    group: ObsRequestTypeGroup.MEDIA,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the media input.',
        required: true,
      },
      {
        name: 'mediaAction',
        type: ObsParamType.STRING,
        description: 'Identifier of the `ObsMediaInputAction` enum.',
        required: true,
      },
    ],
  },

  {
    name: 'GetStudioModeEnabled',
    description: 'Gets whether studio is enabled',
    group: ObsRequestTypeGroup.UI,
  },
  {
    name: 'SetStudioModeEnabled',
    description: 'Enables or disables studio mode',
    group: ObsRequestTypeGroup.UI,
    params: [
      {
        name: 'studioModeEnabled',
        type: ObsParamType.BOOLEAN,
        description: 'true = enabled, false = disabled.',
        required: true,
      },
    ],
  },
  {
    name: 'OpenInputPropertiesDialog',
    description: 'Opens the properties dialog of an input',
    group: ObsRequestTypeGroup.UI,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to open the dialog of.',
        required: true,
      },
    ],
  },
  {
    name: 'OpenInputFiltersDialog',
    description: 'Opens the filters dialog of an input',
    group: ObsRequestTypeGroup.UI,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to open the dialog of.',
        required: true,
      },
    ],
  },
  {
    name: 'OpenInputInteractDialog',
    description: 'Opens the interact dialog of an input',
    group: ObsRequestTypeGroup.UI,
    params: [
      {
        name: 'inputName',
        type: ObsParamType.STRING,
        description: 'Name of the input to open the dialog of.',
        required: true,
      },
    ],
  },
  {
    name: 'GetMonitorList',
    description: 'Gets a list of connected monitors and information about them',
    group: ObsRequestTypeGroup.UI,
  },
  // { name: 'OpenVideoMixProjector', description: '', group: ObsRequestTypeGroup.UI },
  // { name: 'OpenSourceProjector', description: '', group: ObsRequestTypeGroup.UI },

  //'GetRecordDirectory',
  //'GetSceneItemPrivateSettings',
  //'GetSourcePrivateSettings',
  //'SetSceneItemPrivateSettings',
  //'SetSourcePrivateSettings',
];

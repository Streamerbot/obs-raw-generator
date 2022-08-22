import type { OBSRequestTypes } from 'obs-websocket-js';

export enum ObsParamType {
  STRING = 'String',
  NUMBER = 'Number',
  BOOLEAN = 'Boolean'
}

export const obsParamTypeOptions = [
  { title: ObsParamType.STRING, value: ObsParamType.STRING },
  { title: ObsParamType.NUMBER, value: ObsParamType.NUMBER },
  { title: ObsParamType.BOOLEAN, value: ObsParamType.BOOLEAN },
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
  UI = 'UI'
}

export type ObsRequestParam = {
  name: string;
  type: ObsParamType;
  required?: boolean;
}

export type ObsRequestTypeOption = {
  name: keyof OBSRequestTypes;
  description: string;
  group: ObsRequestTypeGroup;
  params?: ObsRequestParam[]
}

export const obsRequestTypeOptions: ObsRequestTypeOption[] = [
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
    description: 'Broadcasts a CustomEvent to all WebSocket clients',
    group: ObsRequestTypeGroup.GENERAL,
  },
  {
    name: 'CallVendorRequest',
    description: 'Call a request registered to a vendor',
    group: ObsRequestTypeGroup.GENERAL,
  },
  {
    name: 'GetHotkeyList',
    description: 'Gets an array of all hotkey names in OBS',
    group: ObsRequestTypeGroup.GENERAL,
  },
  {
    name: 'TriggerHotkeyByName',
    description: 'Triggers a hotkey using its name',
    group: ObsRequestTypeGroup.GENERAL,
    params: [
      { name: 'hotkeyName', type: ObsParamType.STRING, required: true }
    ]
  },
  {
    name: 'TriggerHotkeyByKeySequence',
    description: 'Triggers a hotkey using a sequence of keys',
    group: ObsRequestTypeGroup.GENERAL,
  },
  { name: 'Sleep', 
    description: 'Sleeps for a time duration or number of frames', 
    group: ObsRequestTypeGroup.GENERAL 
  },
  {
    name: 'GetPersistentData',
    description: 'Gets the value of a "slot" from the selected persistent data realm',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'SetPersistentData',
    description: 'Sets the value of a "slot" from the selected persistent data realm',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'GetSceneCollectionList',
    description: 'Gets an array of all scene collections',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'SetCurrentSceneCollection',
    description: 'Switches to a scene collection',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'CreateSceneCollection',
    description: 'Creates a new scene collection, switching to it in the process',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'GetProfileList',
    description: 'Gets an array of all profiles',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'SetCurrentProfile',
    description: 'Switches to a profile',
    group: ObsRequestTypeGroup.CONFIG,
  },
  { name: 'CreateProfile', 
    description: 'Creates a new profile, switching to it in the process', 
    group: ObsRequestTypeGroup.CONFIG 
  },
  { name: 'RemoveProfile', 
    description: 'Removes a profile', 
    group: ObsRequestTypeGroup.CONFIG 
  },
  {
    name: 'GetProfileParameter',
    description: 'Gets a parameter from the current profile configuration',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'SetProfileParameter',
    description: 'Sets the value of a parameter in the current profile configuration',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'GetVideoSettings',
    description: 'Gets the current video settings',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'SetVideoSettings',
    description: 'Sets the current video settings',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'GetStreamServiceSettings',
    description: 'Gets the current stream service settings',
    group: ObsRequestTypeGroup.CONFIG,
  },
  {
    name: 'SetStreamServiceSettings',
    description: 'Sets the current stream service settings',
    group: ObsRequestTypeGroup.CONFIG,
  },

  {
    name: 'GetSourceActive',
    description: 'Gets the active and show state of a source',
    group: ObsRequestTypeGroup.SOURCE,
  },
  {
    name: 'GetSourceScreenshot',
    description: 'Gets a Base64-encoded screenshot of a source',
    group: ObsRequestTypeGroup.SOURCE,
  },
  {
    name: 'SaveSourceScreenshot',
    description: 'Saves a screenshot of a source to the filesystem',
    group: ObsRequestTypeGroup.SOURCE,
  },

  { 
    name: 'GetSceneList', 
    description: 'Gets an array of all scenes in OBS.', 
    group: ObsRequestTypeGroup.SCENE 
  },
  { 
    name: 'GetGroupList', 
    description: 'Gets an array of all groups in OBS', 
    group: ObsRequestTypeGroup.SCENE },
  {
    name: 'GetCurrentProgramScene',
    description: 'Gets the current program scene',
    group: ObsRequestTypeGroup.SCENE,
  },
  {
    name: 'SetCurrentProgramScene',
    description: 'Sets the current program scene',
    group: ObsRequestTypeGroup.SCENE,
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
  },
  { 
    name: 'CreateScene', 
    description: 'Creates a new scene in OBS', 
    group: ObsRequestTypeGroup.SCENE 
  },
  { 
    name: 'RemoveScene', 
    description: 'Removes a scene from OBS', 
    group: ObsRequestTypeGroup.SCENE 
  },
  { 
    name: 'SetSceneName', 
    description: 'Sets the name of a scene', 
    group: ObsRequestTypeGroup.SCENE 
  },
  {
    name: 'GetSceneSceneTransitionOverride',
    description: 'Gets the scene transition overridden for a scene',
    group: ObsRequestTypeGroup.SCENE,
  },
  {
    name: 'SetSceneSceneTransitionOverride',
    description: 'Sets the scene transition overridden for a scene',
    group: ObsRequestTypeGroup.SCENE,
  },

  { 
    name: 'GetInputList', 
    description: 'Gets an array of all inputs in OBS', 
    group: ObsRequestTypeGroup.INPUT 
  },
  {
    name: 'GetInputKindList',
    description: 'Gets an array of all available input kinds in OBS',
    group: ObsRequestTypeGroup.INPUT,
  },
  {
    name: 'GetSpecialInputs',
    description: 'Gets the names of all special inputs',
    group: ObsRequestTypeGroup.INPUT,
  },
  { 
    name: 'CreateInput', 
    description: 'Creates a new input, adding it as a scene item to the specified scene', 
    group: ObsRequestTypeGroup.INPUT 
  },
  { 
    name: 'RemoveInput', 
    description: 'Removes an existing input', 
    group: ObsRequestTypeGroup.INPUT 
  },
  { 
    name: 'SetInputName', 
    description: 'Sets the name of an input', 
    group: ObsRequestTypeGroup.INPUT 
  },
  {
    name: 'GetInputDefaultSettings',
    description: 'Gets the default settings for an input',
    group: ObsRequestTypeGroup.INPUT,
  },
  {
    name: 'GetInputSettings',
    description: 'Gets the settings of an input',
    group: ObsRequestTypeGroup.INPUT,
  },
  {
    name: 'SetInputSettings',
    description: 'Sets the settings of an input',
    group: ObsRequestTypeGroup.INPUT,
  },
  { 
    name: 'GetInputMute', 
    description: 'Gets the audio mute state of an input', 
    group: ObsRequestTypeGroup.INPUT 
  },
  { 
    name: 'SetInputMute', 
    description: 'Sets the audio mute state of an input', 
    group: ObsRequestTypeGroup.INPUT 
  },
  {
    name: 'ToggleInputMute',
    description: 'Toggles the audio mute state of an input',
    group: ObsRequestTypeGroup.INPUT,
  },
  { 
    name: 'GetInputVolume', 
    description: 'Gets the current volume setting of an input', 
    group: ObsRequestTypeGroup.INPUT 
  },
  { 
    name: 'SetInputVolume', 
    description: 'Sets the volume setting of an input', 
    group: ObsRequestTypeGroup.INPUT 
  },
  {
    name: 'GetInputAudioBalance',
    description: 'Gets the audio balance of an input',
    group: ObsRequestTypeGroup.INPUT,
  },
  {
    name: 'SetInputAudioBalance',
    description: 'Sets the audio balance of an input',
    group: ObsRequestTypeGroup.INPUT,
  },
  {
    name: 'GetInputAudioSyncOffset',
    description: '',
    group: ObsRequestTypeGroup.INPUT,
  },
  {
    name: 'SetInputAudioSyncOffset',
    description: '',
    group: ObsRequestTypeGroup.INPUT,
  },
  {
    name: 'GetInputAudioMonitorType',
    description: 'Gets the audio sync offset of an input',
    group: ObsRequestTypeGroup.INPUT,
  },
  {
    name: 'SetInputAudioMonitorType',
    description: 'Sets the audio monitor type of an input',
    group: ObsRequestTypeGroup.INPUT,
  },
  {
    name: 'GetInputAudioTracks',
    description: 'Gets the enable state of all audio tracks of an input',
    group: ObsRequestTypeGroup.INPUT,
  },
  {
    name: 'SetInputAudioTracks',
    description: 'Sets the enable state of audio tracks of an input',
    group: ObsRequestTypeGroup.INPUT,
  },
  {
    name: 'GetInputPropertiesListPropertyItems',
    description: 'Gets the items of a list property from an input properties',
    group: ObsRequestTypeGroup.INPUT,
  },
  {
    name: 'PressInputPropertiesButton',
    description: 'Presses a button in the properties of an input',
    group: ObsRequestTypeGroup.INPUT,
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
  },
  {
    name: 'SetCurrentSceneTransitionDuration',
    description: 'Sets the duration of the current scene transition',
    group: ObsRequestTypeGroup.TRANSITION,
  },
  {
    name: 'SetCurrentSceneTransitionSettings',
    description: 'Sets the settings of the current scene transition',
    group: ObsRequestTypeGroup.TRANSITION,
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
  },

  {
    name: 'GetSourceFilterList',
    description: 'Gets an array of all of a source filters',
    group: ObsRequestTypeGroup.FILTER,
  },
  {
    name: 'GetSourceFilterDefaultSettings',
    description: 'Gets the default settings for a filter',
    group: ObsRequestTypeGroup.FILTER,
  },
  {
    name: 'CreateSourceFilter',
    description: 'Creates a new filter, adding it to the specified source',
    group: ObsRequestTypeGroup.FILTER,
  },
  {
    name: 'RemoveSourceFilter',
    description: 'Removes a filter from a source',
    group: ObsRequestTypeGroup.FILTER,
  },
  {
    name: 'SetSourceFilterName',
    description: 'Sets the name of a source filter',
    group: ObsRequestTypeGroup.FILTER,
  },
  {
    name: 'GetSourceFilter',
    description: 'Gets the info for a specific source filter',
    group: ObsRequestTypeGroup.FILTER,
  },
  {
    name: 'SetSourceFilterIndex',
    description: 'Sets the index position of a filter on a source',
    group: ObsRequestTypeGroup.FILTER,
  },
  {
    name: 'SetSourceFilterSettings',
    description: 'Sets the settings of a source filter',
    group: ObsRequestTypeGroup.FILTER,
  },
  {
    name: 'SetSourceFilterEnabled',
    description: 'Sets the enable state of a source filter',
    group: ObsRequestTypeGroup.FILTER,
  },

  {
    name: 'GetSceneItemList',
    description: 'Gets a list of all scene items in a scene',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'GetGroupSceneItemList',
    description: 'Gets a list of all scene item groups in a scene',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'GetSceneItemId',
    description: 'Searches a scene for a source, and returns its id',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'CreateSceneItem',
    description: 'Creates a new scene item using a source',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'RemoveSceneItem',
    description: 'Removes a scene item from a scene',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'DuplicateSceneItem',
    description: 'Duplicates a scene item, copying all transform and crop info',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'GetSceneItemTransform',
    description: 'Gets the transform and crop info of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'SetSceneItemTransform',
    description: 'Sets the transform and crop info of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'GetSceneItemEnabled',
    description: 'Gets the enable state of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'SetSceneItemEnabled',
    description: 'Sets the enable state of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'GetSceneItemLocked',
    description: 'Gets the lock state of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'SetSceneItemLocked',
    description: 'Sets the lock state of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'GetSceneItemIndex',
    description: 'Gets the index position of a scene item in a scene',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'SetSceneItemIndex',
    description: 'Sets the index position of a scene item in a scene',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'GetSceneItemBlendMode',
    description: 'Gets the blend mode of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
  },
  {
    name: 'SetSceneItemBlendMode',
    description: 'Sets the blend mode of a scene item',
    group: ObsRequestTypeGroup.SCENE_ITEM,
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
  // { name: 'GetOutputList', description: '', group: ObsRequestTypeGroup.OUTPUT },
  // { name: 'GetOutputStatus', description: '', group: ObsRequestTypeGroup.OUTPUT },
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
    group: ObsRequestTypeGroup.STREAM 
  },
  { 
    name: 'StartStream', 
    description: 'Starts the stream output', 
    group: ObsRequestTypeGroup.STREAM 
  },
  { 
    name: 'StopStream', 
    description: 'Stops the stream output', 
    group: ObsRequestTypeGroup.STREAM 
  },
  {
    name: 'SendStreamCaption',
    description: 'Sends CEA-608 caption text over the stream output',
    group: ObsRequestTypeGroup.STREAM,
  },

  {
    name: 'GetRecordStatus',
    description: 'Gets the status of the record output',
    group: ObsRequestTypeGroup.RECORD,
  },
  { 
    name: 'ToggleRecord', 
    description: 'Toggles the status of the record output', 
    group: ObsRequestTypeGroup.RECORD 
  },
  { 
    name: 'StartRecord', 
    description: 'Starts the record output', 
    group: ObsRequestTypeGroup.RECORD 
  },
  { 
    name: 'StopRecord', 
    description: 'Stops the record output', 
    group: ObsRequestTypeGroup.RECORD 
  },
  {
    name: 'ToggleRecordPause',
    description: 'Toggles pause on the record output',
    group: ObsRequestTypeGroup.RECORD,
  },
  { 
    name: 'PauseRecord', 
    description: 'Pauses the record output', 
    group: ObsRequestTypeGroup.RECORD 
  },
  { 
    name: 'ResumeRecord', 
    description: 'Resumes the record output', 
    group: ObsRequestTypeGroup.RECORD 
  },

  {
    name: 'GetMediaInputStatus',
    description: 'Gets the status of a media input',
    group: ObsRequestTypeGroup.MEDIA,
  },
  {
    name: 'SetMediaInputCursor',
    description: 'Sets the cursor position of a media input',
    group: ObsRequestTypeGroup.MEDIA,
  },
  {
    name: 'OffsetMediaInputCursor',
    description: 'Offsets the current cursor position of a media input by the specified value',
    group: ObsRequestTypeGroup.MEDIA,
  },
  {
    name: 'TriggerMediaInputAction',
    description: 'Triggers an action on a media input',
    group: ObsRequestTypeGroup.MEDIA,
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
  },
  {
    name: 'OpenInputPropertiesDialog',
    description: 'Opens the properties dialog of an input',
    group: ObsRequestTypeGroup.UI,
  },
  {
    name: 'OpenInputFiltersDialog',
    description: 'Opens the filters dialog of an input',
    group: ObsRequestTypeGroup.UI,
  },
  {
    name: 'OpenInputInteractDialog',
    description: 'Opens the interact dialog of an input',
    group: ObsRequestTypeGroup.UI,
  },
  { 
    name: 'GetMonitorList', 
    description: 'Gets a list of connected monitors and information about them', 
    group: ObsRequestTypeGroup.UI 
  },
  // { name: 'OpenVideoMixProjector', description: '', group: ObsRequestTypeGroup.UI },
  // { name: 'OpenSourceProjector', description: '', group: ObsRequestTypeGroup.UI },

  //'GetRecordDirectory',
  //'GetSceneItemPrivateSettings',
  //'GetSourcePrivateSettings',
  //'SetSceneItemPrivateSettings',
  //'SetSourcePrivateSettings',
];
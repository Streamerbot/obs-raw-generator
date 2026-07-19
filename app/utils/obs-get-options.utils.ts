import type OBSWebSocket from 'obs-websocket-js';
import type { ObsRequestContext } from './obs.utils';

export const GET_SOURCE_FILTER_NAME_OPTIONS = async (obs: OBSWebSocket, ctx: ObsRequestContext) => {
  const sourceName = ctx?.params?.find((param) => param.name === 'sourceName')?.value;
  if (!sourceName) return [];

  const res = await obs.call('GetSourceFilterList', { sourceName });
  return res.filters.map((filter) => filter.filterName);
};

export const GET_SCENE_SOURCE_NAME_OPTIONS = async (obs: OBSWebSocket, ctx: ObsRequestContext) => {
  const sceneName = ctx?.params?.find((param) => param.name === 'sceneName')?.value;
  if (!sceneName) return [];

  const res = await obs.call('GetSceneItemList', { sceneName });
  return res.sceneItems.map((item) => item.sourceName);
};

export const GET_SCENE_ITEM_ID_OPTIONS = async (obs: OBSWebSocket, ctx: ObsRequestContext) => {
  const sceneName = ctx?.params?.find((param) => param.name === 'sceneName')?.value;
  if (!sceneName) return [];

  const sceneSources = (await GET_SCENE_SOURCE_NAME_OPTIONS(obs, ctx)) as string[];

  const sceneItemIdOptions = [];

  for (const sourceName of sceneSources) {
    const res = await obs.call('GetSceneItemId', {
      sceneName,
      sourceName,
    });
    sceneItemIdOptions.push({
      title: `${res.sceneItemId} (${sourceName})`,
      value: res.sceneItemId,
    });
  }

  return sceneItemIdOptions;
};

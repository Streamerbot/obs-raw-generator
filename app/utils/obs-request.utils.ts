export function formatRequest(
  formatType: RequestFormatType = RequestFormatType.STREAMERBOT_RAW,
  requestType: string = '',
  requestData = {},
) {
  switch (formatType) {
    case RequestFormatType.OBS:
      return {
        'request-type': requestType,
        ...requestData,
      };

    case RequestFormatType.STREAMERBOT_RAW_CPH:
      return `CPH.ObsSendRaw("${requestType}", """${JSON.stringify(requestData)}""", 0);`;

    case RequestFormatType.STREAMERBOT_RAW:
    default:
      return {
        requestType,
        requestData,
      };
  }
}

export function formatParam(param: ObsRequestParam & { value: any }) {
  if (param.type === ObsParamType.NUMBER) {
    return Number(param.value);
  } else if (param.type === ObsParamType.BOOLEAN) {
    return Boolean(param.value);
  } else if (param.type === ObsParamType.OBJECT) {
    if (param.params) {
      const nestedResp: Record<string, any> = {};
      param.params.forEach(
        (nestedParam) => (nestedResp[nestedParam.name] = formatParam(nestedParam)),
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

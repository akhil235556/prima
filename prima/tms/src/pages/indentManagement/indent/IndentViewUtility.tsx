import { isNullOrUndefined } from "util";
import { FreightType } from "../../../base/constant/ArrayList";
import {
  errorDestination,
  errorFreightType, errorLane,
  errorOrigin,
  noVehicleError,
  placementDateTimeError, vehicleTypeError,
  volumeError, weightError
} from "../../../base/constant/MessageUtils";
import { convertDateTimeServerFormat } from "../../../base/utility/DateUtils";
import {
  isNullValue,
  isNullValueOrZero
} from "../../../base/utility/StringUtils";


export function validateData(userParams: any, appDispatch: any) {
  if (isNullValue(userParams.freightType)) {
    return { freightType: errorFreightType };
  } else if (isNullValue(userParams.originLocationCode)) {
    return { originLocationError: errorOrigin };
  } else if (isNullValue(userParams.destinationLocationCode)) {
    return { destinationLocationError: errorDestination };
  } else if (userParams.lane === undefined) {
    return { lane: errorLane };
  } else if (
    userParams.freightType.value === FreightType.FTL &&
    userParams.vehicleType === undefined
  ) {
    return { vehicleType: vehicleTypeError };
  } else if (
    userParams.freightType.value === FreightType.FTL &&
    isNullValueOrZero(userParams.count)
  ) {
    return { count: noVehicleError };
  } else if (
    userParams.freightType.value === "PTL" &&
    isNullValueOrZero(userParams.volume)
  ) {
    return { volume: volumeError };
  } else if (
    userParams.freightType.value === "PTL" &&
    isNullValueOrZero(userParams.weight)
  ) {
    return { weight: weightError };
  } else if (isNullOrUndefined(userParams.placementDatetime)) {
    return { placementDatetime: placementDateTimeError }
  }
  // else if (isNullOrUndefined(userParams.appointmentDatetime)) {
  //   return {appointmentDatetime: appointmentDateTimeError}
  // }
  return true;
}

export function createIndentParams(userParams: any, sobData: any, sobPartners?: any) {

  var params: any = {
    laneCode: userParams.lane.value,
    laneDisplayName: userParams.lane.data.laneDisplayName,
    freightTypeCode: userParams.freightType.value,
    serviceabilityModeCode: userParams.serviceabilityMode.value,
    serviceabilityModeName: userParams.serviceabilityMode.label,
    placementDatetime: convertDateTimeServerFormat(
      userParams.placementDatetime
    ),
    sob: sobData
  };
  if (userParams.appointmentDatetime) {
    params.appointmentDatetime = convertDateTimeServerFormat(userParams.appointmentDatetime);
  }
  if (!isNullValue(userParams.remarks)) {
    params.remarks = userParams.remarks;
  }
  if (sobPartners) {
    params.sob.sobPartners = sobPartners
  }
  if (userParams.freightType.value === FreightType.FTL) {
    return {
      ...params,
      vehicleTypeName: userParams.vehicleType.label,
      vehicleTypeCode: userParams.vehicleType.value,
      count: Number(userParams.count),
    };
  } else {
    return {
      ...params,
      weight: userParams.weight,
      volume: userParams.volume,
    };
  }
}
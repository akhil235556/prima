import { FreightType } from '../../../base/constant/ArrayList';
import { errorDriverName, errorDriverNumber, errorFutureDateTimeError, errorVehicleNumber, vehicleExisterror } from '../../../base/constant/MessageUtils';
import { isDateGreater } from '../../../base/utility/DateUtils';
import { isNullValue, isValidMobileNumber } from '../../../base/utility/StringUtils';

export function validateGateInData(userParams: any, freightType: any) {
    if ((!isNullValue(userParams.vehicleRegistrationNumber) && isNullValue(userParams.vehicle))) {
        return { vehicleRegistrationNumber: vehicleExisterror };
    }
    if (!isNullValue(userParams.vehicle) || !isNullValue(userParams.primaryDriverName) || !isNullValue(userParams.primaryDriverNumber) || freightType === FreightType.FTL) {
        if ((isNullValue(userParams.vehicle)) || isNullValue(userParams.vehicleRegistrationNumber)) {
            return { vehicleRegistrationNumber: !isNullValue(userParams.vehicleRegistrationNumber) ? vehicleExisterror : errorVehicleNumber };
        } else if (isNullValue(userParams.primaryDriverName)) {
            return { primaryDriverName: errorDriverName };
        } else if (isNullValue(userParams.primaryDriverNumber) || !isValidMobileNumber(userParams.primaryDriverNumber)) {
            return { primaryDriverNumber: errorDriverNumber };
        }
    }
    if (freightType === FreightType.PTL && isNullValue(userParams.vehicle) && isNullValue(userParams.airwaybillNumber)) {
        return { airwaybillNumber: "Enter valid airwaybillNumber" };
    } else if (isNullValue(userParams.originGateInTime)) {
        return { originGateInTime: "Select valid gate in time" };
    } else if (userParams.originGateInTime && isDateGreater(userParams.originGateInTime, new Date())) {
        return { originGateInTime: errorFutureDateTimeError };
    }
    return true;
}

export function createPartnerParams(userParams: any, shipmentDetails: any, freightType: any) {
    let params: any = {
        freightOrderCode: userParams.freightOrderCode,
        airwaybillNumber: userParams.airwaybillNumber ? userParams.airwaybillNumber : "",
        vehicleRegistrationNumber: userParams.vehicle ? userParams.vehicle.label : "",
        vehicleCode: userParams.vehicle ? userParams.vehicle.value : "",
        primaryDriverNumber: userParams.primaryDriverNumber ? userParams.primaryDriverNumber : "",
        primaryDriverName: userParams.primaryDriverName ? userParams.primaryDriverName : "",
        primaryDriverCode: userParams.primaryDriverName ? userParams.primaryDriverName : "",
        freightShipmentCodes: shipmentDetails.map((element: any) => element.freightShipmentCode)
    }
    return params;
}

export function createShipmentParams(userParams: any, shipmentDetails: any) {
    return {
        freightOrderCode: userParams.freightOrderCode,
        freightShipmentCode: userParams.freightShipmentCode,
        originGateInTime: userParams.originGateInTime,
        freightShipmentCodes: shipmentDetails.map((element: any) => element.freightShipmentCode),
        airwaybillNumber: userParams.airwaybillNumber ? userParams.airwaybillNumber : "",
        vehicleRegistrationNumber: userParams.vehicle ? userParams.vehicle.label : "",
        vehicleCode: userParams.vehicle ? userParams.vehicle.value : "",
        primaryDriverNumber: userParams.primaryDriverNumber ? userParams.primaryDriverNumber : "",
        primaryDriverName: userParams.primaryDriverName ? userParams.primaryDriverName : "",
        primaryDriverCode: userParams.primaryDriverName ? userParams.primaryDriverName : "",
        meterReading: userParams.meterReading ? userParams.meterReading : "",
    }
}
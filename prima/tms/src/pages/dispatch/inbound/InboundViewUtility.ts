import { isNullValue, isValidMobileNumber } from '../../../base/utility/StringUtils';
import { errorVehicleNumber, errorDriverName, errorDriverNumber } from '../../../base/constant/MessageUtils';

export function validateGateInData(userParams: any) {
    if (isNullValue(userParams.vehicle)) {
        return { vehicleRegistrationNumber: errorVehicleNumber };
    } else if (isNullValue(userParams.primaryDriverName)) {
        return { primaryDriverName: errorDriverName };
    } else if (isNullValue(userParams.primaryDriverNumber) || !isValidMobileNumber(userParams.primaryDriverNumber)) {
        return { primaryDriverNumber: errorDriverNumber };
    } else if (isNullValue(userParams.originGateInTime)) {
        return { originGateInTime: "Select valid gate in time" };
    }
    return true;
}

export function createPartnerParams(userParams: any) {
    return {
        freightOrderCode: userParams.freightOrderCode,
        primaryDriverCode: userParams.primaryDriverName,
        primaryDriverName: userParams.primaryDriverName,
        primaryDriverNumber: userParams.primaryDriverNumber,
        vehicleRegistrationNumber: userParams.vehicle.label,
        vehicleCode: userParams.vehicle.value,
    }
}

export function createShipmentParams(userParams: any) {
    return {
        freightOrderCode: userParams.freightOrderCode,
        freightShipmentCode: userParams.freightShipmentCode,
        originGateInTime: userParams.originGateInTime,
    }
}
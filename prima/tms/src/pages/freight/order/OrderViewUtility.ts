import { serviceabilityModeTypeList } from '../../../base/constant/ArrayList';
import { errorDriverName, errorDriverNumber, errorVehicleNumber } from '../../../base/constant/MessageUtils';
import { isNullValue, isValidMobileNumber } from '../../../base/utility/StringUtils';

export function validateOrderData(userParams: any) {
    // if (isNullValue(userParams.partner)) {
    //     return { partner: errorTransporter };
    // } else
    if (isNullValue(userParams.vehicle)) {
        return { vehicleRegistrationNumber: errorVehicleNumber };
    } else if (isNullValue(userParams.primaryDriverName)) {
        return { primaryDriverName: errorDriverName };
    } else if (isNullValue(userParams.primaryDriverNumber) || !isValidMobileNumber(userParams.primaryDriverNumber)) {
        return { primaryDriverNumber: errorDriverNumber };
    }
    return true;
}

export function createConfirmPartnerParams(userParams: any) {
    return {
        freightOrderCode: userParams.freightOrderCode,
        primaryDriverCode: userParams.primaryDriverName,
        primaryDriverName: userParams.primaryDriverName,
        primaryDriverNumber: userParams.primaryDriverNumber,
        vehicleRegistrationNumber: userParams.vehicle.label,
        vehicleCode: userParams.vehicle.value,
    }
}

export function createAssignPartnerParams(userParams: any) {
    return {
        freightOrderCode: userParams.freightOrderCode,
        partnerId: userParams.partner.value,
    }
}

export function getMode(mode: any) {
    let result: any = serviceabilityModeTypeList.filter((item: any) => item.value === mode)
    return (result && result[0]) ? result[0].label : ""
}
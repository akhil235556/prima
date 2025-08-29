import { isNullValue, isNullValueOrZero, isValidEmailId, isValidMobileNumber, isValidPassword } from '../base/utility/StringUtils';
import { UserDetails } from '../redux/storeStates/UserStateInterface';

export const usersElementData: UserDetails = {
    email: "",
    phoneNumber: "",
    name: "",
    username: "",
}


export function validateUserData(userParams: any, appDispatch: any) {
    if (isNullValue(userParams.name)) {
        return {
            name: "enter valid name"
        }
    } else if (isNullValueOrZero(userParams.phoneNumber) || !isValidMobileNumber(userParams.phoneNumber)) {
        return {
            phoneNumber: "enter valid mobile number"
        }
    } else if (isNullValue(userParams.email) || !isValidEmailId(userParams.email)) {
        return {
            email: "enter valid email"
        }
    } else if (isNullValue(userParams.username)) {
        return {
            username: "enter valid userName"
        }
    } else if (isNullValue(userParams.password) || !isValidPassword(userParams.password)) {
        return {
            password: "Password must have 8 letters containing at least one lowercase letter,one uppercase letter,one digit,one special character"
        }
    }
    // else if (isEmptyArray(userParams.locations)) {
    //     return {
    //         locations: "select user locations"
    //     }
    // }

    // else if (isNullValue(userParams.roles)) {
    //     appDispatch(showAlert("Select user role"))
    //     return {}
    // }
    return true;
}

export function createUserParams(userParams: any) {
    let params: any = {
        name: userParams.name,
        phoneNumber: userParams.phoneNumber,
        email: userParams.email,
        username: userParams.username,
        password: userParams.password,
        // allowedLocations: JSON.stringify(userParams.locations.map((element: any) => (
        //     { locationName: element.data.locationName, locationCode: element.value, locationType: element.data.locationType })))
    };
    if (userParams.locations && userParams.locations.length > 0) {
        params.allowedLocations = JSON.stringify(userParams.locations.map((element: any) => (
            { locationName: element.data.locationName, locationCode: element.value, locationType: element.data.locationTypeName })))
    } else {
        params.allowedLocations = JSON.stringify([])
    }

    return params;
}

export function createUserRolesAndPermission(userParams: any, userId: string) {
    let params: any = {
        userId: userId,
    }
    if (userParams.permission && userParams.permission.length > 0) {
        params.permissionIds = userParams.permission.map((element: any) => element.value);
    }
    if (userParams.roles && userParams.roles.length > 0) {
        params.roleIds = userParams.roles.map((element: any) => element.value);
    }
    return params;
}

export function createLocationParams(userParams: any, userId: string) {
    let params: any = {
        userId: userId,
        locations: []
    }

    if (userParams.locations && userParams.locations.length > 0) {
        params.locations = userParams.locations.map((element: any) => (
            { locationName: element.data.locationName, locationCode: element.value, locationType: element.data.locationTypeName }))
    } else {
        params.locations = []
    }
    return params;
}

export function createGateParams(userParams: any, userId: string) {
    let params: any = {
        userId: userId,
        gateDetails: []
    }

    if (userParams.gates && userParams.gates.length > 0) {
        params.gateDetails = userParams.gates.map((element: any) => (
            { gateName: element.data.gateName, gateCode: element.data.gateCode, locationCode: element.data.locationCode }))
    } else {
        params.gateDetails = []
    }
    return params;
}

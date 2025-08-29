import { Add, Close } from '@material-ui/icons';
import React from 'react';
import { subLocationType } from '../../../base/constant/ArrayList';
import { operationTypeLocationLabel, operationTypeLocationPlaceholder } from '../../../base/constant/MessageUtils';
import { isNullValue, isNullValueOrZero } from '../../../base/utility/StringUtils';
import AutoComplete from '../../../component/widgets/AutoComplete';
import AutoSuggest from '../../../component/widgets/AutoSuggest';
import Button from '../../../component/widgets/button/Button';
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";


interface LocationRenderProps {
    element: any,
    error: any,
    userParams: any,
    setUserParams: Function,
    onAdd: Function,
    onRemove: Function,
    appDispatch: Function,
    index: any
}

const LocationRender = (props: LocationRenderProps) => {
    const { userParams, setUserParams, onAdd, onRemove, appDispatch, index, element } = props;
    const [destinationSuggestion, setDestinationSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    function getSuggestionList(text: string) {
        appDispatch(searchLocationList({ query: text })).then((response: any) => {
            if (response) {
                setDestinationSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
            }
        })
    };

    return (
        <div className="custom-form-row row align-items-center">
            <div className="form-group col-md-7">
                <AutoSuggest
                    label={"Tag Location"}
                    placeHolder={"Select Location"}
                    error={element.locationError}
                    value={element.locationName}
                    suggestions={destinationSuggestion}
                    handleSuggestionsFetchRequested={({ value }: any) => {
                        if (value.length > autosuggestSearchLength) {
                            getSuggestionList(value);
                        }
                    }}
                    onSelected={(element: OptionType) => {
                        const newLocationArr = [...userParams.locationArr];
                        const newLocationObj = { ...newLocationArr[index] };
                        newLocationObj.locationType = "";
                        newLocationObj.locationName = element.label;
                        newLocationObj.locationCode = element.value;
                        newLocationObj.locationError = "";
                        newLocationObj.locationData = element;
                        newLocationArr[index] = newLocationObj;
                        setUserParams({
                            ...userParams,
                            locationArr: newLocationArr
                        });
                    }}
                    onChange={(text: string) => {
                        const newLocationArr = [...userParams.locationArr];
                        const newLocationObj = { ...newLocationArr[index] };
                        newLocationObj.locationName = text;
                        newLocationObj.locationType = "";
                        newLocationObj.locationCode = undefined;
                        newLocationObj.locationData = undefined;
                        newLocationArr[index] = newLocationObj;
                        setUserParams({
                            ...userParams,
                            locationArr: newLocationArr
                        });
                    }}
                />
            </div>
            <div className="form-group col-md-4">
                <AutoComplete
                    label={operationTypeLocationLabel}
                    placeHolder={operationTypeLocationPlaceholder}
                    error={element.locationTypeError}
                    value={(element.locationType) || ""}
                    options={subLocationType}
                    onChange={(value: OptionType) => {
                        const newLocationArr = [...userParams.locationArr];
                        const newLocationObj = { ...newLocationArr[index] };
                        newLocationObj.locationType = value;
                        newLocationObj.locationTypeError = "";
                        newLocationArr[index] = newLocationObj;
                        setUserParams({
                            ...userParams,
                            locationArr: newLocationArr
                        });
                    }}
                />


            </div>
            <div className="form-group col-2 col-md-1 col-lg-1 creat-add-btn add-button-wrapp">
                {(userParams?.locationArr?.length > 1) && <Button
                    buttonStyle={"minus-btn mr-2"}
                    leftIcon={<Close />}
                    onClick={() => {
                        onRemove(index);
                    }}
                />}
                {(index === userParams?.locationArr?.length - 1) &&
                    <Button
                        buttonStyle={"add-btn"}
                        leftIcon={<Add />}
                        onClick={() => {
                            onAdd(index)
                        }}
                    />
                }
            </div>
        </div>

    )
}

function validateData(params: any): any {
    if (isNullValue(params.address)) {
        return {
            address: "Enter valid address"
        };
    }
    // else if (isNullValue(params.locationName)) {
    //     return {
    //         locationName: "Enter valid location name"
    //     };
    // }
    else if (isNullValueOrZero(params.gpsRadius)) {
        return {
            gpsRadius: "Enter valid GPS radius"
        };
    } else if (isNullValueOrZero(params.simRadius)) {
        return {
            simRadius: "Enter valid SIM radius"
        };
    }
    else if (isNullValueOrZero(params.latitude)) {
        return {
            latitude: "Enter valid latitude"
        };
    } else if (isNullValueOrZero(params.longitude)) {
        return {
            longitude: "Enter valid longitude"
        };
    } else if (isNullValue(params.locationType)) {
        return {
            locationType: "Select location type"
        };
    } else if (isNullValue(params.city)) {
        return {
            cityName: "Select city"
        };
    } else if (isNullValueOrZero(params.pincode)) {
        return {
            pincode: "Enter pincode"
        };
    } else if (isNullValue(params.stateName)) {
        return {
            stateName: "Enter valid state name"
        };
    } else if (!isNullValue(params.consigneeName) && isNullValue(params.consigneeCode)) {
        return {
            consigneeName: "Enter valid consignee name"
        };
    }
    if ((!isNullValue(params.locationArr[0].locationName)) ||
        !isNullValue(params.locationArr[0].locationType)) {
        let checkError = false;
        // let userError: any = {};

        const locationList = params.locationArr.map((element: any) => {
            if (!isNullValue(element.locationName) ||
                !isNullValue(element.locationType) ||
                !element.locationName ||
                !element.locationType
            ) {
                if (isNullValue(element.locationName) || isNullValue(element.locationData) || (element.locationName && !element.locationName.trim())) {
                    checkError = true;
                    element.locationError = "Enter Valid Sub Location";
                }
                if (isNullValue(element.locationType)) {
                    checkError = true;
                    element.locationTypeError = "Select Sub Location Type";
                }
            }
            return element;
        });

        const error = checkError && locationList.some(function (element: any) {
            return (!isNullValue(element.locationError) || !isNullValue(element.locationTypeError));
        });
        if (error) {
            return {
                ...params,
                error: true,
                userError: locationList,
            };
        }

        return true;

    }
    return true;
}


function createSubLocationParams(userParams: any) {
    let subLocationList: Array<any> = [];
    if ((!isNullValue(userParams.locationArr[0].locationName)) ||
        !isNullValue(userParams.locationArr[0].locationType)) {
        // eslint-disable-next-line
        userParams.locationArr.map((element: any) => {
            subLocationList.push({
                subLocationId: element.locationData.data.id,
                subLocationTag: element.locationType.value,
                subLocationName: element.locationName,
            })
        });
    }
    return subLocationList;
}


function createLocationParams(userParams: any) {
    let locationList: Array<any> = [];
    if ((!isNullValue(userParams.locationArr[0].locationName)) ||
        !isNullValue(userParams.locationArr[0].locationType)) {
        // eslint-disable-next-line
        userParams.locationArr.map((element: any) => {
            locationList.push({
                subLocationId: element.locationData.data.id,
                subLocationTag: element.locationType.value,
            })
        });
    }

    let params: any = {
        latitude: userParams.latitude,
        longitude: userParams.longitude,
        integrationId: userParams.integrationId,
        avgLoadingTime: userParams.avgLoadingTime,
        locationType: userParams.locationType.value.toString(),
        pincode: userParams.pincode,
        country: userParams.country,
        cityName: userParams.city.label,
        stateName: userParams.stateName,
        address: userParams.address,
        gpsRadius: userParams.gpsRadius,
        simRadius: userParams.simRadius,
        areaOffice: userParams.areaOffice,
        district: userParams.district,
        zone: userParams.zone,
        taluka: userParams.taluka,
    };
    if (userParams.locationName) {
        params.locationName = userParams.locationName;
    }
    if (locationList && locationList.length) {
        params.subLocation = locationList;
    }
    if (userParams.consigneeName && userParams.consigneeCode) {
        params.consigneeName = userParams.consigneeName;
        params.consigneeCode = userParams.consigneeCode;
    }
    return params;
}

function updateLocationParams(userParams: any) {
    let locationList: Array<any> = [];
    if ((!isNullValue(userParams.locationArr[0].locationName)) ||
        !isNullValue(userParams.locationArr[0].locationType)) {
        // eslint-disable-next-line
        userParams.locationArr.map((element: any) => {
            locationList.push(element.id ? {
                id: element.id,
                subLocationId: element.locationData.data.id,
                subLocationTag: element.locationType.value
            } : {
                subLocationId: element.locationData.data.id,
                subLocationTag: element.locationType.value
            })
        });
    }
    let params: any = {
        id: userParams.id,
        latitude: userParams.latitude,
        longitude: userParams.longitude,
        integrationId: userParams.integrationId,
        avgLoadingTime: userParams.avgLoadingTime,
        locationType: userParams.locationType.value,
        pincode: userParams.pincode,
        country: userParams.country,
        locationName: userParams.locationName,
        cityName: userParams.city.label,
        stateName: userParams.stateName,
        address: userParams.address,
        gpsRadius: userParams.gpsRadius,
        simRadius: userParams.simRadius,
        locationCode: userParams.locationCode,
        areaOffice: userParams.areaOffice,
        district: userParams.district,
        zone: userParams.zone,
        taluka: userParams.taluka,
    };
    if (locationList && locationList.length) {
        params.subLocation = locationList;
    }
    if (userParams.consigneeName && userParams.consigneeCode) {
        params.consigneeName = userParams.consigneeName;
        params.consigneeCode = userParams.consigneeCode;
    }
    return params;
}


export {
    LocationRender,
    validateData,
    createLocationParams,
    updateLocationParams,
    createSubLocationParams,
};


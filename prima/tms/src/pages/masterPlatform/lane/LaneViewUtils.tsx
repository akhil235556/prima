import { Add, Close } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { partnerLevel } from '../../../base/constant/ArrayList';
import { errorContribution, errorFreightType, errorLevel, errorTransporter, vehicleTypeError } from '../../../base/constant/MessageUtils';
import { convertDateToServerFromDate, convertDateToServerToDate } from '../../../base/utility/DateUtils';
import { isNullValue, isNullValueOrZero } from '../../../base/utility/StringUtils';
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import Button from '../../../component/widgets/button/Button';
import NumberEditText from "../../../component/widgets/NumberEditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { showAlert } from "../../../redux/actions/AppActions";
import { searchClientPartner } from '../../../serviceActions/PartnerServiceAction';

interface RenderPartnerProps {
    element: any,
    onAdd: any,
    onRemove: any,
    onSelectPartner: any,
    onChnageContribution: any,
    onSelectLevel: any,
    onChangePartner: any,
    onSelectFreightType?: any,
    freightTypeList?: any,
    isAddButton: boolean,
    partnerError: string | undefined,
    levelError: string | undefined,
    maxLength: any
    index: any
}
export function RenderPartner(props: RenderPartnerProps) {
    const appDispatch = useDispatch();
    const { element, onAdd, onRemove, onSelectPartner, onSelectLevel,
        onChangePartner, index, onChnageContribution, isAddButton, maxLength } = props;
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined);

    return (
        <div>

            <div className="custom-form-row row align-items-center">
                <div className="form-group col-md-4">
                    <AutoSuggest
                        label="Transporter"
                        // mandatory
                        error={element.partnerError}
                        placeHolder="Enter Transporter Name"
                        value={element.partnerName}
                        // isDisabled={element.editMode}
                        suggestions={partnerList}
                        onChange={(text: string) => {
                            onChangePartner(text, element.index);
                        }}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                appDispatch(searchClientPartner({ query: value })).then((response: any) => {
                                    response && setPartnerList(setAutoCompleteListWithData(response, "partnerName", "partnerCode"));
                                })
                            }
                        }}
                        onSelected={(partner: OptionType) => {
                            onSelectPartner(partner, element.index)
                        }}
                    />
                </div>
                <div className="col-md-7">
                    <div className="custom-form-row row align-items-center">
                        <div className="form-group col-md-6 pl-0">
                            <AutoComplete
                                label="Level"
                                // mandatory
                                // isDisabled={element.editMode}
                                placeHolder="Select Level"
                                error={element.levelError}
                                value={(element.level && element.level) || null}
                                options={partnerLevel}
                                onChange={(value: OptionType) => {
                                    onSelectLevel(value, element.index);
                                }}
                            />
                        </div>

                        <div className="form-group col-md-6 pl-0">
                            <NumberEditText
                                label="Contribution %"
                                placeholder="Contribution %"
                                value={element.allocationPercentage}
                                error={element.allocationPercentageError}
                                allowNegative={false}
                                decimalSeparator={false}
                                maxLength={3}
                                onChange={(text: string) => {
                                    onChnageContribution(text, element.index)
                                }}

                            />
                        </div>
                    </div>
                </div>

                {(isAddButton || (maxLength && maxLength > 1)) &&
                    <div className="form-group col-md-1 pl-0 m-md-0">
                        <Button
                            buttonStyle={(isAddButton && maxLength > index) ? "add-btn" : "minus-btn"}
                            onClick={() => {
                                (isAddButton && maxLength > index) ? onAdd(element) : onRemove(element);
                            }}
                            leftIcon={(isAddButton && maxLength > index) ? <Add /> : <Close />}
                        />
                    </div>
                }

                {/* {
                    <div className="form-group col-md-1 pl-0 m-md-0">
                        <Button
                            buttonStyle={(index === 1) ? "add-btn" : "minus-btn"}
                            onClick={() => {
                                (index === 1) ? onAdd(element) : onRemove(element);
                            }}
                            leftIcon={(index === 1) ? <Add /> : <Close />}
                        />
                    </div>
                } */}
            </div>
        </div>
    );

}

export function removePartner(partners: any, selected: any) {
    return partners && partners.filter((element: any) => element.index !== selected.index)
        .map((element: any, index: number) => ({
            ...element,
            index: index
        }));
}

export function validateData(userParams: any, appDispatch: any) {
    if (userParams.origin === undefined) {
        return { origin: "Enter valid origin " }
    } else if (userParams.destination === undefined) {
        return { destination: "Enter valid destination " }
    } else if (userParams.origin.data && userParams.origin.data.locationTypeName === "ADDRESS" &&
        userParams.destination.data && userParams.destination.data.locationTypeName === "ADDRESS") {
        return appDispatch(showAlert("At least one out of source and destination should be Node", "false"));
    }

    if (userParams.sobDetails && userParams.sobDetails.length) {
        let isError = false;
        let sobErrorInfo = userParams.sobDetails.map((sobInfo: any) => {
            if (!isNullValue(sobInfo.validityStartDatetime) || !isNullValue(sobInfo.validityEndDatetime)
                || !isNullValue(sobInfo.partnersList[0].partnerName) || !isNullValue(sobInfo.partnersList[0].level)
                || !isNullValue(sobInfo.partnersList[0].allocationPercentage)
                || !isNullValue(sobInfo.placementCutoffTime) || !isNullValue(sobInfo.freightType)
                || !isNullValue(sobInfo.vehicleType)
            ) {
                if (isNullValue(sobInfo.validityStartDatetime)) {
                    isError = true;
                    sobInfo.validityStartDatetimeError = "Enter valid start date time"
                }
                if (isNullValue(sobInfo.validityEndDatetime)) {
                    isError = true;
                    sobInfo.validityEndDatetimeError = "Enter valid end date time ";
                }
                if (isNullValueOrZero(sobInfo.placementCutoffTime)) {
                    isError = true;
                    sobInfo.placementCutoffTimeError = "Enter valid placement cut off ";
                }
                if (isNullValue(sobInfo.freightType)) {
                    isError = true;
                    sobInfo.freightTypeError = errorFreightType;
                }
                if (isNullValue(sobInfo.vehicleType)) {
                    isError = true;
                    sobInfo.vehicleTypeError = vehicleTypeError;
                }

                const partnersList = sobInfo.partnersList.map((element: any) => {
                    // if (!isNullValue(element.partnerName) || !isNullValue(element.level)
                    //     || !isNullValue(element.allocationPercentage)) {
                    if (isNullValue(element.partner)) {
                        isError = true;
                        element.partnerError = errorTransporter;
                    }
                    if (isNullValue(element.level)) {
                        isError = true;
                        element.levelError = errorLevel;
                    }
                    if (isNullValue(element.allocationPercentage)) {
                        isError = true;
                        element.allocationPercentageError = errorContribution;
                    }
                    // }
                    return element;
                });

                // set new chnages in partner list
                sobInfo.partnersList = partnersList;
            }
            return sobInfo;
        });
        if (isError) {
            return {
                error: true,
                ...userParams,
                sobDetails: sobErrorInfo,
            };
        }
    }
    return true;
}

export function createLaneParams(userParams: any) {
    let params: any = {
        integrationId: userParams.integrationId,
        origin: {
            name: userParams.origin.label,
            code: userParams.origin.value,
            latitude: userParams.origin.data.latitude,
            longitude: userParams.origin.data.longitude
        },
        destination: {
            name: userParams.destination.label,
            code: userParams.destination.value,
            latitude: userParams.destination.data.latitude,
            longitude: userParams.destination.data.longitude
        },
        // tat: userParams.tat,
        // laneType: userParams.laneType.value
    }
    if (userParams.waypoints) {
        params.waypoints = JSON.stringify(userParams.waypoints.map((element: any) => ({
            name: element.label,
            code: element.value,
            latitude: element.data.latitude,
            longitude: element.data.longitude

        })));
    }
    return params;
}

export function updateLaneParams(userParams: any) {
    let params: any = {
        tat: userParams.tat,
        laneCode: userParams.laneCode
    }
    return params;
}

export function lanePartnerParam(userParams: any, laneCode: string, isUpdate?: boolean) {
    let sobParams: Array<any> = [];

    // eslint-disable-next-line
    userParams.sobDetails && userParams.sobDetails.map((sob: any) => {
        let partnerList: Array<any> = [];
        // eslint-disable-next-line
        sob.partnersList.map((element: any) => {
            if (!isNullValue(element.partner) && !isNullValue(element.level)) {
                partnerList.push({
                    partnerCode: element.partner.value,
                    level: element.level.label,
                    allocationPercentage: element.allocationPercentage,
                    freightTypeCode: sob.freightType.label
                })
            }
        });

        // eslint-disable-next-line
        sobParams.push({
            laneCode: laneCode,
            placementCutoffTime: sob.placementCutoffTime,
            vehicleTypeCode: sob.vehicleType && sob.vehicleType.value,
            vehicleTypeName: sob.vehicleType && sob.vehicleType.label,
            validityStartDatetime: convertDateToServerFromDate(sob.validityStartDatetime),
            validityEndDatetime: convertDateToServerToDate(sob.validityEndDatetime),
            // partner: (partnerList && partnerList.length > 0) ? partnerList : undefined,
            sobPartners: (partnerList && partnerList.length > 0) ? partnerList : undefined,
        });
    })

    if (isUpdate) {
        return {
            multipleSobDetails: sobParams,
            laneCode: laneCode
        }
    }
    return {
        multipleSobDetails: sobParams
    }


}

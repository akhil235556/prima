import { ArrowRightAlt, ClearAll } from "@material-ui/icons";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { isNullOrUndefined } from "util";
import { tatOptions } from "../../base/constant/ArrayList";
import { tatLabelWithoutUnit, tatPlaceholder } from "../../base/constant/MessageUtils";
import { isNullValue, isNullValueOrZero, isObjectEmpty, tatValueConverter } from "../../base/utility/StringUtils";
import { VehicleNumberDisplayOption } from "../../component/CommonView";
import AutoComplete from "../../component/widgets/AutoComplete";
import AutoSuggest from '../../component/widgets/AutoSuggest';
import EditText from "../../component/widgets/EditText";
import MultiSelect from '../../component/widgets/MultiSelect';
import NumberEditText from "../../component/widgets/NumberEditText";
import { OptionType } from '../../component/widgets/widgetsInterfaces';
import ModalContainer from "../../modals/ModalContainer";
import { autosuggestSearchLength } from "../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from '../../moduleUtility/DataUtils';
import { showAlert } from '../../redux/actions/AppActions';
import { getAllLocation, getLocationData, searchLocationList } from '../../serviceActions/LocationServiceActions';
import { createTrip } from '../../serviceActions/TrackingServiceActions';
import { searchVehicleList } from "../../serviceActions/VehicleServiceActions";

interface CreateTripModalProps {
    open: boolean
    onClose: any
    selectedElement: any
    onSuccess: any
}

function CreateTripModal(props: CreateTripModalProps) {

    const { open, onClose, onSuccess } = props;
    const appDispatch = useDispatch();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<any>({});
    const [autoSelected, setAutoSelected] = React.useState<boolean>(false);
    const [userParams, setUserParams] = React.useState<any>({});
    const [originSuggestion, setOriginSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [vehicleSuggestion, setVehicleSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [destinationSuggestion, setDestinationSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [laneDetails, setLaneDetails] = React.useState<any>({});
    const [tatValue, setTatValue] = React.useState<any>(tatOptions[0]);
    const locationList = useSelector((state: any) => state.appReducer.locationList, shallowEqual);

    useEffect(() => {
        const getAllLocationList = async () => {
            appDispatch(getAllLocation());
        };
        open && getAllLocationList();
    }, [appDispatch, open])

    return (
        <ModalContainer
            title={"Create Vehicle Trip"}
            primaryButtonTitle={"Create"}
            secondaryButtonTitle={"Clear"}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            secondaryButtonDisable={loading}
            open={open}
            loading={loading}
            onClose={() => {
                setAutoSelected(false);
                setLaneDetails({});
                setUserParams({});
                setError({});
                onClose();
            }}
            onApply={() => {

                if (validateData()) {
                    setLoading(true);
                    if (!isObjectEmpty(laneDetails) && laneDetails.laneName) {
                        var locationArray: any = [];
                        locationArray.push(userParams.origin.code);
                        // eslint-disable-next-line
                        userParams.waypoints && userParams.waypoints.map((item: any) => {
                            locationArray.push(item.value)
                        })
                        locationArray.push(userParams.destination.code);
                        let params: any = {
                            locationCode: locationArray
                        }
                        appDispatch(getLocationData(params)).then((response: any) => {
                            var locations = response
                            let params = {
                                driverName: userParams.driverName,
                                driverNumber: userParams.driverNumber,
                                laneCode: laneDetails.laneCode,
                                tat: tatValueConverter(tatValue.value, userParams.tat),
                                vehicleTypeCode: userParams.vehicle && userParams.vehicle.value,
                                vehicleNumber: userParams.vehicle && userParams.vehicle.data && userParams.vehicle.data.vehicleNumber,
                                vehicleCode: userParams.vehicle && userParams.vehicle.data && userParams.vehicle.data.vehicleCode,
                                tripTracking: {
                                    deviceType: userParams.vehicle && userParams.vehicle.data && userParams.vehicle.data.trackingAsset && userParams.vehicle.data.trackingAsset.deviceType,
                                    integrationVendor: userParams.vehicle && userParams.vehicle.data && userParams.vehicle.data.trackingAsset && userParams.vehicle.data.trackingAsset.trackingVendor,
                                },
                                locations: locations,
                            }
                            appDispatch(createTrip(params)).then((response: any) => {
                                setLoading(false);
                                if (response) {
                                    response.message && appDispatch(showAlert(response.message));
                                    setUserParams({});
                                    setLaneDetails({});
                                    setAutoSelected(false);
                                    onSuccess();
                                }
                                setError({});
                            })
                        })
                    } else {
                        var locations: any[] = [];
                        if (userParams.waypoints) {
                            locations = userParams.waypoints.map((item: any) => {
                                return item.data;
                            })
                        }
                        userParams.origin && locations.unshift(userParams.origin.data);
                        userParams.destination && locations.push(userParams.destination.data);
                        let params = {
                            driverName: userParams.driverName,
                            driverNumber: userParams.driverNumber,
                            tat: tatValueConverter(tatValue.value, userParams.tat),
                            vehicleTypeCode: userParams.vehicle && userParams.vehicle.value,
                            vehicleNumber: userParams.vehicle && userParams.vehicle.data && userParams.vehicle.data.vehicleNumber,
                            vehicleCode: userParams.vehicle && userParams.vehicle.data && userParams.vehicle.data.vehicleCode,
                            tripTracking: {
                                deviceType: userParams.vehicle && userParams.vehicle.data && userParams.vehicle.data.trackingAsset && userParams.vehicle.data.trackingAsset.deviceType,
                                integrationVendor: userParams.vehicle && userParams.vehicle.data && userParams.vehicle.data.trackingAsset && userParams.vehicle.data.trackingAsset.trackingVendor,
                            },
                            locations: locations,
                        }
                        appDispatch(createTrip(params)).then((response: any) => {
                            setLoading(false);
                            if (response) {
                                response.message && appDispatch(showAlert(response.message));
                                setUserParams({});
                                setLaneDetails({});
                                setAutoSelected(false);
                                onSuccess();
                            }
                            setError({});
                        })
                    }

                }
                // appDispatch(hideLoader());

            }}
            onClear={() => {
                setLaneDetails({});
                setUserParams({});
                setError({});
                setAutoSelected(false);
            }}
        >
            <div className="custom-form-row row">
                <div className="form-group col-md-6">
                    <AutoSuggest
                        label="Origin"
                        mandatory
                        placeHolder="Enter Origin Name"
                        isDisabled={autoSelected}
                        error={error.originName}
                        value={userParams && userParams.originName}
                        suggestions={originSuggestion}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getSuggestionList(value, "origin");
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setUserParams({
                                ...userParams,
                                originName: element.label,
                                origin: element,
                            });
                            setError({});
                        }}
                        onChange={(text: string) => {
                            !autoSelected && setLaneDetails({})
                            setUserParams({
                                ...userParams,
                                origin: undefined,
                                originName: text
                            });
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <AutoSuggest
                        label="Destination"
                        mandatory
                        placeHolder="Enter Destination Name"
                        isDisabled={autoSelected}
                        error={error.destinationName}
                        value={userParams && userParams.destinationName}
                        suggestions={destinationSuggestion}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getSuggestionList(value, "destination");
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                destinationName: element.label,
                                destination: element,
                            });
                        }}
                        onChange={(text: string) => {
                            !autoSelected && setLaneDetails({})
                            setUserParams({
                                ...userParams,
                                destinationName: text,
                                destination: undefined,
                            });
                            setError({});
                        }}
                    />
                </div>

                <div className="form-group col-md-6">
                    <AutoSuggest
                        label="Vehicle Number"
                        mandatory
                        placeHolder="Enter Vehicle Number"
                        // isDisabled={autoSelected}
                        error={error.vehicleNumber}
                        value={userParams && userParams.vehicleNumber}
                        suggestions={vehicleSuggestion}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getVehicleList(value);
                            }
                        }}
                        renderOption={(optionProps: any) => <VehicleNumberDisplayOption optionProps={optionProps} />}
                        onSelected={(element: OptionType) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                vehicleNumber: element.label,
                                vehicle: element,
                            });
                        }}
                        onChange={(text: string) => {
                            setUserParams({
                                ...userParams,
                                vehicleNumber: text,
                                vehicle: undefined,
                            });
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <EditText
                        label={"Driver Name"}
                        mandatory
                        placeholder={"Enter Driver Name"}
                        maxLength={30}
                        error={error.driverName}
                        value={userParams && userParams.driverName}
                        onChange={(text: any) => {
                            setUserParams({
                                ...userParams,
                                driverName: text
                            });
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        label={"Driver Number"}
                        mandatory
                        placeholder={"Enter Driver Number"}
                        maxLength={10}
                        allowNegative={false}
                        required
                        decimalSeparator={false}
                        error={error.driverNumber}
                        type='number'
                        value={userParams && userParams.driverNumber}
                        onChange={(text: any) => {
                            setUserParams({
                                ...userParams,
                                driverNumber: text
                            });
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group col-md-3 col-6">
                    <AutoComplete
                        label={tatLabelWithoutUnit}
                        mandatory
                        placeHolder={tatPlaceholder}
                        value={tatValue}
                        error={error.vehicleType}
                        options={tatOptions}
                        onChange={(element: OptionType) => {
                            setTatValue(element);
                            setUserParams({
                                ...userParams,
                                tat: ""
                            })
                            setError({});
                        }}
                    />
                </div>
                <div className="tatTrip form-group col-md-3 col-6">
                    <NumberEditText
                        label={""}
                        placeholder={tatPlaceholder}
                        value={userParams.tat}
                        allowNegative={false}
                        required
                        maxLength={5}
                        error={error.tat}
                        onChange={(text: any) => {
                            setUserParams({
                                ...userParams,
                                tat: Number(text)
                            })
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group col-md-12">
                    <MultiSelect
                        label="WayPoint"
                        placeHolder="Select WayPoint"
                        isDisabled={autoSelected}
                        error={error.waypoints}
                        value={(userParams && userParams.waypoints) || null}
                        options={locationList && setAutoCompleteListWithData(locationList, "locationName", "locationCode")}
                        onChange={(value: any) => {
                            !autoSelected && setLaneDetails({})
                            setError({});
                            setUserParams({
                                ...userParams,
                                waypoints: value
                            });
                        }}
                    />
                </div>

            </div>
        </ModalContainer>
    );

    function getSuggestionList(text: string, type: string) {
        appDispatch(searchLocationList({ query: text })).then((response: any) => {
            if (response) {
                switch (type) {
                    case "origin":
                        setOriginSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
                        break;
                    case "destination":
                        setDestinationSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
                        break;
                }

            }
        })
    }

    function getVehicleList(text: string) {
        appDispatch(searchVehicleList({ query: text })).then((response: any) => {
            if (response) {
                setVehicleSuggestion(setAutoCompleteListWithData(response.vehicles, "vehicleNumber", "vehicleTypeCode"))
            }
        });
    }


    function validateData() {
        if (isNullValue(userParams.originName) || isNullOrUndefined(userParams.origin)) {
            setError({
                originName: "Enter valid Origin"
            });
            return false;
        } else if (isNullValue(userParams.destinationName) || isNullOrUndefined(userParams.destination)) {
            setError({
                destinationName: "Enter valid Destination"
            });
            return false;
        } else if (isNullValue(userParams.vehicleNumber) || isNullOrUndefined(userParams.vehicle)) {
            setError({
                vehicleNumber: "Enter valid Vehicle Number"
            });
            return false;
        } else if (isNullValue(userParams.driverName)) {
            setError({
                driverName: "Enter Driver Name"
            });
            return false;
        } else if (isNullValueOrZero(userParams.driverNumber)) {
            setError({
                driverNumber: "Enter Driver Number"
            });
            return false;
        } else if (isNullValueOrZero(userParams.tat)) {
            setError({
                tat: "Enter TAT"
            });
            return false;
        }
        return true;

    }

}

export default CreateTripModal;

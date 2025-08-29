import { ClearAll, Room } from "@material-ui/icons";
import React from "react";
import { useDispatch } from 'react-redux';
import {
    locationAddressLabel, locationAddressPlaceHolder, locationLatitudeLabel, locationLatitudePlaceHolder,
    locationLongitudePlaceHolder, locationLongitudesLabel
} from "../../base/constant/MessageUtils";
import { isNullValue, isNullValueOrZero } from "../../base/utility/StringUtils";
import { LocationSearchInput } from "../../component/widgets/googleAddressSearch/LocationSearchInput";
import NumberEditText from "../../component/widgets/NumberEditText";
import ModalContainer from "../../modals/ModalContainer";
import { showAlert } from '../../redux/actions/AppActions';
import { pushLocation } from '../../serviceActions/TrackingServiceActions';

interface GrabLocationModalProps {
    open: boolean
    onClose: any
    selectedElement: any
    onSuccess: any
}

function GrabLocationModal(props: GrabLocationModalProps) {

    const { open, onClose, onSuccess, selectedElement } = props;
    const appDispatch = useDispatch();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<any>({});
    const [userParams, setUserParams] = React.useState<any>({});
    const [params, setParams] = React.useState<any>({});

    // useEffect(() => {
    //     const getCityListData = async () => {
    //         setLoading(true);
    //         appDispatch(getVehicleCurrentLocation(selectedElement.vehicleCode)).then(() => { setLoading(false); });
    //     }
    //     open && getCityListData();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [open])

    return (
        <ModalContainer
            title={"Grab Location"}
            primaryButtonTitle={"Submit"}
            secondaryButtonTitle={"Clear"}
            primaryButtonLeftIcon={<Room />}
            secondaryButtonLeftIcon={<ClearAll />}
            secondaryButtonDisable={loading}
            open={open}
            loading={loading}
            onClose={() => {
                clearData();
                onClose();
            }}
            onApply={() => {

                if (validateData()) {
                    setLoading(true);
                    let apiParams: any = {
                        currentLocation: {
                            address: params.address,
                            latitude: params.latitude,
                            longitude: params.longitude,
                        },
                        vehicleNumber: selectedElement.vehicleNumber,
                        vehicleCode: selectedElement.vehicleCode,
                        tripCode: selectedElement.tripCode,
                    }
                    if (params.speed) {
                        apiParams.speed = params.speed;
                    }
                    appDispatch(pushLocation(apiParams)).then((response: any) => {
                        setLoading(false);
                        if (response) {
                            response.message && appDispatch(showAlert(response.message));
                            clearData();
                            onSuccess();
                        }
                        setError({});
                    })

                }
            }}
            onClear={() => {
                clearData();
            }}
        >
            <div className="custom-form-row row">
                <div className="form-group col-md-12">
                    <LocationSearchInput
                        label={locationAddressLabel}
                        placeHolder={locationAddressPlaceHolder}
                        value={(userParams && userParams.address) || ""}
                        error={error.address}
                        mandatory
                        setSuggestion={(placeInfo: any) => {
                            // let stateName: string = "";
                            // if (placeInfo && placeInfo.terms && placeInfo.terms.length > 0) {
                            //     let count = placeInfo.terms.length;
                            //     // country = (count - 1) >= 0 ? placeInfo.terms[count - 1].value : "";
                            //     stateName = (count - 2) >= 0 ? placeInfo.terms[count - 2].value : "";
                            // }
                            // setParams({
                            //     ...params,
                            //     stateName: stateName,
                            //     // country: country,
                            // });
                        }}
                        handleChange={(value: any) => {
                            setUserParams({
                                ...userParams,
                                address: value
                            });
                            setParams({
                                ...params,
                                address: "",
                                longitude: 0,
                                latitude: 0,
                            });
                        }}
                        getLocationLatLong={(latLong: any, address: string) => {
                            setParams((prevState: any) => ({
                                ...prevState,
                                address: address,
                                longitude: latLong.lng,
                                latitude: latLong.lat,
                            }));
                            setUserParams({
                                ...userParams,
                                address: address,
                            });
                        }}
                    />

                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        mandatory
                        label={locationLatitudeLabel}
                        placeholder={locationLatitudePlaceHolder}
                        maxLength={25}
                        value={params.latitude}
                        error={error.latitude}
                        onChange={(text: any) => {
                            setParams({
                                ...params,
                                latitude: text ? Number(text) : "",
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        mandatory
                        label={locationLongitudesLabel}
                        placeholder={locationLongitudePlaceHolder}
                        maxLength={25}
                        value={params.longitude}
                        error={error.longitude}
                        onChange={(text: any) => {
                            setParams({
                                ...params,
                                longitude: text ? Number(text) : "",
                            })
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        label="Speed"
                        placeholder="Enter Speed"
                        value={params.speed}
                        error={error.speed}
                        maxLength={3}
                        decimalSeparator={false}
                        onChange={(text: any) => {
                            setParams({
                                ...params,
                                speed: text
                            })
                        }}
                    />
                </div>

            </div>
        </ModalContainer>
    );

    function validateData() {
        if (isNullValue(params.address)) {
            setError({
                address: "Enter valid address"
            });
            return false;
        } else if (isNullValueOrZero(params.latitude)) {
            setError({
                latitude: "Enter valid latitude"
            });
            return false;
        } else if (isNullValueOrZero(params.longitude)) {
            setError({
                longitude: "Enter valid longitude"
            });
            return false;
        }
        // if (isNullValueOrZero(params.speed)) {
        //     setError({
        //         speed: "Enter valid speed"
        //     });
        //     return false;
        // }
        return true;

    }

    function clearData() {
        setParams({});
        setUserParams({});
        setError({});
    }

}

export default GrabLocationModal;

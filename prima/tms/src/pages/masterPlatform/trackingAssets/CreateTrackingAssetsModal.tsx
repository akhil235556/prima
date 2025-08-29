import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import ModalContainer from "../../../modals/ModalContainer";
import AutoComplete from "../../../component/widgets/AutoComplete";
import EditText from "../../../component/widgets/EditText";
import { isObjectEmpty, isNullValue } from "../../../base/utility/StringUtils";
import { trackingAssetsElementData } from "../../../moduleUtility/TrackingAssetsUtility";
import { showAlert } from '../../../redux/actions/AppActions';
import { deviceData, trackingVendorData, getTemplateData } from '../../../serviceActions/AppServiceActions';
import { getStringAutoCompleteData } from "../../../moduleUtility/DataUtils";
import { createTrackingAsset } from '../../../serviceActions/TrackingAssetsServiceActions';
import { IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff, ArrowRightAlt, ClearAll } from "@material-ui/icons";

interface CreateTrackingAssetsModalProps {
    open: boolean
    onClose: any
    selectedElement: any
    onSuccess: any
}

function CreateTrackingAssetsModal(props: CreateTrackingAssetsModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, selectedElement, onSuccess } = props;
    let editMode = !isObjectEmpty(selectedElement);
    const [params, setParams] = React.useState<any>(trackingAssetsElementData);
    const [userParams, setUserParams] = React.useState<any>({});
    const [templateResponse, setTemplateResponse] = React.useState<any>();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);

    const deviceDataList = useSelector((state: any) =>
        state.appReducer.deviceDataList, shallowEqual
    );
    const deviceDataListObject = deviceDataList && getStringAutoCompleteData(deviceDataList.deviceTypes);

    const TrackingVendorList = useSelector((state: any) =>
        state.appReducer.trackingVendorList, shallowEqual
    );
    const trackingVendorListObject = TrackingVendorList && getStringAutoCompleteData(TrackingVendorList.trackingVendors);

    useEffect(() => {

        const getDeviceData = async () => {
            setLoading(true);
            var promise = [appDispatch(deviceData())];
            if (editMode && selectedElement) {
                setParams(selectedElement);
                setUserParams({
                    deviceType: {
                        label: selectedElement.deviceType,
                        value: selectedElement.deviceType
                    },
                    trackingVendor: {
                        label: selectedElement.trackingVendor,
                        value: selectedElement.trackingVendor
                    }
                });

                let queryParams: any = {
                    trackingVendor: selectedElement.trackingVendor
                }
                promise.push(appDispatch(getTemplateData(queryParams)));

            }
            Promise.all(promise).then((response: any) => {
                if (response && response.length > 1)
                    response[1] && setTemplateResponse(response[1]);
                setLoading(false);
            });
        }
        open && getDeviceData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, selectedElement]);

    return (
        <ModalContainer
            title={editMode ? "Tracking Assets Details" : "Create Tracking Assets"}
            primaryButtonTitle={editMode ? ((selectedElement.deviceType !== "SIM") ? "Update" : "") : "Create"}
            secondaryButtonTitle={editMode ? "" : "Clear"}
            open={open}
            loading={loading}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            onClose={() => {
                setParams(trackingAssetsElementData);
                setUserParams({});
                setError({});
                onClose();
                setTemplateResponse(null);
            }}
            onApply={() => {
                if (validateData()) {
                    setLoading(true);
                    appDispatch(createTrackingAsset(params, editMode)).then((response: any) => {
                        if (response) {
                            setTemplateResponse(null);
                            setParams(trackingAssetsElementData);
                            setUserParams({});
                            setError({});
                            appDispatch(showAlert(response.message));
                            onSuccess();
                        }
                        setLoading(false);
                    });
                }
            }}
            onClear={() => {
                setTemplateResponse(null);
                setParams(trackingAssetsElementData);
                setUserParams({});
                setError({});
            }}
        >
            <div className="custom-form-row row align-items-end">
                {/* <div className="form-group col-md-6">
                    <EditText
                        label="Integration Name"
                        placeholder="Integration Name"
                        maxLength={25}
                        disabled={editMode}
                        value={params.integrationName}
                        error={error.integrationName}
                        onChange={(text: any) => {
                            setParams({
                                ...params,
                                integrationName: text
                            });
                        }}
                    />
                </div> */}
                <div className="form-group col-md-6">
                    <AutoComplete
                        label="Device Type"
                        mandatory
                        placeHolder="Select Device Type"
                        value={(userParams && userParams.deviceType) || ""}
                        isDisabled={editMode}
                        options={deviceDataList && deviceDataListObject}
                        error={error.deviceType}
                        onChange={(value: any) => {
                            setParams({
                                deviceType: value.value
                            });
                            setUserParams({
                                deviceType: value,
                                trackingVendor: null
                            })
                            setTemplateResponse(null)
                            let queryParams: any = {
                                deviceType: value.value
                            }
                            setLoading(true);
                            setError({});
                            appDispatch(trackingVendorData(queryParams)).then(() => setLoading(false));
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <AutoComplete
                        label="Tracking Vendor"
                        mandatory
                        placeHolder="Tracking Vendor"
                        value={(userParams && userParams.trackingVendor) || ""}
                        error={error.trackingVendor}
                        isDisabled={editMode}
                        options={TrackingVendorList && trackingVendorListObject}
                        onChange={(value: any) => {
                            setParams({
                                ...params,
                                trackingVendor: value.value
                            });
                            setUserParams({
                                ...userParams,
                                trackingVendor: value
                            })
                            let queryParams: any = {
                                trackingVendor: value.value
                            }
                            setLoading(true);
                            setError({});
                            appDispatch(getTemplateData(queryParams)).then((response: any) => {
                                response && setTemplateResponse(response);
                                setLoading(false)
                            });
                        }}
                    />
                </div>

                {templateResponse && templateResponse.fields && templateResponse.fields.map((item: any, index: any) => {
                    return (
                        <div className="form-group col-md-6" key={index}>
                            <EditText
                                label={item.description}
                                placeholder={"Enter " + item.description}
                                maxLength={item.key === "accessToken" ? 2000 : 25}
                                type={(item.key === "password" && !showPassword) ? "password" : "Text"}
                                value={params[item.key]}
                                mandatory={item.mandatory}
                                error={error[item.key]}
                                endAdornment={item.key === "password" ? (
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => {
                                            setShowPassword(!showPassword);
                                        }}
                                        onMouseDown={() => {
                                            setShowPassword(!showPassword);
                                        }}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                ) : null}
                                onChange={(text: any) => {
                                    setError({});
                                    setParams({
                                        ...params,
                                        [item.key]: text
                                    });
                                }}
                            />
                        </div>
                    )

                })}

            </div>
        </ModalContainer >
    );

    function validateData() {
        if (isNullValue(params.deviceType)) {
            setError({
                deviceType: "Enter valid Device Type."
            });
            return false;
        } else if (isNullValue(params.trackingVendor)) {
            setError({
                trackingVendor: "Enter valid Tracking Vendor."
            });
            return false;
        }
        if (templateResponse && templateResponse.fields && templateResponse.fields) {
            let value = templateResponse && templateResponse.fields && templateResponse.fields.some((item: any) => {
                if (isNullValue(params[item.key])) {
                    setError({
                        [item.key]: [item.errorMessage]
                    });
                }
                return isNullValue(params[item.key]);
            });
            if (value) {
                return !value
            } else {
                return true;
            }
        }
        return true;
    }

}

export default CreateTrackingAssetsModal;

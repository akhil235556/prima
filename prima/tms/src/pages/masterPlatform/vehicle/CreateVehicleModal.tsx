import { Checkbox, FormControlLabel } from "@material-ui/core";
import { ArrowRightAlt, ClearAll } from "@material-ui/icons";
import _ from "lodash";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { vehicleSourceTypeList } from "../../../base/constant/ArrayList";
import {
    dedicatedHubPlaceholder,
    dedicatedLabel,
    pucNumberHint, pucNumberHintPlaceholder, rcCopyHint, rcCopyHintPlaceholder, registrationNumberHint, vehicleRegistrationNumberPlaceHolder, vehicleTypeLabel,
    vehicleTypePlaceholder
} from '../../../base/constant/MessageUtils';
import { isObjectEmpty, vehicleNumberRegex } from "../../../base/utility/StringUtils";
import AutoComplete from '../../../component/widgets/AutoComplete';
import AutoSuggest from '../../../component/widgets/AutoSuggest';
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import EditText from "../../../component/widgets/EditText";
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import ModalContainer from "../../../modals/ModalContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { vehicleElementData } from "../../../moduleUtility/VehicleUtility";
import { showAlert } from "../../../redux/actions/AppActions";
import { Vehicle } from '../../../redux/storeStates/VehicleStoreInterface';
import { getTrackingAssets } from '../../../serviceActions/AppServiceActions';
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";
import { createVehicle, getVehicleDetails, searchPlatformVehicle, updateVehicleDetails } from '../../../serviceActions/VehicleServiceActions';
import { getAllVehicleTypeList } from "../../../serviceActions/VehicleTypeServiceActions";
import "./CreateVehicleModal.css";
import { createVehicleParams, RenderVehicleUtils, validateData } from "./VehicleUtils";

interface CreateVehicleModalProps {
    open: boolean
    onClose: any
    selectedElement: any
    onSuccess: any
    vehicleTemplate: any
}

function CreateVehicleModal(props: CreateVehicleModalProps) {

    const appDispatch = useDispatch();
    const { open, onClose, selectedElement, onSuccess, vehicleTemplate } = props;
    let editMode = !isObjectEmpty(selectedElement);
    const [params, setParams] = React.useState<Vehicle>(vehicleElementData);
    const [error, setError] = React.useState<any>({});
    const [userParams, setUserParams] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [vehicleNumberList, setVehicleNumberList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [dedicatedHubSuggestion, setDedicatedHubSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [checked, setChecked] = React.useState<boolean>(false);
    const [requiredCertificate, setRequiredCertificate] = React.useState<any>([]);
    const [initialTemplate, setInitialTemplate] = React.useState<any>(undefined);

    const handleChange = (event: { target: { name: any; checked: any; }; }) => {
        setChecked((prev: boolean) => !prev)
    };


    const trackingAssetList = useSelector((state: any) =>
        state.appReducer.trackingAssetList, shallowEqual
    );
    const vehicleTypeList = useSelector((state: any) =>
        state.appReducer.vehicleTypeList, shallowEqual
    );

    const addVehicleErrorInfo = {
        certNameError: "",
        certNumberError: "",
        certIssueDateError: "",
        certExpiryDateError: ""
    }

    useEffect(() => {
        if (open) {
            setLoading(true);
            Promise.all([appDispatch(getTrackingAssets()), appDispatch(getAllVehicleTypeList())])
                .then(() => {
                    setLoading(false);
                });
            if (vehicleTemplate && vehicleTemplate.length) {
                setRequiredCertificate(vehicleTemplate.map((info: any) => info.certificateName))
                setChecked(true)
            }
            if (editMode) {
                let params = {
                    vehicleCode: selectedElement.vehicleCode,
                    isCertificateActive: 1
                }
                setLoading(true);
                appDispatch(getVehicleDetails(params)).then((response: any) => {
                    if (response) {
                        var responseCertificates: any = []
                        if (response.certificateResults) {
                            responseCertificates = response.certificateResults.map((item: any) => {
                                return {
                                    ...item,
                                    certName: {
                                        label: item.certificateDisplayName,
                                        value: item.certificateName
                                    },
                                    certificateName: item.certificateName,
                                    certNumber: item.certificateNumber,
                                    certIssueDate: item.issueDate,
                                    certExpiryDate: item.expiryDate,
                                }
                            })
                        }
                        let addVehicleArr: any = vehicleTemplate && vehicleTemplate.map((element: any) => {
                            return {
                                certName: {
                                    label: element.certificateDisplayName,
                                    value: element.certificateName
                                },
                                certificateName: element.certificateName,
                            }
                        });
                        var result: any = _.unionBy(responseCertificates, addVehicleArr, "certificateName");
                        result = result.map((item: any, index: any) => {
                            return {
                                ...item,
                                index: index
                            }
                        })
                        result.push({ index: result.length });
                        setInitialTemplate(JSON.parse(JSON.stringify(result)))
                        if (!vehicleTemplate && response.certificateResults) {
                            setChecked(true)
                        }
                        setParams({
                            ...params,
                            vehicleNumber: response.vehicleNumber,
                            vehicleTypeId: response.vehicleTypeId.toString(),
                            isDedicated: response.isDedicated,
                            addVehicleArr: result,
                            id: response.id,
                            node: response.isDedicated === "true" ? response.node : "",
                            rcNumber: response.rcNumber ? response.rcNumber : "",
                            pucNumber: response.pucNumber ? response.pucNumber : ""
                        })
                        setUserParams({
                            locationName: response.locationName,
                            isDedicated: {
                                label: response.isDedicated === "false" ? "Market" : "Dedicated",
                                value: response.isDedicated,
                            },
                            vehicle: {
                                label: response.vehicleType,
                                value: response.vehicleTypeId
                            },
                            trackingAssetId: (response.trackingAsset && response.trackingAsset.trackingVendor) ? {
                                label: (response.trackingVendor || response.trackingAsset.trackingVendor),
                                value: response.trackingAssetId,
                            } : undefined
                        });
                    }
                    setLoading(false)
                })
            } else {
                let addVehicleArr: any = []
                if (vehicleTemplate && vehicleTemplate.length > 0) {
                    addVehicleArr = vehicleTemplate.map((element: any, index: any) => {
                        return {
                            certName: {
                                label: element.certificateDisplayName,
                                value: element.certificateName
                            },
                            index: index
                        }
                    });
                };
                addVehicleArr.push({ index: addVehicleArr.length })
                setInitialTemplate(JSON.parse(JSON.stringify(addVehicleArr)))
                setParams({
                    ...params,
                    addVehicleArr: addVehicleArr
                })

            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, selectedElement]);

    useEffect(() => {
        if (editMode && selectedElement) {
            if (selectedElement.trackingAsset) {
                var result2 = trackingAssetList && trackingAssetList.assets && trackingAssetList.assets.filter((item: any) => item.trackingVendor === selectedElement.trackingAsset.trackingVendor);
                result2 && result2.length > 0 && setUserParams({
                    ...userParams,
                    trackingAssetId: {
                        label: result2 && result2[0] && result2[0].trackingVendor,
                        value: result2 && result2[0] && result2[0].id
                    },
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackingAssetList]);


    return (
        <ModalContainer
            title={editMode ? "Vehicle Details" : "Create Vehicle"}
            primaryButtonTitle={editMode ? "Update" : "Create"}
            secondaryButtonTitle={editMode ? "" : "Clear"}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            loading={loading}
            open={open}
            styleName={"vechile-modal-data"}
            onClose={() => {
                const params = { ...vehicleElementData, addVehicleArr: initialTemplate };
                setParams(params);
                setChecked(false)
                setUserParams({});
                setError({});
                onClose();
            }}
            onApply={() => {
                const validate = validateData(params, requiredCertificate)
                if (validate === true) {
                    let vehicleCreateParams = createVehicleParams(params, userParams, checked);
                    setLoading(true);
                    if (editMode) {
                        appDispatch(updateVehicleDetails(vehicleCreateParams)).then((response: any) => {
                            if (response) {
                                const params = { ...vehicleElementData, addVehicleArr: initialTemplate };
                                setParams(params);
                                setUserParams({});
                                setChecked(false)
                                setError({});
                                appDispatch(showAlert(response.message));
                                onSuccess();
                            }
                            setLoading(false);
                        });

                    } else {
                        appDispatch(createVehicle(vehicleCreateParams)).then((response: any) => {
                            if (response) {
                                const params = { ...vehicleElementData, addVehicleArr: initialTemplate };
                                setParams(params);
                                setUserParams({});
                                setChecked(false)
                                setError({});
                                appDispatch(showAlert(response.message));
                                onSuccess();
                            }
                            setLoading(false);
                        });
                    }
                }
                else if (validate.error) {
                    setParams({
                        ...params,
                        addVehicleArr: validate.addVehicleArr
                    });
                } else {
                    setError(validate);
                }

            }}
            onClear={() => {
                const params = { ...vehicleElementData, addVehicleArr: initialTemplate };
                setParams(params);
                setUserParams({});
                setError({});
            }}
        >
            {loading ?
                <CardContentSkeleton
                    row={4}
                    column={2} /> :
                <div className="custom-form-row row">
                    <div className="form-group col-md-6">
                        <AutoSuggest
                            label={registrationNumberHint}
                            mandatory
                            maxLength={20}
                            placeHolder={vehicleRegistrationNumberPlaceHolder}
                            isDisabled={editMode}
                            error={error.vehicleNumber}
                            suggestions={vehicleNumberList}
                            value={params.vehicleNumber}
                            onChange={(text: any) => {
                                setParams((params) => ({
                                    ...params,
                                    vehicleNumber: vehicleNumberRegex(text)
                                }));
                                setError({});
                            }}
                            handleSuggestionsFetchRequested={({ value }: any) => {
                                if (value.length > autosuggestSearchLength) {
                                    getVehicleList(value);
                                }
                            }}
                            onSelected={(element: OptionType) => {
                                setParams((params) => ({
                                    ...params,
                                    vehicleNumber: element.label,
                                    trackingAssetId: Number(element.value),
                                }));
                                element.data.trackingVendor.trackingVendor && setUserParams({
                                    ...userParams,
                                    trackingAssetId: {
                                        label: element.data.trackingVendor.trackingVendor,
                                        value: element.value,
                                    },
                                });
                                setError({});
                            }}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <AutoComplete
                            label={vehicleTypeLabel}
                            mandatory
                            // isDisabled={editMode}
                            placeHolder={vehicleTypePlaceholder}
                            error={error.vehicleTypeId}
                            value={userParams && userParams.vehicle}
                            options={setAutoCompleteListWithData(vehicleTypeList, "type", "id")}
                            onChange={(element: OptionType) => {
                                setUserParams({
                                    ...userParams,
                                    vehicleType: element.label,
                                    vehicleTypeId: element.value,
                                    vehicle: element,
                                });
                                setParams({
                                    ...params,
                                    vehicleTypeId: element.value,
                                })
                                setError({});
                            }}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <AutoComplete
                            label="Source Type"
                            placeHolder="Select Source Type"
                            options={vehicleSourceTypeList}
                            mandatory
                            value={userParams && userParams.isDedicated}
                            error={error.isDedicated}
                            onChange={(value: OptionType) => {
                                setUserParams({
                                    ...userParams,
                                    isDedicated: value,
                                    locationName: ""
                                });
                                setParams({
                                    ...params,
                                    isDedicated: value.value,
                                    node: ""
                                })
                                setError({});
                            }}
                        />
                    </div>
                    {params && params.isDedicated === "true" &&
                        <div className="form-group col-md-6">
                            <AutoSuggest
                                label={dedicatedLabel}
                                mandatory
                                placeHolder={dedicatedHubPlaceholder}
                                error={error.locationName}
                                value={userParams.locationName}
                                suggestions={dedicatedHubSuggestion}
                                handleSuggestionsFetchRequested={({ value }: any) => {
                                    if (value.length > autosuggestSearchLength) {
                                        getSuggestionList(value, "origin");
                                    }
                                }}
                                onSelected={(element: OptionType) => {
                                    setUserParams({
                                        ...userParams,
                                        locationName: element.label,
                                    });
                                    setParams({
                                        ...params,
                                        node: element.value
                                    })
                                    setError({});
                                }}
                                onChange={(text: string) => {
                                    setUserParams({
                                        ...userParams,
                                        origin: undefined,
                                        locationName: text
                                    });
                                    setParams({
                                        ...params,
                                        node: ""
                                    });
                                    setError({});
                                }}
                            />
                        </div>
                    }
                    {!checked && (
                        <>
                            <div className="form-group col-md-6">
                                <EditText
                                    label={rcCopyHint}
                                    placeholder={rcCopyHintPlaceholder}
                                    maxLength={25}
                                    autoCaps={true}
                                    value={params.rcNumber}
                                    onChange={(text: any) => {
                                        setParams({
                                            ...params,
                                            rcNumber: text.trim()
                                        });
                                        setError({});
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <EditText
                                    label={pucNumberHint}
                                    placeholder={pucNumberHintPlaceholder}
                                    maxLength={25}
                                    value={params.pucNumber}
                                    onChange={(text: any) => {
                                        setParams({
                                            ...params,
                                            pucNumber: text.trim()
                                        });
                                        setError({});
                                    }}
                                />
                            </div>
                        </>
                    )}
                    <div className="form-group col-md-6">
                        <AutoComplete
                            label="Tracking Assets"
                            placeHolder="Select Assets"
                            value={(userParams && userParams.trackingAssetId) || ""}
                            options={trackingAssetList && setAutoCompleteListWithData(trackingAssetList.assets, "trackingVendor", "id")}
                            isClearable={true}
                            onChange={
                                (value: any) => {
                                    if (value) {
                                        setParams({
                                            ...params,
                                            trackingAssetId: value.value
                                        });
                                        setUserParams({
                                            ...userParams,
                                            trackingAssetId: value
                                        });
                                    } else {
                                        setParams({
                                            ...params,
                                            trackingAssetId: value
                                        });
                                        setUserParams({
                                            ...userParams,
                                            trackingAssetId: value
                                        });
                                    }
                                    setError({});
                                }
                            }
                        />
                    </div>
                    <div className="form-group col-md-6 gst-line">
                        <div className="gst-align">
                            <FormControlLabel className="gst-checkbox"
                                control={
                                    <Checkbox className="custom-checkbox"
                                        disabled={!!vehicleTemplate}
                                        checked={checked}
                                        onChange={handleChange}
                                        name="checked"
                                    />
                                }
                                label="Add Certificates"
                            />
                        </div>
                    </div>
                    {
                        checked &&
                        <div className="form-group col-md-12">
                            {params && params.addVehicleArr && params.addVehicleArr.map((element: any, index: number) => (
                                <RenderVehicleUtils
                                    key={index}
                                    addVehicleArr={params.addVehicleArr}
                                    requiredCertificate={requiredCertificate}
                                    element={element}
                                    onAdd={onAdd}
                                    onRemove={onRemove}
                                    onChangeCertNameType={(certType: any, selectedIndex: number) => {
                                        const addVehicleArrayList = params.addVehicleArr.map(
                                            (data: any) => ((data.index === selectedIndex) ? {
                                                ...data,
                                                ...addVehicleErrorInfo,
                                                certName: certType,
                                            } : data));
                                        onChangeVehicleDocs(addVehicleArrayList)
                                        setError({});
                                    }}
                                    onChangeCertNumber={(certNumber: any, selectedIndex: number) => {
                                        const addVehicleArrayList = params.addVehicleArr.map(
                                            (data: any) => ((data.index === selectedIndex) ? {
                                                ...data,
                                                ...addVehicleErrorInfo,
                                                certNumber: certNumber,
                                            } : data));
                                        onChangeVehicleDocs(addVehicleArrayList)
                                        setError({});
                                    }}
                                    onSelectCertIssueDate={(certIssueDate: any, selectedIndex: number) => {
                                        const addVehicleArrayList = params.addVehicleArr.map(
                                            (data: any) => ((data.index === selectedIndex) ? {
                                                ...data,
                                                ...addVehicleErrorInfo,
                                                certIssueDate: certIssueDate,
                                            } : data));
                                        onChangeVehicleDocs(addVehicleArrayList)
                                        setError({});
                                    }}
                                    onSelectCertExpiryDate={(certExpiryDate: any, selectedIndex: number) => {
                                        const addVehicleArrayList = params.addVehicleArr.map(
                                            (data: any) => ((data.index === selectedIndex) ? {
                                                ...data,
                                                ...addVehicleErrorInfo,
                                                certExpiryDate: certExpiryDate,
                                            } : data));
                                        onChangeVehicleDocs(addVehicleArrayList)
                                        setError({});
                                    }}
                                />
                            ))}
                        </div>
                    }

                </div>
            }
        </ModalContainer >
    );

    function onAdd() {
        const newVehicleArr = [...params.addVehicleArr, { index: params.addVehicleArr.length }];
        setParams({
            ...params,
            addVehicleArr: newVehicleArr
        })
    }

    function onRemove(index: Number) {
        let newVehicleArr = params.addVehicleArr && params.addVehicleArr.filter((_: any, i: Number) => (index !== i));
        newVehicleArr = newVehicleArr && newVehicleArr.map((item: any, index: any) => {
            return {
                ...item,
                index: index,
            }
        })
        setParams({
            ...params,
            addVehicleArr: newVehicleArr
        })
    }

    function onChangeVehicleDocs(addVehicleArrList: any) {
        setParams({
            ...params,
            addVehicleArr: addVehicleArrList
        })

    }

    function getVehicleList(text: string) {
        appDispatch(searchPlatformVehicle({ query: text })).then((response: any) => {
            if (response) {
                setVehicleNumberList(setAutoCompleteListWithData(response.vehicles, "vehicleNumber", "trackingAssetId"))
            }
        });
    }

    function getSuggestionList(text: string, type: string) {
        let queryParams: any = { query: text };
        if (type === "origin") {
            queryParams.node = true;
        }
        appDispatch(searchLocationList(queryParams)).then((response: any) => {
            if (response) {
                setDedicatedHubSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
            }
        })
    }

}

export default CreateVehicleModal;

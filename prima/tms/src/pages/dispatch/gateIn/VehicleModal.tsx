import { Checkbox, FormControlLabel } from "@material-ui/core";
import { ArrowRightAlt, ClearAll } from "@material-ui/icons";
import _ from "lodash";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { vehicleSourceTypeList } from "../../../base/constant/ArrayList";
import {
    contractExistMessage,
    pucNumberHint, pucNumberHintPlaceholder, rcCopyHint, rcCopyHintPlaceholder, registrationNumberHint, transporterLabel, transporterPlaceHolder, vehicleChangeSuccessMessage, vehicleRegistrationNumberPlaceHolder, vehicleTypeChangeMessage, vehicleTypeChangePermissionMessage, vehicleTypeLabel,
    vehicleTypePlaceholder
} from '../../../base/constant/MessageUtils';
import AutoComplete from '../../../component/widgets/AutoComplete';
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import EditText from "../../../component/widgets/EditText";
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import ModalContainer from "../../../modals/ModalContainer";
import WarningModal from "../../../modals/warningModal/WarningModal";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { vehicleElementData } from "../../../moduleUtility/VehicleUtility";
import { showAlert } from "../../../redux/actions/AppActions";
import { getTrackingAssets } from '../../../serviceActions/AppServiceActions';
import { getLanePrice } from "../../../serviceActions/FrightRateServiceAction";
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";
import { getServiceabilityDetails } from "../../../serviceActions/ServiceabilityServiceActions";
import { createVehicleOnShipment, getVehicleDetailsShipment, updateVehicleDetailsForShipment, updateVehicleType } from '../../../serviceActions/VehicleServiceActions';
import { getAllVehicleTypeList } from "../../../serviceActions/VehicleTypeServiceActions";
import { createVehicleModalParams, RenderVehicleUtils, validateData } from "../../masterPlatform/vehicle/VehicleUtils";

interface VehicleModalProps {
    open: boolean
    onClose: any
    selectedElement: any
    freightTypeCode: any
    onSuccess: any,
    vehicleTemplate?: any
    inboundDetails?: any;
    placementDetails?: any;
    editable?: boolean;
    setIsVehicleUpdated: Function;
    vehileTypeChangePermission: boolean;
}

function VehicleModal(props: VehicleModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, selectedElement, vehicleTemplate, setIsVehicleUpdated, inboundDetails = {}, placementDetails = {}, onSuccess, vehileTypeChangePermission } = props;
    const [params, setParams] = React.useState<any>({});
    const [userParams, setUserParams] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [dedicatedHubSuggestion, setDedicatedHubSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [error, setError] = React.useState<any>({});
    const [initialTemplate, setInitialTemplate] = React.useState<any>(undefined);
    const [checked, setChecked] = React.useState<boolean>(false);
    const [requiredCertificate, setRequiredCertificate] = React.useState<any>([]);
    const [partnerList, setPartnerList] = React.useState<any>();
    const [laneDetails, setLaneDetails] = React.useState<any>({});
    const [isVehicleChanged, setIsVehicleChanged] = React.useState<boolean>(false);
    const editMode = selectedElement && selectedElement.vehicleCode;

    let contractParams = {
        laneCode: inboundDetails?.laneCode,
        partnerCode: inboundDetails?.partnerCode,
        serviceabilityModeCode: inboundDetails?.serviceabilityModeCode,
        vehicleTypeCode: userParams?.vehicleTypeCode
    }

    const initialModalState = {
        open: false,
        warningMessage: "",
        primaryButtonTitle: "",
        secondaryuttonTitle: "",
        primaryButtonLeftIcon: "",
        showLanePrice: false
    }
    const [modalState, setModalState] = React.useState<any>(initialModalState);

    const trackingAssetList = useSelector((state: any) =>
        state.appReducer.trackingAssetList, shallowEqual
    );
    const vehicleTypeList = useSelector((state: any) =>
        state.appReducer.vehicleTypeList, shallowEqual
    );

    const handleChange = (event: { target: { name: any; checked: any; }; }) => {
        setChecked((prev: boolean) => !prev)
    };

    const addVehicleErrorInfo = {
        certNameError: "",
        certNumberError: "",
        certIssueDateError: "",
        certExpiryDateError: ""
    }
    const [vehicleType, setVehicleType] = React.useState<any>({});

    useEffect(() => {
        if (laneDetails?.contractDetails) {
          checkServiceability();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [laneDetails?.contractDetails]);

    useEffect(() => {
        if (open && selectedElement) {
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
                appDispatch(getVehicleDetailsShipment(params)).then((response: any) => {
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
                        setVehicleType({
                            label: response.vehicleType,
                            value: response.vehicleTypeCode
                        })
                        if (!vehicleTemplate && response.certificateResults) {
                            setChecked(true)
                        }
                        setParams({
                            ...params,
                            vehicleCode: selectedElement.vehicleCode,
                            vehicleNumber: response.vehicleNumber,
                            vehicleTypeId: response.vehicleTypeId.toString(),
                            vehicleType: response.vehicleType,
                            isDedicated: response.isDedicated,
                            addVehicleArr: result,
                            id: response.id,
                            node: response.isDedicated === "true" ? response.node : "",
                            rcNumber: response.rcNumber ? response.rcNumber : "",
                            pucNumber: response.pucNumber ? response.pucNumber : "",
                        })
                        setUserParams({
                            locationName: response.locationName,
                            isDedicated: response.isDedicated && {
                                label: response.isDedicated === "false" ? "Market" : "Dedicated",
                                value: response.isDedicated,
                            },
                            vehicleType: response.vehicleType ? {
                                label: response.vehicleType,
                                value: response.vehicleTypeId,
                            } : undefined,
                            trackingAssetId: (response.trackingAsset && response.trackingAsset.trackingVendor) ? {
                                label: (response.trackingVendor || response.trackingAsset.trackingVendor),
                                value: response.trackingAssetId,
                            } : undefined
                        })
                    }
                    setLoading(false)
                })
            } else {
                setUserParams({
                    locationName: selectedElement.locationName,
                    isDedicated: selectedElement.isDedicated && {
                        label: selectedElement.isDedicated === "false" ? "Market" : "Dedicated",
                        value: selectedElement.isDedicated,
                    },
                    vehicleType: placementDetails.updatedVehicle ? {
                        label: placementDetails.updatedVehicle.label,
                        value: placementDetails.updatedVehicle.value,
                    } : selectedElement.vehicleType ? {
                        label: selectedElement.vehicleType,
                        value: selectedElement.vehicleTypeId,
                    } : undefined,
                    trackingAssetId: (selectedElement.trackingAsset && selectedElement.trackingAsset.trackingVendor) ? {
                        label: (selectedElement.trackingVendor || selectedElement.trackingAsset.trackingVendor),
                        value: selectedElement.trackingAssetId,
                    } : undefined
                })
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
                setVehicleType({
                    label: selectedElement?.vehicleTypeName,
                    value: selectedElement?.vehicleTypeCode
                })
                setParams({
                    ...selectedElement,
                    addVehicleArr: addVehicleArr
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, selectedElement]);
    return (
        <ModalContainer
            title={(selectedElement && selectedElement.vehicleCode) ? "Update Vehicle" : "Create Vehicle"}
            primaryButtonTitle={(selectedElement && selectedElement.vehicleCode) ? "Update" : "Create"}
            secondaryButtonTitle={(selectedElement && selectedElement.vehicleCode) ? "" : "Clear"}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            loading={loading}
            open={open}
            onClose={() => {
                // setParams(vehicleElementData);
                setParams({})
                setUserParams({});
                // setError({});
                onClose();
                setLaneDetails({})
                setIsVehicleChanged(false)
            }}
            onApply={() => {
                const validate = validateData(params, requiredCertificate, true)
                if (validate === true) {
                    if (inboundDetails.freightTypeCode === "FTL" && isVehicleChanged) {
                        if (vehileTypeChangePermission) {
                            setModalState({
                                ...initialModalState,
                                open: true,
                                warningMessage: vehicleTypeChangeMessage,
                                primaryButtonTitle: "Yes",
                                secondaryuttonTitle: "No"
                            });
                        } else {
                            appDispatch(showAlert(vehicleTypeChangePermissionMessage, false))
                        }

                    } else {
                        onApply();
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
                const tempParams = {
                    ...params,
                    rcNumber: "",
                    pucNumber: "",
                    trackingAssetId: null,
                    addVehicleArr: initialTemplate
                };
                setParams(tempParams);
                setUserParams({});
                setError({});
            }}
        >

            {loading ? <CardContentSkeleton row={4} column={2} /> :
                (
                    <>
                        <WarningModal
                            open={modalState?.open}
                            onClose={() => {
                                setModalState({ ...initialModalState, open: false });
                                setLaneDetails({})
                            }}
                            warningMessage={modalState?.warningMessage}
                            primaryButtonTitle={modalState?.primaryButtonTitle}
                            secondaryuttonTitle={modalState?.secondaryuttonTitle}
                            primaryButtonLeftIcon={modalState?.primaryButtonLeftIcon}
                            value={laneDetails?.lanePrice}
                            onChange={(text: any) => {
                                setLaneDetails({ ...laneDetails, lanePriceError: "", lanePrice: text });
                            }}
                            showTextField={modalState?.showLanePrice}
                            errorMessage={laneDetails?.lanePriceError}
                            label={"Lane Price"}
                            placeholder={"Enter Lane Price"}
                            onSuccess={() => {
                                if (!laneDetails?.lanePrice && !modalState.showLanePrice) {
                                    appDispatch(getLanePrice({ ...contractParams, freightType: inboundDetails?.freightTypeCode })).then((response: any) => {
                                        if (!response?.lanePrice) {
                                            setModalState({
                                                ...initialModalState,
                                                open: true,
                                                warningMessage: contractExistMessage,
                                                primaryButtonTitle: "Submit",
                                                secondaryuttonTitle: "",
                                                primaryButtonLeftIcon: <ArrowRightAlt />,
                                                showLanePrice: true
                                            });
                                        } else {
                                            setLaneDetails({ ...laneDetails, contractDetails: response });
                                        }
                                    })
                                } else if (!laneDetails?.lanePrice && modalState.showLanePrice) {
                                    setLaneDetails({ ...laneDetails, lanePriceError: "Enter Lane Price" });
                                } else {
                                    checkServiceability();
                                }
                            }}
                        />
                        <div className="custom-form-row row">
                            <div className="form-group col-md-6">
                                <EditText
                                    label={registrationNumberHint}
                                    placeholder={vehicleRegistrationNumberPlaceHolder}
                                    maxLength={25}
                                    mandatory
                                    disabled={true}
                                    // autoCaps={true}
                                    value={params.vehicleNumber}
                                    onChange={(text: any) => {
                                        setParams({
                                            ...params,
                                            vehicleNumber: text
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <AutoComplete
                                    label={vehicleTypeLabel}
                                    mandatory
                                    isDisabled={placementDetails?.addTrackingAssets || editMode}
                                    placeHolder={vehicleTypePlaceholder}
                                    value={userParams && userParams.vehicleType}
                                    options={setAutoCompleteListWithData(vehicleTypeList, "type", "id")}
                                    onChange={async (element: OptionType) => {
                                        if (element.data.code !== inboundDetails?.vehicleTypeCode) setIsVehicleChanged(true);
                                        else setIsVehicleChanged(false);
                                        setLaneDetails({})
                                        setUserParams({
                                            ...userParams,
                                            vehicleTypeId: element.value,
                                            vehicleType: { label: element.label },
                                            vehicle: element,
                                            vehicleTypeCode: element.data.code
                                        });
                                        setParams({
                                            ...params,
                                            vehicleTypeId: element.value,

                                        })
                                    }}
                                />
                            </div>

                            <div className="form-group col-md-6">
                                <AutoComplete
                                    label="Source Type"
                                    placeHolder="Select Source Type"
                                    mandatory
                                    options={vehicleSourceTypeList}
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
                                        });
                                        setError({});
                                    }}
                                />
                            </div>
                            {params && params.isDedicated === "true" &&
                                <>
                                    <div className="form-group col-md-6">
                                        <AutoSuggest
                                            label="Dedicated Hub"
                                            mandatory
                                            placeHolder="Enter Dedicated Hub Name"
                                            value={userParams.locationName}
                                            error={error.locationName}
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
                                                    origin: element,
                                                });
                                                setParams({
                                                    ...params,
                                                    node: element.value
                                                });
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
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-6 ">
                                        <AutoSuggest
                                            label={transporterLabel}
                                            placeHolder={transporterPlaceHolder}
                                            error={error.partnerName}
                                            value={userParams.partnerName}
                                            suggestions={partnerList}
                                            handleSuggestionsFetchRequested={({ value }: any) => {
                                                if (value.length > autosuggestSearchLength) {
                                                    getPartnerList(value);
                                                }
                                            }}
                                            onSelected={(element: OptionType) => {
                                                setUserParams({
                                                    ...userParams,
                                                    partner: element,
                                                    partnerName: element.label
                                                });

                                                setParams({
                                                    ...params,
                                                    partnerCode: element.value
                                                })
                                                setError({});
                                            }}

                                            onChange={(text: string) => {
                                                setUserParams({
                                                    ...userParams,
                                                    partnerName: text,
                                                    partner: undefined,
                                                });

                                                setParams({
                                                    ...params,
                                                    partnerName: text,
                                                    partnerCode: ""
                                                })

                                            }}
                                        />
                                    </div>
                                </>
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
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="form-group col-md-6">
                                <AutoComplete
                                    label="Tracking Assets"
                                    isClearable={true}
                                    placeHolder="Select Assets"
                                    value={(userParams && userParams.trackingAssetId) || ""}
                                    options={trackingAssetList && setAutoCompleteListWithData(trackingAssetList.assets, "trackingVendor", "id")}
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
                    </>
                )
            }
        </ModalContainer>
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
        newVehicleArr = newVehicleArr.map((item: any, index: any) => {
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
    function getPartnerList(text: string) {
        appDispatch(searchClientPartner({ query: text })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteListWithData(response, "partnerName", "partnerCode"));
            }
        });
    }

    function updateOrderVehicleType() {
        let vehicleParams: any = {
            freightOrderCode: inboundDetails?.freightOrderCode,
            vehicleTypeCode: userParams && userParams?.vehicleTypeCode,
            vehicleTypeName: userParams && userParams?.vehicleType?.label,
            lanePrice: laneDetails?.lanePrice ? laneDetails?.lanePrice : laneDetails?.contractDetails?.lanePrice ? laneDetails?.contractDetails?.lanePrice : inboundDetails?.lanePrice,
            contractCode: vehicleType?.value !== params?.vehicleType?.value ? laneDetails?.contractDetails?.contractCode : selectedElement?.contractCode,
            vehicleRegistrationNumber: placementDetails?.vehicleRegistrationNumber,
            freightShipmentCodes: inboundDetails && inboundDetails?.shipmentDetails?.map((shipment: any) => {
                return shipment.freightShipmentCode
            })
        };
        appDispatch(updateVehicleType(vehicleParams)).then((response: any) => {
            if (response) {
                setIsVehicleUpdated();
                setLoading(false);
                inboundDetails?.freightTypeCode === "FTL" && appDispatch(showAlert(vehicleChangeSuccessMessage));
            } else {
                setLoading(false)
            }
            setModalState({ ...initialModalState, open: false });
            setIsVehicleChanged(false)
        });
    }

    function createVehicle() {
        let vehicleCreateParams = createVehicleModalParams(params, userParams, checked);
        if (editMode) {
            appDispatch(updateVehicleDetailsForShipment(vehicleCreateParams)).then(
                (response: any) => {
                    if (response) {
                        const tempParams = {
                            ...vehicleElementData,
                            addVehicleArr: initialTemplate,
                        };
                        setParams(tempParams);
                        setUserParams({});
                        onSuccess({
                            ...response.details,
                            trackingAssetId: params.trackingAssetId,
                        });
                    }
                    setLoading(false);
                }
            );
        } else {
            appDispatch(createVehicleOnShipment(vehicleCreateParams)).then(
                (response: any) => {
                    if (response) {
                        const params = {
                            ...vehicleElementData,
                            addVehicleArr: initialTemplate,
                        };
                        setParams(params);
                        setUserParams({});
                        onSuccess({
                            ...response.details,
                            trackingAssetId: params.trackingAssetId,
                        });
                    }
                    setLoading(false);
                }
            );
        }
    }

    function onApply() {
        if (isVehicleChanged && inboundDetails.freightTypeCode === "FTL") {
            setLoading(true);
            updateOrderVehicleType();
            createVehicle();
        } else {
            setLoading(true);
            createVehicle();
            setIsVehicleChanged(false);
        }
    }

    function checkServiceability() {
        setModalState({ ...initialModalState, open: false });
        appDispatch(getServiceabilityDetails({ ...contractParams, freightTypeCode: inboundDetails?.freightTypeCode })).then((response: any) => {
            if (response) {
                onApply();
            } else {
                setLaneDetails({})
            }
        })
    }

}

export default VehicleModal;

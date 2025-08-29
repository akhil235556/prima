import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import { ArrowRightAlt, ClearAll } from "@material-ui/icons";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FreightType, ftlServiceabilityModeTypeList, ServicabilityType, serviceabilityModeTypeList, tatOptions } from '../../../base/constant/ArrayList';
import { errorFreightType, errorLane, errorModeType, errorTat, errorTransporter, modLabel, modPlaceholder, odaTatLabel, odaTatPlaceholder, tatLabelWithoutUnit, tatPlaceholder, transporterLabel, transporterPlaceHolder, vehicleTypeError } from '../../../base/constant/MessageUtils';
import { isNullValue, isNullValueOrZero, isObjectEmpty, tatValueConverter } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from '../../../component/widgets/AutoSuggest';
import EditText from "../../../component/widgets/EditText";
import NumberEditText from "../../../component/widgets/NumberEditText";
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import ModalContainer from "../../../modals/ModalContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList, setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { showAlert } from "../../../redux/actions/AppActions";
import { PartnerDetails } from "../../../redux/storeStates/PartnerStoreInterface";
import { getClientFreightTypeList } from "../../../serviceActions/FreightTypeServiceActions";
import { searchLane } from "../../../serviceActions/LaneServiceActions";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";
import { createServiceability, downloadOdaPincodesCsv } from '../../../serviceActions/ServiceabilityServiceActions';
import { getAllVehicleTypeList } from "../../../serviceActions/VehicleTypeServiceActions";
import './ODAPincode.css';
import ODAPincodeModal from "./ODAPincodeModal";

interface EnableServiceabilityModalProps {
    open: boolean
    onClose: any
    onSuccess: any
    selectedElement: any
}

function EnableServiceabilityModal(props: EnableServiceabilityModalProps) {
    const appDispatch = useDispatch();
    const [csvLink, setCsvLink] = React.useState("");
    const [showPincodes, setShowPincodes] = React.useState<any>(false);
    const { open, onClose, onSuccess, selectedElement } = props;
    let editMode = !isObjectEmpty(selectedElement);
    const [userParams, setUserParams] = React.useState<PartnerDetails | any>({});
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [freightTypeList, setFreightTypeList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [tatValue, setTatValue] = React.useState<any>(tatOptions[0]);
    const [odaTatValue, setOdaTatValue] = React.useState<any>(tatOptions[0]);
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<any>(false);
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [pinCodeList, setPinCodeList] = React.useState<Array<any>>([]);
    const vehicleTypeList = useSelector((state: any) => state.appReducer.vehicleTypeList, shallowEqual);

    const isZoneBasedPtl = () => userParams?.freightType?.value === FreightType.PTL && userParams.serviceabilityType === ServicabilityType.ZONE;
    const isPtl = () => userParams?.freightType?.value === FreightType.PTL;

    function getOdaPincodeList() {
        return pinCodeList?.filter((item: any) => item.selected === true)?.map((e: any) => e.value);
    }

    useEffect(() => {
        if (open && editMode) {
            let res = selectedElement?.odaPincodeList?.map((value: any) => ({
                value: value,
                selected: true
            })) || [];
            setUserParams({
                ...selectedElement,
                freightType: {
                    label: selectedElement.freightTypeCode,
                    value: selectedElement.freightTypeCode
                },
                modeType: {
                    label: selectedElement.serviceabilityModeName,
                    value: selectedElement.serviceabilityModeCode
                },
                vehicleType: {
                    value: selectedElement.vehicleTypeCode,
                    label: selectedElement.vehicleTypeName
                },
                originZone: {
                    value: selectedElement.originCode,
                    label: selectedElement.originName
                },
                destinationZone: {
                    value: selectedElement.destinationCode,
                    label: selectedElement.destinationName
                }
            })
            setPinCodeList([...res]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedElement]);

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            let promiseArray: any = [appDispatch(getClientFreightTypeList()), appDispatch(getAllVehicleTypeList())]
            Promise.all(promiseArray).then((response: any) => {
                response[0] && setFreightTypeList(setAutoCompleteList(response[0], "freightTypeName", "freightTypeName"));
                setLoading(false)
            })
        }
        const getCsvLink = async () => {
            appDispatch(downloadOdaPincodesCsv({ serviceabilityCode: selectedElement?.serviceabilityCode }))
                .then((response: any) => {
                    if (response?.link) {
                        setCsvLink(response.link);
                    }
                });
        }
        open && editMode && getCsvLink();
        open && !editMode && getList();
        open && setTatValue(tatOptions[0]);
        open && setOdaTatValue(tatOptions[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <ModalContainer
            title={editMode ? "Update Serviceability" : "Create Serviceability"}
            primaryButtonTitle={editMode ? "Update" : "Create"}
            secondaryButtonTitle={editMode ? "" : "Clear"}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            loading={loading}
            open={open}
            onClose={() => {
                clearData();
                onClose();
            }}
            onApply={() => {
                if (validateData()) {
                    setLoading(true);
                    let params: any = {
                        laneCode: userParams.laneCode,
                        serviceabilityModeCode: userParams.modeType.value,
                        tat: tatValueConverter(tatValue.value, userParams.tat),
                        odaTat: tatValueConverter(odaTatValue.value, userParams.odaTat),
                        freightTypeCode: userParams.freightType.value,
                        odaPincodeList: getOdaPincodeList()
                    }
                    if (!isObjectEmpty(selectedElement && selectedElement.serviceabilityCode)) {
                        params.serviceabilityCode = selectedElement.serviceabilityCode;
                    }
                    if (userParams.freightType && userParams.freightType.label === FreightType.FTL && userParams.vehicleType) {
                        params.vehicleTypeCode = userParams.vehicleType.value;
                    }
                    if (!isNullValue(userParams.partnerCode)) {
                        params.partnerCode = userParams.partnerCode;
                    }
                    if (!isNullValue(userParams.isStrictlyOnPincode) && isZoneBasedPtl()) {
                        params.isStrictlyOnPincode = userParams.isStrictlyOnPincode;
                    }
                    appDispatch(createServiceability(params, editMode)).then((response: any) => {
                        setLoading(false)
                        if (response) {
                            clearData();
                            response.message && appDispatch(showAlert(response.message));
                            onSuccess();
                        }
                        setLoading(false);
                    })
                }
            }}
            onClear={() => {
                clearData();
            }}
        >
            {showPincodes && <ODAPincodeModal
                title={selectedElement?.destinationName}
                open={showPincodes}
                csvLink={csvLink}
                onClose={() => setShowPincodes(false)}
                pinCodeList={pinCodeList}
                setPinCodeList={setPinCodeList}
            />}
            <div className="custom-form-row row align-items-end">
                <div className="form-group col-md-6">
                    <AutoComplete
                        label="Freight Type"
                        mandatory
                        placeHolder="Select Freight Type"
                        value={userParams.freightType}
                        error={error.freightType}
                        options={freightTypeList}
                        isDisabled={editMode}
                        onChange={(element: any) => {
                            if (element.label === "FTL") {
                                setUserParams({
                                    ...userParams,
                                    freightType: element,
                                    modeType: ftlServiceabilityModeTypeList[0]
                                });
                            } else {
                                setUserParams({
                                    ...userParams,
                                    freightType: element
                                });
                            }

                            setError({});
                        }}
                    />
                </div>

                {(isPtl() && (editMode)) &&
                    <div className="form-group col-md-6">
                        <EditText
                            label="Serviceability Type"
                            mandatory
                            placeholder="Enter Serviceability Type"
                            maxLength={40}
                            disabled={true}
                            value={userParams.serviceabilityType}
                            onChange={() => { }}
                        />
                    </div>
                }

                {isPtl() === false &&
                    <div className="form-group col-md-6">
                        <AutoComplete
                            label={modLabel}
                            mandatory
                            placeHolder={modPlaceholder}
                            value={userParams.modeType}
                            isDisabled={editMode}
                            options={(userParams.freightType && userParams.freightType.label === FreightType.FTL) ? ftlServiceabilityModeTypeList : serviceabilityModeTypeList}
                            error={error.modeType}
                            onChange={(value: any) => {
                                setUserParams({
                                    ...userParams,
                                    modeType: value
                                })
                                setError({});
                            }}
                        />
                    </div>}

                {!(isZoneBasedPtl()) &&
                    <div className="form-group col-md-12">
                        <AutoSuggest
                            label="Lane"
                            mandatory
                            placeHolder="Select Lane"
                            value={userParams.laneName}
                            suggestions={laneList}
                            error={error.lane}
                            isDisabled={editMode}
                            onSelected={(value: OptionType) => {
                                setUserParams({
                                    ...userParams,
                                    laneName: value.label,
                                    laneCode: value.value,
                                    lane: value,
                                })
                                setError({});
                            }}
                            handleSuggestionsFetchRequested={({ value }: any) => {
                                if (value.length > autosuggestSearchLength) {
                                    getLaneList(value);
                                }
                            }}
                            onChange={(text: string) => {
                                setUserParams({
                                    ...userParams,
                                    laneName: text,
                                    laneCode: undefined,
                                    lane: undefined,
                                })
                                setError({});
                            }}
                        />
                    </div>}

                {!isZoneBasedPtl() && <div className="form-group col-md-6">
                    <EditText
                        label="Lane Code"
                        mandatory
                        placeholder="Enter Code"
                        maxLength={40}
                        disabled={true}
                        value={userParams.laneCode}
                        onChange={() => { }}
                    />
                </div>}

                {isPtl() &&
                    <div className="form-group col-md-6">
                        <AutoComplete
                            label={modLabel}
                            mandatory
                            placeHolder={modPlaceholder}
                            value={userParams.modeType}
                            isDisabled={editMode}
                            options={(userParams.freightType && userParams.freightType.label === FreightType.FTL) ? ftlServiceabilityModeTypeList : serviceabilityModeTypeList}
                            error={error.modeType}
                            onChange={(value: any) => {
                                setUserParams({
                                    ...userParams,
                                    modeType: value
                                })
                                setError({});
                            }}
                        />
                    </div>
                }
                {userParams.freightType && userParams.freightType.label === FreightType.FTL &&
                    <div className="form-group col-md-6">
                        <AutoComplete
                            label="Vehicle Type"
                            mandatory
                            isDisabled={editMode}
                            placeHolder="Vehicle Type"
                            value={userParams.vehicleType}
                            error={error.vehicleType}
                            options={setAutoCompleteListWithData(vehicleTypeList, "type", "code")}
                            onChange={(element: OptionType) => {
                                setUserParams({
                                    ...userParams,
                                    vehicleType: element,
                                })
                                setError({});
                            }}
                        />
                    </div>
                }
                <div className="form-group col-md-6">
                    <AutoSuggest
                        label={transporterLabel}
                        placeHolder={transporterPlaceHolder}
                        value={userParams.partnerName}
                        error={error.partner}
                        suggestions={partnerList}
                        isDisabled={editMode}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getPartnerList(value);
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setUserParams({
                                ...userParams,
                                partnerName: element.label,
                                partnerCode: element.value
                            })
                            setError({});
                        }}
                        onChange={(text: string) => {
                            setUserParams({
                                ...userParams,
                                partnerName: text,
                                partnerCode: ""
                            })
                            setError({});
                        }}
                    />
                </div>
                {isZoneBasedPtl() && editMode &&
                    <>
                        <div className="form-group col-md-6">
                            <EditText
                                label="Origin Zone"
                                mandatory
                                placeholder="Enter Origin Zone"
                                maxLength={40}
                                disabled={true}
                                value={userParams.originName}
                                onChange={() => { }}
                            />
                        </div>
                        <div className="form-group col-md-6 odaPincodeLabel">
                            <EditText
                                label="Destination Zone"
                                mandatory
                                placeholder="Enter Destination Zone"
                                maxLength={40}
                                disabled={true}
                                value={userParams.destinationName}
                                onChange={() => { }}
                            />
                            {/* eslint-disable-next-line */}
                            {selectedElement?.odaPincodeList?.length > 0 && <a href="#" onClick={() => setShowPincodes(true)}>ODA Pincodes</a>}
                        </div>
                    </>
                }
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
                <div className="form-group col-md-3 col-6">
                    <NumberEditText
                        label={""}
                        // mandatory
                        placeholder={tatPlaceholder}
                        value={userParams.tat}
                        allowNegative={false}
                        decimalSeparator={false}
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
                {selectedElement?.odaPincodeList?.length > 0 &&
                    <>
                        <div className="form-group col-md-3 col-6">
                            <AutoComplete
                                label={odaTatLabel}
                                placeHolder={odaTatPlaceholder}
                                value={odaTatValue}
                                options={tatOptions}
                                onChange={(element: OptionType) => {
                                    setOdaTatValue(element);
                                    setUserParams({
                                        ...userParams,
                                        odaTat: ""
                                    });
                                }}
                            />
                        </div>
                        <div className="form-group col-md-3 col-6">
                            <NumberEditText
                                label={""}
                                placeholder={odaTatPlaceholder}
                                value={userParams.odaTat}
                                allowNegative={false}
                                decimalSeparator={false}
                                maxLength={5}
                                onChange={(text: any) => {
                                    setUserParams({
                                        ...userParams,
                                        odaTat: Number(text)
                                    })
                                }}
                            />
                        </div>
                    </>}
                {
                    isZoneBasedPtl() &&
                    <div className="col-12 p-1" >
                        <Checkbox
                            className="custom-checkbox"
                            checked={userParams.isStrictlyOnPincode}
                            onChange={(e) => {
                                setUserParams({
                                    ...userParams,
                                    isStrictlyOnPincode: e.target.checked
                                });
                            }}
                            name="checked"
                        />
                        <span>Strictly on Pincode</span>
                    </div>
                }
            </div>


        </ModalContainer>
    );

    function getPartnerList(text: string) {
        appDispatch(searchClientPartner({ query: text })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteList(response, "partnerName", "partnerCode"))
            }
        });
    }
    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                setLaneList(setAutoCompleteList(response, "laneName", "laneCode"))
            }
        });
    }

    function clearData() {
        setUserParams({});
        setError({});
        setPinCodeList([]);
    }

    function validateData() {
        if (!isZoneBasedPtl() && userParams.laneCode === undefined) {
            setError({
                lane: errorLane
            });
            return false;
        } else if (isNullValue(userParams.freightType)) {
            setError({
                freightType: errorFreightType
            });
            return false;
        } else if (isNullValue(userParams.modeType)) {
            setError({
                modeType: errorModeType
            });
            return false;
        } else if (isNullValueOrZero(userParams.tat)) {
            setError({
                tat: errorTat
            });
            return false;
        } else if (userParams.freightType && userParams.freightType.label === FreightType.FTL && isNullValue(userParams.vehicleType)) {
            setError({
                vehicleType: vehicleTypeError
            });
            return false;
        } else if (isNullValue(userParams.partnerCode) && !isNullValue(userParams.partnerName)) {
            setError({
                partner: errorTransporter
            });
            return false;
        }
        return true;

    }
}

export default EnableServiceabilityModal;

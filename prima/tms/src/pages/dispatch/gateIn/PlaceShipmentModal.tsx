import { Collapse } from "@material-ui/core";
import { Add, AddBox, Edit, LocalShipping, Remove } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FreightType } from '../../../base/constant/ArrayList';
import {
    ConsigneeLabel, differentVehicleTypeErrorMessage, driverNameLabel, driverNamePlaceholder, driverNumberLabel,
    driverNumberPlaceholder, DropPointLabel, errorVehicleType, gateInDateTimeLabel, pickUpPointLabel,
    tatLabelWithoutUnit, TranspoterLabel, vehicleNumberHint, vehicleNumberPlaceholder, vehicleTypeChangePermissionMessage, VolumeLabel, WeightLabel
} from "../../../base/constant/MessageUtils";
import { convertDateTimeServerFormat, convertHoursInDays, displayDateTimeFormatter } from '../../../base/utility/DateUtils';
import { isNullValue, isObjectEmpty, vehicleNumberRegex } from '../../../base/utility/StringUtils';
import { VehicleNumberDisplayOption } from "../../../component/CommonView";
import Information from "../../../component/information/Information";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from '../../../component/widgets/EditText';
import NumberEditText from '../../../component/widgets/NumberEditText';
import { InfoTooltip } from "../../../component/widgets/tooltip/InfoTooltip";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import ModalContainer from '../../../modals/ModalContainer';
import ModifyVehicleModal from "../../../modals/ModifyVehicleModal";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { showAlert } from "../../../redux/actions/AppActions";
import { shipmentPlaced } from "../../../serviceActions/OrderServiceActions";
import { getVehicleDetails, searchVehicleList, validatePermission } from "../../../serviceActions/VehicleServiceActions";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import './GateIn.css';
import { createShipmentParams, validateGateInData } from "./GateInViewUtillity";
import TrackingAssetWarning from "./TrackingAssetWarning";
import VehicleModal from "./VehicleModal";

interface PlaceShipmentModalProps {
    open: boolean,
    onClose: any
    onSuccess: any,
    selectedElement: any,
    vehicleTemplate: any
    orderDetails: any
    setIsVehicleUpdated: Function
}

function PlaceShipmentModal(props: PlaceShipmentModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onSuccess, selectedElement, vehicleTemplate, orderDetails, setIsVehicleUpdated
    } = props;

    const [vehicleNumberList, setVehicleNumberList] = React.useState<Array<OptionType> | undefined>(undefined)
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
    const [shipmentDetails, setShipmentDetails] = React.useState<any>();
    const [disableSecondary, setDisableSecondary] = React.useState<boolean>(true);
    const [vehicleDetails, setVehicleDetails] = React.useState<any>();
    const [openVehicleModal, setOpenVehicleModal] = React.useState<boolean>(false);
    const [trackingWarning, setTrackingwarning] = React.useState<boolean>(false);
    const [isTrackable, setIsTrackable] = React.useState<boolean>(false);
    const [isModifyVehicleModalOpen, setIsModifyVehicleModalOpen] = React.useState<boolean>(false);
    const [vehicleType, setVehicleType] = useState<any>({});
    const [modify, setModify] = useState<any>(false);
    const userInfo = useSelector((state: any) => state.appReducer.userInfo, shallowEqual);
    const [vehicleTypeChange, setVehicleTypeChnagePermission] = useState<any>(false);
    useEffect(() => {
        const getData = async () => {
            if (open && selectedElement) {
                let userParams: any = {
                    originGateInTime: convertDateTimeServerFormat(new Date()),
                    freightOrderCode: selectedElement.freightOrderCode,
                    referenceId: selectedElement.referenceId,
                    startTrip: true
                }
                appDispatch(validatePermission({ userId: userInfo?.userId })).then((response: any) => {
                    if (response?.length > 0) {
                        const permission = response.find((item: any) => {
                            return item.code === "tms.freight-order.vehicle-type-change"
                        }
                        )
                        if (!isObjectEmpty(permission)) {
                            setVehicleTypeChnagePermission(true)
                        }
                    }
                })
                let selectedShipments = selectedElement.shipmentDetails
                    && selectedElement.shipmentDetails.filter((element: any) => element.checked === true);
                setShipmentDetails({
                    ...selectedElement,
                    // eslint-disable-next-line
                    shipmentDetails: selectedShipments

                });
                if (selectedShipments && selectedShipments[0]) {
                    if (selectedShipments[0].vehicleRegistrationNumber) {
                        userParams.primaryDriverName = selectedShipments[0].primaryDriverName;
                        userParams.primaryDriverNumber = selectedShipments[0].primaryDriverNumber;
                        userParams.vehicleRegistrationNumber = selectedShipments[0].vehicleRegistrationNumber
                        let requestParams = {
                            query: selectedShipments[0].vehicleRegistrationNumber,
                            vehicleTypeCode: selectedShipments && selectedShipments[0] && selectedShipments[0].vehicleTypeCode
                        }
                        appDispatch(searchVehicleList(requestParams)).then((response: any) => {
                            if (response.vehicles && response.vehicles[0]) {
                                setDisableSecondary(true);
                                setVehicleDetails(response.vehicles[0]);
                                setUserParams({
                                    ...userParams,
                                    vehicle: {
                                        label: response.vehicles[0].vehicleNumber,
                                        value: response.vehicles[0].vehicleCode,
                                        data: response.vehicles[0]
                                    },
                                })
                            } else {
                                setDisableSecondary(false);
                                setVehicleDetails({
                                    vehicleNumber: selectedShipments[0].vehicleRegistrationNumber,
                                    vehicleType: selectedShipments[0].vehicleTypeName,
                                    vehicleTypeCode: selectedShipments[0].vehicleTypeCode,
                                });
                                setUserParams(userParams);
                            }
                        });
                    } else {
                        setUserParams(userParams);
                    }
                } else {
                    setUserParams(userParams);
                }
                if (orderDetails.freightTypeCode === "FTL") {
                    let vehicleCode: any = selectedElement && selectedElement.shipmentDetails && selectedElement.shipmentDetails?.[0].vehicleCode
                    let vehicleTypeCode: any = selectedElement && selectedElement.shipmentDetails && selectedElement.shipmentDetails?.[0].vehicleTypeCode
                    vehicleCode && appDispatch(getVehicleDetails({
                        vehicleCode: vehicleCode,
                    })).then((response: any) => {
                        if (response && response.vehicleTypeCode)
                            setModify(vehicleTypeCode !== response.vehicleTypeCode)
                        setVehicleType({
                            label: response?.vehicleType,
                            value: response.vehicleTypeCode
                        })
                    })
                }

            }
        }
        open && getData();
        // eslint-disable-next-line
    }, [open]);
    return (
        open ?
            <div>
                <TrackingAssetWarning
                    open={trackingWarning}
                    isTrackable={isTrackable}
                    vehicleDetails={vehicleDetails}
                    addTrackingAsset={(data: any) => {
                        setTrackingwarning(false);
                        setOpenVehicleModal(true);
                        setUserParams({ ...userParams, addTrackingAssets: true })
                    }}
                    proceedAnyWay={() => {
                        setTrackingwarning(false);
                        placedOrder();
                    }}
                    onClose={() => {
                        setTrackingwarning(false);
                    }}
                />
                <VehicleModal
                    vehicleTemplate={vehicleTemplate}
                    open={openVehicleModal}
                    selectedElement={vehicleDetails}
                    inboundDetails={selectedElement}
                    placementDetails={userParams}
                    setIsVehicleUpdated={setIsVehicleUpdated}
                    freightTypeCode={selectedElement && selectedElement.freightTypeCode}
                    vehileTypeChangePermission={vehicleTypeChange}
                    onSuccess={(data: any) => {
                        setOpenVehicleModal(false);
                        setDisableSecondary(true);
                        setVehicleDetails(data);
                        setUserParams({ ...userParams, addTrackingAssets: false })
                        setValues({
                            vehicleRegistrationNumber: data && data.vehicleNumber,
                            vehicle: {
                                label: data && data.vehicleNumber,
                                value: data && data.vehicleCode,
                                data: data
                            },
                            updatedVehicle: {
                                label: data && data.vehicleType,
                                value: data && data.vehicleTypeCode,
                                data: data
                            }
                        });
                    }}
                    onClose={() => {
                        setOpenVehicleModal(false)
                        setUserParams({ ...userParams, addTrackingAssets: false })
                    }} />
                <ModifyVehicleModal
                    open={isModifyVehicleModalOpen}
                    onClose={toggleModifyVehicleModal}
                    onSuccess={() => {
                        setModify(false);
                        setIsModifyVehicleModalOpen(false);
                        setDisableSecondary(true);
                        let requestParams = {
                            query: selectedElement && selectedElement.shipmentDetails && selectedElement.shipmentDetails?.[0].vehicleCodevehicleRegistrationNumber,
                            vehicleTypeCode: vehicleType.value
                        }
                        appDispatch(searchVehicleList(requestParams)).then((response: any) => {
                            if (response.vehicles && response.vehicles[0]) {
                                setDisableSecondary(true);
                                setVehicleDetails(response.vehicles[0]);
                                setUserParams({
                                    ...userParams,
                                    vehicle: {
                                        label: response.vehicles[0].vehicleNumber,
                                        value: response.vehicles[0].vehicleCode,
                                        data: response.vehicles[0]
                                    },
                                })
                            }
                        })
                    }}
                    selectedNewVehicleType={vehicleType}
                    orderDetails={orderDetails}
                    setIsVehicleUpdated={setIsVehicleUpdated}
                    userParams={userParams}
                />
                <ModalContainer
                    title={"Place Shipment "}
                    primaryButtonTitle={"Place "}
                    primaryButtonLeftIcon={<LocalShipping />}
                    secondaryButtonTitle={"Create Vehicle"}
                    secondaryButtonLeftIcon={<AddBox />}
                    secondaryButtonDisable={modify ? true : disableSecondary}
                    tertiaryButtonTitle={orderDetails.freightTypeCode === "FTL" ? "Modify" : ""}
                    tertiaryButtonLeftIcon={<Edit />}
                    tertiaryButtonDisable={!modify}
                    onClickTertiary={toggleModifyVehicleModal}
                    loading={loading}
                    open={open}
                    onClose={() => {
                        clearData()
                        onClose();
                    }}
                    onApply={() => {
                        if (orderDetails.freightTypeCode === "FTL" && modify) {
                            appDispatch(showAlert(errorVehicleType, false))
                            return
                        }
                        const validate = validateGateInData(userParams, selectedElement.freightTypeCode);
                        if (validate === true) {
                            if (!isNullValue(userParams.vehicleRegistrationNumber)) {
                                if (!vehicleDetails || !(vehicleDetails.trackingAsset && vehicleDetails.trackingAsset.trackingVendor)) {
                                    setIsTrackable(false);
                                } else {
                                    setIsTrackable(true);
                                }
                                setTrackingwarning(true);
                            } else {
                                placedOrder();
                            }
                        } else {
                            setError(validate);
                        }
                    }}
                    onClear={() => {
                        let requestParams = {
                            vehicleNumber: userParams.vehicleRegistrationNumber,
                        };
                        appDispatch(searchVehicleList(requestParams)).then((response: any) => {
                            if (response.vehicles && response.vehicles[0] && response.vehicles[0].vehicleType !== selectedElement.vehicleTypeName) {
                                appDispatch(showAlert(differentVehicleTypeErrorMessage, false));
                                setVehicleType({
                                    label: response.vehicles[0]?.vehicleType,
                                    value: response.vehicles[0]?.vehicleTypeCode
                                })
                                setModify(true);
                            } else {
                                setOpenVehicleModal(true);
                            }
                        })
                    }}
                    styleName="shipment-modal"
                >
                    <LanePointsDisplayModal
                        open={openPointModal}
                        laneCode={selectedElement && selectedElement.laneCode}
                        onClose={() => {
                            setOpenPointModal(false)
                        }} />
                    <div className="order-detail-wrapper shipment-detail-wrap">
                        {shipmentDetails && shipmentDetails.shipmentDetails.map((element: any, index: number) => (
                            <>
                                <div
                                    key={index}
                                    className="shipment-modal-header">
                                    <h4><span>Shipment Code:</span> {element.freightShipmentCode}</h4>
                                    <span onClick={() => {
                                        let shipmentList = shipmentDetails.shipmentDetails.map((innerElement: any) => (
                                            (innerElement.freightShipmentCode === element.freightShipmentCode) ? {
                                                ...innerElement,
                                                showDetails: innerElement.showDetails ? !innerElement.showDetails : true,
                                            } : {
                                                ...innerElement,
                                                showDetails: false
                                            }
                                        ));
                                        setShipmentDetails((prev: any) => ({
                                            ...prev,
                                            shipmentDetails: shipmentList
                                        }))
                                    }}>
                                        {
                                            element.showDetails === true ? <Remove /> : <Add />
                                        }
                                    </span>
                                </div>
                                <Collapse in={element.showDetails} timeout="auto" unmountOnExit>
                                    <div className="custom-form-row row">
                                        <div className="col-md-6 billing-group col-6">
                                            <Information
                                                title={pickUpPointLabel}
                                                customView={
                                                    <InfoTooltip
                                                        title={element.pickupLocationName || "....."}
                                                        placement={"top"}
                                                        disableInMobile={"false"}
                                                        infoText={element.pickupLocationName || "....."}
                                                    />
                                                }
                                            />
                                        </div>
                                        <div className="col-md-6 billing-group col-6">
                                            <Information
                                                title={DropPointLabel}
                                                customView={
                                                    <InfoTooltip
                                                        title={element.dropLocationName || "....."}
                                                        placement={"top"}
                                                        disableInMobile={"false"}
                                                        infoText={element.dropLocationName || "....."}
                                                    />
                                                }
                                            />
                                        </div>
                                        <div className="col-md-6 billing-group col-6">
                                            <Information
                                                title={tatLabelWithoutUnit}
                                                text={element.tat && convertHoursInDays(element.tat)}
                                            />
                                        </div>
                                        <div className="col-md-6 billing-group col-6">
                                            <Information
                                                title={VolumeLabel}
                                                text={element.totalShipmentVolume}
                                            />
                                        </div>
                                        <div className="col-md-6 billing-group col-6">
                                            <Information
                                                title={WeightLabel}
                                                text={element.totalShipmentWeight}
                                            />
                                        </div>
                                        <div className="col-md-6 billing-group col-6">
                                            <Information
                                                title={TranspoterLabel}
                                                text={element.partnerName}
                                            />
                                        </div>
                                        <div className="col-md-6 billing-group col-6">
                                            <Information
                                                title={ConsigneeLabel}
                                                text={element.consigneeName}
                                            />
                                        </div>
                                    </div>

                                </Collapse>
                            </>
                        ))}
                    </div>

                    <div className="shipment-create">
                        <div className="custom-form-row row">
                            <div className="form-group col-md-6 auto-suggest">
                                <AutoSuggest
                                    label={vehicleNumberHint}
                                    mandatory={selectedElement.freightTypeCode === FreightType.FTL}
                                    maxLength={20}
                                    placeHolder={vehicleNumberPlaceholder}
                                    value={userParams.vehicleRegistrationNumber}
                                    error={error.vehicleRegistrationNumber}
                                    suggestions={vehicleNumberList}
                                    renderOption={(optionProps: any) => <VehicleNumberDisplayOption optionProps={optionProps} />}
                                    handleSuggestionsFetchRequested={({ value }: any) => {
                                        if (value.length > autosuggestSearchLength) {
                                            getVehicleList(value);
                                        }
                                    }}
                                    onSelected={(element: OptionType) => {
                                        setValues({
                                            vehicleRegistrationNumber: element.label,
                                            vehicle: element,
                                        });
                                        setVehicleDetails(element.data)
                                        setDisableSecondary(true)
                                    }}
                                    onChange={(text: string) => {
                                        setModify(false)
                                        setValues({
                                            vehicleRegistrationNumber: vehicleNumberRegex(text),
                                            vehicle: undefined
                                        });
                                        if (selectedElement && selectedElement.freightTypeCode === "FTL") {
                                            setVehicleDetails({
                                                vehicleNumber: vehicleNumberRegex(text),
                                                vehicleType: shipmentDetails && shipmentDetails.shipmentDetails && shipmentDetails.shipmentDetails[0]
                                                    && shipmentDetails.shipmentDetails[0].vehicleTypeName,
                                            });
                                        } else {
                                            setVehicleDetails({
                                                vehicleNumber: vehicleNumberRegex(text),
                                            });
                                        }

                                        setDisableSecondary(isNullValue(text));
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-6 input-space">
                                <EditText
                                    label={driverNameLabel}
                                    placeholder={driverNamePlaceholder}
                                    maxLength={25}
                                    mandatory={selectedElement.freightTypeCode === FreightType.FTL}
                                    value={userParams.primaryDriverName}
                                    error={error.primaryDriverName}
                                    onChange={(text: any) => {
                                        setValues({
                                            primaryDriverName: text,
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-6 input-space">
                                <NumberEditText
                                    label={driverNumberLabel}
                                    placeholder={driverNumberPlaceholder}
                                    maxLength={10}
                                    mandatory={selectedElement.freightTypeCode === FreightType.FTL}
                                    decimalSeparator={false}
                                    value={userParams.primaryDriverNumber}
                                    error={error.primaryDriverNumber}
                                    onChange={(text: any) => {
                                        setValues({
                                            primaryDriverNumber: text,
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-6 input-space">
                                <EditText
                                    label={"Waybill Number"}
                                    placeholder={"Enter Waybill Number"}
                                    maxLength={50}
                                    value={userParams.airwaybillNumber}
                                    error={error.airwaybillNumber}
                                    onChange={(text: any) => {
                                        setValues({
                                            airwaybillNumber: text,
                                        });
                                    }}
                                />
                            </div>

                            <div className="form-group col-md-6">
                                <label className="picker-label">{gateInDateTimeLabel} <span className="mandatory-flied">*</span></label>
                                <DateTimePicker
                                    className="custom-date-picker"
                                    placeholder="From Date"
                                    hiddenLabel
                                    disableFuture
                                    helperText={error.originGateInTime}
                                    format={displayDateTimeFormatter}
                                    value={userParams.originGateInTime}
                                    onChange={(date: any) => {
                                        setValues({ originGateInTime: convertDateTimeServerFormat(date) });
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                </ModalContainer >
            </div>
            : null
    );

    function placedOrder() {
        setLoading(true);
        let UserRolesAndPermissionsParams = createShipmentParams(userParams, shipmentDetails.shipmentDetails);
        appDispatch(shipmentPlaced(UserRolesAndPermissionsParams)).then((response: any) => {
            if (response) {
                response.message && appDispatch(showAlert(response.message));
                clearData();
                onSuccess();
            }
            setLoading(false);
        });
    }

    function clearData() {
        setVehicleNumberList(undefined);
        setUserParams({});
        setError({});
        setVehicleDetails(undefined);
        setDisableSecondary(true);
        setShipmentDetails(undefined);
    }

    function toggleModifyVehicleModal() {
        if (vehicleTypeChange) {
            setIsModifyVehicleModalOpen(!isModifyVehicleModalOpen)
        } else {
            appDispatch(showAlert(vehicleTypeChangePermissionMessage, false))
        }
    }
    function setValues(params: any) {
        setUserParams({
            ...userParams,
            ...params
        });
        setError({});
    }
    function getVehicleList(text: string) {
        let requestParams: any = {
            query: text,
        }
        if (selectedElement && (selectedElement.freightTypeCode === FreightType.FTL)) {
            requestParams.vehicleTypeCode = selectedElement.shipmentDetails && selectedElement.shipmentDetails[0] && selectedElement.shipmentDetails[0].vehicleTypeCode;
        }
        appDispatch(searchVehicleList(requestParams)).then((response: any) => {
            if (response) {
                setVehicleNumberList(setAutoCompleteListWithData(response.vehicles, "vehicleNumber", "vehicleCode"))
            }
        });
    }
}

export default PlaceShipmentModal;
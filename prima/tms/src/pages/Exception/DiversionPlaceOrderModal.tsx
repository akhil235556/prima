import { Collapse } from "@material-ui/core";
import { Add, LocalShipping, Remove } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { diversionTabEnum, FreightType } from '../../base/constant/ArrayList';
import {
    ConsigneeLabel, driverNameLabel, driverNamePlaceholder, driverNumberLabel,
    driverNumberPlaceholder, DropPointLabel, errorDriverName, errorDriverNumber, errorFutureDateTimeError, errorVehicleNumber, gateInDateTimeLabel, pickUpPointLabel,
    tatLabelWithoutUnit, TranspoterLabel, vehicleExisterror, vehicleNumberHint, vehicleNumberPlaceholder,
    VolumeLabel, WeightLabel
} from "../../base/constant/MessageUtils";
import * as Path from '../../base/constant/RoutePath';
import { convertDateTimeServerFormat, convertHoursInDays, displayDateTimeFormatter, isDateGreater } from '../../base/utility/DateUtils';
import { isNullValue, isValidMobileNumber, vehicleNumberRegex } from '../../base/utility/StringUtils';
import { VehicleNumberDisplayOption } from "../../component/CommonView";
import Information from "../../component/information/Information";
import AutoSuggest from "../../component/widgets/AutoSuggest";
import CardContentSkeleton from "../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import EditText from '../../component/widgets/EditText';
import NumberEditText from '../../component/widgets/NumberEditText';
import { OptionType } from "../../component/widgets/widgetsInterfaces";
import ModalContainer from '../../modals/ModalContainer';
import { autosuggestSearchLength } from "../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from '../../moduleUtility/DataUtils';
import { showAlert } from "../../redux/actions/AppActions";
import { diversionPlaceOrder } from "../../serviceActions/OrderServiceActions";
import { searchVehicleList } from "../../serviceActions/VehicleServiceActions";
import '../dispatch/gateIn/GateIn.css';
import LanePointsDisplayModal from "../masterPlatform/lane/LanePointsDisplayModal";

interface PlaceShipmentModalProps {
    open: boolean,
    onClose: any
    onSuccess: any,
    selectedElement: any,
    requestId: any
    id: any
    diversionDetails: any
}

function DiversionPlaceOrderModal(props: PlaceShipmentModalProps) {
    const appDispatch = useDispatch();
    const history = useHistory()
    const { open, onClose, onSuccess, selectedElement, requestId, id, diversionDetails } = props;
    const [vehicleNumberList, setVehicleNumberList] = React.useState<Array<OptionType> | undefined>(undefined)
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
    const [shipmentDetails, setShipmentDetails] = React.useState<any>();

    useEffect(() => {
        const getData = async () => {
            if (open && selectedElement) {
                let userParams: any = {
                    originGateInTime: convertDateTimeServerFormat(new Date()),
                    freightOrderCode: selectedElement.freightOrderCode,
                    referenceId: selectedElement.referenceId,
                    startTrip: true
                }

                let selectedShipments = selectedElement.shipmentDetails
                    && selectedElement.shipmentDetails.filter((element: any) => element.shipmentStatusName !== "CANCELLED");
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
                                setUserParams({
                                    ...userParams,
                                    vehicle: {
                                        label: response.vehicles[0].vehicleNumber,
                                        value: response.vehicles[0].vehicleCode,
                                        data: response.vehicles[0]
                                    }
                                })
                            } else {
                                setUserParams(userParams);
                            }
                        });
                    } else {
                        setUserParams(userParams);
                    }
                } else {
                    setUserParams(userParams);
                }
            }
        }
        open && getData();
        // eslint-disable-next-line
    }, [open]);

    return (
        open ?
            <div>
                <ModalContainer
                    title={"Place Order "}
                    primaryButtonTitle={"Place "}
                    primaryButtonLeftIcon={<LocalShipping />}
                    loading={loading}
                    open={open}
                    onClose={() => {
                        clearData()
                        onClose();
                    }}
                    onApply={() => {
                        const validate = validateData(userParams, selectedElement.freightTypeCode)
                        if (validate === true) {
                            placedOrder()
                        } else {
                            setError(validate)
                        }
                    }}
                    onClear={() => {
                    }}
                    styleName="shipment-modal"
                >
                    <LanePointsDisplayModal
                        open={openPointModal}
                        laneCode={selectedElement && selectedElement.laneCode}
                        onClose={() => {
                            setOpenPointModal(false)
                        }} />
                    {loading ?
                        <CardContentSkeleton
                            row={4}
                            column={2}
                        /> :
                        <>
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
                                                        text={element.pickupLocationName}
                                                    />
                                                </div>
                                                <div className="col-md-6 billing-group col-6">
                                                    <Information
                                                        title={DropPointLabel}
                                                        text={element.dropLocationName}
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
                                            isDisabled
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
                                            }}
                                            onChange={(text: string) => {
                                                setValues({
                                                    vehicleRegistrationNumber: vehicleNumberRegex(text),
                                                    vehicle: undefined
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-6 input-space">
                                        <EditText
                                            label={driverNameLabel}
                                            placeholder={driverNamePlaceholder}
                                            maxLength={25}
                                            disabled
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
                                            disabled
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
                                            disabled
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
                                            disabled
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
                        </>
                    }
                </ModalContainer >
            </div>
            : null
    );

    function placedOrder() {
        setLoading(true);
        const params = {
            requestId: requestId,
            id: id,
        }
        appDispatch(diversionPlaceOrder(params)).then((response: any) => {
            if (response) {
                response.message && appDispatch(showAlert(response.message));
                if (diversionDetails && diversionDetails.oldFoLastStatus === "PLACED") {
                    history.push(Path.DiversionUrl + diversionTabEnum.COMPLETED)
                }
                clearData();
                onSuccess()
            }
            setLoading(false);
        })
    }

    function clearData() {
        setVehicleNumberList(undefined);
        setUserParams({});
        setError({});
        setShipmentDetails(undefined);
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

    function validateData(userParams: any, freightType: any) {
        if (!isNullValue(userParams.primaryDriverName) || !isNullValue(userParams.primaryDriverNumber) || freightType === FreightType.FTL) {
            if (isNullValue(userParams.vehicleRegistrationNumber)) {
                return { vehicleRegistrationNumber: !isNullValue(userParams.vehicleRegistrationNumber) ? vehicleExisterror : errorVehicleNumber };
            } else if (isNullValue(userParams.primaryDriverName)) {
                return { primaryDriverName: errorDriverName };
            } else if (isNullValue(userParams.primaryDriverNumber) || !isValidMobileNumber(userParams.primaryDriverNumber)) {
                return { primaryDriverNumber: errorDriverNumber };
            }
        }
        if (freightType === FreightType.PTL && isNullValue(userParams.vehicle) && isNullValue(userParams.airwaybillNumber)) {
            return { airwaybillNumber: "Enter valid airwaybillNumber" };
        } else if (isNullValue(userParams.originGateInTime)) {
            return { originGateInTime: "Select valid gate in time" };
        } else if (userParams.originGateInTime && isDateGreater(userParams.originGateInTime, new Date())) {
            return { originGateInTime: errorFutureDateTimeError };
        }
        return true;
    }

}

export default DiversionPlaceOrderModal;

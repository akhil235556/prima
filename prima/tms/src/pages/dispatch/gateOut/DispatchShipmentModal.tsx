import { Checkbox, Collapse } from "@material-ui/core";
import {
    Add,
    CheckCircle,
    Info,
    LocalShipping,
    PictureAsPdf,
    Remove
} from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { DocType } from "../../../base/constant/ArrayList";
import {
    ConsigneeLabel,
    DropPointLabel,
    errorFutureDateTimeError,
    gateOutDateTimeLabel,
    invoiceValueLabel,
    invoiceValuePlaceholder,
    lrNumber,
    lrNumberPlaceHolder,
    numberofCartonsPlaceholder,
    numberofCartonsValueLabel,
    pickUpPointLabel,
    referenceIdLabel,
    referenceIdPlaceholder,
    tatLabelWithoutUnit,
    TranspoterLabel,
    VolumeLabel,
    waybillNoLabel,
    waybillNoPlaceholder,
    WeightLabel
} from "../../../base/constant/MessageUtils";
import { ElrReceiptUrl } from "../../../base/constant/RoutePath";
import {
    convertDateTimeServerFormat,
    convertHoursInDays,
    displayDateTimeFormatter,
    isDateGreater
} from "../../../base/utility/DateUtils";
import { isNullValue } from "../../../base/utility/StringUtils";
import Information from "../../../component/information/Information";
import Button from "../../../component/widgets/button/Button";
import { CustomToolTip } from "../../../component/widgets/CustomToolTip";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from "../../../component/widgets/NumberEditText";
import { InfoTooltip } from "../../../component/widgets/tooltip/InfoTooltip";
import ModalContainer from "../../../modals/ModalContainer";
import { getDocList } from "../../../serviceActions/DasServiceActions";
import { shipmentOut } from "../../../serviceActions/OrderServiceActions";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";

interface DispatchShipmentModalProps {
    open: boolean;
    onClose: any;
    onSuccess: any;
    selectedElement: any;
    selectedShipmentDetails: any;
    isDiversion?: any;
}
function DispatchShipmentModal(props: DispatchShipmentModalProps) {
    const appDispatch = useDispatch();
    const history = useHistory();
    const {
        open,
        onClose,
        selectedElement = {},
        selectedShipmentDetails,
    } = props;
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
    const [lrDialog, SetLrDialog] = React.useState<string>("");
    const [shipmentDetails, setShipmentDetails] = React.useState<any>();

    React.useEffect(() => {
        if (open && selectedElement) {
            setShipmentDetails({
                ...selectedElement,
                shipmentDetails: selectedShipmentDetails,
            });
            setUserParams({
                ...selectedElement,
                originGateOutTime: convertDateTimeServerFormat(new Date()),
                startTrip: false,
                lrNumberObjList: selectedElement?.shipmentDetails?.map((shipment: any) => (
                    {
                        shipmentCode: shipment?.freightShipmentCode,
                        lrNumber: shipment?.lrNumber
                    }
                ))
            });
        }
        // eslint-disable-next-line
    }, [open]);

    return (
        <ModalContainer
            title={"Shipment Detail"}
            open={open}
            loading={loading}
            primaryButtonStyle="btn-orange"
            primaryButtonTitle={isNullValue(lrDialog) ? "" : "Print E LR"}
            primaryButtonLeftIcon={<PictureAsPdf />}
            onClose={() => {
                clearData();
                onClose(lrDialog ? true : false);
                SetLrDialog("");
            }}
            onApply={() => {
                let params: any = {
                    entityId: selectedElement.freightOrderCode,
                    entityType: DocType.ELR,
                };
                setLoading(true);
                appDispatch(getDocList(params)).then((response: any) => {
                    // eslint-disable-next-line
                    if (response && response.length > 0) {
                        response.forEach((item: any) => {
                            window.open(item.documentLink);
                        })
                        onClose(true);
                    } else {
                        let querParams = "";
                        // eslint-disable-next-line
                        shipmentDetails.shipmentDetails.map((element: any, index: number) => {
                            querParams += element.freightShipmentCode + ((index + 1) < shipmentDetails.shipmentDetails.length ? "," : "");
                        });
                        history.push({
                            pathname: ElrReceiptUrl + selectedElement.freightOrderCode,
                            search: "?enable=back&shipmentCode=" + querParams,
                        });
                    }
                    setLoading(false);
                });
            }}
            styleName={
                isNullValue(lrDialog) ? "shipment-modal" : "message-modal success"
            }
        >
            {isNullValue(lrDialog) ? (
                <div>
                    <LanePointsDisplayModal
                        open={openPointModal}
                        laneCode={selectedElement.laneCode}
                        onClose={() => {
                            setOpenPointModal(false);
                        }}
                    />
                    <div className="order-detail-wrapper shipment-detail-wrap">
                        {shipmentDetails &&
                            shipmentDetails.shipmentDetails.map(
                                (element: any, index: number) => (
                                    <>
                                        <div className="shipment-modal-header">
                                            <h4>
                                                <span>Shipment Code:</span>{" "}
                                                {element.freightShipmentCode}
                                            </h4>
                                            <span
                                                onClick={() => {
                                                    let shipmentList =
                                                        shipmentDetails.shipmentDetails.map(
                                                            (innerElement: any) =>
                                                                innerElement.freightShipmentCode ===
                                                                    element.freightShipmentCode
                                                                    ? {
                                                                        ...innerElement,
                                                                        showDetails: innerElement.showDetails
                                                                            ? !innerElement.showDetails
                                                                            : true,
                                                                    }
                                                                    : {
                                                                        ...innerElement,
                                                                        showDetails: false,
                                                                    }
                                                        );
                                                    setShipmentDetails((prev: any) => ({
                                                        ...prev,
                                                        shipmentDetails: shipmentList,
                                                    }));
                                                }}
                                            >
                                                {element.showDetails === true ? <Remove /> : <Add />}
                                            </span>
                                        </div>
                                        <Collapse
                                            in={element.showDetails}
                                            timeout="auto"
                                            unmountOnExit
                                        >
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
                                                        text={
                                                            element.tat && convertHoursInDays(element.tat)
                                                        }
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
                                                <div className="col-md-12 mt-2">
                                                    <Information
                                                        title={ConsigneeLabel}
                                                        text={element.consigneeName}
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="row shipment-waybillColumn">
                                                        <div className="input-lrn col-md-6 col-6">
                                                            <EditText
                                                                label={lrNumber}
                                                                placeholder={lrNumberPlaceHolder}
                                                                maxLength={50}
                                                                value={userParams?.lrNumberObjList?.[index]?.lrNumber}
                                                                onChange={(text: any) => {
                                                                    let res = userParams?.lrNumberObjList || [];
                                                                    if (res[index]) {
                                                                        res[index].lrNumber = text.trim();
                                                                    }
                                                                    setValues({
                                                                        lrNumberObjList: res
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                        {/*<div className="col-md-6 billing-group col-6">
                                            <EditText
                                                label={invoiceNumberLabel}
                                                placeholder={invoiceNumberLabel}
                                                maxLength={20}
                                                value={element.invoiceNumber}
                                                onChange={(value: any) => {
                                                    onChangeShipmentValues(element, "invoiceNumber", value)
                                                }}
                                            />
                                            </div>*/}
                                                        <div className="col-md-6 col-6">
                                                            <EditText
                                                                label={waybillNoLabel}
                                                                placeholder={waybillNoPlaceholder}
                                                                maxLength={25}
                                                                value={element?.airwaybillNumber}
                                                                onChange={(text: string) => {
                                                                    onChangeShipmentValues(
                                                                        element,
                                                                        "airwaybillNumber",
                                                                        text
                                                                    );

                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-md-6 col-6 mt-3">
                                                            <NumberEditText
                                                                label={invoiceValueLabel}
                                                                placeholder={invoiceValuePlaceholder}
                                                                maxLength={15}
                                                                value={element.shipmentInvoiceValue}
                                                                onChange={(value: any) => {
                                                                    onChangeShipmentValues(
                                                                        element,
                                                                        "shipmentInvoiceValue",
                                                                        parseFloat(value)
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-md-6 col-6 mt-3">
                                                            <NumberEditText
                                                                label={numberofCartonsValueLabel}
                                                                placeholder={numberofCartonsPlaceholder}
                                                                maxLength={8}
                                                                decimalSeparator={false}
                                                                value={element.noOfCartons}
                                                                onChange={(value: any) => {
                                                                    onChangeShipmentValues(
                                                                        element,
                                                                        "noOfCartons",
                                                                        Number(value)
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Collapse>
                                    </>
                                )
                            )}
                    </div>
                    <div className="shipment-create">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label className="picker-label">{gateOutDateTimeLabel}</label>
                                <DateTimePicker
                                    className="custom-date-picker"
                                    placeholder="From Date"
                                    hiddenLabel
                                    disableFuture
                                    helperText={error.originGateOutTime}
                                    format={displayDateTimeFormatter}
                                    value={userParams.originGateOutTime}
                                    onChange={(date: any) => {
                                        setValues({
                                            originGateOutTime: convertDateTimeServerFormat(date),
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <EditText
                                    label={referenceIdLabel}
                                    placeholder={referenceIdPlaceholder}
                                    maxLength={50}
                                    value={userParams.referenceId}
                                    onChange={(text: any) => {
                                        setValues({
                                            referenceId: text,
                                        });
                                    }}
                                />
                            </div>
                            {/* <div className="input-lrn form-group col-md-6">
                                <EditText
                                    label={lrNumber}
                                    placeholder={lrNumberPlaceHolder}
                                    maxLength={50}
                                    value={userParams.lrNumber}
                                    onChange={(text: any) => {
                                        setValues({
                                            lrNumber: text.trim(),
                                        });
                                    }}
                                />
                            </div> */}
                            <div className="pT-20 form-group col-md-6">
                                <div className="d-flex align-items-center">
                                    <Checkbox
                                        className="custom-checkbox"
                                        checked={userParams.startTrip}
                                        onChange={(e) => {
                                            setValues({
                                                startTrip: e.target.checked,
                                            });
                                        }}
                                        name="checked"
                                    />
                                    <span className="start-trip">Start Trip</span>
                                    <CustomToolTip
                                        title="Start Trip manually by overriding the geofence"
                                        disableInMobile="false"
                                    >
                                        <Info className="blue-text info-icon" />
                                    </CustomToolTip>
                                </div>
                            </div>

                            <div className="col-md-12 text-right">
                                <Button
                                    buttonStyle="btn-blue"
                                    title="Dispatch"
                                    loading={loading}
                                    leftIcon={<LocalShipping />}
                                    onClick={() => {
                                        if (isNullValue(userParams.originGateOutTime)) {
                                            setError({
                                                originGateOutTime: "Enter valid gate out date and time",
                                            });
                                            return;
                                        } else if (
                                            userParams.originGateOutTime &&
                                            isDateGreater(userParams.originGateOutTime, new Date())
                                        ) {
                                            setError({ originGateOutTime: errorFutureDateTimeError });
                                            return;
                                        }
                                        placedOrder();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    {<CheckCircle />}
                    <h2 className={"content-heading success"}>{"Success"}</h2>
                    <label>{lrDialog}</label>
                </div>
            )}
        </ModalContainer>
    );

    function placedOrder() {
        setLoading(true);
        let params = {
            freightOrderCode: userParams.freightOrderCode,
            freightShipmentCodes:
                shipmentDetails &&
                shipmentDetails.shipmentDetails &&
                shipmentDetails.shipmentDetails.map((element: any) => {
                    return element.freightShipmentCode;
                }),
            originGateOutTime: userParams.originGateOutTime,
            referenceId: userParams.referenceId,
            // lrNumber: userParams.lrNumber,
            startTrip: userParams.startTrip,
            //invoiceNumber: shipmentDetails.invoiceNumber,
            articleInvoiceDetails:
                shipmentDetails &&
                shipmentDetails.shipmentDetails &&
                shipmentDetails.shipmentDetails.map((element: any) => {
                    return {
                        //invoiceNumber: element.invoiceNumber,
                        invoiceValue: element.shipmentInvoiceValue,
                        freightShipmentCode: element.freightShipmentCode,
                    };
                }),
            freightShipmentMinDetails:
                shipmentDetails &&
                shipmentDetails.shipmentDetails &&
                shipmentDetails.shipmentDetails.map((element: any) => {
                    return {
                        shipmentInvoiceValue: element.shipmentInvoiceValue,
                        noOfCartons: element.noOfCartons,
                        freightShipmentCode: element.freightShipmentCode,
                        airwaybillNumber: element?.airwaybillNumber
                    };
                }),
            lrNumberObjList: userParams?.lrNumberObjList
        };
        appDispatch(shipmentOut(params)).then((response: any) => {
            if (response) {
                response.message && SetLrDialog(response.message);
            }
            setLoading(false);
        });
    }

    function onChangeShipmentValues(selectedShipment: any, key: any, value: any) {
        let shipmentDeatils = shipmentDetails.shipmentDetails.map(
            (innerElement: any) =>
                innerElement.freightShipmentCode ===
                    selectedShipment.freightShipmentCode
                    ? {
                        ...innerElement,
                        [key]: value,
                    }
                    : {
                        ...innerElement,
                    }
        );
        setShipmentDetails({
            shipmentDetails: shipmentDeatils,
        });
    }

    function clearData() {
        setUserParams({});
        setError({});
    }

    function setValues(params: any) {
        setUserParams({
            ...userParams,
            ...params,
        });
        setError({});
    }
}

export default DispatchShipmentModal;

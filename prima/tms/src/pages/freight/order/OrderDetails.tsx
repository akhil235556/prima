import { Card, CardContent, CardHeader, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { AddCircle, CloseOutlined, Info, KeyboardBackspace, Mail, Person } from '@material-ui/icons';
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { FreightType, OrderStatus } from '../../../base/constant/ArrayList';
import {
    appointmentDateTimeLabel, CancelledBy, cancelledRemarkLabel, contractId, freightTypeLabel, lanePriceLabel, LBHLabel, MaterialLabel, modLabel, numberOfBoxes, orderCodeLabel, orderCreationDateTime, referenceIdLabel,
    remarkLabel, tatLabelWithoutUnit, transporterLabel, vehicleNumberLabel, vehicleTypeHint, VolumeLabel, zoneLaneTitle
} from '../../../base/constant/MessageUtils';
import { convertDateFormat, convertHoursInDays, displayDateTimeFormatter } from '../../../base/utility/DateUtils';
import { isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import { LaneView } from '../../../component/CommonView';
import DataNotFound from "../../../component/error/DataNotFound";
import Filter from '../../../component/filter/Filter';
import Information from "../../../component/information/Information";
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from '../../../component/widgets/button/Button';
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomToolTip } from "../../../component/widgets/CustomToolTip";
import { InfoTooltip } from '../../../component/widgets/tooltip/InfoTooltip';
import LoaderModal from '../../../modals/loaderModal/LoaderModal';
import WarningModal from '../../../modals/warningModal/WarningModal';
import { setAutoCompleteList } from '../../../moduleUtility/DataUtils';
import { showAlert } from '../../../redux/actions/AppActions';
import { getEditShipmentConfig } from '../../../serviceActions/ConfigServiceActions';
import { getYmsNodeConfigStatus } from '../../../serviceActions/InplantServiceActions';
// import { showAlert } from '../../../redux/actions/AppActions';
import { cancelInvoice, getOrderList, getOrderLogList, getPrintInvoice, getShipmentTagList } from "../../../serviceActions/OrderServiceActions";
// import { getLrNumberListDetails } from '../../../serviceActions/ServiceabilityServiceActions';
import ContractDetailModal from "../../indentManagement/indent/ContractDetailModal";
import ViewPodModal from '../../invoice/ViewPodModal';
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import { getDOList, getDoMaterialList } from '../demandOrders/demandOrdersApi/demandOrderServiceActions';
import CancelShipment from './CancelShipment';
import MarkDelivered from './MarkDelivered';
import MaterialTableModal from './MaterialTableModal';
import OrderCancelModal from "./OrderCancelModal";
import './OrderDetails.css';
import OrderPrintAction from "./orderPrintAction/OrderPrintAction";
import OrderShipmentModal from "./OrderShipmentModal";
import { getMode } from './OrderViewUtility';
import ReportShipmentVehicle from './ReportShipmentVehicle';
import ViewElrModal from './ViewElrModal';


function OrderDetails() {
    const appDispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams<any>();
    const demandOrderCode = new URLSearchParams(useLocation().search).get("demandOrderCode");
    const [loading, setLoading] = React.useState<boolean>(false);
    const [refresh, setRefresh] = React.useState<boolean>(false);
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
    const [openActionPoint, setOpenActionPoint] = React.useState<boolean>(false);
    const [openCancelModal, setOpenCancelModal] = React.useState<boolean>(false);
    const [openDeliveredModal, setOpenDeliveredModal] = React.useState<boolean>(false);
    const [openReportdModal, setOpenReportModal] = React.useState<boolean>(false);
    const [openShipmentdModal, setOpenShipmentdModal] = React.useState<boolean>(false);
    const [deleteWarning, setDeleteWarning] = React.useState<boolean>(false);
    const [openShipmentCanceldModal, setOpenShipmentCanceldModal] = React.useState<boolean>(false);
    const [selectedShipment, setSelectedShipment] = React.useState<any>(undefined);
    const [response, setResponse] = React.useState<any>({});
    const [orderLog, setOrderLog] = React.useState<any>({});
    const [materialResponse, setMaterialResponse] = React.useState<any>([]);
    const [viewPod, setViewPod] = React.useState<boolean>(false);
    const [viewElr, setViewElr] = React.useState<boolean>(false);
    const [viewMaterialTableModal, setViewMaterialTableModal] = React.useState<boolean>(false);
    const [printInvoiceClicked, setPrintInvoiceClicked] = React.useState<boolean>(false);
    const [openContractDetailModal, setOpenContractDetailModal] = React.useState<boolean>(false);
    const [DOresponse, setDOresponse] = React.useState<any>(undefined);
    const [configResponse, setConfigResponse] = React.useState<any>(undefined);
    const [DOMaterialResponse, setDOMaterialResponse] = React.useState<any>(undefined);
    const [tagListResponse, setTagListResponse] = React.useState<any>(undefined);

    const eclipseLength = isMobile ? 6 : 28;

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            let queryParams: any = {
                freightOrderCode: id
            }
            let promiseArray = [appDispatch(getOrderList(queryParams)), appDispatch(getEditShipmentConfig(queryParams))];
            if (demandOrderCode) {
                promiseArray.push(appDispatch(getDOList({ demandOrderCode: demandOrderCode })))
            }

            Promise.all(promiseArray).then((response: any) => {
                if (response && response[1]) {
                    setConfigResponse(response[1])
                }
                if (response && response[2] && response[2].data && response[2].data[0]) {
                    setDOresponse(response[2].data[0])
                } else {
                    setDOresponse(undefined)
                }
                if (response && response[0] && response[0].results && response[0].results[0]) {
                    let orderDetails = response[0].results[0];
                    setResponse(orderDetails);
                    let promiseArray = [appDispatch(getOrderLogList({ freightOrderCode: id, actionName: "CANCELLED" })), appDispatch(getShipmentTagList())]
                    demandOrderCode && promiseArray.push(appDispatch(getDoMaterialList({ demandOrderCode: demandOrderCode })))
                    return Promise.all(promiseArray)
                } else {
                    setResponse({});
                    setLoading(false);
                }
            }).then((response: any) => {
                if (response && response[0]) {
                    setOrderLog(response[0]);
                } else {
                    setOrderLog({})
                }
                if (response && response[1]) {
                    setTagListResponse(setAutoCompleteList(response[1], "tagName", "tagName"))
                } else {
                    setTagListResponse(undefined)
                }
                if (response && response[2]) {
                    setDOMaterialResponse(response[1]);
                } else {
                    setDOMaterialResponse(undefined)
                }
                setLoading(false);
            });
        }
        id && getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh, history.location.search]);

    return (
        <div className="order-detail-wrapper">
            <LoaderModal
                open={printInvoiceClicked}
            />
            {openContractDetailModal &&
                <ContractDetailModal
                    open={openContractDetailModal}
                    selectedElement={{
                        contractCode: response.contractCode,
                        partnerCode: response.partnerCode,
                    }}
                    laneCode={response.laneCode}
                    freightType={response.freightTypeCode}
                    onSuccess={() => {
                        setOpenContractDetailModal(false)
                    }}
                    onClose={() => {
                        setOpenContractDetailModal(false)
                    }}
                />}
            <MaterialTableModal
                open={viewMaterialTableModal}
                onClose={() => {
                    setViewMaterialTableModal(false)
                }}
                selectedElement={materialResponse}
            />
            <ViewPodModal
                shipmentId={selectedShipment && selectedShipment.freightShipmentCode}
                open={viewPod}
                orderId={id}
                onClose={() => {
                    setViewPod(false);
                }}
            />
            <ViewElrModal
                shipmentId={selectedShipment && selectedShipment.freightShipmentCode}
                open={viewElr}
                orderId={id}
                onClose={() => {
                    setViewElr(false);
                }}
            />
            <div className="filter-wrap">
                <Filter
                    pageTitle={"Order Details"}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                >
                    {response &&
                        (response.statusCode === OrderStatus.CONFIRMED || response.statusCode === OrderStatus.PENDING || response.statusCode === OrderStatus.ORIGIN_ARRIVED || response.statusCode === OrderStatus.PLACED) &&
                        <Button
                            buttonStyle="btn-orange"
                            title={isMobile ? " " : "Cancel"}
                            disable={loading}
                            leftIcon={<CloseOutlined />}
                            onClick={() => {
                                setOpenCancelModal(true);
                            }}
                        />
                    }

                </Filter>
            </div>
            <LanePointsDisplayModal
                open={openPointModal}
                laneCode={response && response.laneCode}
                onClose={() => {
                    setOpenPointModal(false);
                }} />
            <OrderCancelModal
                open={openCancelModal}
                selectedElement={response}
                onSuccess={() => {
                    setOpenCancelModal(false);
                    setRefresh((prev) => !prev);
                }}
                onClose={() => {
                    setOpenCancelModal(false);
                }}
            />

            <CancelShipment
                open={openShipmentCanceldModal}
                selectedElement={selectedShipment}
                onSuccess={() => {
                    setSelectedShipment(undefined);
                    setOpenShipmentCanceldModal(false);
                    setRefresh((prev) => !prev);
                }}
                onClose={() => {
                    setSelectedShipment(undefined);
                    setOpenShipmentCanceldModal(false);
                }}
            />

            <MarkDelivered
                open={openDeliveredModal}
                freightOrderCode={response.freightOrderCode}
                freightShipmentCode={selectedShipment && selectedShipment.freightShipmentCode}
                onApply={() => {
                    setSelectedShipment(undefined);
                    setOpenDeliveredModal(false);
                    setOpenActionPoint(false);
                    setRefresh((prev) => !prev);
                }}
                onClose={() => {
                    setSelectedShipment(undefined);
                    setOpenDeliveredModal(false);
                }}
            />
            <ReportShipmentVehicle
                open={openReportdModal}
                freightOrderCode={response.freightOrderCode}
                freightShipmentCode={selectedShipment && selectedShipment.freightShipmentCode}
                onApply={() => {
                    setSelectedShipment(undefined);
                    setOpenReportModal(false);
                    setOpenActionPoint(false);
                    setRefresh((prev) => !prev);
                }}
                onClose={() => {
                    setSelectedShipment(undefined);
                    setOpenReportModal(false);
                }}
            />

            <WarningModal
                open={deleteWarning}
                onClose={() => { setDeleteWarning(false) }}
                warningMessage={"Are you sure want to cancel invoice?"}
                primaryButtonTitle={"Confirm"}
                secondaryuttonTitle={"Cancel"}
                onSuccess={() => {
                    let params: any = {
                        freightOrderCode: selectedShipment && selectedShipment.freightOrderCode,
                        freightShipmentCode: selectedShipment && selectedShipment.freightShipmentCode
                    }
                    appDispatch(cancelInvoice(params)).then((response: any) => {
                        if (response && response.message) {
                            // eslint-disable-next-line
                            if (response.code == "299") {
                                appDispatch(showAlert(response.message, false))
                            } else {
                                appDispatch(showAlert(response.message))
                            }
                        }
                    })
                    setDeleteWarning(false);
                }
                }
            />

            <OrderShipmentModal
                open={openShipmentdModal}
                selectedElement={response}
                shipmentDeatils={selectedShipment}
                freightType={response.freightTypeCode}
                freightOrderCode={id}
                doResponse={DOresponse}
                demandOrderCode={demandOrderCode}
                doMaterialResponse={DOMaterialResponse}
                tagListResponse={tagListResponse}
                onSuccess={() => {
                    setSelectedShipment(undefined);
                    setOpenShipmentdModal(false);
                    setOpenActionPoint(false);
                    setRefresh((prev) => !prev);
                    setDOresponse(undefined)
                    setDOMaterialResponse(undefined)
                }}
                onClose={() => {
                    setSelectedShipment(undefined);
                    setOpenActionPoint(false);
                    setOpenShipmentdModal(false);
                    setDOresponse(undefined)
                    setDOMaterialResponse(undefined)
                }}
            />

            {<PageContainer  >
                <Card className="creat-contract-wrapp creat-wrapp">
                    <CardHeader className="creat-contract-header"
                        title="Order Details"
                    />
                    {loading ?
                        <CardContentSkeleton
                            row={3}
                            column={3}
                        />
                        : (
                            !isObjectEmpty(response) ?
                                <CardContent className="creat-contract-content">
                                    <div className="custom-form-row row">
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={orderCodeLabel}
                                                text={response.freightOrderCode}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={freightTypeLabel}
                                                text={response.freightTypeCode}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={referenceIdLabel}
                                                text={response.referenceId}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            {/* <Information
                                                title={zoneTitle}
                                                customView={<LaneView element={response} onClickLaneCode={(data: any) => { setOpenPointModal(true); }} />}
                                            /> */}
                                            <Information
                                                title={zoneLaneTitle}
                                                text={(response.originZoneName && response.destinationZoneName) && `${response.originZoneName} -> ${response.destinationZoneName}`}
                                                customView={response?.laneName && <LaneView element={response} onClickLaneCode={(data: any) => { setOpenPointModal(true); }} />}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={modLabel}
                                                text={getMode(response.serviceabilityModeCode)}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={transporterLabel}
                                                text={response.partnerName}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={lanePriceLabel}
                                                text={response.lanePrice}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={VolumeLabel}
                                                text={response.totalOrderVolume || response.totalVolumeDemand}
                                                tooltip={() => (response.freightTypeCode === FreightType.FTL &&
                                                    <InfoTooltip
                                                        utilizationValue={response.volumeUtilisation ? response.volumeUtilisation : (response.totalOrderVolume || response.totalVolumeDemand) && "0"}
                                                        utilizationTooltip
                                                        title={"Volume Utilized"}
                                                        placement="bottom"
                                                        disableInMobile={"false"}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={"Weight (kg)"}
                                                text={response.totalOrderWeight || response.totalWeightDemand}
                                                tooltip={() => (response.freightTypeCode === FreightType.FTL &&
                                                    <InfoTooltip
                                                        utilizationValue={response.weightUtilisation ? response.weightUtilisation : (response.totalOrderWeight || response.totalWeightDemand) && "0"}
                                                        utilizationTooltip
                                                        title={"Weight Utilized"}
                                                        placement="bottom"
                                                        disableInMobile={"false"}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={"Shipment Tag"}
                                                text={response.shipmentTag}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={orderCreationDateTime}
                                                text={response.createdAt && convertDateFormat(response.createdAt, displayDateTimeFormatter)}
                                            />
                                        </div>
                                        {response.freightTypeCode === FreightType.FTL &&
                                            <>
                                                <div className="col-md-3 billing-group col-6 vehicle_list">
                                                    <Information
                                                        title={vehicleNumberLabel}
                                                        text={response?.vehicleRegistrationNumber}
                                                    />
                                                </div>
                                                <div className="col-md-3 billing-group col-6">
                                                    <Information
                                                        title={"Driver Name"}
                                                        text={response?.primaryDriverName}
                                                        customView={
                                                            response?.primaryDriverName &&
                                                            <InfoTooltip
                                                                title={response?.primaryDriverName || ""}
                                                                placement="top"
                                                                disableInMobile={"false"}
                                                                infoText={response?.primaryDriverName || "NA"}
                                                            />
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-3 billing-group col-6">
                                                    <Information
                                                        title={"Driver Number"}
                                                        text={response?.primaryDriverNumber}
                                                    />
                                                </div>
                                            </>}
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={"Order Status"}
                                                valueClassName="orange-text"
                                                text={response.statusName}
                                            />
                                        </div>
                                        {response.contractCode &&
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={contractId}
                                                    valueClassName="blue-text"
                                                    customView={
                                                        <span className="blue-text cursor-pointer" onClick={() => {
                                                            setOpenContractDetailModal(true);
                                                        }} >{response.contractCode}</span>
                                                    }
                                                />
                                            </div>}
                                        <div className="labelWidth col-md-3 billing-group col-6">
                                            <Information
                                                title={remarkLabel}
                                                customView={
                                                    <div className="d-flex ">
                                                        <p>{response.orderRemarks || "NA"}</p>
                                                        {
                                                            response.orderRemarks &&
                                                            response.orderRemarks.length >= eclipseLength &&
                                                            <CustomToolTip
                                                                title={response.orderRemarks}
                                                                placement={"top"}
                                                                disableInMobile={"false"}
                                                            >
                                                                <span className="blue-text">more</span>
                                                            </CustomToolTip>
                                                        }
                                                    </div>
                                                }
                                            />
                                        </div>
                                        {orderLog[response.freightOrderCode] &&
                                            <>
                                                <div className="col-md-3 billing-group col-6">
                                                    <Information
                                                        className="con-field-wrap"
                                                        title={CancelledBy}
                                                        text={response.orderCancellationType}
                                                        valueClassName="orange-text"
                                                        tooltip={() => (
                                                            <CustomToolTip
                                                                title={
                                                                    <div className="approved-list">
                                                                        <List>
                                                                            <ListItem>
                                                                                <ListItemIcon>
                                                                                    <Person />
                                                                                </ListItemIcon>
                                                                                <ListItemText>
                                                                                    {orderLog[response.freightOrderCode].userName}
                                                                                </ListItemText>
                                                                            </ListItem>
                                                                            <ListItem>
                                                                                <ListItemIcon>
                                                                                    <Mail />
                                                                                </ListItemIcon>
                                                                                <ListItemText>
                                                                                    {orderLog[response.freightOrderCode].userEmail}
                                                                                </ListItemText>
                                                                            </ListItem>
                                                                        </List>
                                                                    </div>
                                                                }
                                                                disableInMobile={"false"}
                                                                placement="top">
                                                                <Info className="blue-text info-icon" />
                                                            </CustomToolTip>
                                                        )}
                                                    />
                                                </div>

                                                <div className="labelWidth col-md-3 billing-group col-6">
                                                    <Information
                                                        title={cancelledRemarkLabel}
                                                        customView={
                                                            <div className="d-flex ">
                                                                <p>{orderLog[response.freightOrderCode].remarks || "NA"}</p>
                                                                {
                                                                    orderLog[response.freightOrderCode].remarks &&
                                                                    orderLog[response.freightOrderCode].remarks.length >= eclipseLength &&
                                                                    <CustomToolTip
                                                                        title={orderLog[response.freightOrderCode].remarks}
                                                                        placement={"top"}
                                                                        disableInMobile={"false"}
                                                                    >
                                                                        <span className="blue-text">more</span>
                                                                    </CustomToolTip>
                                                                }
                                                            </div>
                                                        }
                                                    />
                                                </div>
                                            </>
                                        }
                                    </div>
                                </CardContent> :
                                <DataNotFound />
                        )
                    }
                </Card>
                {response.shipmentDetails && response.shipmentDetails.map((element: any, index: number) => (
                    <Card
                        key={index}
                        className="creat-contract-wrapp creat-wrapp">
                        <div className="billing-info-header detail-header">
                            <h4>{"Shipment Code: " + ((element.freightShipmentCode && element.freightShipmentCode) || "")}</h4>
                            {response.statusCode && response.statusCode !== OrderStatus.CANCELLED &&
                                element.statusCode !== OrderStatus.CANCELLED &&
                                <OrderPrintAction
                                    statusCode={element.statusCode}
                                    orderStatus={response.statusCode}
                                    shipmentData={element}
                                    close={openActionPoint}
                                    configResponse={configResponse}
                                    freightOrderCode={response.freightOrderCode}
                                    onClickReport={async () => {
                                        setLoading(true);
                                        let nodeCodes: any = []
                                        nodeCodes.push(element.destinationLocationCode)
                                        let ymsEnabledStatusParams = {
                                            nodeCode: nodeCodes
                                        }
                                        const ymsNodeConfigResponse = await appDispatch(getYmsNodeConfigStatus(ymsEnabledStatusParams))
                                        if (ymsNodeConfigResponse && ymsNodeConfigResponse.code === 200) {
                                            if (!isNullValue(ymsNodeConfigResponse.details)) {
                                                appDispatch(showAlert("Action is not allowed, please proceed through YMS", false));
                                                setLoading(false);
                                                return;
                                            }
                                        } else {
                                            appDispatch(showAlert("Something went wrong. Please try again", false))
                                            setLoading(false);
                                            return;
                                        }
                                        setLoading(false);
                                        setSelectedShipment(element)
                                        setOpenActionPoint(false);
                                        setOpenReportModal(true);
                                    }}
                                    onClickDelivered={async () => {
                                        setLoading(true);
                                        let nodeCodes: any = []
                                        nodeCodes.push(element.destinationLocationCode)
                                        let ymsEnabledStatusParams = {
                                            nodeCode: nodeCodes
                                        }
                                        const ymsNodeConfigResponse = await appDispatch(getYmsNodeConfigStatus(ymsEnabledStatusParams))
                                        if (ymsNodeConfigResponse && ymsNodeConfigResponse.code === 200) {
                                            if (!isNullValue(ymsNodeConfigResponse.details)) {
                                                appDispatch(showAlert("Action is not allowed, please proceed through YMS", false));
                                                setLoading(false);
                                                return;
                                            }
                                        } else {
                                            appDispatch(showAlert("Something went wrong. Please try againg", false))
                                            setLoading(false);
                                            return;
                                        }
                                        setLoading(false);
                                        setSelectedShipment(element)
                                        setOpenActionPoint(false);
                                        setOpenDeliveredModal(true);
                                    }}
                                    onClickDelete={(element: any) => {
                                        setSelectedShipment(element)
                                        setOpenActionPoint(false);
                                        setOpenShipmentCanceldModal(true);
                                    }}
                                    onClickEdit={async (element: any) => {
                                        setSelectedShipment(element)
                                        setOpenActionPoint(false);
                                        if (element.sourceNumber) {
                                            let doResponse = await appDispatch(getDOList({ demandOrderCode: element.demandOrderCode }))
                                            if (doResponse && doResponse.data && doResponse.data[0]) {
                                                setDOresponse(doResponse.data[0])
                                            } else {
                                                setDOresponse(undefined)
                                            }
                                            let doMaterialListResponse = await appDispatch(getDoMaterialList({ demandOrderCode: element.demandOrderCode }))
                                            if (doMaterialListResponse) {
                                                setDOMaterialResponse(doMaterialListResponse)
                                            } else {
                                                setDOMaterialResponse(undefined)
                                            }
                                        }
                                        setOpenShipmentdModal(true);
                                    }}
                                    onClickEpod={(element: any) => {
                                        setSelectedShipment(element);
                                        setViewPod(true);
                                    }}
                                    onClickElr={(element: any) => {
                                        setSelectedShipment(element);
                                        setViewElr(true);
                                    }}
                                    onClickInvoice={(element: any) => {
                                        let params: any = {
                                            freightShipmentCode: element.freightShipmentCode,
                                            freightOrderCode: element.freightOrderCode
                                        }
                                        setPrintInvoiceClicked(true);
                                        appDispatch(getPrintInvoice(params)).then((response: any) => {
                                            if (response && response.details && response.details.length > 0) {
                                                response.details.forEach((item: any) => {
                                                    item.invoiceLink && item.invoiceLink.length > 0 && item.invoiceLink.forEach((innerItem: any) => {
                                                        window.open(innerItem);
                                                    })
                                                })
                                            }

                                            // eslint-disable-next-line
                                            else if (response && response.message && response.code == "299") {
                                                appDispatch(showAlert(response.message, false))
                                            }
                                            setPrintInvoiceClicked(false);
                                        })
                                    }}
                                    onClickCancelInvoice={(element: any) => {
                                        setSelectedShipment(element);
                                        setDeleteWarning(true);
                                    }}
                                />
                            }
                        </div>
                        {loading ?
                            <CardContentSkeleton
                                row={2}
                                column={4}
                            /> : <CardContent className="creat-contract-content detail-wrapp">
                                <div className="custom-form-row row">
                                    {element && element.sourceNumber &&
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={"Source Number"}
                                                text={element.sourceNumber}
                                            />
                                        </div>}
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={"Pickup Point"}
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
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={"Drop Point"}
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
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={tatLabelWithoutUnit}
                                            text={element.tat && convertHoursInDays(element.tat)}
                                        />
                                    </div>
                                    {response.freightTypeCode === FreightType.FTL &&
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={vehicleTypeHint}
                                                text={element.vehicleTypeName}
                                            />
                                        </div>
                                    }
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={VolumeLabel}
                                            text={element.totalShipmentVolume}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={"Weight (kg)"}
                                            text={element.totalShipmentWeight}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={"Shipment Tag"}
                                            text={element.shipmentTag}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={"Placement Date and time"}
                                            text={element.placementDatetime && convertDateFormat(element.placementDatetime, displayDateTimeFormatter)}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={"Transporter"}
                                            text={element.partnerName}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={"Consignee"}
                                            text={element.consigneeName}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={LBHLabel}
                                            text={element.length ? element.length + " * " + element.width + " * " + element.height : "NA"}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={numberOfBoxes}
                                            text={element.totalShipmentQuantity}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={appointmentDateTimeLabel}
                                            text={element.appointmentDatetime && convertDateFormat(element.appointmentDatetime, displayDateTimeFormatter)}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={"Waybill Number"}
                                            text={element.airwaybillNumber}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={"ELR Number"}
                                            text={element.lrNumber}
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={"Shipment Reference Id"}
                                            text={element.shipmentRefId}
                                        />
                                    </div>
                                    {response.freightTypeCode === FreightType.PTL &&
                                        <>
                                            <div className="col-md-3 billing-group col-6 vehicle_list">
                                                <Information
                                                    title={vehicleNumberLabel}
                                                    text={element.vehicleRegistrationNumber}
                                                />
                                            </div>
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={"Driver Name"}
                                                    text={element.primaryDriverName}
                                                    customView={
                                                        element.primaryDriverName &&
                                                        <InfoTooltip
                                                            title={element.primaryDriverName || ""}
                                                            placement="top"
                                                            disableInMobile={"false"}
                                                            infoText={element.primaryDriverName || "NA"}
                                                        />
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={"Driver Number"}
                                                    text={element.primaryDriverNumber}
                                                />
                                            </div>
                                        </>}
                                    <div className="col-md-3 billing-group CustomTooltipTable col-6">
                                        <Information
                                            title={MaterialLabel}
                                            valueClassName="blue-text"
                                            customView={
                                                <span className="blue-text cursor-pointer"
                                                    onClick={() => {
                                                        setViewMaterialTableModal(true);
                                                        setMaterialResponse(element.articleDetails)
                                                    }}
                                                >
                                                    <ul className="view-text blue-text d-flex align-items-center">
                                                        <li><Info /></li>
                                                        <li>View</li>
                                                    </ul>
                                                </span>
                                            }
                                        />
                                    </div>
                                    <div className="col-md-3 billing-group col-6 status-text">
                                        <Information
                                            title={"Status"}
                                            valueClassName="orange-text"
                                            text={element.statusName}
                                        />
                                    </div>
                                    <div className="labelWidth col-md-3 billing-group col-6">
                                        <Information
                                            title={remarkLabel}
                                            customView={
                                                <div className="d-flex ">
                                                    <p>{element.shipmentRemarks || "NA"}</p>
                                                    {
                                                        element.shipmentRemarks &&
                                                        element.shipmentRemarks.length >= eclipseLength &&
                                                        <CustomToolTip
                                                            title={element.shipmentRemarks}
                                                            placement={"top"}
                                                            disableInMobile={"false"}
                                                        >
                                                            <span className="blue-text">more</span>
                                                        </CustomToolTip>
                                                    }
                                                </div>
                                            }
                                        />
                                    </div>
                                    {orderLog[element.freightShipmentCode] &&
                                        <>
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    className="con-field-wrap"
                                                    title={CancelledBy}
                                                    text={element.shipmentCancellationType}
                                                    valueClassName="orange-text"
                                                    tooltip={() => (
                                                        <CustomToolTip
                                                            title={
                                                                <div className="approved-list">
                                                                    <List>
                                                                        <ListItem>
                                                                            <ListItemIcon>
                                                                                <Person />
                                                                            </ListItemIcon>
                                                                            <ListItemText>
                                                                                {orderLog[element.freightShipmentCode].userName}
                                                                            </ListItemText>
                                                                        </ListItem>
                                                                        <ListItem>
                                                                            <ListItemIcon>
                                                                                <Mail />
                                                                            </ListItemIcon>
                                                                            <ListItemText>
                                                                                {orderLog[element.freightShipmentCode].userEmail}
                                                                            </ListItemText>
                                                                        </ListItem>
                                                                    </List>
                                                                </div>
                                                            }
                                                            disableInMobile={"false"}
                                                            placement="top">
                                                            <Info className="blue-text info-icon" />
                                                        </CustomToolTip>
                                                    )}
                                                />
                                            </div>

                                            <div className="labelWidth col-md-3 billing-group col-6">
                                                <Information
                                                    title={cancelledRemarkLabel}
                                                    customView={
                                                        <div className="d-flex ">
                                                            <p>{orderLog[element.freightShipmentCode].remarks || "NA"}</p>
                                                            {
                                                                orderLog[element.freightShipmentCode].remarks &&
                                                                orderLog[element.freightShipmentCode].remarks.length >= eclipseLength &&
                                                                <CustomToolTip
                                                                    title={orderLog[element.freightShipmentCode].remarks}
                                                                    placement={"top"}
                                                                    disableInMobile={"false"}
                                                                >
                                                                    <span className="blue-text">more</span>
                                                                </CustomToolTip>
                                                            }
                                                        </div>
                                                    }
                                                />
                                            </div>
                                        </>
                                    }

                                </div>
                            </CardContent>
                        }
                    </Card>
                ))}
                {showShipmentButton() &&
                    <div className="text-right">
                        <Button
                            buttonStyle="btn-orange"
                            title={"Shipment"}
                            disable={loading}
                            leftIcon={<AddCircle />}
                            onClick={async () => {
                                if (demandOrderCode) {
                                    let doResponse = await appDispatch(getDOList({ demandOrderCode: demandOrderCode }))
                                    if (doResponse && doResponse.data && doResponse.data[0]) {
                                        setDOresponse(doResponse.data[0])
                                    } else {
                                        setDOresponse(undefined)
                                    }
                                    let doMaterialListResponse = await appDispatch(getDoMaterialList({ demandOrderCode: demandOrderCode }))
                                    if (doMaterialListResponse) {
                                        setDOMaterialResponse(doMaterialListResponse)
                                    } else {
                                        setDOMaterialResponse(undefined)
                                    }
                                }
                                setOpenShipmentdModal(true);
                            }}
                        />

                    </div>
                }

            </PageContainer>}
        </div >
    );

    function showShipmentButton() {
        if (response && (response.statusCode === OrderStatus.CONFIRMED || response.statusCode === OrderStatus.PENDING)) {
            if (demandOrderCode) {
                return true;
            }
            else {
                const shipmentWithSourceNumber = response.shipmentDetails && response.shipmentDetails.find((shipment: any) => shipment.sourceNumber)
                if (shipmentWithSourceNumber && shipmentWithSourceNumber.sourceNumber) {
                    return false;
                }
                return true;
            }
        }
        return false;
    }


}
export default OrderDetails;
import { AddCircle, CheckCircleRounded, Close, KeyboardBackspace, LocalShipping } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { diversionTabEnum } from '../../base/constant/ArrayList';
import { DiversionCreateOrderUrl } from '../../base/constant/RoutePath';
import { isNullValue } from '../../base/utility/StringUtils';
import { isMobile } from '../../base/utility/ViewUtils';
import Stepper from "../../component/CustomizedStepper";
import Filter from '../../component/filter/Filter';
import Button from '../../component/widgets/button/Button';
import CardContentSkeleton from '../../component/widgets/cardContentSkeleton/CardContentSkeleton';
import TableList from '../../component/widgets/tableView/TableList';
import WarningModal from '../../modals/warningModal/WarningModal';
import { showAlert } from '../../redux/actions/AppActions';
import { getYmsNodeConfigStatus } from '../../serviceActions/InplantServiceActions';
import { diversionApprove, diversionConfirmOrder, diversionDetails, diversionReject, getOrderLogList } from '../../serviceActions/OrderServiceActions';
import { diversionChildColumn } from '../../templates/DiversionTemplate';
import { getDOList, getDoMaterialList } from '../freight/demandOrders/demandOrdersApi/demandOrderServiceActions';
import CancelShipment from '../freight/order/CancelShipment';
import MaterialTableModal from '../freight/order/MaterialTableModal';
import OrderCancelModal from '../freight/order/OrderCancelModal';
import LanePointsDisplayModal from '../masterPlatform/lane/LanePointsDisplayModal';
import DiversionDispatchOrderModal from './DiversionDispatchOrderModal';
import DiversionFODetails from './DiversionFODetails';
import DiversionNewFODetails from './DiversionNewFODetails';
import DiversionOrderShipmentModal from './DiversionOrderShipmentModal';
import DiversionPlaceOrderModal from './DiversionPlaceOrderModal';
import "./DiversionRequestDetail.css";
import ShipmentDetailsModal from './ShipmentDetailsModal';

function DiversionRequestDetail() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const tabName = new URLSearchParams(useLocation().search).get("tabName");
    const order = new URLSearchParams(useLocation().search).get("order");
    const { requestId } = useParams<any>()
    const [response, setResponse] = React.useState<any>(undefined);
    const [oldFreightData, setOldFreightData] = React.useState<any>(undefined)
    const [placeOrderData, setPlaceOrderData] = React.useState<any>(undefined)
    const [loading, setLoading] = React.useState<boolean>(false);
    const [openCancelModal, setOpenCancelModal] = React.useState<boolean>(false);
    const [openOrderCancelModal, setOpenOrderCancelModal] = React.useState<boolean>(false);
    const [viewMaterialTableModal, setViewMaterialTableModal] = React.useState<boolean>(false);
    const [materialResponse, setMaterialResponse] = React.useState<any>([]);
    const [activeStep, setActiveStep] = React.useState<any>(0)
    const [openShipmentModal, setOpenShipmentModal] = React.useState<boolean>(false)
    const [openShipmentDetailsModal, setOpenShipmentDetailsModal] = React.useState<boolean>(false)
    const [selectedShipment, setSelectedShipment] = React.useState<any>(undefined);
    const [DOResponse, setDOResponse] = React.useState<any>(undefined);
    const [DOMaterialResponse, setDOMaterialResponse] = React.useState<any>(undefined);
    const [openConfirmModal, setOpenConfirmModal] = React.useState<boolean>(false)
    const [refresh, setRefresh] = React.useState<boolean>(false);
    const [openShipmentCanceldModal, setOpenShipmentCancelModal] = React.useState<boolean>(false)
    const [openPlacementModal, setOpenPlacementModal] = React.useState<boolean>(false);
    const [openDispatchModal, setOpenDispatchModal] = React.useState<boolean>(false);
    const [selectedShipmentDetails, setSelectedShipmentDetails] = React.useState<any>([]);
    const [showDONumber, setShowDONUmber] = React.useState<boolean>(false)
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false)
    const [orderLog, setOrderLog] = React.useState<any>({});
    const [isCollapsed, setIsCollapsed] = React.useState<boolean>(true);
    const [notCancelledShipments, setNotCancelledShipments] = React.useState<any>([]);

    function onClickViewMaterial(element: any) {
        setViewMaterialTableModal(true)
        setMaterialResponse(element)
    }
    useEffect(() => {
        const params = {
            requestId: requestId
        }
        setLoading(true)
        appDispatch(diversionDetails(params)).then((response: any) => {
            if (response) {
                setResponse(response)
                setOldFreightData(response.oldFreightOrderDetails)
                let tempShipments = [];
                if (response?.newFreightOrderDetails?.shipmentDetails) {
                    tempShipments = response?.newFreightOrderDetails?.shipmentDetails.filter((item: any) => item.shipmentStatusName !== "CANCELLED")
                    setNotCancelledShipments(tempShipments)
                }
                if (response.oldFreightOrderDetails && !response.newFreightOrderDetails && response.oldFreightOrderDetails.statusName === "CANCELLED") {
                    setActiveStep(0)
                    setIsCollapsed(true)
                } else if (response.newFreightOrderDetails && response.newFreightOrderDetails.statusName === "PENDING") {
                    setActiveStep(1)
                    setIsCollapsed(false)
                } else if (response.newFreightOrderDetails && response.newFreightOrderDetails.statusName === "CONFIRMED") {
                    setActiveStep(2);
                    setIsCollapsed(false)
                } else if (response.newFreightOrderDetails && response.newFreightOrderDetails.statusName === "PLACED") {
                    setActiveStep(3);
                    setIsCollapsed(false)
                } else if (response.newFreightOrderDetails && response.newFreightOrderDetails.statusName === "DISPATCHED") {
                    setActiveStep(4);
                    setIsCollapsed(false)
                }
                if (response.newFreightOrderDetails) {
                    let orderLogResponse = appDispatch(getOrderLogList({ freightOrderCode: response.oldFreightOrderDetails.freightOrderCode, actionName: "CANCELLED" }))
                    if (orderLogResponse && orderLogResponse[0]) {
                        setOrderLog(orderLogResponse[0])
                    }
                }
            }
            setLoading(false)
        })
        // eslint-disable-next-line
    }, [requestId, refresh])

    return (
        <>
            {loading ?
                <CardContentSkeleton
                    row={4}
                    column={4} />
                :
                <>
                    <div className="filter-wrap">
                        <Filter
                            pageTitle={(diversionTabEnum.DIVERSION_REQUEST === tabName) ? "Diversion Details" : "Diversion Process"}
                            buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                            buttonTitle={isMobile ? " " : "Back"}
                            leftIcon={<KeyboardBackspace />}
                            onClick={() => {
                                history.goBack();
                            }}
                        >

                        </Filter>
                    </div>
                    <WarningModal
                        open={openCancelModal}
                        onClose={() => {
                            setOpenCancelModal(false);
                        }}
                        warningMessage={"Are you sure want to reject Order Diversion?"}
                        primaryButtonTitle={"Confirm"}
                        secondaryuttonTitle={"Cancel"}
                        onSuccess={() => {
                            setOpenCancelModal(false);
                            setLoading(true)
                            const params = {
                                requestId: requestId,
                                freightOrderCode: oldFreightData && oldFreightData.freightOrderCode,
                                id: response.id
                            }
                            appDispatch(diversionReject(params)).then((response: any) => {
                                appDispatch(showAlert(response))
                                // dispatch(refreshList());
                                history.goBack();

                            })


                        }}
                    />
                    <OrderCancelModal
                        open={openOrderCancelModal}
                        selectedElement={response && response.newFreightOrderDetails}
                        onSuccess={() => {
                            setOpenOrderCancelModal(false);
                            setRefresh((prev) => !prev);
                        }}
                        onClose={() => {
                            setOpenOrderCancelModal(false);
                        }}
                        isDiverting={true}
                    />
                    <CancelShipment
                        open={openShipmentCanceldModal}
                        selectedElement={selectedShipment}
                        onSuccess={() => {
                            setSelectedShipment(undefined);
                            setOpenShipmentCancelModal(false);
                            setRefresh((prev) => !prev);
                        }}
                        onClose={() => {
                            setSelectedShipment(undefined);
                            setOpenShipmentCancelModal(false);
                        }}
                    />
                    <MaterialTableModal
                        open={viewMaterialTableModal}
                        onClose={() => {
                            setViewMaterialTableModal(false)
                        }}
                        selectedElement={materialResponse}
                    />
                    <ShipmentDetailsModal
                        open={openShipmentDetailsModal}
                        onClose={() => {
                            setOpenShipmentDetailsModal(false)
                        }}
                        selectedElement={selectedShipment}
                        orderDetails={response && response.newFreightOrderDetails}
                    />
                    <WarningModal
                        open={openConfirmModal}
                        onClose={() => {
                            setOpenConfirmModal(false);
                        }}
                        warningMessage={"Are you sure want to confirm Order"}
                        primaryButtonTitle={"Confirm"}
                        secondaryuttonTitle={"Cancel"}
                        onSuccess={() => {
                            setOpenConfirmModal(false);
                            setLoading(true)
                            appDispatch(diversionConfirmOrder({ requestId: requestId, id: response && response.id })).then((response: any) => {
                                if (response) {
                                    appDispatch(showAlert(response))
                                    setRefresh((prev) => !prev);
                                }
                                setLoading(false)
                            })
                        }}
                    />
                    <DiversionPlaceOrderModal
                        open={openPlacementModal}
                        selectedElement={placeOrderData}
                        requestId={requestId}
                        diversionDetails={response}
                        id={response && response.id}
                        onSuccess={() => {
                            setOpenPlacementModal(false);
                            setRefresh((prev) => !prev);
                        }}
                        onClose={() => {
                            setOpenPlacementModal(false);
                        }}
                    />
                    <DiversionDispatchOrderModal
                        requestId={requestId}
                        id={response && response.id}
                        open={openDispatchModal}
                        selectedElement={response && response.newFreightOrderDetails}
                        selectedShipmentDetails={selectedShipmentDetails}
                        onSuccess={() => {
                            setOpenDispatchModal(false);
                            // setRefresh((prev) => !prev);
                        }}
                        onClose={() => {
                            setOpenDispatchModal(false);
                        }}
                    />
                    <LanePointsDisplayModal
                        open={openPointModal}
                        laneCode={response && response.newFreightOrderDetails && response.newFreightOrderDetails.laneCode}
                        onClose={() => {
                            setOpenPointModal(false);
                        }} />

                    <DiversionOrderShipmentModal
                        showDONumber={showDONumber}
                        order={order}
                        open={openShipmentModal}
                        selectedElement={response && response.newFreightOrderDetails}
                        shipmentDeatils={selectedShipment}
                        freightType={response && response.newFreightOrderDetails && response.newFreightOrderDetails.freightTypeCode}
                        freightOrderCode={response && response.newFreightOrderDetails && response.newFreightOrderDetails.freightOrderCode}
                        doResponse={DOResponse}
                        setDOResponse={setDOResponse}
                        setDOMaterialResponse={setDOMaterialResponse}
                        doMaterialResponse={DOMaterialResponse}
                        onSuccess={() => {
                            setSelectedShipment(undefined);
                            setOpenShipmentModal(false);
                            setDOResponse(undefined)
                            setDOMaterialResponse(undefined)
                            setRefresh((prev) => !prev);
                            // setOpenActionPoint(false);
                            // setRefresh((prev) => !prev);
                        }}
                        onClose={() => {
                            setSelectedShipment(undefined);
                            // setOpenActionPoint(false);
                            setDOResponse(undefined);
                            setDOMaterialResponse(undefined)
                            setOpenShipmentModal(false);

                        }}
                    />
                    <div className="diversion-order">

                        {response &&
                            <>
                                <DiversionFODetails
                                    tabName={tabName}
                                    selectedElement={oldFreightData}
                                    requestId={response.requestId}
                                    orderLog={orderLog}
                                    isCollapsed={isCollapsed}
                                    diversionRequestDetails={response}
                                    setIsCollapsed={() => {
                                        setIsCollapsed((open) => !open)
                                    }}
                                />
                                {isCollapsed !== false && (oldFreightData?.shipmentDetails && oldFreightData?.shipmentDetails.length > 0) && (
                                    <TableList
                                        tableColumns={diversionChildColumn(onClickViewMaterial)}
                                        currentPage={1}
                                        rowsPerPage={25}
                                        rowsPerPageOptions={[2]}
                                        listData={oldFreightData?.shipmentDetails}
                                        onChangePage={(event: any, page: number) => {
                                            //dispatch(setCurrentPage(page));
                                        }}
                                        onChangeRowsPerPage={(event: any) => {
                                            //dispatch(setRowPerPage(event.target.value))
                                        }}
                                    />
                                )}
                            </>
                        }

                        {tabName === diversionTabEnum.IN_PROGRESS && (
                            <>
                                <Stepper activeStep={activeStep} />
                                {activeStep === 0 ?
                                    <>
                                        <div className="row text-right btn-background">
                                            <div className="col indent-btn-wrap create-do-btn">
                                                {/* <Button
                                                    buttonStyle="btn-blue mr-3"
                                                    title="Create FO"

                                                    leftIcon={<LocalShipping />}
                                                    onClick={() => {
                                                        history.push({
                                                            pathname: DiversionCreateOrderUrl + requestId
                                                        })
                                                    }}
                                                /> */}
                                                <Button
                                                    buttonStyle="btn-orange"
                                                    title="Create FO"
                                                    loading={false}
                                                    onClick={() => {
                                                        if (response.oldFreightOrderDetails && response.oldFreightOrderDetails.shipmentDetails) {
                                                            const shipmentWithSourceNumber = response.oldFreightOrderDetails.shipmentDetails.find((shipment: any) => shipment.sourceNumber)
                                                            if (shipmentWithSourceNumber && shipmentWithSourceNumber.sourceNumber) {
                                                                history.push({
                                                                    pathname: DiversionCreateOrderUrl + requestId,
                                                                    search: "?order=DO"
                                                                })
                                                            } else {
                                                                history.push({
                                                                    pathname: DiversionCreateOrderUrl + requestId
                                                                })
                                                            }
                                                        } else {
                                                            history.push({
                                                                pathname: DiversionCreateOrderUrl + requestId
                                                            })
                                                        }
                                                    }}
                                                    leftIcon={<LocalShipping />}
                                                />
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {response &&
                                            <>
                                                <DiversionNewFODetails
                                                    onDelete={() => { setOpenOrderCancelModal(true) }}
                                                    diversionRequestResponse={response}
                                                    selectedElement={response.newFreightOrderDetails}
                                                    oldFreightOrderDetails={response.oldFreightOrderDetails}
                                                    setOpenPointModal={setOpenPointModal}
                                                />
                                                {notCancelledShipments && notCancelledShipments.length > 0 &&
                                                    <TableList
                                                        tableColumns={diversionChildColumn(onClickViewMaterial, onClickEdit, onClickDelete, activeStep, onClickDetails)}
                                                        currentPage={1}
                                                        rowsPerPage={25}
                                                        rowsPerPageOptions={[2]}
                                                        listData={notCancelledShipments}
                                                        onChangePage={(event: any, page: number) => {
                                                            //dispatch(setCurrentPage(page));
                                                        }}
                                                        onChangeRowsPerPage={(event: any) => {
                                                            //dispatch(setRowPerPage(event.target.value))
                                                        }}
                                                    />
                                                }
                                            </>
                                        }
                                    </>
                                }
                                {activeStep === 1 &&
                                    <>
                                        <div className="row text-right">
                                            <div className="col indent-btn-wrap">
                                                <Button
                                                    buttonStyle="btn-orange mr-3"
                                                    title="Shipment"
                                                    loading={false}
                                                    leftIcon={<AddCircle />}
                                                    onClick={() => {
                                                        if (order && order === "DO") {
                                                            setShowDONUmber(true)
                                                            // setOpenShipmentModal(true)
                                                        }
                                                        else if (response.newFreightOrderDetails && response.newFreightOrderDetails.shipmentDetails) {
                                                            const shipmentWithSourceNumber = response.newFreightOrderDetails.shipmentDetails.find((shipment: any) => shipment.sourceNumber)
                                                            if (shipmentWithSourceNumber && shipmentWithSourceNumber.sourceNumber) {
                                                                setShowDONUmber(true)
                                                            }

                                                        }
                                                        setOpenShipmentModal(true)
                                                    }}
                                                />
                                                <Button
                                                    buttonStyle="btn-blue"
                                                    title="Confirm"
                                                    loading={loading}
                                                    onClick={() => {
                                                        setOpenConfirmModal(true)
                                                    }}
                                                    leftIcon={<LocalShipping />}
                                                />
                                            </div>
                                        </div>
                                    </>
                                }
                                {activeStep === 2 &&
                                    <>
                                        {(response && response.requestStatus && response.requestStatus !== "COMPLETED") &&
                                            <div className="row text-right">
                                                <div className="col indent-btn-wrap">
                                                    <Button
                                                        buttonStyle="btn-blue"
                                                        title="Place"
                                                        loading={false}
                                                        onClick={async () => {
                                                            setLoading(true);
                                                            let nodeCodes: any = []
                                                            // eslint-disable-next-line
                                                            let orderDetails = response.newFreightOrderDetails
                                                            orderDetails && orderDetails.shipmentDetails && orderDetails.shipmentDetails.forEach((item: any) => {
                                                                if (!(nodeCodes.includes(item.originLocationCode))) {
                                                                    nodeCodes.push(item.originLocationCode)
                                                                }
                                                            })
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
                                                            setLoading(false)
                                                            setPlaceShipmentResponse()
                                                            setOpenPlacementModal(true)
                                                            // setOpenConfirmModal(true)
                                                        }}
                                                        leftIcon={<LocalShipping />}
                                                    />
                                                </div>
                                            </div>}
                                    </>
                                }
                                {activeStep === 3 &&
                                    <>
                                        {(response && response.requestStatus && response.requestStatus !== "COMPLETED") &&
                                            <div className="row text-right">
                                                <div className="col indent-btn-wrap">
                                                    <Button
                                                        buttonStyle="btn-blue"
                                                        title="Dispatch"
                                                        loading={false}
                                                        onClick={async () => {
                                                            setLoading(true);
                                                            let nodeCodes: any = []
                                                            // eslint-disable-next-line
                                                            let orderDetails = response.newFreightOrderDetails
                                                            orderDetails && orderDetails.shipmentDetails && orderDetails.shipmentDetails.forEach((item: any) => {
                                                                if (!(nodeCodes.includes(item.originLocationCode))) {
                                                                    nodeCodes.push(item.originLocationCode)
                                                                }
                                                            })
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
                                                            setLoading(false)
                                                            let notCancelledShipments = orderDetails?.shipmentDetails.filter((element: any) => element.shipmentStatusName !== "CANCELLED")
                                                            setSelectedShipmentDetails(notCancelledShipments);
                                                            setOpenDispatchModal(true)
                                                            // setOpenConfirmModal(true)
                                                        }}
                                                        leftIcon={<LocalShipping />}
                                                    />
                                                </div>
                                            </div>}
                                    </>
                                }
                            </>
                        )}
                    </div>
                    {
                        tabName !== diversionTabEnum.IN_PROGRESS && (
                            <div className="text-right mr-3">
                                <Button
                                    buttonStyle="btn-red mr-3"
                                    title={"Reject"}

                                    loading={loading}
                                    leftIcon={<Close />}
                                    onClick={() => {
                                        setOpenCancelModal(true)


                                    }}
                                />
                                <Button
                                    buttonStyle="btn-blue"
                                    title={"Approve"}
                                    loading={loading}
                                    leftIcon={<CheckCircleRounded />}
                                    onClick={() => {
                                        const params = {
                                            requestId: requestId,
                                            oldFreightOrderCode: oldFreightData && oldFreightData.freightOrderCode,
                                            id: response && response.id
                                        }
                                        appDispatch(diversionApprove(params)).then((response: any) => {
                                            appDispatch(showAlert(response))
                                            // dispatch(refreshList());
                                            history.goBack()
                                        })
                                    }}
                                />

                            </div>
                        )
                    }
                </>
            }
        </>

    )

    function onClickDetails(element: any) {
        setSelectedShipment(element)
        setOpenShipmentDetailsModal(true)
    }

    async function onClickEdit(element: any) {
        setSelectedShipment(element)
        if (element.demandOrderCode) {
            let doResponse = await appDispatch(getDOList({ demandOrderCode: element.demandOrderCode }))
            if (doResponse && doResponse.data && doResponse.data[0]) {
                setDOResponse(doResponse.data[0])
            }
            else {
                setDOResponse(undefined)
            }
            let doMaterialResponse = await appDispatch(getDoMaterialList({ demandOrderCode: element.demandOrderCode }))
            if (doMaterialResponse) {
                setDOMaterialResponse(doMaterialResponse)
            } else {
                setDOMaterialResponse(undefined)
            }
        }
        setOpenShipmentModal(true)
    }

    function onClickDelete(element: any) {
        setSelectedShipment(element)
        setOpenShipmentCancelModal(true)
    }

    function setPlaceShipmentResponse() {
        let orderDetails = response.newFreightOrderDetails;
        if (orderDetails && orderDetails.freightTypeCode && orderDetails.freightTypeCode === "FTL") {
            let shipmentDetails = orderDetails.shipmentDetails.map((element: any) => ({
                ...element,
                checked: true,
            }
            ));
            setPlaceOrderData((prev: any) => ({
                ...orderDetails,
                shipmentDetails: shipmentDetails
            }))
        } else {
            setPlaceOrderData(orderDetails);
        }
    }

}

export default DiversionRequestDetail

import { Card, CardContent, CardHeader } from '@material-ui/core';
import { CheckCircle, Close, Edit, KeyboardBackspace } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { IndentStatus, OrderStatusLabel, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import {
    appointmentDateLabel, freightTypeLabel,
    indentCodeLabel,
    indentStatus, laneTitle,
    modLabel, placementDateTimeLabel,
    remarkLabel, vehicleCountLabel, vehicleTypeLabel
} from '../../../base/constant/MessageUtils';
import { OrderDetailsUrl } from '../../../base/constant/RoutePath';
import { convertDateFormat, convertDateTimeServerFormat, displayDateTimeFormatter } from '../../../base/utility/DateUtils';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import { LaneView } from "../../../component/CommonView";
import Filter from '../../../component/filter/Filter';
import Information from '../../../component/information/Information';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import CardList from '../../../component/widgets/cardlist/CardList';
import { CustomToolTip } from '../../../component/widgets/CustomToolTip';
import TableList from '../../../component/widgets/tableView/TableList';
import { showAlert } from '../../../redux/actions/AppActions';
import {
    setCurrentPage,
    setResponse, setRowPerPage
} from '../../../redux/actions/OrderActions';
import OrderReducer, { ORDER_STATE } from '../../../redux/reducers/OrderReducer';
import { getIndentDetails, updateReferenceIds } from '../../../serviceActions/IndentServiceAction';
import { getOrderList } from '../../../serviceActions/OrderServiceActions';
import {
    indentDetailTableColumns,
    indentDetailTableEditableColumns
} from '../../../templates/IndentTemplates';
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';
import IndentCancelModal from "./IndentCancelModal";
import './IndentDetail.css';

function IndentDetail() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const state: any = {};
    const [details, setDetails] = React.useState<any>({});
    const [editableOrders, setEditableOrders] = React.useState<any>([]);
    const [openCancelModal, setOpenCancelModal] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [editable, setEditable] = React.useState<boolean>(false);
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
    const [orderDetails = ORDER_STATE, dispatch] = React.useReducer(OrderReducer, ORDER_STATE);
    const indentCode = new URLSearchParams(useLocation().search).get("indentCode");
    const eclipseLength = isMobile ? 6 : 28;

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            const queryParams: any = {
                indentId: indentCode,
            };
            const indentData = await appDispatch(getIndentDetails(queryParams))
            setDetails((indentData && indentData.details) || {});
            setLoading(false);
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [indentCode]);

    useEffect(() => {
        const getList = async () => {
            setLoading(true);

            const queryParams: any = {
                indentCode,
                page: orderDetails.currentPage,
                pageSize: orderDetails.pageSize,
            };
            setLoading(true);
            const orderData = await appDispatch(getOrderList(queryParams))
            dispatch(setResponse(orderData));
            setLoading(false);
        }
        getList();
    }, [orderDetails.pageSize, orderDetails.currentPage, appDispatch, indentCode]);

    useEffect(() => {
        if (orderDetails.listData) {
            setEditableOrders([...orderDetails.listData])
        }
    }, [orderDetails.listData])

    return (
        <div className="indent-detail-wrapper">
            <LanePointsDisplayModal
                open={openPointModal}
                laneCode={details.laneCode}
                onClose={() => {
                    setOpenPointModal(false)
                }} />
            <div className="filter-wrap">
                <Filter
                    pageTitle="Indent Details"
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        if (!editable) {
                            history.goBack()
                        } else {
                            setEditable(false);
                            setEditableOrders([...orderDetails.listData || []])
                        }
                    }}
                >
                    {
                        !editable ?
                            (
                                <>
                                    {
                                        details.status !== IndentStatus.CANCELLED
                                        && (
                                            <Button
                                                buttonStyle={"btn-orange"}
                                                title={isMobile ? "" : "Cancel"}
                                                loading={loading}
                                                leftIcon={<Close />}
                                                onClick={() => {
                                                    setOpenCancelModal(true);
                                                }}
                                            />
                                        )
                                    }
                                    {
                                        orderDetails.listData && orderDetails.listData.length &&
                                        <Button
                                            buttonStyle={"btn-orange"}
                                            title={isMobile ? "" : "Edit"}
                                            disable={checkOrderFlag(orderDetails.listData)}
                                            loading={loading}
                                            leftIcon={<Edit />}
                                            onClick={() => setEditable(true)}
                                        />
                                    }
                                </>)
                            :
                            (
                                <Button
                                    buttonStyle={"btn-blue mob-btn-blue"}
                                    title={isMobile ? "" : "Save"}
                                    onClick={saveClickHandler}
                                    loading={loading}
                                    leftIcon={<CheckCircle />}
                                />
                            )
                    }
                </Filter>
            </div>

            <Card className="creat-contract-wrapp creat-wrapp card-detail-wrap">
                <CardHeader className="creat-contract-header"
                    title="Indent Details"
                />
                {loading ?
                    <CardContentSkeleton
                        row={2}
                        column={3}
                    /> :
                    (!isObjectEmpty(details) &&
                        <CardContent className="creat-contract-content">
                            <div className="custom-form-row row">
                                <div className="col-md-4 billing-group col-6">
                                    <Information
                                        title={indentCodeLabel}
                                        text={details.code}
                                    />
                                </div>
                                <div className="col-md-4 billing-group col-6">
                                    <Information
                                        title={freightTypeLabel}
                                        text={details.freightTypeCode}
                                    />
                                </div>
                                <div className="col-md-4 billing-group col-6">
                                    <Information
                                        title={vehicleTypeLabel}
                                        text={details.vehicleTypeName}
                                    />
                                </div>
                                <div className="col-md-4 billing-group col-6">
                                    <Information
                                        title={vehicleCountLabel}
                                        text={details.count}
                                    />
                                </div>
                                <div className="col-md-4 billing-group col-6">
                                    <Information
                                        title={laneTitle}
                                        customView={<LaneView element={{
                                            laneDisplayName: details.laneDisplayName
                                        }} onClickLaneCode={(data: any) => { setOpenPointModal(true); }} />}
                                    />
                                </div>
                                <div className="col-md-4 billing-group col-6">
                                    <Information
                                        title={placementDateTimeLabel}
                                        text={details.placementDatetime && convertDateFormat(details.placementDatetime, displayDateTimeFormatter)}
                                    />
                                </div>
                                <div className="col-md-4 billing-group col-6">
                                    <Information
                                        title={appointmentDateLabel}
                                        text={details.appointmentDatetime && convertDateFormat(details.appointmentDatetime, displayDateTimeFormatter)}
                                    />
                                </div>
                                <div className="col-md-4 billing-group col-6">
                                    <Information
                                        title={modLabel}
                                        text={details.serviceabilityModeName}
                                    />
                                </div>
                                <div className="labelWidth col-md-4 billing-group col-6">
                                    <Information
                                        title={remarkLabel}
                                        customView={
                                            <div className="d-flex ">
                                                <p>{details.remarks || "NA"}</p>
                                                {
                                                    details.remarks &&
                                                    details.remarks.length >= eclipseLength &&
                                                    <CustomToolTip
                                                        title={details.remarks}
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
                                <div className="col-md-4 billing-group col-6">
                                    <Information
                                        title={indentStatus}
                                        valueClassName="orange-text"
                                        text={details.status}
                                    />
                                </div>
                            </div>
                        </CardContent>)
                }

            </Card>
            <PageContainer
                loading={loading}
                listData={state.listData}
            >
                {
                    isMobile ?
                        <CardList
                            listData={orderDetails.listData}
                            tableColumns={
                                editable
                                    ? indentDetailTableEditableColumns(refrenceIdsChangeHandler, appointmentDateChangeHandle, placementDateChangeHandle)
                                    : indentDetailTableColumns(onClickViewButton)
                            }
                            isNextPage={
                                orderDetails.pagination
                                && orderDetails.pagination.next
                            }
                            onReachEnd={() => {
                                dispatch(setCurrentPage(orderDetails.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={
                                editable
                                    ? indentDetailTableEditableColumns(refrenceIdsChangeHandler, appointmentDateChangeHandle, placementDateChangeHandle)
                                    : indentDetailTableColumns(onClickViewButton)
                            }
                            currentPage={orderDetails.currentPage}
                            rowsPerPage={orderDetails.pageSize}
                            rowsPerPageOptions={rowsPerPageOptions}
                            totalCount={orderDetails.pagination && orderDetails.pagination.count}
                            listData={!editable ? orderDetails.listData : editableOrders}
                            onChangePage={(event: any, page: number) => {
                                dispatch(setCurrentPage(page));
                            }}
                            onChangeRowsPerPage={(event: any) => {
                                dispatch(setRowPerPage(event.target.value))
                            }}
                        />
                }
            </PageContainer>
            <IndentCancelModal
                open={openCancelModal}
                indentCode={indentCode}
                onSuccess={() => {
                    setOpenCancelModal(false);
                    history.goBack();
                }}
                onClose={() => {
                    setOpenCancelModal(false);
                }}
            />
        </div >
    )

    function onClickViewButton(element: any) {
        history.push(`${OrderDetailsUrl}${element.freightOrderCode}`)
    }

    function refrenceIdsChangeHandler(text: any, element: any) {
        if (!editableOrders && editableOrders.length === 0) {
            return;
        }
        const orders = editableOrders.map((order: any) => {
            if (order.freightOrderCode === element.freightOrderCode) {
                return {
                    ...order,
                    referenceId: text
                }
            }
            return order
        })
        setEditableOrders(orders);
    }

    function appointmentDateChangeHandle(date: any, element: any) {
        if (!editableOrders && editableOrders.length === 0) {
            return;
        }
        const orders = editableOrders.map((order: any) => {
            if (order.freightOrderCode === element.freightOrderCode) {
                return {
                    ...order,
                    orderAppointmentDatetime: date
                }
            }
            return order
        })
        setEditableOrders(orders);
    }

    function placementDateChangeHandle(date: any, element: any) {
        if (!editableOrders && editableOrders.length === 0) {
            return;
        }
        const orders = editableOrders.map((order: any) => {
            if (order.freightOrderCode === element.freightOrderCode) {
                return {
                    ...order,
                    orderPlacementDatetime: date
                }
            }
            return order
        })
        setEditableOrders(orders);
    }

    async function saveClickHandler() {
        var params: any = [];
        editableOrders.forEach((item: any) => {
            if (item.statusName === OrderStatusLabel.CONFIRMED || item.statusName === OrderStatusLabel.PENDING) {
                params.push({
                    freightOrderCode: item.freightOrderCode,
                    referenceId: item.referenceId,
                    orderAppointmentDatetime: item.orderAppointmentDatetime && convertDateTimeServerFormat(item.orderAppointmentDatetime),
                    orderPlacementDatetime: item.orderPlacementDatetime && convertDateTimeServerFormat(item.orderPlacementDatetime)
                })
            }
        })
        if (params && params.length > 0) {
            setLoading(true);
            let response = await appDispatch(updateReferenceIds({ orders: params }));
            response && response.message && appDispatch(showAlert(response.message))
            if (response) {
                setEditable(false);
                const queryParams: any = {
                    indentCode,
                    page: orderDetails.currentPage,
                    pageSize: orderDetails.pageSize,
                };
                const orderData = await appDispatch(getOrderList(queryParams))
                dispatch(setResponse(orderData));
            }
            setLoading(false);
        } else {
            setEditable(false);
        }
    }

    function checkOrderFlag(arr: any) {
        let flag = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].statusName === OrderStatusLabel.CONFIRMED || arr[i].statusName === OrderStatusLabel.PENDING) {
                flag = 1;
                break;
            }
        }
        if (flag === 1) {
            return false;
        } else
            return true;
    }
}
export default IndentDetail;
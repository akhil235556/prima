import { Card, CardContent, CardHeader } from '@material-ui/core';
import { CheckCircleRounded, Close, Edit, KeyboardBackspace } from '@material-ui/icons';
import React, { useEffect, useReducer } from "react";
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { demandOrderTabsEnum, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { DOListingUrl, OrderDetailsUrl } from '../../../base/constant/RoutePath';
import { convertDateFormat, displayDateTimeFormatter } from '../../../base/utility/DateUtils';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from "../../../base/utility/ViewUtils";
import { LaneView } from "../../../component/CommonView";
import DataNotFound from '../../../component/error/DataNotFound';
import Filter from '../../../component/filter/Filter';
import Information from '../../../component/information/Information';
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from '../../../component/widgets/button/Button';
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import CardList from '../../../component/widgets/cardlist/CardList';
import { CustomToolTip } from '../../../component/widgets/CustomToolTip';
import TableList from '../../../component/widgets/tableView/TableList';
import { InfoTooltip } from '../../../component/widgets/tooltip/InfoTooltip';
import CreateDemandModal from '../../../modals/CreateDemandModal/CreateDemandModal';
import WarningModal from '../../../modals/warningModal/WarningModal';
import { showAlert } from '../../../redux/actions/AppActions';
import {
    setCurrentPage,
    setResponse, setRowPerPage,
    setSelectedElement
} from '../../../redux/actions/OrderActions';
import OrderReducer, { ORDER_STATE } from "../../../redux/reducers/OrderReducer";
import { getOrderList } from '../../../serviceActions/OrderServiceActions';
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';
import { consigneeLabel, createdAtLabel, customerLabel, dipatchedByLabel, doDetailsTitle, laneLabel, remarksLabel, totalQtyLabel, transporterLabel, uomLabel } from './base/demandOrderMessageUtils';
import { demandOrderFOColumn, doChildColumn } from './base/demandOrderTemplate';
import { approveDemandOrder, deleteDemandOrder, getDOList } from './demandOrdersApi/demandOrderServiceActions';

function DODetails() {
    const history = useHistory();
    const { id } = useParams<any>();
    const appDispatch = useDispatch();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [loadingList, setLoadingList] = React.useState<boolean>(false);
    const [approveLoading, setApproveLoading] = React.useState<boolean>(false);
    const [cancelLoading, setCancelLoading] = React.useState<boolean>(false);
    const [DODetails, setDODetails] = React.useState<any>({});
    const [deleteWarning, setDeleteWarning] = React.useState<boolean>(false);
    const [lanePointsDisplay, setLanePointsDisplay] = React.useState<boolean>(false);
    const [showEditDemandModal, setShowEditDemandModal] = React.useState<boolean>(false);
    const [state = ORDER_STATE, dispatch] = useReducer(OrderReducer, ORDER_STATE);
    const eclipseLength = isMobile ? 6 : 28;
    const urlState: any = history.location.state
    const isBulk: any = urlState?.isBulk
    const path: any = urlState?.path
    const search: any = urlState?.search

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            let doQueryParams: any = {
                demandOrderCode: id
            };
            appDispatch(getDOList(doQueryParams)).then((response: any) => {
                if (response && response.data && response.data[0]) {
                    let doDetails: any = response.data && response.data[0]
                    setDODetails(doDetails);
                } else {
                    setDODetails({})
                }
                setLoading(false)
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (!isObjectEmpty(DODetails)) {
            if (DODetails.status !== demandOrderTabsEnum.PENDING) {
                setLoadingList(true);
                let orderQueryParams: any = {
                    page: state.currentPage,
                    pageSize: state.pageSize,
                    demandOrderCode: id
                }
                appDispatch(getOrderList(orderQueryParams)).then((innerResponse: any) => {
                    if (innerResponse) {
                        dispatch(setResponse(innerResponse));
                    }
                    setLoadingList(false);
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.pageSize, state.currentPage, DODetails])

    return (
        <div className="order-detail-wrapper">
            <WarningModal
                open={deleteWarning}
                onClose={() => {
                    setDeleteWarning(false);
                }}
                warningMessage={"Are you sure want to delete demand order?"}
                primaryButtonTitle={"Confirm"}
                secondaryuttonTitle={"Cancel"}
                onSuccess={() => {
                    setDeleteWarning(false);
                    setCancelLoading(true)
                    appDispatch(deleteDemandOrder({ demandOrderId: DODetails.id })).then((response: any) => {
                        if (response) {
                            response.message && appDispatch(showAlert(response.message));
                            isBulk ? history.push({
                                pathname: DOListingUrl + demandOrderTabsEnum.PENDING,
                                state: { isBulk: true }
                            }) :
                                history.goBack();
                        }
                        setCancelLoading(false)
                    });
                }}
            />

            <LanePointsDisplayModal
                open={lanePointsDisplay}
                laneCode={DODetails && DODetails.laneCode}
                onClose={() => {
                    setLanePointsDisplay(false);
                }}
            />
            <CreateDemandModal
                open={showEditDemandModal}
                isEditable
                selectedElement={DODetails}
                sourceType={DODetails && DODetails.sourceType}
                onSuccess={() => {
                    history.goBack();
                    setShowEditDemandModal(false);
                }}
                onClose={() => {
                    setShowEditDemandModal(false);
                }}
            />

            <div className="filter-wrap">
                <Filter
                    pageTitle={doDetailsTitle}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        isBulk ? history.push({
                            pathname: path,
                            search: search,
                            state: { isBulk: true }
                        }) :
                            history.goBack();

                    }}
                >
                </Filter>
            </div>

            <PageContainer>
                <Card className="creat-contract-wrapp creat-wrapp">
                    <CardHeader className="creat-contract-header"
                        title={DODetails.demandOrderCode}
                    />
                    {(loading || loadingList) ?
                        <CardContentSkeleton
                            row={3}
                            column={3}
                        />
                        : (
                            !isObjectEmpty(DODetails) ?
                                <CardContent className="creat-contract-content">
                                    <div className="custom-form-row row">
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={totalQtyLabel}
                                                text={DODetails.quantity || "....."}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={uomLabel}
                                                text={DODetails.unit}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={customerLabel}
                                                customView={
                                                    <InfoTooltip
                                                        title={DODetails.vendorName || "....."}
                                                        placement={"top"}
                                                        disableInMobile={"false"}
                                                        infoText={DODetails.vendorName || "....."}
                                                    />
                                                }
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={consigneeLabel}
                                                customView={
                                                    <InfoTooltip
                                                        title={DODetails.consigneeName || "....."}
                                                        placement={"top"}
                                                        disableInMobile={"false"}
                                                        infoText={DODetails.consigneeName || "....."}
                                                    />
                                                }
                                            />
                                        </div>
                                        {DODetails && DODetails.status !== demandOrderTabsEnum.PENDING &&
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={transporterLabel}
                                                    customView={
                                                        <InfoTooltip
                                                            title={(DODetails.transporter && DODetails.transporter.transporterName) || "....."}
                                                            placement={"top"}
                                                            disableInMobile={"false"}
                                                            infoText={(DODetails.transporter && DODetails.transporter.transporterName) || "....."}
                                                        />
                                                    }
                                                />
                                            </div>
                                        }

                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={laneLabel}
                                                text={DODetails.laneDisplayName}
                                                customView={<LaneView element={DODetails} onClickLaneCode={(data: any) => { setLanePointsDisplay(true); }} />}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={createdAtLabel}
                                                text={DODetails.createdAt && convertDateFormat(DODetails.createdAt, displayDateTimeFormatter)}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={dipatchedByLabel}
                                                text={DODetails.dispatchBy && convertDateFormat(DODetails.dispatchBy, displayDateTimeFormatter)}
                                            />
                                        </div>
                                        <div className="labelWidth col-md-3 billing-group col-6">
                                            <Information
                                                title={remarksLabel}
                                                customView={
                                                    <div className="d-flex ">
                                                        <p>{DODetails.remarks || "....."}</p>
                                                        {
                                                            DODetails.remarks &&
                                                            DODetails.remarks.length >= eclipseLength &&
                                                            <CustomToolTip
                                                                title={DODetails.remarks}
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
                                    </div>
                                </CardContent>
                                :
                                <DataNotFound />
                        )}
                </Card>

                <Card className="creat-contract-wrapp creat-wrapp">
                    <CardHeader className="creat-contract-header"
                        title={"Products"}
                    />
                    {(loading || loadingList) ?
                        <CardContentSkeleton
                            row={3}
                            column={3}
                        />
                        :
                        <CardContent className="creat-contract-content">
                            <div className="table-detail-listing">
                                <TableList
                                    tableColumns={doChildColumn()}
                                    currentPage={0}
                                    rowsPerPage={25}
                                    rowsPerPageOptions={rowsPerPageOptions}
                                    listData={DODetails.product}
                                    onChangePage={(event: any, page: number) => {
                                    }}
                                    onChangeRowsPerPage={(event: any) => {
                                    }}
                                />
                            </div>
                        </CardContent>
                    }
                </Card>

                {state.listData && state.listData.length > 0 &&
                    <Card className="creat-contract-wrapp creat-wrapp">
                        <CardHeader className="creat-contract-header"
                            title={"Freight Order"}
                        />
                        {(loading || loadingList) ?
                            <CardContentSkeleton
                                row={3}
                                column={6}
                            />
                            :
                            <CardContent className="creat-contract-content">
                                <div className="table-detail-listing">
                                    {
                                        isMobile ?
                                            <CardList
                                                listData={state.listData}
                                                tableColumns={demandOrderFOColumn(onClickLaneCode, onClickViewButton)}
                                                isNextPage={state.pagination && state.pagination.next}
                                                onReachEnd={() => {
                                                    dispatch(setCurrentPage(state.pagination.next))
                                                }}
                                            />
                                            :
                                            <TableList
                                                tableColumns={demandOrderFOColumn(onClickLaneCode, onClickViewButton)}
                                                currentPage={state.currentPage}
                                                rowsPerPage={state.pageSize}
                                                rowsPerPageOptions={rowsPerPageOptions}
                                                totalCount={state.pagination && state.pagination.count}
                                                listData={state.listData}
                                                onChangePage={(event: any, page: number) => {
                                                    dispatch(setCurrentPage(page))
                                                }}
                                                onChangeRowsPerPage={(event: any) => {
                                                    dispatch(setRowPerPage(event.target.value))
                                                }}
                                            />
                                    }
                                </div>
                            </CardContent>
                        }
                    </Card>}

                {!isObjectEmpty(DODetails) &&
                    DODetails.status === demandOrderTabsEnum.PENDING &&
                    <div className="text-right">
                        <Button
                            buttonStyle={"btn-orange mr-3"}
                            // title={isMobile ? "" : "Edit"}
                            title={"Edit"}
                            loading={loading}
                            leftIcon={<Edit />}
                            onClick={() => setShowEditDemandModal(true)}
                        />
                        <Button
                            buttonStyle="btn-red mr-3"
                            title={"Cancel"}
                            disable={approveLoading || cancelLoading}
                            loading={cancelLoading}
                            leftIcon={<Close />}
                            onClick={() => {
                                setDeleteWarning(true);
                            }}
                        />
                        <Button
                            buttonStyle="btn-blue"
                            title={"Approve"}
                            disable={approveLoading || cancelLoading}
                            loading={approveLoading}
                            leftIcon={<CheckCircleRounded />}
                            onClick={() => {
                                setApproveLoading(true)
                                appDispatch(approveDemandOrder({ demandOrderId: DODetails.id })).then((response: any) => {
                                    if (response) {
                                        response.message && appDispatch(showAlert(response.message));
                                        isBulk ? history.push({
                                            pathname: DOListingUrl + demandOrderTabsEnum.PENDING,
                                            state: { isBulk: true }
                                        }) :
                                            history.goBack();
                                    }
                                    setApproveLoading(false)
                                });
                            }}
                        />

                    </div>}
            </PageContainer>
        </div>
    );

    function onClickLaneCode(element: any) {
        setLanePointsDisplay(true)
        dispatch(setSelectedElement(element))
    }

    function onClickViewButton(element: any) {
        element && history.push({
            pathname: OrderDetailsUrl + element.freightOrderCode,
            search: "?demandOrderCode=" + id
        });
    }
}
export default DODetails;
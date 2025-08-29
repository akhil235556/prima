import { Card, CardContent, CardHeader, Tab, Tabs } from '@material-ui/core';
import { KeyboardBackspace } from '@material-ui/icons';
import React, { useEffect, useReducer } from "react";
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { rowsPerPageOptions, stockDetailsTab } from '../../../base/constant/ArrayList';
import { DODetailsUrl } from "../../../base/constant/RoutePath";
import { isMobile } from "../../../base/utility/ViewUtils";
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import TableCollapseList from '../../../component/widgets/tableView/tableCollapseList/TableCollapseList';
import TableList from '../../../component/widgets/tableView/TableList';
import CreateDemandModal from '../../../modals/CreateDemandModal/CreateDemandModal';
import ModifyDemandModal from '../../../modals/ModifyDemandModal/ModifyDemandModal';
import WarningModal from '../../../modals/warningModal/WarningModal';
import { showAlert, toggleModal } from '../../../redux/actions/AppActions';
import { TabPanel } from '../../allNotification/AllNotificationTab';
import { productDetailColumn } from '../demandOrders/base/demandOrderTemplate';
import { approveDemandOrder, deleteDemandOrder, getDOList, modifyRejectDO } from '../demandOrders/demandOrdersApi/demandOrderServiceActions';
import OrderViewUtils from '../OrderViewUtils';
import { stoDetailsTitle } from './base/stockTransferOrderMessageUtils';
import { stoDemandOrderChildrenTableColumn, stoDemandOrderTableColumn } from './base/stockTransferOrderTemplate';
import { getSTOConsigneeDetails, getSTODetails, getSTOProductDetails, getSTOVendorDetails } from './stockTransferOrdersApi/stoServiceActions';
import { refreshList, setCurrentPage, setRowPerPage, setSelectedElement, setSelectedTab } from './stoRedux/StockTransferActions';
import StockTransferReducer, { STOCK_TRANSFER_STATE } from './stoRedux/StockTransferReducer';

function STODetails() {
    const history = useHistory();
    const { id } = useParams<any>();
    const appDispatch = useDispatch();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [STODetails, setSTODetails] = React.useState<any>({});
    const [vendorDetails, setVendorDetails] = React.useState<any>({});
    const [consigneeDetails, setConsigneeDetails] = React.useState<any>({});
    const [productDetails, setProductDetails] = React.useState<any>([]);
    const [DOList, setDOList] = React.useState<any>([]);
    const [deleteWarning, setDeleteWarning] = React.useState<boolean>(false);
    const [showModifyDemandModal, setShowModifyDemandModal] = React.useState<boolean>(false);
    const [showRejectDemandModal, setShowRejectDemandModal] = React.useState<boolean>(false);
    const [state = STOCK_TRANSFER_STATE, dispatch] = useReducer(StockTransferReducer, STOCK_TRANSFER_STATE);
    const urlState: any = history.location.state
    const isBulk: any = urlState?.isBulk
    const path: any = urlState?.path
    const search: any = urlState?.search

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            let stoQueryParams: any = {
                stoId: id
            };
            let doListQueryParams: any = {
                page: state.currentPage,
                size: state.pageSize,
            }
            let promiseArray: any = [appDispatch(getSTODetails(stoQueryParams)), appDispatch(getSTOConsigneeDetails(stoQueryParams)), appDispatch(getSTOProductDetails(stoQueryParams)), appDispatch(getSTOVendorDetails(stoQueryParams))]
            Promise.all(promiseArray).then((response: any) => {
                if (response && response[0] && response[0].data && response[0].data[0]) {
                    setSTODetails(response[0].data[0])
                } else {
                    setSTODetails([])
                }
                if (response && response[1]) {
                    setConsigneeDetails(response[1])
                } else {
                    setConsigneeDetails({})
                }
                if (response && response[2]) {
                    setProductDetails(response[2]);
                } else {
                    setProductDetails([])
                }
                if (response && response[3]) {
                    setVendorDetails(response[3]);
                } else {
                    setVendorDetails({})
                }
                if (response && response[0] && response[0].data && response[0].data[0] && response[0].data[0].sourceNumber && response[0].data[0].type) {
                    return appDispatch(getDOList({ ...doListQueryParams, sourceNumber: response[0].data[0].sourceNumber, sourceType: response[0].data[0].type }));
                }
                setLoading(false)
            }).then((response: any) => {
                if (response && response.data && response.data.length) {
                    setDOList(response.data);
                } else {
                    setDOList([])
                }
                setLoading(false)
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList]);


    return (
        <div className="order-detail-wrapper">
            <WarningModal
                open={showRejectDemandModal || deleteWarning}
                onClose={() => {
                    showRejectDemandModal ? setShowRejectDemandModal(false) : setDeleteWarning(false);
                }}
                warningMessage={showRejectDemandModal ? "Are you sure want to Reject Demand order?" : (deleteWarning ? "Are you sure want to delete demand order?" : "")}
                primaryButtonTitle={"Confirm"}
                secondaryuttonTitle={"Cancel"}
                onSuccess={() => {
                    showRejectDemandModal ? setShowRejectDemandModal(false) : setDeleteWarning(false);
                    let params: any = {
                        demandOrderId: state.selectedItem && state.selectedItem.id,
                    };
                    let promise: any = deleteWarning ? deleteDemandOrder(params) : modifyRejectDO(params);
                    appDispatch(promise).then((response: any) => {
                        if (response) {
                            response.message && appDispatch(showAlert(response.message));
                            setDOList([]);
                            dispatch(refreshList());
                        }
                    })
                }
                }
            />
            {/* Show Demand Modal for edit Demand Order*/}
            <CreateDemandModal
                open={state.openModal}
                isEditable
                selectedElement={state.selectedItem}
                sourceType={state.selectedItem && state.selectedItem.sourceType}
                onSuccess={() => {
                    dispatch(refreshList());
                    dispatch(toggleModal())
                    setSelectedElement(null);
                }}
                onClose={() => {
                    dispatch(toggleModal())
                    setSelectedElement(null);
                }}
            />

            <ModifyDemandModal
                open={showModifyDemandModal}
                selectedElement={state.selectedItem}
                sourceType={state.selectedItem && state.selectedItem.sourceType}
                onSuccess={() => {
                    dispatch(refreshList());
                    setShowModifyDemandModal(false);
                    setSelectedElement(null);
                }}
                onClose={() => {
                    setShowModifyDemandModal(false);
                    setSelectedElement(null);
                }}
            />

            <div className="filter-wrap">
                <Filter
                    pageTitle={stoDetailsTitle}
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
                <Card className="creat-contract-wrapp card-tab-wrap">
                    {loading ?
                        <CardContentSkeleton
                            row={2}
                            column={4}
                        /> :
                        <div className="tab-nav">
                            <div className="billing-info-header">
                                <Tabs value={state.selectedTabIndex}
                                    onChange={(event: any, newValue: any) => {
                                        if (newValue !== state.selectedTabIndex) {
                                            dispatch(setSelectedTab(newValue));
                                        }
                                    }}
                                    variant="scrollable"
                                    scrollButtons={isMobile ? "on" : "off"}
                                >
                                    {
                                        stockDetailsTab.map((element: any, index: any) => (
                                            <Tab
                                                key={index}
                                                label={element}
                                            />
                                        ))
                                    }
                                </Tabs>
                            </div>
                            <TabPanel
                                value={state.selectedTabIndex}
                                index={state.selectedTabIndex}>
                                <CardContent className="creat-contract-content">
                                    <OrderViewUtils
                                        selectedIndex={state.selectedTabIndex}
                                        element={setDetails(state.selectedTabIndex)}
                                    />
                                </CardContent>
                            </TabPanel>
                        </div>}
                </Card>

                <Card className="creat-contract-wrapp creat-wrapp">
                    <CardHeader className="creat-contract-header"
                        title="Products"
                    />
                    {loading ?
                        <CardContentSkeleton
                            row={2}
                            column={6}
                        />
                        :
                        productDetails && productDetails.length > 0 &&
                        <CardContent className="creat-contract-content">
                            <div className="table-detail-listing">
                                <TableList
                                    tableColumns={productDetailColumn()}
                                    currentPage={0}
                                    rowsPerPage={25}
                                    rowsPerPageOptions={rowsPerPageOptions}
                                    listData={productDetails}
                                    onChangePage={(event: any, page: number) => {
                                        //dispatch(setCurrentPage(page));
                                    }}
                                    onChangeRowsPerPage={(event: any) => {
                                        //dispatch(setRowPerPage(event.target.value))
                                    }}
                                />
                            </div>
                        </CardContent>
                    }
                </Card>


                {DOList && DOList.length > 0 &&
                    <Card className="creat-contract-wrapp creat-wrapp">
                        <CardHeader className="creat-contract-header"
                            title="Demand Orders"
                        />
                        <CardContent className="creat-contract-content">
                            <div className="table-collapse-detail-listing">
                                <TableCollapseList
                                    tableColumns={stoDemandOrderTableColumn(onClickDemandButton, onClickApproveButton, onClickModifyAccept, onClickModifyReject, onClickEdit, onClickDeleteButton, STODetails.status)}
                                    currentPage={state.currentPage}
                                    rowsPerPage={state.pageSize}
                                    rowsPerPageOptions={rowsPerPageOptions}
                                    listData={DOList}
                                    childElementKey={'product'}
                                    childrenColumns={stoDemandOrderChildrenTableColumn()}
                                    onChangePage={(event: any, page: number) => {
                                        dispatch(setCurrentPage(page));
                                    }}
                                    onChangeRowsPerPage={(event: any) => {
                                        dispatch(setRowPerPage(event.target.value))
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                }

            </PageContainer>
        </div>
    );

    function onClickDemandButton(element: any) {
        element && history.push({
            pathname: DODetailsUrl + element.demandOrderCode,
        });
    };

    function onClickApproveButton(element: any) {
        appDispatch(approveDemandOrder({ demandOrderId: element.id })).then((response: any) => {
            if (response) {
                response.message && appDispatch(showAlert(response.message));
                dispatch(refreshList());
                setDOList([])
            }
        });
    }

    function onClickModifyAccept(element: any) {
        setShowModifyDemandModal(true);
        dispatch(setSelectedElement(element));
    }

    function onClickModifyReject(element: any) {
        setShowRejectDemandModal(true);
        dispatch(setSelectedElement(element));
    }

    function onClickEdit(element: any) {
        dispatch(toggleModal());
        dispatch(setSelectedElement(element));
    }

    function onClickDeleteButton(element: any) {
        setDeleteWarning(true);
        dispatch(setSelectedElement(element));
    }

    function setDetails(index: any) {
        if (index === 0) {
            return STODetails;
        }
        else if (index === 1) {
            return vendorDetails;
        }
        else if (index === 2) {
            return consigneeDetails;
        }
    }
}
export default STODetails;
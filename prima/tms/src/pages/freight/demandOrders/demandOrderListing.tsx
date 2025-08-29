import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { GetApp, KeyboardBackspace, List, LocalShipping, Publish, Tune } from "@material-ui/icons";
import React, { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { demandFilterOptions, demandOrderStatusTabValue, demandOrderTabsEnum, doFilterOptions, RegisterJobs, rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { AssignBulkDemandOrderUrl, AssignDemandOrderUrl, DODetailsUrl, DOListingUrl } from "../../../base/constant/RoutePath";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { convertDateFormat, displayDateTimeFormatter } from '../../../base/utility/DateUtils';
import { getAdvanceFilterChips, useQuery } from "../../../base/utility/Routerutils";
import { isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Chips from '../../../component/chips/Chips';
import FileAction from '../../../component/fileAction/FileAction';
import Filter from "../../../component/filter/Filter";
import PageContainer from "../../../component/pageContainer/PageContainer";
import SearchFilter from "../../../component/searchfilter/SearchFilters";
import { TabPanel } from "../../../component/tabs/TabPanel";
import Button from '../../../component/widgets/button/Button';
import ExpendableCardList from "../../../component/widgets/cardlist/ExpendableCardList";
import TableCollapseList from "../../../component/widgets/tableView/tableCollapseList/TableCollapseList";
import TableList from '../../../component/widgets/tableView/TableList';
import BulkUploadDialog from '../../../modals/BulkUploadDialog/BulkUploadDialog';
import CreateDemandModal from '../../../modals/CreateDemandModal/CreateDemandModal';
import ModifyDemandModal from '../../../modals/ModifyDemandModal/ModifyDemandModal';
import WarningModal from '../../../modals/warningModal/WarningModal';
import { DO_Filters } from "../../../moduleUtility/FilterUtils";
import { showAlert } from '../../../redux/actions/AppActions';
import { setResponse } from '../../../redux/actions/LocationActions';
import DemandOrderAction from './base/demandOrderAction';
import { bulkProcessTitle, bulkUploadTitle, doListingTitle, downloadCsvTitle } from './base/demandOrderMessageUtils';
import { demandOrderBulkTableColumn, demandOrderTableColumn, doChildColumn, modifyDemandChildColumn, modifyDemandColumn } from "./base/demandOrderTemplate";
import DemandOrderFilters from './demandOrderFilters';
import "./demandOrderListing.css";
import { hideLoading, refreshList, setCheckedListResponse, setCurrentPage, setRowPerPage, setSelectedElement, setSelectedTab, showLoading, toggleBulkUpload, toggleFilter, toggleModal } from "./demandOrderRedux/DemandOrderAction";
import DemandOrderReducer, { DEMAND_ORDER_STATE } from "./demandOrderRedux/DemandOrderReducer";
import { approveBulkDemandOrder, approveDemandOrder, deleteBulkDemandOrder, deleteDemandOrder, getDOList, getModifyDOList, modifyRejectDO } from './demandOrdersApi/demandOrderServiceActions';

function DOListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const { id } = useParams<any>();
    const params = useQuery();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(DO_Filters);
    const [state = DEMAND_ORDER_STATE, dispatch] = useReducer(DemandOrderReducer, DEMAND_ORDER_STATE);
    const [deleteWarning, setDeleteWarning] = React.useState<boolean>(false);
    const [bulkDeleteWarning, setBulkDeleteWarning] = React.useState<boolean>(false);
    const [showModifyDemandModal, setShowModifyDemandModal] = React.useState<boolean>(false);
    const [showRejectDemandModal, setShowRejectDemandModal] = React.useState<boolean>(false);
    const [allValue, setAllValue] = React.useState<any>(false)
    const urlState: any = history.location.state
    const [isBulk, setIsBulk] = React.useState<any>(urlState?.isBulk ? true : false)

    const fileActionOptions = [
        {
            menuTitle: bulkProcessTitle,
            Icon: List,
            onClick: () => {
                setIsBulk(true)
            }
        },
        {
            menuTitle: bulkUploadTitle,
            Icon: Publish,
            onClick: () => {
                dispatch(toggleBulkUpload())
            },
        },
        {
            menuTitle: downloadCsvTitle,
            Icon: GetApp,
            tooltipTitle: "You can only download the visible data on your screen.",
            onClick: () => {
                // eslint-disable-next-line
                let csvContent = "DO Number,Status,SKU,Product Type,Product Name,Material Name,Material Unit,Balance Qty,Total Qty,UoM,Customer,Location,Consignee,Source No.,Transporter,Created at,Dispatch by" + "\n"
                if (state?.listData?.length) {
                    csvContent += state?.listData?.map((e: any) => {
                        return e?.product?.map((item: any) => {
                            return ((e?.demandOrderCode || "NA") + "," + (e?.status || "NA") + "," + (item?.productCode || "NA") + "," +
                                (item?.productType || "NA") + "," + (item?.productName || "NA") + "," +
                                (item?.materialName || "NA") + "," + (item?.doMaterialUnits || "NA") + "," +
                                (item?.balanceQuantity || "NA") + "," + (item?.productQuantity || "NA") + "," + (item?.unit || "NA") + "," +
                                (e?.vendorName || "NA") + "," + (e?.locationName || "NA") + "," + (e?.consigneeName || "NA") + "," +
                                (e?.sourceNumber || "NA") + "," + (e?.transporter?.transporterName || "NA") + "," +
                                ((e?.createdAt && convertDateFormat(e?.createdAt, displayDateTimeFormatter)) || "NA") + "," +
                                ((e?.dispatchBy && convertDateFormat(e?.dispatchBy, displayDateTimeFormatter)) || "NA")
                            )
                        })
                    }).flat(Infinity).join("\n");
                }
                let blob = new Blob([csvContent], { type: "text/csv" });
                let link = document.createElement("a");
                link.setAttribute("href", window.URL.createObjectURL(blob));
                link.setAttribute("download", "DemandOrderList.csv");
                document.body.appendChild(link);
                link.click();
            }
        }
    ];

    useEffect(() => {
        setAllValue(false);
        const getList = async () => {
            let queryParams: any = {
                page: state.currentPage,
                size: state.pageSize,
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params);
            }
            if (queryParams && queryParams.queryFieldLabel) {
                delete queryParams["queryFieldLabel"]
            }
            dispatch(setSelectedTab(id ? demandOrderStatusTabValue.indexOf(id) : 0))
            dispatch(showLoading())
            if (id === demandOrderStatusTabValue[2]) {
                appDispatch(getModifyDOList({ ...queryParams, status: demandOrderStatusTabValue[2] })).then((response: any) => {
                    if (response) {
                        dispatch(setResponse(response))
                    }
                    dispatch(hideLoading())
                });
            } else {
                appDispatch(getDOList({ ...queryParams, status: id ? id : demandOrderStatusTabValue[0] })).then((response: any) => {
                    if (response) {
                        dispatch(setResponse(response))
                    }
                    dispatch(hideLoading())
                });
            }
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.pageSize, history.location.search, id, isBulk]);

    return (
        <div className="demand-order-wrapper">
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
                            history.push({
                                pathname: DOListingUrl + (showRejectDemandModal ? demandOrderTabsEnum.APPROVED : demandOrderTabsEnum.REJECTED),
                            })
                        }
                    })
                }
                }
            />
            <WarningModal
                open={bulkDeleteWarning}
                onClose={() => {
                    setBulkDeleteWarning(false);
                }}
                warningMessage={bulkDeleteWarning ? "Are you sure you want to delete selected demand orders?" : ""}
                primaryButtonTitle={"Confirm"}
                secondaryuttonTitle={"Cancel"}
                onSuccess={() => {
                    setBulkDeleteWarning(false);
                    let doIds: any = []
                    state.listData && state.listData.forEach((demandOrder: any) => {
                        if (demandOrder.isCheckboxChecked) {
                            doIds.push(demandOrder.id)
                        }
                    })
                    let params: any = {
                        demandOrderIds: doIds
                    };
                    appDispatch(deleteBulkDemandOrder(params)).then((response: any) => {
                        if (response) {
                            response.message && appDispatch(showAlert(response.message));
                            setIsBulk(false)
                            history.push({
                                pathname: DOListingUrl + demandOrderTabsEnum.REJECTED,

                            })
                        }
                    })
                }
                }
            />
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

            <BulkUploadDialog
                title="Bulk Upload"
                open={state.openBulkUpload}
                jobName={RegisterJobs.DEMAND_ORDER}
                onClose={() => {
                    dispatch(toggleBulkUpload());
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

            <DemandOrderFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                addQuickSearch={isMobile}
                tabValue={id ? id : demandOrderTabsEnum.PENDING}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    dispatch(refreshList());
                    dispatch(toggleFilter());
                    addFiltersQueryParams(filterChips, filterParams);
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <div className="filter-wrap">
                {isBulk ? (
                    <Filter
                        pageTitle={doListingTitle}
                        buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                        buttonTitle={isMobile ? " " : "Back"}
                        leftIcon={<KeyboardBackspace />}
                        onClick={() => {
                            history.location.state = {};
                            setIsBulk(!isBulk)
                        }}
                    >{
                            <Button
                                buttonStyle={"btn-orange"}
                                title={isMobile ? " " : "Filter"}

                                leftIcon={<Tune />}
                                onClick={() => {
                                    dispatch(toggleFilter());
                                }}
                            />
                        }
                    </Filter>
                ) : (
                    <Filter
                        pageTitle={doListingTitle}
                        buttonStyle="btn-orange"
                        buttonTitle={isMobile ? " " : "Filter"}
                        leftIcon={<Tune />}
                        onClick={() => {
                            dispatch(toggleFilter())
                        }}
                    >{<FileAction
                        options={state.selectedTabIndex === 0 ? fileActionOptions :
                            state.selectedTabIndex === 1 ? fileActionOptions.slice(1) :
                                fileActionOptions.slice(2)}
                    />}
                    </Filter>
                )}
            </div>
            <div>
                <div className="bill-tab tab-nav">
                    {isBulk ? (
                        <Tabs value={0} onChange={(event: any, newValue: any) => { }}
                            variant="scrollable"
                            scrollButtons={isMobile ? "on" : "off"}
                        >
                            <Tab
                                label={demandOrderStatusTabValue[state.selectedTabIndex ? state.selectedTabIndex : 0]}
                            />
                        </Tabs>
                    ) : <Tabs value={state.selectedTabIndex} onChange={(event: any, newValue: any) => {
                        if (newValue !== state.selectedTabIndex) {
                            dispatch(setSelectedTab(newValue));
                            dispatch(setCurrentPage(1));
                            dispatch(setRowPerPage(rowsPerPageOptions[0]));
                            history.replace({
                                pathname: DOListingUrl + demandOrderStatusTabValue[newValue],
                                search: params.toString()
                            });
                        }
                    }}
                        variant="scrollable"
                        scrollButtons={isMobile ? "on" : "off"}
                    >
                        {demandOrderStatusTabValue.map((element, index) => (
                            <Tab
                                key={index}
                                label={element} />
                        ))}
                    </Tabs>}
                </div>
                <div>
                    {isBulk ?
                        <>
                            {!isMobile &&
                                <SearchFilter
                                    list={(id === demandOrderStatusTabValue[0] || id === demandOrderStatusTabValue[1] || isNullValue(id)) ? doFilterOptions : demandFilterOptions}
                                    appliedFilters={filterState.params}
                                    onClickSearch={(params: any) => {
                                        dispatch(refreshList());
                                        if (params) {
                                            addFiltersQueryParams(filterState.chips, {
                                                ...filterState.params,
                                                queryField: params.field.value,
                                                queryFieldLabel: params.field.label,
                                                query: params.text
                                            });
                                        } else {
                                            removeFiltersQueryParams(["queryField", "queryFieldLabel", "query"])
                                        }
                                    }}
                                >{bulkActionButton(id ? id : demandOrderStatusTabValue[0])}</SearchFilter>}
                        </> :
                        <>
                            {!isMobile &&
                                <SearchFilter
                                    list={(id === demandOrderStatusTabValue[0] || id === demandOrderStatusTabValue[1] || isNullValue(id)) ? doFilterOptions : demandFilterOptions}
                                    appliedFilters={filterState.params}
                                    onClickSearch={(params: any) => {
                                        dispatch(refreshList());
                                        if (params) {
                                            addFiltersQueryParams(filterState.chips, {
                                                ...filterState.params,
                                                queryField: params.field.value,
                                                queryFieldLabel: params.field.label,
                                                query: params.text
                                            });
                                        } else {
                                            removeFiltersQueryParams(["queryField", "queryFieldLabel", "query"])
                                        }
                                    }}
                                />}
                        </>
                    }
                </div>
                <TabPanel
                    value={state.selectedTabIndex}
                    index={state.selectedTabIndex}>
                    {pageContent}
                </TabPanel>
            </div>
        </div>
    );

    function pageContent() {
        return (
            <PageContainer
                loading={state.loading}
                listData={state.listData}
            >
                {!isObjectEmpty(getAdvanceFilterChips(filterState.chips))
                    && Object.keys(getAdvanceFilterChips(filterState.chips)).map((element: any, index: any) => (
                        <Chips
                            key={index}
                            label={filterState.chips[element]}
                            onDelete={() => {
                                dispatch(refreshList());
                                if (element === "productName") {
                                    removeFiltersQueryParams([element, "productSKU"])
                                }
                                if (element === "productSKU") {
                                    removeFiltersQueryParams([element, "productName"])
                                }
                                if (element === "fromDate" || element === "toDate" || element === "query") {
                                    let secondKey = element === "fromDate" ? "toDate" : "fromDate";
                                    let extraMobileKey = element === "query" ? ["queryField", "queryFieldLabel"] : []
                                    removeFiltersQueryParams([element, secondKey, ...extraMobileKey])
                                } else {
                                    removeFiltersQueryParams([element]);
                                }
                            }}
                        />
                    ))}

                {!isBulk ?
                    (isMobile ?
                        <ExpendableCardList
                            listData={state.listData}
                            tableColumns={(id === demandOrderStatusTabValue[2]) ? modifyDemandColumn(onClickDemandButton, onClickModifyAccept, onClickModifyReject, demandOrderStatusTabValue[2]) : demandOrderTableColumn(onClickDemandButton, onClickProceedButton, onClickApprove, onClickEdit, onClickDelete, onClickModifyAccept, onClickModifyReject, id ? id : demandOrderStatusTabValue[0])}
                            isNextPage={state.pagination && state.pagination.next}
                            childElementKey={(id === demandOrderStatusTabValue[2]) ? 'modifyProduct' : 'product'}
                            childTableColumns={(id === demandOrderStatusTabValue[2]) ? modifyDemandChildColumn() : doChildColumn()}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableCollapseList
                            tableColumns={(id === demandOrderStatusTabValue[2]) ? modifyDemandColumn(onClickDemandButton, onClickModifyAccept, onClickModifyReject, demandOrderStatusTabValue[2]) : demandOrderTableColumn(onClickDemandButton, onClickProceedButton, onClickApprove, onClickEdit, onClickDelete, onClickModifyAccept, onClickModifyReject, id ? id : demandOrderStatusTabValue[0])}
                            currentPage={state.currentPage}
                            rowsPerPage={state.pageSize}
                            rowsPerPageOptions={rowsPerPageOptions}
                            totalCount={state.pagination && state.pagination.count}
                            childElementKey={(id === demandOrderStatusTabValue[2]) ? 'modifyProduct' : 'product'}
                            childrenColumns={(id === demandOrderStatusTabValue[2]) ? modifyDemandChildColumn() : doChildColumn()}
                            listData={state.listData}
                            onChangePage={(event: any, page: number) => {
                                dispatch(setCurrentPage(page));
                            }}
                            onChangeRowsPerPage={(event: any) => {
                                dispatch(setRowPerPage(event.target.value));
                            }}

                        />) :
                    <>
                        <TableList
                            tableColumns={demandOrderBulkTableColumn(onClickDemandButton, id, handleChecks, handleAllChecks, allValue)}
                            currentPage={state.currentPage}
                            rowsPerPage={state.pageSize}
                            rowsPerPageOptions={rowsPerPageOptions}
                            totalCount={state.pagination && state.pagination.count}
                            listData={state.listData}
                            onChangePage={(event: any, page: number) => {
                                dispatch(setCurrentPage(page));
                            }}
                            onChangeRowsPerPage={(event: any) => {
                                dispatch(setRowPerPage(event.target.value));
                            }}
                        />
                        {isMobile && state.listData && state.listData.length > 0 &&
                            <div className="mt-3 text-right">
                                {bulkActionButton(id ? id : demandOrderStatusTabValue[0])}
                            </div>}
                    </>
                }
            </PageContainer>
        );
    }

    function bulkActionButton(status: any) {
        if (status === demandOrderTabsEnum.PENDING) {
            return (
                <DemandOrderAction
                    status={status}
                    isDisabled={false}
                    bulk={true}
                    onClickApprove={() => {
                        if (countSelectedDOs() === 0) {
                            appDispatch(showAlert("Please select atleast one DO to approve", false));
                            return;
                        }
                        onClickBulkApprove();
                    }}
                    onClickDelete={() => {
                        if (countSelectedDOs() === 0) {
                            appDispatch(showAlert("Please select atleast one DO to delete", false));
                            return;
                        }
                        onClickBulkDelete()
                    }}
                />
            )
        } else if (state.selectedTabIndex && demandOrderStatusTabValue[state.selectedTabIndex] === demandOrderTabsEnum.APPROVED) {
            return (
                <Button
                    buttonStyle="btn-outline-blue proced pendingProceed"
                    title="Proceed"
                    leftIcon={<LocalShipping />}
                    onClick={() => {
                        if (countSelectedDOs() === 0) {
                            appDispatch(showAlert("Please select atleast one DO to proceed", false));
                            return;
                        }
                        onClickBulkProceedButton()
                    }}
                />
            )
        }
    }

    function handleChecks(demandOrderCode: any, checked: any) {
        let checkArray: any = [];
        let checkedCounts: any = 0;
        checkArray = state.listData && state.listData.map((item: any) => {
            let itemList: any = item;
            if (item.isCheckboxChecked) {
                checkedCounts++;
            }
            if (item.demandOrderCode === demandOrderCode) {
                itemList.isCheckboxChecked = checked;
                if (checked) {
                    checkedCounts++;
                }
            }
            return itemList;
        })
        if (checked) {
            if (checkedCounts === (state.listData && state.listData.length)) {
                setAllValue(true);
            }
        } else {
            setAllValue(false);
        }
        dispatch(setCheckedListResponse(checkArray));
    }

    function handleAllChecks(checked: any) {
        let checkArray: any = [];
        checkArray = state.listData && state.listData.map((item: any) => {
            return {
                ...item,
                isCheckboxChecked: checked
            };
        })
        dispatch(setCheckedListResponse(checkArray));
        setAllValue(checked)
    }

    function countSelectedDOs() {
        let count = 0;
        state.listData && state.listData.forEach((item: any) => {
            if (item.isCheckboxChecked) {
                count++;
            }
        })
        return count;
    }

    function onClickDemandButton(element: any) {
        element && history.push({
            pathname: DODetailsUrl + element.demandOrderCode,
            state: { isBulk: isBulk, tab: id, path: history.location.pathname, search: history.location.search }
        });
    }

    function onClickBulkProceedButton() {
        let checkedOrders: any = [];
        state.listData && state.listData.forEach((item: any) => {
            if (item.isCheckboxChecked === true) {
                checkedOrders.push(item)
            }
        })
        checkedOrders && history.push({
            /*pathname: AssignDemandOrderUrl + element.demandOrderCode,
            search: "?laneCode=" + element.laneCode + "&tabName=" + (id ? id : demandOrderStatusTabValue[0])*/
            pathname: AssignBulkDemandOrderUrl,
            state: checkedOrders
        });
    }

    function onClickBulkApprove() {
        //dispatch(showLoading())
        let contractList: any = [];
        state && state.listData && state.listData.forEach((item: any) => {
            if (item.isCheckboxChecked) {
                contractList.push(item.id)
            }
        })
        appDispatch(approveBulkDemandOrder({ demandOrderIds: contractList })).then((response: any) => {
            if (response) {
                response.message && appDispatch(showAlert(response.message));
                history.push({
                    pathname: DOListingUrl + demandOrderTabsEnum.APPROVED,
                })
                setIsBulk(false);
                //dispatch(hideLoading());
            }
        });
    }

    function onClickBulkDelete() {
        setBulkDeleteWarning(true);
    }

    function onClickProceedButton(element: any) {
        element && history.push({
            pathname: AssignDemandOrderUrl + element.demandOrderCode,
            search: "?laneCode=" + element.laneCode + "&tabName=" + (id ? id : demandOrderStatusTabValue[0])
        });
    }

    function onClickApprove(element: any) {
        appDispatch(approveDemandOrder({ demandOrderId: element.id })).then((response: any) => {
            if (response) {
                response.message && appDispatch(showAlert(response.message));
                history.push({
                    pathname: DOListingUrl + demandOrderTabsEnum.APPROVED,
                })
            }
        });
    }

    function onClickEdit(element: any) {
        dispatch(toggleModal());
        dispatch(setSelectedElement(element));
    }

    function onClickDelete(element: any) {
        setDeleteWarning(true);
        dispatch(setSelectedElement(element));
    }

    function onClickModifyAccept(element: any) {
        setShowModifyDemandModal(true);
        dispatch(setSelectedElement(element));
    }

    function onClickModifyReject(element: any) {
        setShowRejectDemandModal(true);
        dispatch(setSelectedElement(element));
    }
}

export default DOListing;
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { KeyboardBackspace, List, Publish, Tune } from "@material-ui/icons";
import React, { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { poOptions, RegisterJobs, rowsPerPageOptions, sourceTypeEnum, stockTransferStatusEnum, stockTransferStatusTab } from "../../../base/constant/ArrayList";
import { bulkProcessTitle } from '../../../base/constant/MessageUtils';
import { EditBulkPO, PODetailsUrl, POListingUrl } from "../../../base/constant/RoutePath";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { getAdvanceFilterChips, useQuery } from "../../../base/utility/Routerutils";
import { isObjectEmpty } from "../../../base/utility/StringUtils";
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
import CreateDemandModal from "../../../modals/CreateDemandModal/CreateDemandModal";
import { PO_Filters } from "../../../moduleUtility/FilterUtils";
import { showAlert } from '../../../redux/actions/AppActions';
import { toggleModal } from "../../../redux/actions/FreightActions";
import { refreshList, setCheckedListResponse, setCurrentPage, setRowPerPage, setSelectedTab, showLoading, toggleFilter } from "../purchaseOrders/purchaseOrdersRedux/purchaseOrdersActions";
import { poListingTitle } from './base/purchaseOrderMessageUtils';
import { poBulkTableColumn, poChildColumn, poTableColumn } from "./base/purchaseOrderTemplate";
import POFilters from './POFilters';
import { getPOList } from './purchaseOrdersApi/purchaseOrderServiceActions';
import { setSelectedElement } from './purchaseOrdersRedux/purchaseOrdersActions';
import PurchaseOrderReducer, { PURCHASE_ORDER_STATE } from "./purchaseOrdersRedux/PurchaseOrdersReducer";

function POListing() {
    const history = useHistory();
    //const [error, setError] = React.useState<any>({});
    const appDispatch = useDispatch();
    const { id } = useParams<any>();
    const params = useQuery();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(PO_Filters);
    const [state = PURCHASE_ORDER_STATE, dispatch] = useReducer(PurchaseOrderReducer, PURCHASE_ORDER_STATE);
    const [allValue, setAllValue] = React.useState<any>(false)
    const urlState: any = history.location.state
    const [isBulk, setIsBulk] = React.useState<any>(urlState?.isBulk ? true : false)
    const [bulkUploadDialog, setBulkUploadDialog] = React.useState<any>(false)


    useEffect(() => {
        const getList = async () => {
            setAllValue(false);
            let queryParams: any = {
                page: state.currentPage,
                size: state.pageSize,
                status: id ? id : stockTransferStatusEnum.PENDING
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params);
            }
            if (queryParams && queryParams.queryFieldLabel) {
                delete queryParams["queryFieldLabel"]
            }

            dispatch(showLoading())
            appDispatch(getPOList(dispatch, queryParams, id ? id : state.selectedTabName));
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.pageSize, history.location.search, id, isBulk]);

    return (
        <div className="so-listing-wrapper">
            <POFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                addQuickSearch={isMobile}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    dispatch(refreshList());
                    dispatch(toggleFilter());
                    addFiltersQueryParams(filterChips, filterParams)
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <BulkUploadDialog
                title="Bulk Upload"
                open={bulkUploadDialog}
                jobName={RegisterJobs.PurchaseOrder}
                onClose={() => {
                    setBulkUploadDialog(false);
                }}
            />
            <CreateDemandModal
                open={state.openModal}
                selectedElement={state.selectedItem}
                sourceType={sourceTypeEnum.PO}
                onSuccess={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(toggleModal());
                }}
                onClose={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(toggleModal());
                }}
            />
            <div className="filter-wrap">
                {isBulk ? (
                    <Filter
                        pageTitle={poListingTitle}
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
                        pageTitle={poListingTitle}
                        buttonStyle="btn-orange"
                        buttonTitle={isMobile ? " " : "Filter"}
                        leftIcon={<Tune />}
                        onClick={() => {
                            dispatch(toggleFilter())
                        }}
                    >{state.selectedTabIndex === 0 &&
                        <FileAction
                            options={[
                                {
                                    menuTitle: bulkProcessTitle,
                                    Icon: List,
                                    onClick: () => {
                                        setIsBulk(true)
                                    }
                                },
                                {
                                    menuTitle: "Bulk Upload",
                                    Icon: Publish,
                                    onClick: () => setBulkUploadDialog(true)
                                },
                            ]}
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
                                key={0}
                                label={stockTransferStatusTab[0]}
                            />
                        </Tabs>
                    ) : <Tabs value={state.selectedTabIndex} onChange={(event: any, newValue: any) => {
                        if (newValue !== state.selectedTabIndex) {
                            dispatch(setSelectedTab(newValue));
                            dispatch(setCurrentPage(1));
                            dispatch(setRowPerPage(rowsPerPageOptions[0]));
                            history.replace({
                                pathname: POListingUrl + stockTransferStatusTab[newValue],
                                search: params.toString()
                            });
                        }
                    }}
                        variant="scrollable"
                        scrollButtons={isMobile ? "on" : "off"}
                    >
                        {stockTransferStatusTab.map((element, index) => (
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
                                    list={poOptions}
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
                                >{state.listData && state.listData.length > 0 &&
                                    <Button
                                        leftIcon={<img src="/images/Create-demand-white.png" alt="weight" />}
                                        title={"Create Demand"}
                                        buttonStyle="btn-blue demand-icon-white mr-2"
                                        onClick={() => {
                                            if (countSelectedPOs() === 0) {
                                                appDispatch(showAlert("Please select atleast one PO.", false));
                                                return;
                                            }
                                            else {
                                                onClickEditBulkDemandOrders()
                                            }
                                        }}
                                    />}</SearchFilter>}
                        </> :
                        <>
                            {!isMobile &&
                                <SearchFilter
                                    list={poOptions}
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
                            label={element === "distanceMin" ? `Minimum Distance : ${filterState.chips[element]}` : (element === "distanceMax" ? `Maximum Distance : ${filterState.chips[element]}` : filterState.chips[element])}
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
                    isMobile ?
                        <ExpendableCardList
                            listData={state.listData}
                            tableColumns={poTableColumn(onClickViewButton, onClickSourceButton, state.selectedTabName)}
                            isNextPage={state.pagination && state.pagination.next}
                            childElementKey={'product'}
                            childTableColumns={poChildColumn()}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableCollapseList
                            tableColumns={poTableColumn(onClickViewButton, onClickSourceButton, state.selectedTabName)}
                            currentPage={state.currentPage}
                            rowsPerPage={state.pageSize}
                            rowsPerPageOptions={rowsPerPageOptions}
                            totalCount={state.pagination && state.pagination.count}
                            childElementKey={'product'}
                            childrenColumns={poChildColumn()}
                            listData={state.listData}
                            onChangePage={(event: any, page: number) => {
                                dispatch(setCurrentPage(page));
                            }}
                            onChangeRowsPerPage={(event: any) => {
                                dispatch(setRowPerPage(event.target.value));
                            }}
                        /> :
                    <>
                        <TableList
                            tableColumns={poBulkTableColumn(handleChecks, handleAllChecks, allValue, onClickSourceButton, state.selectedTabName)}
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
                                <Button
                                    leftIcon={<img src="/images/Create-demand-white.png" alt="weight" />}
                                    title={"Create Demand"}
                                    buttonStyle="btn-blue"
                                    onClick={() => {
                                        if (countSelectedPOs() === 0) {
                                            appDispatch(showAlert("Please select atleast one PO.", false));
                                            return;
                                        }
                                        else {
                                            onClickEditBulkDemandOrders()
                                        }
                                    }}
                                />
                            </div>}
                    </>
                }
            </PageContainer>
        );
    }

    function handleChecks(sourceNumber: any, checked: any) {
        let checkArray: any = [];
        let checkedCounts: any = 0;
        checkArray = state.listData && state.listData.map((item: any) => {
            let itemList: any = item;
            if (item.isCheckboxChecked) {
                checkedCounts++;
            }
            if (item.sourceNumber === sourceNumber) {
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

    function countSelectedPOs() {
        let count = 0;
        state.listData && state.listData.forEach((item: any) => {
            if (item.isCheckboxChecked) {
                count++;
            }
        })
        return count;
    }

    function onClickEditBulkDemandOrders() {
        let checkedOrders: any = [];
        state.listData && state.listData.forEach((item: any) => {
            if (item.isCheckboxChecked === true) {
                checkedOrders.push(item)
            }
        })
        history.push({
            pathname: EditBulkPO,
            state: checkedOrders,
        });
    }

    function onClickViewButton(element: any) {
        dispatch(setSelectedElement(element));
        dispatch(toggleModal());
    }

    function onClickSourceButton(element: any) {
        element && history.push({
            pathname: PODetailsUrl + element.id,
            state: { isBulk: isBulk, tab: id, path: history.location.pathname, search: history.location.search }
        });
    }
}

export default POListing;
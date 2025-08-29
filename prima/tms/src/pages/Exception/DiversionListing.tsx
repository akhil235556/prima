import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { useEffect, useReducer } from "react";
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { diversionSearchOptions, diversionStatusEnum, diversionTab, diversionTabEnum, rowsPerPageOptions } from "../../base/constant/ArrayList";
import { DiversionDetailUrl, DiversionRequestDetailsUrl, DiversionUrl } from "../../base/constant/RoutePath";
import { useSearchParams } from '../../base/hooks/useSearchParams';
import { isNullValue, isObjectEmpty } from '../../base/utility/StringUtils';
import { isMobile } from "../../base/utility/ViewUtils";
import Filter from "../../component/filter/Filter";
import PageContainer from "../../component/pageContainer/PageContainer";
import SearchFilter from "../../component/searchfilter/SearchFilters";
import { TabPanel } from '../../component/tabs/TabPanel';
import CardContentSkeleton from '../../component/widgets/cardContentSkeleton/CardContentSkeleton';
import CardList from '../../component/widgets/cardlist/CardList';
import ExpendableCardList from "../../component/widgets/cardlist/ExpendableCardList";
import TableCollapseList from "../../component/widgets/tableView/tableCollapseList/TableCollapseList";
import TableList from '../../component/widgets/tableView/TableList';
import WarningModal from '../../modals/warningModal/WarningModal';
import { DiversionFilter } from '../../moduleUtility/FilterUtils';
import { showAlert } from '../../redux/actions/AppActions';
import { hideLoading, refreshList, setCurrentPage, setResponse, setRowPerPage, showLoading } from '../../redux/actions/DiversionActions';
import DiversionListingReducer, { DIVERSION_STATE } from '../../redux/reducers/DiversionListingReducer';
import { diversionApprove, diversionListing, diversionReject } from '../../serviceActions/OrderServiceActions';
import { diversionChildColumn, diversionTableColumn } from "../../templates/DiversionTemplate";
import MaterialTableModal from '../freight/order/MaterialTableModal';
import DiversionModal from './DiversionModal';


function DiversionListing() {
    const history = useHistory();
    const appDispatch = useDispatch()
    const [state = DIVERSION_STATE, dispatch] = useReducer(DiversionListingReducer, DIVERSION_STATE);
    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const { tabName } = useParams<any>();
    const [value, setValue] = React.useState<any>();
    const [openCancelModal, setOpenCancelModal] = React.useState<boolean>(false);
    const [rejectParams, setRejectParams] = React.useState<any>({})
    const [viewMaterialTableModal, setViewMaterialTableModal] = React.useState<boolean>(false);
    const [materialResponse, setMaterialResponse] = React.useState<any>([]);
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(DiversionFilter);

    useEffect(() => {
        if (!isNullValue(tabName)) {
            setValue(diversionTab.indexOf(tabName))
        } else {
            setValue(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabName])

    useEffect(() => {
        const getList = async () => {
            let queryParams: any = {
                page: state.currentPage,
                pageSize: state.pageSize,
                status: getDiversionTabStatus(value)
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params);
            }
            if (queryParams && queryParams.queryFieldLabel) {
                delete queryParams["queryFieldLabel"]
            }
            appDispatch(showLoading())
            appDispatch(diversionListing(queryParams))
                .then((response: any) => {
                    dispatch(setResponse(response));
                });
            appDispatch(hideLoading())
        }
        (value >= 0) && getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.pageSize, history.location.search, value]);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
        if (newValue === value) return;
        setValue(newValue)
        history.push(DiversionUrl + diversionTab[newValue])
        dispatch(setCurrentPage(1));
        dispatch(setRowPerPage(rowsPerPageOptions[0]));
    };

    function getDiversionTabStatus(value: any) {
        let status = ""
        switch (value) {
            case 0:
                status = diversionStatusEnum.PENDING
                break;
            case 1:
                status = diversionStatusEnum.IN_PROGRESS
                break;
            case 2:
                status = diversionStatusEnum.COMPLETED
                break;
            case 3:
                status = diversionStatusEnum.REJECTED
                break;
            default:
                status = ""
        }
        return status
    }

    function onClickViewMaterial(element: any) {
        setViewMaterialTableModal(true)
        setMaterialResponse(element)
    }

    function onClickApprove(element: any) {
        const params = {
            requestId: element.requestId,
            oldFreightOrderCode: element.oldFreightOrderCode,
            id: element.id
        }
        appDispatch(diversionApprove(params)).then((response: any) => {
            appDispatch(showAlert(response))
            dispatch(refreshList());
        })
    }

    function onClickReject(element: any) {
        setOpenCancelModal(true)
        setRejectParams({
            requestId: element.requestId,
            oldFreightOrderCode: element.oldFreightOrderCode,
            id: element.id
        })
    }


    return (
        <div>
            <div className="filter-wrap">
                <Filter
                    pageTitle="Diversion"
                    // buttonStyle="btn-detail"
                    // buttonTitle={id && "Back"}
                    buttonStyle={isMobile ? "" : "btn-orange"}
                    buttonTitle={isMobile ? " " : "Diversion"}
                    leftIcon={<img src="/images/diversion.png" alt="Diversion" />}
                    onClick={() => {
                        setOpenModal((open) => !open)
                    }}
                />
            </div>
            <DiversionModal
                open={openModal}
                onClose={() => {
                    setOpenModal(false)
                }}
                onSuccess={() => {
                    setOpenModal(false)
                    dispatch(refreshList());
                }}
            />
            <MaterialTableModal
                open={viewMaterialTableModal}
                onClose={() => {
                    setViewMaterialTableModal(false)
                }}
                selectedElement={materialResponse}
            />

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
                    appDispatch(showLoading())

                    appDispatch(diversionReject(rejectParams)).then((response: any) => {
                        appDispatch(showAlert(response))
                        // dispatch(refreshList());
                        setRejectParams({})
                        dispatch(refreshList());
                    })
                    appDispatch(hideLoading())
                }}
            />
            <div>
                <div className="bill-tab tab-nav">
                    <Tabs value={value} onChange={handleChange}
                        variant="scrollable"
                        scrollButtons={isMobile ? "on" : "off"}
                    >
                        {diversionTab.map((element, index) => (
                            <Tab
                                key={index}
                                label={element}
                            />
                        ))}
                    </Tabs>
                </div>
                <div>
                    {!isMobile &&
                        <SearchFilter
                            list={diversionSearchOptions(tabName)}
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
                        />
                    }
                </div>
                <TabPanel
                    value={value}
                    index={value}>
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
                {state.loading ?
                    <CardContentSkeleton
                        row={4}
                        column={4}
                    />
                    :
                    <>
                        {tabName !== diversionTabEnum.COMPLETED ?
                            (
                                isMobile ?
                                    <ExpendableCardList
                                        listData={state.listData}
                                        tableColumns={diversionTableColumn(tabName, onClickApprove, onClickReject, onClickRequestId, onClickProceedButton, onClickRejectedDetails, onClickCompletedDetails)}
                                        isNextPage={state.pagination && state.pagination.next}
                                        childElementKey={'shipmentDetails'}
                                        childTableColumns={diversionChildColumn(onClickViewMaterial)}
                                        onReachEnd={() => {
                                            dispatch(setCurrentPage(state.pagination.next))
                                        }}
                                    />
                                    :
                                    <TableCollapseList
                                        tableColumns={diversionTableColumn(tabName, onClickApprove, onClickReject, onClickRequestId, onClickProceedButton, onClickRejectedDetails, onClickCompletedDetails)}
                                        currentPage={state.currentPage}
                                        rowsPerPage={state.pageSize}
                                        rowsPerPageOptions={rowsPerPageOptions}
                                        totalCount={state.pagination && state.pagination.count}
                                        childElementKey={'shipments'}
                                        childrenColumns={diversionChildColumn(onClickViewMaterial)}
                                        listData={state.listData}
                                        onChangePage={(event: any, page: number) => {
                                            dispatch(setCurrentPage(page));
                                        }}
                                        onChangeRowsPerPage={(event: any) => {
                                            dispatch(setRowPerPage(event.target.value));
                                        }}
                                    />
                            ) :
                            isMobile ?
                                <CardList
                                    listData={state.listData}
                                    tableColumns={diversionTableColumn(tabName, onClickApprove, onClickReject, onClickRequestId, onClickProceedButton, onClickRejectedDetails, onClickCompletedDetails)}
                                    isNextPage={state.pagination && state.pagination.next}
                                    onReachEnd={() => {
                                        dispatch(setCurrentPage(state.pagination.next))
                                    }}
                                />
                                :
                                <TableList
                                    tableColumns={diversionTableColumn(tabName, onClickApprove, onClickReject, onClickRequestId, onClickProceedButton, onClickRejectedDetails, onClickCompletedDetails)}
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
                        }
                    </>
                }
            </PageContainer>
        );

    }
    function onClickRequestId(element: any) {
        history.push({
            pathname: DiversionRequestDetailsUrl + element.requestId,
            search: "?tabName=" + (tabName ? tabName : diversionTabEnum.DIVERSION_REQUEST),
        })
    }

    function onClickProceedButton(element: any) {
        history.push({
            pathname: DiversionRequestDetailsUrl + element.requestId,
            search: "?tabName=" + (tabName ? tabName : diversionTabEnum.DIVERSION_REQUEST)
        })
    }
    function onClickCompletedDetails(element: any) {
        history.push({
            pathname: DiversionDetailUrl + element.requestId,
            search: "?tabName=" + tabName
        })
    }
    function onClickRejectedDetails(element: any) {
        history.push({
            pathname: DiversionDetailUrl + element.requestId,
            search: "?tabName=" + tabName,
        })
    }

}



export default DiversionListing
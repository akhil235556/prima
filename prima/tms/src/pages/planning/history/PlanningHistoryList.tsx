import React, { useEffect, useReducer, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { PlanningCreatePlanUrl } from "../../../base/constant/RoutePath";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { isEmptyArray, isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Chips from "../../../component/chips/Chips";
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import CardList from "../../../component/widgets/cardlist/CardList";
import TableList from "../../../component/widgets/tableView/TableList";
import { planningHistoryFilters } from "../../../moduleUtility/FilterUtils";
import { hideLoading, refreshList, setCurrentPage, setResponse, setRowPerPage, setSelectedElement, showLoading, toggleFilter } from '../../../redux/actions/PlanningHistoryActions';
import PlanningHistoryReducer, { PLANNING_HISTORY_STATE } from '../../../redux/reducers/PlanningHistoryReducer';
import { downloadPlanningIndentOutputCsv, downloadPlanningOutputCsv, getPlanningHistoryListing, getPlanningResults } from "../../../serviceActions/PlanningServiceAction";
import { planningHistoryTableColumns } from "../../../templates/PlanningTemplates";
import "./PanningHistoryListing.css";
import PlanningHistoryFilters from "./PlanningHistoryFilters";
import PlanningHistorySidePanel, { getErrorDetails } from "./PlanningHistorySidePanel/PlanningHistorySidePanel";
import PlanningHistoryModal from "./PlanningHistorySidePanel/PlanningHistorySidePanelModal";

function PanningHistoryListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(planningHistoryFilters);
    const [state = PLANNING_HISTORY_STATE, dispatch] = useReducer(PlanningHistoryReducer, PLANNING_HISTORY_STATE);
    const [panelStatus, setPanelStatus] = useState(false);
    const [openSidePannelModal, setOpenSidePannelModal] = React.useState<boolean>(false);
    const userInfo = useSelector((state: any) => state.appReducer.userInfo, shallowEqual);

    useEffect(() => {
        const getList = async () => {
            let queryParams: any = {
                page: state.currentPage,
                pageSize: state.pageSize,
                partition: userInfo.partition,
                tenant: userInfo.tenant,
                node: userInfo.locationCode,
                //planningName: "mid-mile-sequential-planning"

            };
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params);
            }
            dispatch(showLoading());
            await appDispatch(getPlanningHistoryListing(queryParams)).then((response: any) => {
                if (response) {
                    dispatch(setResponse(response))
                    dispatch(hideLoading())
                } else {
                    dispatch(hideLoading())
                }
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.currentPage, state.pageSize, history.location.search, state.refreshList]);

    return (
        <div className="plan-listing-wrapper">
            <Filter
                pageTitle="Planning History"
            />
            <PlanningHistoryModal
                open={openSidePannelModal}
                selectedElement={state?.selectedItem}
                onClose={() => {
                    setOpenSidePannelModal(false);
                }}
            />
            <PlanningHistoryFilters
                open={state.openFilter}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    if (!isObjectEmpty(filterChips)) {
                        //dispatch(setFilter(filterChips, filterParams));
                        addFiltersQueryParams(filterChips, filterParams)
                    }
                    dispatch(toggleFilter());
                }}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <PageContainer
                loading={state.loading}
                listData={state.listData}
            >
                <div className={panelStatus ? `planning_history--wrapper` : ""}>
                    <div className={panelStatus && !isMobile ? "planning_history--left-panel" : ""}>
                        {!isObjectEmpty(filterState.chips) && Object.keys(filterState.chips).map((element) => (
                            <Chips
                                label={filterState.chips[element]}
                                onDelete={() => {
                                    dispatch(refreshList());
                                    removeFiltersQueryParams([element])
                                }}
                            />
                        ))}
                        {
                            isMobile ?
                                <CardList
                                    listData={state.listData}
                                    tableColumns={planningHistoryTableColumns(onClickDetailButton)}
                                    isNextPage={state.pagination && state.pagination.next}
                                    onReachEnd={() => {
                                        dispatch(setCurrentPage(state.pagination.next))
                                    }}
                                />
                                :
                                <TableList
                                    tableColumns={planningHistoryTableColumns(onClickDetailButton)}
                                    currentPage={state.currentPage}
                                    rowsPerPage={state.pageSize}
                                    rowsPerPageOptions={rowsPerPageOptions}
                                    totalCount={state.pagination && state.pagination.count}
                                    listData={state.listData}
                                    onChangePage={(event: any, page: number) => {
                                        dispatch(setCurrentPage(page));
                                    }}
                                    onChangeRowsPerPage={(event: any) => {
                                        dispatch(setRowPerPage(event.target.value))
                                    }}
                                    onClickRow={onClickViewButton}
                                />
                        }
                    </div>
                    {
                        panelStatus && !isMobile &&
                        <div className={panelStatus && !isMobile ? "planning_history--right-panel" : ""}>
                            <PlanningHistorySidePanel
                                onClose={() => { setPanelStatus(false); setOpenSidePannelModal(false) }}
                                selectedTask={state?.selectedItem} />
                        </div>
                    }
                </div>
            </PageContainer>
        </div>
    );

    function onClickViewButton(element: any) {
        // dispatch(toggleModal());
        dispatch(setSelectedElement(element));
        if (isMobile) {
            setOpenSidePannelModal(true);
            return
        }
        setPanelStatus(true)
    }

    async function onClickDetailButton(element: any) {
        let resFileLinks: any;
        let taskError: any;
        getErrorDetails(element, appDispatch).then((res: any) => {
            taskError = res;
        });
        let resultsResponse: any;
        appDispatch(getPlanningResults({ planning_request_id: element?.requestId })).then((res: any) => {
            if (!isEmptyArray(res)) {
                resultsResponse = res[0]
            };
            let promiseArray: any = [appDispatch(downloadPlanningOutputCsv({ planning_request_id: element?.requestId, })), appDispatch(downloadPlanningIndentOutputCsv({ planning_request_id: element?.requestId, }))]
            Promise.all(promiseArray).then((response: any) => {
                if (!isEmptyArray(response)) {
                    if (response[0]) { resFileLinks = { ...response[0]?.results } };
                    if (response[1]) { resFileLinks = { ...resFileLinks, ...response[1] } };
                }
                history.push({
                    pathname: PlanningCreatePlanUrl + element?.requestId,
                    state: { ...resultsResponse, ...resFileLinks, ...taskError, ...element, dashBoardVehicles: resultsResponse?.totalVehicles }
                })
            })
        });

    }


}

export default PanningHistoryListing;

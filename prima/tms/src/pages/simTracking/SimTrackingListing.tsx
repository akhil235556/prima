import { GetApp, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { rowsPerPageOptions } from '../../base/constant/ArrayList';
import { exportFile } from '../../base/constant/MessageUtils';
import { SimTrackingDetailUrl } from '../../base/constant/RoutePath';
import { useSearchParams } from '../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../base/utility/StringUtils';
import { isMobile } from '../../base/utility/ViewUtils';
import Chips from '../../component/chips/Chips';
import FileAction from '../../component/fileAction/FileAction';
import Filter from '../../component/filter/Filter';
import PageContainer from '../../component/pageContainer/PageContainer';
import CardList from '../../component/widgets/cardlist/CardList';
import TableList from '../../component/widgets/tableView/TableList';
import { getChipsObject } from '../../moduleUtility/DispatchUtility';
import { simFilters } from '../../moduleUtility/FilterUtils';
import { showAlert } from '../../redux/actions/AppActions';
import { hideLoading, refreshList, setCurrentPage, setResponse, setRowPerPage, setSelectedElement, showLoading, toggleFilter, togglePointsModal } from '../../redux/actions/SimTrackingActions';
import SimTrackingReducer, { SIM_TRACKING_STATE } from '../../redux/reducers/SimTrackingReducer';
import { simTrackingDownload, simTrackingList } from '../../serviceActions/SimTrackingServiceActions';
import { simTrackingListingTableColumns } from '../../templates/SimTrackingTemplates';
import LanePointsDisplayModal from '../masterPlatform/lane/LanePointsDisplayModal';
import SimTrackingFilters from './SimTrackingFilters';

function SimTrackingListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [state = SIM_TRACKING_STATE, dispatch] = useReducer(SimTrackingReducer, SIM_TRACKING_STATE);
    const [csvLoading, setCsvLoading] = React.useState<any>(false)
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(simFilters);


    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let queryParams: any = {
                page: state.currentPage,
                size: state.pageSize
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params)
            }
            appDispatch(simTrackingList(queryParams)).then((response: any) => {
                dispatch(setResponse(response))
                dispatch(hideLoading())
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.currentPage, state.refreshList, state.pageSize, history.location.search]);

    return (
        <div>
            <SimTrackingFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    //dispatch(setFilter(filterChips, filterParams));
                    dispatch(refreshList());
                    dispatch(toggleFilter());
                    addFiltersQueryParams(filterChips, filterParams)
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <LanePointsDisplayModal
                open={state.openPointModal}
                laneCode={state.selectedItem && state.selectedItem.laneCode}
                onClose={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(togglePointsModal());
                }}
            />


            <div className="filter-wrap">
                <Filter
                    pageTitle={"Sim Tracking Logs"}
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter())
                    }}
                >
                    <FileAction
                        disable={csvLoading}
                        options={[
                            {
                                menuTitle: exportFile,
                                Icon: GetApp,
                                onClick: () => {
                                    let queryParams: any = {};
                                    if (!isObjectEmpty(filterState.params)) {
                                        queryParams = Object.assign(queryParams, filterState.params)
                                    }
                                    setCsvLoading(true);
                                    appDispatch(simTrackingDownload(queryParams)).then((response: any) => {
                                        setCsvLoading(false);
                                        if (response && response.message && response?.code === 201) {
                                            appDispatch(showAlert(response.message))
                                        }
                                        dispatch(hideLoading())
                                        //response && response.link && window.open(response.link);
                                    }
                                    )
                                }
                            },
                        ]}
                    />
                </Filter>
            </div>
            <PageContainer
                loading={state.loading}
                listData={state.listData}
            >

                {!isObjectEmpty(filterState.chips) && Object.keys(getChipsObject(filterState.chips)).map((element) => (
                    <Chips
                        label={getChipsObject(filterState.chips)[element]}
                        onDelete={() => {
                            dispatch(refreshList());
                            if (element === "periodLabel") {
                                removeFiltersQueryParams([element, "fromDateLabel", "toDateLabel"])
                            } else {
                                removeFiltersQueryParams([element]);
                            }
                        }}
                    />
                ))}

                {
                    isMobile ?
                        <CardList
                            listData={state.listData}
                            tableColumns={simTrackingListingTableColumns(onClickViewButton, onClickLaneCode)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={simTrackingListingTableColumns(onClickViewButton, onClickLaneCode)}
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
            </PageContainer>

        </div>
    )
    function onClickViewButton(element: any) {
        history.push({
            pathname: SimTrackingDetailUrl + element.tripCode,
        });
    }
    function onClickLaneCode(element: any) {
        dispatch(setSelectedElement(element));
        dispatch(togglePointsModal());
    }
}
export default SimTrackingListing;
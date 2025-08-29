import { GetApp, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { rowsPerPageOptions, shipmentLogFiltersList } from '../../base/constant/ArrayList';
import { exportFile } from '../../base/constant/MessageUtils';
import { ShipmentTrackingLogsDetailsUrl } from '../../base/constant/RoutePath';
import { useSearchParams } from '../../base/hooks/useSearchParams';
import { getAdvanceFilterChips } from '../../base/utility/Routerutils';
import { isObjectEmpty } from '../../base/utility/StringUtils';
import { isMobile } from '../../base/utility/ViewUtils';
import Chips from '../../component/chips/Chips';
import FileAction from '../../component/fileAction/FileAction';
import Filter from '../../component/filter/Filter';
import PageContainer from '../../component/pageContainer/PageContainer';
import SearchFilter from '../../component/searchfilter/SearchFilters';
import CardList from '../../component/widgets/cardlist/CardList';
import TableList from '../../component/widgets/tableView/TableList';
import { getChipsObject } from '../../moduleUtility/DispatchUtility';
import { shipmentLogFilters } from '../../moduleUtility/FilterUtils';
import { showAlert } from '../../redux/actions/AppActions';
import { hideLoading, refreshList, setCurrentPage, setResponse, setRowPerPage, setSelectedElement, showLoading, toggleFilter, togglePointsModal } from '../../redux/actions/ShipmentLogActions';
import ShipmentLogReducer, { SHIPMENT_LOG_STATE } from '../../redux/reducers/ShipmentLogReducer';
import { shipmentLogList, shipmentTrackingDownload } from '../../serviceActions/ShipmentServiceActions';
import { shipmentLogListingTableColumns } from '../../templates/ShipmentLogTemplates';
import LanePointsDisplayModal from '../masterPlatform/lane/LanePointsDisplayModal';
import ShipmentLogFilters from "./ShipmentLogFilters";


function ShipmentLogListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [csvLoading, setCsvLoading] = React.useState<any>(false)
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(shipmentLogFilters);
    const [state = SHIPMENT_LOG_STATE, dispatch] = useReducer(ShipmentLogReducer, SHIPMENT_LOG_STATE);

    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let queryParams: any = {
                page: state.currentPage,
                size: state.pageSize,
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params)
            }
            if (queryParams && queryParams.queryFieldLabel) {
                delete queryParams["queryFieldLabel"]
            }
            appDispatch(shipmentLogList(queryParams)).then((response: any) => {
                dispatch(setResponse(response))
                dispatch(hideLoading())
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.currentPage, state.refreshList, state.pageSize, history.location.search]);

    return (
        <div>
            <ShipmentLogFilters
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
                    dispatch(setSelectedElement(undefined));
                    dispatch(togglePointsModal());
                }} />


            <div className="filter-wrap">
                <Filter
                    pageTitle={"Shipment Tracking Logs"}
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
                                    if (queryParams && queryParams.queryFieldLabel) {
                                        delete queryParams["queryFieldLabel"]
                                    }
                                    setCsvLoading(true);
                                    appDispatch(shipmentTrackingDownload(queryParams)).then((response: any) => {

                                        setCsvLoading(false);
                                        if (response && response.message && response?.code === 201) {
                                            appDispatch(showAlert(response.message))
                                        }
                                        dispatch(hideLoading())
                                        //response && response.link && window.open(response.link);
                                    })
                                }
                            },
                        ]}
                    />
                </Filter>
            </div>
            {
                !isMobile &&
                <SearchFilter
                    list={shipmentLogFiltersList}
                    appliedFilters={filterState.params}
                    onClickSearch={(params: any) => {
                        // setReturnParams(params);
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
            <PageContainer
                loading={state.loading}
                listData={state.listData}
            >

                {!isObjectEmpty(getAdvanceFilterChips(filterState.chips))
                    && Object.keys(getAdvanceFilterChips(filterState.chips)).map((element: any, index: any) => (
                        <Chips
                            key={index}
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
                            tableColumns={shipmentLogListingTableColumns(onClickViewButton, onClickLaneCode)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={shipmentLogListingTableColumns(onClickViewButton, onClickLaneCode)}
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
            pathname: ShipmentTrackingLogsDetailsUrl + element.freightShipmentCode,
        });
    }
    function onClickLaneCode(element: any) {
        dispatch(setSelectedElement(element))
        dispatch(togglePointsModal());
    }

}
export default ShipmentLogListing;
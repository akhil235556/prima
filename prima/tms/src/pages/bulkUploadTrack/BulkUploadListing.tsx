import { Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { rowsPerPageOptions } from '../../base/constant/ArrayList';
import { BulkUploadTrackViewUrl } from '../../base/constant/RoutePath';
import { useSearchParams } from '../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../base/utility/StringUtils';
import { isMobile } from '../../base/utility/ViewUtils';
import Chips from '../../component/chips/Chips';
import Filter from '../../component/filter/Filter';
import PageContainer from '../../component/pageContainer/PageContainer';
import CardList from '../../component/widgets/cardlist/CardList';
import TableList from '../../component/widgets/tableView/TableList';
import { bulkUploadFilters } from '../../moduleUtility/FilterUtils';
import { refreshList, setCurrentPage, setRowPerPage, showLoading, toggleFilter } from '../../redux/actions/BulkUploadTrackAction';
import BulkUploadReducer, { Bulk_Upload_STATE } from '../../redux/reducers/BulkUploadReducer';
import { bulkJobsList } from '../../serviceActions/BulkUploadServiceActions';
import { bulkUploadListingTableColumns } from '../../templates/BulkUploadTemplates';
import BulkUploadTrackFilters from './BulkUploadTrackFilters';



function BulkUploadTrack() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(bulkUploadFilters);
    const [state = Bulk_Upload_STATE, dispatch] = useReducer(BulkUploadReducer, Bulk_Upload_STATE);

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
            appDispatch(bulkJobsList(queryParams, dispatch))
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.currentPage, state.refreshList, state.pageSize, history.location.search]);

    return (
        <div>
            <BulkUploadTrackFilters
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
            <div className="filter-wrap">
                <Filter
                    pageTitle={"Bulk Upload"}
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter())
                    }}
                >
                </Filter>
            </div>
            <PageContainer
                loading={state.loading}
                listData={state.listData}
            >
                {!isObjectEmpty(filterState.chips) && Object.keys(filterState.chips).map((element) => (
                    <Chips
                        label={filterState.chips[element]}
                        onDelete={() => {
                            dispatch(refreshList());
                            if (element === "fromTimeDate" || element === "toTimeDate") {
                                let secondKey = element === "fromTimeDate" ? "toTimeDate" : "fromTimeDate";
                                removeFiltersQueryParams([element, secondKey])
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
                            tableColumns={bulkUploadListingTableColumns(onClickViewButton)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={bulkUploadListingTableColumns(onClickViewButton)}
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
            pathname: BulkUploadTrackViewUrl + element.requestId,
        });
    }
}
export default BulkUploadTrack;
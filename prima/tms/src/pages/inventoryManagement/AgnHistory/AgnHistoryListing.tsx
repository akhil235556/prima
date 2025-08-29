import { Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { AgnHistoryViewUrl } from '../../../base/constant/RoutePath';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import CardList from '../../../component/widgets/cardlist/CardList';
import TableList from '../../../component/widgets/tableView/TableList';
import { agnHistoryFilters } from '../../../moduleUtility/FilterUtils';
import { refreshList, setCurrentPage, setResponse, setRowPerPage, showLoading } from '../../../redux/actions/AgnHistoryAction';
import { toggleFilter } from '../../../redux/actions/UserActions';
import AgnHistoryReducer, { AGN_History_STATE } from '../../../redux/reducers/AgnHistoryReducer';
import { getAgnList } from '../../../serviceActions/AgnServiceActions';
import { agnHistoryTableColumns } from '../../../templates/InventoryTemplates';
import AgnHistoryFilters from './AgnHistoryFilter';


function AgnHistoryListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [state = AGN_History_STATE, dispatch] = useReducer(AgnHistoryReducer, AGN_History_STATE);
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(agnHistoryFilters);
    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let queryParams: any = {
                page: state.currentPage,
                pageSize: state.pageSize,
                // statusCode: AgnStatus.PENDING
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params)
            }
            appDispatch(getAgnList(queryParams)).then((response: any) => {
                dispatch(setResponse(response));
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.currentPage, state.refreshList, state.pageSize, history.location.search]);

    return (
        <div>
            <AgnHistoryFilters
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
                    pageTitle={"AGN History"}
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
                            removeFiltersQueryParams([element])
                        }}
                    />
                ))}
                {
                    isMobile ?
                        <CardList
                            listData={state.listData}
                            tableColumns={agnHistoryTableColumns(onClickViewButton)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={agnHistoryTableColumns(onClickViewButton)}

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
        history.push(AgnHistoryViewUrl + element.agnCode)
    }
}
export default AgnHistoryListing;
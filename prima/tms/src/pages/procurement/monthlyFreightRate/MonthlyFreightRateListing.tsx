import { Publish, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RegisterJobs, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import CardList from '../../../component/widgets/cardlist/CardList';
import TableList from '../../../component/widgets/tableView/TableList';
import BulkUploadDialog from '../../../modals/BulkUploadDialog/BulkUploadDialog';
import { monthlyFreightFilters } from "../../../moduleUtility/FilterUtils";
import {
    refreshList, setCurrentPage,
    setRowPerPage, setSelectedElement,
    showLoading, toggleFilter, toggleModal, togglePointsModal
} from '../../../redux/actions/MonthlyFreightActions';
import MonthlyFreightReducer, { MONTHLY_FREIGHT_STATE } from '../../../redux/reducers/MonthlyFreightReducer';
import { getMonthlyFreightList } from '../../../serviceActions/MonthlyFreightServiceActions';
import { monthlyFreightTableColumn } from '../../../templates/ProcurementTemplates';
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';
import MonthlyFreightFilter from './MonthlyFreightFilter';



function MonthlyFreightRateListing() {
    const history = useHistory();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(monthlyFreightFilters);
    const appDispatch = useDispatch();
    const [state = MONTHLY_FREIGHT_STATE, dispatch] = useReducer(MonthlyFreightReducer, MONTHLY_FREIGHT_STATE);
    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let queryParams: any = {
                pageNo: state.currentPage,
                pageSize: state.pageSize
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params)
            }
            appDispatch(getMonthlyFreightList(dispatch, queryParams))
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);

    return (
        <div>
            <MonthlyFreightFilter
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    //dispatch(setFilter(filterChips, filterParams));
                    dispatch(refreshList())
                    dispatch(toggleFilter());
                    addFiltersQueryParams(filterChips, filterParams)
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />

            <LanePointsDisplayModal
                open={state.openPointModal}
                laneCode={state.selectedItem && state.selectedItem.lane && state.selectedItem.lane.code}
                onClose={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(togglePointsModal());
                }} />
            <BulkUploadDialog
                title="Bulk Monthly Contract"
                open={state.openModal}
                jobName={RegisterJobs.DIESEL_RATE}
                onClose={() => {
                    dispatch(toggleModal());
                }}
            />
            <div className="filter-wrap">
                <Filter
                    pageTitle="Monthly Diesel Rate"
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <FileAction
                        disable={state.loading}
                        options={[
                            {
                                menuTitle: "Upload CSV File",
                                Icon: Publish,
                                onClick: () => dispatch(toggleModal())
                            },
                        ]}
                    />
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
                            //dispatch(removeFilter(element));
                            removeFiltersQueryParams([element]);
                        }}
                    />
                ))}
                {
                    isMobile ?
                        <CardList
                            listData={state.listData}
                            tableColumns={monthlyFreightTableColumn(onClickLaneCode)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={monthlyFreightTableColumn(onClickLaneCode)}
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
                        />
                }
            </PageContainer>
        </div >
    )

    function onClickLaneCode(element: any) {
        dispatch(setSelectedElement(element));
        dispatch(togglePointsModal());
    }
}
export default MonthlyFreightRateListing;
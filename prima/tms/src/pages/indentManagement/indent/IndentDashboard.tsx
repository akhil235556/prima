import { GetApp, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { downloadCsvTitle } from '../../../base/constant/MessageUtils';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import ExpendableCardList from '../../../component/widgets/cardlist/ExpendableCardList';
import TableCollapseList from '../../../component/widgets/tableView/tableCollapseList/TableCollapseList';
import { indentDashboardFilters } from '../../../moduleUtility/FilterUtils';
import {
    setCurrentPage,
    setRowPerPage, setSelectedElement,
    showLoading, toggleFilter, togglePointsModal
} from '../../../redux/actions/IndentDashboardAction';
import { refreshList } from '../../../redux/actions/RolesAction';
import IndentDashboardReducer, { INDENT_DASHBOARD_STATE } from '../../../redux/reducers/IndentDashboardReducer';
import { getCsvLink, getSobLaneContribution } from '../../../serviceActions/IndentDashboardServiceAction';
import { indentDashboardChildrenTableColumns, indentDashboardMobileTableColumns, indentDashboardTableColumns } from '../../../templates/IndentTemplates';
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';
import IndentDashboardFilters from './IndentDashboardFilters';


function IndentDashboard() {
    const appDispatch = useDispatch();
    const history = useHistory();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(indentDashboardFilters);

    const [state = INDENT_DASHBOARD_STATE, dispatch] = useReducer(IndentDashboardReducer, INDENT_DASHBOARD_STATE);
    const [CSVloading, setCSVLoading] = React.useState(false);

    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let queryParams: any = {}
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params)
            }
            appDispatch(getSobLaneContribution(dispatch, queryParams))
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);

    return (
        <div className="indent-listing-wrapper">
            <IndentDashboardFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    //dispatch(setFilter(filterChips, filterParams));
                    dispatch(toggleFilter());
                    addFiltersQueryParams(filterChips, filterParams)
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <LanePointsDisplayModal
                open={state.openPointModal}
                laneCode={
                    state.selectedItem
                    && state.selectedItem.laneCode
                }
                onClose={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(togglePointsModal());
                }} />
            <div className="filter-wrap">
                <Filter
                    pageTitle="Dashboard"
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <FileAction
                        disable={CSVloading}
                        options={[
                            {
                                menuTitle: downloadCsvTitle,
                                Icon: GetApp,
                                onClick: () => {
                                    let queryParams: any = {}
                                    if (!isObjectEmpty(filterState.params)) {
                                        queryParams = Object.assign(queryParams, filterState.params)
                                    }
                                    setCSVLoading(true);
                                    appDispatch(getCsvLink(queryParams)).then((response: any) => {
                                        setCSVLoading(false);
                                        response && response.link && window.open(response.link);
                                    })
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
                        <ExpendableCardList
                            listData={state.listData}
                            tableColumns={indentDashboardMobileTableColumns(onClickLaneCode)}
                            childTableColumns={indentDashboardChildrenTableColumns()}
                            childElementKey='childArr'
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableCollapseList
                            tableColumns={indentDashboardTableColumns(onClickLaneCode)}
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
                            childElementKey='childArr'
                            childrenColumns={indentDashboardChildrenTableColumns()}
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
export default IndentDashboard;
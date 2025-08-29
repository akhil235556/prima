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
import { forecastFilters } from '../../../moduleUtility/FilterUtils';
import {
    refreshList, setCurrentPage, setResponse, setRowPerPage,
    setSelectedElement, showLoading, toggleFilter, toggleModal
} from '../../../redux/actions/InventoryViewAction';
import InventoryViewReducer, { InventoryView_STATE } from '../../../redux/reducers/InventoryViewReducer';
import { getInventoryViewList } from '../../../serviceActions/StockServiceActions';
import { inventoryViewTableColumns } from '../../../templates/InventoryTemplates';
import '../Agn.css';
import InventoryViewFilters from './InventoryViewFilters';


function InventoryViewListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [state = InventoryView_STATE, dispatch] = useReducer(InventoryViewReducer, InventoryView_STATE);
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(forecastFilters);

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
            appDispatch(getInventoryViewList(queryParams)).then((response: any) => {
                dispatch(setResponse(response));
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.currentPage, state.refreshList, state.pageSize, history.location.search]);

    return (
        <div>
            <InventoryViewFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    // dispatch(setFilter(filterChips, filterParams));
                    dispatch(refreshList());
                    addFiltersQueryParams(filterChips, filterParams)
                    dispatch(toggleFilter());
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />

            <BulkUploadDialog
                title="Inventory View Upload CSV"
                open={state.openModal}
                jobName={RegisterJobs.STOCK_INVENTORY}
                onClose={() => {
                    dispatch(toggleModal());
                }}
            />
            <div className="filter-wrap">
                <Filter
                    pageTitle={"Inventory View"}
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter())
                    }}
                >

                    <FileAction
                        disable={state.loading}
                        options={[
                            {
                                menuTitle: "Upload In Hand Units",
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
                            // dispatch(removeFilter(element));
                            dispatch(refreshList());
                            removeFiltersQueryParams([element])
                        }}
                    />

                ))}
                {
                    isMobile ?
                        <CardList
                            listData={state.listData}
                            tableColumns={inventoryViewTableColumns(onClickViewButton)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={inventoryViewTableColumns(onClickViewButton)}

                            currentPage={state.currentPage}
                            rowsPerPage={state.pageSize}
                            rowsPerPageOptions={rowsPerPageOptions}
                            totalCount={state.pagination && state.pagination.count}
                            listData={state.listData}
                            // listData={[1, 2, 3, 4, 5, 6, 7, 8, 9,]}
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
        dispatch(setSelectedElement(element))
    }
}
export default InventoryViewListing;
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
import { salesOrderFilters } from '../../../moduleUtility/FilterUtils';
import { setSelectedElement } from '../../../redux/actions/AgnActions';
import { refreshList, setCurrentPage, setRowPerPage, showLoading, toggleBulkUpload, toggleModal } from '../../../redux/actions/SalesOrderAction';
import { toggleFilter } from '../../../redux/actions/UserActions';
import SalesOrderReducer, { SalesOrder_STATE } from '../../../redux/reducers/SalesOrderReducer';
import { salesOrderList } from '../../../serviceActions/StockServiceActions';
import { salesOrderTableColumns } from '../../../templates/InventoryTemplates';
import '../Agn.css';
import SalesOrderFilters from './SalesOrderFilter';
import SalesOrderModal from './SalesOrderModal';


function SalesOrderListing() {
    const appDispatch = useDispatch();
    const history = useHistory();
    const [state = SalesOrder_STATE, dispatch] = useReducer(SalesOrderReducer, SalesOrder_STATE);
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(salesOrderFilters);

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
            appDispatch(salesOrderList(dispatch, queryParams))
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.currentPage, state.refreshList, state.pageSize, history.location.search]);

    return (
        <div className="inventory-table-list">
            <SalesOrderModal
                open={state.openModal}
                selectedElement={state.selectedItem}
                onClose={() => {
                    dispatch(setSelectedElement(undefined));
                    dispatch(toggleModal());
                }} />

            <SalesOrderFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    // dispatch(setFilter(filterChips, filterParams));
                    addFiltersQueryParams(filterChips, filterParams)
                    dispatch(toggleFilter());
                    dispatch(refreshList());
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <BulkUploadDialog
                title="Sales Order Upload CSV"
                open={state.openBulkUpload}
                jobName={RegisterJobs.SALES_ORDER}
                onClose={() => {
                    dispatch(toggleBulkUpload());
                }}
            />
            <div className="filter-wrap">
                <Filter
                    pageTitle={"Sales Order"}
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter())
                    }}
                >
                    <FileAction
                        options={[
                            {
                                menuTitle: "Upload CSV File",
                                Icon: Publish,
                                onClick: () => dispatch(toggleBulkUpload())
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
                            if (element === "fromDateChip" || element === "toDateChip") {
                                let secondKey = element === "fromDateChip" ? "toDateChip" : "fromDateChip";
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
                            tableColumns={salesOrderTableColumns(onClickViewButton)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={salesOrderTableColumns(onClickViewButton)}
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
        dispatch(setSelectedElement(element))
        dispatch(toggleModal());
    }
}
export default SalesOrderListing;
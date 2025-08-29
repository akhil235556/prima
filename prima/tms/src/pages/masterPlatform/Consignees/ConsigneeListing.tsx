import { AddCircle, Autorenew, GetApp, Publish, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { consigneeCsvUrl } from '../../../base/api/ServiceUrl';
import { RegisterJobs, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { consigneeTitle, downloadCsvTitle } from '../../../base/constant/MessageUtils';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
import CardList from '../../../component/widgets/cardlist/CardList';
import TableList from '../../../component/widgets/tableView/TableList';
import BulkUploadDialog from '../../../modals/BulkUploadDialog/BulkUploadDialog';
import { consigneeFilters } from '../../../moduleUtility/FilterUtils';
import {
    refreshList,
    setCurrentPage, setRowPerPage, setSelectedItem,
    showLoading, toggleBulkUpdate, toggleBulkUpload, toggleCreateLocation,
    toggleFilter
} from '../../../redux/actions/ConsigneeAction';
import { setSelectedElement } from '../../../redux/actions/TrackingDashboardActions';
import ConsigneeReducer, { CONSIGNEE_STATE } from '../../../redux/reducers/ConsigneeReducer';
import { downloadCsv } from '../../../serviceActions/BulkDownloadCsvServiceActions';
import { getConsigneeList } from '../../../serviceActions/ConsigneeServiceActions';
import { consigneeTableColumns } from '../../../templates/MasterTemplates';
import ConsigneeFilters from './ConsigneeFilters';
import CreateConsigneeModals from './CreateConsigneeModals';



function ConsigneeListing() {
    const appDispatch = useDispatch();
    const history = useHistory();
    const [state = CONSIGNEE_STATE, dispatch] = useReducer(ConsigneeReducer, CONSIGNEE_STATE);
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(consigneeFilters);

    useEffect(() => {
        const getList = async () => {
            let queryParams: any = {
                page: state.currentPage,
                pageSize: state.pageSize
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params)
            }
            dispatch(showLoading());
            appDispatch(getConsigneeList(dispatch, queryParams));
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.searchQuery, state.pageSize, history.location.search]);

    function downloadCsvAction() {
        let queryParams: any = {};
        if (!isObjectEmpty(filterState.params)) {
            queryParams = Object.assign(queryParams, filterState.params)
        }
        appDispatch(downloadCsv(consigneeCsvUrl, queryParams))
    }

    return (
        <div>
            <ConsigneeFilters
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

            <CreateConsigneeModals
                open={state.openCreateLocation}
                selectedElement={state.selectedItem}
                onSuccess={() => {
                    dispatch(setSelectedElement(undefined));
                    dispatch(toggleCreateLocation());
                    dispatch(refreshList());
                }}
                onClose={() => {
                    dispatch(setSelectedElement(undefined));
                    dispatch(toggleCreateLocation());
                }}
            />

            <BulkUploadDialog
                title=" Bulk Upload Consignees"
                open={state.openBulkUpload}
                jobName={RegisterJobs.CUSTOMER}
                onClose={() => {
                    dispatch(toggleBulkUpload());
                }}
            />
            <BulkUploadDialog
                title=" Bulk Update"
                open={state.openBulkUpdate}
                jobName={RegisterJobs.CUSTOMER_UPDATE}
                onClose={() => {
                    dispatch(toggleBulkUpdate());
                }}
            />
            <div className="filter-wrap">
                <Filter
                    pageTitle={consigneeTitle}
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Create Consignee"}
                        loading={state.loading}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
                        onClick={() => {
                            dispatch(toggleCreateLocation());
                        }}
                    />
                    <FileAction
                        options={[
                            {
                                menuTitle: downloadCsvTitle,
                                Icon: GetApp,
                                onClick: downloadCsvAction
                            },
                            {
                                menuTitle: "Upload CSV File",
                                Icon: Publish,
                                onClick: () => dispatch(toggleBulkUpload())
                            },
                            {
                                menuTitle: "Bulk Update",
                                Icon: Autorenew,
                                onClick: () => dispatch(toggleBulkUpdate())
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
                            removeFiltersQueryParams([element]);
                        }}
                    />
                ))}
                {isMobile ?
                    <CardList
                        listData={state.listData}
                        tableColumns={consigneeTableColumns(onClickViewButton)}
                        isNextPage={state.pagination && state.pagination.next}
                        onReachEnd={() => {
                            dispatch(setCurrentPage(state.pagination.next))
                        }}
                    /> :
                    <TableList
                        tableColumns={consigneeTableColumns(onClickViewButton)}
                        currentPage={state.currentPage}
                        rowsPerPage={state.pageSize}
                        rowsPerPageOptions={rowsPerPageOptions}
                        totalCount={state.pagination && state.pagination.count}
                        listData={state.listData}
                        // listData={[1,2,3,4,5,6]}
                        onChangePage={(event: any, page: number) => {
                            dispatch(setCurrentPage(page));
                        }}
                        onChangeRowsPerPage={(event: any) => {
                            dispatch(setRowPerPage(event.target.value))
                        }}
                    />

                }
            </PageContainer>
        </div>
    );


    function onClickViewButton(element: any) {
        dispatch(setSelectedItem(element));
        dispatch(toggleCreateLocation());
    }
}
export default ConsigneeListing;
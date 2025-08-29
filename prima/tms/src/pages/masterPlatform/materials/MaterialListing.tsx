import { AddCircle, GetApp, Publish, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { materialCsvUrl } from "../../../base/api/ServiceUrl";
import { RegisterJobs, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { downloadCsvTitle, materialTitle } from '../../../base/constant/MessageUtils';
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
import { materialFilters } from '../../../moduleUtility/FilterUtils';
import {
    refreshList,
    setCurrentPage, setRowPerPage, setSelectedItem,
    showLoading, toggleBulkUpload, toggleCreateLocation,
    toggleFilter
} from '../../../redux/actions/MaterialAction';
import { setSelectedElement } from '../../../redux/actions/TrackingDashboardActions';
import MaterialReducer, { MATERIAL_STATE } from '../../../redux/reducers/MaterialReducer';
import { downloadCsv } from "../../../serviceActions/BulkDownloadCsvServiceActions";
import { getMaterialList } from '../../../serviceActions/MaterialServiceActions';
import { materialTableColumns } from '../../../templates/MasterTemplates';
import CreateMaterialModal from './CreateMaterialModal';
import MaterialFilters from "./MaterialFilters";

function MaterialListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(materialFilters);
    const [state = MATERIAL_STATE, dispatch] = useReducer(MaterialReducer, MATERIAL_STATE);

    useEffect(() => {
        const getList = async () => {
            let queryParams: any = {
                page: state.currentPage,
                size: state.pageSize
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params)
            }
            dispatch(showLoading());
            appDispatch(getMaterialList(dispatch, queryParams));
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.searchQuery, state.pageSize, history.location.search]);

    function downloadCsvAction() {
        let queryParams: any = {};
        if (!isObjectEmpty(filterState.params)) {
            queryParams = Object.assign(queryParams, filterState.params)
        }
        appDispatch(downloadCsv(materialCsvUrl, queryParams))
    }

    return (
        <div>
            <MaterialFilters
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

            <CreateMaterialModal
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
                }} />
            <BulkUploadDialog
                title=" Bulk Upload Materials"
                open={state.openBulkUpload}
                jobName={RegisterJobs.ARTICLES}
                onClose={() => {
                    dispatch(toggleBulkUpload());
                }}
            />
            <div className="filter-wrap">
                <Filter
                    pageTitle={materialTitle}
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Create Material"}
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
                        ]}
                    />
                </Filter>
            </div>
            <PageContainer
                loading={state.loading}
                listData={state.listData}
            >
                {!isObjectEmpty(filterState.chips) && Object.keys(filterState.chips).map((element: any, index: any) => (
                    <Chips
                        key={index}
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
                        tableColumns={materialTableColumns(onClickViewButton)}
                        isNextPage={state.pagination && state.pagination.next}
                        onReachEnd={() => {
                            dispatch(setCurrentPage(state.pagination.next))
                        }}
                    /> :
                    <TableList
                        tableColumns={materialTableColumns(onClickViewButton)}
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
        </div>
    );


    function onClickViewButton(element: any) {
        dispatch(setSelectedItem(element));
        dispatch(toggleCreateLocation());
    }
}
export default MaterialListing;
import { AddCircle, GetApp, Publish, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { vehicleTypeCsvUrl } from "../../../base/api/ServiceUrl";
import { RegisterJobs, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { downloadCsvTitle, vehicleTypeTitle } from '../../../base/constant/MessageUtils';
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
import { vehicleTypeFilters } from '../../../moduleUtility/FilterUtils';
import { refreshList, setCurrentPage, setRowPerPage, setSelectedElement, showLoading, toggleBulkUpload, toggleFilter, toggleModal } from '../../../redux/actions/VehicleTypeActions';
import VehicleTypeReducer, { VEHICLE_TYPE_STATE } from '../../../redux/reducers/VehicleTypeReducer';
import { downloadCsv } from "../../../serviceActions/BulkDownloadCsvServiceActions";
import { getVehicleTypeList } from '../../../serviceActions/VehicleTypeServiceActions';
import { vehicleTypeTableColumns } from '../../../templates/MasterTemplates';
import CreateVehicleTypeModal from './CreateVehicleTypeModal';
import VehicleTypeFilters from "./VehicleTypeFilters";

function VehicleTypeListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(vehicleTypeFilters);
    const [state = VEHICLE_TYPE_STATE, dispatch] = useReducer(VehicleTypeReducer, VEHICLE_TYPE_STATE);

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
            appDispatch(getVehicleTypeList(dispatch, queryParams))
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refresh_list, state.currentPage, state.pageSize, history.location.search]);

    function downloadCsvAction() {
        let queryParams: any = {};
        if (!isObjectEmpty(filterState.params)) {
            queryParams = Object.assign(queryParams, filterState.params)
        }
        appDispatch(downloadCsv(vehicleTypeCsvUrl, queryParams))
    }

    return (
        <div>
            <VehicleTypeFilters
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
            <CreateVehicleTypeModal
                open={state.openModal}
                selectedElement={state.selectedItem}
                onSuccess={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(refreshList());
                    dispatch(toggleModal());
                }}
                onClose={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(toggleModal());
                }} />
            <BulkUploadDialog
                title=" Bulk Upload Vehicle  Type"
                open={state.openBulkUpload}
                jobName={RegisterJobs.VEHICLE_TYPE}
                onClose={() => {
                    dispatch(toggleBulkUpload());
                }}
            />

            <div className="filter-wrap">

                <Filter
                    pageTitle={vehicleTypeTitle}
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Create Type"}
                        loading={state.loading}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
                        onClick={() => {
                            dispatch(toggleModal());
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
                        tableColumns={vehicleTypeTableColumns(onClickViewButton)}
                        isNextPage={state.pagination && state.pagination.next}
                        onReachEnd={() => {
                            dispatch(setCurrentPage(state.pagination.next))
                        }}
                    /> :
                    <TableList
                        tableColumns={vehicleTypeTableColumns(onClickViewButton)}
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
    )

    function onClickViewButton(element: any) {
        dispatch(setSelectedElement(element));
        dispatch(toggleModal());
    }
}
export default VehicleTypeListing;
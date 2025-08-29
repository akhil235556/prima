import { AddCircle, GetApp, Publish, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { vehicleCsvUrl } from "../../../base/api/ServiceUrl";
import { RegisterJobs, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { downloadCsvTitle, vehicleTitle } from '../../../base/constant/MessageUtils';
import { CreateVehicleUrl, UpdateVehicleUrl } from '../../../base/constant/RoutePath';
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
import WarningModal from '../../../modals/warningModal/WarningModal';
import { vehicleListFilters } from '../../../moduleUtility/FilterUtils';
import { showAlert } from '../../../redux/actions/AppActions';
import {
    hideLoading,
    refreshList,
    setCurrentPage, setRowPerPage, setSelectedElement, showLoading, toggleBulkUpload, toggleFilter
} from '../../../redux/actions/VehicleAction';
import VehicleReducer, { VEHICLE_STATE } from '../../../redux/reducers/VehicleReducer';
import { downloadCsv } from "../../../serviceActions/BulkDownloadCsvServiceActions";
import { getVehicleList, reportVehicleToHUB } from '../../../serviceActions/VehicleServiceActions';
import { vehicleTableColumns } from '../../../templates/MasterTemplates';
import VehicleFilters from './VehicleFilters';

function VehicleListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(vehicleListFilters);
    const [state = VEHICLE_STATE, dispatch] = useReducer(VehicleReducer, VEHICLE_STATE);
    const [showWarning, setShowWarning] = React.useState<boolean>(false);

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
            appDispatch(getVehicleList(dispatch, queryParams))
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refresh_list, state.currentPage, state.pageSize, history.location.search]);

    function downloadCsvAction() {
        let queryParams: any = {};
        if (!isObjectEmpty(filterState.params)) {
            queryParams = Object.assign(queryParams, filterState.params)
        }
        appDispatch(downloadCsv(vehicleCsvUrl, queryParams))
    }


    return (
        <div>
            <VehicleFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    dispatch(refreshList());
                    dispatch(toggleFilter());
                    addFiltersQueryParams(filterChips, filterParams)
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <WarningModal
                open={showWarning}
                onClose={() => {
                    setShowWarning(false);
                }}
                warningMessage={"Are you sure want to report vehicle?"}
                primaryButtonTitle={"Confirm"}
                secondaryuttonTitle={"Cancel"}
                onSuccess={() => {
                    dispatch(showLoading());
                    setShowWarning(false);
                    appDispatch(reportVehicleToHUB({ vehicleCode: state.selectedItem && state.selectedItem.vehicleCode })).then((response: any) => {
                        response && response.message && appDispatch(showAlert(response.message));
                        dispatch(hideLoading());
                        response && dispatch(refreshList());
                    });
                }}
            />

            <BulkUploadDialog
                title=" Bulk Upload Vehicles"
                open={state.openBulkUpload}
                jobName={RegisterJobs.VEHICLES}
                onClose={() => {
                    dispatch(toggleBulkUpload());
                }}
            />

            <div className="filter-wrap">
                <Filter
                    pageTitle={vehicleTitle}
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Create Vehicle"}
                        loading={isMobile ? false : state.loading}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
                        onClick={() => {
                            history.push(CreateVehicleUrl)
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
                {
                    isMobile ?
                        <CardList
                            listData={state.listData}
                            tableColumns={vehicleTableColumns(onClickViewButton, onClickReport)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={vehicleTableColumns(onClickViewButton, onClickReport)}
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
        history.push(
            {
                pathname: UpdateVehicleUrl,
                state: { selectedElement: element }
            })
    }
    function onClickReport(element: any) {
        dispatch(setSelectedElement(element));
        setShowWarning(true);
    }
}
export default VehicleListing;
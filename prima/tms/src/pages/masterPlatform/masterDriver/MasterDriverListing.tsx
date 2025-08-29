import { AddCircle, GetApp, Publish, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RegisterJobs, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { downloadCsvTitle } from '../../../base/constant/MessageUtils';
import { CreateDriverUrl, UpdateDriverUrl } from '../../../base/constant/RoutePath';
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
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { MasterDriverFilters } from '../../../moduleUtility/FilterUtils';
import { showAlert } from '../../../redux/actions/AppActions';
import { masterDriverColumn } from './base/MasterDriverTemplate';
import CreateDriverModal from './CreateDriverModal';
import { getCsvLink, getDriversList, getDriversTemplate, updateDriverStatus } from './masterDriverApi/MasterDriverServiceActions';
import MasterDriverFilter from './MasterDriverFilter';
import "./MasterDriverListing.css";
import { refreshList, setCurrentPage, setRowPerPage, setSelectedElement, showLoading, toggleBulkUpload, toggleFilter, toggleModal } from './masterDriverRedux/MasterDriverAction';
import MasterDriverReducer, { MASTER_DRIVER_STATE } from './masterDriverRedux/MasterDriverReducer';

function MasterDriverListing() {
    const history = useHistory();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(MasterDriverFilters);
    const appDispatch = useDispatch();
    const [state = MASTER_DRIVER_STATE, dispatch] = useReducer(MasterDriverReducer, MASTER_DRIVER_STATE);
    const [driverTemplate, setDriverTemplate] = React.useState<any>([]);
    const [deleteWarning, setDeleteWarning] = React.useState<any>(false)
    const [cancelLoading, setCancelLoading] = React.useState<any>(false)

    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let queryParams: any = {
                page: state.currentPage,
                pageSize: state.pageSize,
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params)
            }
            appDispatch(getDriversList(dispatch, queryParams))
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);

    useEffect(() => {
        appDispatch(getDriversTemplate()).then((response: any) => {
            if (response) {
                setDriverTemplate(setAutoCompleteListWithData(response, "idDisplayName", "idName"));
            }
        })
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <MasterDriverFilter
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    dispatch(toggleFilter());
                    addFiltersQueryParams(filterChips, filterParams)
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <CreateDriverModal
                open={state.openModal}
                selectedElement={(state.selectedElement && state.selectedElement) || {
                    certificateList: [{
                        index: 0
                    }]
                }}
                certificateOptions={driverTemplate}
                onSuccess={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(toggleModal());
                    dispatch(refreshList());
                }}
                onClose={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(toggleModal());
                }}
            />

            <BulkUploadDialog
                title=" Bulk Upload Drivers"
                open={state.openBulkUpload}
                jobName={RegisterJobs.DRIVERS}
                onClose={() => {
                    dispatch(toggleBulkUpload());
                }}
            />

            <WarningModal
                successLoader={cancelLoading}
                open={deleteWarning}
                onClose={() => {
                    setDeleteWarning(false);
                }}
                warningMessage={state?.selectedElement?.isActive ? "Are you sure want to disable driver?" : "Are you sure want to enable driver?"}
                primaryButtonTitle={"Confirm"}
                secondaryuttonTitle={"Cancel"}
                onSuccess={() => {
                    setDeleteWarning(false);
                    setCancelLoading(true)
                    appDispatch(updateDriverStatus({ driverId: state.selectedElement.id, isActive: !state.selectedElement.isActive })).then((response: any) => {
                        if (response) {
                            response.message && appDispatch(showAlert(response.message));
                            dispatch(refreshList())
                        }
                        dispatch(setSelectedElement(undefined))
                        setCancelLoading(false)
                    });
                }}
            />

            <div className="filter-wrap">
                <Filter
                    pageTitle="Drivers Listing"
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Add Driver"}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Add Driver" /> : <AddCircle />}
                        onClick={() => {
                            history.push(CreateDriverUrl)
                        }}
                    />

                    <FileAction
                        options={[
                            {
                                menuTitle: "Upload CSV File",
                                Icon: Publish,
                                onClick: () => dispatch(toggleBulkUpload())
                            },
                            {
                                menuTitle: downloadCsvTitle,
                                Icon: GetApp,
                                onClick: () => {
                                    let queryParams: any = {}
                                    queryParams = Object.assign(queryParams);
                                    if (!isObjectEmpty(filterState.params)) {
                                        queryParams = Object.assign(queryParams, filterState.params)
                                    }
                                    appDispatch(getCsvLink(queryParams)).then((response: any) => {
                                        if (response && response.link) {
                                            window.open(response.link);
                                        }
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
                            if (element === "driverCreatedAtFromTime" || element === "driverCreatedAtToTime") {
                                let secondKey = element === "driverCreatedAtFromTime" ? "driverCreatedAtToTime" : "driverCreatedAtFromTime";
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
                            tableColumns={masterDriverColumn(onClickViewButton, onClickDisable)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={masterDriverColumn(onClickViewButton, onClickDisable)}
                            currentPage={state.currentPage}
                            rowsPerPage={state.pageSize}
                            rowsPerPageOptions={rowsPerPageOptions}
                            totalCount={state.pagination && state.pagination.count}
                            listData={state.listData}
                            onChangePage={(event: any, page: number) => {
                                dispatch(setCurrentPage(page))
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
                pathname: UpdateDriverUrl,
                state: { selectedElement: element }
            })
    }

    function onClickDisable(element: any) {
        dispatch(setSelectedElement(element))
        setDeleteWarning(true);
    }

}
export default MasterDriverListing;
import { AddCircle, GetApp, Publish, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { serviceabilityCsvUrl } from '../../../base/api/ServiceUrl';
import { RegisterJobs, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { downloadCsvTitle, downloadExcelFile, uploadExcelFile } from '../../../base/constant/MessageUtils';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
import ExpendableCardList from '../../../component/widgets/cardlist/ExpendableCardList';
import TableCollapseList from '../../../component/widgets/tableView/tableCollapseList/TableCollapseList';
import BulkUploadDialog from '../../../modals/BulkUploadDialog/BulkUploadDialog';
import { serviceabilityFilters } from '../../../moduleUtility/FilterUtils';
import { refreshList, setCurrentPage, setRowPerPage, setSelectedElement, showLoading, toggleBulkUpload, toggleFilter, toggleLaneModal, toggleModal } from '../../../redux/actions/ServiceabilityActions';
import ServiceabilityReducer, { SERVICEABILITY_STATE } from '../../../redux/reducers/ServiceabilityReducer';
import { downloadCsv } from '../../../serviceActions/BulkDownloadCsvServiceActions';
import { getServiceabilityGroupedList } from '../../../serviceActions/ServiceabilityServiceActions';
import { serviceabilityChildrenTableColumns, serviceabilityMobileTableColumns, serviceabilityTableColumns } from '../../../templates/MasterTemplates';
import LanePointsDisplayModal from '../lane/LanePointsDisplayModal';
import EnableServiceability from './EnableServiceabilityModal';
import ServiceabilityFilters from './ServiceabilityFilters';



function ServiceabilityListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(serviceabilityFilters);
    const [state = SERVICEABILITY_STATE, dispatch] = useReducer(ServiceabilityReducer, SERVICEABILITY_STATE);
    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let queryParams: any = {
                page: state.currentPage,
                pageSize: state.pageSize
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params)
            }
            appDispatch(getServiceabilityGroupedList(dispatch, queryParams))
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);

    function downloadCsvAction() {
        let queryParams: any = {};
        if (!isObjectEmpty(filterState.params)) {
            queryParams = Object.assign(queryParams, filterState.params)
        }
        appDispatch(downloadCsv(serviceabilityCsvUrl, queryParams))
    }

    return (
        <div>

            <ServiceabilityFilters
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

            <LanePointsDisplayModal
                open={state.openPointsModal}
                laneCode={state.selectedElement && state.selectedElement.code}
                onClose={() => {
                    dispatch(setSelectedElement(undefined));
                    dispatch(toggleLaneModal());
                }}
            />

            <BulkUploadDialog
                title="Bulk Upload Serviceability"
                open={state.openBulkUpload}
                jobName={RegisterJobs.SERVICEABILITY}
                acceptFiles={".xls,.xlsx"}
                downloadMessage={downloadExcelFile}
                modalMessage={uploadExcelFile}
                onClose={() => {
                    dispatch(toggleBulkUpload());
                }}
            />

            <EnableServiceability
                open={state.openModal}
                selectedElement={state.selectedElement}
                onSuccess={() => {
                    dispatch(setSelectedElement(undefined));
                    dispatch(toggleModal());
                    dispatch(refreshList());
                }}
                onClose={() => {
                    dispatch(setSelectedElement(undefined));
                    dispatch(toggleModal());
                }}
            />
            <div className="filter-wrap">
                <Filter
                    pageTitle="Serviceability"
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Create Serviceability"}
                        loading={state.loading}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Create Serviceability" /> : <AddCircle />}
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
                {!isObjectEmpty(filterState.chips) && Object.keys(filterState.chips).map((element, index) => (
                    <Chips
                        label={filterState.chips[element]}
                        key={element + index}
                        onDelete={() => {
                            dispatch(refreshList());
                            removeFiltersQueryParams([element, ...getDependantFilters(element)]);
                        }}
                    />
                ))}
                {
                    isMobile ?
                        <ExpendableCardList
                            listData={state.listData}
                            tableColumns={serviceabilityMobileTableColumns(onClickLaneCode)}
                            childTableColumns={serviceabilityChildrenTableColumns(onClickViewButton)}
                            childElementKey='serviceabilityDetails'
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableCollapseList
                            tableColumns={serviceabilityTableColumns(onClickLaneCode)}
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
                            childElementKey='serviceabilityDetails'
                            childrenColumns={serviceabilityChildrenTableColumns(onClickViewButton)}
                        />
                }

            </PageContainer>
        </div>
    )

    function onClickLaneCode(element: any) {
        dispatch(setSelectedElement(element));
        dispatch(toggleLaneModal());
    }

    function onClickViewButton(element: any) {
        dispatch(setSelectedElement(element));
        dispatch(toggleModal());
    }

    function getDependantFilters(filter: string): string[] {
        const dependantsMap: { [key: string]: string } = {
            serviceabilityTypeName: "originZoneName,destinationZoneName"
        }
        return dependantsMap[filter]?.split(',') || []
    }
}
export default ServiceabilityListing;
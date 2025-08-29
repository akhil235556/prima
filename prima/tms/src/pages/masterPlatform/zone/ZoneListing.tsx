import { Publish, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RegisterJobs, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { bulkUpdateTitle, bulkUploadTitle, downloadExcelFile, updateZoneTitle, uploadExcelFile, uploadZoneTitle, zoneTitle } from '../../../base/constant/MessageUtils';
import { ZoneUrlView } from '../../../base/constant/RoutePath';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import ExpendableCardList from '../../../component/widgets/cardlist/ExpendableCardList';
import TableCollapseList from '../../../component/widgets/tableView/tableCollapseList/TableCollapseList';
import BulkUploadDialog from '../../../modals/BulkUploadDialog/BulkUploadDialog';
import { zoneFilters } from '../../../moduleUtility/FilterUtils';
import { refreshList, setCurrentPage, setRowPerPage, showLoading, toggleBulkUpload, toggleFilter } from '../../../redux/actions/ZoneActions';
import ZoneReducer, { ZONE_STATE } from '../../../redux/reducers/ZoneReducer';
import { zoneListing } from '../../../serviceActions/ZoneServiceActions';
import { zoneTableChildColumns, zoneTableColumns } from '../../../templates/MasterTemplates';
import ZoneFilters from './ZoneFilters';

function ZoneListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(zoneFilters);
    const [state = ZONE_STATE, dispatch] = useReducer(ZoneReducer, ZONE_STATE);
    const [uploadState, setUploadState] = useState({ title: "", jobName: "" });

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
            appDispatch(zoneListing(dispatch, queryParams));
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refresh_list, state.currentPage, state.pageSize, history.location.search]);

    // function downloadCsvAction() {
    //     let queryParams: any = {};
    //     if (!isObjectEmpty(filterState.params)) {
    //         queryParams = Object.assign(queryParams, filterState.params)
    //     }
    //     appDispatch(downloadCsv(vehicleTypeCsvUrl, queryParams))
    // }

    return (
        <div>
            <ZoneFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    // dispatch(setFilter(filterChips, filterParams));
                    dispatch(refreshList());
                    dispatch(toggleFilter());
                    addFiltersQueryParams(filterChips, filterParams)

                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <BulkUploadDialog
                title={uploadState?.title}
                open={state.openBulkUpload}
                jobName={uploadState?.jobName}
                acceptFiles={".xls,.xlsx"}
                modalMessage={uploadExcelFile}
                downloadMessage={downloadExcelFile}
                onClose={() => {
                    dispatch(toggleBulkUpload());
                }}
            />

            <div className="filter-wrap">

                <Filter
                    pageTitle={zoneTitle}
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <FileAction
                        options={[
                            // {
                            //     menuTitle: downloadCsvTitle,
                            //     Icon: GetApp,
                            //     onClick: downloadCsvAction
                            // },
                            {
                                menuTitle: bulkUploadTitle,
                                Icon: Publish,
                                onClick: () => {
                                    setUploadState({ ...uploadState, jobName: RegisterJobs.ZONE, title: uploadZoneTitle });
                                    dispatch(toggleBulkUpload());
                                }
                            },
                            {
                                menuTitle: bulkUpdateTitle,
                                Icon: Publish,
                                onClick: () => {
                                    setUploadState({ ...uploadState, jobName: RegisterJobs.ZONE_UPDATE, title: updateZoneTitle });
                                    dispatch(toggleBulkUpload());
                                }
                            }
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
                        onDelete={() => {
                            dispatch(refreshList());
                            removeFiltersQueryParams([element]);
                        }}
                        key={index}
                    />
                ))}
                {isMobile ?
                    <ExpendableCardList
                        listData={state.listData}
                        tableColumns={zoneTableColumns(onClickViewButton)}
                        isNextPage={state.pagination && state.pagination.next}
                        onReachEnd={() => {
                            dispatch(setCurrentPage(state.pagination.next))
                        }}
                        childTableColumns={zoneTableChildColumns()}
                        childElementKey='zoneLocation'
                    />
                    :
                    <TableCollapseList
                        tableColumns={zoneTableColumns(onClickViewButton)}
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
                        childElementKey='zoneLocation'
                        childrenColumns={zoneTableChildColumns()}
                    />
                }
            </PageContainer>
        </div>
    )

    function onClickViewButton(element: any) {
        // dispatch(setSelectedElement(element));
        history.push({
            pathname: ZoneUrlView + element?.zoneCode,
        });
    }
}
export default ZoneListing;
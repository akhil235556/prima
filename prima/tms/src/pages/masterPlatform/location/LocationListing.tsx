import { AddCircle, GetApp, Publish, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { locationCsvUrl } from '../../../base/api/ServiceUrl';
import { RegisterJobs, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { downloadCsvTitle } from '../../../base/constant/MessageUtils';
import { CreateLocationUrl } from '../../../base/constant/RoutePath';
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
import { locationFilters } from '../../../moduleUtility/FilterUtils';
import { refreshList, setCurrentPage, setRowPerPage, showLoading, toggleBulkUpload, toggleFilter } from '../../../redux/actions/LocationActions';
import LocationReducer, { LOCATION_STATE } from '../../../redux/reducers/LocationReducer';
import { downloadCsv } from '../../../serviceActions/BulkDownloadCsvServiceActions';
import { getLocationList } from '../../../serviceActions/LocationServiceActions';
import { locationTableColumns } from '../../../templates/MasterTemplates';
import LocationFilters from "./LocationFilters";

function LocationListing() {

    const appDispatch = useDispatch();
    const history = useHistory();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(locationFilters);
    const [state = LOCATION_STATE, dispatch] = useReducer(LocationReducer, LOCATION_STATE);
    const [jobName, setJobName] = useState<any>("")
    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let queryParams: any = {
                pageNo: state.currentPage,
                pageSize: state.pageSize
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params)
            }
            appDispatch(getLocationList(dispatch, queryParams))
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.currentPage, state.refreshList, state.pageSize, history.location.search]);

    function downloadCsvAction() {
        let queryParams: any = {};
        if (!isObjectEmpty(filterState.params)) {
            queryParams = Object.assign(queryParams, filterState.params)
        }
        appDispatch(downloadCsv(locationCsvUrl, queryParams))
    }

    return (
        <div>
            <LocationFilters
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

            <BulkUploadDialog
                title={jobName === RegisterJobs.LOCATIONS ? "Bulk Upload Locations" : "Bulk Upload Tagged Locations"}
                open={state.openBulkUpload}
                jobName={jobName}
                onClose={() => {
                    setJobName("");
                    dispatch(toggleBulkUpload());
                }}
            />

            <div className="filter-wrap">
                <Filter
                    pageTitle={"Location"}
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Create Location"}
                        loading={state.loading}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
                        onClick={() => {
                            history.push({
                                pathname: CreateLocationUrl,
                            })
                        }}
                    />
                    <FileAction
                        options={[
                            {
                                menuTitle: downloadCsvTitle,
                                Icon: GetApp,
                                onClick: downloadCsvAction
                            }, {
                                menuTitle: "Upload Locations",
                                Icon: Publish,
                                onClick: () => {
                                    setJobName(RegisterJobs.LOCATIONS);
                                    dispatch(toggleBulkUpload())
                                }
                            }, {
                                menuTitle: "Upload Tagged Locations",
                                Icon: Publish,
                                onClick: () => {
                                    setJobName(RegisterJobs.TAGGED_LOCATIONS)
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
                        <CardList
                            listData={state.listData}
                            tableColumns={locationTableColumns(onClickViewButton)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :

                        <TableList
                            tableColumns={locationTableColumns(onClickViewButton)}
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
    );
    function onClickViewButton(element: any) {
        history.push({
            pathname: CreateLocationUrl,
            search: "?locationCode=" + element.locationCode
        })
    }
}
export default LocationListing;
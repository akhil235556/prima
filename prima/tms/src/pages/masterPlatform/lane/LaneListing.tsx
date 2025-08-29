import { AddCircle, GetApp, Publish, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { laneCsvUrl } from "../../../base/api/ServiceUrl";
import { RegisterJobs, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { downloadCsvTitle } from '../../../base/constant/MessageUtils';
import { CreateLaneUrl } from '../../../base/constant/RoutePath';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
import CardList from '../../../component/widgets/cardlist/CardList';
import TableList from '../../../component/widgets/tableView/TableList';
import BulkUploadDialog from '../../../modals/BulkUploadDialog/BulkUploadDialog';
import { laneFilters } from "../../../moduleUtility/FilterUtils";
import { clearData, setCurrentPage, setRowPerPage, setSelectedElement, showLoading, toggleBulkUploadWithLane, toggleFilter, togglePointsModal } from '../../../redux/actions/LaneActions';
import LaneReducer, { LANE_STATE } from '../../../redux/reducers/LaneReducer';
import { downloadCsv } from "../../../serviceActions/BulkDownloadCsvServiceActions";
import { getLaneList } from '../../../serviceActions/LaneServiceActions';
import { laneTableColumns } from '../../../templates/MasterTemplates';
import "./LaneListing.css";
import LanePointsDisplayModal from './LanePointsDisplayModal';

interface LaneListingProps {
    filterLaneState: any,
    filterDispatch: any
    filterChipUI: any,
    location?: any,
    setFilter?: any
}

function LaneListing(props: LaneListingProps) {
    const { filterLaneState, filterDispatch, filterChipUI } = props;
    const history = useHistory();
    const [filterState] = useSearchParams(laneFilters);
    const appDispatch = useDispatch();
    const [state = LANE_STATE, dispatch] = useReducer(LaneReducer, LANE_STATE);

    useEffect(() => {
        if (filterLaneState.filterChips || filterLaneState.filterParams) {
            dispatch(clearData());
        }
    }, [filterLaneState.filterChips, history.location.search, filterLaneState.filterParams, appDispatch])

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
            appDispatch(getLaneList(dispatch, queryParams));
        }
        getList();
        // eslint-disable-next-line
    }, [state.currentPage, state.pageSize, history.location.search, appDispatch]);

    function downloadCsvAction() {
        let queryParams: any = {};
        if (!isObjectEmpty(filterState.params)) {
            queryParams = Object.assign(queryParams, filterState.params)
        }
        appDispatch(downloadCsv(laneCsvUrl, queryParams))
    }

    return (
        <div className="lane-listing-wrapper">
            <LanePointsDisplayModal
                open={state.openPointModal}
                laneCode={state.selectedItem && state.selectedItem.laneCode}
                onClose={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(togglePointsModal());
                }} />

            <BulkUploadDialog
                title="Lane Bulk Upload"
                open={state.openBulkUploadWithLane}
                jobName={RegisterJobs.LANES}
                onClose={() => {
                    dispatch(toggleBulkUploadWithLane());
                }}
            />

            <div className="filter-wrap">
                <Filter
                    pageTitle="Lane"
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        filterDispatch(toggleFilter());
                    }}
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Create Lane"}
                        loading={state.loading}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable Transporter" /> : <AddCircle />}
                        onClick={() => {
                            history.push({
                                pathname: CreateLaneUrl,
                            })
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
                                menuTitle: "Bulk Upload with Lane",
                                Icon: Publish,
                                onClick: () => dispatch(toggleBulkUploadWithLane())
                            },
                        ]}
                    />

                </Filter>
            </div>
            <PageContainer
                loading={state.loading}
                listData={state.listData}
            >
                {filterChipUI()}
                {isMobile ?
                    <CardList
                        listData={state.listData}
                        tableColumns={laneTableColumns(onClickViewButton, onClickLaneCode)}
                        isNextPage={state.pagination && state.pagination.next}
                        onReachEnd={() => {
                            dispatch(setCurrentPage(state.pagination.next))
                        }}
                    /> :
                    <TableList
                        tableColumns={laneTableColumns(onClickViewButton, onClickLaneCode)}
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
        </div >
    )

    function onClickLaneCode(element: any) {
        dispatch(setSelectedElement(element));
        dispatch(togglePointsModal());
    }

    function onClickViewButton(element: any) {
        dispatch(setSelectedElement(element));
        history.push({
            pathname: CreateLaneUrl,
            search: "?laneCode=" + element.laneCode
        })
    }
}
export default LaneListing;
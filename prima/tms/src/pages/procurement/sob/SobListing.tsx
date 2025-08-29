import { AddCircle, Publish, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RegisterJobs, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { bulkUploadTitle } from '../../../base/constant/MessageUtils';
import { SobCreateUrl, SobEditUrl } from '../../../base/constant/RoutePath';
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
import { sobFilters } from '../../../moduleUtility/FilterUtils';
import { refreshList, setCurrentPage, setRowPerPage, setSelectedElement, showLoading, toggleFilter, togglePointsModal } from '../../../redux/actions/SobActions';
import SobReducer, { SOB_STATE } from '../../../redux/reducers/SobReducer';
import { getSobListing } from '../../../serviceActions/SobServiceActions';
import { sobTableColumn } from '../../../templates/ProcurementTemplates';
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';
import SobFilter from './SobFilters';






function SobListing() {
    const history = useHistory();

    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(sobFilters);
    const [bulkUploadDialog, setBulkUploadDialog] = React.useState<boolean>(false)

    const appDispatch = useDispatch();
    const [state = SOB_STATE, dispatch] = useReducer(SobReducer, SOB_STATE);
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
            appDispatch(getSobListing(dispatch, queryParams));
        }
        getList();
        // eslint-disable-next-line
    }, [state.currentPage, state.pageSize, history.location.search, appDispatch, state.refreshList]);

    return (
        <div>
            <SobFilter
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
                title={bulkUploadTitle}
                open={bulkUploadDialog}
                jobName={RegisterJobs.SOB}
                onClose={() => {
                    setBulkUploadDialog(false);
                }}
            />
            <LanePointsDisplayModal
                open={state.openPointModal}
                laneCode={state.selectedItem && state.selectedItem.laneCode}
                onClose={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(togglePointsModal());
                }} />
            <div className="filter-wrap">
                <Filter
                    pageTitle="SOB"
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "SOB Creation"}
                        //loading={state.loading}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
                        onClick={() => {
                            history.push({
                                pathname: SobCreateUrl,
                            })
                        }}
                    />
                    <FileAction
                            options={[
                                {
                                    menuTitle: bulkUploadTitle,
                                    Icon: Publish,
                                    onClick: () => setBulkUploadDialog(true)
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
                            removeFiltersQueryParams([element])
                        }}
                    />
                ))}
                {

                    isMobile ?
                        <CardList
                            listData={state.listData}
                            tableColumns={sobTableColumn(onClickViewButton, onClickLaneCode)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={sobTableColumn(onClickViewButton, onClickLaneCode)}
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
        history.push({
            pathname: SobEditUrl,
            search: "?sobCode=" + element.sobCode
        })

    }
    function onClickLaneCode(element: any) {
        dispatch(setSelectedElement(element));
        dispatch(togglePointsModal());
    }
}

export default SobListing;

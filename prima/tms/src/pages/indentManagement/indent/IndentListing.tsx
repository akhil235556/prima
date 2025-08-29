import { AddCircle, Publish, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RegisterJobs, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { IndentCreateUrl, IndentDetailUrl } from '../../../base/constant/RoutePath';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import FileAction from '../../../component/fileAction/FileAction';
// import "./ContractListing.css"
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
import CardList from '../../../component/widgets/cardlist/CardList';
import TableList from '../../../component/widgets/tableView/TableList';
import BulkUploadDialog from '../../../modals/BulkUploadDialog/BulkUploadDialog';
import { indentListingFilters } from '../../../moduleUtility/FilterUtils';
import {
    refreshList,
    setCurrentPage,
    setRowPerPage, setSelectedElement,
    showLoading, toggleBulkUpload, toggleFilter, togglePointsModal
} from '../../../redux/actions/IndentAction';
import IndentReducer, { INDENT_STATE } from '../../../redux/reducers/IndentReducer';
import { getIndentList } from '../../../serviceActions/IndentServiceAction';
import { indentTableColumns } from '../../../templates/IndentTemplates';
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';
import IndentFilters from './IndentFilters';


function IndentListing() {
    const history = useHistory();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(indentListingFilters);
    const [jobName, setJobName] = useState<any>();

    const appDispatch = useDispatch();
    const [state = INDENT_STATE, dispatch] = useReducer(IndentReducer, INDENT_STATE);

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
            appDispatch(getIndentList(dispatch, queryParams))
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);

    return (
        <div className="indent-listing-wrapper">
            <IndentFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    //dispatch(setFilter(filterChips, filterParams));
                    dispatch(refreshList())
                    dispatch(toggleFilter());
                    addFiltersQueryParams(filterChips, filterParams)
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />

            <BulkUploadDialog
                title="Bulk Upload Indents"
                open={state.openBulkUpload}
                jobName={jobName}
                onClose={() => {
                    dispatch(toggleBulkUpload());
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
                    pageTitle="Indent Listing"
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Create Indent"}
                        loading={state.loading}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
                        onClick={() => {
                            history.push({
                                pathname: IndentCreateUrl,
                            })
                        }}
                    />
                    <FileAction
                        options={[
                            {
                                menuTitle: "Indent Bulk Upload",
                                Icon: Publish,
                                onClick: () => {
                                    dispatch(toggleBulkUpload())
                                    setJobName(RegisterJobs.INDENT)
                                }
                            },
                            {
                                menuTitle: "Indent Material Upload",
                                Icon: Publish,
                                onClick: () => {
                                    dispatch(toggleBulkUpload())
                                    setJobName(RegisterJobs.SHIPMENTINDENT)
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
                            if (element === "placementFromTimeDate" || element === "placementToTimeDate") {
                                let secondKey = element === "placementFromTimeDate" ? "placementToTimeDate" : "placementFromTimeDate";
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
                            tableColumns={indentTableColumns(onClickViewButton, onClickLaneCode)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={indentTableColumns(onClickViewButton, onClickLaneCode)}
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
        history.push({
            pathname: IndentDetailUrl,
            search: "?indentCode=" + element.code
        })
    }

}
export default IndentListing;
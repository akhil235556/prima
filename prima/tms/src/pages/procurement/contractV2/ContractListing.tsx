import { AddCircle, Autorenew, CheckCircle, GetApp, Publish, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { contractCsvUrl } from '../../../base/api/ServiceUrl';
import { RegisterJobs, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { bulkApproveTitle, bulkUpdateTitle, bulkUploadTitle, downloadExcelTitle } from '../../../base/constant/MessageUtils';
import { ContractCreateUrl, PendingContractUrl, ViewContractFreightCharges } from '../../../base/constant/RoutePath';
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
import { contractFilters } from '../../../moduleUtility/FilterUtils';
import {
    refreshList, setCurrentPage,
    setRowPerPage, setSelectedElement,
    showLoading, toggleBulkUpdate, toggleBulkUpload, toggleFilter, togglePointsModal
} from '../../../redux/actions/ContractActions';
import ContractReducer, { CONTRACT_STATE } from '../../../redux/reducers/ContractReducer';
import { downloadCsv } from '../../../serviceActions/BulkDownloadCsvServiceActions';
import { getContractList } from '../../../serviceActions/ContractServiceActions';
import { contractTableColumn } from '../../../templates/ProcurementTemplates';
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';
import ContractFilter from './ContractFilters';
import "./ContractListing.css";

function ContractListing() {
    const history = useHistory();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(contractFilters);

    const appDispatch = useDispatch();
    const [state = CONTRACT_STATE, dispatch] = useReducer(ContractReducer, CONTRACT_STATE);


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
            appDispatch(getContractList(dispatch, queryParams))
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);

    function downloadCsvAction() {
        let queryParams: any = {};
        if (!isObjectEmpty(filterState.params)) {
            queryParams = Object.assign(queryParams, filterState.params)
        }
        appDispatch(downloadCsv(contractCsvUrl, queryParams))
    }

    return (
        <div>
            <ContractFilter
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
                title="Bulk Upload"
                open={state.openBulkUpload}
                acceptFiles={".xls,.xlsx"}
                modalMessage={"Upload XLSX"}
                downloadMessage={"Download XLSX sample"}
                jobName={RegisterJobs.CONTRACT}
                onClose={() => {
                    dispatch(toggleBulkUpload());
                }}

            />

            <BulkUploadDialog
                title=" Bulk Update"
                open={state.openBulkUpdate}
                acceptFiles={".xls,.xlsx"}
                modalMessage={"Upload XLSX"}
                downloadMessage={"Download XLSX sample"}
                jobName={RegisterJobs.CONTRACT_UPDATE}
                onClose={() => {
                    dispatch(toggleBulkUpdate());
                }}

            />


            <LanePointsDisplayModal
                open={state.openPointModal}
                laneCode={state.selectedItem && state.selectedItem.lane && state.selectedItem.lane.code}
                onClose={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(togglePointsModal());
                }} />
            <div className="filter-wrap">
                <Filter
                    pageTitle="Contract"
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter());
                    }}
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Contract Creation"}
                        loading={state.loading}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
                        onClick={() => {
                            history.push({
                                pathname: ContractCreateUrl,
                            })
                        }}
                    />
                    <FileAction
                        options={[
                            {
                                menuTitle: bulkApproveTitle,
                                Icon: CheckCircle,
                                onClick: () => {
                                    history.push({
                                        pathname: PendingContractUrl,
                                    })
                                }
                            },
                            {
                                menuTitle: bulkUploadTitle,
                                Icon: Publish,
                                onClick: () => dispatch(toggleBulkUpload())
                            },
                            {
                                menuTitle: bulkUpdateTitle,
                                Icon: Autorenew,
                                onClick: () => dispatch(toggleBulkUpdate())
                            },
                            {
                                menuTitle: downloadExcelTitle,
                                Icon: GetApp,
                                onClick: downloadCsvAction
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
                            tableColumns={contractTableColumn(onClickViewButton, onClickLaneCode)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={contractTableColumn(onClickViewButton, onClickLaneCode)}
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
        const selectedElement = element;
        history.push({
            pathname: ViewContractFreightCharges + selectedElement.contractCode,
            state: {
                selectedElement: selectedElement
            }
        })
    }

}
export default ContractListing;
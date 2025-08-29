import { KeyboardBackspace, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { ContractUrl } from '../../../base/constant/RoutePath';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
import TableList from '../../../component/widgets/tableView/TableList';
import { pendingContractFilters } from "../../../moduleUtility/FilterUtils";
import { showAlert } from '../../../redux/actions/AppActions';
import { refreshList, setResponse, setSelectedElement, toggleFilter, toggleModal } from '../../../redux/actions/PendingContractActions';
import PendingContractReducer, { PENDING_CONTRACT_STATE } from '../../../redux/reducers/PendingContractReducer';
import { bulkApproveContract, getUnPaginatedContractList } from "../../../serviceActions/ContractServiceActions";
import { pendingContractModalTable } from "../../../templates/ProcurementTemplates";
import ContractDetailModal from "../../indentManagement/indent/ContractDetailModal";
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';
import "./PendingContractListing.css";
import PendingContractsFilter from "./PendingContractsFilter";

function PendingContractListing() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(pendingContractFilters);

    const [state = PENDING_CONTRACT_STATE, dispatch] = useReducer(PendingContractReducer, PENDING_CONTRACT_STATE);
    const [loading, setLoading] = React.useState<any>(false)
    const [allValue, setAllValue] = React.useState<any>(false)
    const [approveLoading, setApproveLoading] = React.useState<any>(false);
    const [openContractDetailModal, setOpenContractDetailModal] = React.useState<boolean>(false);

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            setAllValue(false);
            let queryParams: any = {
                contractStatus: "PENDING"
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params)
            }
            appDispatch(getUnPaginatedContractList(queryParams)).then((response: any) => {
                if (response) {
                    dispatch(setResponse(response));
                }
                setLoading(false);
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refresh_list, history.location.search]);

    return (
        <div className="pending-contract-wrap">
            <PendingContractsFilter
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    //dispatch(setFilter(filterChips, filterParams));
                    dispatch(refreshList());
                    addFiltersQueryParams(filterChips, filterParams)
                    dispatch(toggleFilter());
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />

            <LanePointsDisplayModal
                open={state.openModal}
                laneCode={state.selectedItem && state.selectedItem.lane && state.selectedItem.lane.code}
                onClose={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(toggleModal());
                }} />

            {openContractDetailModal &&
            <ContractDetailModal
                open={openContractDetailModal}
                isContractPermissionRequired={true}
                selectedElement={{
                    contractCode: state.selectedItem && state.selectedItem.contractCode,
                    partnerCode: state.selectedItem && state.selectedItem.partner && state.selectedItem.partner.code,
                }}
                showAllCharges={true}
                laneCode={(state.selectedItem && state.selectedItem.lane && state.selectedItem.lane.code !== "NA") ? state.selectedItem.lane.code : undefined}
                freightType={state.selectedItem && state.selectedItem.contractType}
                onSuccess={() => {
                    setOpenContractDetailModal(false)
                }}
                onClose={() => {
                    setOpenContractDetailModal(false)
                }}
            />}

            <div className="filter-wrap">
                <Filter
                    pageTitle={"Bulk Approve"}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack()
                    }}
                >
                    <Button
                        buttonStyle="btn-orange"
                        title={isMobile ? " " : "Filter"}
                        leftIcon={<Tune />}
                        onClick={() => {
                            dispatch(toggleFilter());
                        }}

                    />
                </Filter>
            </div>
            <PageContainer
                loading={loading}
                listData={state.listData}
            >
                {!isObjectEmpty(filterState.chips) && Object.keys(filterState.chips).map((element) => (
                    <Chips
                        label={filterState.chips[element]}
                        onDelete={() => {
                            dispatch(refreshList());
                            removeFiltersQueryParams([element])
                            //dispatch(removeFilter(element));
                        }}
                    />
                ))}
                {
                    <TableList
                        tableColumns={pendingContractModalTable(handleChecks, handleAllChecks, allValue, onClickViewButton, onClickLaneCode)}
                        currentPage={0}
                        rowsPerPage={25}
                        rowsPerPageOptions={rowsPerPageOptions}
                        listData={state.listData}
                        onChangePage={(event: any, page: number) => {
                        }}
                        onChangeRowsPerPage={(event: any) => {

                        }}
                    />
                }
                {state.listData && state.listData.length > 0 &&
                    < div className="mt-3 text-right">
                        <Button
                            title={"Approve"}
                            count={countSelectedContracts()}
                            loading={approveLoading}
                            buttonStyle="count-num btn-blue"
                            onClick={() => {
                                if (countSelectedContracts() === 0) {
                                    appDispatch(showAlert("Please select atleast one contract to activate", false));
                                    return;
                                }
                                setApproveLoading(true);
                                let contractList: any = [];
                                state.listData && state.listData.forEach((item: any) => {
                                    if (item.isCheckboxChecked) {
                                        contractList.push(item.contractCode)
                                    }
                                })
                                appDispatch(bulkApproveContract({ contractCode: contractList })).then((response: any) => {
                                    if (response) {
                                        response.message && appDispatch(showAlert(response.message));
                                        history.push(ContractUrl)
                                    }
                                    setApproveLoading(false);
                                })
                            }}
                        />
                    </div>}
            </PageContainer>
        </div >
    )

    function handleChecks(contractCode: any, checked: any) {
        let checkArray: any = [];
        let checkedCounts: any = 0;
        checkArray = state.listData && state.listData.map((item: any) => {
            let itemList: any = item;
            if (item.isCheckboxChecked) {
                checkedCounts++;
            }
            if (item.contractCode === contractCode) {
                itemList.isCheckboxChecked = checked;
                if (checked) {
                    checkedCounts++;
                }
            }
            return itemList;
        })
        if (checked) {
            if (checkedCounts === (state.listData && state.listData.length)) {
                setAllValue(true);
            }
        } else {
            setAllValue(false);
        }
        dispatch(setResponse(checkArray));
    }

    function handleAllChecks(checked: any) {
        let checkArray: any = [];
        checkArray = state.listData && state.listData.map((item: any) => {
            return {
                ...item,
                isCheckboxChecked: checked
            };
        })
        dispatch(setResponse(checkArray));
        setAllValue(checked)
    }

    function onClickLaneCode(element: any) {
        dispatch(setSelectedElement(element));
        dispatch(toggleModal());
    }

    function onClickViewButton(element: any) {
        dispatch(setSelectedElement(element));
        setOpenContractDetailModal(true);
    }

    function countSelectedContracts() {
        let count = 0;
        state.listData && state.listData.forEach((item: any) => {
            if (item.isCheckboxChecked) {
                count++;
            }
        })
        return count;
    }
}

export default PendingContractListing;
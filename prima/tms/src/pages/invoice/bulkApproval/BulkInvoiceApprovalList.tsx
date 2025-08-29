import { KeyboardBackspace, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { InvoiceStatusEnum } from '../../../base/constant/ArrayList';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
import TableList from '../../../component/widgets/tableView/TableList';
import { invoiceFilters } from "../../../moduleUtility/FilterUtils";
import { showAlert } from '../../../redux/actions/AppActions';
import { refreshList, setCheckedListResponse, setCurrentPage, setResponse, setSelectedElement, toggleFilter, toggleModal } from '../../../redux/actions/InvoiceBulkApprovalActions';
import InvoiceBulkApprovalReducer, { INVOICE_APPROVAL_STATE } from '../../../redux/reducers/InvoiceBulkApprovalReducer';
import { getUnapproveInvoiceList } from '../../../serviceActions/BillGenerateServiceActions';
import { invoiceBulkApprovalTableColumns } from '../../../templates/InvoiceTemplates';
import LanePointsDisplayModal from '../../masterPlatform/lane/LanePointsDisplayModal';
import InvoiceFilters from '../billGenerate/FreightBillingInvoiceFilters';
import BulkApproveInvoiceModal from "./BulkApproveInvoiceModal";
import "./BulkInvoiceApprovalList.css";

function BulkInvoiceApprovalList() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(invoiceFilters);

    const [state = INVOICE_APPROVAL_STATE, dispatch] = useReducer(InvoiceBulkApprovalReducer, INVOICE_APPROVAL_STATE);
    const [loading, setLoading] = React.useState<any>(false)
    const [allValue, setAllValue] = React.useState<any>(false)
    const [openModal, setOpenModal] = React.useState<any>(false);

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            setAllValue(false);
            let queryParams: any = {
                pageNo: state.currentPage,
                pageSize: state.pageSize,
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params);
            }
            appDispatch(getUnapproveInvoiceList(queryParams)).then((response: any) => {
                if (response) {
                    dispatch(setResponse(response));
                }
                setLoading(false);
            });
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refresh_list, state.currentPage, state.pageSize, history.location.search]);

    return (
        <div className="pending-contract-wrap">
            <InvoiceFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                approvedBy={InvoiceStatusEnum["AWAITING APPROVAL"]}
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

            <BulkApproveInvoiceModal
                open={openModal}
                selectedElement={state.listData}
                onSuccess={() => {
                    setOpenModal(false);
                    dispatch(refreshList());
                    // history.goBack();
                }}
                onClose={() => {
                    setOpenModal(false);
                }}
            />

            <LanePointsDisplayModal
                open={state.openModal}
                laneCode={state.selectedItem && state.selectedItem.lane && state.selectedItem.lane.code}
                onClose={() => {
                    dispatch(setSelectedElement(null));
                    dispatch(toggleModal());
                }} />

            <div className="filter-wrap">
                <Filter
                    pageTitle={"Bulk Approve"}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack()
                    }}
                >{state.listData && state.listData.length > 0 &&
                    <Button
                        title={"Approve"}
                        count={countSelectedInvoices()}
                        buttonStyle="count-num btn-blue"
                        onClick={() => {
                            if (countSelectedInvoices() === 0) {
                                appDispatch(showAlert("Please select atleast one Invoice to approve", false));
                                return;
                            }
                            setOpenModal(true);
                        }}
                    />
                    }
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
                        }}
                    />
                ))}
                <TableList
                    tableColumns={invoiceBulkApprovalTableColumns(handleChecks, handleAllChecks, allValue, onClickLaneCode)}
                    currentPage={state.currentPage}
                    rowsPerPage={state.pageSize}
                    totalCount={state.pagination && state.pagination.count}
                    rowsPerPageOptions={[25]}
                    listData={state.listData}
                    onChangePage={(event: any, page: number) => {
                        dispatch(setCurrentPage(page));
                    }}
                    onChangeRowsPerPage={(event: any) => {
                        // dispatch(setRowPerPage(event.target.value))
                    }}
                />
            </PageContainer>
        </div >
    )

    function handleChecks(billNo: any, checked: any) {
        let checkArray: any = [];
        let checkedCounts: any = 0;
        checkArray = state.listData && state.listData.map((item: any) => {
            let itemList: any = item;
            if (item.isCheckboxChecked) {
                checkedCounts++;
            }
            if (item.billNo === billNo) {
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
        dispatch(setCheckedListResponse(checkArray));
    }

    function handleAllChecks(checked: any) {
        let checkArray: any = [];
        checkArray = state.listData && state.listData.map((item: any) => {
            return {
                ...item,
                isCheckboxChecked: checked
            };
        })
        dispatch(setCheckedListResponse(checkArray));
        setAllValue(checked)
    }

    function onClickLaneCode(element: any) {
        dispatch(setSelectedElement(element));
        dispatch(toggleModal());
    }

    function countSelectedInvoices() {
        let count = 0;
        state.listData && state.listData.forEach((item: any) => {
            if (item.isCheckboxChecked) {
                count++;
            }
        })
        return count;
    }
}

export default BulkInvoiceApprovalList;
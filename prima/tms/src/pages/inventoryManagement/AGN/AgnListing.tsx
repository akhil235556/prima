import { AddCircle, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AgnStatus, rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { AgnCreateUrl, AgnReceiveUrl } from '../../../base/constant/RoutePath';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from '../../../component/widgets/button/Button';
import CardList from '../../../component/widgets/cardlist/CardList';
import TableList from '../../../component/widgets/tableView/TableList';
import { agnFilters } from '../../../moduleUtility/FilterUtils';
import { refreshList, setCurrentPage, setResponse, setRowPerPage, setSelectedElement, showLoading, toggleCancelModal, toggleFilter } from '../../../redux/actions/AgnActions';
import AgnReducer, { AGN_STATE } from '../../../redux/reducers/AgnReducer';
import { getAgnList } from '../../../serviceActions/AgnServiceActions';
import { agnTableColumns } from '../../../templates/InventoryTemplates';
import AgnFilters from './AgnFilter';
import CancelAgnModal from './CancelAgnModal';

function AgnListing() {
    const history = useHistory();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(agnFilters);

    const appDispatch = useDispatch();
    const [state = AGN_STATE, dispatch] = useReducer(AgnReducer, AGN_STATE);

    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let queryParams: any = {
                page: state.currentPage,
                pageSize: state.pageSize,
                statusCode: AgnStatus.PENDING
            }
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params)
            }
            appDispatch(getAgnList(queryParams)).then((response: any) => {
                dispatch(setResponse(response));
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.currentPage, state.refreshList, state.pageSize, history.location.search]);

    return (
        <div>
            <AgnFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    //dispatch(setFilter(filterChips, filterParams));
                    dispatch(toggleFilter());
                    addFiltersQueryParams(filterChips, filterParams)
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <div className="filter-wrap">
                <Filter
                    pageTitle={"AGN (Advance Goods Notice)"}
                    buttonStyle="btn-orange"
                    buttonTitle={isMobile ? " " : "Filter"}
                    leftIcon={<Tune />}
                    onClick={() => {
                        dispatch(toggleFilter())
                    }}
                >
                    <Button
                        buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                        title={isMobile ? "" : "Create AGN"}
                        // loading={state.loading}
                        leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
                        onClick={() => {
                            history.push({
                                pathname: AgnCreateUrl,
                            })
                        }}
                    />
                </Filter>
            </div>
            <CancelAgnModal
                open={state.openCancelModal}
                selectedElement={state.selectedItem}
                onSuccess={() => {
                    dispatch(setSelectedElement(undefined));
                    dispatch(toggleCancelModal());
                }}
                refresh={() => {
                    dispatch(refreshList());
                }}
                onClose={() => {
                    dispatch(setSelectedElement(undefined));
                    dispatch(toggleCancelModal());
                }}
            />

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
                            tableColumns={agnTableColumns(onClickViewButton, onClickViewReceive, onClickViewCancel)}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={agnTableColumns(onClickViewButton, onClickViewReceive, onClickViewCancel)}

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
    )
    function onClickViewReceive(element: any) {
        history.push(AgnReceiveUrl + element.agnCode);
    }
    function onClickViewCancel(element: any) {
        dispatch(setSelectedElement(element));
        dispatch(toggleCancelModal());
    }
    function onClickViewButton(element: any) {
        const selectedElement = element;
        history.push({
            pathname: AgnCreateUrl + selectedElement.id,
        })
    }
}
export default AgnListing;
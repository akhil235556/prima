import { KeyboardBackspace } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { rowsPerPageOptions } from '../../base/constant/ArrayList';
import { isObjectEmpty } from '../../base/utility/StringUtils';
import { isMobile } from '../../base/utility/ViewUtils';
import Chips from '../../component/chips/Chips';
import Filter from '../../component/filter/Filter';
import PageContainer from '../../component/pageContainer/PageContainer';
import Button from '../../component/widgets/button/Button';
import CardList from '../../component/widgets/cardlist/CardList';
import TableList from '../../component/widgets/tableView/TableList';
import { hideLoading, removeFilter, setCurrentPage, setResponse, setRowPerPage, showLoading } from '../../redux/actions/ShipmentLogDetailActions';
import ShipmentLogDetailReducer, { SHIPMENT_LOG_DETAIL_STATE } from '../../redux/reducers/ShipmentLogDetailReducer';
import { shipmentLogDetails } from '../../serviceActions/ShipmentServiceActions';
import { shipmentLogDetailTableColumns } from '../../templates/ShipmentLogTemplates';


function ShipmentLogDetail() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [state = SHIPMENT_LOG_DETAIL_STATE, dispatch] = useReducer(ShipmentLogDetailReducer, SHIPMENT_LOG_DETAIL_STATE);
    const { id } = useParams<any>();

    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let queryParams: any = {
                page: state.currentPage,
                size: state.pageSize,
                shipmentCode: id
            }
            if (!isObjectEmpty(state.filterParams)) {
                queryParams = Object.assign(queryParams, state.filterParams);
            }
            appDispatch(shipmentLogDetails(queryParams)).then((response: any) => {
                dispatch(setResponse(response));
                dispatch(hideLoading());
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.currentPage, state.refreshList, state.pageSize, state.filterChips]);

    return (
        <div>
            <div className="filter-wrap">
                <Filter
                    pageTitle={"Shipment Tracking Logs"}
                >
                    <Button
                        buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                        title={isMobile ? " " : "Back"}
                        leftIcon={<KeyboardBackspace />}
                        onClick={() => {
                            history.goBack();
                        }}
                    />
                </Filter>
            </div>
            <PageContainer
                loading={state.loading}
                listData={state.listData}
            >
                {!isObjectEmpty(state.filterChips) && Object.keys(state.filterChips).map((element) => (
                    <Chips
                        label={state.filterChips[element]}
                        onDelete={() => {
                            dispatch(removeFilter(element));
                        }}
                    />
                ))}
                {
                    isMobile ?
                        <CardList
                            listData={state.listData}
                            tableColumns={shipmentLogDetailTableColumns()}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={shipmentLogDetailTableColumns()}
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
}
export default ShipmentLogDetail;
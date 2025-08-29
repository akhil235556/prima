import React, { useReducer, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import SimTrackingDetailsReducer, { SIM_TRACKING_DETAILS_STATE } from '../../redux/reducers/SimTrackingDetailsReducer';
import { isObjectEmpty } from '../../base/utility/StringUtils';
import Filter from '../../component/filter/Filter';
import { KeyboardBackspace } from '@material-ui/icons';
import { useHistory, useParams } from 'react-router-dom';
import { isMobile } from '../../base/utility/ViewUtils';
import { showLoading, setCurrentPage, setRowPerPage, removeFilter, hideLoading, setResponse } from '../../redux/actions/SimTrackingActions';
import PageContainer from '../../component/pageContainer/PageContainer';
import TableList from '../../component/widgets/tableView/TableList';
import { rowsPerPageOptions } from '../../base/constant/ArrayList';
import { simTrackingDetailList } from '../../serviceActions/SimTrackingServiceActions';
import CardList from '../../component/widgets/cardlist/CardList';
import Chips from '../../component/chips/Chips';
import { simTrackingDetailTableColumns } from '../../templates/SimTrackingTemplates';
import Button from '../../component/widgets/button/Button';


function SimTrackingDetail() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [state = SIM_TRACKING_DETAILS_STATE, dispatch] = useReducer(SimTrackingDetailsReducer, SIM_TRACKING_DETAILS_STATE);
   const { id } = useParams();

    useEffect(() => {
        const getList = async () => {
            dispatch(showLoading());
            let queryParams: any = {
                page: state.currentPage,
                size: state.pageSize,
                tripCode: id
            }
            if (!isObjectEmpty(state.filterParams)) {
                queryParams = Object.assign(queryParams, state.filterParams);
            }
            appDispatch(simTrackingDetailList(queryParams)).then((response: any) => {
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
                    pageTitle={"Sim Tracking Logs"}
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
                            tableColumns={simTrackingDetailTableColumns()}
                            isNextPage={state.pagination && state.pagination.next}
                            onReachEnd={() => {
                                dispatch(setCurrentPage(state.pagination.next))
                            }}
                        />
                        :
                        <TableList
                            tableColumns={simTrackingDetailTableColumns()}
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
export default SimTrackingDetail;
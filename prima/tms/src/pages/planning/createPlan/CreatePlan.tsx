import { GetApp, KeyboardBackspace } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from "react-router-dom";
import {  planningStatus, rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { isMobile } from '../../../base/utility/ViewUtils';
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Stepper from '../../../component/stepper/Stepper';
import StepperPlanStatus from '../../../component/stepperPlanStatus/StepperPlanStatus';
import ExpendableCardList from '../../../component/widgets/cardlist/ExpendableCardList';
import TableCollapseDetail from '../../../component/widgets/tableView/tableCollapseList/TableCollapseDetail';
import TableCollapseList from '../../../component/widgets/tableView/tableCollapseList/TableCollapseList';
import { hideLoading, setCurrentPage, setResponse, setRowPerPage, showLoading } from '../../../redux/actions/CreatePlanActions';
import CreatePlanReducer, { CREATE_PLAN_STATE } from '../../../redux/reducers/CreatePlanReducer';
import { getPlanningRoutes, getPlanningTasks } from '../../../serviceActions/PlanningServiceAction';
import { planningCreatePlanChildrenColumns, planningCreatePlanColumns } from '../../../templates/PlanningTemplates';
import "./CreatePlan.css";
import CreatePlanMap from './CreatePlanMap';
import CreatePlanMapModal from './CreatePlanMapModal';

function PlanningCreatePlanListing() {

    const history = useHistory();
    const appDispatch = useDispatch();
    const { id } = useParams<any>();
    const dashboardData: any = history?.location?.state;
    const [state = CREATE_PLAN_STATE, dispatch] = useReducer(CreatePlanReducer, CREATE_PLAN_STATE);
    const [openCancelModal, setOpenCancelModal] = React.useState<boolean>(false);
    const [mapData, setMapData] = React.useState<any>();
    const [panelStatus, setPanelStatus] = React.useState<boolean>(false);
    useEffect(() => {
        dashboardData?.statusCode === planningStatus.SUCCESS.statusCode && appDispatch(getPlanningRoutes({ planning_request_id: id, page: state.currentPage, page_size: state.pageSize })).then((response: any) => {
            dispatch(showLoading());
            if (response) {
                dispatch(setResponse(response));
            }
            dispatch(hideLoading());
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, state.currentPage, state.pageSize]);

    return (
        <div>
            <div className="filter-wrap">
                <Filter
                    pageTitle="Create Plan"
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                >
                    {dashboardData?.statusCode === planningStatus.SUCCESS.statusCode && (
                        <FileAction
                        options={[
                            {
                                menuTitle: "Output",
                                Icon: GetApp,
                                onClick: () => {
                                    dashboardData?.output && window.open(dashboardData?.output)
                                }
                            },
                            {
                                menuTitle: "Output Indent",
                                Icon: GetApp,
                                onClick: () => {
                                    dashboardData?.link && window.open(dashboardData?.link)
                                }
                            },
                        ]}
                    />
                    )}
                </Filter>
            </div>
            <div className='create-plan'>
                {!isMobile &&
                    <Stepper />
                }
                <div className='createplan-process'>
                    <StepperPlanStatus data={dashboardData} />
                    <CreatePlanMapModal
                        open={panelStatus}
                        mapData={mapData}
                        onClose={() => {
                            setPanelStatus(false);
                        }}
                    />
                    {dashboardData?.errorMessage ?
                        <div className={dashboardData?.statusCode !== 901 ? "planning_history-error " : "planning_dashboard-error "}>
                            <p> {dashboardData?.errorMessage}</p>
                        </div> :
                        <PageContainer
                            loading={state.loading}
                            listData={state.listData}
                        >
                            <div className={openCancelModal ? `planning_history--wrapper` : ""}>
                                <div className={openCancelModal && !isMobile ? "planning_history--left-panel" : ""}>
                                    <div className='create-plan-Listing'>
                                        {
                                            isMobile ?
                                                <ExpendableCardList
                                                    listData={state.listData}
                                                    tableColumns={planningCreatePlanColumns(onClickViewButton)}
                                                    childTableColumns={planningCreatePlanChildrenColumns()}
                                                    childElementKey='tasks'
                                                    isNextPage={state.pagination && state.pagination.next}
                                                    onReachEnd={() => {
                                                        dispatch(setCurrentPage(state.pagination.next))
                                                    }}
                                                />
                                                :
                                                <TableCollapseList
                                                    tableColumns={planningCreatePlanColumns(onClickViewButton)}
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
                                                    childElementKey='tasks'
                                                    childrenColumns={planningCreatePlanChildrenColumns()}
                                                    collapseCustomView={true}
                                                    onClickIconButton={onClickIconButton}
                                                    onClickRow={onClickViewButton}
                                                >
                                                    {(data: any) => (
                                                        <TableCollapseDetail
                                                            tableColumns={planningCreatePlanChildrenColumns()}
                                                            data={data['tasks']}
                                                        />
                                                    )}
                                                </TableCollapseList>
                                        }
                                    </div>
                                </div>
                                {
                                    !isMobile && openCancelModal &&
                                    <div className={openCancelModal && !isMobile ? "planning_history--right-panel" : ""}>
                                        <CreatePlanMap onClose={() => setOpenCancelModal(false)} mapData={mapData} />
                                    </div>
                                }
                            </div>
                        </PageContainer>}
                </div>
            </div>
        </div>
    )

    function onClickViewButton(element: any) {
        setMapData(element?.details);
        if (isMobile) {
            setPanelStatus(true);
            return
        }
        setOpenCancelModal(true);
    }

    function onClickIconButton(element: any) {
        if (element.rowIndex > 0 && !state?.listData?.[element.rowIndex - 1]?.tasks) {
            appDispatch(getPlanningTasks({ planning_request_id: id, planning_route_id: element?.routeId })).then((response: any) => {
                if (response) {
                    let data = state.listData;
                    data[element.rowIndex - 1].tasks = response.results;
                    dispatch(setResponse({ results: data }));
                }
            })
        }
    }
}

export default PlanningCreatePlanListing;

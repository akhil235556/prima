import React, { useEffect, useReducer } from "react";
import Filter from "../../../component/filter/Filter";
import TableList from "../../../component/widgets/tableView/TableList";
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { planningDispatchTableColumns } from "../../../templates/PlanningTemplates";
import PageContainer from "../../../component/pageContainer/PageContainer";
import Chips from '../../../component/chips/Chips';
import { useDispatch } from 'react-redux';
import {
  setCurrentPage, removeFilter, setRowPerPage, showLoading, setSelectedElement, togglePointsModal, hideLoading, togglePlanningModal, refreshList
} from '../../../redux/actions/PlanningDispatchActions';
import PlanningDispatchReducer, { PLANNING_DISPATCH_STATE } from '../../../redux/reducers/PlanningDispatchReducer';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from "../../../base/utility/ViewUtils";
import CardList from "../../../component/widgets/cardlist/CardList";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import { getDispatchListing } from "../../../serviceActions/PlanningServiceAction";
import { createByDispatch } from "../../../serviceActions/OrderServiceActions";
import { showAlert } from "../../../redux/actions/AppActions";
import Button from "../../../component/widgets/button/Button";
import { AddCircle } from "@material-ui/icons";
import InitiatePlanningModal from "./InitiatePlanningModal";
import { useHistory } from 'react-router-dom';
import { PlanningHistoryUrl } from "../../../base/constant/RoutePath";

function PanningDispatchListing() {
  const appDispatch = useDispatch();
  const history = useHistory();
  const [state = PLANNING_DISPATCH_STATE, dispatch] = useReducer(PlanningDispatchReducer, PLANNING_DISPATCH_STATE);

  useEffect(() => {
    const getList = async () => {
      dispatch(showLoading());
      let queryParams: any = {
        status: "Created"
      };
      if (!isObjectEmpty(state.filterChips)) {
        queryParams = Object.assign(queryParams, state.filterChips);
      }
      queryParams.page = state.currentPage;
      queryParams.size = state.pageSize;
      appDispatch(getDispatchListing(dispatch, queryParams))
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage, state.pageSize, state.refreshList]);

  return (
    <div>
      <LanePointsDisplayModal
        open={state.openPointModal}
        laneCode={state.selectedItem && state.selectedItem.lane}
        onClose={() => {
          dispatch(setSelectedElement(undefined));
          dispatch(togglePointsModal());
        }} />

      <Filter
        pageTitle="Dispatch Plans"
      >
        <Button
          buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
          title={isMobile ? "" : "Initiate Planning"}
          loading={state.loading}
          leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
          onClick={() => {
            dispatch(togglePlanningModal());
          }}
        />
      </Filter>
      <InitiatePlanningModal
        open={state.openPlanningModal}
        onApply={() => {
          dispatch(togglePlanningModal());
          history.push(PlanningHistoryUrl)
        }}
        onClose={() => {
          dispatch(togglePlanningModal());
        }}
      />
      <PageContainer
        loading={state.loading}
        listData={state.listData}
      >
        {!isObjectEmpty(state.filterChips) && Object.keys(state.filterChips).map((element) => (
          state.filterChips[element] && <Chips
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
              tableColumns={planningDispatchTableColumns(raiseOrder, onClickLaneCode)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            />
            :
            <TableList
              tableColumns={planningDispatchTableColumns(raiseOrder, onClickLaneCode)}
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
  );



  function raiseOrder(params: any) {
    dispatch(showLoading());
    appDispatch(createByDispatch({ dispatchIds: [params.id] })).then((response: any) => {
      if (response) {
        response.message && appDispatch(showAlert(response.message));
        dispatch(refreshList());
      }
      dispatch(hideLoading());
    })

  }

  function onClickLaneCode(element: any) {
    dispatch(togglePointsModal());
    dispatch(setSelectedElement(element))
  }
}

export default PanningDispatchListing;

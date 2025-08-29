import { Tune } from "@material-ui/icons";
import React, { useEffect, useReducer } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Chips from "../../../component/chips/Chips";
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import CardList from "../../../component/widgets/cardlist/CardList";
import TableList from "../../../component/widgets/tableView/TableList";
import { getAnanlyticObject } from "../../../moduleUtility/DispatchUtility";
import { planningDispatchHistoryFilters } from "../../../moduleUtility/FilterUtils";
import { refreshList, setCurrentPage, setRowPerPage, setSelectedElement, showLoading, toggleFilter, togglePointsModal } from '../../../redux/actions/PlanningDispatchHistoryActions';
import PlanningDispatchHistoryReducer, { PLANNING_DISPATCH_HISTORY_STATE } from "../../../redux/reducers/PlanningDispatchHistoryReducer";
import { getDispatchListing } from "../../../serviceActions/PlanningServiceAction";
import { planningDispatchHistoryTableColumns } from "../../../templates/PlanningTemplates";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import PlanningDispatchHistoryFilters from "./PlanningDispatchHistoryFilters";
import "./PlanningDispatchHistoryListing.css";

function PlanningDispatchHistoryListing() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const [state = PLANNING_DISPATCH_HISTORY_STATE, dispatch] = useReducer(PlanningDispatchHistoryReducer, PLANNING_DISPATCH_HISTORY_STATE);
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(planningDispatchHistoryFilters);
  useEffect(() => {
    const getList = async () => {
      dispatch(showLoading());
      let queryParams: any = {
        status: "Planned"
      };
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      queryParams.page = state.currentPage;
      queryParams.size = state.pageSize;
      appDispatch(getDispatchListing(dispatch, queryParams))
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage, state.pageSize, state.refreshList, history.location.search]);

  return (
    <div className="plan-listing-wrapper">
      <Filter
        pageTitle="Dispatch History"
        buttonStyle="btn-orange"
        buttonTitle={isMobile ? " " : "Filter"}
        leftIcon={<Tune />}
        onClick={() => {
          dispatch(toggleFilter());
        }}
      />
      <PlanningDispatchHistoryFilters
        open={state.openFilter}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          //dispatch(setFilter(filterChips, filterParams));
          dispatch(refreshList())
          dispatch(toggleFilter());
          addFiltersQueryParams(filterChips, filterParams)
        }}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        onClose={() => {
          dispatch(toggleFilter());
        }}
      />

      <LanePointsDisplayModal
        open={state.openPointModal}
        laneCode={state.selectedItem && state.selectedItem.lane}
        onClose={() => {
          dispatch(setSelectedElement(undefined));
          dispatch(togglePointsModal());
        }} />

      <PageContainer
        loading={state.loading}
        listData={state.listData}
      >

        {!isObjectEmpty(getAnanlyticObject(filterState.chips)) && Object.keys(getAnanlyticObject(filterState.chips)).map((element) => (
          <Chips
            label={getAnanlyticObject(filterState.chips)[element]}
            onDelete={() => {
              dispatch(refreshList())
              removeFiltersQueryParams([element])
              // dispatch(removeFilter(element));
            }}
          />
        ))}
        {
          isMobile ?
            <CardList
              listData={state.listData}
              tableColumns={planningDispatchHistoryTableColumns(onClickViewButton)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            />
            :

            <TableList
              tableColumns={planningDispatchHistoryTableColumns(onClickViewButton)}
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

  function onClickViewButton(element: any) {
    dispatch(setSelectedElement(element));
    dispatch(togglePointsModal());
  }

}

export default PlanningDispatchHistoryListing;

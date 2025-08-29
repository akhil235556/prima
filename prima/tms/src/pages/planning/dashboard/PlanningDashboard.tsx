import { FilterList } from '@material-ui/icons';
import React, { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { advancedFilterTitle } from "../../../base/constant/MessageUtils";
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { convertToNumberFormat, numberFormatter } from "../../../base/utility/NumberUtils";
import { getSearchDateFilter } from '../../../base/utility/Routerutils';
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Chips from "../../../component/chips/Chips";
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import CardList from "../../../component/widgets/cardlist/CardList";
import ListingSkeleton from "../../../component/widgets/listingSkeleton/ListingSkeleton";
import TableList from "../../../component/widgets/tableView/TableList";
import { getAnanlyticObject } from '../../../moduleUtility/DispatchUtility';
import { planningDashboardFilters } from '../../../moduleUtility/FilterUtils';
import { hideLoading, refreshList, setCurrentPage, setResponse, setRowPerPage, showLoading, toggleFilter } from "../../../redux/actions/PlanningDashboardActions";
import PlanningDashboardReducer, { PLANNING_DASHBOARD_STATE } from "../../../redux/reducers/PlanningDashboardReducer";
import { getDashboardCountList, getDashboardOrderList } from "../../../serviceActions/OrderServiceActions";
import { dashboardTableColumns } from "../../../templates/PlanningTemplates";
import SearchFilterBar from '../../analytics/searchFilterBar/SearchFilterBar';
import TrackDashboardSkeleton from "../../tracking/dashboardTracking/trackDashboardSkeleton/TrackDashboardSkeleton";
import DispatchCard from './dispatchCard/DispatchCard';
import "./PlanningDashboard.css";
import PlanningDashboardFilters from "./PlanningDashboardFilters";

function PlanningDashboard() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(planningDashboardFilters);
  const [state = PLANNING_DASHBOARD_STATE, dispatch] = useReducer(PlanningDashboardReducer, PLANNING_DASHBOARD_STATE);
  const [count, setCount] = React.useState<any>({});

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {
        page: state.currentPage,
        pageSize: state.pageSize,
      }
      let listQueryParams: any = {};
      queryParams = Object.assign(queryParams);
      listQueryParams = Object.assign(filterState.params);
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }

      if (queryParams.fromDate && queryParams.toDate) {
        queryParams.fromDatetime = queryParams.fromDate;
        queryParams.toDatetime = queryParams.toDate;
        delete queryParams.fromDate;
        delete queryParams.toDate;
      }
      if (listQueryParams.fromDate && listQueryParams.toDate) {
        listQueryParams.fromDatetime = listQueryParams.fromDate;
        listQueryParams.toDatetime = listQueryParams.toDate;
        delete listQueryParams.fromDate;
        delete listQueryParams.toDate;
      }

      dispatch(showLoading());
      let promiseArray: any = [appDispatch(getDashboardOrderList(queryParams)), appDispatch(getDashboardCountList(listQueryParams))];
      Promise.all(promiseArray).then((response: any) => {
        response[0] && dispatch(setResponse(response[0]));
        response[1] && response[1].details && setCount(response[1].details);
        dispatch(hideLoading());
      })
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);

  return (
    <div className="dispatch-planning-wrapper">

      <PlanningDashboardFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          //dispatch(setFilter(filterChips, filterParams));
          dispatch(refreshList())
          dispatch(toggleFilter());
          let dateFilter = getSearchDateFilter(filterState.params);
          addFiltersQueryParams(filterChips, { ...filterParams, ...dateFilter })
        }}
        onClose={() => {
          dispatch(toggleFilter());
        }}
      />
      <Filter
        pageTitle="Dashboard"
      // buttonStyle="btn-orange"
      // buttonTitle={isMobile ? " " : "Filter"}
      // leftIcon={<Tune />}
      // onClick={() => {
      //   dispatch(toggleFilter());
      // }}
      >
        {!isMobile && <SearchFilterBar
          filterParams={filterState.params}
          fromDate={filterState.params && filterState.params.fromDatetime}
          toDate={filterState.params && filterState.params.toDatetime}
          onApply={(dates: any) => {
            //dispatch(setFilter({}, dates));
            dispatch(refreshList())
            addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
          }}
        />
        }
        <FileAction
          options={[
            {
              menuTitle: advancedFilterTitle,
              Icon: FilterList,
              onClick: () => dispatch(toggleFilter())
            }
          ]}
        />
      </Filter>
      <PageContainer
      >
        {isMobile && <SearchFilterBar
          filterParams={filterState.params}
          onApply={(dates: any) => {
            dispatch(refreshList());
            addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
            //dispatch(setFilter({}, dates));
          }}
        />
        }
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
        <div className="dispatch-card-wrap">
          {state.loading ? <TrackDashboardSkeleton /> :
            <div className="row">
              <div className="col-md-6 col-lg-4">
                <DispatchCard
                  CardStyle="card-space"
                  heading="DISPATCH VOLUME (m³)"
                  value={(count && count.dispatchVolume && convertToNumberFormat(count.dispatchVolume, numberFormatter)) || 0}
                  // percentValue="89.3%"
                  image="/images/in-stock.png"
                />
              </div>
              <div className="col-md-6 col-lg-4">
                <DispatchCard
                  CardStyle="orange-card card-space"
                  heading="DISPATCH PLANNED"
                  value={(count && count.dispatchPlanned && convertToNumberFormat(count.dispatchPlanned, numberFormatter)) || 0}
                  // percentValue="45.9%"
                  image="/images/sales-order.png"
                />
              </div>
              <div className="col-md-6 col-lg-4">
                <DispatchCard
                  CardStyle="card-space"
                  heading="DISPATCH ORDERS"
                  value={(count && count.dispatchOrders && convertToNumberFormat(count.dispatchOrders, numberFormatter)) || 0}
                  // value={(count && count.dispatchOrders) || 0}
                  // percentValue="75.6%"
                  image="/images/average-dispatch-order.png"
                />
              </div>
            </div>
          }
        </div>
        {state.loading ? <ListingSkeleton /> : (
          isMobile ?
            <CardList
              listData={state.listData}
              tableColumns={dashboardTableColumns()}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            />
            :

            <TableList
              tableColumns={dashboardTableColumns()}
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
        )}
      </PageContainer>
    </div>
  );
}

export default PlanningDashboard;

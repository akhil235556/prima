import { ArrowDownward, ArrowUpward, FilterList } from '@material-ui/icons';
import React, { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { advancedFilterTitle } from "../../../base/constant/MessageUtils";
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { convertToNumberFormat, numberFormatter, numberWithoutDecimalFormatter } from "../../../base/utility/NumberUtils";
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Chips from "../../../component/chips/Chips";
import FileAction from '../../../component/fileAction/FileAction';
import Filter from "../../../component/filter/Filter";
import { createChartData, getAnanlyticObject } from '../../../moduleUtility/DispatchUtility';
import { dispatchDashboardFilters } from '../../../moduleUtility/FilterUtils';
import { hideLoading, refreshList, setDashboardChartData, setDashboardCount, showLoading, toggleFilter } from '../../../redux/actions/DispatchDashboardActions';
import DispatchDashboardReducer, { DISPATCH_DASHBOARD_STATE } from "../../../redux/reducers/DispatchDashboardReducer";
import { dispatchChartData, dispatchDashboardCount } from "../../../serviceActions/MisServiceAction";
import DetentionSkeleton from "../../analytics/detentionReport/DetentionSkeleton";
import SearchFilterBar from '../../analytics/searchFilterBar/SearchFilterBar';
import GroupColumnChart from '../../charts/GroupColumnChart';
import TrackDashboardSkeleton from "../../tracking/dashboardTracking/trackDashboardSkeleton/TrackDashboardSkeleton";
import "./DispatchDashboard.css";
import DispatchDashboardFilters from "./DispatchDashboardFilters";
import ReportCard from "./reportsCard/ReportCards";

function DispatchDashboard() {
  const appDispatch = useDispatch();
  const history = useHistory();
  const [state = DISPATCH_DASHBOARD_STATE, dispatch] = useReducer(DispatchDashboardReducer, DISPATCH_DASHBOARD_STATE);
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(dispatchDashboardFilters);

  useEffect(() => {
    const getList = async () => {
      dispatch(showLoading());
      let queryParams: any = {}
      queryParams = Object.assign(queryParams);
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      Promise.all([appDispatch(dispatchDashboardCount(queryParams)), appDispatch(dispatchChartData(queryParams))])
        .then((response: any) => {
          response[0] && dispatch(setDashboardCount(response[0]));
          response[1] && dispatch(setDashboardChartData(response[1] && response[1]));
          dispatch(hideLoading());
        });
    };
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.search, state.refreshList]);

  return (
    <div className="dispatch-management-wrapper">
      <DispatchDashboardFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          // dispatch(setFilter(filterChips, filterParams));
          dispatch(refreshList());
          addFiltersQueryParams(filterChips, filterParams)
          dispatch(toggleFilter());
        }}
        onClose={() => {
          dispatch(toggleFilter());
        }}
      />
      <div className="filter-wrap">
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
            onApply={(dates: any) => {
              // dispatch(setFilter({}, dates));
              dispatch(refreshList());
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
              },
            ]}
          />
        </Filter>
      </div>

      <div className="report-card-wrapp">
        <div className="report-card-content">
          {isMobile && <SearchFilterBar
            filterParams={filterState.params}
            onApply={(dates: any) => {
              // dispatch(setFilter({}, dates));
              dispatch(refreshList())
              addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
            }}
          />
          }
          {!isObjectEmpty(getAnanlyticObject(filterState.chips)) && Object.keys(getAnanlyticObject(filterState.chips)).map((element) => (
            <Chips
              label={getAnanlyticObject(filterState.chips)[element]}
              onDelete={() => {
                // dispatch(removeFilter(element));
                dispatch(refreshList());
                removeFiltersQueryParams([element]);
              }}
            />
          ))}
          {state.loading ? <TrackDashboardSkeleton /> :
            <div className="row">
              <div className="col-md-6 col-lg-4">
                <ReportCard
                  CardStyle="avg-bg"
                  heading="Avg. Loading Time"
                  value={((state.dashboardCount.averageLoadingTime && (state.dashboardCount.averageLoadingTime.toFixed(0) + " " + state.dashboardCount.timeUnit)) || 0)}
                  icon={((state.dashboardCount.averageLoadingTimePercent && state.dashboardCount.averageLoadingTimePercent < 0) ? <ArrowDownward /> : <ArrowUpward />)}
                  percentValue={state.dashboardCount && state.dashboardCount.averageLoadingTimePercent}
                  image="/images/avg-loading.png"
                />
              </div>
              <div className="col-md-6 col-lg-4">
                <ReportCard
                  CardStyle="inbound-bg"
                  heading="Inbound"
                  value={(state.dashboardCount.inbound && convertToNumberFormat(state.dashboardCount.inbound, numberFormatter)) || 0}
                  icon={((state.dashboardCount.inboundPercent && state.dashboardCount.inboundPercent < 0) ? <ArrowDownward /> : <ArrowUpward />)}
                  percentValue={state.dashboardCount && state.dashboardCount.inboundPercent}
                  image="/images/inbound.png"
                />
              </div>
              <div className="col-md-6 col-lg-4">
                <ReportCard
                  CardStyle="dispatch-bg"
                  heading="Dispatched"
                  value={(state.dashboardCount.dispatched && convertToNumberFormat(state.dashboardCount.dispatched, numberFormatter)) || 0}
                  icon={((state.dashboardCount.dispatchedPercent && state.dashboardCount.dispatchedPercent < 0) ? <ArrowDownward /> : <ArrowUpward />)}
                  percentValue={state.dashboardCount && state.dashboardCount.dispatchedPercent}
                  image="/images/dispatch.png"
                />
              </div>
            </div>
          }
        </div>
      </div>

      {state.loading ?
        <div
          style={{
            width: "100%",
            height: 350
          }}
        ><DetentionSkeleton /></div> :
        <div className="graph-wrapp text-center">
          <GroupColumnChart
            title="Loadability report by volume and weight"
            data={createChartData(state.chartData, filterState.chips)}
            options={{
              scales: {
                yAxes: [{
                  ticks: {
                    suggestedMin: 0,
                    callback: function (value: any, index: any, values: any) {
                      return convertToNumberFormat(value, numberWithoutDecimalFormatter)
                    }
                  },
                }]
              },
              tooltips: {
                intersect: false,
              },
            }}
            width={100}
            height={350}
          />
        </div>
      }
    </div>

  );
}
export default DispatchDashboard;

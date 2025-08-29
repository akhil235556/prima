import { FilterList, Visibility } from "@material-ui/icons";
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { advancedFilterTitle } from '../../../base/constant/MessageUtils';
import { InTransitEfficiencyUrl, OnTimeDispatchReportUrl, PlacementEfficiencyUrl, ShortageDamageReportUrl } from "../../../base/constant/RoutePath";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { getSearchDateFilter } from "../../../base/utility/Routerutils";
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from "../../../component/chips/Chips";
import DataNotFound from '../../../component/error/DataNotFound';
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from '../../../component/widgets/button/Button';
import { getAnanlyticObject } from "../../../moduleUtility/DispatchUtility";
import { allPerformanceReportFilters } from "../../../moduleUtility/FilterUtils";
import { refreshList, toggleFilter } from '../../../redux/actions/AllPerformanceReportActions';
import AllPerformanceReportReducer, { ALL_PERFORMANCE_REPORT_STATE } from '../../../redux/reducers/AllPerformanceReportReducer';
import { getCountList as getCountListIE } from "../../../serviceActions/IntransitEfficiencyServiceActions";
import { getCountList as getCountListOTD } from "../../../serviceActions/OnTimeDispatchReportServiceActions";
import { getCountList as getCountListPE } from "../../../serviceActions/PlacementEfficiencyServiceActions";
import { getCountList as getCountListSD } from "../../../serviceActions/ShortageDamageReportServiceActions";
import PieChart from '../../charts/PieChart';
import '../analytics.css';
import SearchFilterBar from '../searchFilterBar/SearchFilterBar';
import AllPerformanceFilters from "./AllPerformanceFilters";
import './AllPerformanceReport.css';
import PerformanceSkeleton from './performanceSkeleton/PerformanceSkeleton';

function AllPerformanceReport() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const [state = ALL_PERFORMANCE_REPORT_STATE, dispatch] = useReducer(AllPerformanceReportReducer, ALL_PERFORMANCE_REPORT_STATE);
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(allPerformanceReportFilters);
  const [countLoading, setCountLoading] = React.useState(false);
  const [countPE, setCountPE] = React.useState<any>({});
  const [countIE, setCountIE] = React.useState<any>({});
  const [countOTD, setCountOTD] = React.useState<any>({});
  const [countSD, setCountSD] = React.useState<any>({});

  useEffect(() => {
    const getCountListing = async () => {
      let queryParams: any = filterState.params
      setCountLoading(true);
      let promiseArray: any = [appDispatch(getCountListPE(queryParams)), appDispatch(getCountListIE(queryParams)),
      appDispatch(getCountListOTD(queryParams)), appDispatch(getCountListSD(queryParams))];
      Promise.all(promiseArray).then((response: any) => {
        if (response[0]) {
          setCountPE(response[0].details)
        } else {
          setCountPE({})
        }

        if (response[1]) {
          setCountIE(response[1].details)
        } else {
          setCountIE({})
        }

        if (response[2]) {
          setCountOTD(response[2].details)
        } else {
          setCountOTD({})
        }

        if (response[3]) {
          setCountSD(response[3].details)
        } else {
          setCountSD({})
        }

        setCountLoading(false);
      })
    }
    getCountListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh_list, history.location.search]);

  return (
    <div className="all-performance-report analytics-report">

      <AllPerformanceFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          dispatch(toggleFilter());
          dispatch(refreshList())
          let dateFilter = getSearchDateFilter(filterState.params);
          addFiltersQueryParams(filterChips, { ...filterParams, ...dateFilter })
          // dispatch(setFilter(filterChips, filterParams));

        }}
        onClose={() => {
          dispatch(toggleFilter());
        }}
      />
      <Filter
        pageTitle="Performance Report">
        {!isMobile &&
          <SearchFilterBar
            filterParams={filterState.params}
            onApply={(dates: any) => {
              dispatch(refreshList())
              addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
              // dispatch(setFilter({}, dates));
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


      <PageContainer>
        {isMobile && <SearchFilterBar
          filterParams={filterState.params}
          onApply={(dates: any) => {
            dispatch(refreshList())
            addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
            // dispatch(setFilter({}, dates));
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
        {countLoading ? <PerformanceSkeleton /> :
          <div className="row performance-report-row">

            <div className="col-md-12 col-lg-6 performance-report-card">
              <div className="billing-info-wrapp">
                <div className="billing-info-header d-flex align-items-center justify-content-between">
                  <h4>Placement Efficiency</h4>
                  <Button
                    buttonStyle="btn-orange view-pod-btn"
                    title="View"
                    leftIcon={<Visibility />}
                    onClick={() => {
                      history.push({
                        pathname: PlacementEfficiencyUrl,
                        search: new URLSearchParams(getSearchDateFilter(filterState.params)).toString()
                      })
                    }}
                  />
                </div>

                {(!isObjectEmpty(countPE) &&
                  <div className="perform-report-content">
                    <div className="row">
                      <div className="col-md-4 perform-left text-center">
                        <div className="perform-data">
                          <h4>{(countPE && countPE.dispatched) || 0}</h4>
                          <span>Dispatched</span>
                        </div>
                        <div className="perform-data">
                          <h4 className="red-text">{(countPE && countPE.cancelled) || 0}</h4>
                          <span>Cancelled</span>
                        </div>
                      </div>
                      <div className="col-md-8 perform-right text-center align-self-center">
                        <PieChart
                          data={{
                            labels: ["Dispatched", "Cancelled"],
                            datasets: [{
                              data: [(countPE.dispatchedPercent || 0), (countPE.cancelledPercent || 0)],
                              backgroundColor: ["blue", "red"]
                            }]
                          }}
                          options={{
                            maintainAspectRatio: false,
                            legend: {
                              labels: {
                                boxWidth: 12,
                              }
                            }
                          }}
                          height={200}
                        />
                      </div>
                    </div>
                  </div>) || <DataNotFound />}

              </div>
            </div>

            <div className="col-md-12 col-lg-6 performance-report-card">
              <div className="billing-info-wrapp">
                <div className="billing-info-header d-flex align-items-center justify-content-between">
                  <h4>InTransit Efficiency</h4>
                  <Button
                    buttonStyle="btn-orange view-pod-btn"
                    title="View"
                    leftIcon={<Visibility />}
                    onClick={() => {
                      history.push({
                        pathname: InTransitEfficiencyUrl,
                        search: new URLSearchParams(getSearchDateFilter(filterState.params)).toString()
                      })
                    }}
                  />
                </div>

                {(!isObjectEmpty(countIE) && <div className="perform-report-content">
                  <div className="row">
                    <div className="col-md-4 perform-left text-center">
                      <div className="perform-data">
                        <h4 className="green-text">{(countIE && countIE.onTime) || 0}</h4>
                        <span>On Time Efficiency</span>
                      </div>
                      <div className="perform-data">
                        <h4 className="orange-text">{(countIE && countIE.afterTime) || 0}</h4>
                        <span>After Time Efficiency</span>
                      </div>
                    </div>
                    <div className="col-md-8 perform-right text-center align-self-center">
                      <PieChart
                        data={{
                          labels: ["On Time Efficiency", "After Time Efficiency"],
                          datasets: [{
                            data: [(countIE.onTimePercent || 0), (countIE.afterTimePercent || 0)],
                            backgroundColor: ["#1FC900", "#f7931e"]
                          }]
                        }}
                        options={{
                          maintainAspectRatio: false,
                          legend: {
                            labels: {
                              boxWidth: 12,
                            }
                          }
                        }}
                        height={200}
                      />
                    </div>
                  </div>
                </div>) || <DataNotFound />}

              </div>
            </div>

            <div className="col-md-12 col-lg-6 performance-report-card">
              <div className="billing-info-wrapp">
                <div className="billing-info-header d-flex align-items-center justify-content-between">
                  <h4>On Time Dispatch</h4>
                  <Button
                    buttonStyle="btn-orange view-pod-btn"
                    title="View"
                    leftIcon={<Visibility />}
                    onClick={() => {
                      history.push({
                        pathname: OnTimeDispatchReportUrl,
                        search: new URLSearchParams(getSearchDateFilter(filterState.params)).toString()
                      })
                    }}
                  />
                </div>

                {(!isObjectEmpty(countOTD) && <div className="perform-report-content">
                  <div className="row">
                    <div className="col-md-4 perform-left text-center">
                      <div className="perform-data">
                        <h4 className="green-text">{(countOTD && countOTD.onTime) || 0}</h4>
                        <span>On Time Dispatch</span>
                      </div>
                      <div className="perform-data">
                        <h4 className="orange-text">{(countOTD && countOTD.afterTime) || 0}</h4>
                        <span>After Time Dispatch</span>
                      </div>
                    </div>
                    <div className="col-md-8 perform-right text-center align-self-center">
                      <PieChart
                        data={{
                          labels: ["On Time Dispatch", "After Time Dispatch"],
                          datasets: [{
                            data: [(countOTD.onTimePercent || 0), (countOTD.afterTimePercent || 0)],
                            backgroundColor: ["#1FC900", "#f7931e"]
                          }]
                        }}
                        options={{
                          maintainAspectRatio: false,
                          legend: {
                            labels: {
                              boxWidth: 12,
                            }
                          }
                        }}
                        height={200}
                      />
                    </div>
                  </div>
                </div>) || <DataNotFound />}

              </div>
            </div>

            <div className="col-md-12 col-lg-6 performance-report-card">
              <div className="billing-info-wrapp">
                <div className="billing-info-header d-flex align-items-center justify-content-between">
                  <h4>Shortage and Damages</h4>
                  <Button
                    buttonStyle="btn-orange view-pod-btn"
                    title="View"
                    leftIcon={<Visibility />}
                    onClick={() => {
                      history.push({
                        pathname: ShortageDamageReportUrl,
                        search: new URLSearchParams(getSearchDateFilter(filterState.params)).toString()
                      })
                    }}
                  />
                </div>

                {(!isObjectEmpty(countSD) && <div className="perform-report-content">
                  <div className="row">
                    <div className="col-md-4 perform-left text-center">
                      <div className="perform-data">
                        <h4>{(countSD && countSD.shortageCountFree) || 0}</h4>
                        <span>Shortage and Damages Free</span>
                      </div>
                      <div className="perform-data">
                        <h4 className="red-text">{(countSD && countSD.shortageCount) || 0}</h4>
                        <span>Shortage and Damages</span>
                      </div>
                    </div>
                    <div className="col-md-8 perform-right text-center align-self-center">
                      <PieChart
                        data={{
                          labels: ["Shortage and Damages Free", "Shortage and Damages"],
                          datasets: [{
                            data: [(countSD.shortageCountFreePercent || 0), (countSD.shortageCountPercent || 0)],
                            backgroundColor: ["blue", "red"]
                          }]
                        }}
                        options={{
                          maintainAspectRatio: false,
                          legend: {
                            labels: {
                              boxWidth: 12,
                              fontSize: 10.5
                            }
                          }
                        }}
                        height={200}
                      />
                    </div>
                  </div>
                </div>) || <DataNotFound />}

              </div>
            </div>

          </div>}
      </PageContainer>

    </div>
  );

}
export default AllPerformanceReport;

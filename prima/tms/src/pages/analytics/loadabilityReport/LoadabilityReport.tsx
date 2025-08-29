import { ArrowDownward, ArrowUpward, FilterList, GetApp } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { advancedFilterTitle, downloadCsvTitle } from '../../../base/constant/MessageUtils';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { convertToNumberFormat, numberWithoutDecimalFormatter } from '../../../base/utility/NumberUtils';
import { getSearchDateFilter } from '../../../base/utility/Routerutils';
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from "../../../component/chips/Chips";
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import CardList from '../../../component/widgets/cardlist/CardList';
import ListingSkeleton from "../../../component/widgets/listingSkeleton/ListingSkeleton";
import TableList from "../../../component/widgets/tableView/TableList";
import { createChartData, getAnanlyticObject } from "../../../moduleUtility/DispatchUtility";
import { loadabilityReportFilters } from '../../../moduleUtility/FilterUtils';
import { showAlert } from '../../../redux/actions/AppActions';
import { refreshList, setCurrentPage, setResponse, setRowPerPage, setSelectedElement, toggleFilter, toggleModal } from '../../../redux/actions/LoadabilityReportActions';
import LoadabilityReducer, { LOADABILITY_STATE } from '../../../redux/reducers/LoadabilityReducer';
import { getCsvLink, getLoadabilityList } from '../../../serviceActions/LoadabilityServiceActions';
import { dispatchChartData, dispatchDashboardCount } from "../../../serviceActions/MisServiceAction";
import { loadabilityReportTableColumns } from "../../../templates/AnalyticsTemplates";
import GroupColumnChart from '../../charts/GroupColumnChart';
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import SearchFilterBar from '../searchFilterBar/SearchFilterBar';
import './LoadabilityReport.css';
import LoadabilityReportFilters from "./LoadabilityReportFilters";
import LoadabilitySkeleton from './loadabilitySkeleton/LoadabilitySkeleton';

function LoadabilityReport() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(loadabilityReportFilters);
  const [state = LOADABILITY_STATE, dispatch] = useReducer(LoadabilityReducer, LOADABILITY_STATE);
  const [loading, setLoading] = React.useState(false);
  const [countLoading, setCountLoading] = React.useState(false);
  const [count, setCount] = React.useState<any>({});
  const [chartData, setChartData] = React.useState<any>({});

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {}
      queryParams = Object.assign(queryParams);
      queryParams.page = state.currentPage;
      queryParams.size = state.pageSize;
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      setLoading(true);
      appDispatch(getLoadabilityList(queryParams)).then((response: any) => {
        dispatch(setResponse(response));
        setLoading(false);
      })
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh_list, state.currentPage, state.pageSize, history.location.search]);

  useEffect(() => {
    const getCountListing = async () => {
      let queryParams: any = {}
      queryParams = Object.assign(queryParams);
      setCountLoading(true);
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      Promise.all([appDispatch(dispatchDashboardCount(queryParams)), appDispatch(dispatchChartData(queryParams))])
        .then((response: any) => {
          if (response[0]) {
            setCount(response[0] && response[0]);
          } else {
            setCount({})
          }
          if (response[1]) {
            setChartData(response[1] && response[1]);
          } else {
            setChartData({})
          }
          setCountLoading(false);
        });
    }
    getCountListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh_list, history.location.search]);

  return (
    <div className="loadability-report analytics-report">

      <LoadabilityReportFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          //dispatch(setFilter(filterChips, filterParams));
          dispatch(toggleFilter());
          dispatch(refreshList());
          let dateFilter = getSearchDateFilter(filterState.params);
          addFiltersQueryParams(filterChips, { ...filterParams, ...dateFilter })
        }}
        onClose={() => {
          dispatch(toggleFilter());
        }}
      />
      <Filter
        pageTitle="Loadability Report"
      >
        {!isMobile && <SearchFilterBar
          filterParams={filterState.params}
          onApply={(dates: any) => {
            //dispatch(setFilter({}, dates));
            dispatch(refreshList());
            addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
          }}
        />
        }
        <LanePointsDisplayModal
          open={state.openModal}
          laneCode={state.selectedItem && state.selectedItem.laneCode}
          onClose={() => {
            dispatch(setSelectedElement(undefined));
            dispatch(toggleModal());
          }} />

        <FileAction
          options={[
            {
              menuTitle: advancedFilterTitle,
              Icon: FilterList,
              onClick: () => dispatch(toggleFilter())
            },
            {
              menuTitle: downloadCsvTitle,
              Icon: GetApp,
              onClick: () => {
                let queryParams: any = {}
                queryParams = Object.assign(queryParams);
                if (!isObjectEmpty(filterState.params)) {
                  queryParams = Object.assign(queryParams, filterState.params)
                }
                appDispatch(getCsvLink(queryParams)).then((response: any) => {
                  if (response?.code === 201) {
                    appDispatch(showAlert(response?.message));
                  }
                })
              }
            },
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
              dispatch(refreshList());
              removeFiltersQueryParams([element])
              // dispatch(removeFilter(element));
            }}
          />
        ))}
        {countLoading ? <LoadabilitySkeleton /> :
          <div className="row load-row align-items-center">
            <div className="col-md-12 col-lg-4">
              <div className="load-data">
                <ul className="row load-list align-items-center">
                  <li className="col-md-6 col-lg-6"> Avg. Loading Time </li>
                  <li className="col-md-6 col-lg-6">
                    <h4>{((count && count.averageLoadingTime) || 0) + " " + ((count && count.timeUnit) || "")}</h4>
                    {count && count.averageLoadingTime && <span className={(count && count.averageLoadingTimePercent < 0) ? "" : "red-text red-arrow"}> {((count && count.averageLoadingTimePercent < 0) ? <ArrowDownward /> : <ArrowUpward />)} {Math.abs(count && count.averageLoadingTimePercent) || 0}%</span>}
                  </li>
                </ul>
                <ul className="row load-list align-items-center">
                  <li className="col-md-6 col-lg-6"> Inbound </li>
                  <li className="col-md-6 col-lg-6">
                    <h4>{(count && count.inbound) || 0}</h4>
                    {count && count.inboundPercent && <span className={(count && count.inboundPercent < 0) ? "red-text red-arrow" : ""}> {((count && count.inboundPercent < 0) ? <ArrowDownward /> : <ArrowUpward />)} {Math.abs(count && count.inboundPercent) || 0} %</span>}
                  </li>
                </ul>
                <ul className="row load-list align-items-center">
                  <li className="col-md-6 col-lg-6"> Dispatched </li>
                  <li className="col-md-6 col-lg-6">
                    <h4>{(count && count.dispatched) || 0}</h4>
                    {count && count.dispatchedPercent && <span className={(count && count.dispatchedPercent < 0) ? "red-text red-arrow" : ""}> {((count && count.dispatchedPercent < 0) ? <ArrowDownward /> : <ArrowUpward />)} {Math.abs(count && count.dispatchedPercent) || 0} %</span>}
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-12 col-lg-8 align-self-stretch">
              <div className="analytics-graph">
                <GroupColumnChart
                  title="Loadability report by volume and weight"
                  data={createChartData(chartData, filterState.chips)}
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
                  width={500}
                  height={210}
                />
              </div>
            </div>
          </div>}

        {loading ? <ListingSkeleton /> :
          isMobile ?
            <CardList
              listData={state.listData}
              tableColumns={loadabilityReportTableColumns(onClickLaneCode)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            /> :
            <TableList
              tableColumns={loadabilityReportTableColumns(onClickLaneCode)}
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
  );

  function onClickLaneCode(element: any) {
    dispatch(toggleModal());
    dispatch(setSelectedElement(element))
  }
}
export default LoadabilityReport;

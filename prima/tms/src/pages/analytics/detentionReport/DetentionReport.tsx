import { FilterList, GetApp } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { lastWeek, rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { advancedFilterTitle, downloadCsvTitle } from '../../../base/constant/MessageUtils';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
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
import { createChartData } from "../../../moduleUtility/DetentionUtility";
import { getAnanlyticObject } from "../../../moduleUtility/DispatchUtility";
import { detentionReportFilters } from '../../../moduleUtility/FilterUtils';
import { showAlert } from '../../../redux/actions/AppActions';
import { refreshList, setCurrentPage, setResponse, setRowPerPage, setSelectedElement, toggleFilter, toggleModal } from '../../../redux/actions/DetentionReportActions';
import DetentionReportReducer, { DETENTION_REPORT_STATE } from '../../../redux/reducers/DetentionReportReducer';
import { getCsvLink, getDetentionGraphList, getDetentionReportList } from '../../../serviceActions/DetentionReportServiceActions';
import { detentionTableColumns } from "../../../templates/AnalyticsTemplates";
import GroupColumnChart from '../../charts/GroupColumnChart';
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import SearchFilterBar from '../searchFilterBar/SearchFilterBar';
import DetentionReportFilters from "./DetentionReportFilters";
import DetentionSkeleton from "./DetentionSkeleton";

function DetentionReport() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(detentionReportFilters);
  const [state = DETENTION_REPORT_STATE, dispatch] = useReducer(DetentionReportReducer, DETENTION_REPORT_STATE);
  const [loading, setLoading] = React.useState(false);
  const [countLoading, setCountLoading] = React.useState(false);
  const [chartData, setChartData] = React.useState<any>({});

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {}
      queryParams = Object.assign(queryParams, lastWeek);
      queryParams.page = state.currentPage;
      queryParams.size = state.pageSize;
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      setLoading(true)
      appDispatch(getDetentionReportList(queryParams)).then((response: any) => {
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
      queryParams = Object.assign(queryParams, lastWeek);
      setCountLoading(true);
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      appDispatch(getDetentionGraphList(queryParams)).then((response: any) => {
        if (response) {
          setChartData(response)
        } else {
          setChartData({})
        }
        setCountLoading(false);
      })
    }
    getCountListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh_list, history.location.search]);

  return (

    <div className={isObjectEmpty(chartData) ? "detention-report analytics-report analytics-report-wrapp" : "detention-report analytics-report"}>
      <DetentionReportFilters
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
        pageTitle="Detention Report"
      >
        {!isMobile && <SearchFilterBar
          filterParams={filterState.params}
          onApply={(dates: any) => {
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
                let queryParams: any = Object.assign({}, filterState.params);
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
        <div className="custome-row">
          {isMobile && <SearchFilterBar
            filterParams={filterState.params}
            onApply={(dates: any) => {
              dispatch(refreshList());
              addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
              //addFiltersQueryParams({}, dates)
              //dispatch(setFilter({}, dates));
            }}
          />
          }
        </div>

        {!isObjectEmpty(getAnanlyticObject(filterState.chips))
          && Object.keys(getAnanlyticObject(filterState.chips)).map((element: any, index: any) => (
            <Chips
              key={index}
              label={getAnanlyticObject(filterState.chips)[element]}
              onDelete={() => {
                removeFiltersQueryParams([element])
                // dispatch(removeFilter(element));
              }}
            />
          ))}

        {countLoading ?
          <DetentionSkeleton /> :
          !isObjectEmpty(chartData) &&
          <div className="analytics-graph analytics-row text-center">
            <GroupColumnChart
              title="Detention Report"
              data={createChartData(chartData, filterState.chips)}
              width={800}
              height={210}
              options={{
                scales: {
                  yAxes: [{
                    ticks: {
                      suggestedMin: 0,
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'hours'
                    }
                  }]
                },
                tooltips: {
                  intersect: false,
                },
              }}
            />
          </div>}

        {loading ? <ListingSkeleton /> :
          (isMobile ?
            <CardList
              listData={state.listData}
              tableColumns={detentionTableColumns(onClickLaneCode)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            />
            :
            <TableList
              tableColumns={detentionTableColumns(onClickLaneCode)}
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
            />)
        }
      </PageContainer>

    </div>
  );

  function onClickLaneCode(element: any) {
    dispatch(toggleModal());
    dispatch(setSelectedElement(element))
  }

}
export default DetentionReport;

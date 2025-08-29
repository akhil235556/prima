import { FilterList, GetApp } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { advancedFilterTitle, downloadCsvTitle } from '../../../base/constant/MessageUtils';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import useUserLocation from '../../../base/hooks/useUserLocation';
import { getSearchDateFilter } from '../../../base/utility/Routerutils';
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from "../../../component/chips/Chips";
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import AutoComplete from '../../../component/widgets/AutoComplete';
import CardList from '../../../component/widgets/cardlist/CardList';
import ListingSkeleton from "../../../component/widgets/listingSkeleton/ListingSkeleton";
import TableList from "../../../component/widgets/tableView/TableList";
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import { getAnanlyticObject } from "../../../moduleUtility/DispatchUtility";
import { onTimeDispatchFilters } from '../../../moduleUtility/FilterUtils';
import { createChartData } from "../../../moduleUtility/OnTimeDispatchUtility";
import { showAlert } from '../../../redux/actions/AppActions';
import { refreshList, setCurrentPage, setResponse, setRowPerPage, setSelectedElement, toggleFilter, toggleModal } from '../../../redux/actions/OnTimeDispatchReportActions';
import OnTimeDispatchReportReducer, { ON_TIME_DISPATCH_REPORT_STATE } from '../../../redux/reducers/OnTimeDispatchReportReducer';
import {
  getCsvLink, getDispatchGraphList, getOnTimeDispatchReportList
} from '../../../serviceActions/OnTimeDispatchReportServiceActions';
import { onTimeDispatchTableColumns } from "../../../templates/AnalyticsTemplates";
import GroupColumnChart from '../../charts/GroupColumnChart';
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import DetentionSkeleton from "../detentionReport/DetentionSkeleton";
import SearchFilterBar from '../searchFilterBar/SearchFilterBar';
import OnTimeDispatchFilters from "./OnTimeDispatchFilters";

function OnTimeDispatchReport() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const [state = ON_TIME_DISPATCH_REPORT_STATE, dispatch] = useReducer(OnTimeDispatchReportReducer, ON_TIME_DISPATCH_REPORT_STATE);
  const userInfo = useSelector((state: any) => state.appReducer.userInfo, shallowEqual);
  const [params, setParams] = React.useState<any | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [countLoading, setCountLoading] = React.useState(false);
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(onTimeDispatchFilters);
  const [chartData, setChartData] = React.useState<any>({});
  const userLocations = useUserLocation(userInfo, true, false);

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = Object.assign({}, filterState.params)
      queryParams.page = state.currentPage;
      queryParams.size = state.pageSize;
      setLoading(true);
      appDispatch(getOnTimeDispatchReportList(queryParams)).then((response: any) => {
        dispatch(setResponse(response));
        setLoading(false);
      })
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh_list, state.currentPage, state.pageSize, history.location.search]);
  useEffect(() => {
    const getCountListing = async () => {
      let slaNode = params && params.slaNode;
      if (!slaNode) {
        slaNode = userLocations && userLocations[0] && userLocations[0];
        setParams({
          ...params,
          slaNode: userLocations && userLocations[0] && userLocations[0],
        })
      }

      let queryParams: any = Object.assign({
        ...(userInfo.isAdminUser && userInfo.locationCode === "_ALL_") && { slaNode: slaNode && slaNode.value },
      }, filterState.params)
      setCountLoading(true);
      appDispatch(getDispatchGraphList(queryParams)).then((response: any) => {
        if (response) {
          setChartData(response)
        } else {
          setChartData({})
        }
        setCountLoading(false);
      })
    }
    userLocations && getCountListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.search, state.refresh_list, userLocations]);
  return (
    <div className={isObjectEmpty(chartData) ? "ontime-report analytics-report analytics-report-wrapp" : "ontime-report analytics-report"}>
      <OnTimeDispatchFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          dispatch(refreshList())
          let dateFilter = getSearchDateFilter(filterState.params);
          addFiltersQueryParams(filterChips, { ...filterParams, ...dateFilter })
          dispatch(toggleFilter());
        }}
        onClose={() => {
          dispatch(toggleFilter());
        }}
      />
      <LanePointsDisplayModal
        open={state.openModal}
        laneCode={state.selectedItem && state.selectedItem.laneCode}
        onClose={() => {
          dispatch(setSelectedElement(undefined));
          dispatch(toggleModal());
        }} />
      <Filter
        pageTitle="On Time Dispatch Report"
      >
        {!isMobile && <SearchFilterBar
          filterParams={filterState.params}
          onApply={(dates: any) => {
            dispatch(refreshList())
            addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
            //addFiltersQueryParams({}, dates)
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
            {
              menuTitle: downloadCsvTitle,
              Icon: GetApp,
              onClick: () => {
                let queryParams: any = Object.assign({}, filterState.params)
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
      // loading={loading}
      >
        {isMobile && <SearchFilterBar
          filterParams={filterState.params}
          onApply={(dates: any) => {
            dispatch(refreshList())
            addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
            //addFiltersQueryParams({}, dates)
          }}
        />
        }
        {!isObjectEmpty(getAnanlyticObject(filterState.chips)) && Object.keys(getAnanlyticObject(filterState.chips)).map((element) => (
          <Chips
            label={getAnanlyticObject(filterState.chips)[element]}
            onDelete={() => {
              dispatch(refreshList())
              removeFiltersQueryParams([element])
            }}
          />
        ))}
        {countLoading ?
          <DetentionSkeleton /> :
          !isObjectEmpty(chartData) &&
          <div className="analytics-graph analytics-row text-center">
            {
              userInfo.isAdminUser && userInfo.locationCode === "_ALL_" &&
              <>
                <div className="custom-select-wrap">
                  <AutoComplete
                    label="Node :"
                    placeHolder="Node"
                    value={params.slaNode}
                    isShowAll={true}
                    options={userLocations}
                    onChange={(element: OptionType) => {
                      dispatch(refreshList());
                      setParams({
                        ...params,
                        slaNode: element
                      })
                    }}
                  />
                </div>
              </>
            }
            <GroupColumnChart
              title="On Time Dispatch Report"
              data={createChartData(chartData, filterState.chips)}
              width={800}
              height={210}
              options={{
                scales: {
                  yAxes: [{
                    ticks: {
                      suggestedMin: 0,
                      // suggestedMax: 100
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
              tableColumns={onTimeDispatchTableColumns(onClickLaneCode)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            /> :
            <TableList
              tableColumns={onTimeDispatchTableColumns(onClickLaneCode)}
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
export default OnTimeDispatchReport;

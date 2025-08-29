import { FilterList, GetApp } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
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
import { getAnanlyticObject } from "../../../moduleUtility/DispatchUtility";
import { placementEfficiencyFilters } from "../../../moduleUtility/FilterUtils";
import { showAlert } from '../../../redux/actions/AppActions';
import { refreshList, setCurrentPage, setResponse, setRowPerPage, setSelectedElement, toggleFilter, toggleModal } from '../../../redux/actions/PlacementEfficiencyActions';
import PlacementEfficiencyReducer, { PLACEMENT_EFFICIENCY_STATE } from '../../../redux/reducers/PlacementEfficiencyReducer';
import { getCountList, getCsvLink, getPlacementEfficiencyList } from '../../../serviceActions/PlacementEfficiencyServiceActions';
import { placementEfficiencyTableColumns } from "../../../templates/AnalyticsTemplates";
import PieChart from '../../charts/PieChart';
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import AnalyticsSkeleton from '../analyticsSkeleton/AnalyticsSkeleton';
import SearchFilterBar from '../searchFilterBar/SearchFilterBar';
import PlacementEfficiencyFilters from "./PlacementEfficiencyFilters";

function PlacementEfficiency() {
  const appDispatch = useDispatch();
  const history = useHistory();
  const [state = PLACEMENT_EFFICIENCY_STATE, dispatch] = useReducer(PlacementEfficiencyReducer, PLACEMENT_EFFICIENCY_STATE);
  const [loading, setLoading] = React.useState(false);
  const [countLoading, setCountLoading] = React.useState(false);
  const [count, setCount] = React.useState<any>({});
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(placementEfficiencyFilters);
  // const [CSVloading, setCSVLoading] = React.useState(false);

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = Object.assign({}, filterState.params)
      queryParams.page = state.currentPage;
      queryParams.size = state.pageSize;
      setLoading(true);
      appDispatch(getPlacementEfficiencyList(queryParams)).then((response: any) => {
        dispatch(setResponse(response));
        setLoading(false);
      })
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh_list, state.currentPage, state.pageSize, history.location.search]);

  useEffect(() => {
    const getCountListing = async () => {
      let queryParams: any = Object.assign({}, filterState.params)
      setCountLoading(true);
      appDispatch(getCountList(queryParams)).then((response: any) => {
        if (response && response.details) {
          setCount(response.details)
        } else {
          setCount({})
        }
        setCountLoading(false);
      })
    }
    getCountListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.search, state.refresh_list]);

  return (
    <div className={isObjectEmpty(count) ? "placement-efficiency analytics-report analytics-report-wrapp" : "placement-efficiency analytics-report"}>

      <PlacementEfficiencyFilters
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
        pageTitle="Placement Efficiency"
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

        {
          countLoading ? <AnalyticsSkeleton /> :
            !isObjectEmpty(count) &&
            <div className="row analytics-row">
              <div className="col-md-12 col-lg-5">
                <div className="row">
                  <div className="col-6 analytics-card">
                    <div className="analytics-data">
                      <h4>{(count && count.dispatched) || 0}</h4>
                      <p>Dispatched</p>
                    </div>
                  </div>
                  <div className="col-6 analytics-card">
                    <div className="analytics-data">
                      <h4 className="red-text">{(count && count.cancelled) || 0}</h4>
                      <p>Cancelled</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-7 text-center analytics-graph-card mt-20">
                <div className="analytics-graph">
                  <PieChart
                    data={{
                      labels: ["Dispatched", "Cancelled"],
                      datasets: [{
                        data: [(count.dispatchedPercent || 0), (count.cancelledPercent || 0)],
                        backgroundColor: ["blue", "red"]
                      }]
                    }}
                    options={{
                      maintainAspectRatio: false,
                      legend: {
                        labels: {
                          boxWidth: 12
                        }
                      },
                    }}
                    height={200}
                  />
                </div>
              </div>
            </div>
        }

        {loading ? <ListingSkeleton /> :
          (isMobile ?
            <CardList
              listData={state.listData}
              tableColumns={placementEfficiencyTableColumns(onClickLaneCode)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            /> :
            <TableList
              tableColumns={placementEfficiencyTableColumns(onClickLaneCode)}
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

    </div >
  );

  function onClickLaneCode(element: any) {
    dispatch(toggleModal());
    dispatch(setSelectedElement(element))
  }

}
export default PlacementEfficiency;

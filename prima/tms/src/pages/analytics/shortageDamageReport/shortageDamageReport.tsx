import { FilterList, GetApp } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { advancedFilterTitle, downloadCsvTitle } from '../../../base/constant/MessageUtils';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { convertAmountToNumberFormat, numberFormatter } from "../../../base/utility/NumberUtils";
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
import { inTransitEfficiencyFilters } from '../../../moduleUtility/FilterUtils';
import { showAlert } from '../../../redux/actions/AppActions';
import { refreshList, setCurrentPage, setResponse, setRowPerPage, setSelectedElement, toggleFilter, toggleModal } from '../../../redux/actions/ShortageDamageReportActions';
import ShortageDamageReportReducer, { SHORTAGE_DAMAGE_REPORT_STATE } from '../../../redux/reducers/ShortageDamageReportReducer';
import { getCountList, getCsvLink, getShortageDamageReportList } from '../../../serviceActions/ShortageDamageReportServiceActions';
import { shortageDamageTableColumns } from "../../../templates/AnalyticsTemplates";
import PieChart from '../../charts/PieChart';
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import AnalyticsSkeleton from '../analyticsSkeleton/AnalyticsSkeleton';
import SearchFilterBar from '../searchFilterBar/SearchFilterBar';
import ShortageDamageFilters from "./ShortageDamageFilters";
import './shortageDamageReport.css';

function ShortageDamageReport() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const [state = SHORTAGE_DAMAGE_REPORT_STATE, dispatch] = useReducer(ShortageDamageReportReducer, SHORTAGE_DAMAGE_REPORT_STATE);
  const [loading, setLoading] = React.useState(false);
  const [countLoading, setCountLoading] = React.useState(false);
  const [count, setCount] = React.useState<any>({});
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(inTransitEfficiencyFilters);

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = Object.assign({}, filterState.params)
      queryParams.page = state.currentPage;
      queryParams.size = state.pageSize;
      setLoading(true);
      appDispatch(getShortageDamageReportList(queryParams)).then((response: any) => {
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
    <div className={isObjectEmpty(count) ? "shortage-damage-report analytics-report analytics-report-wrapp" : "shortage-damage-report analytics-report"}>
      <ShortageDamageFilters
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
        pageTitle="Shortage Damage Report"
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
        {!isObjectEmpty(getAnanlyticObject(filterState.chips))
          && Object.keys(getAnanlyticObject(filterState.chips)).map((element: any, index: any) => (
            <Chips
              key={index}
              label={getAnanlyticObject(filterState.chips)[element]}
              onDelete={() => {
                dispatch(refreshList())
                removeFiltersQueryParams([element])
              }}
            />
          ))}

        {countLoading ? <AnalyticsSkeleton /> :
          !isObjectEmpty(count) &&
          <div className="row analytics-row">
            <div className="col-md-5">
              <div className="row">
                <div className="col-md-6 analytics-card">
                  <div className="analytics-data">
                    <div className="analytics-head">
                      <span>Order</span>
                    </div>
                    <ul className="analytics-list">
                      <li>
                        <h4>{(count && count.shortageCountFree) || 0}</h4>
                        <span>Shortage and Damages Free</span>
                      </li>
                      <li>
                        <h4 className="red-text">{(count && count.shortageCount) || 0}</h4>
                        <span>Shortage and Damages</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6 analytics-card">
                  <div className="analytics-data">
                    <div className="analytics-head">
                      <span>Value</span>
                    </div>
                    <ul className="analytics-list">
                      <li>
                        <h4 className="green-text"> <img src="/images/rupee-green.svg" alt="" />  {(count && count.shortageFreeAmount && convertAmountToNumberFormat(count.shortageFreeAmount, numberFormatter)) || "0.00"}</h4>
                        <span>Shortage and Damages Free</span>
                      </li>
                      <li>
                        <h4 className="red-text"> <img src="/images/rupee-red.svg" alt="" />  {(count && count.shortageDamageAmount && convertAmountToNumberFormat(count.shortageDamageAmount, numberFormatter)) || "0.00"}</h4>
                        <span>Shortage and Damages</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-7 text-center analytics-graph-card">
              <div className="analytics-graph">
                <PieChart
                  data={{
                    labels: ["Shortage and Damages Free", "Shortage and Damages"],
                    datasets: [{
                      data: [(count.shortageCountFreePercent || 0), (count.shortageCountPercent || 0)],
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
          </div>}

        {loading ? <ListingSkeleton /> :
          (isMobile ?
            <CardList
              listData={state.listData}
              tableColumns={shortageDamageTableColumns(onClickLaneCode)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            /> :
            <TableList
              tableColumns={shortageDamageTableColumns(onClickLaneCode)}
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
export default ShortageDamageReport;

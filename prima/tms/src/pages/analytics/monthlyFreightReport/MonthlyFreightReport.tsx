import { FilterList, GetApp } from "@material-ui/icons";
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { advancedFilterTitle, downloadCsvTitle } from "../../../base/constant/MessageUtils";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { getSearchDateFilter } from "../../../base/utility/Routerutils";
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
import { freightReportFilters } from "../../../moduleUtility/FilterUtils";
import { showAlert } from "../../../redux/actions/AppActions";
import { refreshList, setCurrentPage, setResponse, setRowPerPage, setSelectedElement, toggleFilter, toggleModal } from '../../../redux/actions/MonthlyFreightReportActions';
import MonthlyFreightReportReducer, { MONTHLY_FREIGHT_REPORT_STATE } from '../../../redux/reducers/MonthlyFreightReportReducer';
import { getCsvLink, getMonthlyFreightReportList } from '../../../serviceActions/MonthlyFreightReportServiceActions';
import { monthlyFreightTableColumns } from "../../../templates/AnalyticsTemplates";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import SearchFilterBar from '../searchFilterBar/SearchFilterBar';
import MonthlyFreightFilters from "./MonthlyFreightFilters";

function MonthlyFreightReport() {
  const appDispatch = useDispatch();
  const history = useHistory();
  const [state = MONTHLY_FREIGHT_REPORT_STATE, dispatch] = useReducer(MonthlyFreightReportReducer, MONTHLY_FREIGHT_REPORT_STATE);
  const [loading, setLoading] = React.useState(false);
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(freightReportFilters);


  // const [CSVloading, setCSVLoading] = React.useState(false);

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
      appDispatch(getMonthlyFreightReportList(queryParams)).then((response: any) => {
        dispatch(setResponse(response));
        setLoading(false);
      })
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh_list, state.currentPage, state.pageSize, history.location.search]);

  return (
    <div className="monthly-freight-report analytics-report">

      <MonthlyFreightFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          dispatch(refreshList());
          let dateFilter = getSearchDateFilter(filterState.params);
          addFiltersQueryParams(filterChips, { ...filterParams, ...dateFilter })
          //dispatch(setFilter(filterChips, filterParams));
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
        pageTitle="Freight Order Report"
      >

        {!isMobile && <SearchFilterBar
          filterParams={filterState.params}
          onApply={(dates: any) => {
            dispatch(refreshList());
            addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
            //dispatch(setFilter({}, dates));
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
          }}
        />
        }

        {!isObjectEmpty(getAnanlyticObject(filterState.chips)) && Object.keys(getAnanlyticObject(filterState.chips)).map((element) => (
          <Chips
            label={getAnanlyticObject(filterState.chips)[element]}
            onDelete={() => {
              dispatch(refreshList());
              removeFiltersQueryParams([element])
            }}
          />
        ))}

        {loading ? <ListingSkeleton /> :
          (isMobile ?
            <CardList
              listData={state.listData}
              tableColumns={monthlyFreightTableColumns(onClickLaneCode)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            />
            :
            <TableList
              tableColumns={monthlyFreightTableColumns(onClickLaneCode)}
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
export default MonthlyFreightReport;

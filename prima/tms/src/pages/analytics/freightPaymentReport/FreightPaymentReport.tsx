import { CheckCircle, FilterList, GetApp } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { freightPaymentReportFilters } from "../../../../src/moduleUtility/FilterUtils";
import { freightPaymentDateTypeCriteria, rowsPerPageOptions } from "../../../base/constant/ArrayList";
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
import AutoComplete from "../../../component/widgets/AutoComplete";
import CardList from '../../../component/widgets/cardlist/CardList';
import ListingSkeleton from "../../../component/widgets/listingSkeleton/ListingSkeleton";
import TableList from "../../../component/widgets/tableView/TableList";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { getAnanlyticObject } from "../../../moduleUtility/DispatchUtility";
import { showAlert } from '../../../redux/actions/AppActions';
import {
  refreshList, setCurrentPage, setDateType, setResponse,
  setRowPerPage, setSelectedElement, toggleFilter,
  toggleModal
} from '../../../redux/actions/FreightPaymentReportActions';
import FreightPaymentReportReducer, { FREIGHT_PAYMENT_REPORT_STATE } from '../../../redux/reducers/FreightPaymentReportReducer';
import { getCountList, getCsvLink, getFreightPaymentReportList } from '../../../serviceActions/FreightPaymentReportServiceActions';
import { freightPaymentTableColumns } from "../../../templates/AnalyticsTemplates";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import SearchFilterBar from '../searchFilterBar/SearchFilterBar';
import FreightPaymentFilters from "./FreightPaymentFilters";
import './FreightPaymentReport.css';

function FreightPaymentReport() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(freightPaymentReportFilters);
  const [state = FREIGHT_PAYMENT_REPORT_STATE, dispatch] = useReducer(FreightPaymentReportReducer, FREIGHT_PAYMENT_REPORT_STATE);
  const [loading, setLoading] = React.useState(false);
  const [countLoading, setCountLoading] = React.useState(false);
  const [count, setCount] = React.useState<any>({});

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {}
      queryParams = Object.assign(queryParams);
      queryParams.page = state.currentPage;
      queryParams.size = state.pageSize;
      queryParams.dateType = state.dateType?.value
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      setLoading(true);
      appDispatch(getFreightPaymentReportList(queryParams)).then((response: any) => {
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
      queryParams.dateType = state.dateType?.value
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
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
  }, [state.refresh_list, history.location.search]);


  return (
    <div className="freight-payment analytics-report">
      <FreightPaymentFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          dispatch(refreshList());
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
        }}
      />

      <Filter
        pageTitle="Freight Payment Report"
      >
        {!isMobile && <AutoComplete
          label={""}
          placeHolder={"Select Field"}
          value={state.dateType}
          options={freightPaymentDateTypeCriteria}
          onChange={(value: OptionType) => {
            dispatch(setDateType(value))
          }}
        />}

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
                  queryParams.dateType = state.dateType?.value
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

      <PageContainer>
        {isMobile && <AutoComplete
          label={""}
          placeHolder={"Select Field"}
          value={state.dateType}
          options={freightPaymentDateTypeCriteria}
          onChange={(value: OptionType) => {
            dispatch(setDateType(value))
          }}
        />}

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
              removeFiltersQueryParams([element])
              //dispatch(removeFilter(element));
            }}
          />
        ))}

        {countLoading ? "" : <div className="row freight-payment-row">
          <div className="col-md-6">
            <div className="row freight-payment-card">
              <div className="col">
                <div className="d-flex align-items-center">
                  <CheckCircle />
                  <span>Paid</span>
                </div>
              </div>
              <div className="col-md-4 col-auto">
                <div className="d-flex align-items-center">
                  <img src="/images/rupee-green.svg" className="mr-2" alt="rupee" />
                  <span>{(count && count.paid && convertAmountToNumberFormat(count.paid, numberFormatter)) || "0.00"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="row freight-payment-card">
              <div className="col">
                <div className="d-flex align-items-center">
                  <img src="/images/payment-pending-icon.png" alt="pending" />
                  <span>Pending</span>
                </div>
              </div>
              <div className="col-md-4 col-auto">
                <div className="d-flex align-items-center">
                  <img src="/images/rupee-orange.svg" className="mr-2" alt="rupee" />
                  <span className="orange-text">{(count && count.unPaid && convertAmountToNumberFormat(count.unPaid, numberFormatter)) || "0.00"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>}

        {loading ? <ListingSkeleton /> :
          (isMobile ?
            <CardList
              listData={state.listData}
              tableColumns={freightPaymentTableColumns(onClickLaneCode)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            /> :
            <TableList
              tableColumns={freightPaymentTableColumns(onClickLaneCode)}
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
export default FreightPaymentReport;

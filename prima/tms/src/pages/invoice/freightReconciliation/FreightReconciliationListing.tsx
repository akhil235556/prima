import { GetApp, Tune } from "@material-ui/icons";
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { reconciliationOptions, rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { downloadCsvTitle } from "../../../base/constant/MessageUtils";
import { FreightReconciliationPeriodicInvoiceUrl, FreightReconciliationTripInvoiceUrl } from "../../../base/constant/RoutePath";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { getAdvanceFilterChips } from "../../../base/utility/Routerutils";
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import FileAction from "../../../component/fileAction/FileAction";
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import SearchFilter from "../../../component/searchfilter/SearchFilters";
import CardList from "../../../component/widgets/cardlist/CardList";
import TableList from "../../../component/widgets/tableView/TableList";
import { freightFilters } from '../../../moduleUtility/FilterUtils';
import { showAlert } from "../../../redux/actions/AppActions";
import { refreshList, setCurrentPage, setDefaultExpandRowIndex, setResponse, setRowPerPage, setSelectedElement, togglePointsModal } from '../../../redux/actions/FreightReconciliationAction';
import { toggleFilter } from '../../../redux/actions/LaneActions';
import FreightReconciliationReducer, { FREIGHT_RECONCILIATION_STATE } from '../../../redux/reducers/FreightReconciliationReducer';
import { downloadReconciliationCsv, getFreightReconciliationOrderListing } from '../../../serviceActions/OrderServiceActions';
import { freightTableColumns } from "../../../templates/InvoiceTemplates";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import "./FreightReconciliation.css";
import FreightReconciliationFilters from "./FreightReconciliationFilters";


function FreightReconciliationListing() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(freightFilters);
  const [state = FREIGHT_RECONCILIATION_STATE, dispatch] = useReducer(FreightReconciliationReducer, FREIGHT_RECONCILIATION_STATE);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {
        page: state.currentPage,
        pageSize: state.pageSize,
      }
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      if (queryParams && queryParams.queryFieldLabel) {
        delete queryParams["queryFieldLabel"]
        // delete queryParams["queryField"]
        // delete queryParams["query"]
      }
      setLoading(true);
      appDispatch(getFreightReconciliationOrderListing(queryParams)).then((response: any) => {
        dispatch(setResponse(response));
        setLoading(false);
      });
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh_list, state.currentPage, state.pageSize, state.defaultExpandRowIndex, setDefaultExpandRowIndex, history.location.search]);

  return (
    <div className="freight-reconcil-wrapper">
      <FreightReconciliationFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          dispatch(refreshList());
          dispatch(toggleFilter());
          addFiltersQueryParams(filterChips, filterParams)
        }}
        onClose={() => {
          dispatch(toggleFilter());
        }}
      />

      <LanePointsDisplayModal
        open={state.openPointModal}
        laneCode={state.selectedItem && state.selectedItem.laneCode}
        onClose={() => {
          dispatch(setSelectedElement(undefined));
          dispatch(togglePointsModal());
        }}
      />

      <Filter
        pageTitle="Freight Reconciliation"
        buttonStyle="btn-orange"
        buttonTitle={isMobile ? " " : "Filter"}
        leftIcon={<Tune />}
        onClick={() => {
          dispatch(toggleFilter())
        }}
      >
        <FileAction
          options={[
            {
              menuTitle: downloadCsvTitle,
              Icon: GetApp,
              onClick: () => {
                let queryParams: any = {};
                if (!isObjectEmpty(filterState.params)) {
                  queryParams = Object.assign(queryParams, filterState.params);
                }
                if (queryParams && queryParams.queryFieldLabel) {
                  delete queryParams["queryFieldLabel"]
                }
                appDispatch(downloadReconciliationCsv(queryParams)).then((response: any) => {
                  if (response?.code === 201) {
                    appDispatch(showAlert(response?.message));
                  }
                })
              }
            }
          ]}
        />
      </Filter>

      <SearchFilter
        list={reconciliationOptions}
        appliedFilters={filterState.params}
        onClickSearch={(params: any) => {
          dispatch(refreshList());
          if (params) {
            addFiltersQueryParams(filterState.chips, {
              ...filterState.params,
              queryField: params.field.value,
              queryFieldLabel: params.field.label,
              query: params.text
            });
          } else {
            removeFiltersQueryParams(["queryField", "queryFieldLabel", "query"])
          }
        }}
      ></SearchFilter>

      <PageContainer
        loading={loading}
        listData={state.listData}
      >
        {!isObjectEmpty(getAdvanceFilterChips(filterState.chips)) &&
          Object.keys(getAdvanceFilterChips(filterState.chips)).map((element: any, index: any) => (
            <Chips
              key={index}
              label={filterState.chips[element]}
              onDelete={() => {
                dispatch(refreshList());
                if (element === "freightOrderCreatedAtFromTime" || element === "freightOrderCreatedAtToTime" || element === "query") {
                  let secondKey = element === "freightOrderCreatedAtFromTime" ? "freightOrderCreatedAtToTime" : "freightOrderCreatedAtFromTime";
                  let extraMobileKey = element === "query" ? ["queryField", "queryFieldLabel"] : []
                  removeFiltersQueryParams([element, secondKey, ...extraMobileKey])
                } else {
                  removeFiltersQueryParams([element]);
                }
              }}
            />
          ))}
        {
          isMobile ?
            <CardList
              listData={state.listData}
              tableColumns={freightTableColumns(onClickBillView)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            />
            :
            <TableList
              tableColumns={freightTableColumns(onClickBillView)}
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
        }
      </PageContainer>
    </div>
  );

  function onClickBillView(element: any) {
    if (element && element.billType !== "trip") {
      // Redirecting to Periodic Billing View
      history.push({
        pathname: FreightReconciliationPeriodicInvoiceUrl + element.id,
        // state:state
      });
    } else {
      // Redicrecting to Trip Level Billing View
      history.push({
        pathname: FreightReconciliationTripInvoiceUrl + element.id,
        state: element
      });
    }
  }
}

export default FreightReconciliationListing;

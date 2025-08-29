import { GetApp, Tune } from "@material-ui/icons";
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { list, RegisterJobs, rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { ShipmentUrl } from "../../../base/constant/RoutePath";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { getAdvanceFilterChips } from "../../../base/utility/Routerutils";
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Chips from "../../../component/chips/Chips";
import FileAction from "../../../component/fileAction/FileAction";
import Filter from "../../../component/filter/Filter";
import PageContainer from "../../../component/pageContainer/PageContainer";
import SearchFilter from "../../../component/searchfilter/SearchFilters";
import CardList from "../../../component/widgets/cardlist/CardList";
import TableList from "../../../component/widgets/tableView/TableList";
import BulkUploadDialog from '../../../modals/BulkUploadDialog/BulkUploadDialog';
import { shipmentFilters } from "../../../moduleUtility/FilterUtils";
import { showAlert } from "../../../redux/actions/AppActions";
import {
  hideLoading, refreshList, setCurrentPage,
  setResponse, setRowPerPage, setSelectedElement,
  showLoading, toggleFilter, toggleModal, togglePointsModal
} from '../../../redux/actions/ShipmentActions';
import ShipmentReducer, { SHIPMENT_STATE } from '../../../redux/reducers/ShipmentReducer';
import { shipmentCreateExport } from "../../../serviceActions/ExportServiceActions";
import { getOrderList } from "../../../serviceActions/ShipmentServiceActions";
import { freightTableColumns } from "../../../templates/FreightTemplates";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import FreightFilters from "./FreightFilters";
import "./FreightListing.css";

function FreightListing() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(shipmentFilters);
  const [state = SHIPMENT_STATE, dispatch] = useReducer(ShipmentReducer, SHIPMENT_STATE);

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {
        page: state.currentPage,
        pageSize: state.pageSize,
      }
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      // Remove extra query params pick from serach params
      if (queryParams && queryParams.queryFieldLabel) {
        delete queryParams["queryFieldLabel"]
      }

      dispatch(showLoading());
      appDispatch(getOrderList(queryParams)).then((response: any) => {
        dispatch(setResponse(response));
        appDispatch(hideLoading());
      });
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);

  function downloadCsvAction() {
    dispatch(showLoading())
    let queryParams: any = {};
    if (!isObjectEmpty(filterState.params)) {
      queryParams = Object.assign(queryParams, filterState.params)
    }
    appDispatch(shipmentCreateExport(queryParams)).then((response: any) => {
      if (response && response.message) {
        appDispatch(showAlert(response.message))
      }
      dispatch(hideLoading())
    })
  }

  return (
    <div className="freight-listing-wrapper">

      <FreightFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        addQuickSearch={isMobile}
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
        laneCode={state.selectedItem && state.selectedItem.orderDetails && state.selectedItem.orderDetails.laneCode}
        onClose={() => {
          dispatch(setSelectedElement(undefined));
          dispatch(togglePointsModal());
        }}
      />
      <BulkUploadDialog
        title="Bulk Upload Shipment Scan"
        open={state.openModal}
        jobName={RegisterJobs.SHIPMENT_SCAN}
        onClose={() => {
          dispatch(toggleModal());
        }}
      />

      <Filter
        pageTitle="Shipment Tracking"
        buttonStyle="btn-orange"
        buttonTitle={isMobile ? " " : "Filter"}
        leftIcon={<Tune />}
        onClick={() => {
          dispatch(toggleFilter());
        }}
      >
        <FileAction
          options={[
            {
              menuTitle: "Download CSV File",
              Icon: GetApp,
              onClick: downloadCsvAction
            }
          ]}
        />
      </Filter>

      {
        !isMobile &&
        <SearchFilter
          list={list}
          appliedFilters={filterState.params}
          onClickSearch={(params: any) => {
            // setReturnParams(params);
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
        />
      }

      <PageContainer
        loading={state.loading}
        listData={state.listData}
      >

        {!isObjectEmpty(getAdvanceFilterChips(filterState.chips))
          && Object.keys(getAdvanceFilterChips(filterState.chips)).map((element) => (
            <Chips
              label={filterState.chips[element]}
              onDelete={() => {
                dispatch(refreshList());
                if (element === "fromDate" || element === "toDate" || element === "query") {
                  let secondKey = element === "fromDate" ? "toDate" : "fromDate";
                  let extraMobileKey = element === "query" ? ["queryField", "queryFieldLabel"] : []
                  removeFiltersQueryParams([element, secondKey, ...extraMobileKey])
                } else {
                  removeFiltersQueryParams([element]);
                }
              }}
            />
          ))}
        {
          (isMobile ?
            <CardList
              listData={state.listData}
              tableColumns={freightTableColumns(onClickViewButton, onClickLaneCode)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            />
            :
            <TableList
              tableColumns={freightTableColumns(onClickViewButton, onClickLaneCode)}
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
            />)
        }

      </PageContainer>
    </div>
  );
  function onClickViewButton(element: any) {
    element && element.shipmentDetails && history.push({
      pathname: ShipmentUrl + element.shipmentDetails.freightShipmentCode,
      state: {
        details: element,
      }
    })
  }

  function onClickLaneCode(element: any) {
    dispatch(togglePointsModal());
    dispatch(setSelectedElement(element))
  }
}

export default FreightListing;

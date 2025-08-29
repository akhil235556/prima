import { Tune } from "@material-ui/icons";
import React, { useEffect, useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { listDispatch, rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { gateInNoShipmentsError } from "../../../base/constant/MessageUtils";
import { GateInUrl } from "../../../base/constant/RoutePath";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { getAdvanceFilterChips } from "../../../base/utility/Routerutils";
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Chips from "../../../component/chips/Chips";
import Filter from "../../../component/filter/Filter";
import PageContainer from '../../../component/pageContainer/PageContainer';
import SearchFilter from "../../../component/searchfilter/SearchFilters";
import ExpendableCardList from "../../../component/widgets/cardlist/ExpendableCardList";
import TableCollapseList from "../../../component/widgets/tableView/tableCollapseList/TableCollapseList";
import { inboundFilters } from "../../../moduleUtility/FilterUtils";
import { showAlert } from "../../../redux/actions/AppActions";
import { hideLoading, setCurrentPage, setResponse, setSelectedElement, showLoading, toggleFilter, toggleModal, togglePointsModal } from "../../../redux/actions/InboundActions";
import { refreshList } from '../../../redux/actions/OrderActions';
import { setRowPerPage } from "../../../redux/actions/RolesAction";
import InboundReducer, { INBOUND_STATE } from '../../../redux/reducers/InboundReducer';
import { getInboundOrderList } from '../../../serviceActions/OrderServiceActions';
import { inboundChildrenTableColumns, inboundMobileColumns, inboundTableColumns } from "../../../templates/DispatchTemplates";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import DispatchFilters from "../DispatchFilters";
import GateInModal from "./GateInModal";
import "./InboundListing.css";

function InboundListing() {
  const appDispatch = useDispatch();
  const history = useHistory();
  const [state = INBOUND_STATE, dispatch] = useReducer(InboundReducer, INBOUND_STATE);
  // eslint-disable-next-line
  const [inboundListingPage, setInboundListingPage] = useState<boolean>(true);
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(inboundFilters);

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
      appDispatch(getInboundOrderList(queryParams)).then((response: any) => {
        dispatch(setResponse(response));
        dispatch(hideLoading());
      });
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);

  return (
    <div className="inbound-listing-wrapper">

      <GateInModal
        open={state.openModal}
        selectedElement={state.selectedItem}
        onSuccess={() => {
          dispatch(toggleModal());
          dispatch(setSelectedElement(undefined))
          dispatch(refreshList());
        }}
        onClose={() => {
          dispatch(toggleModal());
        }}
      />

      <DispatchFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          dispatch(refreshList());
          dispatch(toggleFilter());
          addFiltersQueryParams(filterChips, filterParams)
        }}
        addQuickSearch={isMobile}
        showAssignVehicleFilter={true}
        pickUpFilters={true}
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
        }} />

      <div className="filter-wrap">
        <Filter
          pageTitle="Inbound"
          buttonStyle="btn-orange"
          buttonTitle={isMobile ? " " : "Filter"}
          leftIcon={<Tune />}
          onClick={() => {
            dispatch(toggleFilter());
          }}
        />
      </div>

      {!isMobile &&
        <SearchFilter
          list={listDispatch}
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
        />
      }
      <PageContainer
        loading={state.loading}
        listData={state.listData}
      >
        {!isObjectEmpty(getAdvanceFilterChips(filterState.chips))
          && Object.keys(getAdvanceFilterChips(filterState.chips)).map((element: any, index: any) => (
            <Chips
              key={index}
              label={element === "isVehicleAssignedStatus" ? "Vehicle Assigned: " + filterState.chips[element] : filterState.chips[element]}
              onDelete={() => {
                dispatch(refreshList());
                if (element === "dispatchOrderCreatedAtFromTime" || element === "dispatchOrderCreatedAtToTime" || element === "query") {
                  let secondKey = element === "dispatchOrderCreatedAtFromTime" ? "dispatchOrderCreatedAtToTime" : "dispatchOrderCreatedAtFromTime";
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
            <ExpendableCardList
              listData={state.listData}
              tableColumns={inboundMobileColumns(onClickGateIn, onClickLaneCode)}
              childTableColumns={inboundChildrenTableColumns(inboundListingPage)}
              childElementKey='shipmentDetails'
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            />
            :
            <TableCollapseList
              tableColumns={inboundTableColumns(onClickGateIn, onClickLaneCode)}
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
              childElementKey='shipmentDetails'
              childrenColumns={inboundChildrenTableColumns(inboundListingPage)}
            />
        }
      </PageContainer>
    </div>
  );
  function onClickGateIn(element: any) {
    const hasShipments = Array.isArray(element.shipmentDetails) && element.shipmentDetails.length > 0;
    if (hasShipments) {
      dispatch(setSelectedElement(element));
      history.push(GateInUrl + element.freightOrderCode);
    } else {
      appDispatch(showAlert(gateInNoShipmentsError, false));
    }
  }

  function onClickLaneCode(element: any) {
    dispatch(setSelectedElement(element))
    dispatch(togglePointsModal());
  }
}


export default InboundListing;

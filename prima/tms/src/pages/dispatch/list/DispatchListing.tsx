import { Publish, Tune } from "@material-ui/icons";
import React, { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { listDispatch, RegisterJobs, rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { uploadWaybillNoLabel, wayBillNoLabel } from "../../../base/constant/MessageUtils";
import { GateOutUrl } from "../../../base/constant/RoutePath";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { getAdvanceFilterChips } from "../../../base/utility/Routerutils";
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Chips from "../../../component/chips/Chips";
import FileAction from "../../../component/fileAction/FileAction";
import Filter from "../../../component/filter/Filter";
import PageContainer from "../../../component/pageContainer/PageContainer";
import SearchFilter from "../../../component/searchfilter/SearchFilters";
import ExpendableCardList from '../../../component/widgets/cardlist/ExpendableCardList';
import TableCollapseList from '../../../component/widgets/tableView/tableCollapseList/TableCollapseList';
import BulkUploadDialog from "../../../modals/BulkUploadDialog/BulkUploadDialog";
import { dispatchFilters } from "../../../moduleUtility/FilterUtils";
import {
  hideLoading, refreshList, setCurrentPage,
  setResponse, setRowPerPage, setSelectedElement,
  showLoading, toggleBulkUpload, toggleFilter, togglePointsModal
} from "../../../redux/actions/DispatchActions";
import DispatchReducer, { DISPATCH_STATE } from "../../../redux/reducers/DispatchReducer";
import { getDispatchOrderList } from "../../../serviceActions/DispatchServiceActions";
import { dispatchMobileColumns, dispatchTableColumns, inboundChildrenTableColumns } from '../../../templates/DispatchTemplates';
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import DispatchFilters from '../DispatchFilters';

function DispatchListing() {
  const appDispatch = useDispatch();
  const history = useHistory();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(dispatchFilters);
  const [state = DISPATCH_STATE, dispatch] = useReducer(DispatchReducer, DISPATCH_STATE);

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {
        page: state.currentPage,
        pageSize: state.pageSize,
      }
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params)
      }

      // Remove extra query params pick from serach params
      if (queryParams && queryParams.queryFieldLabel) {
        delete queryParams["queryFieldLabel"]
      }
      dispatch(showLoading());
      appDispatch(getDispatchOrderList(queryParams)).then((response: any) => {
        dispatch(setResponse(response));
        dispatch(hideLoading());
      });
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);

  return (
    <div className="inbound-listing-wrapper">
      <div className="filter-wrap">
        <Filter
          pageTitle="Dispatch"
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
                menuTitle: uploadWaybillNoLabel,
                Icon: Publish,
                onClick: () => dispatch(toggleBulkUpload())
              },
            ]}
          />
        </Filter>
      </div>
      <BulkUploadDialog
        title={wayBillNoLabel}
        open={state.openBulkUpload}
        jobName={RegisterJobs.SHIPMENT_DISPATCH}
        onClose={() => {
          dispatch(toggleBulkUpload());
        }}
      />
      <DispatchFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        addQuickSearch={isMobile}
        pickUpFilters={true}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          //dispatch(setFilter(filterChips, filterParams));
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
        }} />

      {
        !isMobile &&
        <SearchFilter
          list={listDispatch}
          appliedFilters={filterState.params}
          onClickSearch={(params: any) => {
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
              tableColumns={dispatchMobileColumns(onClickGoOut, onClickLaneCode)}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
              childTableColumns={inboundChildrenTableColumns()}
              childElementKey='shipmentDetails'
            />
            :
            <TableCollapseList
              tableColumns={dispatchTableColumns(onClickGoOut, onClickLaneCode)}
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
              childrenColumns={inboundChildrenTableColumns()}
            />
        }
      </PageContainer>
    </div>
  );
  function onClickGoOut(element: any) {
    dispatch(setSelectedElement(element))
    history.push(GateOutUrl + element.freightOrderCode)
  }

  function onClickLaneCode(element: any) {
    dispatch(setSelectedElement(element))
    dispatch(togglePointsModal());
  }
}


export default DispatchListing;

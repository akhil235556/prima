import { Badge } from "@material-ui/core";
import { Publish, Tune } from "@material-ui/icons";
import React, { useEffect, useReducer } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { JobFileType, RegisterJobs, rowsPerPageOptions, trackRequestTab, trackRequestTabEnum } from "../../../base/constant/ArrayList";
import { emptyShipmentWarning, orderBulkFileTypes, shipmentUploadFile } from "../../../base/constant/MessageUtils";
import { OrderDetailsUrl, TrackRequestUrl } from "../../../base/constant/RoutePath";
import { useSearchParams } from "../../../base/hooks/useSearchParams";
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Chips from "../../../component/chips/Chips";
import FileAction from "../../../component/fileAction/FileAction";
import Filter from '../../../component/filter/Filter';
import PageContainer from '../../../component/pageContainer/PageContainer';
import Button from "../../../component/widgets/button/Button";
import ExpendableCardList from "../../../component/widgets/cardlist/ExpendableCardList";
import TableCollapseList from "../../../component/widgets/tableView/tableCollapseList/TableCollapseList";
import BulkUploadDialog from "../../../modals/BulkUploadDialog/BulkUploadDialog";
import { setAutoCompleteList } from "../../../moduleUtility/DataUtils";
import { orderListingFilters } from "../../../moduleUtility/FilterUtils";
import {
  hideLoading, refreshList, setCurrentPage,
  setResponse, setRowPerPage,
  setSelectedElement, showLoading, toggleBulkUpload, toggleFilter, toggleModal,
  togglePointsModal
} from '../../../redux/actions/OrderActions';
import OrderReducer, { ORDER_STATE } from '../../../redux/reducers/OrderReducer';
import { getOrderList, getShipmentTagList } from '../../../serviceActions/OrderServiceActions';
import { configPlacementDateTime, getConfigVehicleType, getCurrentVehicleType, getPlacementDateTime } from '../../../serviceActions/TrackRequestVehicleTypeServiceActions';
import { orderChildrenTableColumns, orderMobileTableColumns, orderTableColumns } from "../../../templates/PlanningTemplates";
import DispatchFilters from '../../dispatch/DispatchFilters';
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import OrderListingConfirmModal from "./OrderConfirmModal";
import "./OrderListing.css";



function OrderListing() {
  const appDispatch = useDispatch();
  const history = useHistory();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(orderListingFilters);
  const [state = ORDER_STATE, dispatch] = useReducer(OrderReducer, ORDER_STATE);
  const [countPendingRequest, setCountPendingRequest] = React.useState<any>("0");
  const [showTrackRequestButton, setShowTrackRequestButton] = React.useState<any>(false);
  const [shipmentTagList, setShipmentTagList] = React.useState<any>([]);
  const [fileType, setFileType] = React.useState<any>(JobFileType.STANDARD_FILE)
  const [isActivePlacementDateTime, setIsActivePlacementDateTime] = React.useState<boolean>(false);
  const [isActiveConfigVehicle, setIsActiveConfigVehicle] = React.useState<boolean>(false);

  const onFileTypeChange = (value: any) => {
    setFileType(value)
  }

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {
        page: state.currentPage,
        pageSize: state.pageSize,
      }
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      dispatch(showLoading());
      appDispatch(getOrderList(queryParams)).then((response: any) => {
        dispatch(setResponse(response));
        let promiseArray: any = [appDispatch(getConfigVehicleType()), appDispatch(configPlacementDateTime()), appDispatch(getShipmentTagList())]
        return Promise.all(promiseArray);
      }).then((response: any) => {
        const isActiveConfigVehicle = response[0] && response[0].data && response[0].data[0] && response[0].data[0].isActive;
        const isActivePlacementDateTime = response[1] && response[1].data && response[1].data[0] && response[1].data[0].isActive;
        if (Boolean(isActiveConfigVehicle) || Boolean(isActivePlacementDateTime)) {
          setShowTrackRequestButton(true);
          let countPendingTrackingRequestParams: any = {
            statusCode: trackRequestTabEnum.PENDING
          }
          let promiseArray: any;
          if (Boolean(isActiveConfigVehicle) && Boolean(isActivePlacementDateTime)) {
            setIsActiveConfigVehicle(true)
            setIsActivePlacementDateTime(true)
            promiseArray = [appDispatch(getCurrentVehicleType(countPendingTrackingRequestParams)), appDispatch(getPlacementDateTime(countPendingTrackingRequestParams))]
          } else if (isActiveConfigVehicle && !isActivePlacementDateTime) {
            setIsActiveConfigVehicle(true)
            promiseArray = [appDispatch(getCurrentVehicleType(countPendingTrackingRequestParams))]
          } else if (!isActiveConfigVehicle && isActivePlacementDateTime) {
            setIsActivePlacementDateTime(true)
            promiseArray = [appDispatch(getPlacementDateTime(countPendingTrackingRequestParams))]
          }
          Promise.all(promiseArray).then((response: any) => {
            if (response) {
              let placementCount: number;
              const vehicleCount = isActiveConfigVehicle && response[0] && response[0].pagination && response[0].pagination.count
              if (isActiveConfigVehicle === undefined || isActiveConfigVehicle === false) {
                placementCount = isActivePlacementDateTime && response[0] && response[0].pagination && response[0].pagination.count
              } else {
                placementCount = isActivePlacementDateTime && response[1] && response[1].pagination && response[1].pagination.count
              }

              if (vehicleCount && vehicleCount > 0 && placementCount && placementCount > 0) {
                setCountPendingRequest(vehicleCount + placementCount)
              } else if (vehicleCount && !placementCount) {
                setCountPendingRequest(vehicleCount)
              } else if (!vehicleCount && placementCount) {
                setCountPendingRequest(placementCount)
              } else {
                setCountPendingRequest('0')
              }
            } else {
              setShowTrackRequestButton(false)
            }
          })
        } else {
          setShowTrackRequestButton(false);
        }
        // if (response && response[0] && response[0].data && response[0].data[0] && response[0].data[0].isActive) {
        //   setShowTrackRequestButton(true);
        //   let countPendingTrackingRequestParams: any = {
        //     statusCode: trackRequestTabEnum.PENDING
        //   }
        //   appDispatch(getCurrentVehicleType(countPendingTrackingRequestParams)).then((response: any) => {
        //     if (response) {
        //       response.pagination && response.pagination.count && setCountPendingRequest(String(response.pagination.count))
        //     } else {
        //       setCountPendingRequest("0")
        //     }
        //   })
        // } else {
        //   setShowTrackRequestButton(false);
        // }
        if (response && response[2]) {
          setShipmentTagList(setAutoCompleteList(response[2], "tagName", "tagName"))
        } else {
          setShipmentTagList(undefined)
        }
        appDispatch(hideLoading());
      })
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refreshList, state.currentPage, state.pageSize, history.location.search]);


  return (
    <div className="order-listing-wrapper">
      <DispatchFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        showAssignVehicleFilter={true}
        pickUpFilters={true}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          dispatch(refreshList())
          dispatch(toggleFilter());
          addFiltersQueryParams(filterChips, filterParams)
        }}
        onClose={() => {
          dispatch(toggleFilter());
        }}
        isListingPage={true}
        shipmentTagList={shipmentTagList}
      />

      <OrderListingConfirmModal
        open={state.openModal}
        selectedElement={state.selectedItem}
        onSuccess={() => {
          dispatch(refreshList());
          dispatch(setSelectedElement(undefined));
          dispatch(toggleModal());
        }}
        onClose={() => {
          dispatch(setSelectedElement(undefined));
          dispatch(toggleModal());
        }}
      />
      <LanePointsDisplayModal
        open={state.openPointModal}
        laneCode={state.selectedItem && state.selectedItem.laneCode}
        onClose={() => {
          dispatch(setSelectedElement(undefined));
          dispatch(togglePointsModal());
        }} />
      <Filter
        pageTitle="Order Listing"
        buttonStyle="btn-orange"
        className="pt-10"
        buttonTitle={isMobile ? " " : "Filter"}
        leftIcon={<Tune />}
        onClick={() => {
          dispatch(toggleFilter());
        }}
      >
        {showTrackRequestButton && <Badge badgeContent={countPendingRequest} color="primary">
          <Button
            buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
            title={isMobile ? "" : "Track Request"}
            onClick={() => {
              let config: any;
              if (Boolean(isActiveConfigVehicle) && Boolean(isActivePlacementDateTime)) {
                config = "all";
              } else if (isActiveConfigVehicle && !isActivePlacementDateTime) {
                config = "vehicle";
              } else if (!isActiveConfigVehicle && isActivePlacementDateTime) {
                config = "placement";
              }
              history.push({
                pathname: `${TrackRequestUrl}${trackRequestTab[0]}`,
                search: "?config=" + config
              })
            }}
          />
        </Badge>}
        <FileAction
          disable={state.loading}
          options={[
            {
              menuTitle: shipmentUploadFile,
              Icon: Publish,
              onClick: () => dispatch(toggleBulkUpload())
            },
          ]}
        />
      </Filter>
      <BulkUploadDialog
        title=" Bulk Upload Shipment"
        open={state.openBulkUpload}
        jobName={JobFileType.STANDARD_FILE === fileType ? RegisterJobs.FREIGHT_SHIPMENTS : RegisterJobs.FREIGHT_SHIPMENTS_INTEGRATION}
        modalMessage={orderBulkFileTypes}
        acceptFiles={".csv,.xls,.xlsx"}
        downloadMessage={JobFileType.STANDARD_FILE === fileType ? "Download sample files" : " "}
        jobFileType={fileType}
        onJobFileTypeChange={onFileTypeChange}
        onClose={() => {
          dispatch(toggleBulkUpload());
        }}
      />

      <PageContainer
        loading={state.loading}
        listData={state.listData}
      >
        {!isObjectEmpty(filterState.chips) && Object.keys(filterState.chips).map((element: any, index: any) => (
          <Chips
            key={index}
            label={element === "isVehicleAssignedStatus" ? "Vehicle Assigned: " + filterState.chips[element] : filterState.chips[element]}
            onDelete={() => {
              dispatch(refreshList());
              if (element === "dispatchOrderCreatedAtFromTime" || element === "dispatchOrderCreatedAtToTime") {
                let secondKey = element === "dispatchOrderCreatedAtFromTime" ? "dispatchOrderCreatedAtToTime" : "dispatchOrderCreatedAtFromTime";
                removeFiltersQueryParams([element, secondKey])
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
              tableColumns={orderMobileTableColumns(onClickView, onClickLaneCode)}
              childTableColumns={orderChildrenTableColumns()}
              childElementKey='shipmentDetails'
              emptyChildMessage={emptyShipmentWarning}
              isNextPage={state.pagination && state.pagination.next}
              onReachEnd={() => {
                dispatch(setCurrentPage(state.pagination.next))
              }}
            />
            :
            <TableCollapseList
              tableColumns={orderTableColumns(onClickView, onClickLaneCode)}
              currentPage={state.currentPage}
              rowsPerPage={state.pageSize}
              rowsPerPageOptions={rowsPerPageOptions}
              totalCount={state.pagination && state.pagination.count}
              listData={state.listData}
              emptyChildMessage={emptyShipmentWarning}
              onChangePage={(event: any, page: number) => {
                dispatch(setCurrentPage(page));
              }}
              onChangeRowsPerPage={(event: any) => {
                dispatch(setRowPerPage(event.target.value))
              }}
              childElementKey='shipmentDetails'
              childrenColumns={orderChildrenTableColumns()}
            />
        }

      </PageContainer>
    </div>
  );

  function onClickView(element: any) {
    history.push({
      pathname: OrderDetailsUrl + element.freightOrderCode
    })
  }

  function onClickLaneCode(element: any) {
    dispatch(togglePointsModal());
    dispatch(setSelectedElement(element))
  }
}

export default OrderListing;

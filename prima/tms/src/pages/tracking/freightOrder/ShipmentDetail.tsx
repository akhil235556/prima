import { Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Autorenew, Info, KeyboardBackspace, Mail, Person, Send } from "@material-ui/icons";
import Numeral from "numeral";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  useHistory,
  useParams
} from 'react-router-dom';
import { laneZoneTitle } from "../../../base/constant/MessageUtils";
import { convertDateFormat, displayDateTimeFormatter } from "../../../base/utility/DateUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import DataNotFound from "../../../component/error/DataNotFound";
import Filter from "../../../component/filter/Filter";
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from "../../../component/widgets/button/Button";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomToolTip } from "../../../component/widgets/CustomToolTip";
import ShipmentStepper from "../../../component/widgets/ShipmentStepper";
import { InfoTooltip } from '../../../component/widgets/tooltip/InfoTooltip';
import { setAutoCompleteList } from "../../../moduleUtility/DataUtils";
import { showAlert } from "../../../redux/actions/AppActions";
import { getOrderLogList } from "../../../serviceActions/OrderServiceActions";
import { getOrderList, getShipmentStatus, getStatusLatest, getStatusList, syncStatus } from "../../../serviceActions/ShipmentServiceActions";
import { getMode } from "../../freight/order/OrderViewUtility";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import DetailSkeleton from './DetailSkeleton';
import "./ShipmentDetail.css";
import StatusUpdateModal from './StatusUpdateModal';

function ShipmentDetail() {
  const history = useHistory();
  const { id } = useParams<any>();
  const appDispatch = useDispatch();
  const [loading, setLoading] = React.useState<any>(false);
  const [loadingOrder, setLoadingOrder] = React.useState<any>(false);
  const [statusModal, openStatusModal] = React.useState<any>(false);
  const [laneModal, openLaneModal] = React.useState<any>(false);
  const [refresh, setRefresh] = React.useState(false);
  const [shipmentStatus, setShipmentStatus] = React.useState<any>([]);
  const [statusArray, setStatusArray] = React.useState<any>([]);
  const [latestStatus, setLatestStatus] = React.useState<any>({});
  const [modalContent, setModalContent] = React.useState<any>({});
  const [shipmentDetails, setShipmentDetails] = React.useState<any>({});
  const [orderDetails, setOrderDetails] = React.useState<any>({});
  const [orderLog, setOrderLog] = React.useState<any>({});

  useEffect(() => {
    const getList = async () => {
      setLoadingOrder(true);
      let promiseArray: any = [appDispatch(getOrderList({ freightShipmentCode: id })), appDispatch(getStatusList({}))]
      Promise.all(promiseArray).then((response: any) => {
        response[1] && setStatusArray(setAutoCompleteList(response[1], "description", "code"))
        if (response[0] && response[0].results && response[0].results[0]) {
          setShipmentDetails(response[0].results[0].shipmentDetails)
          setOrderDetails(response[0].results[0].orderDetails)
          return appDispatch(getOrderLogList({ freightOrderCode: response[0].results[0].orderDetails && response[0].results[0].orderDetails.freightOrderCode, actionName: "CANCELLED" }))
        }
        setLoadingOrder(false)
      }).then((response: any) => {
        response && setOrderLog(response);
        setLoadingOrder(false)
      })
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getStatus = async () => {
      setLoading(true);
      let promiseArray: any = [appDispatch(getShipmentStatus({ shipmentCode: id })), appDispatch(getStatusLatest({ shipmentCode: id }))]
      Promise.all(promiseArray).then((response: any) => {
        response[0] && response[0].milestones && setShipmentStatus(response[0].milestones);
        response[1] && setLatestStatus(response[1]);
        setLoading(false);
      })
    }
    getStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <div className="shipment-detail-wrapper">

      <Filter
        pageTitle={"Shipment"}
        buttonStyle={isMobile ? " btn-detail-mob" : "btn-detail"}
        buttonTitle={isMobile ? " " : "Back"}
        leftIcon={<KeyboardBackspace />}
        onClick={() => {
          history.goBack();
        }}
      />

      <LanePointsDisplayModal
        open={laneModal}
        laneCode={orderDetails.laneCode}
        onClose={() => {
          openLaneModal(false);
        }}
      />

      <StatusUpdateModal
        open={statusModal}
        selectedElement={modalContent}
        onSuccess={() => {
          setRefresh((prev) => !prev);
          openStatusModal(false);
        }}
        onClose={() => {
          openStatusModal(false)
        }}
      />

      <PageContainer>
        <div className="row">
          <div className="col-md-6">
            <div className="card-content-wrap">
              <Card>
                <div className="card-header">
                  <h4>Shipment Detail</h4>
                </div>
                {loadingOrder ?
                  <CardContentSkeleton
                    row={10}
                    column={1}
                  /> : <CardContent>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Order Code :</li>
                      <li className="col-6 col-md-8">{(orderDetails && orderDetails.freightOrderCode) || "NA"}</li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Shipment Code :</li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.freightShipmentCode) || "NA"}</li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Waybill Number :</li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.airwaybillNumber) || "NA"}</li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">LR Number :</li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.lrNumber) || "NA"}</li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Reference Id :</li>
                      <li className="col-6 col-md-8">{(orderDetails && orderDetails.referenceId) || "NA"}</li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Shipment Reference Id :</li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.shipmentRefId) || "NA"}</li>
                    </ul>

                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Volume (m³) : </li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.totalShipmentVolume && (Numeral(shipmentDetails.totalShipmentVolume).format('0,0.00') + " m³")) || "NA"}</li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Weight (Kg) :</li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.totalShipmentWeight && (Numeral(shipmentDetails.totalShipmentWeight).format('0,0.00') + " Kg")) || "NA"} </li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">{laneZoneTitle + " :"}</li>
                      <li className="col-6 col-md-8">
                        <div className="d-flex align-items-center">
                          {
                            (orderDetails?.originZoneName && orderDetails?.destinationZoneName) ? (orderDetails?.originZoneName + " -> " + orderDetails?.destinationZoneName) :
                              <span className="blue-text lane-text" onClick={() => { openLaneModal(true); }}>
                                <InfoTooltip
                                  title={(orderDetails && orderDetails.laneName) || "....."}
                                  placement={"top"}
                                  disableInMobile={"false"}
                                  infoText={(orderDetails && orderDetails.laneName) || "....."}
                                />
                              </span>
                          }
                        </div>
                      </li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Courier :</li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.partnerName) || "NA"}</li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Mode of Transport :</li>
                      <li className="col-6 col-md-8">{(orderDetails && orderDetails.serviceabilityModeCode && getMode(orderDetails.serviceabilityModeCode)) || "NA"} </li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Freight Type :</li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.freightTypeCode) || "NA"} </li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Placement Date :</li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.placementDatetime && convertDateFormat(shipmentDetails.placementDatetime, displayDateTimeFormatter)) || "NA"}</li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Expected Delivery Date :</li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.expectedDeliveryDatetime && convertDateFormat(shipmentDetails.expectedDeliveryDatetime, displayDateTimeFormatter)) || "NA"}</li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Vehicle Number :</li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.vehicleRegistrationNumber) || "NA"}</li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Vehicle Type :</li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.vehicleTypeName) || "NA"}</li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Driver Name :</li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.primaryDriverName) || "NA"}</li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Consignee :</li>
                      <li className="col-6 col-md-8">{(shipmentDetails && shipmentDetails.consigneeName) || "NA"}</li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Consignee Address :</li>
                      <li className="col-6 col-md-8">
                        <InfoTooltip
                          title={(shipmentDetails && shipmentDetails.consigneeAddress) || "NA"}
                          valueClassName="text-truncate"
                          disableInMobile={"false"}
                          infoText={(shipmentDetails && shipmentDetails.consigneeAddress) || "NA"}
                        />
                      </li>
                    </ul>
                    <ul className="row list-info align-items-center">
                      <li className="col-6 col-md-4">Status :</li>
                      <li className="col-6 col-md-8 orange-text">{(shipmentDetails && shipmentDetails.statusName) || "NA"}</li>
                    </ul>

                    {(orderLog[shipmentDetails.freightShipmentCode]
                      || orderLog[orderDetails.freightOrderCode]) &&
                      <>
                        <ul className="row list-info align-items-center">
                          <li className="col-6 col-md-4">Cancelled By :</li>
                          <CustomToolTip
                            title={
                              <div className="approved-list">
                                <List>
                                  <ListItem>
                                    <ListItemIcon>
                                      <Person />
                                    </ListItemIcon>
                                    <ListItemText>
                                      {
                                        getLogData("userName")
                                      }
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem>
                                    <ListItemIcon>
                                      <Mail />
                                    </ListItemIcon>
                                    <ListItemText>
                                      {
                                        getLogData("userEmail")
                                      }
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            }
                            disableInMobile={"false"}
                            placement="top">
                            <li>
                              <span className="orange-text">{(shipmentDetails.shipmentCancellationType || orderDetails.orderCancellationType) || "NA"}</span>
                              <Info style={{ width: "18px", height: "18px" }} className="blue-text info-icon ml-1" />
                            </li>
                          </CustomToolTip>
                        </ul>



                        <ul className="row list-info align-items-center">
                          <li className="col-6 col-md-4">Cancelled Remarks :</li>
                          <CustomToolTip
                            title={
                              getLogData("remarks")
                            }
                          >
                            <li className="col-6 col-md-8 text-truncate">
                              {
                                getLogData("remarks")
                              }
                            </li>
                          </CustomToolTip>

                        </ul>
                      </>
                    }
                  </CardContent>}
              </Card>
            </div>
          </div>
          <div className="col-md-6 shipment-status">
            <div className="card-content-wrap">
              <Card>
                <div className="card-header">
                  <h4>Shipment Status</h4>
                  <Button
                    buttonStyle="btn-orange mr-2"
                    title="Sync Status"
                    leftIcon={<Send />}
                    onClick={() => {
                      appDispatch(syncStatus({ freightShipmentCode: id })).then((response: any) => {
                        if (response) {
                          response.message && appDispatch(showAlert(response.message));
                          setRefresh((prev) => !prev);
                        }
                      })
                    }}
                  />
                  <Button
                    buttonStyle="btn-blue"
                    title="Status Update"
                    leftIcon={<Autorenew />}
                    onClick={() => {
                      openStatusModal(true)
                      setModalContent({
                        statusList: statusArray,
                        latest: latestStatus,
                        shipmentCode: shipmentDetails.freightShipmentCode
                      })
                    }}
                  />
                </div>
                <CardContent>
                  {
                    loading ?
                      <DetailSkeleton />
                      :
                      (shipmentStatus && shipmentStatus.length > 0 &&
                        <ShipmentStepper
                          steps={shipmentStatus}
                          eta={shipmentDetails && shipmentDetails.expectedDeliveryDatetime}
                          latestStatus={latestStatus}
                        />) ||
                      <DataNotFound
                        image="/images/location-not-found.png"
                        message="Shipment Data Not Available !"
                      />
                  }
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );

  function getLogData(getKey: any) {
    switch (getKey) {
      case "userName":
        if (orderLog[shipmentDetails.freightShipmentCode]) {
          return orderLog[shipmentDetails.freightShipmentCode].userName;
        } else {
          return orderLog[orderDetails.freightOrderCode].userName;
        }
      case "userEmail":
        if (orderLog[shipmentDetails.freightShipmentCode]) {
          return orderLog[shipmentDetails.freightShipmentCode].userEmail;
        } else {
          return orderLog[orderDetails.freightOrderCode].userEmail;
        }
      case "remarks":
        if (orderLog[shipmentDetails.freightShipmentCode]) {
          return (orderLog[shipmentDetails.freightShipmentCode].remarks || "NA");
        } else if (orderLog[orderDetails.freightOrderCode]) {
          return (orderLog[orderDetails.freightOrderCode].remarks || "NA");
        }
    }
  }

}

export default ShipmentDetail;

import { Card, CardContent, CardHeader } from "@material-ui/core";
import { KeyboardBackspace, LocalShipping } from "@material-ui/icons";
import AddBoxIcon from "@material-ui/icons/AddBox";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { FreightType, OrderStatus } from "../../../base/constant/ArrayList";
import {
  driverNameLabel,
  driverNumberLabel,
  freightTypeLabel,
  lanePriceLabel,
  laneZoneTitle,
  orderCodeLabel,
  orderCreationDateTime,
  referenceIdLabel,
  remarkLabel,
  transporterLabel,
  vehicleNumberLabel,
  VolumeLabel
} from "../../../base/constant/MessageUtils";
import {
  convertDateFormat,
  displayDateTimeFormatter
} from "../../../base/utility/DateUtils";
import { isNullValue } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import { LaneView } from "../../../component/CommonView";
import Filter from "../../../component/filter/Filter";
import Information from "../../../component/information/Information";
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from "../../../component/widgets/button/Button";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomToolTip } from "../../../component/widgets/CustomToolTip";
import { InfoTooltip } from "../../../component/widgets/tooltip/InfoTooltip";
import { groupBy } from "../../../moduleUtility/DataUtils";
import { showAlert } from "../../../redux/actions/AppActions";
import { getYmsNodeConfigStatus } from "../../../serviceActions/InplantServiceActions";
import { getOrderList } from "../../../serviceActions/OrderServiceActions";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import DispatchShipment from "../dispatchShipment/DispatchShipment";
import InvoiceShipmentModal from "../gateOut/InvoiceShipmentModal";
import DispatchShipmentModal from "./DispatchShipmentModal";
import "./GateOut.css";

function GateOut() {
  const appDispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams<any>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
  const [response, setResponse] = React.useState<any>({});
  const [shipmentDetails, setShipmentDetails] = React.useState<any>([]);
  const [selectedShipmentDetails, setSelectedShipmentDetails] =
    React.useState<any>([]);
  const [refresh, setReferesh] = React.useState<any>(false);
  const [openPlacementModal, setOpenPlacementModal] =
    React.useState<boolean>(false);
  const [openInvoiceModal, setopenInvoiceModal] =
    React.useState<boolean>(false);
  const eclipseLength = isMobile ? 6 : 28;
  useEffect(() => {
    const getList = async () => {
      setLoading(true);
      let queryParams: any = {
        freightOrderCode: id,
        shipmentStatusCode: OrderStatus.PLACED,
      };

      appDispatch(getOrderList(queryParams)).then((response: any) => {
        setResponse(
          (response && response.results && response.results[0]) || {}
        );
        let details =
          response &&
          response.results &&
          response.results[0] &&
          response.results[0].shipmentDetails &&
          groupBy(response.results[0].shipmentDetails, "gateInTogetherKey");

        setShipmentDetails(details);
        setLoading(false);
      });
    };
    id && getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <div className="order-detail-wrapper gate-in-wrap">
      <DispatchShipmentModal
        open={openPlacementModal}
        selectedElement={response}
        selectedShipmentDetails={selectedShipmentDetails}
        onSuccess={() => {
          setOpenPlacementModal(false);
          history.goBack();
        }}
        onClose={(apiSuccess: boolean = false) => {
          setOpenPlacementModal(false);
          if (apiSuccess) {
            history.goBack();
          }
          //TODO Need to review
        }}
      />
      <InvoiceShipmentModal
        open={openInvoiceModal}
        selectedShipmentDetails={selectedShipmentDetails}
        onSuccess={() => {
          setopenInvoiceModal(false);
          setReferesh((prev: any) => !prev)
          //history.goBack();
        }}
        onClose={() => {
          setopenInvoiceModal(false);
          //TODO Need to review
          //history.goBack();
        }}
      />
      <LanePointsDisplayModal
        open={openPointModal}
        laneCode={response && response.laneCode}
        onClose={() => {
          setOpenPointModal(false);
        }}
      />
      <div className="filter-wrap">
        <Filter
          pageTitle={"Dispatch"}
          buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
          buttonTitle={isMobile ? " " : "Back"}
          leftIcon={<KeyboardBackspace />}
          onClick={() => {
            history.goBack();
          }}
        />
      </div>
      <PageContainer>
        <Card className="creat-contract-wrapp creat-wrapp">
          <CardHeader className="creat-contract-header" title="Order Detail" />
          {loading ? (
            <CardContentSkeleton row={3} column={3} />
          ) : (
            <CardContent className="creat-contract-content">
              <div className="custom-form-row row">
                <div className="col-md-3 billing-group col-6">
                  <Information
                    title={orderCodeLabel}
                    text={response.freightOrderCode}
                  />
                </div>
                <div className="col-md-3 billing-group col-6">
                  <Information
                    title={freightTypeLabel}
                    text={response.freightTypeCode}
                  />
                </div>
                <div className="col-md-3 billing-group col-6">
                  <Information
                    title={laneZoneTitle}
                    text={(response?.originZoneName && response?.destinationZoneName) && (response?.originZoneName + " -> " + response?.destinationZoneName)}
                    customView={response?.laneName && <LaneView element={response} onClickLaneCode={(data: any) => { setOpenPointModal(true); }} />}
                  />
                </div>
                <div className="col-md-3 billing-group col-6">
                  <Information
                    title={transporterLabel}
                    text={response.partnerName}
                  />
                </div>
                <div className="col-md-3 billing-group col-6">
                  <Information
                    title={referenceIdLabel}
                    text={response.referenceId}
                  />
                </div>
                <div className="col-md-3 billing-group col-6">
                  <Information
                    title={lanePriceLabel}
                    text={response.lanePrice}
                  />
                </div>
                <div className="col-md-3 billing-group col-6">
                  <Information
                    title={VolumeLabel}
                    text={response.totalOrderVolume || response.totalVolumeDemand}
                    tooltip={() => (response.freightTypeCode === FreightType.FTL &&
                      <InfoTooltip
                        utilizationValue={response.volumeUtilisation ? response.volumeUtilisation : (response.totalOrderVolume || response.totalVolumeDemand) && "0"}
                        utilizationTooltip
                        title={"Volume Utilized"}
                        placement="bottom"
                        disableInMobile={"false"}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 billing-group col-6">
                  <Information
                    title={"Weight (kg)"}
                    text={response.totalOrderWeight || response.totalWeightDemand}
                    tooltip={() => (response.freightTypeCode === FreightType.FTL &&
                      <InfoTooltip
                        utilizationValue={response.weightUtilisation ? response.weightUtilisation : (response.totalOrderWeight || response.totalWeightDemand) && "0"}
                        utilizationTooltip
                        title={"Weight Utilized"}
                        placement="bottom"
                        disableInMobile={"false"}
                      />
                    )}
                  />
                </div>
                {response?.freightTypeCode === FreightType.FTL &&
                  <>
                    <div className="col-md-3 billing-group col-6 vehicle_list">
                      <Information
                        title={vehicleNumberLabel}
                        text={response?.vehicleRegistrationNumber}
                      />
                    </div>
                    <div className="col-md-3 billing-group col-6">
                      <Information
                        title={driverNameLabel}
                        text={response?.primaryDriverName}
                        customView={
                          response?.primaryDriverName &&
                          <InfoTooltip
                            title={response?.primaryDriverName || ""}
                            placement="top"
                            disableInMobile={"false"}
                            infoText={response?.primaryDriverName || "NA"}
                          />
                        }
                      />
                    </div>
                    <div className="col-md-3 billing-group col-6">
                      <Information
                        title={driverNumberLabel}
                        text={response?.primaryDriverNumber}
                      />
                    </div>
                  </>}
                <div className="col-md-3 billing-group col-6">
                  <Information
                    title={orderCreationDateTime}
                    text={
                      response.createdAt &&
                      convertDateFormat(
                        response.createdAt,
                        displayDateTimeFormatter
                      )
                    }
                  />
                </div>
                <div className="col-md-3 billing-group col-6">
                  <Information
                    title={"Order Status"}
                    valueClassName="orange-text"
                    text={response.statusName}
                  />
                </div>
                <div className="labelWidth col-md-3 billing-group col-6">
                  <Information
                    title={remarkLabel}
                    customView={
                      <div className="d-flex ">
                        <p>{response.orderRemarks || "NA"}</p>
                        {response.orderRemarks &&
                          response.orderRemarks.length >= eclipseLength && (
                            <CustomToolTip
                              title={response.orderRemarks}
                              placement={"top"}
                              disableInMobile={"false"}
                            >
                              <span className="blue-text">more</span>
                            </CustomToolTip>
                          )}
                      </div>
                    }
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
        {shipmentDetails &&
          Object.keys(shipmentDetails).map((element: any, index: number) => (
            <Card key={index} className="creat-contract-wrapp creat-wrapp">
              <div className="billing-info-header">
                <h4>Shipment Detail</h4>
                <div className="btn-container--end">
                  <Button
                    buttonStyle="view-pod-btn btn-orange"
                    title="Invoice"
                    loading={loading}
                    leftIcon={<AddBoxIcon />}
                    onClick={() => {
                      setSelectedShipmentDetails(shipmentDetails[element]);
                      setopenInvoiceModal(true);
                    }}
                  />
                  <Button
                    buttonStyle="view-pod-btn btn-blue"
                    title="Dispatch"
                    loading={loading}
                    leftIcon={<LocalShipping />}
                    onClick={async () => {
                      setLoading(true);
                      let nodeCodes: any = [];
                      // eslint-disable-next-line
                      response &&
                        response.shipmentDetails &&
                        response.shipmentDetails.forEach((item: any) => {
                          if (!nodeCodes.includes(item.originLocationCode)) {
                            nodeCodes.push(item.originLocationCode);
                          }
                        });
                      let ymsEnabledStatusParams = {
                        nodeCode: nodeCodes,
                      };
                      const ymsNodeConfigResponse = await appDispatch(
                        getYmsNodeConfigStatus(ymsEnabledStatusParams)
                      );
                      if (
                        ymsNodeConfigResponse &&
                        ymsNodeConfigResponse.code === 200
                      ) {
                        if (!isNullValue(ymsNodeConfigResponse.details)) {
                          appDispatch(
                            showAlert(
                              "Action is not allowed, please proceed through YMS",
                              false
                            )
                          );
                          setLoading(false);
                          return;
                        }
                      } else {
                        appDispatch(
                          showAlert(
                            "Something went wrong. Please try again",
                            false
                          )
                        );
                        setLoading(false);
                        return;
                      }
                      setLoading(false);
                      setSelectedShipmentDetails(shipmentDetails[element]);
                      setOpenPlacementModal(true);
                    }}
                  />
                </div>
              </div>
              {loading ? (
                <CardContentSkeleton row={3} column={3} />
              ) : (
                <CardContent className="creat-contract-content">
                  {shipmentDetails[element] &&
                    shipmentDetails[element].map((element: any, index: any) => (
                      <DispatchShipment
                        key={index}
                        response={response}
                        element={element}
                      />
                    ))}
                </CardContent>
              )}
            </Card>
          ))}
      </PageContainer>
    </div>
  );
}
export default GateOut;

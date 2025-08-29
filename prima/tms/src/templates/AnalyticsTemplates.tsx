// import { commaSeparatedNumbers } from "../base/utility/StringUtils";
import { Info } from "@material-ui/icons";
import Numeral from "numeral";
import React from "react";
import { vehiclePlacementStatus } from "../base/constant/ArrayList";
import { destinationLabel, utilizationToolTipTitle, VolumeLabel, volumeUtilizationLabel, weightUtilizationLabel } from "../base/constant/MessageUtils";
import {
  convertDateFormat,
  displayDateTimeFormatter
} from "../base/utility/DateUtils";
import { convertAmountToNumberFormat, floatFormatter } from "../base/utility/NumberUtils";
import { LaneView } from "../component/CommonView";
import { CustomToolTipIndent } from "../component/widgets/CustomToolTipIndent";
import { InfoTooltip } from "../component/widgets/tooltip/InfoTooltip";
import { ColumnStateModel } from "../Interfaces/AppInterfaces";


export const inTransitEfficiencyTableColumns = (onClickLaneCode: any) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightOrderCode",
      label: "Order Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightShipmentCode",
      label: "Shipment Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "pickupLocationName",
      label: "Pickup Location",
      format: (value: any) => value || "NA",
    },
    {
      id: "dropLocationName",
      label: "Drop Location",
      format: (value: any) => value || "NA",
    },
    {
      id: "destinationLocationName",
      label: destinationLabel,
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightTypeCode",
      label: "Freight Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "vehicleType",
      label: "Vehicle Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "lane",
      label: "Lane",
      format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => (
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        />
      ),
    },
    {
      id: "vehicleRegistrationNumber",
      label: "Vehicle Number",
      format: (value: any) => value || "NA",
    },
    {
      id: "designedTat",
      label: "Designed TAT(hr)",
      format: (value: any) => value || "NA",
    },
    {
      id: "actualTat",
      label: "Actual TAT(hr)",
      format: (value: any) => value || "NA",
    },
    {
      id: "statusName",
      label: "Status",
      format: (value: any) => value || "NA",
    },
    {
      id: "createdAt",
      label: "Created At",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
  ];
  return columnList;
};

export const onTimeDispatchTableColumns = (onClickLaneCode: any) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightOrderCode",
      label: "Order Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightShipmentCode",
      label: "Shipment Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "pickupLocationName",
      label: "Pickup Location",
      format: (value: any) => value || "NA",
    },
    {
      id: "dropLocationName",
      label: "Drop Location",
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "originLocationName",
      label: "Location",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightTypeCode",
      label: "Freight Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "vehicleType",
      label: "Vehicle Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "lane",
      label: "Lane",
      format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => (
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        />
      ),
    },
    {
      id: "vehicleRegistrationNumber",
      label: "Vehicle Number",
      format: (value: any) => value || "NA",
    },
    {
      id: "tat",
      label: "Dispatched (hr)",
      format: (value: any) => value || "0",
    },
    {
      id: "createdAt",
      label: "Created At",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
  ];
  return columnList;
};

export const placementEfficiencyTableColumns = (onClickLaneCode: any) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightOrderCode",
      label: "Order Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightShipmentCode",
      label: "Shipment Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "pickupLocationName",
      label: "Pickup Location",
      format: (value: any) => value || "NA",
    },
    {
      id: "dropLocationName",
      label: "Drop Location",
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightTypeCode",
      label: "Freight Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "vehicleType",
      label: "Vehicle Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "lane",
      label: "Lane",
      format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => (
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        />
      ),
    },
    {
      id: "vehicleRegistrationNumber",
      label: "Vehicle Number",
      format: (value: any) => value || "NA",
    },
    {
      id: "statusName",
      label: "Status",
      format: (value: any) => value || "NA",
      customView: (element: any) => (
        <>
          <div className="remarks-tooltip">
            <span className="text-truncate ">
              {element && element.statusName}
            </span>
            {element && element.statusName === "CANCELLED" ? (
              <>
                <InfoTooltip
                  style={{
                    tooltip: {
                      minWidth: 250,
                      maxWidth: 300,
                      overflow: "visible",
                      margin: 5,
                      padding: 12,
                    },
                  }}
                  className="remarks-tooltip-list"
                  disableInMobile={"false"}
                  title={
                    <>
                      <ul>
                        <li>
                          <span>Cancelled By: </span>
                        </li>
                        <li>{element.cancelledBy}</li>
                      </ul>
                      <ul>
                        <li>
                          <span>Remarks: </span>
                        </li>
                        <li>{element.remarks}</li>
                      </ul>
                    </>
                  }
                // placement="bottom"
                ></InfoTooltip>
              </>
            ) : (
              " "
            )}
          </div>
        </>
      ),
    },
    {
      id: "createdAt",
      label: "Created At",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
  ];
  return columnList;
};

export const vehiclePlacementTableColumns = (onClickLaneCode: any) => {
  const columnList: ColumnStateModel[] = [
    { id: 'freightOrderCode', label: 'Order Code', format: (value: any) => value || "NA" },
    { id: 'freightShipmentCode', label: 'Shipment Code', format: (value: any) => value || "NA" },
    { id: 'pickupLocationName', label: 'Pickup Location', format: (value: any) => value || "NA" },
    { id: 'dropLocationName', label: 'Drop Location', format: (value: any) => value || "NA" },
    { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
    { id: 'placementDatetime', label: 'Placement Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
    { id: 'vehiclePlacedAt', label: 'Vehicle Placed At', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
    { id: 'vehicleStatus', label: 'Status', format: (value: any) => value || "NA" },
    {
      id: 'placementLeadTime', label: 'Placement Lead time (in hr)', format: (value: any) => (value > 0 ? value : "NA"),
      customView: (element: any) => {
        return (element &&
          <div className={element.vehicleStatus === vehiclePlacementStatus.ON_TIME ? "green-text" : "red-text"}>
            {element.placementLeadTime}
          </div>
        )
      }
    },
    { id: 'assignmentLeadTime', label: 'Assignment Lead time (in hr)', format: (value: any) => (value > 0 ? value : "NA") },
    { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
    { id: 'vehicleType', label: 'Vehicle Type', format: (value: any) => value || "NA" },
    {
      id: 'lane', label: 'Lane', format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
    },
    { id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
    { id: 'createdAt', label: 'Created At', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
  ];
  return columnList;
};

export const detentionTableColumns = (onClickLaneCode: any) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightOrderCode",
      label: "Order Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightShipmentCode",
      label: "Shipment Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "pickupLocationName",
      label: "Pickup Location",
      format: (value: any) => value || "NA",
    },
    {
      id: "dropLocationName",
      label: "Drop Location",
      format: (value: any) => value || "NA",
    },
    {
      id: "destinationLocationName",
      label: destinationLabel,
      format: (value: any) => value || "NA",
    },
    {
      id: "freightTypeCode",
      label: "Freight Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "vehicleType",
      label: "Vehicle Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "lane",
      label: "Lane",
      format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => (
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        />
      ),
    },
    {
      id: "vehicleRegistrationNumber",
      label: "Vehicle Number",
      format: (value: any) => value || "NA",
    },
    {
      id: "destinationGateInTime",
      label: "Reporting Date and Time",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    {
      id: "tat",
      label: "Detention (hr)",
      format: (value: any) => value || "0",
    },
  ];
  return columnList;
};

export const shortageDamageTableColumns = (onClickLaneCode: any) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightOrderCode",
      label: "Order Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightShipmentCode",
      label: "Shipment Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "pickupLocationName",
      label: "Pickup Location",
      format: (value: any) => value || "NA",
    },
    {
      id: "dropLocationName",
      label: "Drop Location",
      format: (value: any) => value || "NA",
    },
    {
      id: "destinationLocationName",
      label: destinationLabel,
      format: (value: any) => value || "NA",
    },
    {
      id: "freightTypeCode",
      label: "Freight Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "vehicleType",
      label: "Vehicle Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "lane",
      label: "Lane",
      format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => (
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        />
      ),
    },
    {
      id: "vehicleRegistrationNumber",
      label: "Vehicle Number",
      format: (value: any) => value || "NA",
    },
    {
      id: "shortageCharges",
      label: "Shortage Charges",
      format: (value: any) => value || "0.00",
      customView: (element: any) => {
        return (
          (element && (
            <span className="lane-item">
              <img className="mr-1" src="/images/rupee.svg" alt="" />{" "}
              {(element.shortageCharge &&
                Numeral(element.shortageCharge).format("0,0.00")) ||
                "0.00"}
            </span>
          )) ||
          "NA"
        );
      },
    },
    {
      id: "damageCharges",
      label: "Damage Charges",
      format: (value: any) => value || "0.00",
      customView: (element: any) => {
        return (
          (element && (
            <span className="lane-item">
              <img className="mr-1" src="/images/rupee.svg" alt="" />{" "}
              {(element.damageCharge &&
                Numeral(element.damageCharge).format("0,0.00")) ||
                "0.00"}
            </span>
          )) ||
          "NA"
        );
      },
    },
    {
      id: "destinationGateInTime",
      label: "Deliver Date and Time",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    {
      id: "createdAt",
      label: "Created At",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
  ];
  return columnList;
};

export const loadabilityReportTableColumns = (onClickLaneCode: any) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightOrderCode",
      label: "Order Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightShipmentCode",
      label: "Shipment Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "pickupLocationName",
      label: "Pickup Location",
      format: (value: any) => value || "NA",
    },
    {
      id: "dropLocationName",
      label: "Drop Location",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightTypeCode",
      label: "Freight Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "vehicleType",
      label: "Vehicle Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "lane",
      label: "Lane",
      format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => (
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        />
      ),
    },
    {
      id: "vehicleRegistrationNumber",
      label: "Vehicle Number",
      format: (value: any) => value || "NA",
    },
    {
      id: "shipmentVolume",
      label: VolumeLabel,
      format: (value: any) => (value && value.toFixed(3)) || "NA",
    },
    {
      id: "shipmentWeight",
      label: "Weight (Kg)",
      format: (value: any) => (value && value.toFixed(3)) || "NA",
    },
    {
      id: "originGateInTime",
      label: "Gate In Date and Time",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    {
      id: "originGateOutTime",
      label: "Gate Out Date and Time",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    {
      id: "createdAt",
      label: "Created At",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
  ];
  return columnList;
};

export const monthlyFreightTableColumns = (onClickLaneCode: any) => {
  const columnList: ColumnStateModel[] = [
    { id: 'freightOrderCode', label: 'Order Code', format: (value: any) => value || "NA" },
    { id: 'freightShipmentCode', label: 'Shipment Code', format: (value: any) => value || "NA" },
    {
      id: "shipmentReferenceId",
      label: "Shipment Reference ID",
      format: (value: any) => value || "NA",
    },
    { id: 'contractExists', label: 'Contract Exists', format: (value: any) => value === "True" ? "Yes" : "No" },
    { id: 'pickupLocationName', label: 'Pickup Location', format: (value: any) => value || "NA" },
    { id: 'dropLocationName', label: 'Drop Location', format: (value: any) => value || "NA" },
    { id: 'statusName', label: 'Order Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
    { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
    { id: 'consigneeName', label: 'Consignee Name', format: (value: any) => value || "NA" },
    {
      id: "orderCreatedAt", label: "Order created at", format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    { id: "vehicleAssignedAt", label: "Vehicle assigned at", format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA", },
    {
      id: "orderPlacedAt", label: "Order placed at", format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    {
      id: "dispatchedAt",
      label: "Dispatched at",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    {
      id: "reportedAt",
      label: "Reported at",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    {
      id: "deliveredAt",
      label: "Delivered at",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    {
      id: 'lane', label: 'Lane', format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
    },
    { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
    { id: 'vehicleType', label: 'Vehicle Type', format: (value: any) => value || "NA" },
    { id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
    { id: 'waybillNumber', label: 'Waybill Number', format: (value: any) => value || "NA" },
    { id: 'lrNumber', label: 'LR Number', format: (value: any) => value || "NA" },
    { id: 'shipmentVolume', label: VolumeLabel, format: (value: any) => (value && value.toFixed(3)) || "NA" },
    {
      id: 'volumeUtilisation', label: 'Volume Utilization',
      customHead: () =>
        <>
          <span>{volumeUtilizationLabel}</span>
          <InfoTooltip
            placement={"top"}
            title={utilizationToolTipTitle}
            customIcon={<Info className="blue-text label-tooltip" />} />
        </>
      , format: (value: any) => value || "NA"
    },
    { id: 'shipmentWeight', label: 'Weight (Kg)', format: (value: any) => (value && value.toFixed(3)) || "NA" },
    {
      id: 'weightUtilisation', label: 'Weight Utilization',
      customHead: () =>
        <>
          <span>{weightUtilizationLabel}</span>
          <InfoTooltip
            placement={"top"}
            title={utilizationToolTipTitle}
            customIcon={<Info className="blue-text label-tooltip" />} />
        </>
      , format: (value: any) => value || "NA"
    },
    { id: 'totalKm', label: 'Kilometer', format: (value: any) => (value && value.toFixed(3)) || "NA" },
    {
      id: 'freightRate', label: 'Freight Rate', format: (value: any) => value || "NA",
      customView: (element: any) => {
        return ((element &&
          <span>
            <img className="mr-1" src="/images/rupee-black.svg" alt="" /> {(element.freightRate && Numeral(element.freightRate).format('0,0.00')) || "0.00"}
          </span>
        ) || "NA")
      }
    },

  ]
  return columnList;
};


export const freightPaymentTableColumns = (onClickLaneCode: any) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "billNo",
      label: "Invoice No.",
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "laneDisplayName",
      label: "Lane Code",
      format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => (
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        />
      ),
    },
    {
      id: "createdAt",
      label: "Created At",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    {
      id: "billPaidDate",
      label: "Paid At",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
    {
      id: "amount",
      label: "Total Amount",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        return (
          (element && (
            <span>
              <img className="mr-1" src="/images/rupee-black.svg" alt="" />{" "}
              {(element.amount && Numeral(element.amount).format("0,0.00")) ||
                "0.00"}
            </span>
          )) ||
          "NA"
        );
      },
    },
    {
      id: "status",
      label: "Status",
      format: (value: any) => value || "NA",
      class: () => "orange-text",
    },
  ];
  return columnList;
};

export const freightContributionTableColumns = (onClickLaneCode: any) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "laneDisplayName",
      label: "Lane",
      format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => (
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        />
      ),
    },
    {
      id: "freightTypeCode",
      label: "Freight Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "vehicleType",
      label: "Vehicle Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "vehicleCount",
      label: "Freight Order Contribution",
      format: (value: any) => value || "NA",
    },
    {
      id: "createdAt",
      label: "Created At",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
  ];
  return columnList;
};

export const volumeWeightContributionTableColumns = (onClickLaneCode: any) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "laneDisplayName",
      label: "Lane",
      format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => (
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        />
      ),
    },
    {
      id: "freightTypeCode",
      label: "Freight Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "vehicleType",
      label: "Vehicle Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "shipmentVolume",
      label: VolumeLabel,
      format: (value: any) => (value && value.toFixed(3)) || "NA",
    },
    {
      id: "shipmentWeight",
      label: "Weight (Kg)",
      format: (value: any) => (value && value.toFixed(3)) || "NA",
    },
    {
      id: "createdAt",
      label: "Created At",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
  ];
  return columnList;
};

export const vehicleContributionTableColumns = (onClickLaneCode: any) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "laneDisplayName",
      label: "Lane",
      format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => (
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        />
      ),
    },
    {
      id: "freightTypeCode",
      label: "Freight Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "vehicleType",
      label: "Vehicle Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "vehicleCount",
      label: "No. Of Vehicle Contribution",
      format: (value: any) => value || "NA",
    },
    {
      id: "createdAt",
      label: "Created At",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
  ];
  return columnList;
};

export const deliveryReportTableColumns = () => {
  const columnList: ColumnStateModel[] = [
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "pickedUp",
      label: "Picked Up",
      format: (value: any) => value || "0",
    },
    {
      id: "inTransit",
      label: "In Transit",
      format: (value: any) => value || "0",
    },
    {
      id: "yetToPicked",
      label: "Yet To Pick",
      format: (value: any) => value || "0",
    },
    {
      id: "outForDelivery",
      label: "Out For Delivery",
      format: (value: any) => value || "0",
    },
    {
      id: "delivered",
      label: "Delivered",
      format: (value: any) => value || "0",
    },
    {
      id: "undelivered",
      label: "Undelivered",
      format: (value: any) => value || "0",
    },
    { id: "returned", label: "Returned", format: (value: any) => value || "0" },
  ];
  return columnList;
};

export const shipmentReportTableColumns = () => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightOrderCode",
      label: "Order Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightShipmentCode",
      label: "Shipment Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "consigneeName",
      label: "Consignee",
      format: (value: any) => value || "NA",
    },
    {
      id: "airwaybillNumber",
      label: "Waybill Number",
      format: (value: any) => value || "NA",
    },
    {
      id: "lrNumber",
      label: "ELR Number",
      format: (value: any) => value || "NA",
    },
    {
      id: "shortageCharge",
      label: "Shortage Charges",
      format: (value: any) => value || "0",
      customView: (element: any) => {
        return (
          (element && (
            <span>
              <img className="mr-1" src="/images/rupee-black.svg" alt="" />{" "}
              {(element.shortageCharge &&
                Numeral(element.shortageCharge).format("0,0.00")) ||
                "0.00"}
            </span>
          )) ||
          "NA"
        );
      },
    },
    {
      id: "damageCharge",
      label: "Damage Charges",
      format: (value: any) => value || "0",
      customView: (element: any) => {
        return (
          (element && (
            <span>
              <img className="mr-1" src="/images/rupee-black.svg" alt="" />{" "}
              {(element.damageCharge &&
                Numeral(element.damageCharge).format("0,0.00")) ||
                "0.00"}
            </span>
          )) ||
          "NA"
        );
      },
    },
    {
      id: "podUploaded",
      label: "POD Uploaded",
      format: (value: any) => (value ? "Yes" : "No"),
    },
    {
      id: "courierStatus",
      label: "Courier Status",
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerName",
      label: "Courier Name",
      format: (value: any) => value || "NA",
    },
  ];
  return columnList;
};

export const forwardTrackingTableColumns = (onClickLaneCode: any) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightOrderCode",
      label: "Order Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightShipmentCode",
      label: "Shipment Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "vehicleType",
      label: "Vehicle Type",
      format: (value: any) => value || "NA",
    },

    {
      id: "vehicleNumber",
      label: "Vehicle Number",
      format: (value: any) => value || "NA",
    },

    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },

    {
      id: "pickupLocationName",
      label: "Pickup Location",
      format: (value: any) => value || "NA",
    },

    {
      id: "dropLocationName",
      label: "Drop Location",
      format: (value: any) => value || "NA",
    },

    {
      id: "laneDisplayName",
      label: "Lane",
      format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => (
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        />
      ),
    },

    {
      id: "vehicleAssignmentTat",
      label: "TAT of Vehicle assignment(hr)",
      format: (value: any) => value || "NA",
    },

    {
      id: "designedPickupTat",
      label: "Designed Pickup TAT(hr)",
      format: (value: any) => value || "NA",
    },

    {
      id: "actualTat",
      label: "Actual TAT for Order pickup (hr)",
      format: (value: any) => value || "NA",
    },

    {
      id: "tatDifference",
      label: "TAT Difference(hr)",
      format: (value: any) => value || "NA",
    },

    {
      id: "orderCreatedTime",
      label: "Created At",
      format: (value: any) =>
        (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA",
    },
  ];

  return columnList;
};


export const sobReportTableColumns = () => {
  const columnList: ColumnStateModel[] = [
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    }, {
      id: "totalPartnerLaneSobOrders",
      label: "Total Lane Order",
      format: (value: any) => value || "NA",
    }, {
      id: "partnerAcceptedOrders",
      label: "Fulfilled/Assigned Order",
      format: (value: any) => value || "NA",
      customView: (element: any) => (
        (element.partnerAcceptedOrders && element.partnerTotalOrders) ? <div>{element.partnerAcceptedOrders + "/" + element.partnerTotalOrders}</div> : "NA"
      ),
    }, {
      id: "fulfillmentPercentage",
      label: "Fulfillment %",
      format: (value: any) => value || "NA",
    },
    {
      id: "contributionPercentage",
      label: "Contribution %",
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerCancelledOrders",
      label: "Cancelled Order",
      format: (value: any) => value || "NA",
    },
  ]
  return columnList;
}


export const sobReportChildrenTableColumns = (onClickLaneCode: Function) => {
  const columnList: ColumnStateModel[] = [
    {
      id: 'lane', label: 'Lane', format: (value: any) => (value && value.displayName) || "NA",
      customView: (element: any) => <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
    }, {
      id: "vehicleTypeName",
      label: "Vehicle Type",
      format: (value: any) => value || "NA",
    }, {
      id: "freightTypeCode",
      label: "Freight Type",
      format: (value: any) => value || "NA",
    }, {
      id: "allocationPercentage",
      label: "SOB %",
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerLaneSobOrders",
      label: "Lane Order",
      format: (value: any) => value || "NA",
    },
    {
      id: "laneAcceptedOrderCount",
      label: "Fulfilled/Assigned Order",
      format: (value: any) => value || "NA",
      customView: (element: any) => (
        (element.partnerAcceptedOrderCount && element.partnerTotalOrderCount) ? <div>{element.partnerAcceptedOrderCount + "/" + element.partnerTotalOrderCount}</div> : "NA"
      ),
    },
    {
      id: "sobContributionPercentage",
      label: "Contribution %",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        return (element &&
          element.sobBreachPercentage ?
          <CustomToolTipIndent
            title={
              <div className="sob-tool-tip">
                SOB Breach: <span>{(element.sobBreachPercentage && (convertAmountToNumberFormat(element.sobBreachPercentage, floatFormatter) + " %"))}</span>
              </div>
            }
            arrow={true}
          >
            <span className="contribution-count">
              {((element.sobContributionPercentage && convertAmountToNumberFormat(element.sobContributionPercentage, floatFormatter)) || "0.00")}
            </span>
          </CustomToolTipIndent>
          :
          <span className="contribution-count">
            {((element.sobContributionPercentage && convertAmountToNumberFormat(element.sobContributionPercentage, floatFormatter)) || "0.00")}
          </span>
        )
      }
    },
  ]
  return columnList;
}

export const ShareOfBusinessModalListTableColumn = () => {
  const columnList: ColumnStateModel[] = [
    { id: 'partnerName', label: 'Transpoter', format: (value: any) => value || "NA" },
    { id: 'level', label: 'Level', format: (value: any) => value || "NA" },
    { id: 'allocationPercentage', label: 'Contribution %', format: (value: any) => value || "NA" },
  ]
  return columnList;
};
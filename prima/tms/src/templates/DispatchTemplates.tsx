import { ArrowForward, LocalShipping } from "@material-ui/icons";
import React from "react";
import { invoiceNumberLabel, laneZoneTitle } from "../base/constant/MessageUtils";
import {
  convertDateFormat,
  displayDateTimeFormatter
} from "../base/utility/DateUtils";
import { LaneView } from "../component/CommonView";
import EditText from "../component/widgets/EditText";
import { InfoTooltip } from "../component/widgets/tooltip/InfoTooltip";
import { ColumnStateModel } from "../Interfaces/AppInterfaces";

export const inboundTableColumns = (
  onClickViewButton: Function,
  onClickLaneCode: Function
) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightOrderCode",
      label: "Order Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightTypeCode",
      label: "Freight Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "lane",
      label: laneZoneTitle,
      format: (value: any) => value || "NA",
      customView: (element: any) => ((element?.originZoneName && element.destinationZoneName) ? (element?.originZoneName + " -> " + element.destinationZoneName) : element?.laneName ?
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        /> : "NA"
      ),
    },
    // { id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
    {
      id: "createdAt",
      label: "Order Date and Time",
      format: (value: any) =>
        convertDateFormat(value, displayDateTimeFormatter) || "NA",
    },
    {
      id: "statusName",
      label: "Status",
      format: (value: any) => value || "NA",
      class: () => "orange-text",
    },
    {
      id: "gate-in",
      label: "Action",
      buttonLabel: "Gate In",
      type: "action",
      leftIcon: <ArrowForward />,
      onClickActionButton: onClickViewButton,
      class: () => "btn-detail btn-sm",
    },
  ];
  return columnList;
};

export const inboundChildrenTableColumns = (inboundListingPage?: boolean) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightShipmentCode",
      label: "Shipment Code",
      format: (value: any) => value || "NA"
    },
    {
      id: "pickupLocationName",
      label: "Pickup Point",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        let key = "pickupLocationName";
        return (
          <InfoTooltip
            title={element[key] || "....."}
            placement={"top"}
            disableInMobile={"false"}
            infoText={element[key] || "....."}
          />
        );
      },
    },
    {
      id: "dropLocationName",
      label: "Drop Point",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        let key = 'dropLocationName'
        return (<InfoTooltip
          title={element[key] || "....."}
          placement={"top"}
          disableInMobile={"false"}
          infoText={element[key] || "....."}
        />)
      }
    },
    { id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
    { id: 'airwaybillNumber', label: 'Waybill Number', format: (value: any) => value || "NA" },
    { id: 'lrNumber', label: 'LR Number', format: (value: any) => value || "NA" },
    { id: 'shipmentRefId', label: 'Shipment Reference Id', format: (value: any) => value || "NA" },
    { id: 'statusName', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
  ]
  inboundListingPage && columnList.splice(4, 0, { id: 'vehicleTypeName', label: 'Vehicle Type', format: (value: any) => value || "NA" },)
  return columnList;
};

export const inboundMobileColumns = (
  onClickViewButton: Function,
  onClickLaneCode: Function
) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightOrderCode",
      label: "Order Code",
      format: (value: any) => value || "NA",
    },
    {
      id: "freightTypeCode",
      label: "Freight Type",
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "lane",
      label: laneZoneTitle,
      format: (value: any) => value || "NA",
      customView: (element: any) => ((element?.originZoneName && element.destinationZoneName) ? (element?.originZoneName + " -> " + element.destinationZoneName) : element?.laneName ?
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        /> : "NA"
      ),
    },
    {
      id: "statusName",
      label: "Status",
      format: (value: any) => value || "NA",
      class: () => "orange-text",
    },
    {
      id: "createdAt",
      label: "Order Date and Time",
      format: (value: any) =>
        convertDateFormat(value, displayDateTimeFormatter) || "NA",
    },
    {
      id: "gate-in",
      label: "Action",
      buttonLabel: "Gate In",
      type: "action",
      leftIcon: <ArrowForward />,
      onClickActionButton: onClickViewButton,
      class: () => "btn-detail btn-sm",
    },
    {
      id: "gate-in",
      label: "See More",
      buttonLabel: "Gate In",
      type: "expand",
      leftIcon: <ArrowForward />,
    },
  ];
  return columnList;
};
export const dispatchTableColumns = (
  onClickGoOut: Function,
  onClickLaneCode: Function
) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightOrderCode",
      label: "Order Code",
      format: (value: any) => value || "NA",
    },
    //{ id: 'freightShipmentCode', label: 'Shipping Code', format: (value: any) => value || "NA" },
    //{ id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
    // { id: 'vehicleType', label: 'Vehicle Type', format: (value: any) => value || "NA" },
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "lane",
      label: laneZoneTitle,
      format: (value: any) => value || "NA",
      customView: (element: any) => ((element?.originZoneName && element.destinationZoneName) ? (element?.originZoneName + " -> " + element.destinationZoneName) : element?.laneName ?
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        /> : "NA"
      ),
    },
    // { id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
    {
      id: "createdAt",
      label: "Order Date and Time",
      format: (value: any) =>
        convertDateFormat(value, displayDateTimeFormatter) || "NA",
    },
    // { id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
    {
      id: "statusName",
      label: "Status",
      format: (value: any) => value || "NA",
      class: () => "orange-text",
    },
    {
      id: "gate-out",
      label: "Action",
      buttonLabel: "Gate Out",
      type: "action",
      leftIcon: <LocalShipping />,
      onClickActionButton: onClickGoOut,
      class: () => "btn-detail btn-sm",
    },
    // {
    //   id: 'gate-in', label: 'See More', buttonLabel: "Gate In", type: "expand", leftIcon: <ArrowForward />,
    // }
  ];
  return columnList;
};

export const dispatchMobileColumns = (
  onClickGoOut: Function,
  onClickLaneCode: Function
) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "freightOrderCode",
      label: "Order Code",
      format: (value: any) => value || "NA",
    },
    //{ id: 'freightShipmentCode', label: 'Shipping Code', format: (value: any) => value || "NA" },
    //{ id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
    // { id: 'vehicleType', label: 'Vehicle Type', format: (value: any) => value || "NA" },
    {
      id: "partnerName",
      label: "Transporter",
      format: (value: any) => value || "NA",
    },
    {
      id: "lane",
      label: laneZoneTitle,
      format: (value: any) => value || "NA",
      customView: (element: any) => ((element?.originZoneName && element.destinationZoneName) ? (element?.originZoneName + " -> " + element.destinationZoneName) : element?.laneName ?
        <LaneView
          element={element}
          onClickLaneCode={(data: any) => {
            onClickLaneCode(data);
          }}
        /> : "NA"
      ),
    },
    // { id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
    {
      id: "statusName",
      label: "Status",
      format: (value: any) => value || "NA",
      class: () => "orange-text",
    },
    {
      id: "createdAt",
      label: "Order Date and Time",
      format: (value: any) =>
        convertDateFormat(value, displayDateTimeFormatter) || "NA",
    },
    {
      id: "gate-out",
      label: "Action",
      buttonLabel: "Gate Out",
      type: "action",
      leftIcon: <LocalShipping />,
      onClickActionButton: onClickGoOut,
      class: () => "btn-detail btn-sm",
    },
    {
      id: "gate-in",
      label: "See More",
      buttonLabel: "Gate In",
      type: "expand",
      leftIcon: <ArrowForward />,
    },
  ];
  return columnList;
};

export const invoiceTableColumns = (
  onChangeShipmentValues: Function,
  shipmentCode: String
) => {
  const columnList: ColumnStateModel[] = [
    {
      id: "articleName",
      label: "Material Name",
      format: (value: any) => value || "NA",
    },
    {
      id: "totalArticleCount",
      label: "Material Quantity",
      format: (value: any) => value || "NA",
    },
    {
      id: "totalArticleQuantity",
      label: "Product Quantity",
      format: (value: any) => value || "NA",
    },
    { id: "uom", label: "UoM", format: (value: any) => value || "NA" },
    {
      id: "refDocketNumber",
      label: "Ref. Docket No.",
      format: (value: any) => value || "NA",
    },
    {
      id: "partnerName",
      label: "Invoice Number",
      format: (value: any) => value || "NA",
      customView: (element: any) => {
        return (
          <EditText
            label={""}
            placeholder={invoiceNumberLabel}
            maxLength={20}
            value={element.invoiceNumber}
            onChange={(value: any) => {
              onChangeShipmentValues(value, shipmentCode, element.index);
            }}
          />
        );
      },
    },
  ];
  return columnList;
};

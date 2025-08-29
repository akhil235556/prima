import moment from "moment";
import { OptionType } from "../../component/widgets/widgetsInterfaces";
import {
  convertDateFormat,
  convertDateToServerFromDate,
  convertDateToServerToDate,
  DashboardDateFormatter,
  displayDateFormatter,
  getPastDate
} from "../utility/DateUtils";
import { getDefaultDateParams } from "../utility/Routerutils";
import * as Path from "./RoutePath";

export const rowsPerPageOptions = [25, 50, 100];

export const URL_Listing = [
  "/invoice/freight/reconciliation",
  "/tracking/list/",
  "/planning",
  "/procurement/contract/list",
  "/procurement/contract",
];

export const menuList = [
  {
    name: "/",
    label: "Dashboard",
    sequence: 1,
    image: "/images/dashboard.svg",
    routePath: Path.DASHBOARDUrl,
  },
  {
    name: "/procurement/",
    label: "Procurement",
    sequence: 2,
    image: "/images/procurement.svg",
    routePath: Path.ContractUrl,
    stateKey: "procurementSubMenu",
    subMenu: [
      {
        name: "/procurement/contract/",
        label: "Contract",
        sequence: 1,
        routePath: Path.ContractUrl,
      },
      {
        name: "/procurement/sob/",
        label: "SOB",
        sequence: 2,
        routePath: Path.SobUrl,
      },
      {
        name: "/procurement/monthlyDieselRate/",
        label: "Monthly Diesel Rate",
        sequence: 3,
        routePath: Path.MonthlyFreightUrl,
      },
    ],
  },

  {
    name: "/inventory",
    label: "Inventory",
    sequence: 3,
    stateKey: "inventorySubMenu",
    image: "/images/inventory-icon.svg",
    routePath: Path.AgnUrl,
    subMenu: [
      {
        name: "/inventory/agn/",
        label: "AGN",
        sequence: 1,
        routePath: Path.AgnUrl,
      },
      {
        name: "/inventory/history/",
        label: "AGN History",
        sequence: 2,
        routePath: Path.AgnHistoryUrl,
      },
      {
        name: "/inventory/forecast/",
        label: "Forecast",
        sequence: 3,
        routePath: Path.ForecastUrl,
      },

      {
        name: "/inventory/inventory/",
        label: "Inventory View",
        sequence: 4,
        routePath: Path.InventoryViewUrl,
      },
      {
        name: "/inventory/sales/",
        label: "Sales Order",
        sequence: 5,
        routePath: Path.SalesOrderUrl,
      },
    ],
  },
  {
    name: "/planning/",
    label: "Planning",
    sequence: 4,
    image: "/images/planning-icon.svg",
    routePath: getDefaultDateParams(Path.PlaningDashboardUrl),
    stateKey: "planningSubMenu",
    subMenu: [
      {
        name: "/planning/dashboard/",
        label: "Dashboard",
        sequence: 1,
        routePath: getDefaultDateParams(Path.PlaningDashboardUrl),
      },
      {
        name: "/planning/shipments/",
        label: "Shipments",
        sequence: 2,
        routePath: Path.PlanningShipmentsUrl,
      },
      {
        name: "/planning/dispatch/",
        label: "Dispatch History",
        sequence: 3,
        routePath: Path.PanningDispatchListingUrl,
      },
      {
        name: "/planning/history/",
        label: "Planning History",
        sequence: 4,
        routePath: Path.PlanningHistoryUrl,
      },
    ],
  },
  {
    name: "/auction/",
    label: "Auction",
    sequence: 5,
    stateKey: "auctionSubMenu",
    routePath: Path.AuctionListUrl,
    image: "/images/auction.svg",
    // className: "push-notification-icon ",
    subMenu: [
      {
        name: "/auction/list/",
        label: "Auction Listing",
        sequence: 1,
        routePath: Path.AuctionListUrl,
      },
    ],
  },
  {
    name: "/indent/",
    label: "Indent",
    sequence: 10,
    stateKey: "indentSubMenu",
    image: "/images/indent.png",
    routePath: Path.IndentDashboardUrl,
    subMenu: [
      {
        name: "/indent/dashboard/",
        label: "Dashboard",
        sequence: 1,
        routePath: Path.IndentDashboardUrl,
      },
      {
        name: "/indent/list/",
        label: "Indent Listing",
        sequence: 2,
        routePath: Path.IndentListUrl,
      },
    ],
  },
  {
    name: "/freight/",
    label: "Freight Orders",
    sequence: 6,
    image: "/images/truck-icon.svg",
    routePath: Path.RaiseIndentUrl,
    stateKey: "frightSubMenu",
    subMenu: [
      {
        name: "/freight/raise/",
        label: "Raise Order",
        sequence: 1,
        routePath: Path.RaiseIndentUrl,
      },
      {
        name: "/freight/order/",
        label: "Order Listing",
        sequence: 2,
        routePath: Path.OrderListingUrl,
      },
      {
        name: "/freight/so/",
        label: "SO",
        sequence: 3,
        routePath: Path.SOListingUrl,
      },
      {
        name: "/freight/sto/",
        label: "STO",
        sequence: 4,
        routePath: Path.STOListingUrl,
      },
      {
        name: "/freight/po/",
        label: "PO",
        sequence: 5,
        routePath: Path.POListingUrl,
      },
      {
        name: "/freight/demand-order/",
        label: "Demand Order",
        sequence: 6,
        routePath: Path.DOListingUrl,
      },
    ],
  },
  {
    name: "/diversion/",
    label: "Diversion",
    sequence: 17,
    image: "/images/diversion.png",
    routePath: Path.DiversionUrl,
    stateKey: "exceptionSubMenu",
    subMenu: [
      {
        name: "/diversion/",
        label: "Diversion",
        sequence: 1,
        routePath: Path.DiversionUrl,
      }
    ],
  },
  {
    name: "/dispatch/",
    label: "Dispatch",
    sequence: 7,
    stateKey: "dispatchSubMenu",
    image: "/images/toll-icon.svg",
    routePath: getDefaultDateParams(Path.ReportsUrl),
    subMenu: [
      {
        name: "/dispatch/dashboard/",
        label: "Dashboard",
        sequence: 1,
        routePath: getDefaultDateParams(Path.ReportsUrl),
      },
      {
        name: "/dispatch/inbound/",
        label: "Inbound",
        sequence: 2,
        routePath: Path.InboundUrl,
      },
      {
        name: "/dispatch/list/",
        label: "Dispatch",
        sequence: 3,
        routePath: Path.DispatchUrl,
      },
    ],
  },
  {
    name: "/tracking/",
    label: "Tracking",
    sequence: 8,
    stateKey: "trackingSubMenu",
    image: "/images/tracking-map.svg",
    routePath: Path.TrackingDashBoardUrl,
    subMenu: [
      {
        name: "/tracking/dashboard/",
        label: "Dashboard",
        sequence: 1,
        routePath: Path.TrackingDashBoardUrl,
      },
      {
        name: "/tracking/list/",
        label: "Vehicle Tracking",
        sequence: 2,
        routePath: Path.TrackingUrl,
      },
      {
        name: "/tracking/shipment",
        label: "Shipment Tracking",
        sequence: 3,
        routePath: Path.FreightShipmentUrl,
      },
    ],
  },
  {
    name: "/analytics/",
    label: "Analytics",
    sequence: 9,
    stateKey: "analyticsSubMenu",
    image: "/images/analytics.svg",
    routePath: getDefaultDateParams(Path.AllPerformanceReportUrl),
    subMenu: [
      {
        name: "/analytics/reports/all/",
        label: "Performance Report",
        sequence: 1,
        routePath: getDefaultDateParams(Path.AllPerformanceReportUrl),
      },
      {
        name: "/analytics/reports/placement/",
        label: "Placement Efficiency",
        sequence: 2,
        routePath: getDefaultDateParams(Path.PlacementEfficiencyUrl),
      },
      {
        name: "/analytics/reports/in-transit/",
        label: "InTransit Efficiency",
        sequence: 3,
        routePath: getDefaultDateParams(Path.InTransitEfficiencyUrl),
      },
      {
        name: "/analytics/reports/on-time/dispatch/",
        label: "On Time Dispatch Report",
        sequence: 4,
        routePath: getDefaultDateParams(Path.OnTimeDispatchReportUrl),
      },
      {
        name: "/analytics/reports/shortage-damage/",
        label: "Shortage Damage Report",
        sequence: 5,
        routePath: getDefaultDateParams(Path.ShortageDamageReportUrl),
      },
      {
        name: "/analytics/reports/forward-tracking/",
        label: "Forward Tracking",
        sequence: 6,
        routePath: getDefaultDateParams(Path.ForwardTrackingUrl),
      },
      {
        name: "/analytics/reports/vehicle-placement/",
        label: "Vehicle Placement Report",
        sequence: 7,
        routePath: getDefaultDateParams(Path.VehiclePlacementUrl),
      },
      {
        name: "/analytics/reports/loadability/",
        label: "Loadability Report",
        sequence: 8,
        routePath: getDefaultDateParams(Path.LoadabilityReportUrl),
      },
      {
        name: "/analytics/reports/detention/",
        label: "Detention Report",
        sequence: 9,
        routePath: getDefaultDateParams(Path.DetentionReportUrl),
      },
      {
        name: "/analytics/reports/sob/",
        label: "SOB Report",
        sequence: 10,
        routePath: getDefaultDateParams(Path.SobReporttUrl),
      },
      {
        name: "/analytics/reports/delivery/report",
        label: "Delivery Report",
        sequence: 11,
        routePath: getDefaultDateParams(Path.DeliveryReportUrl),
      },
      {
        name: "/analytics/reports/freight/",
        label: "Freight Order Report",
        sequence: 12,
        routePath: getDefaultDateParams(Path.MonthlyFreightReportUrl),
      },
      {
        name: "/analytics/reports/freight-payment/",
        label: "Freight Payment Report",
        sequence: 13,
        routePath: getDefaultDateParams(Path.FreightPaymentReportUrl),
      },
    ],
  },
  {
    name: "/invoice/",
    label: "Payments",
    sequence: 11,
    stateKey: "invoiceSubMenu",
    image: "/images/payments.svg",
    routePath: Path.FreightReconciliationUrl,
    subMenu: [
      {
        name: "/invoice/freight/",
        label: "Freight Reconciliation",
        sequence: 1,
        routePath: Path.FreightReconciliationUrl,
      },
      {
        name: "/invoice/list/",
        label: "Freight Billing",
        sequence: 2,
        routePath: Path.FreightBillingListUrl,
      },
    ],
  },
  {
    name: "/master/",
    label: "Masters",
    sequence: 12,
    stateKey: "masterSubMenu",
    routePath: Path.PartnersUrl,
    image: "/images/master-platform.svg",
    subMenu: [
      {
        name: "/master/transporter/",
        label: "Transporter",
        sequence: 1,
        routePath: Path.PartnersUrl,
      },
      {
        name: "/master/customer/",
        label: "Customer",
        sequence: 11,
        routePath: Path.CustomerUrl,
      },
      {
        name: "/master/consignees/",
        label: "Consignees",
        sequence: 11,
        routePath: Path.ConsigneesUrl,
      },
      {
        name: "/master/type/freight/",
        label: "Freight Type",
        sequence: 2,
        routePath: Path.FreightTypeUrl,
      },
      // {
      //   name: "/master/location-type",
      //   label: "Location Type",
      //   sequence: 3,
      //   routePath: Path.LocationTypeUrl,
      // },
      {
        name: "/master/location/",
        label: "Location",
        sequence: 4,
        routePath: Path.LocationUrl,
      },

      {
        name: "/master/lane/",
        label: "Lane",
        sequence: 5,
        routePath: Path.LaneUrl,
      },
      {
        name: "/master/zone",
        label: "Zone",
        sequence: 5,
        routePath: Path.ZoneUrl,
      },
      {
        name: "/master/serviceability/",
        label: "Serviceability",
        sequence: 3,
        routePath: Path.ServiceabilityUrl,
      },
      {
        name: "/master/tracking/assets/",
        label: "Tracking Assets",
        sequence: 6,
        routePath: Path.TrackingAssetsUrl,
      },
      {
        name: "/master/type/vehicle",
        label: "Vehicle Type",
        sequence: 7,
        routePath: Path.VehicleTypeUrl,
      },
      {
        name: "/master/vehicle/",
        label: "Vehicle List",
        sequence: 8,
        routePath: Path.VehicleUrl,
      },
      {
        name: "/master/product/",
        label: " Product",
        sequence: 9,
        routePath: Path.ProductUrl,
      },
      // {
      //     "name": "freightMaster",
      //     "label": "Freight Master",
      //     "sequence": 6,
      //     "routePath": Path.FreightUrl
      // },
      {
        name: "/master/material/",
        label: "Material Master",
        sequence: 10,
        routePath: Path.MaterialUrl,
      },
      {
        name: "/master/driver/",
        label: "Driver Master",
        sequence: 11,
        routePath: Path.MasterDriverUrl,
      },
    ],
  },
  {
    name: "/application/",
    label: "Logs",
    sequence: 13,
    stateKey: "application",
    routePath: Path.BulkUploadUrl,
    image: "/images/log-icon.svg",
    subMenu: [
      {
        name: "/application/logs/bulk/",
        label: "Bulk Upload",
        sequence: 1,
        routePath: Path.BulkUploadUrl,
      },
      {
        name: "/application/logs/sim/",
        label: "Sim Tracking Logs",
        sequence: 2,
        routePath: Path.SimTrackingUrl,
      },
      {
        name: "/application/logs/export/",
        label: "Export Module Data",
        sequence: 3,
        routePath: Path.ExportModuleDataUrl,
      },
      {
        name: "/application/logs/shipment",
        label: "Shipment Tracking Logs",
        sequence: 4,
        routePath: Path.ShipmentTrackingLogsDataUrl,
      },
    ],
  },
  {
    name: "/support/",
    label: "Support",
    sequence: 14,
    image: "/images/support-icon.svg",
    className: "support-icon ",
  },
  {
    name: "/settings/",
    label: "Settings",
    sequence: 15,
    stateKey: "settingSubMenu",
    routePath: Path.PushNotificationUrl,
    image: "/images/setting-icon.svg",
    className: "setting-icon ",
    subMenu: [
      {
        name: "/settings/notifications/",
        label: "Push Notifications",
        sequence: 1,
        routePath: Path.PushNotificationUrl,
      },
      {
        name: "/settings/config/",
        label: "Process Management",
        sequence: 2,
        routePath: Path.ConfigUrl,
      },
    ],
  },
  {
    name: "/management/",
    label: "User",
    sequence: 16,
    stateKey: "userSubMenu",
    routePath: Path.UsersUrl,
    image: "/images/push-notification.svg",
    className: "push-notification-icon ",
    subMenu: [
      {
        name: "/management/users/",
        label: "Users",
        sequence: 1,
        routePath: Path.UsersUrl,
      },
      {
        name: "/management/roles/",
        label: "Roles",
        sequence: 2,
        routePath: Path.RolesUrl,
      },
    ],
  },
];

export enum subMenuItems {
  Procurement = "Procurement",
  Order = "Order Management",
  Efficiency = "Performance Efficiency",
}

export const partnerLevel: OptionType[] = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
];

export const laneTypes: OptionType[] = [
  { label: "Express", value: "EXPRESS" },
  { label: "Non Express", value: "NON-EXPRESS" },
];

export const trackingStatus: OptionType[] = [
  { label: "All", value: "" },
  { label: "Delayed", value: "Delayed" },
  { label: "On Schedule", value: "On Schedule" },
];

export const chargesTypes: OptionType[] = [
  { label: "Debit", value: "DEBIT" },
  { label: "Credit", value: "CREDIT" },
];

export enum tripsStatusEnum {
  INIT = "INIT",
  INTRANSIT = "INTRANSIT",
  COMPLETED = "COMPLETED",
  UNKNOWN = "UNKNOWN",
}

export enum runningTripsStatusEnum {
  TRANSIT = "On Schedule",
  DELAYED = "Delayed",
  UNKNOWN = "Unknown",
}

export enum CustomerManagedEnum {
  CUSTOMER = "CUSTOMER",
}

export enum OrderStatus {
  PENDING = 100,
  CONFIRMED = 150,
  ORIGIN_ARRIVED = 175,
  PLACED = 200,
  DISPATCHED = 250,
  DESTINATION_ARRIVED = 275,
  REPORTED = 300,
  DELIVERED = 350,
  // RECONCILED = 400,
  CANCELLED = 999,
  BILLED = 500,
  PAID = 600,
  RETURNED = 800,
}

export const orderStatusList = [
  {
    label: "Pending",
    value: 100,
  },
  {
    label: "Confirmed",
    value: 150,
  },
  {
    label: "Origin_Arrived",
    value: 175,
  },
  {
    label: "Placed",
    value: 200,
  },
  {
    label: "Dispatched",
    value: 250,
  },
  {
    label: "Destination_Arrived",
    value: 275,
  },
  {
    label: "Reported",
    value: 300,
  },
  {
    label: "Delivered",
    value: 350,
  },
  // {
  //   label: "Reconciled",
  //   value: 400,
  // },
  {
    label: "Cancelled",
    value: 999,
  },
  {
    label: "Billed",
    value: 500,
  },
  {
    label: "Paid",
    value: 600,
  },
  {
    label: "Returned",
    value: 800,
  },
];

export const doOrderStatusList = [
  {
    label: "Pending",
    value: 100,
  },
  {
    label: "Confirmed",
    value: 150,
  },
];

export enum AgnStatus {
  PENDING = 150,
  RECEIVED = 250,
  CANCELLED = 420,
  COMPLETED = 500,
}

export const invoiceTab = [
  "PENDING",
  "DISPUTED",
  "ACCEPTED",
  "AWAITING APPROVAL",
  "APPROVED",
  "PAID",
  "CANCELLED",
];
export enum InvoiceStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  ACCEPTED = "ACCEPTED",
  DISPUTED = "DISPUTED",
  "AWAITING APPROVAL" = "AWAITING APPROVAL",
}

export enum InvoiceStatusTabEnum {
  PENDING = "pending",
  APPROVED = "approved",
  PAID = "paid",
  CANCELLED = "cancelled",
  ACCEPTED = "accepted",
  DISPUTED = "disputed",
  "AWAITING APPROVAL" = "awaiting_approval",
}

export const InvoiceStatusList = [
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Approved",
    value: "APPROVED",
  },
  {
    label: "Paid",
    value: "PAID",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
  {
    label: "Accepted",
    value: "ACCEPTED",
  },
  {
    label: "Disputed",
    value: "DISPUTED",
  },
  {
    label: "Awaiting Approval",
    value: "AWAITING APPROVAL",
  },
];
export const userTabs = ["Role", "Permission"];
export const notificationTab = [
  "All Notifications",
  "Planning",
  "Tracking",
  "Freight Payment",
  "Dispatch Planning",
];

export enum jobStatus {
  PENDING = "Pending",
  IN_PROCESS = "In Progress",
  COMPLETED = "Completed",
}

export const jobStatusList = [
  {
    label: "Pending",
    value: "Pending",
  },
  {
    label: "In Progress",
    value: "In Progress",
  },
  {
    label: "Completed",
    value: "Completed",
  },
];

export const planningStatus = {
  PENDING: { statusCode: 200, className: "orange-text" },
  PROCESSING: { statusCode: 600, className: "orange-text" },
  SUCCESS: { statusCode: 900, className: "orange-text" },
  FAIL: { statusCode: 901, className: "red-text planning_history-fail" },
  CANCELLED: { statusCode: 902, className: "orange-text" },

}

export enum userTabsEnum {
  Role = "Role",
  Permission = "Permission",
}

export enum RegisterJobs {
  RAISE_ORDERS = "FreightOrders",
  RAISE_ORDERS_INTEGRATION = "FreightOrdersIntegration",
  DIESEL_RATE = "MonthlyDieselRates",
  PRODUCTS = "Products",
  VEHICLES = "Vehicles",
  VEHICLE_TYPE = "VehicleType",
  ARTICLES = "Articles",
  STOCK_ORDER = "StockOrder",
  STOCK_TRANSFER_ORDER = "StockTransferOrder",
  SALES_ORDER = "SalesOrder",
  STOCK_FORECAST = "StockForecast",
  STOCK_INVENTORY = "StockInventory",
  LOCATIONS = "Locations",
  TAGGED_LOCATIONS = "LocationTag",
  SHIPMENT_SCAN = "ShipmentScan",
  SERVICEABILITY = "Serviceability",
  INDENT = "Indent",
  SHIPMENTINDENT = "IndentMaterial",
  AUCTION = "Auctions",
  CUSTOMER = "Customer",
  CUSTOMER_UPDATE = "CustomerUpdate",
  FREIGHT_SHIPMENTS = "FreightShipments",
  FREIGHT_SHIPMENTS_INTEGRATION = "FreightShipmentsIntegration",
  VENDOR = "ClientVendor",
  DRIVERS = "Drivers",
  CONTRACT = "Contract",
  CONTRACT_UPDATE = "ContractUpdate",
  SOB = "SOB",
  LANES = "Lanes",
  DEMAND_ORDER = "DemandOrder",
  PurchaseOrder = "PurchaseOrder",
  ZONE = "Zone",
  ZONE_UPDATE = "ZoneUpdate",
  ODA_PINCODE = "OdaPincode",
  SHIPMENT_DISPATCH = "DispatchWaybill"
}
export enum JobFileType {
  STANDARD_FILE = "standard_file",
  INTEGRATION_FILE = "integration_file",
  DEMAND_ORDER = "demand_order",
  SHIPMENT = "shipment"
}

export enum DispatchPeriodsEnum {
  Today = "Today",
  Last_Week = "Last Week",
  Last_Month = "Last Month",
  Last_Year = "Last Year",
  Custom = "Custom",
}

export const dispatchDashboardPeriods = [
  {
    label: DispatchPeriodsEnum.Today,
    value: DispatchPeriodsEnum.Today,
    data: {
      fromDate: convertDateToServerFromDate(new Date()),
      toDate: convertDateToServerToDate(new Date()),
    },
  },
  {
    label: DispatchPeriodsEnum.Last_Week,
    value: DispatchPeriodsEnum.Last_Week,
    data: {
      fromDate: convertDateToServerFromDate(
        getPastDate(moment(new Date()).add(1, "day"), 1, "weeks")
      ),
      toDate: convertDateToServerToDate(new Date()),
    },
  },
  {
    label: DispatchPeriodsEnum.Last_Month,
    value: DispatchPeriodsEnum.Last_Month,
    data: {
      fromDate: convertDateToServerFromDate(
        getPastDate(moment(new Date()).add(1, "day"), 1, "months")
      ),
      toDate: convertDateToServerToDate(new Date()),
    },
  },
  {
    label: DispatchPeriodsEnum.Last_Year,
    value: DispatchPeriodsEnum.Last_Year,
    data: {
      fromDate: convertDateToServerFromDate(
        getPastDate(moment(new Date()).add(1, "day"), 1, "years")
      ),
      toDate: convertDateToServerToDate(new Date()),
    },
  },
  {
    label: DispatchPeriodsEnum.Custom,
    value: DispatchPeriodsEnum.Custom,
  },
];

export const dashboardTrackingPeriods = [
  {
    label: DispatchPeriodsEnum.Today,
    value: DispatchPeriodsEnum.Today,
    data: {
      fromDate: convertDateFormat(new Date(), DashboardDateFormatter),
      toDate: convertDateFormat(new Date(), DashboardDateFormatter),
    },
  },
  {
    label: DispatchPeriodsEnum.Last_Week,
    value: DispatchPeriodsEnum.Last_Week,
    data: {
      fromDate: convertDateFormat(
        getPastDate(moment(new Date()).add(1, "day"), 1, "weeks"),
        DashboardDateFormatter
      ),
      toDate: convertDateFormat(new Date(), DashboardDateFormatter),
    },
  },
  {
    label: DispatchPeriodsEnum.Last_Month,
    value: DispatchPeriodsEnum.Last_Month,
    data: {
      fromDate: convertDateFormat(
        getPastDate(moment(new Date()).add(1, "day"), 1, "months"),
        DashboardDateFormatter
      ),
      toDate: convertDateFormat(new Date(), DashboardDateFormatter),
    },
  },
  {
    label: DispatchPeriodsEnum.Last_Year,
    value: DispatchPeriodsEnum.Last_Year,
    data: {
      fromDate: convertDateFormat(
        getPastDate(moment(new Date()).add(1, "day"), 1, "years"),
        DashboardDateFormatter
      ),
      toDate: convertDateFormat(new Date(), DashboardDateFormatter),
    },
  },
  {
    label: DispatchPeriodsEnum.Custom,
    value: DispatchPeriodsEnum.Custom,
  },
];

export const freightTypeList = [
  {
    label: "PTL",
    value: "PTL",
  },
  {
    label: "FTL",
    value: "FTL",
  },
];

export const consentStatusList = [
  {
    value: "ALLOWED",
    label: "ALLOWED",
  },
  {
    value: "PENDING",
    label: "PENDING",
  },
];

export enum FreightType {
  PTL = "PTL",
  FTL = "FTL",
}

export enum ServicabilityType {
  LANE = "Lane",
  ZONE = "Zone"
}

export enum contractModeType {
  ZONE = "zone",
  LANE = "lane"
}

export const financialStatusList = [
  {
    label: "Delivered",
    value: 350,
  },
  {
    label: "Reconciled",
    value: 400,
  },
];

export const planningHistoryFilter = [
  {
    label: "Pending",
    value: "Pending",
  },
  {
    label: "In Process",
    value: "In process",
  },
  {
    label: "Completed",
    value: "Completed",
  },
];

export const vehicleStatus = [
  {
    label: "Assigned",
    value: "Assigned",
  },
  {
    label: "Unassigned",
    value: "Unassigned",
  },
];

export const vehicleSourceTypeList = [
  {
    label: "Market",
    value: "false",
  },
  {
    label: "Dedicated",
    value: "true",
  },
];

export enum OrderTypes {
  CONTRACTUAL = "CONTRACTUAL",
  SPOT_RATE = "SPOT_RATE",
}

export const permissionTab = ["Permission"];

export enum DocType {
  EPOD = "ePOD",
  EChallan = "eChallan",
  EDPR = "eDPR",
  ELR = "eLR",
  CONTRACT = "eContract",
  EBILL = "eBillSub",
  EORDERBILL = "externalOrderBill",
  ATTACHMENTS = "supportingDocs"
}

export const BackgroundColorArray = [
  "#004586",
  "#ff420e",
  "#ffd320",
  "#579d1c",
  "#7e0021",
  "#83caff",
  "#314004",
  "#ff950e",
  "#c5000b",
  "#633D9F",
  "#119830",
  "#BA6800",
  "#76805A",
  "#57BEC3",
  "#CE5C7A",
  "#82AC60",
  "#B7A65F",
  "#C4816F",
  "#0067C7",
  "#FF8B8B",
];

export const lastWeek = {
  fromDate: convertDateToServerFromDate(
    getPastDate(moment(new Date()).add(1, "day"), 1, "weeks")
  ),
  toDate: convertDateToServerToDate(new Date()),
};

export const listDispatch = [
  {
    label: "Order Code",
    value: "freight_order_code",
  },
  {
    label: "Shipment Code",
    value: "freight_shipment_code",
  },
  {
    label: "Waybill Number",
    value: "airwaybill_number",
  },
  {
    label: "LR Number",
    value: "lr_number",
  },
  {
    label: "Shipment Reference Id",
    value: "shipment_ref_id",
  },
  {
    label: "Vehicle Number",
    value: "vehicle_registration_number",
  },
];

export const list = [
  {
    label: "Order Code",
    value: "freight_order_code",
  },
  {
    label: "Shipment Code",
    value: "freight_shipment_code",
  },
  {
    label: "Waybill Number",
    value: "airwaybill_number",
  },
  {
    label: "LR Number",
    value: "lr_number",
  },
  {
    label: "Shipment Reference Id",
    value: "shipment_ref_id",
  },
  {
    label: "Reference Id",
    value: "reference_id",
  },
];

export const shipmentLogFiltersList = [
  {
    label: "Order Code",
    value: "freight_order_code",
  },
  {
    label: "Shipment Code",
    value: "freight_shipment_code",
  },
  {
    label: "Waybill Number",
    value: "airwaybill_number",
  },
  {
    label: "LR Number",
    value: "lr_number",
  },
  {
    label: "Shipment Reference Id",
    value: "shipment_ref_id",
  },
  {
    label: "Order Reference Id",
    value: "reference_id",
  },
];
export const IndentStatusList = [
  {
    value: "Created",
    label: "Created",
  },
  {
    value: "Processed",
    label: "Processed",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
  },
];

export enum IndentStatus {
  CREATED = "Created",
  PROCESSED = "Processed",
  CANCELLED = "Cancelled",
}

export const serviceabilityModeTypeList = [
  {
    label: "Air",
    value: "air",
  },
  {
    label: "Surface",
    value: "surface",
  },
];

export const ptlModeTypeList = [
  {
    label: "Lane",
    value: "lane",
  },
  {
    label: "Zone",
    value: "zone",
  },
];

export const ftlServiceabilityModeTypeList = [
  {
    label: "Surface",
    value: "surface",
  },
];

export enum ContractRateType {
  FLAT = "FLAT",
  SLAB = "SLAB",
}

export const subLocationType = [
  {
    label: "PICKUP",
    value: "PICKUP",
  },
  {
    label: "DROP",
    value: "DROP",
  },
];

export const tatOptions = [
  {
    label: "Hours",
    value: "hr",
  },
  {
    label: "Days",
    value: "d",
  },
];

export enum ChannelName {
  FREIGHT_PAYMENT = "Freight Payment",
}

export enum configBoolType {
  INT = "int",
  BOOL = "bool",
  FLOAT = "float",
  STRING = "str",
}

export enum dropTypes {
  PICKUP = "PICKUP",
  DROP = "DROP",
}

export enum OrderStatusLabel {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PLACED = "PLACED",
  DISPATCHED = "DISPATCHED",
  REPORTED = "REPORTED",
  DELIVERED = "DELIVERED",
  // RECONCILED = "RECONCILED",
  CANCELLED = "CANCELLED",
  BILLED = "BILLED",
  PAID = "PAID",
}
export const materialListTooltipColumn = [
  {
    description: "Material Name",
    name: "articleName",
    format: (value: any) => value,
  },
  {
    description: "Material Quantity",
    name: "totalArticleCount",
    format: (value: any) => value,
  },
  {
    description: "Product Quantity",
    name: "totalArticleQuantity",
    format: (value: any) => (value && value.toFixed(3)) || "",
  },
  { description: "UoM", name: "uom", format: (value: any) => value },
  { description: 'Ref. Docket No.', name: 'refDocketNumber', format: (value: any) => value || "" }
];

export const materialAndQuantityTooltipColumn = [
  { description: "Name", name: "articleName", format: (value: any) => value },
  {
    description: "Quantity",
    name: "totalArticleCount",
    format: (value: any) => value,
  },
  {
    description: "Type",
    name: "productTypeName",
    format: (value: any) => value,
  },
  { description: 'Ref. Docket No.', name: 'refDocketNumber', format: (value: any) => value || "" }
];

export const materialBalanceQuantityColumn = [
  { description: "Product", name: "productName", format: (value: any) => value, },
  { description: "Material", name: "materialName", format: (value: any) => value, },
  { description: "Balance QTY", name: "balanceQuantity", format: (value: any) => (value && value.toFixed(3)) || "0.000", },
];

export const externalBillTooltipColumn = [
  { description: "External Order Bill", name: "externalShipmentBillNumber", format: (value: any) => (value && value.toString()) || "NA", },
  { description: "Bill Date", name: "externalShipmentBillNumberDatetime", format: (value: any) => (value && convertDateFormat(value, displayDateFormatter)) || "NA", },
];

export const productTypeOptions = [
  {
    label: "Solid",
    value: "solid",
  },
  {
    label: "Semi Solid",
    value: "semi-solid",
  },
  {
    label: "Liquid",
    value: "liquid",
  },
  {
    label: "Gas",
    value: "gas",
  },
  {
    label: "Aqueous",
    value: "aqueous",
  },
];

export const vehicleAssignedStatusList = [
  {
    label: "Yes",
    value: 1,
  },
  {
    label: "No",
    value: -1,
  },
];

export const transporterScope = [
  {
    label: "Local",
    value: "local",
  },
  {
    label: "Global",
    value: "global",
  },
];
export enum AuctionStatusEnum {
  SCHEDULED = "Scheduled",
  LIVE = "Live",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  CLOSED = "Closed",
  TERMINATED = "Terminated",
}

export enum AnalyticsDateGroup {
  DAY = "DAY",
  WEEK = "WEEK(MONDAY)",
  MONTH = "MONTH",
}

export enum shipmentPickupETA {
  ON_TIME = "On Time",
  DELAYED = "Delayed",
  ARRIVING_EARLY = "Arriving Early",
}

export const soOptions = [
  {
    label: "Source No.",
    value: "sourceNumber",
  },
];

export const reconciliationOptions = [
  {
    label: "Shipment code",
    value: "freight_shipment_code",
  },
  {
    label: "Waybill number",
    value: "airwaybill_number",
  },
  {
    label: "LR number",
    value: "lr_number",
  },
  {
    label: "Shipment ref ID",
    value: "shipment_ref_id",
  },
  {
    label: "Vehicle number",
    value: "vehicle_registration_number",
  },
]

export const poOptions = [
  {
    label: "Source No.",
    value: "sourceNumber",
  },
];

export const stoOptions = [
  {
    label: "Source No.",
    value: "sourceNumber",
  },
];

export const doFilterOptions = [
  {
    label: "Demand Order",
    value: "demandOrderCode",
  },
];

export const demandFilterOptions = [
  {
    label: "Demand Order",
    value: "demandOrderCode",
  },
  {
    label: "Transporter",
    value: "transporter",
  },
];

export const stockTransferStatusTab = [
  "Pending",
  "Hold",
  "Expired",
  "Completed",
];

export const demandOrderStatusTab = [
  "Pending",
  "Approved",
  "Modify Request",
  "In Progress",
  "Completed",
  "Rejected",
  "Expired",
];
export const demandOrderStatusTabValue = [
  "Pending",
  "Approved",
  "Modify-request",
  "In-progress",
  "Completed",
  "Deleted",
  "Expired",
];

export const contractCreationTabValue = [
  "Charges",
  "Constraint"
];

export const stockDetailsTab = ["Source", "Customer", "Consignee"];
export const diversionTab = ["Diversion Request", "In progress", "Completed", "Rejected"]
export const diversionStatusTabValue = ["Diversion-Request, In-progress, Completed, Rejected"]
export enum diversionTabEnum {
  DIVERSION_REQUEST = "Diversion Request",
  IN_PROGRESS = "In progress",
  COMPLETED = "Completed",
  REJECTED = "Rejected"
}

export enum diversionStatusEnum {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED"
}

export function diversionSearchOptions(tabName: any) {
  if (tabName && tabName === diversionTabEnum.REJECTED) {
    return (
      [
        {
          label: "Freight Order",
          value: "freightOrderCode"
        },
        {
          label: "Transporter",
          value: "transporter"
        }
      ]
    )
  } else if (tabName && tabName === diversionTabEnum.IN_PROGRESS) {
    return (
      [
        {
          label: "Request ID",
          value: "requestId"
        },
        {
          label: "Old Freight Order",
          value: "oldFreightOrderCode"
        }
      ]
    )
  } else if (tabName && tabName === diversionTabEnum.COMPLETED) {
    return (
      [
        {
          label: "Request ID",
          value: "requestId"
        },
        {
          label: "New Freight Order",
          value: "newFreightOrderCode"
        }
      ]
    )
  } else {
    return (
      [
        {
          label: "Request ID",
          value: "requestId"
        },
        {
          label: "Diversion FO",
          value: "oldFreightOrderCode"
        }
      ]
    )
  }
}

export const trackListing = ["Awaiting Approval", "Accepted", "Rejected"];

export enum stockTransferStatusEnum {
  PENDING = "Pending",
  HOLD = "Hold",
  EXPIRED = "Expired",
  COMPLETED = "Completed",
}

export enum sourceTypeEnum {
  SO = "SO",
  STO = "STO",
  PO = "PO",
  DO = "DO",
}
export enum demandOrderTabsEnum {
  PENDING = "Pending",
  APPROVED = "Approved",
  MODIFY_REQUEST = "Modify-request",
  IN_PROGRESS = "In-progress",
  COMPLETED = "Completed",
  REJECTED = "Deleted",
  EXPIRED = "Expired",
}

export const freightOrderOptions = [
  {
    label: "Freight Order",
    value: "freightOrderCode",
  },
];

export enum podStatusEnum {
  PENDING = 100,
  DISPUTED = 200,
  CLEAN = 300,
}

export const CertificateTypeOptions = [
  {
    label: "Insurance Certificate",
    value: "INSURANCE",
  },
  {
    label: "Registration Certificate",
    value: "RC",
  },
  {
    label: "Pollution Under Control Certificate",
    value: "PUCC",
  },
  {
    label: "Permit",
    value: "PERMIT",
  },
  {
    label: "Hydrolic Test",
    value: "HYDROLIC_TEST",
  },
  {
    label: "Fitness Certificate",
    value: "FITNESS",
  },
];

export const uomOptionsList = [
  {
    value: "KG",
    label: "KG",
  },
  {
    value: "MT",
    label: "MT",
  },
  {
    value: "L",
    label: "L"
  },
  {
    value: "M^3",
    label: "M^3 (Cubic mt)"
  },
  {
    value: "EACH",
    label: "EACH"
  },
  {
    value: "M^2",
    label: "M^2 (Square mt)"
  },
]

export const weightUomOptionsList = [
  {
    value: "KG",
    label: "KG (kilogram)"
  },
  {
    value: "MT",
    label: "MT (Metric Ton)"
  }
]

export const volumeUomOptionsList = [
  {
    value: "L",
    label: "L (Litre)"
  },
  {
    value: "M^3",
    label: "M^3 (Cubic mt)"
  }
]

export enum uomOptionsEnum {
  MetreCube = 'm^3',
  Litre = 'L',
  METRIC_TON = 'mt',
  KILOGRAM = 'kg',
  EACH = 'Eaches',
}

export const materialPackagingOptionsList = [
  {
    value: "Eaches",
    label: "Eaches"
  },
  {
    value: "Inner Pack",
    label: "Inner-Pack"
  },
  {
    value: "Master Pack",
    label: "Master-Pack"
  },
  {
    value: "Pallets",
    label: "Pallets"
  },
  {
    value: "Box",
    label: "Box"
  },
  {
    value: "Bags",
    label: "Bags"
  }
]
export const SourceOrderCodeList = [
  {
    value: "SO",
    label: "SO",
  },
  {
    value: "STO",
    label: "STO",
  },
  {
    value: "PO",
    label: "PO",
  },
];

export const trackingQuickFilters = [
  {
    key: 1,
    label: "FU Code",
    value: "freightOrderCode",
  },
];

export const biddingRate = [
  {
    value: "Fixed",
    label: "Fixed",
  },
  {
    value: "Per KG",
    label: "Per KG",
  },
];

export const fuelSurchargeTooltipColumn = [
  { description: "Variable Fuel Surcharge", name: "variableFuelSurcharge", format: (value: any) => value, },
  { description: "Fixed Fuel Surcharge", name: "fixedFuelSurcharge", format: (value: any) => value, },
];

export const trackRequestOptions = [
  {
    label: "Vehicle Type",
    value: "Vehicle Type"
  },
  {
    label: "Placement Date and Time",
    value: "Placement Date and Time"
  }
]

export const trackRequestTab = ["Awaiting approval", "Accepted", "Rejected", "Cancelled"];
export const trackRequestTabValue = [100, 200, 400, 300]
export enum trackRequestTabEnum {
  PENDING = 100,
  APRROVED = 200,
  CANCELLED = 300,
  REJECTED = 400,
}

export const diversionMaterialBalanceQuantityColumn = [
  { description: "Vehicle Number", name: "vehicleRegistrationNumber", format: (value: any) => value },
  { description: "Materials", name: "articleName", format: (value: any) => value },
  { description: "Total QTY", name: "totalArticleQuantity", format: (value: any) => (value && value.toFixed(3)) || "" }
]
export enum vehiclePlacementStatus {
  ON_TIME = "On Time",
  DELAYED = "Delayed"
}
export const orderShipmentTag = [
  {
    value: "SO",
    label: "SO",
  },
  {
    value: "STO",
    label: "STO",
  },
  {
    value: "PO",
    label: "PO",
  },
];

export const freightPaymentDateTypeCriteria = [
  {
    label: "Created At",
    value: "created_at",
  },
  {
    label: "Approved At",
    value: "approved_at",
  },
  {
    label: "Updated At",
    value: "updated_at",
  },
];


export const billPeriodTableColumns = [
  { description: "Start Date", name: "startDate", format: (value: any) => (value && convertDateFormat(value, displayDateFormatter)), },
  { description: "End Date", name: "endDate", format: (value: any) => (value && convertDateFormat(value, displayDateFormatter)), },
];


export const billingPeriodOptions = [
  {
    label: "Weekly",
    value: "weekly",
  },
  {
    label: "Monthly",
    value: "monthly",
  },
  {
    label: "Custom",
    value: "custom",
  },
  {
    label: "Trip",
    value: "trip"
  }
];

export const pendingPodOptions = [
  {
    label: "Pending",
    value: "pending"
  },
  {
    label: "Completed",
    value: "completed"
  }
]

export const disputeReasonTableColumn = [
  { description: "Reason", name: "reason", format: (value: any) => value },
  { description: "Comments", name: "comment", format: (value: any) => value },
]

export const permissionCode = { Approved: "tms.freight-billing.approve" };

export const allTrackRequestListingOptions = [
  {
    label: "Vehicle Type",
    value: "Vehicle Type"
  },
  {
    label: "Placement Date and Time",
    value: "Placement Date and Time"
  }
]

export const vehicleTrackRequestListingOptions = [
  {
    label: "Vehicle Type",
    value: "Vehicle Type"
  }
]

export const zoneCards = [
  {
    title: "State",
    key: "zoneState",
    childKey: "stateName"
  },
  {
    title: "Cities",
    key: "zoneCity",
    childKey: "cityName"
  }
  ,
  {
    title: "Serviceable Pincodes",
    key: "zonePincode",
    childKey: "pincodeValue"
  }
];

export const placementTrackRequestListingOptions = [
  {
    label: "Placement Date and Time",
    value: "Placement Date and Time"
  }
]

export enum orchestrationRunningStatusEnum {
  RUNNING = "Running",
  COMPLETED = "Completed",
  FAILED = "Failed",
};


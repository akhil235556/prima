import Api from "../base/api/ApiMethods";
import DownloadApi from "../base/api/DownloadApiMethods";
import AgnServices from "./AgnServices";
import AlertServices from "./AlertServices";
import AllPerformanceReportServices from "./AllPerformanceServices";
import AppServices from "./AppServices";
import AuctionServices from "./AuctionServices";
import BillGenerateServices from "./BillGenerateServices";
import BulkUploadServices from "./BulkUploadServices";
import ConfigServices from "./ConfigServices";
import ConsigneeServices from "./ConsigneeServices";
import ContractServices from "./ContractServices";
import DasServices from "./DasServices";
import DeliveryServices from "./DeliveryServices";
import DetentionReportServices from "./DetentionServices";
import DownloadBulkCsvServices from "./DownloadBulkCsvServices";
import ExportServices from "./ExportServices";
import ForwadTrackingServices from "./ForwardTrackingServices";
import FreightPaymentReport from "./FreightPaymentReportServices";
import FreightRateServices from "./FreightRateServices";
import FreightReconciliationServices from "./FreightReconciliationServices";
import FreightTypeServices from "./FreightTypeServices";
import IndentDashboardServices from "./IndentDashboardServices";
import IndentServices from "./IndentServices";
import InplantServices from "./InplantServices";
import IntransitEfficiencyServices from "./IntransitEfficiencyServices";
import JiraServices from "./JiraServices";
import LaneServices from "./LaneServices";
import LoadabilityServices from "./LoadingServices";
import LocationServices from "./LocationServices";
import MaterialServices from "./MaterialServices";
import MisServices from "./MisServices";
import MonthlyFreightReport from "./MonthlyFreightReportServices";
import NotificationServices from "./NotificationServices";
import OnTimeDispatchReportServices from "./OnTimeDispatchReportServices";
import DispatchServices from "./OrderDispatchServices";
import OrderServices from "./OrderServices";
import PartnerServices from "./PartnerServices";
import PlacementEfficiencyServices from "./PlacementEfficiencyServices";
import PlanningServices from "./PlanningServices";
import ProductServices from "./ProductServices";
import RolesServices from "./RolesServices";
import ServiceabilityServices from "./ServiceabilityServices";
import ShipmentServices from "./ShipmentServices";
import ShortageDamageReport from "./ShortageDamageReportServices";
import SimTrackingServices from "./SimTrackingServices";
import SobListingServices from "./SobListingServices";
import SobServices from "./SobServices";
import StockServices from "./StockServices";
import TrackingAssets from "./TrackingAssetsTypeServices";
import TrackingServices from "./TrackingServices";
import TrackRequestVehicleTypeServices from "./TrackRequestVehicleTypeServices";
import UserServices from "./UserServices";
import VehiclePlacementServices from "./VehiclePlacementServices";
import VehicleServices from "./VehicleServices";
import VehicleType from "./VehicleTypeServices";
import ZoneServices from "./ZoneServices";

const app = AppServices(Api);
const material = MaterialServices(Api);
const consignee = ConsigneeServices(Api);
const roles = RolesServices(Api);
const partners = PartnerServices(Api);
const lane = LaneServices(Api);
const vehicles = VehicleServices(Api);
const location = LocationServices(Api);
const order = OrderServices(Api);
const vehicleType = VehicleType(Api);
const trackingAssets = TrackingAssets(Api);
const dispatchManagement = DispatchServices(Api);
const users = UserServices(Api);
const tracking = TrackingServices(Api);
const contract = ContractServices(Api);
const freight = FreightRateServices(Api);
const freightType = FreightTypeServices(Api);
const notification = NotificationServices(Api);
const freightReconciliation = FreightReconciliationServices(Api);
const billGenerate = BillGenerateServices(Api);
const inTransitEfficiency = IntransitEfficiencyServices(Api);
const sobReport = SobServices(Api);
const sobServices = SobListingServices(Api);
const onTimeDispatchReport = OnTimeDispatchReportServices(Api);
const placementEfficiency = PlacementEfficiencyServices(Api);
const loadability = LoadabilityServices(Api);
const detentionReport = DetentionReportServices(Api);
const allPerformanceReport = AllPerformanceReportServices(Api);
const shortageDamageReport = ShortageDamageReport(Api);
const monthlyFreightReport = MonthlyFreightReport(Api);
const freightPaymentReport = FreightPaymentReport(Api);
const vehiclePlacementReport = VehiclePlacementServices(Api);
const auction = AuctionServices(Api);
const bulk = BulkUploadServices(Api);
const mis = MisServices(Api);
const stock = StockServices(Api);
const product = ProductServices(Api);
const agn = AgnServices(Api);
const planning = PlanningServices(Api);
const das = DasServices(Api);
const shipment = ShipmentServices(Api);
const indent = IndentServices(Api);
const indentDashboard = IndentDashboardServices(Api);
const deliveryReport = DeliveryServices(Api);
const downloadBulkCsv = DownloadBulkCsvServices(Api);
const alert = AlertServices(Api);
const serviceability = ServiceabilityServices(Api);
const config = ConfigServices(Api);
const simTracking = SimTrackingServices(Api);
const jira = JiraServices(Api);
const exportServices = ExportServices(Api);
const inplant = InplantServices(Api);
const trackRequestVehicle = TrackRequestVehicleTypeServices(Api);
const forwardTracking = ForwadTrackingServices(Api);
const freightPaymentReportDownload = FreightPaymentReport(DownloadApi);
const placementEfficiencyDownload = PlacementEfficiencyServices(DownloadApi);
const inTransitEfficiencyDownload = IntransitEfficiencyServices(DownloadApi);
const onTimeDispatchReportDownload = OnTimeDispatchReportServices(DownloadApi);
const shortageDamageReportDownload = ShortageDamageReport(DownloadApi);
const forwardTrackingDownload = ForwadTrackingServices(DownloadApi);
const vehiclePlacementReportDownload = VehiclePlacementServices(DownloadApi);
const detentionReportDownload = DetentionReportServices(DownloadApi);
const indentDashboardDownload = IndentDashboardServices(DownloadApi);
const deliveryReportDownload = DeliveryServices(DownloadApi);
const monthlyFreightReportDownload = MonthlyFreightReport(DownloadApi);
const sobReportDownload = SobServices(DownloadApi);
const loadabilityDownload = LoadabilityServices(DownloadApi);
const zone = ZoneServices(Api);

export {
  app,
  material,
  consignee,
  roles,
  partners,
  lane,
  vehicles,
  location,
  order,
  vehicleType,
  trackingAssets,
  users,
  tracking,
  contract,
  freight,
  freightType,
  planning,
  dispatchManagement,
  notification,
  freightReconciliation,
  billGenerate,
  inTransitEfficiency,
  onTimeDispatchReport,
  placementEfficiency,
  detentionReport,
  allPerformanceReport,
  shortageDamageReport,
  monthlyFreightReport,
  freightPaymentReport,
  vehiclePlacementReport,
  bulk,
  mis,
  stock,
  product,
  agn,
  das,
  loadability,
  sobReport,
  sobServices,
  auction,
  shipment,
  indent,
  deliveryReport,
  indentDashboard,
  downloadBulkCsv,
  alert,
  serviceability,
  config,
  simTracking,
  jira,
  exportServices,
  inplant,
  trackRequestVehicle,
  forwardTracking,
  freightPaymentReportDownload,
  placementEfficiencyDownload,
  inTransitEfficiencyDownload,
  onTimeDispatchReportDownload,
  shortageDamageReportDownload,
  forwardTrackingDownload,
  vehiclePlacementReportDownload,
  detentionReportDownload,
  indentDashboardDownload,
  deliveryReportDownload,
  monthlyFreightReportDownload,
  sobReportDownload,
  loadabilityDownload,
  zone
};

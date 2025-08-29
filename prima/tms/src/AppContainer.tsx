import React, { Suspense, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as Path from './base/constant/RoutePath';
import MessageAlertBox from './component/alert/MessageAlertBox';
import DataNotFound from './component/error/DataNotFound';
import Header from './component/header/Header';
import Loader from './component/loader/Loader';
import SideNavigation from './component/sideNavigation/MenuBar';
import SupportModal from "./modals/supportModal/SupportModal";
import AllNotification from "./pages/allNotification/AllNotification";
import AllPerformanceReport from "./pages/analytics/allPerformanceReport/AllPerformanceReport";
import DeliveryReport from "./pages/analytics/deliveryReport/DeliveryReport";
import DetentionReport from "./pages/analytics/detentionReport/DetentionReport";
import ForwardTracking from "./pages/analytics/forwardTracking/ForwardTracking";
import FreightPaymentReport from "./pages/analytics/freightPaymentReport/FreightPaymentReport";
import IntransitEfficiency from "./pages/analytics/inTransitEfficiency/InTransitEfficiency";
import LoadabilityReport from "./pages/analytics/loadabilityReport/LoadabilityReport";
import MonthlyFreightReport from "./pages/analytics/monthlyFreightReport/MonthlyFreightReport";
import OnTimeDispatchReport from "./pages/analytics/onTimeDispatchReport/OnTimeDispatchReport";
import PlacementEfficiency from "./pages/analytics/placementEfficiency/PlacementEfficiency";
import ShortageDamageReport from "./pages/analytics/shortageDamageReport/shortageDamageReport";
import SobReport from "./pages/analytics/sobReport/SobReport";
import VehiclePlacementReport from "./pages/analytics/vehiclePlacementReport/VehiclePlacementReport";
import AuctionDetail from "./pages/auctionManagement/AuctionDetail";
import AuctionListing from "./pages/auctionManagement/AuctionListing";
import CreateAuction from "./pages/auctionManagement/CreateAuction";
import UpdateAuction from "./pages/auctionManagement/UpdateAuction";
import BulkUploadTrack from "./pages/bulkUploadTrack/BulkUploadListing";
import BulkUploadTrackView from "./pages/bulkUploadTrack/BulkUploadTrackView";
import Dashboard from './pages/dashboard/DashboardPage';
import ElrReceipt from "./pages/dispatch/elrReceipt/ElrReceipt";
import GateIn from "./pages/dispatch/gateIn/GateIn";
import GateOut from "./pages/dispatch/gateOut/GateOut";
import InboundListing from "./pages/dispatch/inbound/InboundListing";
import DispatchListing from "./pages/dispatch/list/DispatchListing";
import Reports from './pages/dispatch/reports/DispatchDashboard';
import CreateDiversionOrder from "./pages/Exception/CreateDiversionOrder";
import DiversionDetails from "./pages/Exception/DiversionDetails";
import DiversionListing from "./pages/Exception/DiversionListing";
import { default as DiversionRequestDetail } from "./pages/Exception/DiversionRequestDetail";
import ExportModuleData from "./pages/exportModuleData/ExportModuleData";
import CreateBulkDemandOrdersView from "./pages/freight/CreateBulkDemandOrdersView";
import AssignBulkDemandOrder from "./pages/freight/demandOrders/AssignBulkDemandOrderView";
import AssignDemandOrder from "./pages/freight/demandOrders/AssignDemandOrder";
import DODetails from "./pages/freight/demandOrders/demandOrderDetails";
import DOListing from "./pages/freight/demandOrders/demandOrderListing";
import OrderDetails from './pages/freight/order/OrderDetails';
import OrderListing from "./pages/freight/order/OrderListing";
import TrackRequestListing from "./pages/freight/order/TrackRequestListing";
import PODetails from "./pages/freight/purchaseOrders/PODetails";
import POListing from "./pages/freight/purchaseOrders/POListing";
import CreateOrder from './pages/freight/raiseOrders/CreateOrder';
import ShipmentOrderDetails from "./pages/freight/raiseOrders/ShipmentOrderDetails";
import SODetails from "./pages/freight/so/SODetails";
import SOListing from "./pages/freight/so/SOListing";
import STODetails from "./pages/freight/sto/STODetails";
import STOListing from "./pages/freight/sto/STOListing";
import CreateIndent from "./pages/indentManagement/indent/CreateIndent";
import IndentDashboard from "./pages/indentManagement/indent/IndentDashboard";
import IndentDetail from "./pages/indentManagement/indent/IndentDetail";
import IndentListing from "./pages/indentManagement/indent/IndentListing";
import AgnCreate from "./pages/inventoryManagement/AGN/AgnCreate";
import AgnListing from "./pages/inventoryManagement/AGN/AgnListing";
import AgnReceiveListing from "./pages/inventoryManagement/AGN/AgnReceive";
import AgnHistoryListing from "./pages/inventoryManagement/AgnHistory/AgnHistoryListing";
import AgnHistoryListingView from "./pages/inventoryManagement/AgnHistory/AgnHistoryListingView";
import ForecastListing from "./pages/inventoryManagement/Forecast/ForecastListing";
import InventoryViewListing from "./pages/inventoryManagement/InventoryView/InventoryViewListing";
import SalesOrderListing from "./pages/inventoryManagement/SalesOrder/SalesOrderListing";
import FreightBillingInvoiceList from "./pages/invoice/billGenerate/FreightBillingInvoiceList";
import BulkInvoiceApprovalList from "./pages/invoice/bulkApproval/BulkInvoiceApprovalList";
import Claims from "./pages/invoice/claims/Claims";
import Epod from "./pages/invoice/epod/Epod";
import FreightReconcilationPeriodicInvoice from "./pages/invoice/freightReconciliation/FreightReconcilationPeriodicInvoice";
import FreightReconciliationListing from './pages/invoice/freightReconciliation/FreightReconciliationListing';
import FreightReconciliationTripInvoice from "./pages/invoice/freightReconciliation/FreightReconciliationTripInvoice";
import FreightBillingPeriodicInvoice from "./pages/invoice/invoiceInfo/FreightBillingPeriodicInvoice";
import FreightBillingTripInvoice from "./pages/invoice/invoiceInfo/FreightBillingTripInvoice";
import NoDuesCertificate from "./pages/invoice/noDuesCertificate/NoDuesCertificate";
import NoDuesCertificateCard from "./pages/invoice/noDuesCertificate/NoDuesCertificateCard";
import InvoicePrint from "./pages/invoice/printable/InvoicePrint";
import ConsigneeListing from "./pages/masterPlatform/Consignees/ConsigneeListing";
import CustomerListing from "./pages/masterPlatform/Customers/CustomerListing";
import FreightTypeListing from "./pages/masterPlatform/freightType/FreightTypeListing";
import LaneWrapper from "./pages/masterPlatform/lane/LaneWrapper";
import CreateLocation from "./pages/masterPlatform/location/CreateLocation";
import LocationListing from './pages/masterPlatform/location/LocationListing';
import LocationTypeListing from "./pages/masterPlatform/locationType/LocationTypeListing";
import CreateDriver from "./pages/masterPlatform/masterDriver/CreateDriver";
import MasterDriverListing from "./pages/masterPlatform/masterDriver/MasterDriverListing";
import MaterialListing from "./pages/masterPlatform/materials/MaterialListing";
import PartnerListing from "./pages/masterPlatform/partner/PartnerListing";
import ProductListing from "./pages/masterPlatform/product/ProductListing";
import ServiceabilityListing from "./pages/masterPlatform/serviceability/ServiceabilityListing";
import trackingAssetsListing from "./pages/masterPlatform/trackingAssets/TrackingAssetsListing";
import CreateVehicle from "./pages/masterPlatform/vehicle/CreateVehicle";
import VehicleMaster from "./pages/masterPlatform/vehicle/VehicleListing";
import VehicleTypeListing from "./pages/masterPlatform/vehicleType/VehicleTypeListing";
import ZoneListing from "./pages/masterPlatform/zone/ZoneListing";
import ZoneWrapper from "./pages/masterPlatform/zone/ZoneWrapper";
import PlanningCreatePlanListing from "./pages/planning/createPlan/CreatePlan";
import PlanningDashboard from './pages/planning/dashboard/PlanningDashboard';
import PlanningDispatchHistoryListing from './pages/planning/dispatchPlanningHistory/PlanningDispatchHistoryListing';
import PanningHistoryListing from "./pages/planning/history/PlanningHistoryList";
import PanningDispatchListing from "./pages/planning/jobs/PlanningDispatchListing";
import PlanningShipments from "./pages/planning/shipments/PlanningShipments";
import PlanningShipmentsUpload from "./pages/planning/shipments/PlanningShipmentsUpload";
import ContractListing from "./pages/procurement/contractV2/ContractListing";
import CreateContract from "./pages/procurement/contractV2/CreateContract";
import CreateContractFreight from './pages/procurement/contractV2/CreateContractFreight';
import PendingContractListing from "./pages/procurement/contractV2/PendingContractListing";
import MonthlyFreightRateListing from "./pages/procurement/monthlyFreightRate/MonthlyFreightRateListing";
import CreateSOB from './pages/procurement/sob/CreateSOB';
import SobEditListing from "./pages/procurement/sob/SobEditListing";
import SobListing from "./pages/procurement/sob/SobListing";
import FreightPaymentNotification from "./pages/pushNotificatin/freightPaymentNotification/FreightPaymentNotification";
import PushNotification from "./pages/pushNotificatin/PushNotification";
import RolesListing from './pages/setting/roles/RolesListing';
import UserList from "./pages/setting/user/UserList";
import ShipmentLogDetail from "./pages/shipmentLogs/ShipmentLogDetail";
import ShipmentLogListing from "./pages/shipmentLogs/ShipmentLogListing";
import SimTrackingDetail from "./pages/simTracking/SimTrackingDetail";
import SimTrackingListing from "./pages/simTracking/SimTrackingListing";
import TrackingDashboardWrapper from "./pages/tracking/dashboardTracking/TrackingDashboardWrapper";
import FreightListing from "./pages/tracking/freightOrder/FreightListing";
import ShipmentDetail from "./pages/tracking/freightOrder/ShipmentDetail";
import VehicleTracking from "./pages/tracking/VehicleTracking";
import { askForPermissionToReceiveNotifications, isSupported, messaging, refreshToken } from "./push-notification";
import { setRefreshCount, toggleModal } from './redux/actions/AppActions';
import { updateToken } from './serviceActions/NotificationServiceAction';

function AppContainer() {

  const appDispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.appReducer.userInfo, shallowEqual);
  const openSupportModal = useSelector((state: any) => state.appReducer.openModal, shallowEqual);

  useEffect(() => {
    const askPermission = async () => {
      askForPermissionToReceiveNotifications(messaging);
      messaging?.onMessage((payload: any) => {
        const { title } = payload.notification;
        var options = {
          body: payload.notification.body,
          click_action: payload.notification.click_action, // To handle notification click when notification is moved to notification tray
          data: {
            click_action: payload.notification.click_action
          },
        };
        var notification = new Notification(title, options);
        notification.onclick = function (event: any) {
          notification.close();
          window.location.replace(event.target.data.click_action);
          window.focus();
        };
        appDispatch(setRefreshCount());
      });
    };

    isSupported() && messaging && askPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messaging]);

  useEffect(() => {
    const refreshTokenFunction = async () => {
      refreshToken(messaging).then((token: any) => {
        if (token) {
          let params: any = {
            data: token,
            notificationType: "PUSH_WEB"
          }
          appDispatch(updateToken(params));
        };
      }
      )
    }
    isSupported() && refreshTokenFunction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <Router>
      <Switch>
        <Route>
          <div id="wrapper">
            <Suspense fallback={<Loader loading={true} />}>
              <Header />
              <MessageAlertBox />
              <SupportModal
                open={openSupportModal}
                onApply={() => {
                  appDispatch(toggleModal());
                }}
                onClose={() => {
                  appDispatch(toggleModal());
                }}
              />
              <div className="main-page d-flex">
                <SideNavigation />
                <div className="main-content col">
                  <div className="page-container">
                    <Switch>
                      {userInfo && userInfo.locationName && (
                        <>
                          <Route exact path={Path.DASHBOARDUrl} component={Dashboard} />
                          <Route exact path={Path.LocationUrl} component={LocationListing} />
                          <Route exact path={Path.UsersUrl} component={UserList} />
                          <Route exact path={Path.RolesUrl} component={RolesListing} />
                          <Route exact path={Path.ReportsUrl} component={Reports} />
                          <Route exact path={Path.VehicleUrl} component={VehicleMaster} />
                          <Route exact path={Path.OrderListingUrl} component={OrderListing} />
                          <Route exact path={Path.PlaningDashboardUrl} component={PlanningDashboard} />
                          <Route exact path={Path.PanningDispatchPlansUrl + ":code?"} component={PanningDispatchListing} />
                          <Route exact path={Path.PlanningShipmentsUrl} component={PlanningShipments} />
                          <Route exact path={Path.PlanningShipmentsUploadUrl} component={PlanningShipmentsUpload} />
                          <Route exact path={Path.PanningDispatchListingUrl} component={PlanningDispatchHistoryListing} />
                          <Route exact path={Path.PlanningHistoryUrl} component={PanningHistoryListing} />
                          <Route exact path={Path.PlanningCreatePlanUrl + ":id?"} component={PlanningCreatePlanListing} />
                          <Route exact path={Path.RaiseIndentUrl + ":id?"} component={CreateOrder} />
                          <Route exact path={Path.NotificationUrl} component={AllNotification} />
                          <Route exact path={Path.PartnersUrl} component={PartnerListing} />
                          <Route exact path={Path.MaterialUrl} component={MaterialListing} />
                          <Route exact path={Path.ConsigneesUrl} component={ConsigneeListing} />
                          <Route exact path={Path.CustomerUrl} component={CustomerListing} />
                          <Route exact path={Path.InboundUrl} component={InboundListing} />
                          <Route exact path={Path.DispatchUrl} component={DispatchListing} />
                          <Route exact path={Path.FreightReconciliationUrl} component={FreightReconciliationListing} />
                          <Route exact path={Path.FreightReconciliationTripInvoiceUrl + ":id?"} component={FreightReconciliationTripInvoice} />
                          <Route exact path={Path.FreightReconciliationPeriodicInvoiceUrl + ":id?"} component={FreightReconcilationPeriodicInvoice} />
                          <Route exact path={Path.FreightBillingListUrl + ":id?"} component={FreightBillingInvoiceList} />
                          <Route exact path={Path.FreightBillingTripInvoiceUrl + ":id?"} component={FreightBillingTripInvoice} />
                          <Route exact path={Path.FreightBillingPeriodicInvoiceUrl + ":id?"} component={FreightBillingPeriodicInvoice} />
                          <Route exact path={Path.ContractUrl} component={ContractListing} />
                          <Route exact path={Path.SobUrl} component={SobListing} />
                          <Route exact path={Path.SobEditUrl} component={SobEditListing} />
                          <Route exact path={Path.SobCreateUrl} component={CreateSOB} />
                          <Route exact path={Path.PendingContractUrl} component={PendingContractListing} />
                          <Route exact path={Path.VehicleTypeUrl} component={VehicleTypeListing} />
                          <Route exact path={Path.TrackingAssetsUrl} component={trackingAssetsListing} />
                          <Route path={Path.TrackingDashBoardUrl} component={TrackingDashboardWrapper} />
                          <Route exact path={Path.TrackingUrl + ":id?"} component={VehicleTracking} />
                          <Route exact path={Path.NoDuesCertificatesUrl} component={NoDuesCertificate} />
                          <Route exact path={Path.ContractCreateUrl + ":id?"} component={CreateContract} />
                          <Route exact path={Path.ContractFreightCharges + ":id?"} component={CreateContractFreight} />
                          <Route exact path={Path.ViewContractFreightCharges + ":id?"} > <CreateContractFreight editMode /> </Route>
                          <Route exact path={Path.ConfigUrl} component={FreightPaymentNotification} />
                          <Route exact path={Path.FreightTypeUrl} component={FreightTypeListing} />
                          <Route exact path={Path.SOListingUrl + ":id?"} component={SOListing} />
                          <Route exact path={Path.SODetailsUrl + ":id?"} component={SODetails} />
                          <Route exact path={Path.EditBulkSO} component={CreateBulkDemandOrdersView} />
                          <Route exact path={Path.EditBulkSTO} component={CreateBulkDemandOrdersView} />
                          <Route exact path={Path.EditBulkPO} component={CreateBulkDemandOrdersView} />
                          <Route exact path={Path.STOListingUrl + ":id?"} component={STOListing} />
                          <Route exact path={Path.STODetailsUrl + ":id?"} component={STODetails} />
                          <Route exact path={Path.POListingUrl + ":id?"} component={POListing} />
                          <Route exact path={Path.PODetailsUrl + ":id?"} component={PODetails} />
                          <Route exact path={Path.DOListingUrl + ":id?"} component={DOListing} />
                          <Route exact path={Path.DODetailsUrl + ":id?"} component={DODetails} />
                          <Route exact path={Path.AssignDemandOrderUrl + ":id/:currentTab?"} component={AssignDemandOrder} />
                          <Route exact path={Path.AssignBulkDemandOrderUrl} component={AssignBulkDemandOrder} />
                          <Route exact path={Path.NoDuesCertificateCardUrl + ":id?"} component={NoDuesCertificateCard} />
                          <Route exact path={Path.MonthlyFreightUrl} component={MonthlyFreightRateListing} />
                          <Route exact path={Path.PushNotificationUrl} component={PushNotification} />
                          <Route exact path={Path.ElrReceiptUrl + ":freightOrderCode"} component={ElrReceipt} />
                          <Route exact path={Path.InTransitEfficiencyUrl} component={IntransitEfficiency} />
                          <Route exact path={Path.OnTimeDispatchReportUrl} component={OnTimeDispatchReport} />
                          <Route exact path={Path.PlacementEfficiencyUrl} component={PlacementEfficiency} />
                          <Route exact path={Path.DetentionReportUrl} component={DetentionReport} />
                          <Route exact path={Path.AllPerformanceReportUrl} component={AllPerformanceReport} />
                          <Route exact path={Path.ShortageDamageReportUrl} component={ShortageDamageReport} />
                          <Route exact path={Path.MonthlyFreightReportUrl} component={MonthlyFreightReport} />
                          <Route exact path={Path.FreightPaymentReportUrl} component={FreightPaymentReport} />
                          <Route exact path={Path.VehiclePlacementUrl} component={VehiclePlacementReport} />
                          <Route exact path={Path.AgnUrl} component={AgnListing} />
                          <Route exact path={Path.AgnCreateUrl + ":id?"} component={AgnCreate} />
                          <Route exact path={Path.AgnReceiveUrl + ":id?"} component={AgnReceiveListing} />
                          <Route exact path={Path.AgnHistoryViewUrl + ":id?"} component={AgnHistoryListingView} />
                          <Route exact path={Path.AgnHistoryUrl} component={AgnHistoryListing} />
                          <Route exact path={Path.ForecastUrl} component={ForecastListing} />
                          <Route exact path={Path.InventoryViewUrl} component={InventoryViewListing} />
                          <Route exact path={Path.SalesOrderUrl} component={SalesOrderListing} />
                          <Route exact path={Path.EpodUrl + ":id/:freightShipmentCode"} component={Epod} />
                          <Route exact path={Path.ProductUrl} component={ProductListing} />
                          <Route exact path={Path.BulkUploadUrl} component={BulkUploadTrack} />
                          <Route exact path={Path.BulkUploadTrackViewUrl + ":id?"} component={BulkUploadTrackView} />
                          <Route exact path={Path.OrderDetailsUrl + ":id?"} component={OrderDetails} />
                          <Route exact path={Path.LoadabilityReportUrl} component={LoadabilityReport} />
                          <Route exact path={Path.SobReporttUrl} component={SobReport} />
                          <Route exact path={Path.ClaimsUrl + ":id?"} component={Claims} />
                          <Route exact path={Path.invoicePrintUrl + ":id?"} component={InvoicePrint} />
                          <Route exact path={Path.AuctionListUrl} component={AuctionListing} />
                          <Route exact path={Path.AuctionDetaillUrl + ":id?"} component={AuctionDetail} />
                          <Route exact path={Path.AuctionCreateUrl} component={CreateAuction} />
                          <Route exact path={Path.AuctionUpdateUrl + ":id?"} component={UpdateAuction} />
                          <Route exact path={Path.ShipmentOrderDetailsUrl} component={ShipmentOrderDetails} />
                          <Route exact path={Path.GateInUrl + ":id?"} component={GateIn} />
                          <Route exact path={Path.GateOutUrl + ":id?"} component={GateOut} />
                          <Route exact path={Path.FreightShipmentUrl} component={FreightListing} />
                          <Route exact path={Path.ShipmentUrl + ":id?"} component={ShipmentDetail} />
                          <Route exact path={Path.CreateLocationUrl + ":id?"} component={CreateLocation} />
                          <Route exact path={Path.LocationTypeUrl} component={LocationTypeListing} />
                          <Route path={Path.LaneUrl} component={LaneWrapper} />
                          <Route exact path={Path.IndentListUrl} component={IndentListing} />
                          <Route exact path={Path.IndentCreateUrl} component={CreateIndent} />
                          <Route exact path={Path.IndentDetailUrl} component={IndentDetail} />
                          <Route exact path={Path.DeliveryReportUrl} component={DeliveryReport} />
                          <Route exact path={Path.IndentDashboardUrl} component={IndentDashboard} />
                          <Route exact path={Path.ServiceabilityUrl} component={ServiceabilityListing} />
                          <Route exact path={Path.ZoneUrl} component={ZoneListing} />
                          <Route exact path={Path.ZoneUrlView + ":id?"} component={ZoneWrapper} />
                          <Route exact path={Path.OrderELRUrl + ":freightOrderCode"} component={ElrReceipt} />
                          <Route exact path={Path.OrderPODUrl + ":id/:freightShipmentCode"} component={Epod} />
                          <Route exact path={Path.SimTrackingUrl} component={SimTrackingListing} />
                          <Route exact path={Path.SimTrackingDetailUrl + ":id?"} component={SimTrackingDetail} />
                          <Route exact path={Path.ExportModuleDataUrl} component={ExportModuleData} />
                          <Route exact path={Path.InvoiceBulkApproveListUrl} component={BulkInvoiceApprovalList} />
                          <Route exact path={Path.ShipmentTrackingLogsDataUrl} component={ShipmentLogListing} />
                          <Route exact path={Path.ShipmentTrackingLogsDetailsUrl + ":id?"} component={ShipmentLogDetail} />
                          <Route exact path={Path.MasterDriverUrl} component={MasterDriverListing} />
                          <Route exact path={Path.CreateDriverUrl} component={CreateDriver} />
                          <Route exact path={Path.UpdateDriverUrl} component={CreateDriver} />
                          <Route exact path={Path.DiversionUrl + ":tabName?"} component={DiversionListing} />
                          <Route exact path={Path.DiversionRequestDetailsUrl + ":requestId"} component={DiversionRequestDetail} />
                          <Route exact path={Path.DiversionDetailUrl + ":requestId"} component={DiversionDetails} />
                          <Route exact path={Path.DiversionCreateOrderUrl + ":requestId"} component={CreateDiversionOrder} />
                          <Route exact path={Path.TrackRequestUrl + ":id?"} component={TrackRequestListing} />
                          <Route exact path={Path.ForwardTrackingUrl} component={ForwardTracking} />
                          <Route exact path={Path.CreateVehicleUrl} component={CreateVehicle} />
                          <Route exact path={Path.UpdateVehicleUrl} component={CreateVehicle} />
                        </>
                      )}
                      <Route component={DataNotFound} />
                    </Switch>
                  </div>
                </div>
              </div>
            </Suspense>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}
export default AppContainer;

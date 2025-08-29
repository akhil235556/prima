export const auth = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5ESkdSVVV3T0VFMk1rVTNRVGRGUkVNeE16SkVSVVpFUXpWQk1UVTRPRGc0TURJM1F6RXpRdyJ9.eyJodHRwczovL2dvb2dsZV9lbmRwb2ludHMvcmVzb2x1dGlvbiI6IkNMSUVOVHxHQkxUfDY2fDRjMTM3MDljLTBmNjUtNDIwNS1hYTFlLTkxMzBhOTBiZmM1NXxQQVJUSVRJT04iLCJodHRwczovL2dvb2dsZV9lbmRwb2ludHMvcm9sZXMiOlsiaW52b2ljZS12aWV3ZXIiLCJpbnZvaWNlLWVkaXRvciIsImFsZXJ0cy1lZGl0b3IiLCJwYXltZW50cy12aWV3ZXIiLCJwYXltZW50cy1lZGl0b3IiLCJwYXltZW50cy1hcHByb3ZlciIsIndhbGxldC12aWV3ZXIiLCJ3YWxsZXQtZWRpdG9yIl0sImh0dHBzOi8vZ29vZ2xlX2VuZHBvaW50cy91c2VyX21ldGEiOnsiZW1haWwiOiJoYXJqaW5kZXIxLmthdXJAZ29ib2x0LmNvLmluIiwiZW5hYmxlZF9sb2NhdGlvbnMiOltdfSwiaHR0cHM6Ly9nb29nbGVfZW5kcG9pbnRzL3Nlc3Npb25faWQiOiJiYmQwNzI2Zi1mMDAwLTQ0YjgtYTFiMC04Zjg1NDFkMWM5NGYiLCJodHRwczovL2dvb2dsZV9lbmRwb2ludHMvdXNlcl9pZCI6ImF1dGgwfDRjMTM3MDljLTBmNjUtNDIwNS1hYTFlLTkxMzBhOTBiZmM1NSIsImlzcyI6Imh0dHBzOi8vZ29ib2x0LWRldi5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NGMxMzcwOWMtMGY2NS00MjA1LWFhMWUtOTEzMGE5MGJmYzU1IiwiYXVkIjoiaHR0cHM6Ly9nb29nbGVfZW5kcG9pbnRzLyIsImlhdCI6MTY2MjA5NDQ1MSwiZXhwIjoxNjYyMTgwODUxLCJhenAiOiJlYmgzWmNCb1IxVFRBVHNqclBNOUxWUUZKUjFsVlJMSSJ9.oviqZCTWjCM0rrQObDfwvqnMF7efs0NUQMvuUwj8I98vl5qMGuR-jK_20nlS4SUGpNw0rDS3mJRE2xJEH2IzNHIN_a_6vVTfR_-GdXznxqzGeTW0CmqnGWeB9Vubovrq9VJQCIQULXBUQLU5EbkA-TVOZSENROLBlPN4_AZ9pVD5IzDpc8woJinJBKaF720WfaRNo3iUztvh-lmzV2vESr_mb9ynOJdQUfIcjDbNsXai_LryAo1LYo-oPxJvSFxR86qZP9WlK15WkeKseaHGOLFmeDY4UHYzoRAwnCgWCfImZCEthYML7naryHUcZgsdJgNVZ1s1uAQNqSwjrubl7w";
export const menuTemplateUrl = "";
export const getUserProfileUrl = "";

//MATERIAL MASTER APIS
//https://portal.gobolt.team/docs/articles.gobolt.dev/g/introduction
export const materialListUrl = "/_svc/articles/v1/list";
export const searchMaterialListUrl = "/_svc/proxy-masters/v1/articles/search";
export const createMaterialUrl = "/_svc/articles/v1/create";
export const updateMaterialUrl = "/_svc/articles/v1/update";
export const bulkMaterialUnitCountUrl = "/_svc/proxy-masters/v1/articles/bulk-details";
export const convertUomUrl = "/_svc/articles/v1/convert-uom";

// consignee details
export const ConsigneeListUrl = "_svc/participants/v1/client-customer-details/_pagination";
export const createConsigneeUrl = "_svc/participants/v1/customer/map";
export const updateConsigneeUrl = "_svc/participants/v1/customer";
export const consigneeCsvUrl = "/_svc/participants/v1/client-customer/download";

// https://portal.gobolt.team/docs/permissions.gobolt.dev/g/introduction
export const rolesListUrl = "_svc/permissions/v1/roles/_pagination"; //GET
export const allRolesUrl = "_svc/permissions/v1/roles"; //GET
export const createRoleUrl = "_svc/permissions/v1/roles"; //PTSt
export const setRolesPermissionUrl = "_svc/permissions/v1/roles-permissions/absolute";
export const getRolesPermissionUrl = "_svc/permissions/v1/roles-permissions";
export const permissionListUrl = "_svc/permissions/v1/permissions";
// export const permissionListUrl = "_svc/permissions//v1/permissions/tag_list";

export const getUserRolesAndPermissionUrl = "_svc/permissions/v1/user-roles-permissions"; //GET
export const setUserRolesAndPermissionUrl = "_svc/permissions/v1/user-roles-permissions"; //PUT

// https://portal.gobolt.team/docs/users.gobolt.dev/g/introduction
export const userListUrl = "_svc/users/v1/users/_pagination"; //GET
export const enabledUserLocationUrl = "_svc/users/v1/users/enabled/locations"; //GET
export const createUserUrl = "_svc/users/v1/users"; //POST
export const getUserUrl = "_svc/users/v1/users"; //GET
export const setUserLocationUrl = "_svc/users/v1/users/select-location"; //PUT
export const updateUserLocationUrl = "_svc/users/v1/users/locations"; //PUT
export const getLoggedInUserInfoUrl = "_svc/users/v1/user-profile";
export const usersListUrl = "_svc/proxy-masters/v1/users-node/authorized"
export const checkUserCreateUrl = "_svc/users/v1/check-if-user-create/allowed";


//PARTNER  MASTER APIS
// https://portal.gobolt.team/docs/participants.gobolt.dev/g/routes/v1/partner/get
export const partnerListUrl = "/_svc/participants/v1/partner/_pagination"; //GET
export const clientPartnerPartnerListUrl = "/_svc/participants/v1/client-partner-details/_pagination"; //GET
export const searchClientPartnerPartnerUrl = "/_svc/proxy-masters/v1/client-partner-details"; //GET
export const searchCustomerUrl = "/_svc/proxy-masters/v1/client-customer-details/_pagination"; //GET
export const searchPartnerUrl = "/_svc/participants/v1/partner"; //GET
// export const enablePartnerUrl = "/_svc/participants/v1/client-partners"; //POST
export const enablePartnerUrl = "/_svc/participants/v1/enable-partner"; //POST
export const getPartnerUrl = "/_svc/participants/v1/partner-check"
export const contractTerminateUrl = "/_svc/participants/v1/partner-disable";
export const disableClientPartnerRltnUrl = "/_svc/participants/v1/client-partners";
export const notenabledPartnerRltnUrl = "/_svc/participants/v1/enable-partner-details";
export const createPartnerUrl = "/_svc/participants/v1/partner/map"

//https://portal.gobolt.team/docs/locations.gobolt.dev/g/introduction
export const laneListUrl = "/_svc/locations/v1/lane/list";
export const createLaneUrl = "/_svc/locations/v1/lane/create";
export const updateLaneUrl = "/_svc/locations/v1/lane/update";
export const searchV1LaneUrl = "/_svc/proxy-masters/v1/lane/search";
export const searchLaneUrl = "/_svc/proxy-masters/v2/lane/search";
export const getLaneBasedOnLocations = "/_svc/locations/v1/lane/filter";
export const taggedLocationsUrl = "_svc/locations/v1/location/consignee-location";


export const createLanePartnerUrl = "/_svc/locations/v1/sob-multiple";
export const searchLanePartnerUrl = "/_svc/locations/v1/lane-partner/query";
export const getLaneLocationsUrl = "/_svc/locations/v1/lane/loc-data";
export const getLaneSobUrl = "/_svc/locations/v1/sob";
export const getStateListUrl = "_svc/locations/v1/location/state"

export const locationListUrl = "/_svc/locations/v2/location/list";
export const nodalLocationListUrl = "/_svc/locations/v1/location/nodal";
export const waypointsDataUrl = "/_svc/locations/v1/location/filter";
export const allLocationUrl = "/_svc/proxy-masters/v1/location/all";
export const createLocationUrl = "/_svc/locations/v2/location/create";
export const updateLocationUrl = "/_svc/locations/v1/location/update";
// export const searchLocationUrl = "/_svc/proxy-masters/v1/location/search";
export const searchLocationUrl = "/_svc/proxy-masters/v2/location/search";
export const getMasterLocationDetailsUrl = "/_svc/locations/v2/location/get";
export const cityListUrl = "/_svc/locations/v1/city/list";
export const getLaneDetailsUrl = "/_svc/proxy-masters/v2/lane/search";
export const getMasterLaneDetailsUrl = "/_svc/locations/v1/lane/search";
export const locationType = "/_svc/locations/v1/location/type";
export const subLocationListUrl = "/_svc/locations/v1/sublocation/list";
export const locationTypeUrl = "/_svc/locations/v1/location/type";
export const enableLocationTypeUrl = "/_svc/locations/v1/location/type";
export const allLocationTypeUrl = "/_svc/locations/v1/location/type/list";
export const dropPointsUrl = "/_svc/proxy-masters/v1/locationtag/list";
export const checkSubLocationUrl = "/_svc/locations/v1/location/check-sub-location";
export const searchZoneLocationUrl = "_svc/locations/v1/zone/search";
export const setZoneOriginUrl = "_svc/locations/v1/zone/user_zone";

//https://portal.gobolt.team/docs/vehicles.gobolt.dev/g/introduction
export const vehicleListUrl = "/_svc/vehicles/v1/vehicle";
export const searchVehicleNumberUrl = "/_svc/proxy-masters/v1/vehicle/search";
export const createVehicleUrl = "/_svc/vehicles/v1/vehicle";
export const createVehiclOnShipmenteUrl = "/_svc/proxy-masters/v1/vehicle";
export const getTrackingAssetsUrl = "/_svc/proxy-masters/v1/vehicles/tracking-asset";
export const searchPlatformVehicleUrl = "/_svc/vehicles/v1/platform-vehicle/search";
export const reportVehicletoHubUrl = "/_svc/vehicles/v1/vehicle/report";
export const getVehicleTemplateUrl = "/_svc/vehicles/v1/certificate-template"
export const getVehicleTemplateShipmentUrl = "/_svc/proxy-masters/v1/certificate-template"
export const getVehicleDetailsUrl = "/_svc/vehicles/v1/get-vehicle-by-code";
export const getVehicleDetailsShipmentUrl = "/_svc/proxy-masters/v1/get-vehicle-by-code";
export const updateVehicleDetailsUrl = "/_svc/vehicles/v2/update-vehicle"
export const updateVehicleDetailsOnShipmentUrl = "/_svc/proxy-masters/v2/update-vehicle"

//MASTER- VEHICLE_TYPE APIS
export const VehicleTypesListUrl = "/_svc/vehicles/v1/vehicle-type";
export const vehicleTypesSearchUrl = "/_svc/proxy-masters/v1/vehicle-type/search";
export const createVehicleTypeUrl = "/_svc/vehicles/v1/vehicle-type";
export const serviceableVehicleTypesUrl = "/_svc/proxy-masters/v1/serviceability/serviceable-vehicles"
export const updateVehicleTypeUrl = "_svc/freight-orders/v1/update-vehicleType";
export const validatePermissionUrl = "_svc/permissions/v1/user-roles-permissions"

//MASTER- TRACKING ASSETS API
export const TrackingAssetsListUrl = "/_svc/vehicles/v1/vehicles/tracking-asset";
export const VehicleDeviceListUrl = "/_svc/vehicles/v1/vehicles/tracking/device-types";
export const TrackingVendorListUrl = "/_svc/vehicles/v1/vehicles/vendor-list";
export const getTrackingAssetModalTemplate = "/_svc/vehicles/v1/vehicles/vendor-template";
export const createTrackingAssetUrl = "/_svc/vehicles/v1/vehicles/tracking-asset";

//PLANNING- DISPATCH PLANNING APIS
export const createTaskUrl = "/_svc/dispatch-planning/v1/dispatch/task/create";
export const jobListUrl = "/_svc/dispatch-planning/v1/task/list";
export const statusListUrl = "/_svc/dispatch-planning/v1/meta/task/status";
export const dispatchListingUrl = "/_svc/dispatch-planning/v1/dispatch/list";
export const planningHistoryUrl = "/_svc/dispatch-planning/v1/dispatch/log/history";
export const dashboardCountUrl = "/_svc/dispatch-planning/v1/meta/dashboard";

export const getPlanningHistoryListingUrl = "_svc/tms-planning/v1/planning/listing";
export const getPlanningResultsUrl = "_svc/tms-planning/v1/planning/result";
export const getPlanningRoutesUrl = "_svc/tms-planning/v1/planning/routes";
export const getPlanningTasksUrl = "_svc/tms-planning/v1/task/listing";
export const downloadPlanningOutputCsvUrl = "_svc/tms-planning/v1/planning-output-file";
export const downloadPlanningIndentOutputCsvUrl = "_svc/tms-planning/v1/planning-indent-output-file";
export const planningErrorUrl = "_svc/tms-planning/v1/error/listing";
export const downloadPlanningUploadSampleUrl = "_svc/tms-planning/v1/sample-file"
export const getPlanningEnginesUrl = "_svc/tms-planning/v1/planning/config";

//PLANNING-ORDER APIS
export const orderListUrl = "";

// InBound
// https://portal.gobolt.team/docs/freight-orders.gobolt.dev/g/introduction
export const freightOrderPeriodicInvoiceUrl = "/_svc/freight-billing/v1/freight-reconciliation/order/pagination";
export const inboundListUrl = "/_svc/freight-orders/v1/freight-order/_pagination";
export const freightOrderListUrl = "/_svc/proxy-masters/v1/freight-order/_pagination";
export const freightReconciliationListingUrl = "/_svc/freight-billing/v1/freight-reconciliation/pagination"
export const shipmentSaveTransactionDataUrl = "/_svc/freight-billing/v1/txn/save/bulk"
export const createPeriodicBillUrl = "/_svc/freight-billing/v2/bill/create/periodic"
export const freightReconciliationOrderDetailsUrl = "/_svc/freight-billing/v1/freight-reconciliation/details"
export const getFreightReconcilationContractDetailsUrl = "/_svc/freight-billing/v1/freight-reconciliation/order/details"
export const getFreightBillingContractDetailsUrl = "/_svc/freight-billing/v1/bill/order/charge-details"
export const freightInvoicingUrl = "/_svc/proxy-masters/v1/freight-order-invoicing/_pagination";
export const dashboardListUrl = "/_svc/freight-orders/v1/planned-sku-units";
export const dispatchManagementListingUrl = "/_svc/freight-orders/v1/freight-order/_pagination";
export const confirmPartnerUrl = "/_svc/freight-orders/v1/confirm-partner";
export const shipmentPlacedUrl = "/_svc/freight-orders/v1/shipment-placed";
export const shipmentOutUrl = "/_svc/freight-orders/v1/shipment-out";
export const addArticleInvoiceUrl = "/_svc/freight-orders/v1/add-article-invoice-details";
export const freightOrderCancelUrl = "/_svc/freight-orders/v1/freight-cancel";
export const createByDispatchUrl = "/_svc/freight-orders/v1/freight/create-by-dispatch";
export const assignPartnerUrl = "/_svc/freight-orders/v1/assign-partner";
export const raiseIndentUrl = "/_svc/freight-orders/v1/freight-order";
export const orderCreationUrl = "/_svc/workflowmanager/v1/order-creation";
export const addShipmentUrl = "/_svc/freight-orders/v1/freight-shipment";
export const editShipmentUrl = "/_svc/freight-orders/v1/freight-shipment";
export const getEpodDataUrl = "/_svc/freight-orders/v1/epod";
export const getELrDataUrl = "/_svc/freight-orders/v1/multiple-lorry-receipt";
export const markDeliveredUrl = "/_svc/freight-orders/v1/shipment-delivered";
export const shipmentReportUrl = "/_svc/freight-orders//v1/shipment-reported";
export const getClaimsUrl = "/_svc/freight-orders/v1/freight/get-claims";
export const saveClaimsUrl = "/_svc/freight-orders/v1/freight/save-claims";
export const countOrderData = "/_svc/freight-orders/v1/count";
export const inboundFreightListUrl = "/_svc/freight-orders/v1/inbound-freight-order/_pagination";
export const dispatchFreightListUrl = "/_svc/freight-orders/v1/dispatch-freight-order/_pagination";
export const updateReferenceId = "_svc/freight-orders/v1/freight/update-reference-id" // PUT
export const sobLaneContributionList = "_svc/freight-orders/v1/lane-sob-contribution"
export const indentCsvLinkUrl = "_svc/freight-orders/v1/lane-sob-contribution/_csv";
export const orderPickupDropLocationUrl = "_svc/freight-orders/v1/freight-order-pickups-drops";
export const orderPickupDropZoneLocationUrl = "_svc/locations/v1/zone/pickup-drops";
export const approversUrl = "_svc/freight-billing/v1/bill/approver"
export const getOrderLogsUrl = "_svc/freight-orders/v1/freight-action";
export const printInvoiceUrl = "_svc/integrator/v1/invoice/print"
export const cancelInvoiceUrl = "_svc/integrator/v1/invoice/cancel"
export const shipmentTagsListUrl = "_svc/freight-orders/v1/shipment-tag"
export const orderOrchestrationUrl = "_svc/workflowmanager/v1/orchestration";
export const downloadReconciliationCsvUrl = "_svc/export/v1/export/freight-reconciliation";
export const ptlStatusUrl = "_svc/freight-types/v1/get-zone-config-status";

//DIVERSION APIS
export const diversionListingUrl = "_svc/freight-orders/v1/order-diversion-request"
export const diversionDetailsUrl = "_svc/freight-orders/v1/order-diversion-request/detail"
export const diversionApproveUrl = "_svc/freight-orders/v1/order-diversion-request/approve"
export const diversionRejectUrl = "_svc/freight-orders/v1/order-diversion-request/reject";
export const diversionCreateFreightOrderUrl = "_svc/freight-orders/v1/order-diversion-request/create-freight-order"
export const diversionConfirmOrderUrl = "_svc/freight-orders/v1/order-diversion-request/confirm-order"
export const diversionPlaceOrderUrl = "_svc/freight-orders/v1/order-diversion-request/place-order"
export const diversionDispatchOrderUrl = "_svc/freight-orders/v1/order-diversion-request/dispatch-order"
export const diversionTotalMaterialListUrl = "_svc/freight-orders/v1/order-diversion-request/total-material-list"

//TRACKING APIS
export const startTripsUrl = "/_svc/trip/v2/trip/start/";
export const stopTripsUrl = "/_svc/trip/v2/trip/stop/";
export const addTripWayPointsUrl = "/_svc/trip/v1/trip/waypoints/";
export const getStoppageUrl = "/_svc/stoppages/v2/vehicle-stoppages/list";
export const getTripDetailsUrl = "/_svc/stoppages/v2/vehicle-stoppages/get-eta-delay";
export const getCurrentLocationUrl = "/_svc/tracking/v1/tracking/get-location/";
export const vehicleStatusUrl = "/_svc/stoppages/v2/vehicle-stoppages/currently-stopped/";
export const createTripUrl = "/_svc/trip/v2/trip";
export const trackingTripsUrl = "/_svc/trip/v2/trips";
export const trackingTripsListUrl = "/_svc/trip/v2/trip/status-count";
export const unknownCountList = "/_svc/trip/v2/trip/count";
export const tripDetail = "/_svc/trip/v2/trip-details";
export const driverConsentUrl = "/_svc/sim-tracking/v1/consent/check";
export const editDriverUrl = "/_svc/trip/v2/trip/update/driver-details";

export const getSpecificTatUrl = "/_svc/tat/v1/get";
export const getCsvLinkUrl = "/_svc/trip/v2/trip/search/download";
export const transientCountUrl = "/_svc/trip/v2/trip/transient-count";
export const pushLocationUrl = "/_svc/tracking/v2/tracking/client/manual/push-location";

// Procurement Api
// https://portal.gobolt.team/docs/contracts.gobolt.dev/g/introduction
export const getContractListUrl = "/_svc/contracts/v1/contract/query";
export const searchContractDetailsUrl = "/_svc/proxy-masters/v1/contract/query";
export const createContractUrl = "/_svc/contracts/v1/contract/create";
export const billingCycleUrl = "/_svc/contracts/v1/bill/cycle";
export const getApproveContractUrl = "/_svc/contracts/v1/contract/approve";
export const getTerminateContractUrl = "/_svc/contracts/v1/contract/terminate";
export const getActiveContractsUrl = "/_svc/contracts/v1/contract/get";
export const contractRenewUrl = "/_svc/contracts/v1/contract/renew";
export const getUnPaginatedContractListUrl = "/_svc/contracts/v1/contract/unpaginated-get";
export const bulkApproveContractUrl = "/_svc/contracts/v1/contract/bulk-approve";
export const payBulkBillUrl = "/_svc/freight-billing/v1/bill/bulk-pay";
export const contractCsvUrl = "/_svc/contracts/v1/contract/download";
export const searchContractIdUrl = "/_svc/contracts/v1/contract/search";
export const getSobContractsListUrl = "/_svc/contracts/v2/contracts/get"

// https://portal.gobolt.team/docs/freight-rates.gobolt.dev/g/introduction
export const freightListUrl = "/_svc/freight-rates/v1/freight/rate/query";
export const freightChargesUrl = "/_svc/freight-rates/v1/freight/rate/modifier";
export const freightVariableUrl = "/_svc/freight-rates/v1/freight/rate/variable";
export const createFreightRateUrl = "/_svc/freight-rates/v1/freight/rate/create";
export const createFreightDefinitionUrl = "/_svc/freight-rates/v1/freight/rate/definition/create";
export const updateFreightDefinitionUrl = "/_svc/freight-rates/v1/freight/rate/definition/update";
export const getFreightDefinitionUrl = "/_svc/freight-rates/v1/freight/rate/definition/get/contract";
export const getProxyFreightDefinitionUrl = "/_svc/proxy-masters/v1/freight/rate/definition/get/contract";

export const monthlyFreightListUrl = "/_svc/freight-rates/v1/freight/rate/monthly/query";
export const createMonthlyFreightUrl = "/_svc/freight-rates/v1/freight/rate/monthly/create";
export const getLanePriceUrl = "/_svc/proxy-masters/v1/freight/lane/price";
export const getPtlZoneContractUrl = "/_svc/contracts/v1/contract/query";


// freightType
// https://portal.gobolt.team/docs/freight-types.gobolt.dev/g/introduction

export const freightTypeListUrl = "/_svc/freight-types/v1/freight-type";
export const clientFreightTypeListUrl = "/_svc/proxy-masters/v1/client-freightType"; //Get
export const clientAllFreightTypeListUrl = "/_svc/participants/v1/client-freightType"; //Get
export const enableClientFreightTypeListUrl = "/_svc/participants/v1/client-freightType"; //Get
export const updateClientFreightTypeListUrl = "/_svc/participants/v1/client-freightType"; //Get
export const enableFreightTypeListUrl = "/_svc/participants/v1/client-freightType"; //Post

export const notificationUrl = "/_svc/notifications/v1/topic/subscribe";
export const odaPincodesCsvUrl = "/_svc/serviceability/v1/serviceability/oda-pincodes/csv";

//Freight Reconciliation APIS
export const freightReconciliationListUrl = "/_svc/freight-billing/v1/txn/query";
export const saveTransactionDetailsUrl = "/_svc/freight-billing/v1/txn/save/bulk"

//Bill Generate APIS
export const FreightBillingListUrl = "/_svc/freight-billing/v2/bill/query/";
export const freightBillingOrderDetailsUrl = "/_svc/freight-billing/v2/bill/details";
export const FreightBillingPeriodicInvoiceUrl = "/_svc/freight-billing/v2/bill/freight-bill-orders-details";
export const getUnapproveInvoiceListUrl = "/_svc/freight-billing/v1/bill/get-bulk"
export const invoiceTemplateUrl = "/_svc/freight-billing/v1/template";
export const getOrderTransactions = "/_svc/freight-billing/v1/txn/template/get";
export const getInvoiceTransactions = "/_svc/freight-billing/v1/bill/get";
export const generateBillUrl = "/_svc/freight-billing/v1/bill/create";
export const approveBillUrl = "/_svc/freight-billing/v1/bill/approve";
export const rejectBillUrl = "/_svc/freight-billing/v1/bill/cancel";
export const rejectPeriodicBillUrl = "/_svc/freight-billing/v2/bill/cancel/periodic";
export const updateBillUrl = "/_svc/freight-billing/v1/bill/update";
export const updatePeriodicBillUrl = "/_svc/freight-billing/v2/bill/update";
export const payBillUrl = "/_svc/freight-billing/v1/bill/pay";
export const noDuesUrl = "/_svc/freight-billing/v1/bill/no-dues";
export const aggregateUrl = "/_svc/freight-billing/v1/bill/aggregate/get";
export const getDisputeListUrl = "/_svc/freight-billing/v1/bill/dispute/get";
export const createDisputeUrl = "/_svc/freight-billing/v1/bill/dispute/create";
export const raiseDisputeUrl = "/_svc/freight-billing/v1/bill/dispute";
export const acceptBillUrl = "/_svc/freight-billing/v1/bill/accept";
export const resolveBillUrl = "/_svc/freight-billing/v1/bill/resolve";
export const disputeReasonsUrl = "/_svc/freight-billing/v1/bill/dispute/reason";
export const awaitBillUrl = "/_svc/freight-billing/v1/bill/await-approval";
export const commentsTransactionsUrl = "/_svc/freight-billing/v1/invoice-action";
export const bulkApproveInvoiceUrl = "/_svc/freight-billing/v1/bill/bulk-approve";
export const disputeModalOrderDetailsUrl = "/_svc/freight-billing/v2/bill/freight-orders";
export const disputeCreateV2Url = "/_svc/freight-billing/v2/bill/dispute/create"
export const resolveBillV2Url = "/_svc/freight-billing/v2/bill/resolve";

//Analytical APIS
export const inTransitEfficiencyListUrl = "/_svc/freight-reports/v1/mis/delivery/data";
export const inTransitEfficiencyCountListUrl = "/_svc/freight-reports/v1/mis/delivery/count";
export const vehiclePlacementCountListUrl = "/_svc/freight-reports/v1/mis/vehicle/placement/count";
export const getIECsvLinkUrl = "/_svc/freight-reports/v1/mis/delivery/download";
export const onTimeDispatchReportListUrl = "/_svc/freight-reports/v1/mis/dispatch-rdc/data";
export const onTimeDispatchReportCountListUrl = "/_svc/freight-reports/v1/mis/dispatch-rdc/count";
export const getOTDRCsvLinkUrl = "/_svc/freight-reports/v1/mis/dispatch-rdc/download";
export const dispatchGraphListUrl = "/_svc/freight-reports/v1/mis/dispatch-rdc/group";
export const PlacementEfficiencyListUrl = "/_svc/freight-reports/v1/mis/placement-efficiency/data";
export const PlacementEfficiencyCountListUrl = "/_svc/freight-reports/v1/mis/placement-efficiency/count";
export const getPECsvLinkUrl = "/_svc/freight-reports/v1/mis/placement-efficiency/download";
export const LoadabilityListListUrl = "/_svc/freight-reports/v1/mis/loadability/data";
export const LoadabilityCountListListUrl = "/_svc/freight-reports/v1/mis/loadability/count";
export const getLoadabilityCsvLinkUrl = "/_svc/freight-reports/v1/mis/loadability/download";
export const detentionReportListUrl = "/_svc/freight-reports/v1/mis/detention/data";
export const detentionGraphListUrl = "/_svc/freight-reports/v1/mis/detention/group";
export const getDRCsvLinkUrl = "/_svc/freight-reports/v1/mis/detention/download";
export const allPerformanceReportListUrl = "";
export const shortageDamageReportListUrl = "/_svc/freight-reports/v1/mis/shortage-damage/data";
export const shortageDamageReportCountListUrl = "/_svc/freight-reports/v1/mis/shortage-damage/count";
export const getSDRCsvLinkUrl = "/_svc/freight-reports/v1/mis/shortage-damage/download";
export const monthlyFreightReportListUrl = "/_svc/freight-reports/v1/mis/monthly/data";
export const getMFRCsvLinkUrl = "/_svc/freight-reports/v1/mis/monthly/download";
export const freightPaymentReportListUrl = "/_svc/freight-reports/v1/mis/freight-outstanding/data";
export const freightPaymentCountReportListUrl = "/_svc/freight-reports/v1/mis/freight-outstanding/count";
export const getFPRCsvLinkUrl = "/_svc/freight-reports/v1/mis/freight-outstanding/download";
export const sobReportList = "/_svc/freight-reports/v1/mis/sob/data";
export const sobReportCountListUrl = "/_svc/freight-reports/v1/mis/sob/group";
export const getSOBCsvLinkUrl = "/_svc/freight-reports/v1/mis/sob/download";
export const deliveryReportListUrl = "/_svc/freight-reports/v1/mis/courier-dashboard/data";
export const deliveryCountUrl = "/_svc/freight-reports/v1/mis/courier-dashboard/count";
export const getDeRCsvLinkUrl = "/_svc/freight-reports/v1/mis/courier-dashboard/download";
export const getDeRShipmentCsvLinkUrl = "/_svc/freight-reports/v1/mis/courier/shipments/download"
export const shipmentReportListUrl = "/_svc/freight-reports/v1/mis/courier/shipments/data";
export const VehiclePlacementListUrl = "/_svc/freight-reports/v1/mis/vehicle/placement/data";
export const getvehicleCsvLinkUrl = "/_svc/freight-reports/v1/mis/vehicle/placement/download";
export const ForwardTrackingListUrl = "/_svc/freight-reports/v1/mis/forward-tracking/data";
export const ForwardTrackingCountListUrl = "/_svc/freight-reports/v1/mis/forward-tracking/count";
export const getFTCsvLinkUrl = "/_svc/freight-reports//v1/mis/forward-tracking/download";

//NOTIFICATION APIS
export const notificationList = "/_svc/notifications/v2/topics/list";
export const subscriptionList = "/_svc/notifications/v2/topic/subscriptions/list";
export const subscribeTopicUrl = "/_svc/notifications/v2/topic/subscribe";
export const unsubscribeTopicUrl = "/_svc/notifications/v2/topic/unsubscribe";
export const idUrl = "/_svc/notifications/v1/type";
export const updateTokenUrl = "/_svc/notifications/v2/topic/subscriptions/update";

export const groupedNotificationList = "/_svc/notifications-feed/v1/channel/grouped";
export const getChannelLatestUrl = "/_svc/notifications-feed/v1/latest";
export const markReadUrl = "/_svc/notifications-feed/v1/mark-read";
export const countUrl = "/_svc/notifications-feed/v1/count";

export const jobsRegistryUrl = "/_svc/bulk-upload-proxy/v1/upload/jobs/registry";
export const jobsSampleUrl = "/_svc/bulk-upload-proxy/v1/upload/jobs/sample";
export const uploadFileUrl = "/_svc/bulk-upload-proxy/v1/file/upload";
export const bulkJobsUrl = "/_svc/bulk-upload-proxy/v1/upload/jobs/list";
export const getJobDetailsUrl = "/_svc/bulk-upload-proxy/v1/upload/jobs/";
export const uploadPlanningFileUrl = "_svc/bulk-upload-proxy/v1/tms-planning/file/upload";

export const dispatchDashboardCountUrl = "/_svc/freight-reports/v1/mis/loadability/count";
export const dispatchChartDataUrl = "/_svc/freight-reports/v1/mis/loadability/group";

export const forecastStockUrl = "/_svc/stock-positions/v1/forecast/list";
export const salesOrderUrl = "/_svc/stock-positions/v1/so/list";
export const stockListUrl = "/_svc/stock-positions/v1/stock/list";

export const productListUrl = "/_svc/products/v1/product/_pagination";
export const searchProductUrl = "/_svc/proxy-masters/v1/product/_pagination";
export const createProductUrl = "/_svc/products/v1/product";

//AGN URLS
export const agnListUrl = "/_svc/agn/v1/agn/_pagination";
export const receiveAgnUrl = "/_svc/agn/v1/agn-receive";
export const cancelAgnUrl = "/_svc/agn/v1/agn-cancel";
export const createAgnUrl = "/_svc/agn/v1/agn";

export const docUploadUrl = "/_svc/das-upload/v1/upload";
export const docMetaUrl = "/_svc/das-upload/v1/upload/meta/";
export const getDocListUrl = "/_svc/das-upload/v1/entity/details";

//AUCTION APIS
export const auctionListUrl = "/_svc/auctions/v1/auction/lane/list";
export const createAuctionUrl = "/_svc/auctions/v1/auction/lane/create";
export const cancelAuctionUrl = "/_svc/auctions/v1/auction/cancelled";
export const auctionDetailUrl = "/_svc/auctions/v1/auction/lane/details";
export const updateAuctionUrl = "/_svc/auctions/v1/auction";
export const auctionBidListUrl = "/_svc/auctions/v1/auction/bid/list";
export const selectBidUrl = "/_svc/auctions/v1/auction/bid/select";
export const terminateAuctionUrl = "/_svc/auctions/v1/auction/terminate";

// SCORE
export const getScoreUrl = "/_svc/partners-score/v1/partner/score";

//SHIPMENT APIS

export const ShipmentOrderListUrl = "/_svc/freight-orders/v1/freight-shipment/_pagination";

export const shipmentStatusCreateUrl = "/_svc/shipment-scan/v1/shipment/scan/client";
export const shipmentStatusUrl = "/_svc/shipment-scan/v1/shipment/scans-client";
export const getStatusLatestUrl = "/_svc/shipment-scan/v1/shipment/scan/client/latest";
export const getStatusListUrl = "/_svc/shipment-scan/v1/shipment/scan/status";
export const getSubStatusListUrl = "/_svc/shipment-scan/v1/shipment/scan/sub-status";
export const syncStatusUrl = "/_svc/courier-tracking/v1/courier-tracking/shipment/manual";
export const clientListUrl = "_svc/participants/v1/client/_pagination";

//shipment log Details
export const shipmentLogListUrl = "/_svc/shipment-scan/v1/shipment/scans/log/list";
export const shipmentLogDetailsResponseUrl = "/_svc/shipment-scan//v1/shipment/scans/log/details";
export const shipmentLogDownloadUrl = "/_svc/shipment-scan//v1/shipment/scans/log/download";

//BUSINESS ADDRESS
export const consigneeAddressUrl = "/_svc/business-account/v1/address"; //GET

//Indent
export const indentListUrl = "/_svc/indent/v1/indent"; //GET
export const createIndentUrl = "_svc/indent/v2/indent"
export const indentDetailsUrl = "/_svc/indent/v1/indent/detail"; //GET
export const getIndentContractsUrl = "/_svc/indent/v1/contract/detail"
export const getIndentSOBUrl = "_svc/locations/v2/sob"
export const getIndentVehicleTypesUrl = "/_svc/indent/v1/indent/create/vehicle-type-list"
export const cancelIndentOrderUrl = "_svc/freight-orders/v1/indent-cancel" //PUT

//BULK DOWNLOAD CSV URLS
export const partnerCsvUrl = "/_svc/participants/v1/client-partner-details/_csv"
export const locationCsvUrl = "/_svc/locations/v2/location/download"
export const laneCsvUrl = "/_svc/locations/v1/lane/download"
export const vehicleTypeCsvUrl = "/_svc/vehicles/v1/vehicle-type/download"
export const vehicleCsvUrl = "/_svc/vehicles/v1/vehicle/download"
export const productCsvUrl = "/_svc/products/v1/product/_download"
export const materialCsvUrl = "/_svc/articles/v1/download"

//ALERT SERVICES
export const getSnoozeReasonsUrl = "/_svc/alerts/v1/alerts/alert-reason-list";
export const postSnoozeReasonUrl = "/_svc/alerts/v1/alerts/alert-acknowledge";

//ROUTES SERVICES
export const routePolylineUrl = "/_svc/routes/v1/trip/route";

//SERVICEABILITY SERVICES
export const ServiceabilityListUrl = "/_svc/serviceability/v1/serviceability/_pagination";
export const ServiceabilityGroupedListUrl = "/_svc/serviceability/v1/serviceability/group-by-lane";
export const ServiceabilityDeatilsUrl = "/_svc/proxy-masters/v1/serviceability";
export const ServiceabilityDetailsUrl = "/_svc/proxy-masters/v1/serviceability";
export const createServiceabilityUrl = "/_svc/serviceability/v1/serviceability";
export const serviceabilityCsvUrl = "/_svc/serviceability/v1/serviceability/_csv";
export const lrNumberListUrl = "/_svc/freight-orders/v1/ext-lr-manifest-no";
export const getServiceableVehicles = "/_svc/serviceability/v1/serviceability/serviceable-vehicles"
//Freight Rates URL
export const freightRuleUrl = "/_svc/freight-rates/v1/freight/rule/modifier";
export const createFreightRatesUrl = "/_svc/freight-rates/v1/freight/rate/definition/create";
export const getContractFreightRatesUrl = "/_svc/freight-rates/v1/freight/rate/definition/get/contract";
export const getProxyContractFreightRatesUrl = "/_svc/proxy-masters/v1/freight/rate/definition/get/contract";
export const putContractFreightUrl = "/_svc/freight-rates/v1/freight/rate/definition/update";
export const deleteContractFreightUrl = "/_svc/freight-rates/v1/freight/rate/definition/delete";

// Config URL
export const saveConfigUrl = "/_svc/config/v1/config/user"
export const getConfigListUrl = "/_svc/config/v1/config/user/grouped"
export const getEditShipmentConfigUrl = "/_svc/config/v1/config/freight-orders/order-detail/edit-shipment"

// SIM TRACKING URL
export const simTrackingListUrl = "/_svc/sim-tracking/v1/log/list"
export const simTrackingDetailListUrl = "/_svc/sim-tracking/v1/log/detail"
export const getSimTrackingCsvLinkUrl = "/_svc/sim-tracking/v1/download"

// JIRA SERVICES
export const getJiraListUrl = "/_svc/jira/rest/servicedeskapi/servicedesk/requesttype";
export const postJiraStoryUrl = "/_svc/jira/rest/servicedeskapi/request";
export const uploadJiraImageUrl = "/_svc/jira/rest/servicedeskapi/servicedesk/attachTemporaryFile";

// EXPORT SERVICES
export const getExportTemplateUrl = "/_svc/export/v1/template";
export const postExportUrl = "/_svc/export/v1/export/create";
export const shipmentCreateExportUrl = "/_svc/export/v1/export/shipment-create"
export const shipmentTrackingDownloadUrl = "/_svc/export/v1/export/shipment-tracking";
export const simTrackingDownloadUrl = "/_svc/export/v1/export/sim-tracking";

// LIST OF GATES
export const getGateListUrl = "_svc/locations/v1/gate/list";
export const getUserGateListUrl = "_svc/users/v1/user-gate";
export const updateUserGateUrl = "_svc/users/v1/user-gate/update";

//GET NODE CONFIG
export const getYmsNodeConfigUrl = "_svc/in-plant/v1/check-yms-node-config"

//REQUEST GET VEHICLE TYPE
export const getCurrentVehicleTypeUrl = "/_svc/freight-orders-update-request/v1/freight-orders-vehicle-type-update"
export const raiseRequestVehicleTypeUrl = "/_svc/freight-orders-vehicles/v1/freight-orders-vehicle-change"
export const approveRequestVehicleTypeUrl = "/_svc/workflowmanager/v1/freight-orders-vehicle-type-update/accept"
export const cancelRequestVehicleTypeUrl = "/_svc/freight-orders-vehicles/v1/freight-orders-vehicle-change/cancel"
export const rejectRequestVehicleTypeUrl = "/_svc/workflowmanager/v1/freight-orders-vehicle-type-update/reject"
export const configRequestVehicleTypeUrl = "/_svc/freight-orders-update-request/v1/freight-orders-vehicle-type-update-config";

// REQUEST GET PLACEMENT DATE TIME
export const getPlacementDateTimeUrl = "/_svc/freight-orders-update-request/v1/freight-orders-placement-time-update";
export const acceptPlacementDateTimeUrl = "_svc/workflowmanager/v1/freight-orders-placement-time-update/accept";
export const orchestrationTokenUrl = "/_svc/workflowmanager/v1/orchestration";
export const rejectPlacementDateTimeUrl = "_svc/workflowmanager/v1/freight-orders-placement-time-update/reject"
export const configPlacementDateTimeUrl = "_svc/freight-orders-update-request/v1/freight-orders-placement-time-update-config";


// SOB
export const sobListUrl = "/_svc/locations/v2/list-sob";
export const createSobUrl = "/_svc/locations/v2/sob-create";
export const getSobUrl = "/_svc/locations/v2/sob";
export const updateSobUrl = "/_svc/locations/v2/sob-update";
export const getsobReportUrl = "/_svc/freight-reports/v1/mis/sob-report";
export const deleteSobUrl = "/_svc/locations/v2/sob-delete";
export const searchSobUrl = "/_svc/locations/v2/search-sob";
//constraints
export const createConstraintsUrl = "/_svc/contracts/v1/constraints/upsert";
export const getConstraintsUrl = "/_svc/contracts/v1/constraints/get";
export const templateConstraintsUrl = "/_svc/contracts/v1/constraints/template";

//Zone
export const zoneListingUrl = "_svc/locations/v1/zone/listing";
export const zoneDetailsUrl = "_svc/locations/v1/zone/details";
export const zoneCreateUrl = "_svc/locations/v1/zone/create-details";
export const contractFilters: any = {
    partnerName: "partnerCode",
    laneName: "laneCode",
    contractId: "contractCode",
    vehicleTypeName: "vehicleTypeCode",
    freightTypeCode: "contractType",
    contractStatus: "contractStatus",
    serviceabilityModeName: "serviceabilityModeCode"
}

export const sobFilters: any = {
    sobId: "sobCode",
    laneName: "laneCode",
    contractId: "contractId",
    vehicleTypeName: "vehicleTypeCode",
    partnerName: "partnerCode",
}

export const planningDashboardFilters: any = {
    fromDate: "fromDate",
    toDate: "toDate",
    originLocationName: "originLocationCode"
}

export const auctionFilters: any = {
    status: "status",
    laneName: "laneCode",
    auctionFromDateTime: "fromDateTime",
    auctionToDateTime: "toDateTime"
}

export const locationFilters: any = {
    locationName: "locationCode",
    locationTypeName: "locationType",
    integrationId: "integrationId"
}

export const laneFilters: any = {
    originLocationName: "originCode",
    destinationLocationName: "destinationCode",
    laneName: "laneCode",
    integrationId: "integrationId"
}

// inventory filters
export const agnFilters: any = {
    agnCode: "agnCode",
    freightOrderCode: "freightOrderCode",
    freightShipmentCode: "freightShipmentCode",
    originLocationName: "originLocationCode",
    destinationLocationName: "destinationLocationCode",
}

export const agnHistoryFilters: any = {
    agnCode: "agnCode",
    freightOrderCode: "freightOrderCode",
    freightShipmentCode: "freightShipmentCode",
    originLocationName: "originLocationCode",
    destinationLocationName: "destinationLocationCode",
}

export const indentListingFilters: any = {
    status: "status",
    laneName: "laneCode",
    placementFromTimeDate: "placementFromDate",
    placementToTimeDate: "placementToDate"
}

export const simFilters: any = {
    periodLabel: "period",
    fromDateLabel: "fromDate",
    toDateLabel: "toDate",
    vehicleNumber: "vehicleNumber",
}

export const shipmentLogFilters: any = {
    periodLabel: "period",
    queryField: "queryField",
    queryFieldLabel: "queryFieldLabel",
    query: "query",
    fromDateLabel: "fromDate",
    toDateLabel: "toDate"
}

export const freightFilters: any = {
    freightType: "freightType",
    billingPeriod: "billType",
    freightOrderCode: "freightOrderCode",
    laneName: "laneCode",
    partnerName: "partnerCode",
    freightOrderStartDate: "fromDate",
    freightOrderEndDate: "toDate",
    vehicleType: "vehicleTypeId",
    query: "query",
    queryField: "queryField",
    queryFieldLabel: "queryFieldLabel",
}

export const freightReconcilationPeriodicFilters: any = {
    freightOrderCode: "freightOrderCode",
    laneName: "laneCode",
    pendingPodsType: "pendingPods",
    freightOrderDeliveredAtFromTime: "deliveredAtFromTime",
    freightOrderDeliveredAtToTime: "deliveredAtToTime"

}

export const freightBillingPeriodicInvoiceFilters: any = {
    freightId: "freightId",
    laneName: "laneCode",
    vehicleTypeName: "vehicleTypeCode"
}

export const bulkUploadFilters: any = {
    requestId: "requestId",
    jobName: "jobName",
    status: "status",
    fromTimeDate: "fromDate",
    toTimeDate: "toDate"
}

export const invoiceFilters: any = {
    billNo: "billNo",
    laneName: "laneCode",
    partnerName: "partnerCode",
    externalShipmentBillNumber: "externalShipmentBillNumber",
    freightId: "freightId",
    freightType: "freightType",
    vehicleTypeName: "vehicleTypeCode",
    createdFrom: "createdFrom",
    createdTo: "createdTo",
    freightOrderCreatedFrom: "freightOrderCreatedFrom",
    freightOrderCreatedTo: "freightOrderCreatedTo",
    billApprovedByUserName: "billApprovedByUserId",
    pendingbillApprovedByUserName: "billPendingByUserId"
}

export const orderListingFilters: any = {
    query: "query",
    auctionCode: "auctionCode",
    orderStatusName: "orderStatusCode",
    freightTypeName: "freightTypeCode",
    shipmentTagName: "shipmentTag",
    vehicleNumber: "vehicleRegistrationNumber",
    isVehicleAssignedStatus: "isVehicleAssigned",
    partnerName: "partnerCode",
    laneName: "laneCode",
    dispatchOrderCreatedAtFromTime: "orderCreatedAtFromTime",
    dispatchOrderCreatedAtToTime: "orderCreatedAtToTime",
    pickupLocationName: "pickupLocationCode",
    dropLocationName: "dropLocationCode",
    shipmentRefId: "shipmentRefId",
    indentCode: "indentCode"
}

export const trackingListingFilters: any = {
    fromDateChip: "fromDate",
    toDateChip: "toDate",
    originName: "originCode",
    destinationName: "destinationCode",
    vehicleNumber: "vehicleCode",
    vehicleTypeName: "vehicleTypeCode",
    transientStatus: "transientStatus",
    consentStatus: "consentStatus",
    freightType: "freightType",
    tripId: "tripId",
    isTatBreachedLabel: "isTatBreached",
    taggedLocationName: "taggedLocationCode",
}

export const dispatchFilters: any = {
    query: "query",
    partnerName: "partnerCode",
    laneName: "laneCode",
    dispatchOrderCreatedAtFromTime: "orderCreatedAtFromTime",
    dispatchOrderCreatedAtToTime: "orderCreatedAtToTime",
    queryField: "queryField",
    queryFieldLabel: "queryFieldLabel",
    pickupLocationName: "pickupLocationCode",
    dropLocationName: "dropLocationCode",
    originZoneCode: "originZoneName",
    destinationZoneCode: "destinationZoneName",
    freightTypeName: "freightTypeCode"
}

export const shipmentFilters: any = {
    query: "query",
    shipmentStatusLabel: "shipmentStatusCode",
    originName: "originLocationCode",
    destinationName: "destinationLocationCode",
    freightTypeName: "freightTypeCode",
    fromDate: "shipmentCreatedAtFromTime",
    toDate: "shipmentCreatedAtToTime",
    vehicleTypeName: "vehicleTypeCode",
    consigneeName: "consigneeCode",
    queryField: "queryField",
    queryFieldLabel: "queryFieldLabel",
}

export const inboundFilters: any = {
    partnerName: "partnerCode",
    laneName: "laneCode",
    dispatchOrderCreatedAtFromTime: "orderCreatedAtFromTime",
    dispatchOrderCreatedAtToTime: "orderCreatedAtToTime",
    queryField: "queryField",
    queryFieldLabel: "queryFieldLabel",
    query: "query",
    isVehicleAssignedStatus: "isVehicleAssigned",
    pickupLocationName: "pickupLocationCode",
    dropLocationName: "dropLocationCode",
    originZoneCode: "originZoneName",
    destinationZoneCode: "destinationZoneName",
    freightTypeName: "freightTypeCode"
}
export const consigneeFilters: any = {
    customerName: "customerName",
    customerPhoneNumber: "customerPhoneNumber",
    customerGstinNumber: "customerGstinNumber",
    customerEmail: "customerEmail",
    customerPanNumber: "customerPanNumber",
    code: "code",
    clientToCustomerIntegrationId: "clientToCustomerIntegrationId"
}

export const customersFilters: any = {
    vendorName: "vendorName",
    vendorPhoneNumber: "vendorPhoneNumber",
    vendorEmail: "vendorEmail",
    clientToVendorIntegrationId: "clientToVendorIntegrationId",
    vendorGstinNumber: "vendorGstinNumber",
    vendorPanNumber: "vendorPanNumber"
}

export const serviceabilityFilters: any = {
    query: "query",
    freightTypeName: "freightTypeCode",
    laneName: "laneCode",
    serviceabilityModeName: "serviceabilityModeCode",
    serviceabilityTypeName: "serviceabilityType",
    originZoneName: "originZoneName",
    destinationZoneName: "destinationZoneName"
}
export const vehicleTypeFilters: any = {
    vehicleTypeName: "code"
}

export const zoneFilters: any = {
    zoneCode: "zoneCode",
    zoneName: "zoneName",
    partnerName: "partnerCode"
}

export const vehicleListFilters: any = {
    vehicleTypeLabel: "vehicleTypeId",
    vehicleNumber: "vehicleNumber",
    isVehicleAssignedStatus: "isAssigned",
    vehicleSourceTypeStatus: "isDedicated",
    partnerName: "partnerCode"
}

export const productFilters: any = {
    name: "name",
    sku: "sku",
    productTypeLabel: "productTypeCode"
}

export const materialFilters: any = {
    name: "code"
}

export const usersFilters: any = {
    email: "email"
}
export const allPerformanceReportFilters: any = {
    fromDate: "fromDate",
    toDate: "toDate",
    partnerName: "partnerCode",
    destinationLocationName: "locationCode"
}

export const freightPaymentReportFilters: any = {
    fromDate: "fromDate",
    toDate: "toDate",
    partnerName: "partnerCode",
    statusName: "status"
}

export const freightReportFilters: any = {
    fromDate: "fromDate",
    toDate: "toDate",
    partnerName: "partnerCode",
    statusName: "statusName",
    destinationLocationName: "originLocationCode"
}

export const deliveryReportFilters: any = {
    fromDate: "fromDate",
    toDate: "toDate",
    partnerName: "partnerCode",
    podUploadedChip: "podUploaded"
}
export const loadabilityReportFilters: any = {
    fromDate: "fromDate",
    toDate: "toDate",
    partnerName: "partnerCode",
    destinationLocationName: "locationCode"
}
export const detentionReportFilters: any = {
    fromDate: "fromDate",
    toDate: "toDate",
    partnerName: "partnerCode",
    destinationLocationName: "locationCode"
}

export const sobReportFilters: any = {
    fromDate: "fromDate",
    toDate: "toDate",
    partnerName: "partnerCode",
    laneName: "laneCode"
}

export const placementEfficiencyFilters: any = {
    fromDate: "fromDate",
    toDate: "toDate",
    partnerName: "partnerCode",
    laneName: "laneCode",
    originLocationName: "originLocationCode",
    destinationLocationName: "destinationLocationCode",
}

export const vehiclePlacementFilters: any = {
    fromDate: "fromDate",
    toDate: "toDate",
    partnerName: "partnerCode",
    laneName: "laneCode"
}

export const inTransitEfficiencyFilters: any = {
    fromDate: "fromDate",
    toDate: "toDate",
    partnerName: "partnerCode",
    destinationLocationName: "destinationLocationCode"

}

export const onTimeDispatchFilters: any = {
    fromDate: "fromDate",
    toDate: "toDate",
    partnerName: "partnerCode",
    destinationLocationName: "originLocationCode"

}
export const transporterFilters: any = {
    partnerName: "partnerCode"
}
export const forecastFilters: any = {
    locationName: "location"
}

export const salesOrderFilters: any = {
    locationName: "location",
    fromDateChip: "fromDate",
    toDateChip: "toDate",
}

export const indentDashboardFilters: any = {
    laneName: "laneCode",
    vehicleTypeName: "vehicleTypeCode"
}

export const trackingDashboardFilters: any = {
    originName: "originCode",
    destinationName: "destinationCode",
    freightTypeName: "freightType",
    vehicleTypeName: "vehicleTypeCode",
    partnerName: "partnerCode",
    vehicleNumber: "vehicleCode",
    fromDateChip: "fromDate",
    toDateChip: "toDate",
    isTatBreachedLabel: "isTatBreached"
}
export const planningDispatchHistoryFilters: any = {
    originLocationName: "origin",
    destinationLocationName: "destination",
}

export const planningHistoryFilters: any = {
    planningStatusLabel: "status",
}
export const dispatchDashboardFilters: any = {
    partnerName: "partnerCode",
    fromDate: "fromDate",
    toDate: "toDate",
    destinationLocationName: "originLocationCode"
}

export const monthlyFreightFilters: any = {
    laneName: "laneCode",
    partnerName: "partnerCode"
}

export const pendingContractFilters: any = {
    partnerName: "partnerCode",
    freightTypeCode: "contractType",
    serviceabilityModeName: "serviceabilityModeCode"
}

export const SO_Filters: any = {
    productName: "productCode",
    productSKU: "productCode",
    status: "status",
    fromDate: "fromDateTime",
    toDate: "toDateTime",
    quantity: "quantity",
    unit: "unit",
    zone: "zone",
    district: "district",
    block: "block",
    locationName: "locationCode",
    distanceMin: "distanceMin",
    distanceMax: "distanceMax",
    stockOrderId: "stockOrderId",
    query: "query",
    queryField: "queryField",
    queryFieldLabel: "queryFieldLabel",
    consigneeName: "consigneeCode",
}

export const PO_Filters: any = {
    productName: "productCode",
    productSKU: "productCode",
    status: "status",
    fromDate: "fromDateTime",
    toDate: "toDateTime",
    zone: "zone",
    district: "district",
    block: "block",
    locationName: "locationCode",
    distanceMin: "distanceMin",
    distanceMax: "distanceMax",
    query: "query",
    queryField: "queryField",
    queryFieldLabel: "queryFieldLabel",
    consigneeName: "consigneeCode",
}

export const STO_Filters: any = {
    productName: "productCode",
    productSKU: "productCode",
    status: "status",
    fromDate: "fromDateTime",
    toDate: "toDateTime",
    zone: "zone",
    district: "district",
    block: "block",
    locationName: "locationCode",
    distanceMin: "distanceMin",
    distanceMax: "distanceMax",
    query: "query",
    queryField: "queryField",
    queryFieldLabel: "queryFieldLabel",
    consigneeName: "consigneeCode",
}

export const DO_Filters: any = {
    productName: "productCode",
    productSKU: "productCode",
    status: "status",
    fromDate: "fromDateTime",
    toDate: "toDateTime",
    query: "query",
    queryField: "queryField",
    queryFieldLabel: "queryFieldLabel",
    productTypeLabel: "productType",
    createdAtDate: "createdAt",
    dispatchByDate: "dispatchBy",
    demandOrderLabel: "demandOrderCode",
    transporterName: "transporter",
    vendorName: "vendorName",
    sourceNumber: "sourceNumber",
    sourceType: "sourceType",
    consigneeName: "consigneeCode",
    locationName: "locationCode",
}


export const MasterDriverFilters: any = {
    driverName: "driverName",
    contactNumber: "contactNumber",
    driverStatus: "isActive",
    driverCreatedAtFromTime: "createdAtFromDate",
    driverCreatedAtToTime: "createdAtToDate",
    vehicleSourceTypeStatus: "isDedicated"
}

export const DiversionFilter: any = {
    query: "query",
    queryField: "queryField",
    queryFieldLabel: "queryFieldLabel",
}
export const trackListFilters: any = {
    status: "status",
    fromDate: "fromDateTime",
    toDate: "toDateTime",
    freightType: "freightType",
    freightOrder: "freightOrderCode",
    vehicleType: "vehicleTypeCode",
    partnerName: "partnerCode",
    query: "query",
    queryField: "queryField",
    queryFieldLabel: "queryFieldLabel",
}

export const forwardTrackingFilters: any = {
    fromDate: "fromDate",
    toDate: "toDate",
    partnerName: "partnerCode",
    laneName: "laneCode",
};

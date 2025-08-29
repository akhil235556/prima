import { runningTripsStatusEnum, tripsStatusEnum } from "../base/constant/ArrayList";
import { tatLabelWithoutUnit } from "../base/constant/MessageUtils";
import { convertDateFormat, convertHoursInDays, convertSecondsInHours, trackingDashboardDisplayDateFormatter } from '../base/utility/DateUtils';
import { ColumnStateModel } from "../Interfaces/AppInterfaces";

export const dashboardTableColumns = (status: any, subStatus?: any) => {
    const columnList: ColumnStateModel[] =
        status === tripsStatusEnum.COMPLETED ? [
            { id: 'vehicleNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
            { id: 'originName', label: 'Origin', format: (value: any) => value || "NA" },
            { id: 'destinationName', label: 'Destination', format: (value: any) => value || "NA" },
            { id: 'freightType', label: 'Freight Type', format: (value: any) => value || "NA" },
            { id: 'vehicleTypeName', label: 'Vehicle Type', format: (value: any) => value || "NA" },
            { id: 'partnerInfo', label: 'Transporter', format: (value: any) => (value && value.partnerName) || "NA" },
            { id: 'driverName', label: 'Driver Name', format: (value: any) => value || "NA" },
            { id: 'driverNumber', label: 'Driver Number', format: (value: any) => value || "NA" },
            { id: 'tat', label: tatLabelWithoutUnit, format: (value: any) => (value && convertHoursInDays(value)) || "NA" },
            { id: 'transientInfo', label: 'Transient Status', format: (value: any) => (value && value.transientStatus) || "NA", class: () => getColorClass(status, subStatus) },
            { id: 'transientInfo', label: 'Delay Duration', format: (value: any) => (value && value.delayDuration && convertSecondsInHours(value.delayDuration)) || "NA" },
            { id: 'isTatBreached', label: 'TAT Breached', format: (value: any) => value ? "Yes" : "No" },
            { id: 'tatBreachedMinutes', label: 'Breached Duration', format: (value: any) => (value && convertSecondsInHours(value * 60)) || "NA" },
            { id: 'tripStartTime', label: 'Started At', format: (value: any) => (value && convertDateFormat(value, trackingDashboardDisplayDateFormatter)) || "NA" },
            { id: 'tripEndTime', label: 'Reported At', format: (value: any) => (value && convertDateFormat(value, trackingDashboardDisplayDateFormatter)) || "NA" },
            { id: 'createdAt', label: 'Created At', format: (value: any) => (value && convertDateFormat(value, trackingDashboardDisplayDateFormatter)) || "NA" },
        ]
            : status === tripsStatusEnum.INTRANSIT ?
                [
                    { id: 'vehicleNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
                    { id: 'vehicleTypeName', label: 'Vehicle Type', format: (value: any) => value || "NA" },
                    { id: 'originName', label: 'Origin', format: (value: any) => value || "NA" },
                    { id: 'destinationName', label: 'Destination', format: (value: any) => value || "NA" },
                    { id: 'freightType', label: 'Freight Type', format: (value: any) => value || "NA" },
                    { id: 'partnerInfo', label: 'Transporter', format: (value: any) => (value && value.partnerName) || "NA" },
                    { id: 'driverName', label: 'Driver Name', format: (value: any) => value || "NA" },
                    { id: 'driverNumber', label: 'Driver Number', format: (value: any) => value || "NA" },
                    { id: 'tat', label: tatLabelWithoutUnit, format: (value: any) => (value && convertHoursInDays(value)) || "NA" },
                    { id: 'transientInfo', label: 'Transient Status', format: (value: any) => (value && value.transientStatus) || "NA", class: () => getColorClass(status, subStatus) },
                    { id: 'transientInfo', label: 'Delay Duration', format: (value: any) => (value && value.delayDuration && convertSecondsInHours(value.delayDuration)) || "NA" },
                    { id: 'isTatBreached', label: 'TAT Breached', format: (value: any) => value ? "Yes" : "No" },
                    { id: 'tatBreachedMinutes', label: 'Breached Duration', format: (value: any) => (value && convertSecondsInHours(value * 60)) || "NA" },
                    { id: 'tripStartTime', label: 'Started At', format: (value: any) => (value && convertDateFormat(value, trackingDashboardDisplayDateFormatter)) || "NA" },
                    { id: 'createdAt', label: 'Created At', format: (value: any) => (value && convertDateFormat(value, trackingDashboardDisplayDateFormatter)) || "NA" },
                ] :
                [
                    { id: 'vehicleNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
                    { id: 'originName', label: 'Origin', format: (value: any) => value || "NA" },
                    { id: 'destinationName', label: 'Destination', format: (value: any) => value || "NA" },
                    { id: 'freightType', label: 'Freight Type', format: (value: any) => value || "NA" },
                    { id: 'vehicleTypeName', label: 'Vehicle Type', format: (value: any) => value || "NA" },
                    { id: 'partnerInfo', label: 'Transporter', format: (value: any) => (value && value.partnerName) || "NA" },
                    { id: 'driverName', label: 'Driver Name', format: (value: any) => value || "NA" },
                    { id: 'driverNumber', label: 'Driver Number', format: (value: any) => value || "NA" },
                    { id: 'tat', label: tatLabelWithoutUnit, format: (value: any) => (value && convertHoursInDays(value)) || "NA" },
                    { id: 'transientInfo', label: 'Transient Status', format: (value: any) => (value && value.transientStatus) || "NA", class: () => getColorClass(status, subStatus) },
                    { id: 'transientInfo', label: 'Delay Duration', format: (value: any) => (value && value.delayDuration && convertSecondsInHours(value.delayDuration)) || "NA" },
                    { id: 'tripStartTime', label: 'Started At', format: (value: any) => (value && convertDateFormat(value, trackingDashboardDisplayDateFormatter)) || "NA" },
                    { id: 'createdAt', label: 'Created At', format: (value: any) => (value && convertDateFormat(value, trackingDashboardDisplayDateFormatter)) || "NA" },
                ]
    return columnList;
};

function getColorClass(status: any, subStatus?: any) {
    var classColor;
    if (status === tripsStatusEnum.INIT) {
        classColor = "orange-text"
    } else if (status === tripsStatusEnum.INTRANSIT) {
        if (subStatus === runningTripsStatusEnum.DELAYED)
            classColor = 'red-text';
        else if (subStatus === runningTripsStatusEnum.TRANSIT)
            classColor = 'green-text';
        else if (subStatus === runningTripsStatusEnum.UNKNOWN)
            classColor = 'orange-text';
    } else if (status === tripsStatusEnum.COMPLETED) {
        classColor = 'blue-text'
    } else if (status === tripsStatusEnum.UNKNOWN) {
        classColor = 'orange-text'
    }
    return classColor;
}


import { CircularProgress } from '@material-ui/core';
import { ArrowForward, ArrowRightAlt, Visibility } from '@material-ui/icons';
import React from 'react';
import { FreightType, ServicabilityType } from '../base/constant/ArrayList';
import { integrationCodeLabel, tatLabelWithoutUnit } from '../base/constant/MessageUtils';
import { convertDateFormat, convertHoursInDays, displayDateFormatter } from '../base/utility/DateUtils';
import { isMobile } from '../base/utility/ViewUtils';
import { LaneView } from '../component/CommonView';
import Button from '../component/widgets/button/Button';
import { InfoTooltip } from '../component/widgets/tooltip/InfoTooltip';
import { ColumnStateModel } from "../Interfaces/AppInterfaces";
import { convertArrayToString } from '../moduleUtility/ZoneUtility';
import './Switch.css';

export const partnerTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        { id: 'partnerCode', label: 'Code', format: (value: any) => value || "NA" },
        { id: 'partnerEmail', label: 'Email', format: (value: any) => value || "NA" },
        { id: 'partnerPhoneNumber', label: 'Mobile', format: (value: any) => value || "NA" },
        { id: 'partnerCompanyName', label: 'Company', format: (value: any) => value || "NA" },
        { id: 'partnerAddress', label: 'Address', format: (value: any) => value || "NA" },
        { id: 'partnerGstinNumber', label: 'GST Number', format: (value: any) => value || "NA" },

        {
            id: 'disable', label: 'Disable', type: "action", leftIcon: <ArrowRightAlt />, buttonLabel: "Disable",
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};

export const laneTableColumns = (onClickViewButton: Function, onClickLaneCode: Function) => {

    const columnList: ColumnStateModel[] = [
        {
            id: 'origin', label: 'Origin', format: (value: any) => (value && value.name) || "NA",
            customView: (element: any) =>
                <>
                    <div className="lane-ori-dest-wrap d-flex align-items-center">
                        <InfoTooltip
                            title={
                                <span>{(element && element.origin && element.origin.node ? "Node" : "Address")}</span>
                            }
                            customIcon={<img
                                className="mr-2"
                                src={(element && element.origin && element.origin.node) ? "/images/Node.svg" : "/images/Address.svg"}
                                alt="lane"
                            />
                            }
                            disableInMobile={"false"}
                        >
                        </InfoTooltip>
                        <span className="text-truncate lane-title">
                            {<InfoTooltip
                                title={(element && element.origin && element.origin.name) || "....."}
                                placement={"top"}
                                disableInMobile={"false"}
                                infoText={(element && element.origin && element.origin.name) || "....."}
                            />}
                            {/*element && element.origin && element.origin.name*/}
                        </span>
                    </div>
                </>
        },
        {
            id: 'destination', label: 'Destination', format: (value: any) => (value && value.name) || "NA",
            customView: (element: any) =>
                <>
                    <div className="lane-ori-dest-wrap d-flex align-items-center">
                        <InfoTooltip
                            title={
                                <span>{(element && element.destination && element.destination.node ? "Node" : "Address")}</span>
                            }
                            customIcon={<img
                                className="mr-2"
                                src={(element && element.destination && element.destination.node) ? "/images/Node.svg" : "/images/Address.svg"}
                                alt="lane"
                            />}
                            disableInMobile={"false"}
                        >
                        </InfoTooltip>
                        <span className="text-truncate lane-title">
                            {<InfoTooltip
                                title={(element && element.destination && element.destination.name) || "....."}
                                placement={"top"}
                                disableInMobile={"false"}
                                infoText={(element && element.destination && element.destination.name) || "....."}
                            />}
                            {/*element && element.destination && element.destination.name*/}
                        </span>
                    </div>
                </>
        },
        { id: 'integrationId', label: 'Integration ID', format: (value: any) => value || "NA" },
        {
            id: 'laneCode', label: 'Lane', format: (value: any) => (value) || "NA",
            customView: (element: any) => <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        {
            id: 'track', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};

export const serviceabilityTableColumns = (onClickLaneCode: Function) => {

    const columnList: ColumnStateModel[] = [
        {
            id: 'displayName', label: 'Lane/Zone', format: (value: any) => (value) || "NA",
            customView: (element: any) => element.serviceabilityType === ServicabilityType.ZONE ? <>{element.name}</> : <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'serviceabilityType', label: 'Servicability Type', format: (value: any) => value || "NA" },
        { id: 'code', label: 'Lane/Zone Code', format: (value: any) => value || "NA" },

    ]
    return columnList;
};

export const serviceabilityMobileTableColumns = (onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [
        {
            id: 'name', label: 'Lane/Zone', format: (value: any) => (value) || "NA",
            customView: (element: any) => element.serviceabilityType === ServicabilityType.ZONE ? <>{element.name}</> : <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'code', label: 'Lane/Zone Code', format: (value: any) => value || "NA" },
        {
            id: 'seeMore', label: 'See More', buttonLabel: "Gate In", type: "expand", leftIcon: <ArrowForward />,
        }
    ]
    return columnList;
};

export const serviceabilityChildrenTableColumns = (onClickViewButton: Function,) => {
    const columnList: ColumnStateModel[] = [
        { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'serviceabilityModeName', label: 'Mode of Transportation', format: (value: any) => value || "NA" },
        { id: 'vehicleTypeName', label: 'Vehicle Type', format: (value: any) => value || "NA" },
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        { id: 'tat', label: tatLabelWithoutUnit, format: (value: any) => (value && convertHoursInDays(value)) || "NA" },
        {
            id: 'track', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn view-mob '
        }
    ]
    return columnList;
}

export const vehicleTableColumns = (onClickViewButton: Function, onClickReport: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'vehicleCode', label: 'Code', format: (value: any) => value || "NA" },
        { id: 'vehicleNumber', label: 'Registration Number', format: (value: any) => value || "NA" },
        { id: 'vehicleType', label: 'Type', format: (value: any) => value || "NA" },
        { id: 'isAssigned', label: 'Status', format: (value: any) => value ? "Assigned" : "Unassigned" || "NA", class: () => 'orange-text' },
        {
            id: 'isDedicated', label: 'Source Type', format: (value: any) => value ? "Dedicated" : "Market" || "NA",
            customView: (element: any) => (<div className='d-flex align-items-center'>
                <img
                    className='mr-2'
                    src={(element.isDedicated && element.isDedicated === "true") ? "/images/Dedicated.svg" : "/images/Market.svg"}
                    alt="vehicle"
                /><span>{(element.isDedicated && element.isDedicated === "true" ? "Dedicated" : "Market")}</span>
            </div>
            )
        },
        {
            id: 'action', label: 'Action', format: (value: any) => value || "NA", type: "multiAction",
            class: () => isMobile ? "col-12" : " ",
            customView: (element: any) => {
                return ((element &&
                    <div className={"receive-btn action-btn-wrap" + (isMobile ? " d-flex" : "")}>
                        <div className="mobile-btn">
                            <Button
                                buttonStyle="btn-detail mobile-btn btn-sm mr-2"
                                title="View"
                                leftIcon={<Visibility />}
                                onClick={() => {
                                    onClickViewButton(element)
                                }}
                            />
                        </div>
                        <div className="mobile-btn ml-15">
                            <Button
                                buttonStyle="btn-detail btn-sm"
                                title="Report"
                                disable={element.isDedicated === "false" || element.isAssigned || element.isReported}
                                leftIcon={<img
                                    src={"/images/Report_at _hub.svg"}
                                    alt="report"
                                />}
                                onClick={() => {
                                    onClickReport(element)
                                }}
                            />
                        </div>
                    </div>) || "NA")
            }
        },
    ]
    return columnList;
};

export const productTableColumns = () => {
    const columnList: ColumnStateModel[] = [

        { id: 'name', label: 'Product Name', format: (value: any) => value || "NA" },
        { id: 'productTypeName', label: 'Product Type', format: (value: any) => value || "NA" },
        { id: 'sku', label: 'SKU', format: (value: any) => value || "NA" },
        { id: 'integrationId', label: integrationCodeLabel, format: (value: string) => value || "NA" },
        { id: 'description', label: 'Description', format: (value: any) => value || "NA" },
    ]
    return columnList;
};

export const vehicleTypeTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'type', label: 'Vehicle Type', format: (value: any) => value || "NA" },
        { id: 'length', label: 'Length (m)', format: (value: any) => (value && value.toFixed(3)) || "NA" },
        { id: 'breadth', label: 'Breadth (m)', format: (value: any) => (value && value.toFixed(3)) || "NA" },
        { id: 'height', label: 'Height (m)', format: (value: any) => (value && value.toFixed(3)) || "NA" },
        { id: 'loadCapacity', label: 'Weight LoadCapacity (Kg)', format: (value: any) => (value && value.toFixed(3)) || "NA" },
        { id: 'volumeLoadCapacity', label: 'Volume LoadCapacity (m³)', format: (value: any) => (value && value.toFixed(3)) || "NA" },
        {
            id: 'edit', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};

export const zoneTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'zoneCode', label: 'Zone Id', format: (value: any) => value || "NA" },
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        { id: 'zoneName', label: 'Zone Name', format: (value: any) => value || "NA" },
        { id: 'mappingType', label: 'Mapping', format: (value: any) => value || "NA" },
        { id: 'zoneDescription', label: 'Description', format: (value: any) => value || "NA" },
        {
            id: 'edit', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};

export const zoneTableChildColumns = () => {
    const columnList: ColumnStateModel[] = [

        { id: 'zoneState', label: 'State', format: (value: any) => convertArrayToString(value, "stateName") || "NA" },
        { id: 'zoneCity', label: 'Cities', format: (value: any) => convertArrayToString(value, "cityName") || "NA" },
        { id: 'zonePincode', label: 'Serviceable Pincodes', format: (value: any) => convertArrayToString(value, "pincodeValue") || "NA" }
    ]
    return columnList;
};

export const trackingAssetsTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'deviceType', label: 'Device Type', format: (value: any) => value || "NA" },
        { id: 'trackingVendor', label: 'Tracking Vendor', format: (value: any) => value || "NA" },
        {
            id: 'active', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};

export const materialTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'name', label: 'Name', format: (value: any) => value || "NA" },
        { id: 'code', label: 'Code', format: (value: any) => value || "NA" },
        { id: 'length', label: 'Length (m)', format: (value: any) => (value && value.toFixed(3)) || "NA" },
        { id: 'height', label: 'Height (m)', format: (value: any) => (value && value.toFixed(3)) || "NA" },
        { id: 'width', label: 'Width (m)', format: (value: any) => (value && value.toFixed(3)) || "NA" },
        // { id: 'maxWeight', label: 'Max. Weight (kg)', format: (value: any) => (value && value.toFixed(3)) || "NA" },
        { id: 'skuCode', label: 'SKU Code', format: (value: any) => value || "NA" },
        { id: 'units', label: 'Units', format: (value: any) => value || "NA" },
        { id: 'description', label: 'Description', format: (value: any) => value || "NA" },
        {
            id: 'track', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};

export const consigneeTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'customerName', label: 'Consignee Name', format: (value: any) => value || "NA" },
        { id: 'customerCode', label: 'Code', format: (value: any) => value || "NA" },
        { id: 'customerIntegrationCode', label: integrationCodeLabel, format: (value: any) => value || "NA" },
        { id: 'customerAddress', label: 'Address', format: (value: any) => value || "NA" },
        { id: 'customerPhoneNumber', label: 'Phone Number', format: (value: any) => value || "NA" },
        { id: 'customerEmail', label: 'Email Id', format: (value: any) => value || "NA" },
        {
            id: 'track', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};

export const locationTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'locationName', label: 'Location Name', format: (value: any) => value || "NA" },
        { id: 'locationCode', label: 'Location Code', format: (value: any) => value || "NA" },
        { id: 'integrationId', label: 'Integration ID', format: (value: any) => value || "NA" },
        { id: 'latitude', label: 'Latitude', format: (value: any) => value || "NA" },
        { id: 'longitude', label: 'Longitude', format: (value: any) => value || "NA" },
        { id: 'locationTypeName', label: 'Location Type', format: (value: any) => value || "NA" },
        { id: 'createdAt', label: 'Created Date', format: (value: any) => (value && convertDateFormat(value, displayDateFormatter)) || "NA" },
        { id: 'address', label: 'Address', format: (value: any) => value || "NA" },
        {
            id: 'track', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};

export const locationTypeTableColumns = () => {
    const columnList: ColumnStateModel[] = [

        { id: 'locationTypeName', label: 'Location Type', format: (value: any) => value || "NA" },
    ]
    return columnList;
};

export const loctionDetailsTable = () => {
    const columnList: ColumnStateModel[] = [

        { id: 'locationName', label: 'Address', format: (value: any) => value || "NA" },
        { id: 'locationType', label: 'Location Type ( Pickup /Drop)', format: (value: any) => (value && value.label) || "NA" },
    ]
    return columnList;
};

export const freightTableColumns = (onChange: any, ftlLoading: boolean, LtlLoading: boolean, classes: any) => {

    const columnList: ColumnStateModel[] = [
        {
            id: 'name', label: '', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    <div>
                        {element.description} ({element.name})
                    </div>
                )
            }
        },

        {
            id: 'ltl', label: '', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element &&
                    <div className={classes.wrapper}>
                        <div className="custom-switch">
                            <label className="switch-content" >
                                <input
                                    checked={element.isClientActive}
                                    type="checkbox"
                                    onChange={(event: any) => {
                                        !ftlLoading && !LtlLoading && onChange(event.target.checked, element);
                                    }}
                                />
                                <span>
                                    <span>OFF</span>
                                    <span>ON</span>
                                </span>
                                <label className="btn-primary"></label>
                                {(element.name === FreightType.FTL && ftlLoading) ? <CircularProgress size={24} className={classes.buttonProgress} /> :
                                    (element.name === FreightType.PTL && LtlLoading) ? <CircularProgress size={24} className={classes.buttonProgress} /> : null}
                            </label>
                        </div></div>) || "NA")
            }
        },
    ]
    return columnList;
};
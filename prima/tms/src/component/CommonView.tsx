import React from 'react';
import { menuList } from '../base/constant/ArrayList';
import { isObjectEmpty } from '../base/utility/StringUtils';
import { isMobile } from '../base/utility/ViewUtils';
import { InfoTooltip } from './widgets/tooltip/InfoTooltip';

interface LaneViewProps {
    element: any,
    onClickLaneCode: Function,
    className?: any

}

export const LaneView = (props: LaneViewProps) => {
    const { element, onClickLaneCode, className } = props;
    return (element && ((element.lane && element.lane.displayName) || (element.laneDisplayName) || (element.displayName) || (element.laneName) || (element.lane && !isObjectEmpty(element.lane)))
        && <div className="lane-wrap">
            <label
                className={(isMobile ? " lane-content-mobile" : `lane-content ${className}`)}
                onClick={() => {
                    onClickLaneCode(element)
                }}
            >    {<InfoTooltip
                title={(element.lane && element.lane.displayName) || (element.laneDisplayName) || (element.displayName) || (element.laneName) || (element.lane) || "....."}
                placement={"top"}
                disableInMobile={"false"}
                infoText={(element.lane && element.lane.displayName) || (element.laneDisplayName) || (element.displayName) || (element.laneName) || (element.lane) || "....."}
            />}
                {/*(element.lane && element.lane.displayName) || (element.laneDisplayName) || (element.laneName)*/}
            </label>
        </div>) || "NA"

}

export const LaneCodeView = (props: LaneViewProps) => {
    const { element, onClickLaneCode } = props;

    return (element && <div className="lane-wrap">
        <label
            className={(isMobile ? " lane-content-mobile" : "lane-content")}
            onClick={() => {
                onClickLaneCode(element)
            }}
        >
            {(element && element.laneCode)}
        </label>
    </div>) || "NA"

}

export const ListLaneView = (props: LaneViewProps) => {
    const { element, onClickLaneCode } = props;

    return (element && <div className="lane-wrap">
        <label
            className={(isMobile ? " lane-content-mobile" : "lane-content")}
            onClick={() => {
                onClickLaneCode(element)
            }}
        >{
                <InfoTooltip
                    title={(element.originLocationName && element.destinationLocationName ? (element.originLocationName + " -\u003e " + element.destinationLocationName) : (element.laneDisplayName)) || "....."}
                    placement={"top"}
                    disableInMobile={"false"}
                    infoText={(element.originLocationName && element.destinationLocationName ? (element.originLocationName + " -\u003e " + element.destinationLocationName) : (element.laneDisplayName)) || "....."}
                />
            }
            {/*element.originLocationName && element.destinationLocationName ? (element.originLocationName + " -\u003e " + element.destinationLocationName) : (element.laneDisplayName)*/}
        </label>
    </div>) || "NA"

}

export const ListShipmentLaneView = (props: LaneViewProps) => {
    const { element, onClickLaneCode } = props;
    return (element && <div className="lane-wrap">
        <label
            className={(isMobile ? " lane-content-mobile" : "lane-content")}
            onClick={() => {
                onClickLaneCode(element)
            }}
        >{<InfoTooltip
            title={(element.orderDetails && element.orderDetails.laneName) || "....."}
            placement={"top"}
            disableInMobile={"false"}
            infoText={(element.orderDetails && element.orderDetails.laneName) || "....."}
        />}
            {/*(element.orderDetails && element.orderDetails.laneName)*/}
        </label>
    </div>) || "NA"

}

export const ListFreightLaneView = (props: LaneViewProps) => {
    const { element, onClickLaneCode } = props;
    return (element && <div className="lane-wrap">
        <label
            className={(isMobile ? " lane-content-mobile" : "lane-content")}
            onClick={() => {
                onClickLaneCode(element)
            }}
        >{<InfoTooltip
            title={(element && element.laneName) || "....."}
            placement={"top"}
            disableInMobile={"false"}
            infoText={(element && element.laneName) || "....."}
        />}
            {/*(element && element.laneName)*/}
        </label>
    </div>) || "NA"

}

export const ListLaneViewFreightReconciliation = (props: LaneViewProps) => {
    const { element, onClickLaneCode } = props;
    return (element && <div className="lane-wrap">
        <label
            className={(isMobile ? " lane-content-mobile" : "lane-content")}
            onClick={() => {
                onClickLaneCode(element)
            }}
        >
            {(element.shipmentDetails[0] && element.shipmentDetails[0].originLocationName) + " -\u003e " + (element.shipmentDetails[0] && element.shipmentDetails[0].destinationLocationName)}
        </label>
    </div>) || "NA"

}

export const ListAuctionLaneView = (props: LaneViewProps) => {
    const { element, onClickLaneCode } = props;

    return (element && element.lane.originLocationName && element.lane.destinationLocationName && <div className="lane-wrap">
        <label
            className={(isMobile ? " lane-content-mobile" : "lane-content")}
            onClick={() => {
                onClickLaneCode(element)
            }}
        >   {<InfoTooltip
            title={element.lane.originLocationName + " -\u003e " + element.lane.destinationLocationName || "....."}
            placement={"top"}
            disableInMobile={"false"}
            infoText={element.lane.originLocationName + " -\u003e " + element.lane.destinationLocationName || "....."}
        />}
            {/*element.lane.originLocationName + " -\u003e " + element.lane.destinationLocationName*/}
        </label>
    </div>) || "NA"

}

export const laneDisplayOption = (optionProps: any) => {
    return (
        <div className="d-flex align-items-center justify-content-between menu-options">
            <span className="waypoints-name">{optionProps.data && optionProps.label}</span>
            <span className="tat-value"><span className="badge badge-warning badge-pill">{optionProps.data && optionProps.data.level}</span></span>
        </div>
    )
}

export const laneViewHolder = (valueProps: any) => {
    return (
        <div className="row no-gutters w-100">
            <span className="col waypoints-name text-truncate">{valueProps.data && valueProps.data.data && valueProps.data.label}</span>
            <span className="col-auto"><span className="badge badge-warning badge-pill">{valueProps.data && valueProps.data.data && valueProps.data.data.level}</span></span>
        </div>
    )
}

export const PartnerDisplayOption = ({ optionProps }: any) => {
    return (
        <div className="row no-gutters menu-options">
            <span className=" col menu-options-item">{optionProps.data && optionProps.label}</span>
            <span className=" col-auto menu-options-value pr-0"><span className="badge badge-warning badge-pill">{optionProps.data && ("Level " + optionProps.data.level)}</span></span>
        </div>
    )
}

export const PartnerLevelDisplayOption = ({ optionProps }: any) => {
    return (
        <div className="row no-gutters menu-options">
            <span className=" col menu-options-item">{optionProps.data && optionProps.label}</span>
            {optionProps && optionProps.data && optionProps.data.level &&
                <span className=" col-auto menu-options-value pr-0"><span className="badge badge-warning badge-pill">
                    {optionProps.data && ("Level " + optionProps.data.level)}</span>
                </span>}
        </div>
    )
}

export const VehicleNumberDisplayOption = ({ optionProps }: any) => {
    return (
        <div className="row no-gutters menu-options"
            style={{
                height: 30,
                alignContent: "center",
                width: "100%"
            }}
        >
            <span >
                <img
                    src={(optionProps && optionProps.data && optionProps.data.isDedicated === "true") ? "/images/Dedicated.svg" : "/images/Market.svg"}
                    alt="vehicle"
                />
            </span>
            <span className=" col menu-options-item">{optionProps && optionProps.label}</span>
            {optionProps && optionProps.data && optionProps.data.isAssigned && <span className=" col-auto menu-options-value pr-0">
                <span className="badge badge-warning badge-pill">Assigned</span>
            </span>
            }
        </div>
    )
}


export const LocationTypeNameOption = ({ optionProps }: any) => {
    return (
        <div className="row no-gutters menu-options"
            style={{
                height: 30,
                alignContent: "center",
                width: "100%"
            }}
        >
            {optionProps && optionProps.data && optionProps.data.locationTypeName &&
                <span className=" col-auto menu-options-value pr-0">
                    <span className="">
                        <img
                            className="mr-2"
                            src={(optionProps.data.locationTypeName === "ADDRESS") ? "/images/Address.svg" : "/images/Node.svg"}
                            alt="Lane" />
                    </span>
                </span>
            }
            <span className=" col menu-options-item">{optionProps && optionProps.label}</span>
        </div>
    )
}

export const LocationTypeNameMultiSelect = (props: any) => {
    const { optionProps } = props;
    return (
        <div className="row no-gutters menu-options"
            style={{
                height: 30,
                alignContent: "center",
                width: "100%",
                cursor: "pointer"
            }}
            onClick={() => {
                optionProps.selectOption(optionProps.data)
            }}
        >
            {optionProps && optionProps.data && optionProps.data.data && optionProps.data.data.locationTypeName &&
                <span className=" col-auto menu-options-value pr-0">
                    <span className="">
                        <img
                            className="mr-2"
                            src={(optionProps.data.data.locationTypeName === "ADDRESS") ? "/images/Address.svg" : "/images/Node.svg"}
                            alt="Lane" />
                    </span>
                </span>
            }
            <span className=" col menu-options-item">{optionProps && optionProps.label}</span>
        </div>
    )
}


export const PartnerViewHolder = (valueProps: any) => {
    return (
        <div className="row no-gutters menu-options">
            <span className="col menu-options-item text-truncate">{valueProps.data && valueProps.data.data && valueProps.data.label}</span>
            <span className="col-auto menu-options-value"><span className="badge badge-warning badge-pill">{valueProps.data && valueProps.data.data && ("Level " + valueProps.data.data.level)}</span></span>
        </div>
    )
}


export function getMenuIndex(location: any) {
    let data: any = {
        index: 0,
    }
    location.pathname && menuList.map((element: any, index: number) => {
        if (location.pathname.startsWith(element.name)) {
            data.index = index;
            data.element = element;
        }
        return true;
    });
    return data;
}

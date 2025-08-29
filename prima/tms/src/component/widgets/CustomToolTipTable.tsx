import { makeStyles, Theme } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';
import { ArrowForward, Info } from "@material-ui/icons";
import React from "react";
import { zoneTitle } from "../../base/constant/MessageUtils";
import { isMobile } from "../../base/utility/ViewUtils";
import "./CustomToolTipTable.css";

const useBootstrappedStyles = makeStyles((theme: Theme) => {
    return {
        tooltip: (props: any) => ({
            background: '#fff',
            minWidth: isMobile ? 360 : 300,
            maxWidth: isMobile ? 320 : 400,
            boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
            margin: 0,
            padding: 0,
            borderRadius: 10,
            overflow: 'hidden',
            ...props.tooltip,
        }),
        popper: (props: any) => props.popper,
        popperInteractive: (props: any) => props.popperInteractive,
        popperArrow: (props: any) => props.popperArrow,
        tooltipArrow: (props: any) => props.tooltipArrow,
        arrow: (props: any) => props.arrow,
        tooltipPlacementLeft: (props: any) => props.tooltipPlacementLeft,
        tooltipPlacementRight: (props: any) => props.tooltipPlacementRight,
        tooltipPlacementTop: (props: any) => props.tooltipPlacementTop,
        tooltipPlacementBottom: (props: any) => props.tooltipPlacementBottom,
    }
})


interface CustomTooltipTableProps {
    tableColumn: Array<any> | undefined,
    tableData: Array<any> | undefined,
    infoText?: string,
    valueClassName?: string,
    showStringValue?: boolean,
    customIcon?: any,
    className?: string,
    style?: Object,
    wrap?: any,
    placement?: any,
    arrow?: any,
    displayZone?: any,
    zoneDetails?: any
}


export const CustomTooltipTable = (props: CustomTooltipTableProps) => {

    const { tableData, tableColumn, infoText, valueClassName, showStringValue, customIcon, className, wrap, placement, arrow, displayZone = false, zoneDetails = {} } = props;
    const classes = useBootstrappedStyles(props.style || {});

    return (
        <div className={wrap ? "" : "tooltip-table-wrap"}>
            <Tooltip
                classes={classes}
                disableTouchListener
                placement={placement ? placement : "bottom"}
                arrow={arrow}
                title={
                    <React.Fragment>
                        <div className={`tooltip-table-info ${className}`}>
                            <div className="table-responsive">
                                {displayZone && <div className="zone-info">
                                    <span>{zoneTitle} - </span> {zoneDetails.originZoneName} <ArrowForward /> {zoneDetails.destinationZoneName}
                                </div>}
                                {/* <table className="table table-striped"> */}
                                <table className="table">
                                    <thead>
                                        <tr>
                                            {tableColumn && tableColumn.map((element: any, index: number) => (<th key={index}>{element.description}</th>))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData && tableData.map((element: any, index: number) => (
                                            <tr key={index}>
                                                {tableColumn && tableColumn.map((column: any, index: number) => {

                                                    if (column.customView) {
                                                        return column.customView(element)
                                                    }
                                                    if (column.format) {
                                                        return <td key={index}>{column.format(element[column.name])}</td>
                                                    }
                                                    return <td key={index}>{setInputValueFromElement(element[column.name])
                                                    }</td>
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </React.Fragment>
                }
            >
                {(infoText && <div className={"media-body " + valueClassName ? valueClassName : " "}>{(infoText) || "NA"}
                </div>) ||
                    <span className="tooltip-icon">
                        {
                            customIcon ? customIcon : (
                                <Info className="text-orange icon-info" />
                            )
                        }
                    </span>
                }
            </Tooltip>
        </div >
    );

    function setInputValueFromElement(valueElement: any) {
        if (showStringValue) {
            try {
                return valueElement;
            } catch (error) {
                return ""
            }
        } else {
            try {
                return isNaN(Number.parseFloat(valueElement)) ? valueElement : Number.parseFloat(valueElement).toFixed(2);
            } catch (error) {
                return ""
            }
        }
    }
}

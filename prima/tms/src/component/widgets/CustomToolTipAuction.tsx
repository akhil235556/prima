import React from "react";
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, Theme } from "@material-ui/core";
import "./CustomToolTipAuction.css";
import { isMobile } from "../../base/utility/ViewUtils";
import { Info } from "@material-ui/icons";

const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: 'transparent',
        minWidth: 210,
        maxWidth: isMobile ? 320 : 400,
        boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
        margin: isMobile ? '7px 0 7px' : '8px 0 8px',
        padding: '0',
        borderRadius: 10,
        border: 'none',
        // overflow: 'hidden',
    },
}))(Tooltip);


interface CustomToolTipAuctionProps {
    tableColumn: Array<any> | undefined,
    tableData: Array<any> | undefined,
    infoText?: string,
    valueClassName?: string,
    showStringValue?: boolean
}


export const CustomToolTipAuction = (props: CustomToolTipAuctionProps) => {

    const { tableData, tableColumn, infoText, valueClassName, showStringValue } = props;

    return (
        <div className="tooltip-table-wrap">
            <HtmlTooltip
                arrow
                disableTouchListener
                title={
                    <React.Fragment>
                        <div className="tooltip-table-info auction-tooltip">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            {tableColumn && tableColumn.map((element: any, index: number) => (<th key={index}>{element.description}</th>))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData && tableData.map((element: any, index: number) => (
                                            <tr key={index}>
                                                {tableColumn && tableColumn.map((column: any, index: number) => (<td key={index}>{setInputValueFromElement(element[column.name])}</td>))}
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
                    <Info className="text-orange icon-info" />
                }
            </HtmlTooltip>
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

import React from 'react';
import "./Information.css";

interface InformationProps {
    title: string;
    valueClassName?: any;
    icon?: any;
    text?: string;
    customView?: any
    sup?: number
    tooltip?: any,
    valueTooltip?: any,
    image?: any,
    className?: string,
    textHeadingColor?: string,
}
function Information(props: InformationProps) {
    const { customView, sup, valueClassName, tooltip, valueTooltip, textHeadingColor, image, className, title } = props;

    return (
        <div className={`payment-info d-flex align-items-center ${className}`}>
            <div className="pay-info-icon">
                {image}
            </div>
            <div className="flex-grow-1">
                {title && <div className="d-flex align-items-center">
                    <label className={`info-heading ${textHeadingColor}`}>{title}
                        <span>{tooltip && tooltip()}</span>
                    </label>
                </div>}
                <div className="media vehicle-info text-break">
                    {props.icon}
                    {(customView ? customView :
                        (
                            sup ? <div className="media-body text-break">{props.text}<sup>{props.text ? sup : ""}</sup></div>
                                : (valueTooltip ?
                                    <div className={valueClassName ? "media-body text-truncate " + valueClassName : "media-body text-truncate"}>
                                        <span>{valueTooltip && valueTooltip()}</span>
                                    </div>
                                    : <div className={valueClassName ? "media-body text-break " + valueClassName : "media-body text-break"}>{(props.text) || "NA"}
                                    </div>)
                        )
                    )}
                </div>
            </div>
        </div >
    )
}
export default Information;
import { makeStyles, Theme } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { Info } from '@material-ui/icons';
import React from 'react';
import { isMobile } from '../../../base/utility/ViewUtils';
import './InfoTooltip.css';

const useBootstrappedStyles = makeStyles((theme: Theme) => {
    return {
        tooltip: (props: any) => ({
            background: '#fff',
            color: '#133751',
            fontSize: '10px',
            minWidth: '64px',
            maxWidth: isMobile ? 320 : 400,
            boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.16)',
            margin: '6px 0px',
            borderRadius: 4,
            textAlign: 'center',
            padding: '7px 9px',
            // overflow: 'hidden',
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

interface InfoTooltipProps {
  title: any;
  infoText?: any;
  valueClassName?: string;
  customIcon?: any;
  className?: string;
  style?: Object;
  wrap?: any;
  placement?: any;
  arrow?: any;
  children?: any;
  disableInMobile?: any;
  utilizationValue?: string;
  utilizationTooltip?: boolean;
}

InfoTooltip.defaultProps = {
    placement: "bottom-start",
    disableInMobile: "false"
}

export function InfoTooltip(props: InfoTooltipProps) {
    const { placement, arrow, title, children, disableInMobile, className, infoText, customIcon, valueClassName, utilizationValue, utilizationTooltip = false } = props;
    const classes = useBootstrappedStyles(props.style || {});

    return (
      <Tooltip
        classes={classes}
        disableTouchListener
        placement={placement}
        arrow={arrow}
        disableHoverListener={disableInMobile === "false" ? false : isMobile}
        title={
          <React.Fragment>
            {utilizationTooltip && (
              <div className={`tooltip-value ${valueClassName}`}>
                {utilizationValue ? `${utilizationValue} %` : "NA"}
              </div>
            )}
            <div className={`${utilizationTooltip ? 'tooltip-title' : 'info-tooltip'} ${className}`}>
              {title}
              {children && children}
            </div>
          </React.Fragment>
        }
      >
        {(infoText && (
          <div
            className={
              valueClassName
                ? "tooltip-info text-truncate " + valueClassName
                : "tooltip-info text-truncate"
            }
          >
            {infoText || "NA"}
          </div>
        )) || (
            <span className={`${utilizationTooltip ? 'tooltip-icon' : 'tool-tip-icon'}`}>
            {customIcon ? (
              customIcon
            ) : (
              <Info className="text-orange icon-info" />
            )}
          </span>
        )}
      </Tooltip>
    );
}


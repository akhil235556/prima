import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';
import React from 'react';
import { deprecationWarning } from '../../base/utility/JSCodeUtils';
import { isMobile } from '../../base/utility/ViewUtils';

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        border: 'solid 1px #ebeff3',
        background: '#ffffff',
        fontSize: 12,
        color: '#133751',
        fontWeight: 500,
        lineHeight: 1.15,
        padding: '8px 10px',
        textTransform: 'capitalize',
    },
}))(Tooltip);

interface CustomToolTipProps {
    title: any,
    placement?: any
    arrow?: boolean
    disableInMobile?: any,
    children: React.ReactElement;
}

export function CustomToolTip(props: CustomToolTipProps) {
    deprecationWarning("CustomToolTip is deprecated. Use InfoTooltip instead.");

    return (
        <LightTooltip
            title={props.title}
            arrow={props.arrow}
            disableTouchListener
            disableHoverListener={props.disableInMobile === "false" ? false : isMobile}
            placement={'top-start'}
        >
            <div
                onClick={(event: any) => {
                    event.stopPropagation();
                }}
            >
                {props.children}
            </div>
        </LightTooltip>
    )
}

CustomToolTip.defaultProps = {
    placement: "top-start",
    disableInMobile: "false"
}
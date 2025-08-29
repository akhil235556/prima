import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        margin: '10px 0',
        padding: '6px 24px',
        backgroundImage: 'linear-gradient(to bottom, #f7931e, #f73f1e)',
        borderRadius: '50px',
        fontSize: 11,
        color: '#fff',
        lineHeight: 1.15,
    },
}))(Tooltip);

interface CustomToolTipIndentProps {
    title: any,
    placement?: any
    arrow?: boolean
    children: React.ReactElement;
}

export function CustomToolTipIndent(props: CustomToolTipIndentProps) {
    return (
        <LightTooltip
            title={props.title}
            arrow={props.arrow}
            disableTouchListener
            placement={props.placement}>
            {props.children}
        </LightTooltip>
    )
}

CustomToolTipIndent.defaultProps = {
    placement: "top-start"
}
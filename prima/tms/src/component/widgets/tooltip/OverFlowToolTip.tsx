import { makeStyles, Theme } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import React, { useEffect, useRef, useState } from 'react';
import { isMobile } from '../../../base/utility/ViewUtils';

interface OverFlowTooltipProps {
    text: any
    cellIcon?: any
    style?: Object
}

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

export function OverflowTip(props: OverFlowTooltipProps) {
    // Create Ref
    const textElementRef: any = useRef();
    const classes = useBootstrappedStyles(props.style || {});
    const compareSize = () => {
        const compare = textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
        setHover(compare);
    };

    // compare once and add resize listener on "componentDidMount"
    useEffect(() => {
        compareSize();
        window.addEventListener('resize', compareSize);

        // remove resize listener again on "componentWillUnmount"
        return () => { window.removeEventListener('resize', compareSize); }
    }, []);

    // Define state and function to update the value
    const [hoverStatus, setHover] = useState(false);

    return (
        <Tooltip
            title={props.text}
            interactive
            disableHoverListener={!hoverStatus}
            classes={classes}
        >
            <div
                ref={textElementRef}
                style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: "230px"
                }}
            >
                {props.cellIcon}
                {props.text}
            </div>
        </Tooltip>
    );
};
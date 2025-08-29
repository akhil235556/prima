import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import "./NavbarTooltip.css";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

interface NavbarTooltipProps {
    children?: any,
    title?: string,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tooltip: {
            border: 'solid 1px #ebeff3',
            background: '#ffffff',
            fontSize: 13,
            color: '#133751',
            fontWeight: 500,
            lineHeight: 1.15,
            padding: '10px 14px',
            textTransform: 'capitalize',
            minWidth: 140,
        },
    }),
);
function NavbarTooltips(props: NavbarTooltipProps) {
    const { children, title } = props;
    const classes = useStyles();

    return (
        <Tooltip className="appbar-tooltip" classes={{ tooltip: classes.tooltip }} title={title} arrow placement="right">
            {children}
        </Tooltip>
    );
}

export default NavbarTooltips;
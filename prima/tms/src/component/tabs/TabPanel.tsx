import { Box, Typography } from "@material-ui/core";
import React from "react";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
    styleName?: string
}

export function TabPanel(props: TabPanelProps) {
    const { children, value, index, styleName, ...other } = props;
    return (
        <Typography
            component="div"
            className={styleName ? "tab-table " + styleName : "tab-table"}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={2}>{children}</Box>
        </Typography>
    );
}
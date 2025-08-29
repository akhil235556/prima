import {
    TableCell, TableHead, TableRow
} from '@material-ui/core';
import React, { ReactNode } from 'react';

interface TableHeaderProps {
    tableColumns?: Array<any>,
    children?: ReactNode,
    isCollapsible?: boolean,
}

function TableHeader(props: TableHeaderProps) {
    return (
        <TableHead>
            <TableRow>
                {props.isCollapsible && <TableCell></TableCell>}
                {props.tableColumns && props.tableColumns.map((element: any, index: number) => {
                    if (element.type === 'children') return null;
                    return (
                        <TableCell
                            key={index}
                            align="left"
                            style={{ minWidth: element.minWidth }}
                        >
                            {element.label}
                        </TableCell>
                    )
                })}
            </TableRow>
        </TableHead>
    );
}

export default TableHeader;

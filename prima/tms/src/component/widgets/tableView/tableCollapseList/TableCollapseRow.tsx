import { Collapse, IconButton } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import React from 'react';
import { dataNotFoundMessage } from '../../../../base/constant/MessageUtils';
import TableCollapseDetail from './TableCollapseDetail';
import "./TableCollapseList.css";
import TableDataColumns from './TableDataColumns';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
    }),
);

interface TableRowProps {
    tableColumns: Array<any>,
    childrenColumns?: Array<any>,
    data: any,
    onClickActionButton?: Function;
    actionButtonTitle?: string,
    actionButtonStyle?: string,
    totalCount?: number,
    icon?: any,
    onClickWayPoints?: (event: React.MouseEvent<HTMLButtonElement> | null) => void,
    noDataView?: any,
    childElementKey?: any,
    expand: boolean,
    changeExpand: any
    childColSpan: number
    emptyChildMessage?: string
    collapseCustomView?: boolean
    children?: any
    rowIndex?: any
    onClickRow?: any
}

function TableCollapseRow({ expand, changeExpand, data, childrenColumns, childElementKey, emptyChildMessage, childColSpan, collapseCustomView, children, rowIndex, onClickRow, ...props }: TableRowProps) {
    const classes = useStyles();
    return (
        <>
            <TableRow>
                <TableCell className="expand-btn active">
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expand,
                        })}
                        onClick={changeExpand}
                        aria-expanded={expand}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </TableCell>
                <TableDataColumns
                    onClickRow={onClickRow}
                    data={data}
                    rowIndex={rowIndex + 1}
                    {...props}
                />
            </TableRow>

            {/* collapse todo */}
            {
                (data && data[childElementKey] && (!collapseCustomView) && (
                    <TableRow>
                        <TableCell colSpan={childColSpan} className="collapse-cell">
                            <Collapse in={expand} timeout="auto" unmountOnExit>
                                <TableCollapseDetail
                                    tableColumns={childrenColumns}
                                    data={data[childElementKey]}
                                />
                            </Collapse>
                        </TableCell>
                    </TableRow>
                ))
                // eslint-disable-next-line
                || (data && collapseCustomView) && (
                    <TableRow>
                        <TableCell colSpan={childColSpan} className="collapse-cell">
                            <Collapse in={expand} timeout="auto" unmountOnExit>
                                {(data && data[childElementKey]) ? children(data) : children}
                            </Collapse>
                        </TableCell>
                    </TableRow>
                )
                // eslint-disable-next-line
                || (expand && <tr><td className="shipment-not-found" colSpan={12}>{emptyChildMessage || dataNotFoundMessage}</td></tr>)
            }
            {/* collapse todo end  */}
        </>
    )
}

export default TableCollapseRow;

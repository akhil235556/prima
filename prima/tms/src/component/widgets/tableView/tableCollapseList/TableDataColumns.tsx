import TableCell from '@material-ui/core/TableCell';
import React from 'react';
import Button from '../../button/Button';
import { OverflowTip } from '../../tooltip/OverFlowToolTip';
import "./TableCollapseList.css";

interface TableColumnsProps {
    tableColumns?: Array<any>,
    data: any,
    onClickActionButton?: Function;
    actionButtonTitle?: string,
    actionButtonStyle?: string,
    totalCount?: number,
    icon?: any,
    onClickWayPoints?: (event: React.MouseEvent<HTMLButtonElement> | null) => void,
    noDataView?: any,
    expand?: any,
    rowIndex?: any
    onClickRow?: any
}

const TableDataColumns = (props: TableColumnsProps) => {
    return (
        <>
            {
                props.tableColumns && props.tableColumns.map((column: any, index: number) => {
                    return (
                        (column.type && column.type === "action" &&
                            < TableCell key={index} align="left" >
                                <Button
                                    buttonStyle={column.class ? column.class() : props.actionButtonStyle}
                                    title={column.buttonLabel ? column.buttonLabel : props.actionButtonTitle}
                                    rightIcon={column.icon && column.icon}
                                    leftIcon={column.leftIcon && column.leftIcon}
                                    onClick={(event: any) => ((column.onClickActionButton && column.onClickActionButton(props.data))
                                        || (props.onClickActionButton && props.onClickActionButton(props.data)))}
                                />
                            </ TableCell>
                        ) || (
                            column.customView &&
                            < TableCell key={index} align="left" className={column.class ? column.class(props.data[column.id]) : ''}>
                                {column.customView({ ...props.data, rowIndex: props.rowIndex })}
                            </TableCell>
                        ) ||
                        < TableCell onClick={props.onClickRow ? () => props.onClickRow(props.data) : () => { }} key={index} align="left" className={column.class ? column.class(props.data[column.id]) : ''}>
                            <OverflowTip
                                text={column.format ? column.format(props.data[column.id]) : props.data[column.id]}
                            />
                        </TableCell>
                    )
                })
            }
        </>
    );
}

export default TableDataColumns;

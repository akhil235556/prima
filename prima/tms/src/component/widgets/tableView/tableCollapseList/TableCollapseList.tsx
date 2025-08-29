import { TablePagination } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import React, { ReactNode, useEffect } from 'react';
import DataNotFound from '../../../error/DataNotFound';
import "./TableCollapseList.css";
import TableCollapseRow from './TableCollapseRow';
import TableHeader from './TableHeader';

interface TableListProps {
    rowsPerPage: number,
    rowsPerPageOptions: Array<number>,
    listData: Array<any> | undefined,
    currentPage: number,
    tableColumns: Array<any>,
    childrenColumns?: Array<any>
    onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void,
    onChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
    onClickActionButton?: Function;
    actionButtonTitle?: string,
    actionButtonStyle?: string,
    totalCount?: number,
    icon?: any,
    onClickWayPoints?: (event: React.MouseEvent<HTMLButtonElement> | null) => void,
    noDataView?: any,
    childElementKey?: string,
    emptyChildMessage?: string,
    collapseCustomView?: boolean,
    children?: ReactNode,
    expandRowIndex?: number,
    onClickIconButton?: any,
    onClickRow?: any
}

export default function TableCollapseList({
    onChangePage,
    currentPage,
    noDataView,
    rowsPerPage,
    rowsPerPageOptions,
    onChangeRowsPerPage,
    totalCount,
    childrenColumns,
    tableColumns,
    childElementKey,
    emptyChildMessage,
    collapseCustomView,
    children,
    expandRowIndex,
    onClickIconButton,
    onClickRow,
    ...props
}: TableListProps) {
    const [expandIndex, setExpandIndex] = React.useState<number>(0);
    const handleExpand = (index: number, item?: any) => {
        if (index === expandIndex - 1) {
            setExpandIndex(0);
            if (collapseCustomView) {
                item && onClickIconButton && onClickIconButton({ ...item, rowIndex: 0 })
            }
            return
        }
        setExpandIndex(index + 1);
        if (collapseCustomView) {
            item && onClickIconButton && onClickIconButton({ ...item, rowIndex: index + 1 })
        }
    }

    useEffect(() => {
        expandRowIndex && setExpandIndex(expandRowIndex)
    }, [expandRowIndex])

    return (
        (props.listData && props.listData.length > 0 &&
            (
                <div className="table-list-view table-collapse-list">
                    <Paper>
                        <div className="table-wrapper">
                            <Table stickyHeader>
                                <TableHeader tableColumns={tableColumns} isCollapsible />
                                <TableBody>
                                    {props.listData.map((item, index) => (
                                        <TableCollapseRow
                                            key={index}
                                            rowIndex={index}
                                            tableColumns={tableColumns}
                                            data={item}
                                            expand={expandIndex - 1 === index}
                                            changeExpand={() => handleExpand(index, item)}
                                            emptyChildMessage={emptyChildMessage}
                                            childrenColumns={childrenColumns}
                                            childElementKey={childElementKey}
                                            childColSpan={collapseCustomView ? tableColumns.length + 2 : tableColumns.length + 1}
                                            collapseCustomView={collapseCustomView}
                                            children={children}
                                            onClickRow={onClickRow}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {totalCount &&
                            <TablePagination
                                rowsPerPageOptions={rowsPerPageOptions}
                                component="div"
                                count={totalCount}
                                rowsPerPage={rowsPerPage}
                                page={(currentPage - 1)}
                                backIconButtonProps={{
                                    'aria-label': 'previous page',
                                }}
                                nextIconButtonProps={{
                                    'aria-label': 'next page',
                                }}
                                onChangePage={(event: any, page: number) => {
                                    onChangePage(event, page + 1)
                                }}
                                onChangeRowsPerPage={onChangeRowsPerPage}
                            />
                        }

                    </Paper>
                </div>
            )
        ) || (noDataView ? noDataView : <DataNotFound />)

    );
}


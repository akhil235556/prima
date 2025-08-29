import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import TableDataColumns from './TableDataColumns';
import TableHeader from './TableHeader';

interface TableCollapseProps {
    tableColumns?: Array<any>,
    data: Array<any>
    onClickActionButton?: Function;
    actionButtonTitle?: string,
    actionButtonStyle?: string,
    totalCount?: number,
    icon?: any,
    onClickWayPoints?: (event: React.MouseEvent<HTMLButtonElement> | null) => void,
    noDataView?: any,
}

export default function TableCollapseDetail({ data, tableColumns, ...props }: TableCollapseProps) {
    return (
        <Table className="table-collapse-detail">
            <TableHeader tableColumns={tableColumns} />
            <TableBody>
                {
                    data.map((item, index) => (
                        <TableRow
                            key={index}
                        >
                            <TableDataColumns data={item} tableColumns={tableColumns} {...props} />
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}
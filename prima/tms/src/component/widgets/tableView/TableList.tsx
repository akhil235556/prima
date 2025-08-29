import { TableHead, TablePagination } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React, { ReactNode } from 'react';
import DataNotFound from '../../error/DataNotFound';
import Button from '../button/Button';
import { OverflowTip } from '../tooltip/OverFlowToolTip';
import "./TableList.css";

interface TableListProps {
  rowsPerPage: number,
  rowsPerPageOptions: Array<number>,
  listData: Array<any> | undefined,
  currentPage: number,
  tableColumns?: Array<any>,
  onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void,
  onChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
  onClickActionButton?: Function;
  actionButtonTitle?: string,
  actionButtonStyle?: string,
  totalCount?: number,
  icon?: any,
  onClickWayPoints?: (event: React.MouseEvent<HTMLButtonElement> | null) => void,
  noDataView?: any,
  onClickRow?: any
}

interface TableHeaderWeb {
  headTitle?: Array<any>,
  children?: ReactNode,
}

export default function TableList(props: TableListProps) {
  const { onChangePage, currentPage, noDataView, onClickRow } = props;
  return (
    (props.listData && props.listData.length > 0 &&
      <div className="table-list-view">
        <Paper>
          <div className="table-wrapper">
            <Table stickyHeader>
              <TableHeaderWeb
                headTitle={props?.tableColumns} />
              <TableBody>
                {props.listData && props.listData.map((row: any, index: number) =>
                  <TableRow
                    key={index}
                    hover
                  >
                    {props.tableColumns && props.tableColumns.map((column: any, index: number) => (
                      (column.type && column.type === "action" &&
                        < TableCell key={index} align="left" >
                          <Button
                            buttonStyle={column.class ? column.class() : props.actionButtonStyle}
                            title={column.buttonLabel ? column.buttonLabel : props.actionButtonTitle}
                            rightIcon={column.icon && column.icon}
                            leftIcon={column.leftIcon && column.leftIcon}
                            onClick={(event: any) => ((column.onClickActionButton && column.onClickActionButton(row))
                              || (props.onClickActionButton && props.onClickActionButton(row)))}
                          />
                        </ TableCell>
                      ) || (
                        column.customView &&
                        < TableCell key={index} align="left" className={column.class ? column.class(row[column.id]) : ''}>
                          {column.customView(row)}
                        </TableCell>
                      ) ||
                      < TableCell onClick={onClickRow ? () => onClickRow(row) : () => { }} key={index} align="left" className={column.class ? column.class(row[column.id]) : ''}>
                        <OverflowTip
                          text={column.format ? column.format(row[column.id]) : row[column.id]}
                          cellIcon={column.cellIconLeft && column.cellIconLeft(row)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {props.totalCount &&
            <TablePagination
              rowsPerPageOptions={props.rowsPerPageOptions}
              component="div"
              count={props.totalCount}
              rowsPerPage={props.rowsPerPage}
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
              onChangeRowsPerPage={props.onChangeRowsPerPage}
            />
          }
        </Paper>
      </div>) ||
    (noDataView ? noDataView : <DataNotFound />)
  );

  function TableHeaderWeb(props: TableHeaderWeb) {
    return (
      <TableHead>
        <TableRow>
          {props.headTitle && props.headTitle.map((element: any, index: number) => (
            <TableCell
              key={index}
              align="left"
              style={{ minWidth: element.minWidth }}
            >
              {
                element.customHead ? element.customHead(element) : element.label
              }
              {element.mandatoryHeader && <span className="mandatory-flied">*</span>}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}
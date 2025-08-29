import { Collapse, ListItem } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import React, { useRef } from 'react';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { dataNotFoundMessage } from '../../../base/constant/MessageUtils';
import DataNotFound from '../../error/DataNotFound';
import Button from '../button/Button';
import InfiniteScrollList from '../InfiniteScrollList';
import TableList from '../tableView/TableList';
import './CardList.css';


interface ExpendableCardListProps {
    listData: Array<any> | undefined,
    tableColumns: Array<any>,
    childTableColumns?: Array<any>,
    childElementKey: any,
    onClickActionButton?: Function;
    actionButtonTitle?: string,
    actionButtonStyle?: string,
    icon?: any,
    onReachEnd?: Function
    isNextPage?: boolean
    onClickWayPoints?: Function
    noDataView?: any
    emptyChildMessage?: any
}

function ExpendableCardList(props: ExpendableCardListProps) {
    const boxRef = useRef(null);
    const { noDataView, childTableColumns, childElementKey, emptyChildMessage } = props;
    const [expandIndex, setExpandIndex] = React.useState<number>(0);
    const handleExpand = (index: number) => {
        if (index === expandIndex - 1) {
            setExpandIndex(0);
            return
        }
        setExpandIndex(index + 1)
    }
    return (
        (props.listData && props.listData.length > 0 &&
            <InfiniteScrollList
                onReachEnd={() => {
                    if (props.isNextPage) {
                        props.onReachEnd && props.onReachEnd()
                    }
                }}
                className="card-wrap"
                nextPage={props.isNextPage || false}
                boxRef={boxRef || {}}
            >
                {
                    props.listData && props.listData.map((row: any, listIndex: number) => (
                        <div
                            key={listIndex}
                            className="card-list align-items-center row"
                            ref={boxRef}
                        >
                            {props.tableColumns && props.tableColumns.map((column: any, index: number) => (
                                (column.type && column.type === "expand" &&
                                    <ListItem key={index} className={"trip-li align-items-start col-6 " + (column.class && column.class(row[column.id]) ? column.class(row[column.id]) : " ")}>
                                        <div className="col">
                                            <div className="collapse-icon" onClick={() => handleExpand(listIndex)}>
                                                {expandIndex - 1 === listIndex ? <span> <ExpandLess /> See Less </span> : <span>< ExpandMore /> See more </span>}
                                            </div>
                                        </div>
                                    </ListItem>
                                ) ||
                                (column.type && column.type === "action" &&
                                    <ListItem key={index} className={" col-6 "}>
                                        <Button
                                            key={index}
                                            buttonStyle={column.class ? column.class() : props.actionButtonStyle}
                                            title={column.buttonLabel ? column.buttonLabel : props.actionButtonTitle}
                                            leftIcon={column.leftIcon && column.leftIcon}
                                            rightIcon={column.icon && column.icon}
                                            onClick={(event: any) => ((column.onClickActionButton && column.onClickActionButton(row))
                                                || (props.onClickActionButton && props.onClickActionButton(row)))}
                                        />
                                    </ListItem>
                                ) ||
                                (column.customView &&
                                    <ListItem key={index} className={"trip-li align-items-start " + (column.class && column.class(row[column.id]) ? column.class(row[column.id]) : " col-6 ")}>
                                        {column.type && column.type === "multiAction" ? <div className="col"> {column.customView(row)}</div> : <div className="col">
                                            <span className="small-title d-block ">{column.label}</span>
                                            {column.customView(row)}
                                        </div>
                                        }
                                    </ListItem>
                                ) ||
                                <ListItem key={index} className={"trip-li align-items-start col-6 " + (column.class && column.class(row[column.id]) ? column.class(row[column.id]) : " ")}>
                                    <div className="col">
                                        <span className="small-title d-block ">{column.label}</span>
                                        <span className={"title d-block text-truncate " + (column.class && column.class(row[column.id]) ? column.class(row[column.id]) : "")}>
                                            {column.format ? column.format(row[column.id]) : row[column.id]}</span>
                                    </div>
                                </ListItem>
                            ))}
                            {/* collapse todo */}
                            {
                                ((row && row[childElementKey] && (
                                    <div className="col-md-12 p-0 table-list-mobile">
                                        <Collapse in={(expandIndex - 1 === listIndex)} timeout="auto" unmountOnExit>
                                            <TableList
                                                tableColumns={childTableColumns}
                                                currentPage={1}
                                                rowsPerPage={25}
                                                rowsPerPageOptions={rowsPerPageOptions}
                                                listData={row[childElementKey]}
                                                onChangePage={(event: any, page: number) => {
                                                    //dispatch(setCurrentPage(page));
                                                }}
                                                onChangeRowsPerPage={(event: any) => {
                                                    //dispatch(setRowPerPage(event.target.value))
                                                }}
                                            />
                                        </Collapse>
                                    </div>
                                )) || ((expandIndex - 1 === listIndex) && <span className="shipment-not-found">{emptyChildMessage || dataNotFoundMessage}</span>))
                            }
                            {/* collapse todo end  */}
                        </div>

                    ))
                }
            </InfiniteScrollList >) ||
        (noDataView ? noDataView : <DataNotFound />)
    );
}
export default ExpendableCardList;
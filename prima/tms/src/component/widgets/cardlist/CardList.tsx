import { ListItem } from '@material-ui/core';
import React, { useRef } from 'react';
import DataNotFound from '../../error/DataNotFound';
import Button from '../button/Button';
import InfiniteScrollList from '../InfiniteScrollList';
import './CardList.css';

interface CardListProps {
    listData: Array<any> | undefined,
    tableColumns: Array<any>,
    onClickActionButton?: Function;
    actionButtonTitle?: string,
    actionButtonStyle?: string,
    icon?: any,
    onReachEnd?: Function
    isNextPage?: boolean
    onClickWayPoints?: Function
    noDataView?: any
}

function CardList(props: CardListProps) {
    const { noDataView } = props;
    const boxRef = useRef(null);
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
                    props.listData && props.listData.map((row: any, index) =>
                        <div
                            className="card-list align-items-center row"
                            ref={boxRef}
                        >
                            {props.tableColumns && props.tableColumns.map((column: any, index: number) => (
                                (column.type && column.type === "action" &&
                                    <Button
                                        buttonStyle={column.class ? column.class() : props.actionButtonStyle}
                                        title={column.buttonLabel ? column.buttonLabel : props.actionButtonTitle}
                                        leftIcon={column.leftIcon && column.leftIcon}
                                        rightIcon={column.icon && column.icon}
                                        onClick={(event: any) => ((column.onClickActionButton && column.onClickActionButton(row))
                                            || (props.onClickActionButton && props.onClickActionButton(row)))}
                                    />
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
                        </div>
                    )
                }
            </InfiniteScrollList >) ||
        (noDataView ? noDataView : <DataNotFound />)
    );
}
export default CardList;
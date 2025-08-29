import React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Today, LocalShipping } from "@material-ui/icons";
import { convertDateFormat, displayDateTimeFormatter } from "../../../base/utility/DateUtils"

interface TransporterProps {
    comment: any,
    date: any,
    name: any
}

function TransporterInfo(props: TransporterProps) {
    const { comment, date, name } = props
    return (
        <ListItem className="trans-info">
            <ListItemAvatar className="chat-icon">
                <Avatar>
                    <LocalShipping className="white-text" />
                </Avatar>
            </ListItemAvatar>
            <div className="chat-box">
                <div className="chat-content">
                    <h6 className="chat-head blue-text">{name}</h6>
                    <p className="chat-desc">{comment}</p>
                </div>
                <div className="d-flex chat-date align-items-center">
                    <Avatar>
                        <Today />
                    </Avatar>
                    <span>{convertDateFormat(date, displayDateTimeFormatter)}</span>
                </div>
            </div>
        </ListItem>
    );
}

export default TransporterInfo;
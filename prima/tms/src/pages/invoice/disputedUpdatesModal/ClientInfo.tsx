import React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { AccountCircle, Today } from "@material-ui/icons";
import { convertDateFormat, displayDateTimeFormatter } from "../../../base/utility/DateUtils"

interface ClientProps {
    comment: any,
    date: any,
    name: any
}

function ClientInfo(props: ClientProps) {
    const { comment, date, name } = props
    return (
        <ListItem className="client-info justify-content-end">
            <div className="chat-box">
                <div className="chat-content text-right">
                    <h6 className="chat-head orange-text">{name}</h6>
                    <p className="chat-desc">{comment}</p>
                </div>
                <div className="d-flex chat-date align-items-center justify-content-end">
                    <span>{convertDateFormat(date, displayDateTimeFormatter)}</span>
                    <Avatar>
                        <Today />
                    </Avatar>
                </div>
            </div>
            <ListItemAvatar className="chat-icon text-right">
                <AccountCircle className="orange-text" />
            </ListItemAvatar>
        </ListItem>
    );
}

export default ClientInfo;
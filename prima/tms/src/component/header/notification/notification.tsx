import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import "./notification.css";
import moment from 'moment';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { getChannelLatest, getCount, markRead } from '../../../serviceActions/NotificationServiceAction';
import {
    setCountNotification,
    setSideNavigation
} from '../../../redux/actions/AppActions';
import { NotificationUrl } from '../../../base/constant/RoutePath';
import { useSelector, shallowEqual } from "react-redux";
import { Moment } from "moment";
import { useHistory } from "react-router-dom";

export default function Notification() {

    // Dropdown Menu
    const appDispatch = useDispatch();
    const [refresh, setRefresh] = React.useState(false);
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [pageContents, setPageContents] = React.useState<any>([]);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const notificationCount = useSelector((state: any) =>
        state.appReducer.notificationCount, shallowEqual
    )
    const refreshCount = useSelector((state: any) =>
        state.appReducer.refreshCount, shallowEqual
    )

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const getCountList = async () => {
            let queryParams: any = {
                service: "tms"
            }
            appDispatch(getCount(queryParams)).then((response: any) => {
                if (response) {
                    (response.details && response.details.unread) ?
                        appDispatch(setCountNotification(response.details.unread)) :
                        appDispatch(setCountNotification(0))
                }
            })
        }
        getCountList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshCount, refresh]);

    useEffect(() => {
        const getList = async () => {
            let queryParams: any = {
                size: 4,
                service: "tms",
            }
            appDispatch(getChannelLatest(queryParams)).then((response: any) => {
                if (response) {
                    response.details && setPageContents(response.details.feeds);
                }
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notificationCount, refresh]);

    return (
        <div className="notification">
            <IconButton aria-label="show notifications" color="inherit"
                onClick={handleClick}
            >
                <Badge badgeContent={notificationCount} aria-controls="simple-menu" aria-haspopup="true" >
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                // id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                variant="selectedMenu"
                onClose={handleClose}
                className="notification-menu"
            >
                <div className="notification-header">{notificationCount} New {(notificationCount === 0 || notificationCount === 1) ? "Notification" : "Notifications"}</div>
                <div className="notification-list">
                    {pageContents && pageContents.map((item: any, index: number) => {
                        return (

                            <MenuItem
                                key={index}
                                className={item.unread ? "un-read" : ""}
                                onClick={() => {
                                    handleClose();
                                    if (item.unread) {
                                        onMarkRead(item.id);
                                    }
                                    let payload = item.payload && JSON.parse(item.payload);
                                    if (payload) {
                                        history.push(payload.click_action);
                                        appDispatch(setSideNavigation())
                                    }
                                }}>
                                {item.unread && <span className="un-read-icon"></span>}
                                <div className="menu-icon">
                                    <img src={getImageIconUrl(item.channel)} alt={item.channel} />
                                </div>
                                <div className="menu-content">
                                    <h6 className="menu-heading">{item.channel}</h6>
                                    <p>{item.message}</p>
                                    <span>{getNumberDays(item.createdAt)}</span>
                                </div>
                            </MenuItem>


                        )

                    })}
                </div>
                {/* <a className="view-btn" href={NotificationUrl}>View All</a> */}
                <div className="view-btn" onClick={() => {
                    handleClose();
                    history.push(NotificationUrl)
                }}>View All</div>

            </Menu>
        </div>
    )

    function getImageIconUrl(channel: any) {
        if (channel === "Dispatch Planning")
            return "/images/bus-icon.svg";
        else if (channel === "Freight Payments")
            return "/images/credit-card.svg";
        else if (channel === "Procurement")
            return "/images/dispatch-icon.svg";
        else if (channel === "Real Time Visibility")
            return "/images/real-time-icon.svg";
        else if (channel === "Advanced Goods Notice")
            return "/images/agn-notification-icon.svg";
        else if (channel === "Reverse Auction")
            return "/images/auction-notification-icon.svg"
        else
            return "/images/bell-icon.svg"
    }

    function getNumberDays(date: Moment | any) {
        var day1 = moment(date).format("YYYY-MM-DD");
        var day2 = moment(new Date()).format("YYYY-MM-DD")
        var days = moment.duration(moment(day2).diff(moment(day1))).asDays();
        // var days = getDifferenceInDatesAsDays(new Date(), date);
        switch (days) {
            case 0:
                return "Today";
            case 1:
                return "1 day ago"
            default:
                return (days ? days + " days ago" : "")
        }
    }

    function onMarkRead(id: any) {
        let queryParams: any = {
            feedId: id
        }
        appDispatch(markRead(queryParams)).then((response: any) => {
            if (response) {
                setRefresh((prev) => !prev);
            }
            // setRefresh((prev) => !prev);
        })
    }

}
import { Tab, TablePagination, Tabs } from '@material-ui/core';
import { Drafts } from '@material-ui/icons';
import moment, { Moment } from 'moment';
import React, { useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from '../../base/utility/ViewUtils';
import DataNotFound from '../../component/error/DataNotFound';
import Filter from '../../component/filter/Filter';
import Button from '../../component/widgets/button/Button';
import InfiniteScrollList from '../../component/widgets/InfiniteScrollList';
import { setRefreshCount, setSideNavigation } from '../../redux/actions/AppActions';
import { getChannelLatest, getGroupedNotifications, getNotificationList, markRead } from '../../serviceActions/NotificationServiceAction';
import "./AllNotification.css";
import { TabPanel } from './AllNotificationTab';
// import { getPastDate, convertDateToServerToDate, convertDateToServerFromDate } from "../../base/utility/DateUtils";
import AllNotificationSkeleton from "./allNotifictaionSkeleton/AllNotifictaionSkeleton";
import MarkNotificationModal from './markNotificationModal/MarkNotificationModal';
import AllNotificationCard from './notificationCard/AllNotificationCard';

function AllNotification() {
    const appDispatch = useDispatch();
    const history = useHistory();
    const [templateResponse, setTemplateResponse] = React.useState<any>();
    const [pageContents, setPageContents] = React.useState<any>([]);
    // const [refresh, setRefresh] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [channel, setChannel] = React.useState<any>("All Notifications");
    const [value, setValue] = React.useState(0);
    const [pagination, setPagination] = React.useState<any>();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [rowPerPage, setRowPerPage] = React.useState(rowsPerPageOptions[0]);
    const [openMarkNotificationModal, setOpenMarkNotificationModal] = React.useState<boolean>(false)
    const boxRef = useRef<any>();
    const refreshCount = useSelector((state: any) =>
        state.appReducer.refreshCount, shallowEqual
    )
    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
        setChannel(templateResponse[newValue].channel);
        setCurrentPage(1);
        setRowPerPage(rowsPerPageOptions[0]);
        setPageContents(undefined);
        getPageContent(templateResponse[newValue].channel, 1, rowsPerPageOptions[0], true);
    };

    useEffect(() => {
        const getList = async () => {
            let queryParamsPage: any = {
                service: "tms",
                channel: channel === "All Notifications" ? "" : channel,
                size: rowPerPage,
                page: currentPage
            }
            setLoading(true);
            var responseArray: any = [{
                channel: "All Notifications",
                count: 0
            }]
            Promise.all([appDispatch(getChannelLatest(queryParamsPage)), appDispatch(getNotificationList({
                service: "tms"
            }))]).then((response: any) => {
                if (response && response[0]) {
                    response[0].details && setPageContents(response[0].details.feeds);
                    response[0].details && setPagination(response[0].details.pagination);
                }
                if (response && response[1]) {
                    response[1].forEach((item: any) => {
                        responseArray.push({
                            channel: item.channel,
                        })
                    })
                    let queryParams: any = {
                        service: "tms",
                    }
                    return appDispatch(getGroupedNotifications(queryParams))
                }
                setLoading(false);
            }).then((response: any) => {
                if (response) {
                    response.details && response.details.forEach((item: any) => {
                        responseArray && responseArray.forEach((element: any) => {
                            if (element.channel === item.channel) {
                                element["count"] = item.counts.unread || 0;
                                responseArray[0].count += element["count"];
                            }
                        })
                    })
                }
                setTemplateResponse(responseArray)
                setLoading(false);
            });
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshCount]);

    return (
        <div>
            <MarkNotificationModal
                open={openMarkNotificationModal}
                selectedElement={
                    value === 0 ? undefined : templateResponse && templateResponse[value] && templateResponse[value].channel
                }
                onSuccess={() => {
                    setOpenMarkNotificationModal(false)
                }}
                onClose={() => {
                    setOpenMarkNotificationModal(false)
                }}
            />
            {
                isMobile ?
                    " "
                    :
                    <Filter
                        pageTitle="All Notifications"
                    />
            }
            <div className="notification-section">
                <div className={isMobile ? "notification-content" : "container-fluid"}>
                    <div className="row">
                        <div className="col-md-4 col-lg-auto pr-0 pl-0">
                            <div className="notification-left-nav">
                                <div className={isMobile ? "tab-nav mobile-tab-nav" : "notification-tab"}>
                                    <Tabs
                                        orientation={isMobile ? "horizontal" : "vertical"}
                                        value={value}
                                        scrollButtons="auto"
                                        variant="scrollable"
                                        onChange={handleChange}
                                    >
                                        {templateResponse && templateResponse.map((element: any, index: any) => (
                                            (element.count && element.count !== 0) ?
                                                <Tab
                                                    key={index}
                                                    label={element.channel}
                                                    value={index}
                                                    icon={<span className="notification-count">{(element.count > 99 ? "99+" : element.count) || 0}</span>}
                                                /> :
                                                <Tab
                                                    key={index}
                                                    label={element.channel}
                                                    value={index}
                                                />
                                        ))}
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                        <div className="col notify-right-content">
                            {(templateResponse && templateResponse[value] && templateResponse[value].hasOwnProperty("count") &&
                                templateResponse[value].count !== 0) &&
                                <div className="mark-all-row">
                                    <Button
                                        buttonStyle="btn-detail mr-3"
                                        title={"Mark all as read"}
                                        leftIcon={<Drafts />}
                                        loading={loading}
                                        onClick={() => {
                                            setOpenMarkNotificationModal(true);
                                        }}
                                    />
                                </div>
                            }

                            {loading ? <AllNotificationSkeleton /> :
                                (templateResponse && templateResponse.map((element: any, index: any) => (
                                    <TabPanel
                                        key={index}
                                        value={value}
                                        index={index}
                                    >
                                        {index === value && pageContent()}
                                    </TabPanel>
                                )))
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )

    function pageContent() {
        if (isMobile) {
            return (
                ((pageContents && pageContents.length > 0) &&
                    <div className="pt-15">
                        <InfiniteScrollList
                            onReachEnd={() => {
                                if (pagination && pagination.next) {
                                    setCurrentPage(pagination.next);
                                    getPageContent(channel, pagination.next, rowPerPage, false);
                                }
                            }}
                            className="card-wrap"
                            nextPage={(pagination && pagination.next) || false}
                            boxRef={boxRef || {}}
                        >
                            {
                                pageContents && pageContents.map((item: any, index: number) =>
                                    <AllNotificationCard
                                        key={index}
                                        notificationIcon={<img className="mr-3" src={getImageIconUrl(item.channel)} alt={item.channel} />}
                                        heading={item.channel}
                                        text={item.message}
                                        day={getNumberDays(item.createdAt)}
                                        onClick={() => {
                                            if (item.unread) {
                                                onMarkRead(item.id);
                                            }
                                            let payload = item.payload && JSON.parse(item.payload);
                                            if (payload) {
                                                history.push(payload.click_action)
                                                appDispatch(setSideNavigation())
                                            }
                                        }}
                                        unread={item.unread}
                                        forwardRef={boxRef}
                                        showMenu={item.payload && JSON.parse(item.payload)}
                                    />
                                )
                            }
                        </InfiniteScrollList>

                    </div>
                ) || <DataNotFound
                    header=""
                    customMessage="No new notifications !"
                />
            )
        } else {
            return (
                (pageContents && pageContents.length > 0 &&
                    <>
                        <div className="pt-15 notification-main">
                            {(pageContents && pageContents.map((item: any) => {
                                return (
                                    <AllNotificationCard
                                        notificationIcon={<img className="mr-3" src={getImageIconUrl(item.channel)} alt={item.channel} />}
                                        heading={item.channel}
                                        text={item.message}
                                        day={getNumberDays(item.createdAt)}
                                        onClick={() => {
                                            if (item.unread) {
                                                onMarkRead(item.id);
                                            }
                                            let payload = item.payload && JSON.parse(item.payload);
                                            if (payload) {
                                                history.push(payload.click_action);
                                                appDispatch(setSideNavigation())
                                            }

                                        }}
                                        unread={item.unread}
                                        showMenu={item.payload && JSON.parse(item.payload)}
                                    />
                                )
                            }))}
                        </div>

                        {pagination && pagination.count &&
                            <TablePagination
                                rowsPerPageOptions={rowsPerPageOptions}
                                component="div"
                                // totalCount={state.pagination && state.pagination.count}
                                count={pagination && pagination.count}
                                rowsPerPage={rowPerPage}
                                page={(currentPage - 1)}
                                backIconButtonProps={{
                                    'aria-label': 'previous page',
                                }}
                                nextIconButtonProps={{
                                    'aria-label': 'next page',
                                }}
                                onChangePage={(event: any, page: number) => {
                                    setCurrentPage(page + 1);
                                    getPageContent(channel, page + 1, rowPerPage, false)
                                }}
                                onChangeRowsPerPage={(event: any) => {
                                    setRowPerPage(event.target.value);
                                    setCurrentPage(1)
                                    getPageContent(channel, 1, event.target.value, false);
                                }}
                            />
                        }


                    </>) || <DataNotFound
                    header=""
                    customMessage="No new notifications !"
                />

            )
        }


    }

    function getPageContent(channel: any, page: any, size: any, removePrev: any) {
        let queryParams: any = {
            channel: channel === "All Notifications" ? "" : channel,
            service: "tms",
            size: size,
            page: page
        }
        setLoading(true);
        appDispatch(getChannelLatest(queryParams)).then((response: any) => {
            if (response && response.details && response.details.feeds) {
                if (isMobile) {
                    var tempResponse: any = removePrev ? [] : pageContents;
                    for (let i = 0; i < response.details.feeds.length; i++) {
                        tempResponse.push(response.details.feeds[i])
                    }
                    setPageContents(tempResponse);

                } else {
                    response.details && setPageContents(response.details.feeds);
                }
                response.details && setPagination(response.details.pagination);
            }
            setLoading(false);
        })
    }

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
                appDispatch(setRefreshCount())
            }
        })
    }
}

export default AllNotification;

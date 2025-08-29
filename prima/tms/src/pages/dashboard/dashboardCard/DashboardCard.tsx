import { ListItemIcon } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { useHistory } from "react-router-dom";
import { InvoiceStatusEnum } from "../../../base/constant/ArrayList";
import { FreightBillingListUrl, ReportsUrl, TrackingUrl } from '../../../base/constant/RoutePath';
import { useHistoryHooks } from "../../../base/hooks/useHistoryHooks";
import { convertAmountToNumberFormat, convertToNumberFormat, numberFormatter } from "../../../base/utility/NumberUtils";
import { getDefaultDateParams } from "../../../base/utility/Routerutils";
import "./DashboardCard.css";

interface DashboardCardProps {
    dashboardCount: any
}
function DashboardCard(props: DashboardCardProps) {
    const { dashboardCount } = props;
    const history = useHistory();
    const loadPage = useHistoryHooks();
    return (
        <div className="dashboard-card-wrapper">
            <div className="row progress-card-row">
                <div className="col-md-6 col-lg-4">
                    <List className="progress-card gray-card">
                        <ListItem
                            onClick={() => {
                                history.push(getDefaultDateParams(ReportsUrl))
                            }}
                        >
                            <ListItemIcon>
                                <img src="../images/truck.svg" alt="Management" />
                            </ListItemIcon>
                            <ListItemText>
                                <h4 className="card-head">Planning Management</h4>
                                <div className="row card-content">
                                    <div className="col">
                                        <h3>{((dashboardCount && dashboardCount.confirmed && convertToNumberFormat(dashboardCount.confirmed, numberFormatter)) || 0)}</h3>
                                        <span>Inbound</span>
                                    </div>
                                    <div className="col">
                                        <h3>{((dashboardCount && dashboardCount.placed && convertToNumberFormat(dashboardCount.placed, numberFormatter)) || 0)}</h3>
                                        <span>Dispatch</span>
                                    </div>
                                </div>
                            </ListItemText>
                        </ListItem>
                    </List>
                </div>
                <div className="col-md-6 col-lg-4">
                    <List className="progress-card orange-card">
                        <ListItem
                            onClick={() => {
                                loadPage(TrackingUrl);
                            }}
                        >
                            <ListItemIcon>
                                <img src="../images/track.svg" alt="Tracking" />
                            </ListItemIcon>
                            <ListItemText>
                                <h4 className="card-head">Tracking</h4>
                                <div className="row card-content">
                                    <div className="col">
                                        <h3 className="green-text">{((dashboardCount && dashboardCount.OnSchedule && convertToNumberFormat(dashboardCount.OnSchedule, numberFormatter)) || 0)}</h3>
                                        <span>On Schedule</span>
                                    </div>
                                    <div className="col">
                                        <h3 className="red-text">{((dashboardCount && dashboardCount.Delayed && convertToNumberFormat(dashboardCount.Delayed, numberFormatter)) || 0)}</h3>
                                        <span>Delayed</span>
                                    </div>
                                </div>
                            </ListItemText>
                        </ListItem>
                    </List>
                </div>
                <div className="col-md-6 col-lg-4">
                    <List className="progress-card blue-card">
                        <ListItem
                            onClick={() => {
                                loadPage(FreightBillingListUrl + InvoiceStatusEnum.PENDING)
                            }}
                        >
                            <ListItemIcon>
                                <img src="../images/payment.svg" alt="Payment" />
                            </ListItemIcon>
                            <ListItemText>
                                <h4 className="card-head">Freight Payment</h4>
                                <div className="row card-content">
                                    <div className="col">
                                        <h3 className="green-text">
                                            <img src="./images/rupee-green.svg" alt="rupee" className="mr-1" /> {((dashboardCount && dashboardCount.totalPaidAmount && convertAmountToNumberFormat(dashboardCount.totalPaidAmount, numberFormatter)) || "0.00")}
                                        </h3>
                                        <span>Paid</span>
                                    </div>
                                    <div className="col">
                                        <h3 className="orange-text">
                                            <img src="./images/rupee-orange.svg" alt="rupee" className="mr-1" /> {((dashboardCount && dashboardCount.totalPendingAmount && convertAmountToNumberFormat(dashboardCount.totalPendingAmount, numberFormatter)) || "0.00")}
                                        </h3>
                                        <span>Pending</span>
                                    </div>
                                </div>
                            </ListItemText>
                        </ListItem>
                    </List>
                </div>
            </div>
        </div>
    );
}

export default DashboardCard;

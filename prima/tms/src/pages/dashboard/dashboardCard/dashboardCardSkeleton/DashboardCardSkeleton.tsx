import React from "react";
import "./DashboardCardSkeleton.css";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { ListItemIcon } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

function DashboardCardSkeleton() {
    return (
        <div className="dashboard-card-wrapper dashbaord-skeleton-wrapper">
            <div className="row progress-card-row">
                {[1, 2, 3].map((element: any) => (
                    <div className="col-md-6 col-lg-4" key={element}>
                        <List className="progress-card">
                            <ListItem>
                                <ListItemIcon>
                                    <Skeleton animation="wave" variant="circle" />
                                </ListItemIcon>
                                <ListItemText>
                                    <h4 className="card-head"><Skeleton animation="wave" /></h4>
                                    <div className="row card-content">
                                        {[1, 2].map((element: any) => (
                                            <div className="col" key={element}>
                                                <h3><Skeleton animation="wave" /></h3>
                                                <span><Skeleton animation="wave" /></span>
                                            </div>
                                        ))}
                                    </div>
                                </ListItemText>
                            </ListItem>
                        </List>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardCardSkeleton;

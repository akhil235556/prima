import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";
import './VehicleSkeleton.css';

function VehicleSkeleton() {
    return (
        <div className="row vehicle-report-row">
            {[1, 2, 3, 4].map((element: any) => (
                <div className="col-md-6 vehicle-report-card" key={element}>
                    <div className="billing-info-wrapp">
                        <div className="billing-info-header d-flex align-items-center justify-content-between">
                        </div>
                        <div className="vehicle-report-content vehicle-skeleton">
                            <div className="row">
                                <div className="col-md-4 vehicle-left text-center">
                                    <div className="vehicle-data">
                                        <h4> <Skeleton animation="wave" /></h4>
                                        <span> <Skeleton animation="wave" /> <Skeleton animation="wave" /></span>
                                    </div>
                                    <div className="vehicle-data">
                                        <h4> <Skeleton animation="wave" /></h4>
                                        <span> <Skeleton animation="wave" /> <Skeleton animation="wave" /></span>
                                    </div>
                                </div>
                                <div className="col-md-8 vehicle-right text-center align-self-center">
                                    <div className="skeleton-graph-circle">
                                        <div className="skeleton-graph-border"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

    );
}

export default VehicleSkeleton;

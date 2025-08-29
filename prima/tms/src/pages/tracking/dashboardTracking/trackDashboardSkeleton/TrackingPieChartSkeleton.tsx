import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import './PerformanceSkeleton.css';

function TrackingPieChartSkeleton() {
    return (
        <div className="row performance-report-row">
            {[1].map((element: any) => (
                <div className="col-md-12 performance-report-card" key={element}>
                    <div className="billing-info-wrapp">
                        <div className="billing-info-header d-flex align-items-center justify-content-between">
                        </div>
                        <div className="perform-report-content perform-skeleton">
                            <div className="row">
                                <div className="col-md-4 perform-left text-center">
                                    <div className="perform-data">
                                        <h4> <Skeleton animation="wave" /></h4>
                                        <span> <Skeleton animation="wave" /> <Skeleton animation="wave" /></span>
                                    </div>
                                    <div className="perform-data">
                                        <h4> <Skeleton animation="wave" /></h4>
                                        <span> <Skeleton animation="wave" /> <Skeleton animation="wave" /></span>
                                    </div>
                                </div>
                                <div className="col-md-8 perform-right text-center align-self-center">
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

export default TrackingPieChartSkeleton;

import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import './AnalyticsSkeleton.css';

function AnalyticsSkeleton() {
    return (

        <div className="row analytics-row analytics-skeleton">
            <div className="col-md-5">
                <div className="row">
                    <div className="col-6 analytics-card">
                        <div className="analytics-data">
                            <h4><Skeleton animation="wave" /></h4>
                            <p><Skeleton animation="wave" /> <Skeleton animation="wave" /></p>
                        </div>
                    </div>
                    <div className="col-6 analytics-card">
                        <div className="analytics-data">
                            <h4 className="red-text"><Skeleton animation="wave" /></h4>
                            <p><Skeleton animation="wave" /> <Skeleton animation="wave" /></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-7 text-center analytics-graph-card">
                <div className="analytics-graph">
                    {/* <img src="../images/skeleton-circle.png" alt="graph" /> */}
                    <div className="skeleton-graph-circle">
                        <div className="skeleton-graph-border"></div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AnalyticsSkeleton;

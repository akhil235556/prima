import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import './LoadabilitySkeleton.css';

function LoadabilitySkeleton() {
    return (

        <div className="row load-row align-items-center load-skeleton">
            <div className="col-md-12 col-lg-4">
                <div className="load-data">
                    {[1, 2, 3].map((element: any) => (
                        <ul className="row load-list align-items-center" key={element}>
                            <li className="col-md-8"> <Skeleton animation="wave" /> </li>
                            <li className="col-md-4">
                                <h4><Skeleton animation="wave" /></h4>
                                <span><Skeleton animation="wave" /></span>
                            </li>
                        </ul>
                    ))}
                </div>
            </div>
            <div className="col-md-12 col-lg-8 align-self-stretch">
                <div className="analytics-graph justify-content-center d-flex align-items-center">
                    <img src="/images/graph-skeleton.png" alt="graph" />
                </div>
            </div>
        </div>

    );
}

export default LoadabilitySkeleton;

import React from "react";
import './SobSkeleton.css';
import { isMobile } from "../../../../base/utility/ViewUtils";
import SobListSkeleton from "./SobListSkeleton";

function SobSkeleton() {
    return (
        <div className="sob-skeleton-wrap">
            <div className="sob-report-graph d-flex align-items-center">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center">
                            <div className="skeleton-graph-circle">
                                <div className="skeleton-graph-border"></div>
                            </div>
                        </div>
                        {
                            isMobile ? "" :
                                <div className="col-md-6">
                                    <div className="row">
                                        {[1, 2].map((element: any) => (
                                            <div className="col-md-6" key={element}>
                                                <SobListSkeleton />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                        }
                    </div>
                </div>
            </div>
        </div>

    );
}

export default SobSkeleton;

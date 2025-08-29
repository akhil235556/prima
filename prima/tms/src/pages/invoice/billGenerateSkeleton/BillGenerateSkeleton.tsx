import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import './BillGenerateSkeleton.css';

export default function BillGenerateSkeleton() {
    return (
        <div className="bill-generate-skeleton">
            <div className="container-fluid">
                <div className="row">
                    {[1, 2].map((element: any) => (
                        <div className="col-md-6" key={element}>
                            <div className="billing-info-wrapp">
                                <div className="billing-info-header">
                                    <div className="row flex-grow-1">
                                        <div className="col-6">
                                            <Skeleton animation="wave" />
                                        </div>
                                    </div>
                                </div>
                                <div className="freight-info-content">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((element: any) => (
                                        <ul className="row list-info align-items-center justify-content-center" key={element}>
                                            <li className="col-md-2 col-4 text-right"><Skeleton animation="wave" /></li>
                                            <li className="col-md-3 col-5"><Skeleton animation="wave" /></li>
                                        </ul>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
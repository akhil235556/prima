import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import './AllNotificationSkeleton.css';

export default function AllNotifictaionSkeleton() {
    return (
        <div className="all-notifictaion-skeleton">
            <div className="container-fluid">
                {[1, 2, 3, 4, 5, 6].map((element: any) => (
                    <div className="row notify-skeleton-card align-items-center" key={element}>
                        <div className="col-md-1 col-3">
                            <Skeleton variant="circle" animation="wave" width={52} height={52} style={{ margin: 'auto' }} />
                        </div>
                        <div className="col-md-11 col-9 pl-0 notify-skeleton-content">
                            <Skeleton animation="wave" width={"26%"} height={17} />
                            <Skeleton animation="wave" width={"81%"} style={{ marginBottom: 4 }} />
                            <Skeleton animation="wave" width={"46%"} />
                            <Skeleton animation="wave" width={70} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
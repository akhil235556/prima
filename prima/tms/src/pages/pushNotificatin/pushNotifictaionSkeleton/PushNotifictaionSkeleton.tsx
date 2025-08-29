import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import './PushNotifictaionSkeleton.css';
import { isMobile } from '../../../base/utility/ViewUtils';

export default function PushNotifictaionSkeleton() {
    return (
        <div className="push-notifictaion-skeleton">
            {
                isMobile ?
                    <div className="container-fluid">
                        {[1, 2, 3, 4, 5, 6].map((element: any) => (
                            <div className="row push-notification-card align-items-center" key={element}>
                                <div className="col-12 mb-3">
                                    <Skeleton animation="wave" width={"50%"} height={18} />
                                </div>
                                {[1, 2].map((element: any) => (
                                    <div className="col-md-6 notify-skeleton-content" key={element}>
                                        <div className="row align-items-center">
                                            <div className="col-10">
                                                <Skeleton animation="wave" width={"42%"} height={13} style={{ marginBottom: 5 }} />
                                                <Skeleton animation="wave" width={"60%"} />
                                            </div>
                                            <div className="col-2 skel-left">
                                                <Skeleton animation="wave" className="ml-auto" width={40} height={18} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    :
                    <div className="container-fluid">
                        {[1, 2, 3, 4, 5, 6].map((element: any) => (
                            <div className="row push-notification-card align-items-center" key={element}>
                                <div className="col-12 mb-3">
                                    <Skeleton animation="wave" width={"18%"} height={18} />
                                </div>
                                {[1, 2, 3].map((element: any) => (
                                    <div className="col-md-6 notify-skeleton-content" key={element}>
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <Skeleton animation="wave" width={"42%"} height={13} style={{ marginBottom: 5 }} />
                                                <Skeleton animation="wave" width={"60%"} />
                                            </div>
                                            <div className="col-auto">
                                                <Skeleton animation="wave" width={40} height={18} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
            }
        </div>
    );
}
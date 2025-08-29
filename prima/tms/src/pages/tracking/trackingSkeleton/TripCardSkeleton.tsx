import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

function TripCardSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((index: any) => (
        <div
          key={index}
          className="row track-card">
          <div className="col-7">
            <div className="d-flex align-items-center">
              <Skeleton animation="wave" variant="circle" width={30} height={30} style={{ marginRight: 15, borderRadius: 50 }} />
              <Skeleton animation="wave" height={14} width="70%" />
            </div>
          </div>
          <div className="col-5">
            <Skeleton animation="wave" />
          </div>
          <div className="col-6">
            <Skeleton animation="wave" />
          </div>
          <div className="col-6">
            <Skeleton animation="wave" />
          </div>
          <div className="col-6">
            <Skeleton animation="wave" />
          </div>
          <div className="col-6">
            <Skeleton animation="wave" />
          </div>
          <div className="col-6">
            <Skeleton animation="wave" />
          </div>
          <div className="col-6">
            <Skeleton animation="wave" />
          </div>
        </div>
      ))}
    </>
  );
}

export default TripCardSkeleton;
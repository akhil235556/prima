import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

function DetailSkeleton() {
  return (
    <div className="skeleton-trip-detail">
      {/* <div className="row">
        <div className="col-6 mt-2"><Skeleton animation="wave" height={27} style={{ borderRadius: 50 }} /></div>
      </div> */}
      <div className="row skeleton-progress">
        {[1, 2, 3, 4, 5].map((element: any, index: number) => (
          <div
            key={index}
            className="d-flex col-12 align-items-center mb-5">
            <Skeleton animation="wave" variant="circle" width={11} height={11} style={{ marginRight: 20, borderRadius: 50 }} />
            <Skeleton animation="wave" height={10} width="50%" style={{ borderRadius: 50 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetailSkeleton;
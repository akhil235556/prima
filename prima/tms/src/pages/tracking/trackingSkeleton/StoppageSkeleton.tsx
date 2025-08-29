import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

function StoppageSkeleton() {
  return (
    <div className="skeleton-stop-wrap">
      <div className="row">
        <div className="col-6 mt-2"><Skeleton animation="wave" height={27} style={{ borderRadius: 50 }} /></div>
      </div>
      <div className="row mt-2">
        <div className="col-12">
          {[1, 2, 3, 4].map((element: any, index: any) => (
            <div key={index} className="skeleton-stoppage">
              <Skeleton animation="wave" height={10} width="50%" style={{ borderRadius: 50 }} />
              <Skeleton animation="wave" height={10} style={{ borderRadius: 50 }} />
              <Skeleton animation="wave" height={10} width="70%" style={{ borderRadius: 50 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StoppageSkeleton;
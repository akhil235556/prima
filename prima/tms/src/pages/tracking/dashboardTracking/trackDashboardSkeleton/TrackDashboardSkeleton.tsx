import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import './TrackDashboardSkeleton.css';
// import ListingSkeleton from '../../../../component/widgets/listingSkeleton/ListingSkeleton';
// import { isMobile } from '../../../../base/utility/ViewUtils';

function TrackDashboardSkeleton() {
  return (
    <div className="track-dash-skeleton">

      <div className="container-fluid">
        <div className="row">
          {[1, 2, 3].map(() => (
            <div className="col-md-4">
              <div className="dash-card-skeleton">
                <div className="row w-100 align-items-center">
                  <div className="col-9">
                    <Skeleton animation="wave" height={31} width={126} style={{ borderRadius: 15, marginBottom: 20 }} />
                    <Skeleton animation="wave" height={15} width={183} />
                  </div>
                  <div className="col-3">
                    <Skeleton animation="wave" variant="circle" width={70} height={70} style={{ borderRadius: 26 }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* {
        isMobile
          ? "" :
          <div className="container-fluid">
            <ListingSkeleton />
          </div>
      } */}

    </div>
  );
}

export default TrackDashboardSkeleton;
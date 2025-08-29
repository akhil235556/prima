import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import { isMobile } from '../../../base/utility/ViewUtils';
import MapSkeleton from './MapSkeleton';
import './TrackingSkeleton.css';
import TripCardSkeleton from './TripCardSkeleton';

function TrackingSkeleton() {
  return (
    <div className="track-skeleton-wrap">
      <div className="row">
        <div className="col-md-3">
          <TripCardSkeleton />
        </div>
        {
          isMobile ? "" :
            <div className="col-md-9">
              <div className="row no-gutters">
                <div className="col-12 detail-skeleton-wrap">
                  <div className="row">
                    <div className="col-md-4 skeleton-trip-detail">
                      <div className="trip-head row">
                        <div className="col"><Skeleton animation="wave" height={18} /></div>
                        <div className="col"><Skeleton animation="wave" height={18} /></div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-6"><Skeleton animation="wave" height={33} /></div>
                        <div className="col-6"><Skeleton animation="wave" height={33} /></div>
                      </div>
                      <div className="row">
                        <div className="col-6 mt-2"><Skeleton animation="wave" height={27} style={{ borderRadius: 50 }} /></div>
                      </div>
                      <div className="row skeleton-progress">
                        {[1, 2, 3, 4].map((index: any) => (
                          <div
                            key={index}
                            className="d-flex col-12 align-items-center mb-5">
                            <Skeleton animation="wave" variant="circle" width={11} height={11} style={{ marginRight: 20, borderRadius: 50 }} />
                            <Skeleton animation="wave" height={10} width="50%" style={{ borderRadius: 50 }} />
                          </div>
                        ))}
                      </div>

                    </div>
                    <div className="col-md-8 pl-0">
                      <MapSkeleton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
    </div>
  );
}

export default TrackingSkeleton;
import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import './ListingSkeleton.css';
import { isMobile } from '../../../base/utility/ViewUtils';

function ListingSkeleton() {
  return (
    isMobile ?
      <div className="skeleton-wrap">
        <div className="container-fluid">

          {[1, 2, 3, 4].map((element: any) => (
            <div className="row mobile-skeleton-card" key={element}>
              {[1, 2, 3, 4, 5, 6].map((element: any) => (
                <div className="col-6" key={element}>
                  <div className="skeleton-head">
                    <Skeleton animation="wave" />
                  </div>
                  <div className="skeleton-body">
                    <Skeleton animation="wave" />
                  </div>
                </div>
              ))}
            </div>
          ))}

        </div>

      </div>
      :
      <div className="skeleton-wrap">
        <div className="row skeleton-head m-0">
          {[1, 2, 3, 4, 5, 6].map((element: any) => (
            <div
              key={element}
              className="col"><Skeleton animation="wave" /></div>
          ))}
        </div>
        <div className="skeleton-body">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((element: any) => (
            <div
              key={element}
              className="row align-items-center">
              {[1, 2, 3, 4, 5, 6].map((element: any) => (
                <div
                  key={element}
                  className="col"><Skeleton animation="wave" /></div>
              ))}
            </div>
          ))}

        </div>
        <div className="skeleton-footer row m-0 align-items-center justify-content-end">
          <div className="col-4">
            <div className="row">
              <div className="col-6"><Skeleton animation="wave" /></div>
              <div className="col-3"><Skeleton animation="wave" /></div>
              <div className="col-3"><Skeleton animation="wave" /></div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ListingSkeleton;
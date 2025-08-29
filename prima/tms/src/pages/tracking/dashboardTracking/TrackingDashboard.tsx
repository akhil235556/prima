import { Tune, Visibility } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { tripsStatusEnum } from "../../../base/constant/ArrayList";
import { TrackingDashBoardListingUrl, TrackingMobileRunningUrl } from "../../../base/constant/RoutePath";
import { convertToNumberFormat, numberFormatter } from "../../../base/utility/NumberUtils";
import { useQuery } from "../../../base/utility/Routerutils";
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import DataNotFound from "../../../component/error/DataNotFound";
import Filter from '../../../component/filter/Filter';
import Button from "../../../component/widgets/button/Button";
import { setCountResponse, toggleFilter, clearData } from '../../../redux/actions/TrackingDashboardActions';
import { getTripListCount, transientCount } from '../../../serviceActions/TrackingServiceActions';
import PieChart from "../../charts/PieChart";
import ReportCard from "./reportsCard/ReportCards";
import TrackDashboardSkeleton from "./trackDashboardSkeleton/TrackDashboardSkeleton";
import TrackingPieChartSkeleton from "./trackDashboardSkeleton/TrackingPieChartSkeleton";
import "./TrackingDashboard.css";

interface TrackingDashboardProps {
  filterChips: any;
  filterParams: any;
  filterDispatch: any;
  filterChipUI: Function;
  wrapperState: any
}

function TrackingDashboard({ filterChips, filterParams, filterDispatch, filterChipUI, wrapperState }: TrackingDashboardProps) {
  const appDispatch = useDispatch();
  const params = useQuery();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [runningCount, setRunningCount] = React.useState<any>({});

  useEffect(() => {
    filterDispatch(clearData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const getCountList = async () => {
      let queryParams: any = {};
      let queryParamsUnknown: any = {
        status: "INTRANSIT"
      };
      if (!isObjectEmpty(filterParams)) {
        queryParams = Object.assign(queryParams, filterParams)
        queryParamsUnknown = Object.assign(queryParamsUnknown, filterParams)
      }
      setLoading(true);
      Promise.all([appDispatch(getTripListCount(queryParams)), appDispatch(transientCount(queryParamsUnknown))])
        .then((response: any) => {
          response[0] && filterDispatch(setCountResponse(response[0]));
          response[1] && setRunningCount(response[1]);
          setLoading(false);
        });
    }
    getCountList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.search, wrapperState.refreshList]);

  return (
    <div className={"tracking-dash-wrapper"}>
      <Filter
        pageTitle={"Dashboard"}
        buttonStyle="btn-orange"
        buttonTitle={isMobile ? " " : "Filter"}
        leftIcon={<Tune />}
        onClick={() => {
          filterDispatch(toggleFilter());
        }}
      >
      </Filter>

      <div className="dash-container">
        {filterChipUI()}
        {(loading ?
          <TrackDashboardSkeleton /> :
          <>
            {
              <div className="track-card-wrap">
                <div className="row">

                  <div className="col-sm-12 col-lg-4" onClick={() => {
                    history.push({
                      pathname: TrackingDashBoardListingUrl + tripsStatusEnum.INIT,
                      search: params.toString()
                    })
                  }}>
                    <ReportCard
                      CardStyle={"scheduled-trip "}
                      heading="Scheduled Trip"
                      value={(wrapperState.countData && wrapperState.countData.INIT && convertToNumberFormat(wrapperState.countData.INIT, numberFormatter)) || 0}
                      image="/images/scheduled-trip.png"
                    />
                  </div>


                  <div className="col-sm-12 col-lg-4" onClick={() => {
                    isMobile ? history.push({
                      pathname: TrackingMobileRunningUrl,
                      search: params.toString()
                    }) :
                      history.push({
                        pathname: TrackingDashBoardListingUrl + tripsStatusEnum.INTRANSIT,
                        search: params.toString()
                      })
                  }}>
                    <ReportCard
                      CardStyle={"running-trip"}
                      heading="Running Trip"
                      value={(wrapperState.countData && wrapperState.countData.INTRANSIT && convertToNumberFormat(wrapperState.countData.INTRANSIT, numberFormatter)) || 0}
                      image="/images/running-trip.png"
                    />

                  </div>
                  <div className="col-sm-12 col-lg-4" onClick={() => {
                    history.push({
                      pathname: TrackingDashBoardListingUrl + tripsStatusEnum.COMPLETED,
                      search: params.toString()
                    })
                  }}>
                    <ReportCard
                      CardStyle={"complete-trip"}
                      heading="Completed Trip"
                      value={(wrapperState.countData && wrapperState.countData.COMPLETED && convertToNumberFormat(wrapperState.countData.COMPLETED, numberFormatter)) || 0}
                      image="/images/complete-trip.png"
                    />
                  </div>
                </div>
              </div>
            }
          </>
        )}
        {loading ? <TrackingPieChartSkeleton /> :
          <div className="col-md-12 col-lg-12 performance-report-card p-0">
            <div className="billing-info-wrapp">
              <div className="billing-info-header d-flex align-items-center justify-content-between">
                <h4>Running Trip</h4>
                <Button
                  buttonStyle="btn-orange view-pod-btn"
                  title="View"
                  leftIcon={<Visibility />}
                  onClick={() => {
                    isMobile ? history.push({
                      pathname: TrackingMobileRunningUrl,
                      search: params.toString()
                    }) :
                      history.push({
                        pathname: TrackingDashBoardListingUrl + tripsStatusEnum.INTRANSIT,
                        search: params.toString()
                      })
                  }}
                />
              </div>
              {(!isObjectEmpty(runningCount) && <div className="perform-report-content">
                <div className="row">
                  <div className="col-md-4 perform-left text-center">
                    <div className="tracking-data border-bottom col-lg-12 col-md-4">
                      <h4 className="green-text">{runningCount.OnSchedule || 0}</h4>
                      <span>On Schedule</span>
                    </div>
                    <div className="tracking-data border-bottom col-lg-12 col-md-4">
                      <h4 className="red-text">{runningCount.Delayed || 0}</h4>
                      <span>Delayed</span>
                    </div>
                    <div className="tracking-data col-lg-12 col-md-4">
                      <h4 className="orange-text">{runningCount.Unknown || 0}</h4>
                      <span>Non Trackable</span>
                    </div>
                  </div>
                  <div className="col-md-8 perform-right text-center align-self-center">
                    <PieChart
                      data={{
                        labels: ["On Schedule", "Delayed", "Non Trackable"],
                        datasets: [{
                          data: [(runningCount.OnSchedulePercentage || 0), (runningCount.DelayedPercentage || 0), (runningCount.UnknownPercentage || 0)],
                          backgroundColor: ["#1FC900", "red", "#f7931e"]
                        }]
                      }}
                      options={{
                        maintainAspectRatio: false,
                        legend: {
                          labels: {
                            boxWidth: isMobile ? 12 : 20
                          }
                        },
                      }}
                      height={isMobile ? 200 : 280}
                    />
                  </div>
                </div>
              </div>)
                || <div className="imageCard"><DataNotFound /></div>
              }
            </div>
          </div>
        }
      </div>
    </div >
  );
}
export default TrackingDashboard;

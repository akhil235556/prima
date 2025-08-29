import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { isMobile } from "../../base/utility/ViewUtils";
import Filter from '../../component/filter/Filter';
import { isSupported } from "../../push-notification";
import { aggregateData } from "../../serviceActions/BillGenerateServiceActions";
import { getDispatchOrderList } from "../../serviceActions/DispatchServiceActions";
import { updateToken } from "../../serviceActions/NotificationServiceAction";
import { getInboundOrderList, orderCount } from "../../serviceActions/OrderServiceActions";
import { getTripList, transientCount } from "../../serviceActions/TrackingServiceActions";
import LanePointsDisplayModal from "../masterPlatform/lane/LanePointsDisplayModal";
import "./Dashboard.css";
import DashboardCard from "./dashboardCard/DashboardCard";
import DashboardCardSkeleton from "./dashboardCard/dashboardCardSkeleton/DashboardCardSkeleton";
import DashboardMobileTabs from "./dashboardMobileTabs/DashboardMobileTabs";
import DashboardTabs from "./dashboardTabs/DashboardTabs";

function DashboardPage() {
  const appDispatch = useDispatch();
  const [dashboardCount, setDashboardCount] = React.useState<any>({});
  const [inboundList, setInboundList] = React.useState<any>({});
  const [dispatchList, setDispatchList] = React.useState<any>({});
  const [onScheduleList, setOnScheduleList] = React.useState<any>({});
  const [delayedList, setDelayedList] = React.useState<any>({});

  const [dispatchTab, setDispatchTab] = React.useState<number>(0);
  const [trackingTab, setTrackingTab] = React.useState<number>(0);
  const [mobileTab, setMobileTab] = React.useState<number>(0);

  const [countLoading, setCountLoading] = React.useState<boolean>(false);
  const [inboundLoading, setInboundLoading] = React.useState<boolean>(false);
  const [dispatchLoading, setDispatchLoading] = React.useState<boolean>(false);
  const [scheduleLoading, setScheduleLoading] = React.useState<boolean>(false);
  const [delayedLoading, setDelayedLoading] = React.useState<boolean>(false);
  const [lanePoints, showLanePoints] = React.useState<boolean>(false);
  const [laneCode] = React.useState<any>(undefined);

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {
        page: 1,
        pageSize: 25,
      }
      setInboundLoading(true);
      setDispatchLoading(true);
      setScheduleLoading(true);
      setDelayedLoading(true);
      appDispatch(getInboundOrderList({ ...queryParams })).then((response: any) => {
        setInboundList(response && response.results);
        setInboundLoading(false);
      });
      appDispatch(getDispatchOrderList({ ...queryParams })).then((response: any) => {
        setDispatchList(response && response.results);
        setDispatchLoading(false);
      });
      appDispatch(getTripList({ transientStatus: "On Schedule", status: "INTRANSIT" })).then((response: any) => {
        setOnScheduleList(response && response.trips);
        setScheduleLoading(false)
      })

      appDispatch(getTripList({ transientStatus: "Delayed", status: "INTRANSIT" })).then((response: any) => {
        setDelayedList(response && response.trips);
        setDelayedLoading(false)
      });
      setCountLoading(true);
      Promise.all([appDispatch(transientCount({ status: "INTRANSIT" })), appDispatch(aggregateData()), appDispatch(orderCount())]).then((response: any) => {
        let dashboardData: any = {};
        response && response[0] && Object.assign(dashboardData, response[0]);
        response && response[1] && Object.assign(dashboardData, response[1]);
        response && response[2] && Object.assign(dashboardData, response[2]);
        setDashboardCount(dashboardData)
        setCountLoading(false);
      });
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateNotificationToken = async () => {
      let token = localStorage.getItem("token");
      if (token) {
        let params: any = {
          data: token,
          notificationType: "PUSH_WEB"
        }
        appDispatch(updateToken(params));
      };
    }
    isSupported() && updateNotificationToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="dashboard-wrapper">
      <Filter pageTitle="Dashboard" />
      {countLoading ? <DashboardCardSkeleton /> :
        <DashboardCard
          dashboardCount={dashboardCount}
        />}
      <LanePointsDisplayModal
        open={lanePoints}
        laneCode={laneCode}
        onClose={() => {
          showLanePoints(false);
        }}
      />

      {
        isMobile ?
          <DashboardMobileTabs
            inboundList={inboundList}
            inboundLoading={inboundLoading}
            dispatchList={dispatchList}
            dispatchLoading={dispatchLoading}
            onScheduleList={onScheduleList}
            delayedList={delayedList}
            mobileTab={mobileTab}
            scheduleLoading={scheduleLoading}
            delayedLoading={delayedLoading}
            onChangeMobileTab={(value: number) => setMobileTab(value)}
            showLanePoints={(laneCode: any) => {
              // laneCode && setLaneCode(laneCode);
              // laneCode && showLanePoints(true);
            }}
          />
          :
          <DashboardTabs
            inboundList={inboundList}
            inboundLoading={inboundLoading}
            dispatchList={dispatchList}
            dispatchLoading={dispatchLoading}
            onScheduleList={onScheduleList}
            delayedList={delayedList}
            dispatchTab={dispatchTab}
            trackingTab={trackingTab}
            scheduleLoading={scheduleLoading}
            delayedLoading={delayedLoading}
            onChangeDispatchTab={(value: number) => setDispatchTab(value)}
            onChangeTrackingTab={(value: number) => setTrackingTab(value)}
            showLanePoints={(laneCode: any) => {
              // laneCode && setLaneCode(laneCode);
              // laneCode && showLanePoints(true);
            }}
          />
      }
    </div>
  );
}

export default DashboardPage;

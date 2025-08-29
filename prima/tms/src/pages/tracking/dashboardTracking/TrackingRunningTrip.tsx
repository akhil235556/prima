import { GetApp, KeyboardBackspace, Tune } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { runningTripsStatusEnum, tripsStatusEnum } from "../../../base/constant/ArrayList";
import { downloadCsvTitle } from "../../../base/constant/MessageUtils";
import { convertToNumberFormat, numberFormatter } from "../../../base/utility/NumberUtils";
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import FileAction from "../../../component/fileAction/FileAction";
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from "../../../component/widgets/button/Button";
import CardList from '../../../component/widgets/cardlist/CardList';
import { setCurrentPage, setResponse, setResponseUndefined, toggleFilter } from '../../../redux/actions/TrackingDashboardActions';
import { getCsvLink, getTripList, transientCount } from '../../../serviceActions/TrackingServiceActions';
import { dashboardTableColumns } from "../../../templates/TrackingTemplates";
import ReportCard from "./reportsCard/ReportCards";
import TrackDashboardSkeleton from "./trackDashboardSkeleton/TrackDashboardSkeleton";
import "./TrackingDashboard.css";

interface TrackingRunningTripProps {
  filterChips: any;
  filterParams: any;
  filterDispatch: any;
  filterChipUI: Function;
  wrapperState: any
}

function TrackingRunningTrip({ filterChips, filterParams, filterDispatch, filterChipUI, wrapperState }: TrackingRunningTripProps) {
  const [loading, setLoading] = React.useState(false);
  const [CSVloading, setCSVLoading] = React.useState(false);
  const [loadingList, setLoadingList] = React.useState(false);
  const [listToggle, setListToggle] = React.useState(false);
  const [dataCount, setDataCount] = React.useState<any>({});
  const [transientStatus, setTransientStatus] = React.useState("")
  const appDispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {};
      if (!isObjectEmpty(filterParams)) {
        queryParams = Object.assign(queryParams, filterParams)
      }
      setLoadingList(true);
      queryParams.page = wrapperState.currentPage;
      queryParams.size = wrapperState.pageSize;
      queryParams.status = tripsStatusEnum.INTRANSIT
      queryParams.transientStatus = transientStatus
      appDispatch(getTripList(queryParams)).then((response: any) => {
        filterDispatch(setResponse(response));
        setLoadingList(false);
      })
    }
    transientStatus && getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    wrapperState.currentPage,
    history.location.search,
    wrapperState.refreshList,
    transientStatus,
    appDispatch,
    wrapperState.pageSize
  ]);

  useEffect(() => {
    const getCountList = async () => {

      let queryParams: any = {
        status: "INTRANSIT"
      };
      if (!isObjectEmpty(filterParams)) {
        queryParams = Object.assign(queryParams, filterParams)
      }
      setLoading(true);
      const countData = await appDispatch(transientCount(queryParams))
      setDataCount(countData);
      setLoading(false)
    }
    !listToggle && getCountList();
    // eslint-disable-next-line
  }, [history.location.search, appDispatch, listToggle]);

  function downloadCsvAction() {
    let queryParams: any = {};
    if (!isObjectEmpty(filterParams)) {
      queryParams = Object.assign(queryParams, filterParams)
    }
    queryParams.status = tripsStatusEnum.INTRANSIT;
    queryParams.transientStatus = transientStatus;
    setCSVLoading(true);
    appDispatch(getCsvLink(queryParams)).then((response: any) => {
      setCSVLoading(false);
      response && window.open(response);
    })
  }

  return (
    <div className="tracking-dash-wrapper track-schedule-mob">
      <Filter
        pageTitle={listToggle ? getPageTitle() : "Running Trip"}
      >
        <div className="csv-order">
          <Button
            buttonStyle="btn-orange"
            title={" "}
            leftIcon={<Tune />}
            disable={loading || CSVloading || loadingList}
            onClick={() => {
              filterDispatch(toggleFilter());
            }}
          />
        </div>

        {listToggle ?
          (
            <div className="back-arrow-btn">
              <Button
                buttonStyle="p-0"
                leftIcon={<KeyboardBackspace />}
                onClick={() => {
                  setListToggle(false);
                  filterDispatch(setResponseUndefined());
                  setTransientStatus("")
                }}
              />
            </div>
          )
          : (
            <div className="back-arrow-btn">
              <Button
                buttonStyle="p-0"
                leftIcon={<KeyboardBackspace />}
                onClick={() => {
                  history.goBack();
                }}
              />
            </div>
          )
        }
        {listToggle &&
          <div className="order-4">
            <FileAction
              options={[
                {
                  menuTitle: downloadCsvTitle,
                  Icon: GetApp,
                  onClick: downloadCsvAction
                }
              ]}
            />
          </div>
        }
      </Filter>

      <div className="dash-container">
        {filterChipUI()}
        {(loading && !listToggle ?
          <TrackDashboardSkeleton /> :
          <>
            {!listToggle &&
              <div className="track-card-wrap running-trip-wrap">
                <div className="row">
                  <div className="col-md-12" onClick={() => {
                    // filterDispatch(setStatus(tripsStatusEnum.INIT));
                    setTransientStatus(runningTripsStatusEnum.TRANSIT)
                    filterDispatch(setCurrentPage(1));
                    setListToggle(true);
                  }}>
                    <ReportCard
                      CardStyle={"running-trip "}
                      heading="On Schedule"
                      value={(dataCount && dataCount.OnSchedule && convertToNumberFormat(dataCount.OnSchedule, numberFormatter)) || 0}
                      image="/images/onSchedule.png"
                    />
                  </div>
                  <div className="col-md-12" onClick={() => {
                    // filterDispatch(setStatus(tripsStatusEnum.UNKNOWN))
                    setTransientStatus(runningTripsStatusEnum.DELAYED)
                    filterDispatch(setCurrentPage(1));
                    setListToggle(true);

                  }}>
                    <ReportCard
                      CardStyle={"delay-trip"}
                      heading="Delayed"
                      value={(dataCount && dataCount.Delayed && convertToNumberFormat(dataCount.Delayed, numberFormatter)) || 0}
                      image="/images/delayed.png"
                    />

                  </div>
                  <div className="col-md-6 col-lg-4" onClick={() => {
                    // filterDispatch(setStatus(tripsStatusEnum.INTRANSIT))
                    setTransientStatus(runningTripsStatusEnum.UNKNOWN)
                    filterDispatch(setCurrentPage(1));
                    setListToggle(true);
                  }}>
                    <ReportCard
                      CardStyle={"scheduled-trip"}
                      heading="Non Trackable"
                      value={(dataCount && dataCount.Unknown && convertToNumberFormat(dataCount.Unknown, numberFormatter)) || 0}
                      image="/images/non-trackable.png"
                    />
                  </div>
                </div>
              </div>
            }

            {(listToggle) &&
              (
                <PageContainer
                  loading={loadingList}
                  listData={wrapperState.listData}
                >
                  <CardList
                    listData={wrapperState.listData}
                    tableColumns={dashboardTableColumns(tripsStatusEnum.INTRANSIT, transientStatus)}
                    isNextPage={wrapperState.pagination && wrapperState.pagination.next}
                    onReachEnd={() => {
                      filterDispatch(setCurrentPage(wrapperState.pagination.next));
                    }}
                  />
                </PageContainer>
              )
            }
          </>
        )}
      </div>

    </div>
  );


  function getPageTitle() {
    if (transientStatus === runningTripsStatusEnum.TRANSIT)
      return "On Schedule";
    else if (transientStatus === runningTripsStatusEnum.DELAYED)
      return "Delayed";
    else if (transientStatus === runningTripsStatusEnum.UNKNOWN)
      return "Non Trackable";
    else return "";
  }
}
export default TrackingRunningTrip;

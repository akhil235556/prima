import { GetApp, KeyboardBackspace, Tune } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from "react-router-dom";
import { rowsPerPageOptions, runningTripsStatusEnum, tripsStatusEnum } from "../../../base/constant/ArrayList";
import { convertToNumberFormat, numberFormatter } from "../../../base/utility/NumberUtils";
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from "../../../component/widgets/button/Button";
import CardList from '../../../component/widgets/cardlist/CardList';
import TableList from "../../../component/widgets/tableView/TableList";
import { setCurrentPage, setResponse, setRowPerPage, toggleFilter } from '../../../redux/actions/TrackingDashboardActions';
import { getCsvLink, getTripList, transientCount } from '../../../serviceActions/TrackingServiceActions';
import { dashboardTableColumns } from "../../../templates/TrackingTemplates";
import ReportCard from "./reportsCard/ReportCards";
import TrackDashboardSkeleton from "./trackDashboardSkeleton/TrackDashboardSkeleton";
import FileAction from '../../../component/fileAction/FileAction';
import "./TrackingDashboard.css";
import { downloadCsvTitle } from "../../../base/constant/MessageUtils";

interface TrackingDashboardProps {
  filterChips: any;
  filterParams: any;
  filterDispatch: any;
  filterChipUI: Function;
  wrapperState: any
}


function TrackingListing({ filterChips, filterParams, filterDispatch, filterChipUI, wrapperState }: TrackingDashboardProps) {
  const history = useHistory();
  const appDispatch = useDispatch();
  const { id } = useParams<any>();
  const [loading, setLoading] = React.useState(false);
  const [CSVloading, setCSVLoading] = React.useState(false);
  const [loadingList, setLoadingList] = React.useState(false);
  const [status, setStatus] = React.useState<any>(runningTripsStatusEnum.TRANSIT);
  const [runningCount, setRunningCount] = React.useState<any>({});

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {};
      if (!isObjectEmpty(filterParams)) {
        queryParams = Object.assign(queryParams, filterParams)
      }
      queryParams.page = wrapperState.currentPage;
      queryParams.size = wrapperState.pageSize;
      if (id === tripsStatusEnum.INTRANSIT) {
        queryParams.status = tripsStatusEnum.INTRANSIT;
        queryParams.transientStatus = status;
      } else {
        queryParams.status = id;
      }
      setLoadingList(true);
      appDispatch(getTripList(queryParams)).then((response: any) => {
        filterDispatch(setResponse(response));
        setLoadingList(false);
      })
    }
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperState.currentPage, history.location.search, wrapperState.refreshList, status, wrapperState.pageSize, appDispatch, id]);

  useEffect(() => {
    const getCountList = async () => {
      let queryParamsUnknown: any = {
        status: "INTRANSIT"
      };
      if (!isObjectEmpty(filterParams)) {
        queryParamsUnknown = Object.assign(queryParamsUnknown, filterParams)
      }
      setLoading(true);
      Promise.all([appDispatch(transientCount(queryParamsUnknown))])
        .then((response: any) => {
          response[0] && setRunningCount(response[0]);
          setLoading(false);
        });
    }
    (id === tripsStatusEnum.INTRANSIT) && getCountList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.search, wrapperState.refreshList, appDispatch, id]);

  function downloadCsvAction() {
    let queryParams: any = {};
    if (!isObjectEmpty(filterParams)) {
      queryParams = Object.assign(queryParams, filterParams)
    }
    if (id === tripsStatusEnum.INTRANSIT) {
      queryParams.status = id;
      queryParams.transientStatus = status
    } else {
      queryParams.status = id;
    }
    setCSVLoading(true);
    appDispatch(getCsvLink(queryParams)).then((response: any) => {
      setCSVLoading(false);
      response && window.open(response);
    })
  }

  return (
    <div className={isMobile ? "track-schedule-mob" : "tracking-dash-wrapper"}>
      <Filter
        pageTitle={getPageTitle()}
        buttonStyle="btn-orange"
        buttonTitle={undefined}
        leftIcon={<Tune />}
        onClick={() => {
          filterDispatch(toggleFilter());
        }}
      >
        <div className="back-arrow-btn">
          <Button
            buttonStyle={isMobile ? "p-0" : "btn-detail"}
            title={isMobile ? " " : "Back"}
            leftIcon={<KeyboardBackspace />}
            onClick={() => {
              history.goBack();
            }}
          />
        </div>
        <div className="csv-order">
          <Button
            buttonStyle="btn-orange"
            title={isMobile ? " " : "Filter"}
            leftIcon={<Tune />}
            onClick={() => {
              filterDispatch(toggleFilter());
            }}
            disable={loading || loadingList || CSVloading}
          />
        </div>
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
      </Filter>

      <div className="dash-container">

        {filterChipUI()}

        {(loading ?
          <TrackDashboardSkeleton /> :
          (id === tripsStatusEnum.INTRANSIT) &&
          <div className="track-card-wrap running-trip-wrap">
            <div className="row">

              <div className="col-md-6 col-lg-4" onClick={() => {
                setStatus(runningTripsStatusEnum.TRANSIT)
                filterDispatch(setCurrentPage(1));
              }}>
                <ReportCard
                  CardStyle={(((status === runningTripsStatusEnum.TRANSIT) ? "running-trip running-active" : "running-trip "))}
                  heading="On Schedule"
                  value={(runningCount.OnSchedule && convertToNumberFormat(runningCount.OnSchedule, numberFormatter)) || 0}
                  image="/images/onSchedule.png"
                />
              </div>

              <div className="col-md-6 col-lg-4" onClick={() => {
                setStatus(runningTripsStatusEnum.DELAYED);
                filterDispatch(setCurrentPage(1));
              }}>
                <ReportCard
                  CardStyle={(((status === runningTripsStatusEnum.DELAYED) ? "delay-trip delay-active" : "delay-trip"))}
                  heading="Delayed"
                  value={(runningCount.Delayed && convertToNumberFormat(runningCount.Delayed, numberFormatter)) || 0}
                  image="/images/delayed.png"

                />
              </div>

              <div className="col-md-6 col-lg-4" onClick={() => {
                setStatus(runningTripsStatusEnum.UNKNOWN);
                filterDispatch(setCurrentPage(1));
              }}>
                <ReportCard
                  CardStyle={(((status === runningTripsStatusEnum.UNKNOWN) ? "scheduled-trip active" : "scheduled-trip"))}
                  heading="Non Trackable"
                  value={(runningCount.Unknown && convertToNumberFormat(runningCount.Unknown, numberFormatter)) || 0}
                  image="/images/non-trackable.png"
                />
              </div>
            </div>
          </div>
        )}
        {isMobile ?
          (
            <PageContainer
              loading={loadingList}
              listData={wrapperState.listData}
            >
              <CardList
                listData={wrapperState.listData}
                tableColumns={dashboardTableColumns(id, status)}
                isNextPage={wrapperState.pagination && wrapperState.pagination.next}
                onReachEnd={() => {
                  filterDispatch(setCurrentPage(wrapperState.pagination.next));
                }}
              />
            </PageContainer>
          ) :
          <PageContainer loading={loadingList}>
            <div className={(id === tripsStatusEnum.INTRANSIT) ? "img-notfond" : ""}>
              <TableList
                tableColumns={dashboardTableColumns(id, status)}
                currentPage={wrapperState.currentPage}
                rowsPerPage={wrapperState.pageSize}
                rowsPerPageOptions={rowsPerPageOptions}
                totalCount={wrapperState.pagination && wrapperState.pagination.count}
                listData={wrapperState.listData}
                onChangePage={(event: any, page: number) => {
                  filterDispatch(setCurrentPage(page));
                }}
                onChangeRowsPerPage={(event: any) => {
                  filterDispatch(setRowPerPage(event.target.value))
                }}
              />
            </div>
          </PageContainer>
        }
      </div>

    </div>
  );

  function getPageTitle() {
    if (id === tripsStatusEnum.INIT) {
      return "Scheduled Trips"
    } else if (id === tripsStatusEnum.INTRANSIT) {
      return "Running Trips"
    } else if (id === tripsStatusEnum.COMPLETED) {
      return "Completed Trips"
    } else {
      return "Trips"
    }
  }
}
export default TrackingListing;

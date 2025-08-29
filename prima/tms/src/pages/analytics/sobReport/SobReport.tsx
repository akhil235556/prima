import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { FilterList, GetApp, Visibility } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BackgroundColorArray, rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { advancedFilterTitle, downloadCsvTitle } from '../../../base/constant/MessageUtils';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { getSearchDateFilter } from '../../../base/utility/Routerutils';
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from "../../../component/chips/Chips";
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from "../../../component/widgets/button/Button";
import CardList from '../../../component/widgets/cardlist/CardList';
import ListingSkeleton from "../../../component/widgets/listingSkeleton/ListingSkeleton";
import TableCollapseList from "../../../component/widgets/tableView/tableCollapseList/TableCollapseList";
import TableList from "../../../component/widgets/tableView/TableList";
import { getAnanlyticObject } from "../../../moduleUtility/DispatchUtility";
import { sobReportFilters } from '../../../moduleUtility/FilterUtils';
import { showAlert } from '../../../redux/actions/AppActions';
import {
  refreshList, setCurrentPage, setResponse, setRowPerPage, setSelectedElement, toggleFilter,
  toggleModal
} from '../../../redux/actions/SobReportActions';
import SobReportReducer, { SOB_STATE } from '../../../redux/reducers/SobReportReducer';
import * as IndentDashboardServiceAction from '../../../serviceActions/IndentDashboardServiceAction';
import { getCountList, getCsvLink, getSobList, getSobReport } from '../../../serviceActions/SobReportServiceActions';
import { freightContributionTableColumns, sobReportChildrenTableColumns, sobReportTableColumns, vehicleContributionTableColumns, volumeWeightContributionTableColumns } from "../../../templates/AnalyticsTemplates";
import PieChart from '../../charts/PieChart';
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import SearchFilterBar from '../searchFilterBar/SearchFilterBar';
import ShareOfBusinessModal from "./ShareOfBusinessModal";
import './SobReport.css';
import SobReportFilters from "./SobReportFilters";
import SobSkeleton from './sobSkeleton/SobSkeleton';
import SobViewModal from './SobViewModal';


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}


function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function SobReport() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(sobReportFilters);
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [countLoading, setCountLoading] = React.useState(false);
  const [viewClick, setViewClick] = React.useState(false);
  const [count, setCount] = React.useState<any>({});
  const [CSVloading, setCSVLoading] = React.useState(false);
  const [laneCode, setLaneCode] = React.useState<any>(null)
  const [showSob, setShowSob] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const [state = SOB_STATE, dispatch] = useReducer(SobReportReducer, SOB_STATE);

  useEffect(() => {
    const getList = async () => {
      let queryParams: any = {}
      queryParams = Object.assign(queryParams);
      queryParams.page = state.currentPage;
      queryParams.size = state.pageSize;
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      setLoading(true);
      appDispatch(getSobList(queryParams)).then((response: any) => {
        dispatch(setResponse(response));
        setLoading(false);
      })
    }
    const getSobReportData = async () => {
      setLoading(true);

      let queryParams: any = {}
      queryParams = Object.assign(queryParams);
      queryParams.page = state.currentPage;
      queryParams.size = state.pageSize;
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      setLoading(true);
      appDispatch(getSobReport(queryParams)).then((response: any) => {
        dispatch(setResponse(response));
        setLoading(false);
      })

    }
    value === 0 ? getSobReportData() : getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value === 0, state.refresh_list, state.currentPage, state.pageSize, history.location.search]);

  useEffect(() => {
    const getCountListing = async () => {
      let queryParams: any = {}
      queryParams = Object.assign(queryParams);
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params);
      }
      setCountLoading(true);
      appDispatch(getCountList(queryParams)).then((response: any) => {
        if (response && response.details) {
          setCount(response.details)
        } else {
          setCount({})
        }
        setCountLoading(false);
      })
    }

    value !== 0 && getCountListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value === 0, state.refresh_list, history.location.search]);


  return (
    <div className="sob-report-wrapper analytics-report">

      <SobReportFilters
        open={state.openFilter}
        filerChips={filterState.chips}
        filerParams={filterState.params}
        onApplyFilter={(filterChips: any, filterParams: any) => {
          dispatch(refreshList())
          let dateFilter = getSearchDateFilter(filterState.params);
          addFiltersQueryParams(filterChips, { ...filterParams, ...dateFilter })
          //dispatch(setFilter(filterChips, filterParams));
          dispatch(toggleFilter());
        }}
        onClose={() => {
          dispatch(toggleFilter());
        }}
      />

      <SobViewModal
        open={viewClick}
        selectedElement={makeMobData(value)}
        onClose={() => {
          setViewClick(false)
        }} />
      <ShareOfBusinessModal
        open={showSob}
        laneCode={laneCode}
        onClose={() =>
          setShowSob(false)
        }
      />

      <LanePointsDisplayModal
        open={state.openModal}
        laneCode={state.selectedItem && state.selectedItem.laneCode}
        onClose={() => {
          dispatch(setSelectedElement(undefined));
          dispatch(toggleModal());
        }} />
      <Filter
        pageTitle="SOB Report"
      >
        {!isMobile && <SearchFilterBar
          filterParams={filterState.params}
          onApply={(dates: any) => {
            dispatch(refreshList())
            addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
            // dispatch(setFilter({}, dates));
          }}
        />
        }
        <FileAction
          options={[
            {
              menuTitle: advancedFilterTitle,
              Icon: FilterList,
              onClick: () => dispatch(toggleFilter())
            },
            {
              menuTitle: downloadCsvTitle,
              Icon: GetApp,
              onClick: () => {
                let queryParams: any = {}
                queryParams = Object.assign(queryParams);
                if (!isObjectEmpty(filterState.params)) {
                  queryParams = Object.assign(queryParams, filterState.params)
                }
                setCSVLoading(true);
                if (value === 0) {
                  appDispatch(IndentDashboardServiceAction.getCsvLink({})).then((response: any) => {
                    setCSVLoading(false);
                    response && response.link && window.open(response.link);
                  })
                } else {
                  appDispatch(getCsvLink(queryParams)).then((response: any) => {
                    setCSVLoading(false);
                    if (response?.code === 201) {
                      appDispatch(showAlert(response?.message));
                    }
                  })
                }
              }
            },
          ]}
        />
      </Filter>

      <div className="sob-tabs-wrap">
        <div >
          {isMobile &&
            <div className="mt-10"> <SearchFilterBar
              filterParams={filterState.params}
              onApply={(dates: any) => {
                dispatch(refreshList())
                addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
                //addFiltersQueryParams({}, dates)
                // dispatch(setFilter({}, dates));
              }}
            />
            </div>
          }
        </div>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="SOB Report" {...a11yProps(0)} />
          <Tab label="Freight Order Contribution" {...a11yProps(1)} />
          <Tab label="Volume and Weight Contribution" {...a11yProps(2)} />
          <Tab label="Vehicle Contribution" {...a11yProps(3)} />

        </Tabs>
        <TabPanel value={value} index={0}>
          <PageContainer>
            {!isObjectEmpty(getAnanlyticObject(filterState.chips)) && Object.keys(getAnanlyticObject(filterState.chips)).map((element) => (
              <Chips
                label={getAnanlyticObject(filterState.chips)[element]}
                onDelete={() => {
                  dispatch(refreshList())
                  removeFiltersQueryParams([element])
                  // dispatch(removeFilter(element));
                }}
              />
            ))}
            {loading ? <ListingSkeleton /> :
              <div className='sob-report-list'>
                <TableCollapseList
                  tableColumns={sobReportTableColumns()}
                  currentPage={state.currentPage}
                  rowsPerPage={state.pageSize}
                  rowsPerPageOptions={rowsPerPageOptions}
                  totalCount={state.pagination && state.pagination.count}
                  listData={state.listData}
                  onChangePage={(event: any, page: number) => {
                    dispatch(setCurrentPage(page));
                  }}
                  onChangeRowsPerPage={(event: any) => {
                    dispatch(setRowPerPage(event.target.value));
                  }}
                  childElementKey='lanes'
                  childrenColumns={sobReportChildrenTableColumns(onClickLane)}
                />
              </div>}
          </PageContainer>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PageContainer
          >

            {!isObjectEmpty(getAnanlyticObject(filterState.chips)) && Object.keys(getAnanlyticObject(filterState.chips)).map((element) => (
              <Chips
                label={getAnanlyticObject(filterState.chips)[element]}
                onDelete={() => {
                  dispatch(refreshList())
                  removeFiltersQueryParams([element])
                  // dispatch(removeFilter(element));
                }}
              />
            ))}
            {countLoading ? <SobSkeleton /> :
              (!isObjectEmpty(count) && count.hasOwnProperty('results')) &&
              <div className="sob-report-graph d-flex align-items-center">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-6 text-center">
                      <PieChart
                        data={{
                          labels: getLabels(),
                          datasets: [{
                            data: getData("order"),
                            backgroundColor: getBackgroundColorList()
                          }]
                        }}
                        options={{
                          maintainAspectRatio: false,
                          legend: {
                            position: "right",
                            display: false
                          }
                        }}
                        height={300}
                      />
                    </div>

                    {
                      isMobile ? "" :
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-6 sob-list">
                              <ul>
                                {count && count.results && count.results.map((element: any, index: any) => {
                                  let colorIndex = index % BackgroundColorArray.length;
                                  let colorDisplay = BackgroundColorArray[colorIndex]
                                  return (
                                    <li><span style={{ background: colorDisplay }}></span> {element.partnerName}</li>
                                  )
                                })}
                              </ul>
                            </div>
                          </div>
                        </div>
                    }

                  </div>
                </div>
              </div>}

            {
              isMobile ?
                <div className="transporter-list-row">
                  <div className="row align-items-center">
                    <div className="col">
                      <span>Transporters</span>
                    </div>
                    <div className="col-auto pr-0">
                      <Button
                        loading={loading || countLoading || CSVloading}
                        buttonStyle="btn-orange"
                        title="View"
                        leftIcon={<Visibility />}
                        onClick={() => {
                          setViewClick(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
                : " "
            }

            {loading ? <ListingSkeleton /> :
              isMobile ?
                <CardList
                  listData={state.listData}
                  tableColumns={freightContributionTableColumns(onClickLaneCode)}
                  isNextPage={state.pagination && state.pagination.next}
                  onReachEnd={() => {
                    dispatch(setCurrentPage(state.pagination.next))
                  }}
                /> :
                <TableList
                  tableColumns={freightContributionTableColumns(onClickLaneCode)}
                  currentPage={state.currentPage}
                  rowsPerPage={state.pageSize}
                  rowsPerPageOptions={rowsPerPageOptions}
                  totalCount={state.pagination && state.pagination.count}
                  listData={state.listData}
                  onChangePage={(event: any, page: number) => {
                    dispatch(setCurrentPage(page));
                  }}
                  onChangeRowsPerPage={(event: any) => {
                    dispatch(setRowPerPage(event.target.value));
                  }}
                />
            }
          </PageContainer>
        </TabPanel>


        <TabPanel value={value} index={2}>
          <PageContainer
          >
            {!isObjectEmpty(getAnanlyticObject(filterState.chips)) && Object.keys(getAnanlyticObject(filterState.chips)).map((element) => (
              <Chips
                label={getAnanlyticObject(filterState.chips)[element]}
                onDelete={() => {
                  removeFiltersQueryParams([element])
                  // dispatch(removeFilter(element));
                }}
              />
            ))}
            {countLoading ? <SobSkeleton /> :
              (!isObjectEmpty(count) && count.hasOwnProperty('results')) &&
              <div className="sob-report-graph d-flex align-items-center">
                <div className="container-fluid">

                  <div className="row">
                    <div className="col-md-6 text-center">
                      {(count.results[0] && count.results[0].totalVolumeWeight) ?
                        <PieChart
                          data={{
                            labels: getLabels(),
                            datasets: [{
                              data: getData("vol/wt"),
                              backgroundColor: getBackgroundColorList()
                            }]
                          }}
                          options={{
                            maintainAspectRatio: false,
                            legend: {
                              position: "right",
                              display: false
                            }
                          }}
                          height={300}
                        /> :
                        <div className="graph-not-found text-center">
                          <img src="/images/graph-not-found.png" className="img-fluid" alt="graph-not-found" />
                          <p>No data to display !</p>
                        </div>
                      }
                    </div>
                    {
                      isMobile ? "" :
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-6 sob-list">
                              <ul>
                                {count && count.results && count.results.map((element: any, index: any) => {
                                  let colorIndex = index % BackgroundColorArray.length;
                                  let colorDisplay = BackgroundColorArray[colorIndex]
                                  return (
                                    <li><span style={{ background: colorDisplay }}></span> {element.partnerName}</li>
                                  )
                                })}
                              </ul>
                            </div>
                          </div>
                        </div>
                    }
                  </div>
                </div>
              </div>}

            {
              isMobile ?
                <div className="transporter-list-row">
                  <div className="row align-items-center">
                    <div className="col">
                      <span>Transporters</span>
                    </div>
                    <div className="col-auto pr-0">
                      <Button
                        loading={loading || countLoading || CSVloading}
                        buttonStyle="btn-orange"
                        title="View"
                        leftIcon={<Visibility />}
                        onClick={() => {
                          setViewClick(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
                : " "
            }

            {loading ? <ListingSkeleton /> :
              isMobile ?
                <CardList
                  listData={state.listData}
                  tableColumns={volumeWeightContributionTableColumns(onClickLaneCode)}
                  isNextPage={state.pagination && state.pagination.next}
                  onReachEnd={() => {
                    dispatch(setCurrentPage(state.pagination.next))
                  }}
                /> :
                <TableList
                  tableColumns={volumeWeightContributionTableColumns(onClickLaneCode)}
                  currentPage={state.currentPage}
                  rowsPerPage={state.pageSize}
                  rowsPerPageOptions={rowsPerPageOptions}
                  totalCount={state.pagination && state.pagination.count}
                  listData={state.listData}
                  onChangePage={(event: any, page: number) => {
                    dispatch(setCurrentPage(page));
                  }}
                  onChangeRowsPerPage={(event: any) => {
                    dispatch(setRowPerPage(event.target.value));
                  }}
                />
            }
          </PageContainer>

        </TabPanel>
        <TabPanel value={value} index={3}>
          <PageContainer
          >
            {!isObjectEmpty(getAnanlyticObject(filterState.chips)) && Object.keys(getAnanlyticObject(filterState.chips)).map((element) => (
              <Chips
                label={getAnanlyticObject(filterState.chips)[element]}
                onDelete={() => {
                  removeFiltersQueryParams([element])
                  // dispatch(removeFilter(element));
                }}
              />
            ))}
            {countLoading ? <SobSkeleton /> :
              (!isObjectEmpty(count) && count.hasOwnProperty('results')) &&
              <div className="sob-report-graph d-flex align-items-center">
                <div className="container-fluid">

                  <div className="row">
                    <div className="col-md-6 text-center">
                      <PieChart
                        data={{
                          labels: getLabels(),
                          datasets: [{
                            data: getData("vehicle"),
                            backgroundColor: getBackgroundColorList()
                          }]
                        }}
                        options={{
                          maintainAspectRatio: false,
                          legend: {
                            position: "right",
                            display: false
                          }
                        }}
                        height={300}
                      />
                    </div>

                    {
                      isMobile ? "" :
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-6 sob-list">
                              <ul>
                                {count && count.results && count.results.map((element: any, index: any) => {
                                  let colorIndex = index % BackgroundColorArray.length
                                  let colorDisplay = BackgroundColorArray[colorIndex]
                                  return (
                                    <li><span style={{ background: colorDisplay }}></span> {element.partnerName}</li>
                                  )
                                })}
                              </ul>
                            </div>
                          </div>
                        </div>
                    }

                  </div>
                </div>
              </div>
            }
            {
              isMobile ?
                <div className="transporter-list-row">
                  <div className="row align-items-center">
                    <div className="col">
                      <span>Transporters</span>
                    </div>
                    <div className="col-auto pr-0">
                      <Button
                        loading={loading || countLoading || CSVloading}
                        buttonStyle="btn-orange"
                        title="View"
                        leftIcon={<Visibility />}
                        onClick={() => {
                          setViewClick(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
                : " "
            }

            {loading ? <ListingSkeleton /> :
              isMobile ?
                <CardList
                  listData={state.listData}
                  tableColumns={vehicleContributionTableColumns(onClickLaneCode)}
                  isNextPage={state.pagination && state.pagination.next}
                  onReachEnd={() => {
                    dispatch(setCurrentPage(state.pagination.next))
                  }}
                />
                :
                <TableList
                  tableColumns={vehicleContributionTableColumns(onClickLaneCode)}
                  currentPage={state.currentPage}
                  rowsPerPage={state.pageSize}
                  rowsPerPageOptions={rowsPerPageOptions}
                  totalCount={state.pagination && state.pagination.count}
                  listData={state.listData}
                  onChangePage={(event: any, page: number) => {
                    dispatch(setCurrentPage(page));
                  }}
                  onChangeRowsPerPage={(event: any) => {
                    dispatch(setRowPerPage(event.target.value));
                  }}
                />
            }
          </PageContainer>


        </TabPanel>
      </div>


    </div>
  );

  function onClickLaneCode(element: any) {
    dispatch(toggleModal());
    dispatch(setSelectedElement(element))
  }
  function onClickLane(element: any) {
    setLaneCode(element.laneCode)
    setShowSob(true)
  }

  function getLabels() {
    let labels: any = count && count.results && count.results.map((element: any) => {
      return element.partnerName;
    })
    return labels;
  }

  function getData(key: any) {
    let data: any = []
    switch (key) {
      case "order":
        data = count && count.results && count.results.map((element: any) => {
          return (element.ordersPercent || 0);
        })
        break;
      case "vol/wt":
        data = count && count.results && count.results.map((element: any) => {
          return (element.volumeWeightPercent || 0);
        })
        break;
      case "vehicle":
        data = count && count.results && count.results.map((element: any) => {
          return (element.vehiclesPercent || 0);
        })
        break;
    }
    return data || [];
  }

  function makeMobData(key: any) {
    let data: any = []
    switch (key) {
      case 0:
        count && count.results && count.results.forEach((element: any, index: any) => {
          let dataObjective: any = {}
          let colorIndex = index % BackgroundColorArray.length
          let colorDisplay = BackgroundColorArray[colorIndex]
          dataObjective.partnerName = element.partnerName;
          dataObjective.value = element.ordersPercent && element.ordersPercent.toFixed(2);
          dataObjective.color = colorDisplay
          data.push(dataObjective)
        })
        break;
      case 1:
        count && count.results && count.results.forEach((element: any, index: any) => {
          let dataObjective: any = {}
          let colorIndex = index % BackgroundColorArray.length
          let colorDisplay = BackgroundColorArray[colorIndex]
          dataObjective.partnerName = element.partnerName;
          dataObjective.value = element.volumeWeightPercent && element.volumeWeightPercent.toFixed(2);
          dataObjective.color = colorDisplay
          data.push(dataObjective)
        })
        break;
      case 2:
        count && count.results && count.results.forEach((element: any, index: any) => {
          let dataObjective: any = {}
          let colorIndex = index % BackgroundColorArray.length
          let colorDisplay = BackgroundColorArray[colorIndex]
          dataObjective.partnerName = element.partnerName;
          dataObjective.value = element.vehiclesPercent && element.vehiclesPercent.toFixed(2)
          dataObjective.color = colorDisplay
          data.push(dataObjective)
        })
        break;

    }
    return data;
  }

  function getBackgroundColorList() {
    let colorsArray: any = [];
    count && count.results && count.results.forEach((element: any, index: any) => {
      let colorIndex = index % BackgroundColorArray.length
      let colorDisplay = BackgroundColorArray[colorIndex]
      colorsArray.push(colorDisplay)
    })
    return colorsArray;
  }

}
export default SobReport;
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { FilterList, GetApp } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getDeRCsvLinkUrl, getDeRShipmentCsvLinkUrl } from "../../../base/api/ServiceUrl";
import { rowsPerPageOptions } from "../../../base/constant/ArrayList";
import { advancedFilterTitle, downloadCsvTitle } from '../../../base/constant/MessageUtils';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { getSearchDateFilter } from '../../../base/utility/Routerutils';
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from "../../../component/chips/Chips";
import FileAction from '../../../component/fileAction/FileAction';
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import CardList from '../../../component/widgets/cardlist/CardList';
import ListingSkeleton from "../../../component/widgets/listingSkeleton/ListingSkeleton";
import TableList from "../../../component/widgets/tableView/TableList";
import { getAnanlyticObject } from "../../../moduleUtility/DispatchUtility";
import { deliveryReportFilters } from "../../../moduleUtility/FilterUtils";
import { showAlert } from '../../../redux/actions/AppActions';
import { refreshList, setCurrentPage, setResponse, setRowPerPage, toggleFilter } from '../../../redux/actions/DeliveryReportActions';
import DeliveryReportReducer, { DELIVERY_REPORT_STATE } from '../../../redux/reducers/DeliveryReportReducer';
import { getCsvLink, getDeliveryCount, getDeliveryReportList, getShipmentReportList } from '../../../serviceActions/DeliveryReportServiceActions';
import { deliveryReportTableColumns, shipmentReportTableColumns } from "../../../templates/AnalyticsTemplates";
import PieChart from '../../charts/PieChart';
import AnalyticsSkeleton from '../analyticsSkeleton/AnalyticsSkeleton';
import SearchFilterBar from '../searchFilterBar/SearchFilterBar';
import './DeliveryReport.css';
import DeliveryReportFilters from "./DeliveryReportFilters";

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

function DeliveryReport() {
    const history = useHistory();
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(deliveryReportFilters);
    const appDispatch = useDispatch();
    const [state = DELIVERY_REPORT_STATE, dispatch] = useReducer(DeliveryReportReducer, DELIVERY_REPORT_STATE);
    const [loading, setLoading] = React.useState(false);
    const [countLoading, setCountLoading] = React.useState(false);
    const [count, setCount] = React.useState<any>({});
    const [CSVloading, setCSVLoading] = React.useState(false);
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        if (!loading && !countLoading && !CSVloading) {
            setSelectedTab(newValue);
            dispatch(refreshList());
            dispatch(setCurrentPage(1));
            dispatch(setRowPerPage(rowsPerPageOptions[0]));
        }
    };


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

            appDispatch(selectedTab === 0 ? getShipmentReportList(queryParams) : getDeliveryReportList(queryParams)).then((response: any) => {
                dispatch(setResponse(response));
                setLoading(false);
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refresh_list, state.currentPage, state.pageSize, history.location.search, selectedTab]);

    useEffect(() => {
        const getCountListing = async () => {
            let queryParams: any = {}
            queryParams = Object.assign(queryParams);
            if (!isObjectEmpty(filterState.params)) {
                queryParams = Object.assign(queryParams, filterState.params);
            }
            setCountLoading(true);
            appDispatch(getDeliveryCount(queryParams)).then((response: any) => {
                if (response && response.details) {
                    setCount(response.details)
                } else {
                    setCount({})
                }
                setCountLoading(false);
            })
        }
        getCountListing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.refresh_list, history.location.search]);


    return (

        <div className={isObjectEmpty(count) ? "detention-report analytics-report analytics-report-wrapp" : "detention-report analytics-report delivery-report-wrap"}>
            <DeliveryReportFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    //dispatch(setFilter(filterChips, filterParams));
                    dispatch(refreshList())
                    let dateFilter = getSearchDateFilter(filterState.params);
                    addFiltersQueryParams(filterChips, { ...filterParams, ...dateFilter })
                    dispatch(toggleFilter());
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <Filter
                pageTitle="Delivery Report"
            >
                {!isMobile && <SearchFilterBar
                    filterParams={filterState.params}
                    onApply={(dates: any) => {
                        dispatch(refreshList())
                        addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
                        //dispatch(setFilter({}, dates));
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
                                appDispatch(getCsvLink(queryParams, selectedTab === 0 ? getDeRShipmentCsvLinkUrl : getDeRCsvLinkUrl)).then((response: any) => {
                                    setCSVLoading(false);
                                    if (response?.code === 201) {
                                        appDispatch(showAlert(response?.message));
                                    }
                                })
                            }
                        },
                    ]}
                />
            </Filter>

            <div className="sob-tabs-wrap">
                <div className="search-filter-mob">
                    {isMobile && <SearchFilterBar
                        filterParams={filterState.params}
                        onApply={(dates: any) => {
                            dispatch(refreshList())
                            addFiltersQueryParams(filterState.chips, { ...filterState.params, ...dates })
                            //dispatch(setFilter({}, dates));
                        }}
                    />
                    }
                </div>

                <Tabs value={selectedTab} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Shipment Report" {...a11yProps(0)} />
                    <Tab label="Partner Report" {...a11yProps(1)} />
                </Tabs>

                <TabPanel value={selectedTab} index={0}>
                    <PageContainer
                    >

                        {!isObjectEmpty(getAnanlyticObject(filterState.chips)) && Object.keys(getAnanlyticObject(filterState.chips)).map((element) => (
                            <Chips
                                label={getAnanlyticObject(filterState.chips)[element]}
                                onDelete={() => {
                                    removeFiltersQueryParams([element])
                                    //dispatch(removeFilter(element));
                                }}
                            />
                        ))}

                        {countLoading ? <AnalyticsSkeleton /> :
                            !isObjectEmpty(count) &&
                            <div className="row analytics-row">
                                <div className="col-md-12 col-lg-8">
                                    <div className="row">
                                        <div className="col-md-3 col-6  analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="total-text">{(count && count.total) || 0}</h4>
                                                <p>Total</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6  analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="blue-text">{(count && count.pickup) || 0}</h4>
                                                <p>Picked Up</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6  analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="orange-text">{(count && count.transit) || 0}</h4>
                                                <p>In Transit</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6  analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="gray_text">{(count && count.yetToPicked) || 0}</h4>
                                                <p>Yet To Pick</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6  analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="yellow-text">{(count && count.outForDelivery) || 0}</h4>
                                                <p>Out For Delivery</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6  analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="green-text">{(count && count.delivered) || 0}</h4>
                                                <p>Delivered</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6  analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="red-text">{(count && count.undelivered) || 0}</h4>
                                                <p>Undelivered</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6  analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="returned-text">{(count && count.returned) || 0}</h4>
                                                <p>Returned</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 col-lg-4 text-center analytics-graph-card">
                                    <div className="analytics-graph">
                                        <PieChart
                                            data={{
                                                labels: ["Picked Up", "In Transit", "Yet To Pick", "Out For Delivery", "Delivered", "Undelivered", "Returned"],
                                                datasets: [{
                                                    data: [(count.pickupPercent || 0), (count.transitPercent || 0), (count.yetToPickedPercent || 0), (count.outForDeliveryPercent || 0), (count.deliveredPercent || 0), (count.undeliveredPercent || 0), (count.returnedPercent || 0)],
                                                    backgroundColor: ["blue", "#f7931e", "#083654", "#FFAE42", "#1FC900", "red", "#890000"]
                                                }]
                                            }}
                                            options={{
                                                maintainAspectRatio: false,
                                                legend: {
                                                    labels: {
                                                        boxWidth: 12
                                                    }
                                                },
                                            }}
                                            height={200}
                                        />
                                    </div>
                                </div>
                            </div>}

                        {loading ? <ListingSkeleton /> :
                            (isMobile ?
                                <CardList
                                    listData={state.listData}
                                    tableColumns={selectedTab === 0 ? shipmentReportTableColumns() : deliveryReportTableColumns()}
                                    isNextPage={state.pagination && state.pagination.next}
                                    onReachEnd={() => {
                                        dispatch(setCurrentPage(state.pagination.next))
                                    }}
                                />
                                :
                                <TableList
                                    tableColumns={shipmentReportTableColumns()}
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
                                />)
                        }
                    </PageContainer>
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                    <PageContainer
                    >


                        {!isObjectEmpty(getAnanlyticObject(filterState.chips)) && Object.keys(getAnanlyticObject(filterState.chips)).map((element) => (
                            <Chips
                                label={getAnanlyticObject(filterState.chips)[element]}
                                onDelete={() => {
                                    removeFiltersQueryParams([element])
                                    //dispatch(removeFilter([element]));
                                }}
                            />
                        ))}

                        {countLoading ? <AnalyticsSkeleton /> :
                            !isObjectEmpty(count) &&
                            <div className="row analytics-row">
                                <div className="col-md-12 col-lg-8">
                                    <div className="row">
                                        <div className="col-md-3 col-6 analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="total-text">{(count && count.total) || 0}</h4>
                                                <p>Total</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="blue-text">{(count && count.pickup) || 0}</h4>
                                                <p>Picked Up</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="orange-text">{(count && count.transit) || 0}</h4>
                                                <p>In Transit</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="gray_text">{(count && count.yetToPicked) || 0}</h4>
                                                <p>Yet To Pick</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="yellow-text">{(count && count.outForDelivery) || 0}</h4>
                                                <p>Out For Delivery</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="green-text">{(count && count.delivered) || 0}</h4>
                                                <p>Delivered</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="red-text">{(count && count.undelivered) || 0}</h4>
                                                <p>Undelivered</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-6 analytics-card">
                                            <div className="delivery-data">
                                                <h4 className="returned-text">{(count && count.returned) || 0}</h4>
                                                <p>Returned</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 col-lg-4 text-center analytics-graph-card">
                                    <div className="analytics-graph">
                                        <PieChart
                                            data={{
                                                labels: ["Picked Up", "In Transit", "Yet To Pick", "Out For Delivery", "Delivered", "Undelivered", "Returned"],
                                                datasets: [{
                                                    data: [(count.pickupPercent || 0), (count.transitPercent || 0), (count.yetToPickedPercent || 0), (count.outForDeliveryPercent || 0), (count.deliveredPercent || 0), (count.undeliveredPercent || 0), (count.returnedPercent || 0)],
                                                    backgroundColor: ["blue", "#f7931e", "#083654", "#FFAE42", "#1FC900", "red", "#890000"]
                                                }]
                                            }}
                                            options={{
                                                maintainAspectRatio: false,
                                                legend: {
                                                    labels: {
                                                        boxWidth: 12
                                                    }
                                                },
                                            }}
                                            height={200}
                                        />
                                    </div>
                                </div>
                            </div>}

                        {loading ? <ListingSkeleton /> :
                            (isMobile ?
                                <CardList
                                    listData={state.listData}
                                    tableColumns={deliveryReportTableColumns()}
                                    isNextPage={state.pagination && state.pagination.next}
                                    onReachEnd={() => {
                                        dispatch(setCurrentPage(state.pagination.next))
                                    }}
                                />
                                :
                                <TableList
                                    tableColumns={deliveryReportTableColumns()}
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
                                />)
                        }
                    </PageContainer>
                </TabPanel>
            </div>
        </div>
    );

}
export default DeliveryReport;

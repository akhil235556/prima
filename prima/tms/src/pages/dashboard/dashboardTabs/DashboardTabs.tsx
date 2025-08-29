import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import { rowsPerPageOptions } from '../../../base/constant/ArrayList';
import { DispatchUrl, InboundUrl, TrackingUrl } from '../../../base/constant/RoutePath';
import { useHistoryHooks } from '../../../base/hooks/useHistoryHooks';
import DataNotFound from '../../../component/error/DataNotFound';
import ListingSkeleton from '../../../component/widgets/listingSkeleton/ListingSkeleton';
import TableList from '../../../component/widgets/tableView/TableList';
import { dashboardDelayedTableColumns, dashboardDispatchTableColumns, dashboardOnScheduleTableColumns, dashboardPageTableColumns } from '../../../templates/DashboardTemplates';
import './DashboardTabs.css';

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

interface DashboardTabsProps {
    inboundList: any,
    dispatchList: any,
    onScheduleList: any,
    delayedList: any,
    dispatchTab: number,
    trackingTab: number,
    onChangeDispatchTab: Function,
    onChangeTrackingTab: Function,
    inboundLoading: boolean,
    dispatchLoading: boolean,
    scheduleLoading: boolean,
    delayedLoading: boolean,
    showLanePoints: any
}
function DashboardTabs(props: DashboardTabsProps) {
    const { inboundList, dispatchList, dispatchTab, trackingTab, onScheduleList, delayedList, inboundLoading, dispatchLoading,
        onChangeDispatchTab, onChangeTrackingTab, scheduleLoading, delayedLoading, showLanePoints } = props;

    const loadPage = useHistoryHooks();
    return (
        <section className="dashbaord-panel">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 col-lg-6">

                        <div className="dashboard-tabs-wrap">
                            <Tabs value={dispatchTab} onChange={(event: React.ChangeEvent<{}>, newValue: number) => { onChangeDispatchTab(newValue) }} aria-label="simple tabs example">
                                <Tab label="Inbound" {...a11yProps(0)} />
                                <Tab label="Dispatch" {...a11yProps(1)} />
                            </Tabs>
                            <TabPanel value={dispatchTab} index={0}>
                                {inboundLoading ? <ListingSkeleton /> :
                                    <TableList
                                        tableColumns={dashboardPageTableColumns(() => loadPage(InboundUrl), (element: any) => showLanePoints(element))}
                                        currentPage={0}
                                        rowsPerPage={25}
                                        rowsPerPageOptions={rowsPerPageOptions}
                                        listData={inboundList}
                                        onChangePage={(event: any, page: number) => {
                                        }}
                                        onChangeRowsPerPage={(event: any) => {

                                        }}
                                        noDataView={<DataNotFound
                                            header="No placement pending orders found"
                                            // customMessage={<p>We are sorry what you are looking for. <br /> Please try another way.</p>}
                                            message={""}
                                            image="/images/notfound-packege.png"
                                        />}
                                    />
                                }
                            </TabPanel>
                            <TabPanel value={dispatchTab} index={1}>
                                {dispatchLoading ? <ListingSkeleton /> :
                                    <TableList
                                        tableColumns={dashboardDispatchTableColumns(() => loadPage(DispatchUrl), (element: any) => showLanePoints(element))}
                                        currentPage={0}
                                        rowsPerPage={25}
                                        rowsPerPageOptions={rowsPerPageOptions}
                                        listData={dispatchList}
                                        onChangePage={(event: any, page: number) => {
                                        }}
                                        onChangeRowsPerPage={(event: any) => {

                                        }}
                                        noDataView={<DataNotFound
                                            header="No dispatch pending orders found"
                                            // customMessage={<p>We are sorry what you are looking for. <br /> Please try another way.</p>}
                                            message={""}
                                            image="/images/notfound-packege.png"
                                        />}
                                    />
                                }
                            </TabPanel>
                        </div>
                    </div>

                    <div className="col-md-12 col-lg-6">

                        <div className="dashboard-tabs-wrap">
                            <Tabs value={trackingTab} onChange={(event: React.ChangeEvent<{}>, newValue: number) => { onChangeTrackingTab(newValue) }} aria-label="simple tabs example">
                                <Tab label="On Schedule" {...a11yProps(0)} />
                                <Tab label="Delayed" {...a11yProps(1)} />
                            </Tabs>
                            <TabPanel value={trackingTab} index={0}>
                                {scheduleLoading ? <ListingSkeleton /> :

                                    <TableList
                                        tableColumns={dashboardOnScheduleTableColumns((element: any) => {
                                            let params = "vehicleNumber=" + encodeURIComponent(element.vehicleNumber) + "&vehicleCode=" + encodeURIComponent(element.vehicleCode);
                                            loadPage(TrackingUrl, params)
                                        }, (element: any) => showLanePoints(element))}
                                        currentPage={0}
                                        rowsPerPage={25}
                                        rowsPerPageOptions={rowsPerPageOptions}
                                        listData={onScheduleList}
                                        onChangePage={(event: any, page: number) => {
                                        }}
                                        onChangeRowsPerPage={(event: any) => {

                                        }}
                                        noDataView={<DataNotFound
                                            header="No on-schedule trips found"
                                            // customMessage={<p>We are sorry what you are looking for. <br /> Please try another way.</p>}
                                            message={""}
                                            image="/images/notfound-truck.png"
                                        />}
                                    />
                                }
                            </TabPanel>
                            <TabPanel value={trackingTab} index={1}>
                                {delayedLoading ? <ListingSkeleton /> :
                                    <TableList
                                        tableColumns={dashboardDelayedTableColumns((element: any) => {
                                            let params = "vehicleNumber=" + encodeURIComponent(element.vehicleNumber) + "&vehicleCode=" + encodeURIComponent(element.vehicleCode);
                                            loadPage(TrackingUrl, params)
                                        }, (element: any) => { showLanePoints(element) })}
                                        currentPage={0}
                                        rowsPerPage={25}
                                        rowsPerPageOptions={rowsPerPageOptions}
                                        listData={delayedList}
                                        onChangePage={(event: any, page: number) => {
                                        }}
                                        onChangeRowsPerPage={(event: any) => {

                                        }}
                                        noDataView={<DataNotFound
                                            header="No delayed trips found"
                                            // customMessage={<p>We are sorry what you are looking for. <br /> Please try another way.</p>}
                                            message={""}
                                            image="/images/notfound-truck.png"
                                        />}
                                    />
                                }
                            </TabPanel>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DashboardTabs;
import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import './DashboardMobileTabs.css';
import CardList from '../../../component/widgets/cardlist/CardList';
import { dashboardOnScheduleTableColumns, dashboardPageTableColumns, dashboardDispatchTableColumns, dashboardDelayedTableColumns } from '../../../templates/DashboardTemplates';
import { useHistory } from 'react-router-dom';
import { InboundUrl, DispatchUrl, TrackingUrl } from '../../../base/constant/RoutePath';
import ListingSkeleton from '../../../component/widgets/listingSkeleton/ListingSkeleton';
import DataNotFound from '../../../component/error/DataNotFound';
import { useHistoryHooks } from '../../../base/hooks/useHistoryHooks';
// import ListingSkeleton from '../../../component/widgets/listingSkeleton/ListingSkeleton';

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

interface DashboardMobileTabsProps {
    inboundList: any,
    dispatchList: any,
    onScheduleList: any,
    delayedList: any,
    mobileTab: number,
    onChangeMobileTab: Function,
    inboundLoading: boolean,
    dispatchLoading: boolean,
    scheduleLoading: boolean,
    delayedLoading: boolean,
    showLanePoints: any
}

function DashboardMobileTabs(props: DashboardMobileTabsProps) {
    const { inboundList, dispatchList, mobileTab, onScheduleList, delayedList, inboundLoading, dispatchLoading,
        onChangeMobileTab, scheduleLoading, delayedLoading, showLanePoints } = props;

    const history = useHistory();
    const loadPage = useHistoryHooks();
    return (
        <section className="dashbaord-panel">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">

                        <div className="dash-mob-tabs">
                            <Tabs value={mobileTab} onChange={(event: React.ChangeEvent<{}>, newValue: number) => { onChangeMobileTab(newValue) }} aria-label="simple tabs example">
                                <Tab label="Inbound" {...a11yProps(0)} />
                                <Tab label="Dispatch" {...a11yProps(1)} />
                                <Tab label="On Schedule" {...a11yProps(2)} />
                                <Tab label="Delayed" {...a11yProps(3)} />
                            </Tabs>
                            <TabPanel value={mobileTab} index={0}>
                                {inboundLoading ? <ListingSkeleton /> :
                                    <CardList
                                        listData={inboundList}
                                        tableColumns={dashboardPageTableColumns(() => history.push(InboundUrl), (element: any) => showLanePoints(element))}
                                        noDataView={<DataNotFound
                                            header="No placement pending orders found"
                                            // customMessage={<p>We are sorry what you are looking for. <br /> Please try another way.</p>}
                                            message={""}
                                            image="/images/notfound-packege.png"
                                        />}
                                    />
                                }
                            </TabPanel>
                            <TabPanel value={mobileTab} index={1}>
                                {dispatchLoading ? <ListingSkeleton /> :
                                    <CardList
                                        listData={dispatchList}
                                        tableColumns={dashboardDispatchTableColumns(() => history.push(DispatchUrl), (element: any) => showLanePoints(element))}
                                        noDataView={<DataNotFound
                                            header="No dispatch pending orders found"
                                            // customMessage={<p>We are sorry what you are looking for. <br /> Please try another way.</p>}
                                            message={""}
                                            image="/images/notfound-packege.png"
                                        />}
                                    />
                                }
                            </TabPanel>
                            <TabPanel value={mobileTab} index={2}>
                                {scheduleLoading ? <ListingSkeleton /> :
                                    <CardList
                                        listData={onScheduleList}
                                        tableColumns={dashboardOnScheduleTableColumns((element: any) => {
                                            let params = "vehicleNumber=" + encodeURIComponent(element.vehicleNumber) + "&vehicleCode=" + encodeURIComponent(element.vehicleCode);
                                            loadPage(TrackingUrl, params)
                                        }, (element: any) => showLanePoints(element))}
                                        noDataView={<DataNotFound
                                            header="No on-schedule trips found"
                                            // customMessage={<p>We are sorry what you are looking for. <br /> Please try another way.</p>}
                                            message={""}
                                            image="/images/notfound-truck.png"
                                        />}
                                    />}
                            </TabPanel>
                            <TabPanel value={mobileTab} index={3}>
                                {delayedLoading ? <ListingSkeleton /> :
                                    <CardList
                                        listData={delayedList}
                                        tableColumns={dashboardDelayedTableColumns((element: any) => {
                                            let params = "vehicleNumber=" + encodeURIComponent(element.vehicleNumber) + "&vehicleCode=" + encodeURIComponent(element.vehicleCode);
                                            loadPage(TrackingUrl, params)
                                        }, (element: any) => showLanePoints(element))}
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

export default DashboardMobileTabs;
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { KeyboardBackspace } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';
import { diversionTabEnum } from '../../base/constant/ArrayList';
import { isMobile } from '../../base/utility/ViewUtils';
import Filter from '../../component/filter/Filter';
import PageContainer from '../../component/pageContainer/PageContainer';
import { diversionDetails } from '../../serviceActions/OrderServiceActions';
import MaterialTableModal from '../freight/order/MaterialTableModal';
import DiversionFODetails from './DiversionFODetails';
import DiversionShipmentDetails from './DiversionShipmentDetails';

function DiversionDetails() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const tabName = new URLSearchParams(useLocation().search).get("tabName");
    const { requestId } = useParams<any>()
    const [response, setResponse] = React.useState<any>({});
    const [oldFreightData, setOldFreightData] = React.useState<any>({})
    const [newFreightData, setNewFreightData] = React.useState<any>({})
    const [loading, setLoading] = React.useState<boolean>(false);
    const [viewMaterialTableModal, setViewMaterialTableModal] = React.useState<boolean>(false);
    const [materialResponse, setMaterialResponse] = React.useState<any>([]);
    const eclipseLength = isMobile ? 6 : 28;
    const [selectedTab, setSelectedTab] = React.useState(0);
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

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        if (!loading) {
            setSelectedTab(newValue);
        }
    };

    function a11yProps(index: any) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    useEffect(() => {
        const params = {
            requestId: requestId,
        }
        setLoading(true)
        appDispatch(diversionDetails(params)).then((response: any) => {
            if (response) {

                setResponse(response)
                setOldFreightData(response.oldFreightOrderDetails)
                setNewFreightData(response.newFreightOrderDetails)
            }
        })
        setLoading(false)
        // eslint-disable-next-line
    }, [requestId])
    return (
        <div className="filter-wrap">
            <MaterialTableModal
                open={viewMaterialTableModal}
                onClose={() => {
                    setViewMaterialTableModal(false)
                }}
                selectedElement={materialResponse}
            />
            {tabName === diversionTabEnum.REJECTED && (
                <>
                    <Filter
                        pageTitle={"Diversion Rejected Details"}
                        buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                        buttonTitle={isMobile ? " " : "Back"}
                        leftIcon={<KeyboardBackspace />}
                        onClick={() => {
                            history.goBack();
                        }}
                    >
                    </Filter>
                    {<PageContainer>
                        <>
                            <DiversionFODetails
                                tabName={tabName}
                                selectedElement={oldFreightData && oldFreightData}
                                requestId={response.requestId}
                                isCollapsed={true}
                            />
                            {oldFreightData && oldFreightData.shipmentDetails && oldFreightData.shipmentDetails.map((element: any, index: number) => (
                                <DiversionShipmentDetails
                                    element={element}
                                    statusCode={response.statusCode}
                                    index={index}
                                    onClickMaterial={() => {
                                        setViewMaterialTableModal(true);
                                        setMaterialResponse(element.articleDetails)
                                    }}
                                    eclipseLength={eclipseLength}
                                    loading={loading}
                                />
                            ))}
                        </>
                    </PageContainer>
                    }
                </>
            )
            }
            {tabName === diversionTabEnum.COMPLETED && (
                <>
                    <Filter
                        pageTitle={"Request ID: " + response.requestId}
                        buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                        buttonTitle={isMobile ? " " : "Back"}
                        leftIcon={<KeyboardBackspace />}
                        onClick={() => {
                            history.goBack();
                        }}
                    >
                    </Filter>
                    <div className="sob-tabs-wrap">

                        <Tabs value={selectedTab} onChange={handleChange} aria-label="simple tabs example">
                            <Tab label="New Freight Order" {...a11yProps(0)} />
                            <Tab label="Old Freight Order" {...a11yProps(1)} />
                        </Tabs>
                        <TabPanel value={selectedTab} index={0}>
                            {<PageContainer>
                                <>
                                    <DiversionFODetails
                                        tabName={tabName}
                                        selectedElement={newFreightData && newFreightData}
                                        requestId={response && response.requestId}
                                        isCollapsed={true}
                                    />
                                    {newFreightData && newFreightData.shipmentDetails && newFreightData.shipmentDetails.map((element: any, index: number) => (
                                        <DiversionShipmentDetails
                                            element={element}
                                            statusCode={response.statusCode}
                                            index={index}
                                            onClickMaterial={() => {
                                                setViewMaterialTableModal(true);
                                                setMaterialResponse(element.articleDetails)
                                            }}
                                            eclipseLength={eclipseLength}
                                            loading={loading}
                                        />
                                    ))}
                                </>
                            </PageContainer>
                            }
                        </TabPanel>
                        <TabPanel value={selectedTab} index={1}>
                            {<PageContainer>
                                <>
                                    <DiversionFODetails
                                        tabName={tabName}
                                        selectedElement={oldFreightData && oldFreightData}
                                        requestId={response && response.requestId}
                                        isCollapsed={true}
                                    />
                                    {oldFreightData.shipmentDetails && oldFreightData.shipmentDetails.map((element: any, index: number) => (
                                        <DiversionShipmentDetails
                                            element={element}
                                            statusCode={response && response.statusCode}
                                            index={index}
                                            onClickMaterial={() => {
                                                setViewMaterialTableModal(true);
                                                setMaterialResponse(element.articleDetails)
                                            }}
                                            eclipseLength={eclipseLength}
                                            loading={loading}
                                        />
                                    ))}
                                </>
                            </PageContainer>
                            }
                        </TabPanel>
                    </div>
                </>
            )}

        </div >
    )
}

export default DiversionDetails

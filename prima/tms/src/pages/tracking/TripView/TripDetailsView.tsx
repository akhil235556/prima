import React, { useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import './TripDetailsView.css';
import Button from '../../../component/widgets/button/Button';
import { ArrowBack, MapOutlined } from '@material-ui/icons';
import { openTripDetail, openMobileMapView } from '../../../redux/actions/TrackingActions';
import StoppageDetails from './StoppageDetails';
import VehicleInformation from './VehicleInformation';
import TrackingDetailsView from './TrackingDetailsView';
import { MobileMapView } from '../../../modals/MapViewModal';
import { isMobile, isTab } from '../../../base/utility/ViewUtils';
import { Context } from '../VehicleTracking';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface TripDetailsViewProps {
  loading: boolean
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function TripDetailsView(props: TripDetailsViewProps) {
  const [state, dispatch] = useContext(Context);
  const [activeTab, setActiveTabValue] = React.useState(0);
  const [subTab, setSubTabValue] = React.useState(0);

  return (
    <div className="trip-detail ">
      <div className="tracking-tabs">
        <AppBar position="static" className="top-tab">
          <Tabs value={activeTab} onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
            setActiveTabValue(newValue);
          }} aria-label="simple tabs example">
            <Tab label="Itinerary" />
            <Tab label="Trip Details" />
            <Button
              leftIcon={<ArrowBack />}
              onClick={() => {
                dispatch(openTripDetail(false));
              }}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={activeTab} index={0}>

          <div className="trip-track-detail">
            <AppBar position="static">
              <Tabs value={subTab} onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
                setSubTabValue(newValue)
              }} aria-label="simple tabs example">
                <Tab
                  label="Time Elapsed">
                </Tab>
                <Tab label="stoppage" />
              </Tabs>
            </AppBar>
            <TabPanel value={subTab} index={0}>
              <TrackingDetailsView />
            </TabPanel>
            <TabPanel value={subTab} index={1}>
              <StoppageDetails />
            </TabPanel>
          </div>

        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <VehicleInformation
            element={state.selectedElement}
            loading={props.loading}
          />
        </TabPanel>
        <Button
          // loading={props.loading}
          title={'View Map'}
          buttonStyle={'view-map-button'}
          leftIcon={<MapOutlined />}
          onClick={() => {
            dispatch(openMobileMapView());
          }}
        />
      </div>

      {(isMobile || isTab) && < MobileMapView
        state={state}
        dispatch={dispatch}
      />}
    </div>
  );

}

export default React.memo(TripDetailsView);
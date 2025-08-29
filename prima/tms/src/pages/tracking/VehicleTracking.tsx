import { AddCircle, Close, Tune } from '@material-ui/icons';
import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, useHistory } from "react-router-dom";
import { createTrip, filter } from '../../base/constant/MessageUtils';
import { TrackingUrl } from '../../base/constant/RoutePath';
import { useSearchParams } from '../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../base/utility/StringUtils';
import { isMobile } from '../../base/utility/ViewUtils';
import Chips from '../../component/chips/Chips';
import DataNotFound from '../../component/error/DataNotFound';
import Filter from '../../component/filter/Filter';
import Button from '../../component/widgets/button/Button';
// import TripCardSkeleton from './trackingSkeleton/TripCardSkeleton';
import { trackingListingFilters } from '../../moduleUtility/FilterUtils';
import { openSubDrawer } from "../../redux/actions/AppActions";
import {
  openTrackingFilter, refreshList,
  refreshLocation,
  setTrackingTripsList,
  showCreateTripForm, showGrabLocationForm
} from '../../redux/actions/TrackingActions';
import TrackingReducers, { TRACKING_INIT_STATE } from '../../redux/reducers/TrackingReducers';
import { getTripList } from '../../serviceActions/TrackingServiceActions';
import CreateTripModal from "./CreateTripModal";
import GrabLocationModal from "./GrabLocationModal";
import TrackingFilters from './trackingFilter/TrackingFilters';
import TrackingList from './trackingList/TrackingList';
import TrackingSkeleton from './trackingSkeleton/TrackingSkeleton';
import TrackingMapView from './trackingView/TrackingMapView';
import './VehicleTracking.css';

interface VehicleTripsProps extends RouteComponentProps {
  match: any,
}

export const Context = React.createContext<any>(TRACKING_INIT_STATE);

export default function VehicleTrips(props: VehicleTripsProps) {
  const history = useHistory();
  const appDispatch = useDispatch();
  const [state = TRACKING_INIT_STATE, dispatch] = useReducer(TrackingReducers, TRACKING_INIT_STATE);
  const [loading, setLoading] = React.useState(false);
  const [callNextPage, setCallNextPage] = React.useState(false);
  const [calledPage, setCalledPage] = React.useState(1);
  const vehicleNumber = props.match.params.vehicleNumber;
  const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(trackingListingFilters);

  useEffect(() => {
    const getTripData = async () => {
      let queryParams: any = {};
      appDispatch(openSubDrawer(false))
      if (!isObjectEmpty(filterState.params)) {
        queryParams = Object.assign(queryParams, filterState.params)
      }
      queryParams.status = 'INIT,INTRANSIT';
      queryParams.size = 5;
      queryParams.page = (state.pagination && state.pagination.next ? state.pagination.next : 1);

      // queryParams.excludePagination = true
      setLoading(true)
      appDispatch(getTripList(queryParams)).then((response: any) => {
        dispatch(setTrackingTripsList(response));
        setLoading(false);
        setCalledPage(queryParams.page);
      })
    }
    getTripData();
    // eslint-disable-next-line
  }, [state.appliedFilterParams, vehicleNumber, state.refreshList, history.location.search, callNextPage]);

  return (
    <Context.Provider value={[state, dispatch]}>
      <main className={!isObjectEmpty(filterState.chips) ? "main-container tracking-wrapper tracking-wrapper-2" : "main-container tracking-wrapper"}>
        < Filter
          pageTitle={"Vehicle Tracking"}
          buttonTitle={isMobile ? " " : filter}
          buttonStyle={"btn-orange btn-sm"}
          onClick={() => {
            dispatch(openTrackingFilter());
          }}
          leftIcon={state.showFilter === true ? <Close /> : <Tune />}
        >
          <Button
            buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue btn-sm"}
            leftIcon={isMobile ? <img src="/images/Add.png" alt="Create Trip" /> : <AddCircle />}
            title={isMobile ? "" : createTrip}
            disable={state.loadingTripList}
            onClick={() => {
              dispatch(showCreateTripForm());
            }} />
        </ Filter>

        <TrackingFilters
          open={state.showFilter}
          filerParams={filterState.params}
          filerChips={filterState.chips}
          onApplyFilter={(filterChips: any, filterParams: any) => {
            dispatch(refreshList());
            // dispatch(setFilter(filterChips, filterParams));
            dispatch(refreshList());
            addFiltersQueryParams(filterChips, filterParams)
            dispatch(openTrackingFilter());
          }}
          onClose={() => {
            dispatch(openTrackingFilter());
          }}
        />


        <CreateTripModal
          open={state.showCRForm}
          selectedElement={null}
          onSuccess={() => {
            dispatch(refreshList());
            dispatch(showCreateTripForm());
            history.push(TrackingUrl)
          }}
          onClose={() => {
            dispatch(showCreateTripForm());
          }} />

        <GrabLocationModal
          open={state.showGLForm}
          // selectedElement={state.selectedElement}
          selectedElement={state.grabModalData}
          onSuccess={() => {
            dispatch(showGrabLocationForm());
            dispatch(refreshLocation());
            // getTripData();
          }}
          onClose={() => {
            dispatch(showGrabLocationForm());
          }} />

        <div className="container-fluid track-chip-wrap">
          <div className="row">
            <div className="col-12 tracking-chips">
              {!isObjectEmpty(filterState.chips) && Object.keys(filterState.chips).map((element, index) => (
                <Chips
                  key={index}
                  label={element === "isTatBreachedLabel" ? "TAT Breached: " + filterState.chips[element] : filterState.chips[element]}
                  onDelete={() => {
                    // dispatch(removeFilter(element));
                    dispatch(refreshList());
                    if (element === "fromDateChip" || element === "toDateChip") {
                      let secondKey = element === "fromDateChip" ? "toDateChip" : "fromDateChip";
                      removeFiltersQueryParams([element, secondKey])
                    } else {
                      removeFiltersQueryParams([element]);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {(!state.tripList && loading) ? <TrackingSkeleton /> : (state.tripList && (
          <>
            <div className="Tracking-View">
              <div className="container-fluid ht100">
                <div className="row ht100">
                  <div className="col-md-12 col-xl-auto col-12 trackingList pl-0">
                    <TrackingList
                      onReachEnd={() => {
                        if (state.pagination && state.pagination.next && state.pagination.next !== calledPage) {
                          setLoading(true);
                          setCalledPage(state.pagination.next);
                          setCallNextPage((prev) => !prev);
                        }
                      }}
                      isNextPage={state.pagination && state.pagination.next}
                      listLoading={loading}
                    />
                  </div>
                  <div className="col-md-auto col-lg col-12 d-xl-block d-none trackingView ">
                    <TrackingMapView
                      loading={state.loadingETA}
                      currentLocation={state.selectedTripCurrentLocation}
                      directions={state.directions}
                      path={state.path}
                      selectedElement={state.locationArray}
                      taggedLocations={(state.selectedElement && state.selectedElement.taggedLocations)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>)) || <DataNotFound />}

      </main>
    </Context.Provider>
  );

}

import React, { useReducer } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import Chips from '../../../component/chips/Chips';
import { trackingDashboardFilters } from '../../../moduleUtility/FilterUtils';
import { refreshList, toggleFilter } from '../../../redux/actions/TrackingDashboardActions';
import TrackingDashboardReducer, { TRACKING_DASHBOARD_TYPE_STATE } from '../../../redux/reducers/TrackingDashboardReducer';
import TrackingDashboard from './TrackingDashboard';
import TrackingDashboardFilters from './TrackingDashboardFilters';
import TrackingDashboardListing from './TrackingListing';
import TrackingRunningTrip from './TrackingRunningTrip';

const TrackingDashboardWrapper = ({ match }: any) => {
    const [state = TRACKING_DASHBOARD_TYPE_STATE, dispatch] = useReducer(TrackingDashboardReducer, TRACKING_DASHBOARD_TYPE_STATE);
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(trackingDashboardFilters);
    function filterChipUI() {
        return (
            !isObjectEmpty(filterState.chips) && Object.keys(filterState.chips).map((element) => (
                filterState.chips[element] && <Chips
                label={element === "isTatBreachedLabel" ? "TAT Breached: " + filterState.chips[element] : filterState.chips[element]}
                    onDelete={() => {
                        dispatch(refreshList());
                        if (element === "fromDateChip" || element === "toDateChip") {
                            let secondKey = element === "fromDateChip" ? "toDateChip" : "fromDateChip";
                            removeFiltersQueryParams([element, secondKey])
                        } else {
                            removeFiltersQueryParams([element]);
                        }
                    }}
                />
            ))
        )
    }
    return (
        <div className={"tracking-dash-wrapper"}>
            <TrackingDashboardFilters
                open={state.openFilter}
                filerChips={filterState.chips}
                filerParams={filterState.params}
                onApplyFilter={(filterChips: any, filterParams: any) => {
                    //dispatch(setFilter(filterChips, filterParams));
                    dispatch(refreshList());
                    dispatch(toggleFilter());
                    addFiltersQueryParams(filterChips, filterParams)
                }}
                onClose={() => {
                    dispatch(toggleFilter());
                }}
            />
            <Switch>
                <Route exact path={match.url}>
                    <TrackingDashboard
                        filterChips={filterState.chips}
                        filterParams={filterState.params}
                        filterDispatch={dispatch}
                        filterChipUI={filterChipUI}
                        wrapperState={state}
                    />
                </Route>
                <Route exact path={match.url + "/listing/:id"}>
                    <TrackingDashboardListing
                        filterChips={filterState.chips}
                        filterParams={filterState.params}
                        filterDispatch={dispatch}
                        filterChipUI={filterChipUI}
                        wrapperState={state}
                    />
                </Route>
                <Route exact path={`${match.url}/running`}>
                    <TrackingRunningTrip
                        filterChips={filterState.chips}
                        filterParams={filterState.params}
                        filterDispatch={dispatch}
                        filterChipUI={filterChipUI}
                        wrapperState={state}
                    />
                </Route>
            </Switch>
        </div>
    )
}

export default TrackingDashboardWrapper;

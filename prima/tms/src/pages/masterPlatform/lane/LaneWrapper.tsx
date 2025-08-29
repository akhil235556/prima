import React, { useReducer } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { useSearchParams } from '../../../base/hooks/useSearchParams';
import { isObjectEmpty } from '../../../base/utility/StringUtils';
import Chips from '../../../component/chips/Chips';
import { laneFilters } from '../../../moduleUtility/FilterUtils';
import { refreshList, setFilter, toggleFilter } from '../../../redux/actions/LaneActions';
import LaneReducer, { LANE_STATE } from '../../../redux/reducers/LaneReducer';
import CreateLane from './CreateLane';
import LaneFilters from './LaneFilters';
import LaneListing from './LaneListing';

const LaneWrapper = ({ match }: any) => {
    const [state = LANE_STATE, dispatch] = useReducer(LaneReducer, LANE_STATE);
    const [filterState, addFiltersQueryParams, removeFiltersQueryParams] = useSearchParams(laneFilters);
    // const {id} = useParams();
    const location: any = useLocation();

    function filterChipUI() {
        return (
            !isObjectEmpty(filterState.chips) && Object.keys(filterState.chips).map((element) => (
                <Chips
                    label={element === "sobLabel" ? "Share of Business: " + filterState.chips[element] : filterState.chips[element]}
                    onDelete={() => {
                        dispatch(refreshList());
                        removeFiltersQueryParams([element])
                    }}
                />
            ))
        )
    }
    return (
        <div>
            <LaneFilters
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
                    <LaneListing
                        filterLaneState={filterState}
                        filterDispatch={dispatch}
                        filterChipUI={filterChipUI}
                        // id={id}
                        location={location}
                        setFilter={setFilter}
                    />
                </Route>
                <Route exact path={match.url + "/create/"}>
                    <CreateLane />
                </Route>
            </Switch>
        </div>
    )
}

export default LaneWrapper;
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { errorLane, laneLabel } from "../../../base/constant/MessageUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from '../../../base/utility/StringUtils';
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchLane } from "../../../serviceActions/LaneServiceActions";
// import { searchLane } from "../../../serviceActions/LaneServiceActions";
import { getAllVehicleTypeList } from '../../../serviceActions/VehicleTypeServiceActions';

interface IndentDashboardFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function IndentDashboardFilters(props: IndentDashboardFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});

    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false)
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined)
    const vehicleTypeList = useSelector((state: any) =>
        state.appReducer.vehicleTypeList, shallowEqual
    );

    useEffect(() => {
        if (open) {
            setFilterValues(filerChips);
            setFilterParams(filerParams);
            setIsFilterChanged(false);
            appDispatch(getAllVehicleTypeList());
        }
        // eslint-disable-next-line
    }, [open]);

    return (
        <FilterContainer
            open={open}
            onClose={() => {
                setError({});
                onClose();
            }}
            onClear={() => {
                setFilterValues({});
                setFilterParams({});
                setError({});
            }}
            onApply={onApply}
        >
            <div className="filter-form-row">
                <div className="form-group">
                    <AutoSuggest
                        label={laneLabel}
                        placeHolder={laneLabel}
                        value={filterValues.laneName}
                        error={error.lane}
                        suggestions={laneList}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getLaneList(value);
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ laneName: element.label }, { laneCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ laneName: text }, { laneCode: "" });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Vehicle Type"
                        placeHolder="Vehicle Type"
                        value={filterValues.vehicleTypeName ? ({
                            label: filterValues.vehicleTypeName,
                            value: filterParams.vehicleTypeCode,
                        }) : null}
                        error={error.vehicleType}
                        options={setAutoCompleteListWithData(vehicleTypeList, "type", "code")}
                        onChange={(element: OptionType) => {
                            setValues({ vehicleTypeName: element.label }, { vehicleTypeCode: element.value });
                        }}
                    />
                </div>
            </div>
        </FilterContainer>
    );

    function onApply() {
        if (!isFilterNullValue(filterValues.laneName) && isNullValue(filterParams.laneCode)) {
            setError({ lane: errorLane });
            return;
        }
        if (!isObjectEmpty(filterParams)) {
            if (isFilterChanged) {
                setError({});
                onApplyFilter(filterValues, filterParams);
            } else {
                setError({});
                onClose();
            }
        } else {
            setError({ lane: errorLane });
        }
    }


    function setValues(chips: any, params?: any) {
        setFilterValues({
            ...filterValues,
            ...chips
        });
        setError({});
        params ? setFilterParams({
            ...filterParams,
            ...params
        }) : setFilterParams({});
        setIsFilterChanged(true);
    }



    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                setLaneList(setAutoCompleteListWithData(response, "laneName", "laneCode"))
            }
        });
    }
}

export default IndentDashboardFilters;

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    fromDateError,
    toDateError
} from '../../../base/constant/MessageUtils';
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";


interface PlanningDashboardFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function PlanningDashboardFilters(props: PlanningDashboardFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});

    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const [locationList, setLocationList] = React.useState<Array<OptionType> | undefined>(undefined);

    useEffect(() => {
        if (open) {
            setFilterValues(filerChips);
            setFilterParams(filerParams);
            setIsFilterChanged(false);
        }
        // eslint-disable-next-line
    }, [open]);

    return (
        <FilterContainer
            open={open}
            onClose={onClose}
            onApply={onApply}
            onClear={() => {
                setFilterParams({});
                setFilterValues({});
                setError({});
            }}
        >
            <div className="filter-form-row">
                <div className="form-group">
                    <AutoSuggest
                        label="Origin"
                        placeHolder="Enter Origin Name"
                        error={error.originLocationName}
                        value={filterValues.originLocationName}
                        suggestions={locationList}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getSuggestionList(value);
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ originLocationName: element.label }, { originLocationCode: element.value })
                        }}
                        onChange={(text: string) => {
                            setValues({ originLocationName: text }, { originLocationCode: "" })
                        }}
                    />
                </div>
            </div>
        </FilterContainer>
    );

    function setValues(chips: any, params?: any) {
        setFilterValues({
            ...filterValues,
            ...chips
        });
        setError({});
        params && setFilterParams({
            ...filterParams,
            ...params
        });
        setIsFilterChanged(true);
    }

    function onApply() {

        if (!isNullValue(filterValues.period) && (isNullValue(filterParams.fromDatetime) || isNullValue(filterParams.toDatetime))) {
            if (isNullValue(filterParams.fromDatetime)) {
                setError({ fromDatetime: fromDateError });
                return;
            } else if (isNullValue(filterParams.toDatetime)) {
                setError({ toDatetime: toDateError });
                return;
            }
        }
        if (!isFilterNullValue(filterValues.originLocationName) && isNullValue(filterParams.originLocationCode)) {
            setError({ originLocationName: "Enter valid origin name" });
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
            setError({ period: "Select valid period" });
        }
    }

    function getSuggestionList(text: string) {
        appDispatch(searchLocationList({ query: text })).then((response: any) => {
            if (response) {
                setLocationList(setAutoCompleteListWithData(response, "locationName", "locationCode"));
            }
        })
    }
}

export default PlanningDashboardFilters;

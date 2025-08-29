import React, { useEffect } from "react";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { useDispatch } from "react-redux";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";

interface InventoryViewFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function InventoryViewFilters(props: InventoryViewFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});

    const [locationList, setLocationList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);

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
            onClose={() => {
                onClose();
                setError({});
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
                        label="Location"
                        placeHolder="Enter Location Name"
                        error={error.locationName}
                        value={filterValues.locationName}
                        suggestions={locationList}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getSuggestionList(value);
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ locationName: element.label }, { location: element.value })
                        }}
                        onChange={(text: string) => {
                            setValues({ locationName: text }, { location: "" })
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
        if (!isFilterNullValue(filterValues.locationName) && isNullValue(filterParams.location)) {
            setError({ locationName: "Enter valid location" });
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
            setError({ locationName: "Enter valid location" });
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

export default InventoryViewFilters;

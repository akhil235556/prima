import React, { useEffect } from "react";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { isObjectEmpty, isFilterNullValue, isNullValue } from "../../../base/utility/StringUtils";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { originLabel, originPlaceHolder, destinationLabel, destinationPlaceHolder, errorOrigin, errorDestination } from "../../../base/constant/MessageUtils";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { useDispatch } from "react-redux";
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";

interface PlanningDispatchFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any,
    filerChips: any,
    filerParams: any,
}

function PlanningDispatchHistoryFilters(props: PlanningDispatchFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerChips, filerParams } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const [error, setError] = React.useState<any>({});

    const [originSuggestion, setOriginSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [destinationSuggestion, setDestinationSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);

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
                        label={originLabel}
                        placeHolder={originPlaceHolder}
                        error={error.originLocationName}
                        value={filterValues && filterValues.originLocationName}
                        suggestions={originSuggestion}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getSuggestionList(value, "origin");
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ originLocationName: element.label }, { origin: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ originLocationName: text }, { origin: "" });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoSuggest
                        label={destinationLabel}
                        placeHolder={destinationPlaceHolder}
                        error={error.destinationLocationName}
                        value={filterValues && filterValues.destinationLocationName}
                        suggestions={destinationSuggestion}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getSuggestionList(value, "destination");
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ destinationLocationName: element.label }, { destination: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ destinationLocationName: text }, { destination: "" });
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

        if (!isFilterNullValue(filterValues.originLocationName) && isNullValue(filterParams.origin)) {
            setError({ originLocationName: errorOrigin });
            return;
        } else if (!isFilterNullValue(filterValues.destinationLocationName) && isNullValue(filterParams.destination)) {
            setError({ destinationLocationName: errorDestination });
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
            setError({ originLocationName: errorOrigin });
        }
    }

    function getSuggestionList(text: string, type: string) {
        appDispatch(searchLocationList({ query: text })).then((response: any) => {
            if (response) {
                switch (type) {
                    case "origin":
                        setOriginSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
                        break;
                    case "destination":
                        setDestinationSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
                        break;
                }

            }
        })
    };
}

export default PlanningDispatchHistoryFilters;

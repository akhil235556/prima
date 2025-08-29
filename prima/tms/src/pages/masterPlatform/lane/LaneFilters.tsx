import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { destinationLabel, destinationPlaceHolder, errorDestination, errorIntegrationCode, errorLane, errorOrigin, integrationIDLabel, integrationIDPlaceholder, laneLabel, lanePlaceholder, originLabel, originPlaceHolder } from "../../../base/constant/MessageUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from "../../../component/widgets/EditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList, setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchLane } from "../../../serviceActions/LaneServiceActions";
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";

interface LaneFilterProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function LaneFilters(props: LaneFilterProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false)
    const [originSuggestion, setOriginSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [destinationSuggestion, setDestinationSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);

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
                            setValues({ originLocationName: element.label }, { originCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ originLocationName: text }, { originCode: "" });
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
                            setValues({ destinationLocationName: element.label }, { destinationCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ destinationLocationName: text }, { destinationCode: "" });
                        }}
                    />
                </div>
                <div className="form-group">
                    <EditText
                        label={integrationIDLabel}
                        placeholder={integrationIDPlaceholder}
                        value={filterValues && filterValues.integrationId}
                        error={error.integrationId}
                        maxLength={30}
                        onChange={(text: any) => {
                            setValues({ integrationId: text }, { integrationId: text })
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoSuggest
                        label={laneLabel}
                        placeHolder={lanePlaceholder}
                        value={filterValues.laneName}
                        suggestions={laneList}
                        error={error.lane}
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
            </div>
        </FilterContainer>
    );

    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                setLaneList(setAutoCompleteList(response, "laneName", "laneCode"))
            }
        });
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


    function onApply() {
        if (!isFilterNullValue(filterValues.originLocationName) && isNullValue(filterParams.originCode)) {
            setError({ originLocationName: errorOrigin });
            return;
        } else if (!isFilterNullValue(filterValues.destinationLocationName) && isNullValue(filterParams.destinationCode)) {
            setError({ destinationLocationName: errorDestination });
            return;
        } else if (!isFilterNullValue(filterValues.integrationId) && isNullValue(filterParams.integrationId)) {
            setError({ integrationId: errorIntegrationCode });
            return;
        } else if (!isFilterNullValue(filterValues.laneName) && isNullValue(filterParams.laneCode)) {
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
            setError({ originLocationName: errorOrigin });
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
}

export default LaneFilters;

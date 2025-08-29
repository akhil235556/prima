import React, { useEffect } from "react";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import EditText from "../../../component/widgets/EditText";
import { useDispatch } from "react-redux";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import {
    originLabel, originPlaceHolder, destinationLabel, destinationPlaceHolder, errorOrigin,
    errorDestination
} from '../../../base/constant/MessageUtils';
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";

interface AgnHistoryFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function AgnHistoryFilters(props: AgnHistoryFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
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
                    <EditText
                        label="AGN Code"
                        placeholder="Enter AGN Code"
                        value={filterValues.agnCode}
                        error={error.agnCode}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ agnCode: text }, { agnCode: text });
                        }}
                    />
                </div>
                <div className="form-group">
                    <EditText
                        label="Freight Order Code"
                        placeholder="Enter Freight Order Code"
                        value={filterValues.freightOrderCode}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ freightOrderCode: text }, { freightOrderCode: text });
                        }}
                    />
                </div>
                <div className="form-group">
                    <EditText
                        label="Shipment Code"
                        placeholder="Enter Shipment Code"
                        value={filterValues.freightShipmentCode}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ freightShipmentCode: text }, { freightShipmentCode: text });
                        }}
                    />
                </div>

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
                            setValues({ originLocationName: element.label }, { originLocationCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ originLocationName: text }, { originLocationCode: "" });
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
                            setValues({ destinationLocationName: element.label }, { destinationLocationCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ destinationLocationName: text }, { destinationLocationCode: "" });
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
        if (!isFilterNullValue(filterValues.originLocationName) && isNullValue(filterParams.originLocationCode)) {
            setError({ originLocationName: errorOrigin });
            return;
        } else if (!isFilterNullValue(filterValues.destinationLocationName) && isNullValue(filterParams.destinationLocationCode)) {
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
            setError({ agnCode: "Enter valid AGN Code" });
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

export default AgnHistoryFilters;

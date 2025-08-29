import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    errorLocation, integrationIDLabel, integrationIDPlaceholder, locationTypeLabel, locationTypePlaceHolder
} from "../../../base/constant/MessageUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from "../../../component/widgets/EditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { getLocationType, searchLocationList } from "../../../serviceActions/LocationServiceActions";
// import { DatePicker } from "@material-ui/pickers";
// import { displayDateFormatter, convertDateFormat, convertDateServerFormat } from "../../../base/utility/DateUtils";

interface LocationFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any,
    filerChips: any,
    filerParams: any,
}

function LocationFilters(props: LocationFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const [destinationSuggestion, setDestinationSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [locationTypeList, setlocationTypeList] = React.useState<Array<OptionType> | undefined>(undefined);

    useEffect(() => {
        const setFilterData = async () => {
            if (open) {
                let locationTypeList = await appDispatch(getLocationType());
                locationTypeList && locationTypeList.length && setlocationTypeList(setAutoCompleteListWithData(locationTypeList, "locationTypeName", "id"));
                setFilterValues(filerChips);
                setFilterParams(filerParams);
                setIsFilterChanged(false);
            }
        }
        setFilterData()
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
                        label={"Location"}
                        placeHolder={"Select Location"}
                        error={error.locationName}
                        value={filterValues && filterValues.locationName}
                        suggestions={destinationSuggestion}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getSuggestionList(value);
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ locationName: element.label }, { locationCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ locationName: text }, { locationCode: "" });
                        }}
                    />
                </div>
                <div className="form-group">
                    <EditText
                        label={integrationIDLabel}
                        placeholder={integrationIDPlaceholder}
                        error={error.integrationId}
                        value={filterValues.integrationId}
                        maxLength={50}
                        onChange={(text: string) => {
                            setValues({ integrationId: text }, { integrationId: text })
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label={locationTypeLabel}
                        placeHolder={locationTypePlaceHolder}
                        value={(filterValues && filterParams && filterValues.locationTypeName && filterParams.locationType && {
                            label: filterValues.locationTypeName,
                            value: filterValues.locationType,
                        }) || ""}
                        options={locationTypeList}
                        error={error.locationTypeName}
                        onChange={(value: any) => {
                            setValues({ locationTypeName: value.label }, { locationType: value.value });
                        }}
                    />
                </div>
                {/* <div className="form-group">
                    <EditText
                        label={integrationIDLabel}
                        placeholder={integrationIDPlaceholder}
                        error={error.integrationId}
                        value={filterValues.integrationId}
                        maxLength={50}
                        onChange={(text: string) => {
                            setValues({ integrationId: text }, { integrationId: text })
                        }}
                    />
                </div> */}
                {/* <div className="form-group">
                    <label className="picker-label">{createdAtDate}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={createdAtDatePlaceHolder}
                        hiddenLabel
                        // disableFuture
                        helperText={error.toDate}
                        format={displayDateFormatter}
                        value={filterParams.toDate || null}
                        onChange={(date: any) => {
                            setValues({ toDate: convertDateFormat(date, displayDateFormatter) }, { toDate: convertDateServerFormat(date) });

                        }}
                    />
                </div> */}
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
        if (!isFilterNullValue(filterValues.locationName) && isNullValue(filterParams.locationCode)) {
            setError({ locationName: "Enter valid location" });
            return;
        } else if (!isFilterNullValue(filterValues.integrationId) && isNullValue(filterParams.integrationId)) {
            setError({ integrationId: "Enter valid Integration ID" });
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
            setError({ locationName: errorLocation });
        }
    }

    function getSuggestionList(text: string) {
        appDispatch(searchLocationList({ query: text })).then((response: any) => {
            if (response) {
                setDestinationSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
            }
        })
    };
}

export default LocationFilters;

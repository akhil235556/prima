import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fromDateLabel, fromDatePlaceholder, toDateLabel, toDatePlaceholder } from "../../../base/constant/MessageUtils";
import { convertDateFormat, convertDateServerFormat, displayDateFormatter } from "../../../base/utility/DateUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";
//import { displayDateFormatter, convertDateFormat, convertDateToServerFormatFormat } from "../../../base/utility/DateUtils";

interface SalesOrderFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function SalesOrderFilters(props: SalesOrderFiltersProps) {
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
                        mandatory
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
                <div className="form-group">
                    <label className="picker-label">{fromDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={fromDatePlaceholder}
                        hiddenLabel
                        disableFuture
                        helperText={error.fromDate}
                        format={displayDateFormatter}
                        maxDate={filterParams.toDate || new Date()}
                        error={error.toDate}
                        value={filterParams.fromDate || null}
                        onChange={(date: any) => {
                            setValues({ fromDateChip: convertDateFormat(date, displayDateFormatter) }, { fromDate: convertDateServerFormat(date) });
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{toDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={toDatePlaceholder}
                        hiddenLabel
                        disableFuture
                        helperText={error.toDate}
                        format={displayDateFormatter}
                        value={filterParams.toDate || null}
                        minDate={filterParams.fromDate}
                        onChange={(date: any) => {
                            setValues({ toDateChip: convertDateFormat(date, displayDateFormatter) }, { toDate: convertDateServerFormat(date) });

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
        } else if (!isFilterNullValue(filterValues.toDate) && isNullValue(filterParams.fromDate)) {
            setError({ fromDate: "Enter from date" });
            return;
        } else if (!isFilterNullValue(filterValues.fromDate) && isNullValue(filterParams.toDate)) {
            setError({ toDate: "Enter to date" });
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

export default SalesOrderFilters;

import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { IndentStatusList } from "../../../base/constant/ArrayList";
import { errorLane, fromDateError, fromDatePlaceholder, laneLabel, toDateError, toDatePlaceholder } from "../../../base/constant/MessageUtils";
import { convertDateFormat, convertDateToServerFromDate, convertDateToServerToDate, displayDateFormatter } from "../../../base/utility/DateUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from '../../../base/utility/StringUtils';
import AutoComplete from "../../../component/widgets/AutoComplete";
// import { searchLane } from "../../../serviceActions/LaneServiceActions";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchLane } from "../../../serviceActions/LaneServiceActions";

interface IndentFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function IndentFilters(props: IndentFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});

    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false)
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined)

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
                    <AutoComplete
                        label="Status"
                        placeHolder="Select Status"
                        error={error.status}
                        value={filterValues.status ? {
                            label: filterValues.status,
                            value: filterParams.status
                        } : undefined}
                        options={IndentStatusList}
                        onChange={(element: any) => {
                            setValues({ status: element.value }, { status: element.value })
                        }}
                    />
                </div>
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
                <div className="form-group date-picker-wrap">
                    <label className="picker-label">{"From Date"}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={fromDatePlaceholder}
                        hiddenLabel
                        helperText={error.placementFromDate}
                        format={displayDateFormatter}
                        maxDate={filterParams.placementToDate}
                        value={filterParams.placementFromDate || null}
                        onChange={(date: any) => {
                            setValues({ placementFromTimeDate: convertDateFormat(date, displayDateFormatter) }, { placementFromDate: convertDateToServerFromDate(date) });
                        }}
                    />
                </div>
                <div className="form-group date-picker-wrap">
                    <label className="picker-label">{"To Date"}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={toDatePlaceholder}
                        hiddenLabel
                        helperText={error.placementToDate}
                        format={displayDateFormatter}
                        value={filterParams.placementToDate || null}
                        minDate={filterParams.placementFromDate}
                        onChange={(date: any) => {
                            setValues({ placementToTimeDate: convertDateFormat(date, displayDateFormatter) }, { placementToDate: convertDateToServerToDate(date) });
                        }}
                    />
                </div>
            </div>
        </FilterContainer>
    );

    function onApply() {
        if (!isFilterNullValue(filterValues.status) && isNullValue(filterParams.status)) {
            setError({ status: "Select valid  status" });
            return;
        } else if (!isFilterNullValue(filterValues.laneName) && isNullValue(filterParams.laneCode)) {
            setError({ lane: errorLane });
            return;
        } else if (isNullValue(filterParams.placementFromDate) && !isNullValue(filterParams.placementToDate)) {
            setError({ placementFromDate: fromDateError });
            return;
        } else if (isNullValue(filterParams.placementToDate) && !isNullValue(filterParams.placementFromDate)) {
            setError({ placementToDate: toDateError });
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
            setError({ status: "Select valid  status" });
        }
    }


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



    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                setLaneList(setAutoCompleteListWithData(response, "laneName", "laneCode"))
            }
        });
    }
}

export default IndentFilters;

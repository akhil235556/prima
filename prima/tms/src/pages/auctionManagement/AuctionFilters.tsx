import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { errorLane, fromDateError, fromDatePlaceholder, laneLabel, lanePlaceholder, toDateError, toDatePlaceholder } from '../../base/constant/MessageUtils';
import { convertDateFormat, convertDateToServerFromDate, convertDateToServerToDate, displayDateFormatter } from "../../base/utility/DateUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from '../../base/utility/StringUtils';
import AutoComplete from "../../component/widgets/AutoComplete";
import AutoSuggest from "../../component/widgets/AutoSuggest";
import { OptionType } from "../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../moduleUtility/ConstantValues";
import { setAutoCompleteList } from "../../moduleUtility/DataUtils";
import { searchLane } from "../../serviceActions/LaneServiceActions";

interface AuctionFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any,
    filerChips: any,
    filerParams: any,
}

function AuctionFilters(props: AuctionFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerChips, filerParams } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const [error, setError] = React.useState<any>({});
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);

    const auctionStatus = [{
        value: "Scheduled",
        label: "Scheduled"
    }, {
        value: "Live",
        label: "Live"
    }, {
        value: "Completed",
        label: "Completed"
    }, {
        value: "Cancelled",
        label: "Cancelled"
    }, {
        value: "Closed",
        label: "Closed"
    }]

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
                closeModal();
            }}
            onClear={() => {
                setFilterParams({});
                setFilterValues({});
                setError({});
            }}
            onApply={onApply}
        >
            <div className="filter-form-row">
                <div className="form-group">
                    <AutoComplete
                        label="Transit Status"
                        placeHolder="Select Transit"
                        error={error.status}
                        value={filterValues.status ? {
                            label: filterValues.status,
                            value: filterParams.status
                        } : undefined}
                        options={auctionStatus}
                        onChange={(value: any) => {
                            setValues({ status: value.label }, { status: value.label });
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
                <div className="form-group date-picker-wrap">
                    <label className="picker-label">{"From Date"}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={fromDatePlaceholder}
                        hiddenLabel
                        disableFuture
                        helperText={error.fromDateTime}
                        format={displayDateFormatter}
                        maxDate={filterParams.toDateTime}
                        value={filterParams.fromDateTime || null}
                        onChange={(date: any) => {
                            setValues({ auctionFromDateTime: convertDateFormat(date, displayDateFormatter) }, { fromDateTime: convertDateToServerFromDate(date) });
                        }}
                    />
                </div>
                <div className="form-group date-picker-wrap">
                    <label className="picker-label">{"To Date"}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={toDatePlaceholder}
                        hiddenLabel
                        disableFuture
                        helperText={error.toDateTime}
                        format={displayDateFormatter}
                        value={filterParams.toDateTime || null}
                        minDate={filterParams.fromDateTime}
                        onChange={(date: any) => {
                            setValues({ auctionToDateTime: convertDateFormat(date, displayDateFormatter) }, { toDateTime: convertDateToServerToDate(date) });
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

    function closeModal() {
        setError({});
        onClose();
    }

    function onApply() {
        // if (!isFilterNullValue(filterValues.statusCode) && isNullValue(filterParams.status)) {
        //     setError({ status: "Select valid status" });
        //     return;
        // } else
        if (!isFilterNullValue(filterValues.laneName) && isNullValue(filterParams.laneCode)) {
            setError({ lane: errorLane });
            return;
        } else if (isNullValue(filterParams.fromDateTime) && !isNullValue(filterParams.toDateTime)) {
            setError({ fromDateTime: fromDateError });
            return;
        } else if (isNullValue(filterParams.toDateTime) && !isNullValue(filterParams.fromDateTime)) {
            setError({ toDateTime: toDateError });
            return;
        }
        if (!isObjectEmpty(filterParams)) {
            if (isFilterChanged) {
                setError({});
                onApplyFilter(filterValues, filterParams);
            } else {
                closeModal();
            }

        } else {
            setError({ status: "Select valid status" });
        }
    }
}

export default AuctionFilters;

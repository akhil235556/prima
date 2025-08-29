import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { pendingPodOptions } from "../../../base/constant/ArrayList";
import {
    freightOrderCodeErrorLabel,
    fromDateError, fromDateLabel, fromDatePlaceholder,
    laneCodeErrorLabel,
    laneLabel, lanePlaceholder, orderCodeLabel, orderIdPlaceholder, toDateError, toDateLabel, toDatePlaceholder
} from "../../../base/constant/MessageUtils";
import { convertDateFormat, convertDateToServerFromDate, convertDateToServerToDate, displayDateFormatter } from "../../../base/utility/DateUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from "../../../component/widgets/EditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList } from "../../../moduleUtility/DataUtils";
import { searchLane } from "../../../serviceActions/LaneServiceActions";

interface FreightReconciliationPeriodicFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
    isListingPage?: boolean
}

function FreightReconciliationPeriodicFilters(props: FreightReconciliationPeriodicFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
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
                        label={orderCodeLabel}
                        placeholder={orderIdPlaceholder}
                        value={filterValues.freightOrderCode}
                        error={error.freightOrderCode}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ freightOrderCode: text }, { freightOrderCode: text });
                        }}
                    />
                </div>

                <div className="form-group">
                    <AutoComplete
                        label="POD Status"
                        placeHolder="Select POD Status"
                        value={filterValues.pendingPodsType ? {
                            label: filterValues.pendingPodsType,
                            value: filterParams.pendingPods
                        } : undefined}
                        options={pendingPodOptions}
                        onChange={(value: OptionType) => {
                            setValues({ pendingPodsType: value.label }, { pendingPods: value.value })
                        }}
                    />
                </div>

                <div className="form-group">
                    <AutoSuggest
                        label={laneLabel}
                        placeHolder={lanePlaceholder}
                        value={filterValues.laneName}
                        suggestions={laneList}
                        error={error.laneCode}
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
                    <label className="picker-label">{fromDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={fromDatePlaceholder}
                        hiddenLabel
                        helperText={error.deliveredAtFromTime}
                        format={displayDateFormatter}
                        maxDate={filterParams.deliveredAtToTime}
                        value={filterParams.deliveredAtFromTime || null}
                        onChange={(date: any) => {
                            setValues({ freightOrderDeliveredAtFromTime: convertDateFormat(date, displayDateFormatter) }, { deliveredAtFromTime: convertDateToServerFromDate(date) });
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{toDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={toDatePlaceholder}
                        hiddenLabel
                        helperText={error.deliveredAtToTime}
                        format={displayDateFormatter}
                        value={filterParams.deliveredAtToTime || null}
                        minDate={filterParams.deliveredAtFromTime}
                        onChange={(date: any) => {
                            setValues({ freightOrderDeliveredAtToTime: convertDateFormat(date, displayDateFormatter) }, { deliveredAtToTime: convertDateToServerToDate(date) });
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
        if (!isFilterNullValue(filterValues.freightOrderCode) && isNullValue(filterParams.freightOrderCode)) {
            setError({ freightOrderCode: freightOrderCodeErrorLabel });
            return;
        } else if (!isFilterNullValue(filterValues.laneName) && isNullValue(filterParams.laneCode)) {
            setError({ laneCode: laneCodeErrorLabel });
            return;
        } else if (isNullValue(filterParams.deliveredAtFromTime) && !isNullValue(filterParams.deliveredAtToTime)) {
            setError({ deliveredAtFromTime: fromDateError });
            return;
        } else if (isNullValue(filterParams.deliveredAtToTime) && !isNullValue(filterParams.deliveredAtFromTime)) {
            setError({ deliveredAtToTime: toDateError });
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
            setError({ freightOrderCode: freightOrderCodeErrorLabel });
        }
    }

    // function getPartnerList(text: string) {
    //     appDispatch(searchClientPartner({ query: text })).then((response: any) => {
    //         if (response) {
    //             setPartnerList(setAutoCompleteList(response, "partnerName", "partnerCode"))
    //         }
    //     });
    // }

    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                setLaneList(setAutoCompleteList(response, "laneName", "laneCode"))
            }
        });
    }
}

export default FreightReconciliationPeriodicFilters;

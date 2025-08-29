import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { billingPeriodOptions, freightTypeList } from "../../../base/constant/ArrayList";
import {
    errorTransporter,
    fromDateError, fromDateLabel, fromDatePlaceholder, laneLabel, lanePlaceholder, orderCodeLabel, orderIdPlaceholder, toDateError, toDateLabel, toDatePlaceholder, transporterLabel, transporterPlaceHolder, errorLane
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
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";

interface FreightReconciliationFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
    isListingPage?: boolean
}

function FreightReconciliationFilters(props: FreightReconciliationFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);
    // const [vehicleTypelist, setVehicleTypelist] = React.useState<Array<OptionType> | undefined>(undefined);

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
                    <AutoSuggest
                        label={transporterLabel}
                        placeHolder={transporterPlaceHolder}
                        value={filterValues.partnerName}
                        error={error.partner}
                        suggestions={partnerList}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getPartnerList(value);
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ partnerName: element.label }, { partnerCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ partnerName: text }, { partnerCode: "" });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Freight Type"
                        placeHolder="Select Freight Type"
                        value={filterValues.freightType ? {
                            label: filterValues.freightType,
                            value: filterParams.freightType
                        } : undefined}
                        options={freightTypeList}
                        onChange={(value: OptionType) => {
                            setValues({ freightType: value.label }, { freightType: value.value })
                        }}
                    />
                </div>
                {/* <div className="form-group">
                    <AutoSuggest
                        label={vehicleTypeTitle}
                        placeHolder={vehicleTypePlaceholder}
                        value={filterValues.vehicleType}
                        suggestions={vehicleTypelist}
                        error={error.vehicleType}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getVehicleType(value);
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ vehicleType: element.label }, { vehicleTypeId: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ vehicleType: text }, { vehicleTypeId: "" });
                        }}
                    />
                </div> */}
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
                <div className="form-group">
                    <AutoComplete
                        label="Billing Period"
                        placeHolder="Select Billing Period"
                        value={filterValues.billingPeriod ? {
                            label: filterValues.billingPeriod,
                            value: filterParams.billingPeriod
                        } : undefined}
                        options={billingPeriodOptions}
                        onChange={(value: OptionType) => {
                            setValues({ billingPeriod: value.label }, { billType: value.value })
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{fromDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={fromDatePlaceholder}
                        hiddenLabel
                        helperText={error.fromDate}
                        format={displayDateFormatter}
                        // maxDate={filterParams.orderCreatedAtToTime}
                        value={filterParams.fromDate || null}
                        onChange={(date: any) => {
                            setValues({ freightOrderStartDate: convertDateFormat(date, displayDateFormatter) }, { fromDate: convertDateToServerFromDate(date) });
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{toDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={toDatePlaceholder}
                        hiddenLabel
                        helperText={error.toDate}
                        format={displayDateFormatter}
                        value={filterParams.toDate || null}
                        // minDate={filterParams.orderCreatedAtFromTime}
                        onChange={(date: any) => {
                            setValues({ freightOrderEndDate: convertDateFormat(date, displayDateFormatter) }, { toDate: convertDateToServerToDate(date) });
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
        if (!isFilterNullValue(filterValues.laneName) && isNullValue(filterParams.laneCode)) {
            setError({ lane: errorLane });
            return;
        }
        if (!isFilterNullValue(filterValues.partnerName) && isNullValue(filterParams.partnerCode)) {
            setError({ partner: errorTransporter });
            return;
        } else if (!isFilterNullValue(filterValues.fromDate) && isNullValue(filterParams.fromDate)) {
            setError({ fromDate: fromDateError });
            return;
        } else if (!isFilterNullValue(filterValues.toDate) && isNullValue(filterParams.toDate)) {
            setError({ toDate: toDateError });
            return;
        } 
        // else if (!isFilterNullValue(filterValues.isAssigned) && isNullValue(filterParams.isAssigned)) {
        //     setError({ isAssigned: "Select valid vehicle type" });
        //     return;
        // }

        if (!isObjectEmpty(filterParams)) {
            if (isFilterChanged) {
                setError({});
                onApplyFilter(filterValues, filterParams);
            } else {
                setError({});
                onClose();
            }

        } else {
            setError({ partner: errorTransporter });
        }
    }

    function getPartnerList(text: string) {
        appDispatch(searchClientPartner({ query: text })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteList(response, "partnerName", "partnerCode"))
            }
        });
    }

    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                setLaneList(setAutoCompleteList(response, "laneName", "laneCode"))
            }
        });
    }

    // function getVehicleType(text: string) {
    //     appDispatch(searchVehicleList({ query: text })).then((response: any) => {
    //         console.log({response});
    //         if (response && response.vehicles) {
    //             setVehicleTypelist(setAutoCompleteList(response.vehicles, "vehicleType", "vehicleTypeId"))
    //         }
    //     });
    // }
}

export default FreightReconciliationFilters;

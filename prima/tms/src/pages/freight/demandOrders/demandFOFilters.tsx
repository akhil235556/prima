import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { doOrderStatusList, freightTypeList, listDispatch } from "../../../base/constant/ArrayList";
import { convertDateFormat, convertDateToServerFromDate, convertDateToServerToDate, displayDateFormatter } from '../../../base/utility/DateUtils';
import { isFilterNullValue, isNullValue, isObjectEmpty } from '../../../base/utility/StringUtils';
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from "../../../component/widgets/EditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList } from "../../../moduleUtility/DataUtils";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";
import {
    errorTransporter, errorVehicleNumber,
    fromDateError, fromDateLabel, fromDatePlaceholder, toDateError, toDateLabel, toDatePlaceholder, transporterLabel, transporterPlaceHolder
} from './base/demandOrderMessageUtils';

interface DemandFOFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
    isListingPage?: boolean
    addQuickSearch?: boolean
}

function DemandFOFilters(props: DemandFOFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips, isListingPage, addQuickSearch } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    //const [vehicleSuggestion, setVehicleSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined);
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
                    <EditText
                        label="Order Code"
                        placeholder="Enter Order Code"
                        error={error.query}
                        value={filterValues.query}
                        maxLength={50}
                        onChange={(text: string) => {
                            setValues({ query: text }, { query: text })
                        }}
                    />
                </div>
                {/* <div className="form-group">
                    <EditText
                        label="Shipment Reference Id"
                        placeholder="Enter Shipment Reference Id"
                        value={filterValues.shipmentRefId}
                        maxLength={50}
                        onChange={(text: string) => {
                            setValues({ shipmentRefId: text }, { shipmentRefId: text })
                        }}
                    />
                </div> */}
                <div className="form-group">
                    <AutoComplete
                        label="Order Status"
                        placeHolder="Select Order Status"
                        value={filterValues.orderStatusName ? {
                            label: filterValues.orderStatusName,
                            value: filterParams.orderStatusCode
                        } : undefined}
                        options={doOrderStatusList}
                        onChange={(value: OptionType) => {
                            setValues({ orderStatusName: value.label }, { orderStatusCode: value.value })
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Freight Type"
                        placeHolder="Select Freight Type"
                        value={filterValues.freightTypeName ? {
                            label: filterValues.freightTypeName,
                            value: filterParams.freightTypeCode
                        } : undefined}
                        options={freightTypeList}
                        onChange={(value: OptionType) => {
                            setValues({ freightTypeName: value.label }, { freightTypeCode: value.value })
                        }}
                    />
                </div>
                {/* <div className="form-group">
                    <AutoSuggest
                        label="Vehicle Number"
                        placeHolder="Enter Vehicle Number"
                        value={filterValues.vehicleNumber}
                        error={error.vehicleNumber}
                        suggestions={vehicleSuggestion}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getVehicleList(value);
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ vehicleNumber: element.label }, { vehicleRegistrationNumber: element.label });
                        }}
                        onChange={(text: string) => {
                            setValues({ vehicleNumber: text }, { vehicleRegistrationNumber: "" });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label={assignedVehicleLabel}
                        placeHolder={`Select ${assignedVehicleLabel}`}
                        value={filterValues.isVehicleAssignedStatus ? {
                            label: filterValues.isVehicleAssignedStatus,
                            value: filterParams.isVehicleAssigned
                        } : undefined}
                        options={vehicleAssignedStatusList}
                        onChange={(value: OptionType) => {
                            setValues({ isVehicleAssignedStatus: value.label }, { isVehicleAssigned: value.value })
                        }}
                    />
                </div> */}
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
                    <label className="picker-label">{fromDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={fromDatePlaceholder}
                        hiddenLabel
                        helperText={error.orderCreatedAtFromTime}
                        format={displayDateFormatter}
                        maxDate={(filterParams.orderCreatedAtToTime) || new Date()}
                        value={filterParams.orderCreatedAtFromTime || null}
                        onChange={(date: any) => {
                            setValues({ dispatchOrderCreatedAtFromTime: convertDateFormat(date, displayDateFormatter) }, { orderCreatedAtFromTime: convertDateToServerFromDate(date) });
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{toDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={toDatePlaceholder}
                        hiddenLabel
                        helperText={error.orderCreatedAtToTime}
                        format={displayDateFormatter}
                        value={filterParams.orderCreatedAtToTime || null}
                        minDate={(filterParams.orderCreatedAtFromTime) || ""}
                        onChange={(date: any) => {
                            setValues({ dispatchOrderCreatedAtToTime: convertDateFormat(date, displayDateFormatter) }, { orderCreatedAtToTime: convertDateToServerToDate(date) });

                        }}
                    />
                </div>
                {addQuickSearch &&
                    <>
                        <div className="form-group">
                            <AutoComplete
                                label="Field"
                                placeHolder="Select Field"
                                error={error.queryField}
                                value={filterValues.queryFieldLabel ? {
                                    label: filterValues.queryFieldLabel,
                                    value: filterParams.queryField
                                } : undefined}
                                options={listDispatch}
                                onChange={(value: OptionType) => {
                                    setValues({ queryFieldLabel: value.label }, { queryField: value.value });
                                    setError({})
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <EditText
                                placeholder="Search"
                                label="Search"
                                value={filterValues && filterValues.query}
                                maxLength={50}
                                error={error.query}
                                onChange={(text: any) => {
                                    setValues({ query: text }, { query: text });
                                    setError({})
                                }}
                            />
                        </div>
                    </>
                }
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
        if (isListingPage && !isFilterNullValue(filterValues.query) && isNullValue(filterParams.query)) {
            setError({ query: "Enter valid order code" });
            return;
        } else if (isListingPage && !isFilterNullValue(filterValues.statusCode) && isNullValue(filterParams.statusCode)) {
            setError({ statusCode: "Select valid order status" });
            return;
        } else if (!isFilterNullValue(filterValues.vehicleNumber) && isNullValue(filterParams.vehicleRegistrationNumber)) {
            setError({ vehicleNumber: errorVehicleNumber });
            return;
        } else if (!isFilterNullValue(filterValues.partnerName) && isNullValue(filterParams.partnerCode)) {
            setError({ partner: errorTransporter });
            return;
        } else if (isNullValue(filterParams.orderCreatedAtFromTime) && !isNullValue(filterParams.orderCreatedAtToTime)) {
            setError({ orderCreatedAtFromTime: fromDateError });
            return;
        } else if (isNullValue(filterParams.orderCreatedAtToTime) && !isNullValue(filterParams.orderCreatedAtFromTime)) {
            setError({ orderCreatedAtToTime: toDateError });
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
            setError({ query: "Enter valid order code" });
        }
    }

    function getPartnerList(text: string) {
        appDispatch(searchClientPartner({ query: text })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteList(response, "partnerName", "partnerCode"))
            }
        });
    }

    // function getVehicleList(text: string) {
    //     appDispatch(searchVehicleList({ query: text })).then((response: any) => {
    //         if (response) {
    //             setVehicleSuggestion(setAutoCompleteListWithData(response.vehicles, "vehicleNumber", "vehicleCode"))
    //         }
    //     });
    // }

}

export default DemandFOFilters;
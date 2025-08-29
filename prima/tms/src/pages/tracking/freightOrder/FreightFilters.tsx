import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { freightTypeList, list, orderStatusList } from "../../../base/constant/ArrayList";
import { errorConsigneeName, errorDestination, errorOrigin, fromDateError, toDateError, vehicleTypeLabel, vehicleTypePlaceholder } from '../../../base/constant/MessageUtils';
import { convertDateFormat, convertDateToServerFromDate, convertDateToServerToDate, displayDateFormatter } from "../../../base/utility/DateUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from '../../../component/widgets/AutoSuggest';
import EditText from "../../../component/widgets/EditText";
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import {
    setAutoCompleteListWithData
} from '../../../moduleUtility/DataUtils';
import { searchCustomer } from "../../../serviceActions/ConsigneeServiceActions";
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";
import { getAllVehicleTypeList } from "../../../serviceActions/VehicleTypeServiceActions";

interface FreightFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any,
    filerChips: any,
    filerParams: any,
    addQuickSearch?: boolean,
}

function FreightFilters(props: FreightFiltersProps) {
    const { open, onClose, onApplyFilter, filerChips, filerParams, addQuickSearch } = props;
    const appDispatch = useDispatch();
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const [error, setError] = React.useState<any>({});
    const vehicleTypeList = useSelector((state: any) =>
        state.appReducer.vehicleTypeList, shallowEqual
    );
    const [originSuggestion, setOriginSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [destinationSuggestion, setDestinationSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [consigneeList, setConsigneeList] = React.useState<Array<OptionType> | undefined>(undefined);

    useEffect(() => {
        if (open) {
            setFilterValues(filerChips);
            setFilterParams(filerParams);
            setIsFilterChanged(false);
        }
        // eslint-disable-next-line
    }, [open]);

    useEffect(() => {
        const getList = async () => {
            appDispatch(getAllVehicleTypeList())
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <FilterContainer
            open={open}
            onClose={() => {
                setError({});
                onClose();
            }}
            onApply={() => {
                onApply();
            }}
            onClear={() => {
                setError({});
                onClear();
            }}
        >
            <div className="filter-form-row">

                <div className="form-group">
                    <AutoComplete
                        label="Status"
                        placeHolder="Select Status"
                        value={filterValues.shipmentStatusLabel ? {
                            label: filterValues.shipmentStatusLabel,
                            value: filterParams.shipmentStatusCode
                        } : undefined}
                        options={orderStatusList}
                        onChange={(value: OptionType) => {
                            setValues({ shipmentStatusLabel: value.label }, { shipmentStatusCode: value.value })
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoSuggest
                        label="Origin"
                        placeHolder="Enter Origin Name"
                        value={(filterValues.originName) || null}
                        error={error.originName}
                        suggestions={originSuggestion}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getSuggestionList(value, "origin");
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ originName: element.label }, { originLocationCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ originName: text }, { originLocationCode: "" });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoSuggest
                        label="Destination"
                        placeHolder="Enter Destination Name"
                        value={(filterValues.destinationName) || null}
                        error={error.destinationName}
                        suggestions={destinationSuggestion}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getSuggestionList(value, "destination");
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ destinationName: element.label }, { destinationLocationCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ destinationName: text }, { destinationLocationCode: "" });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoSuggest
                        label="Consignee Name"
                        placeHolder="Enter Consignee name"
                        error={error.consigneeName}
                        suggestions={consigneeList}
                        value={filterValues.consigneeName}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                appDispatch(searchCustomer({ queryField: "customer.name", query: value })).then((response: any) => {
                                    response && setConsigneeList(setAutoCompleteListWithData(response, "customerName", "customerCode"));
                                })
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ consigneeName: element.label }, { consigneeCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ consigneeName: text }, { consigneeCode: "" });
                        }}
                    />
                </div>

                <div className="form-group">
                    <AutoComplete
                        label="Freight Type"
                        placeHolder="Freight Type"
                        value={filterValues.freightTypeName ? {
                            label: filterValues.freightTypeName,
                            value: filterParams.freightTypeCode
                        } : undefined}
                        options={freightTypeList}
                        error={error.freightTypeCode}
                        onChange={(value: any) => {
                            setValues({ freightTypeName: value.label }, { freightTypeCode: value.value })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label={vehicleTypeLabel}
                        placeHolder={vehicleTypePlaceholder}
                        value={filterValues.vehicleTypeName ? {
                            label: filterValues.vehicleTypeName,
                            value: filterParams.code,
                        } : undefined}
                        error={error.vehicleType}
                        options={setAutoCompleteListWithData(vehicleTypeList, "type", "code")}
                        onChange={(element: OptionType) => {
                            setValues({ vehicleTypeName: element.label }, { vehicleTypeCode: element.value });
                        }}
                    />
                </div>

                <div className="form-group date-picker-wrap">
                    <label className="picker-label">{"Shipment Created From"}</label>
                    <DatePicker
                        clearable
                        className="custom-date-picker"
                        hiddenLabel
                        placeholder="Shipment Created From"
                        disableFuture
                        helperText={error.fromDate}
                        maxDate={(filterParams.toDate) || new Date()}
                        format={displayDateFormatter}
                        value={(filterParams && filterParams.shipmentCreatedAtFromTime) || null}
                        onChange={(date: any) => {
                            setValues({ fromDate: convertDateFormat(date, displayDateFormatter) }, { shipmentCreatedAtFromTime: convertDateToServerFromDate(date), shipmentCreatedAtToTime: null });
                        }}
                    />
                </div>
                <div className="form-group date-picker-wrap">
                    <label className="picker-label">{"Shipment Created To"}</label>
                    <DatePicker
                        clearable
                        className="custom-date-picker"
                        hiddenLabel
                        placeholder="Shipment Created To"
                        disableFuture
                        helperText={error.toDate}
                        minDate={(filterParams.fromDate) || ""}
                        format={displayDateFormatter}
                        value={(filterParams && filterParams.shipmentCreatedAtToTime) || null}
                        onChange={(date: any) => {
                            setValues({ toDate: convertDateFormat(date, displayDateFormatter) }, { shipmentCreatedAtToTime: convertDateToServerToDate(date) });
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
                                options={list}
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

    function onApply() {
        if (!isFilterNullValue(filterValues.originName) && isNullValue(filterParams.originLocationCode)) {
            setError({ originName: errorOrigin });
            return;
        } else if (!isFilterNullValue(filterValues.destinationName) && isNullValue(filterParams.destinationLocationCode)) {
            setError({ destinationName: errorDestination });
            return;
        } else if (!isFilterNullValue(filterValues.consigneeName) && isNullValue(filterParams.consigneeCode)) {
            setError({ consigneeName: errorConsigneeName });
            return;
        }
        else if (isNullValue(filterParams.shipmentCreatedAtFromTime) && !isNullValue(filterParams.shipmentCreatedAtToTime)) {
            setError({ fromDate: fromDateError });
            return;
        } else if (isNullValue(filterParams.shipmentCreatedAtToTime) && !isNullValue(filterParams.shipmentCreatedAtFromTime)) {
            setError({ toDate: toDateError });
            return;
        }
        if (addQuickSearch) {
            if (isNullValue(filterValues.query) && !isNullValue(filterParams.queryField)) {
                setError({ query: "Enter " + filterValues.queryFieldLabel });
                return;
            } else if (!isNullValue(filterValues.query) && isNullValue(filterParams.queryField)) {
                setError({ queryField: "Select Field" });
                return;
            }
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
            setError({ originName: errorOrigin });
        }

    }

    function onClear() {
        setFilterValues({});
        setFilterParams({});
        setError({});
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
}

export default FreightFilters;
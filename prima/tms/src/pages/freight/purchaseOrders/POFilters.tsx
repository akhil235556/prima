import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { poOptions } from "../../../base/constant/ArrayList";
import { errorConsigneeName, fromDateError, fromDateLabel, fromDatePlaceholder, toDateError, toDateLabel } from "../../../base/constant/MessageUtils";
import { convertDateFormat, convertDateToServerFromDate, convertDateToServerToDate, displayDateFormatter } from "../../../base/utility/DateUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from "../../../component/widgets/NumberEditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchCustomer } from '../../../serviceActions/ConsigneeServiceActions';
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";
import { searchProductList } from "../../../serviceActions/ProductServiceActions";
import { blockPlaceholder, blockTitle, districtPlaceholder, districtTitle, maxDistanceLabel, maxDistancePlaceholder, minDistanceLabel, minDistancePlaceholder, zonePlaceholder, zoneTitle } from "./base/purchaseOrderMessageUtils";

interface POFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
    addQuickSearch?: boolean
}

function POFilters(props: POFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips, addQuickSearch } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false)
    const [destinationSuggestion, setDestinationSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [productList, setProductList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [consigneeList, setConsigneeList] = React.useState<Array<OptionType> | undefined>(undefined);

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
                        label={"Product Name"}
                        placeHolder={"Enter Product Name"}
                        value={filterValues.productName}
                        error={error.productName}
                        suggestions={productList}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getProductList(value);
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ productName: element.label, productSKU: element.data.sku }, { productCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ productName: text }, { productCode: "" });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoSuggest
                        label={"Product SKU"}
                        placeHolder={"Enter Product SKU"}
                        value={filterValues.productSKU}
                        error={error.productSKU}
                        suggestions={productList}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getProductListWithSKU(value);
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ productSKU: element.label, productName: element.data.name }, { productCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ productSKU: text }, { productCode: "" });
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
                    <EditText
                        label={zoneTitle}
                        placeholder={zonePlaceholder}
                        value={filterValues && filterValues.zone}
                        error={error.zone}
                        maxLength={30}
                        onChange={(text: any) => {
                            setValues({ zone: text }, { zone: text })
                        }}
                    />
                </div>
                <div className="form-group">
                    <EditText
                        label={districtTitle}
                        placeholder={districtPlaceholder}
                        value={filterValues && filterValues.district}
                        maxLength={30}
                        onChange={(text: any) => {
                            setValues({ district: text }, { district: text })
                        }}
                    />
                </div>
                <div className="form-group">
                    <EditText
                        label={blockTitle}
                        placeholder={blockPlaceholder}
                        value={filterValues && filterValues.block}
                        maxLength={30}
                        onChange={(text: any) => {
                            setValues({ block: text }, { block: text })
                        }}
                    />
                </div>
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
                    <NumberEditText
                        label={minDistanceLabel}
                        placeholder={minDistancePlaceholder}
                        maxLength={6}
                        decimalScale={2}
                        allowNegative={false}
                        error={error.distanceMin}
                        value={filterValues && filterValues.distanceMin}
                        onChange={(text: any) => {
                            setValues({ distanceMin: parseFloat(text) }, { distanceMin: text })
                        }}
                    />
                </div>
                <div className="form-group">
                    <NumberEditText
                        label={maxDistanceLabel}
                        placeholder={maxDistancePlaceholder}
                        maxLength={6}
                        decimalScale={2}
                        allowNegative={false}
                        error={error.distanceMax}
                        value={filterValues && filterValues.distanceMax}
                        onChange={(text: any) => {
                            setValues({ distanceMax: parseFloat(text) }, { distanceMax: text })
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{fromDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={fromDatePlaceholder}
                        hiddenLabel
                        helperText={error.fromDateTime}
                        maxDate={filterParams.toDateTime}
                        format={displayDateFormatter}
                        value={filterParams.fromDateTime || null}
                        onChange={(date: any) => {
                            setValues({ fromDate: convertDateFormat(date, displayDateFormatter) }, { fromDateTime: convertDateToServerFromDate(date) });
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{toDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={toDateLabel}
                        hiddenLabel
                        helperText={error.toDateTime}
                        minDate={filterParams.fromDateTime}
                        format={displayDateFormatter}
                        value={filterParams.toDateTime || null}
                        onChange={(date: any) => {
                            setValues({ toDate: convertDateFormat(date, displayDateFormatter) }, { toDateTime: convertDateToServerToDate(date) });
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
                                options={poOptions}
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
        if (!isFilterNullValue(filterValues.productName) && isNullValue(filterParams.productCode)) {
            setError({ productName: "Enter valid product name" });
            return;
        }
        if (!isFilterNullValue(filterValues.productSKU) && isNullValue(filterParams.productCode)) {
            setError({ productSKU: "Enter valid product SKU" });
            return;
        }
        if (!isFilterNullValue(filterValues.consigneeName) && isNullValue(filterParams.consigneeCode)) {
            setError({ consigneeName: errorConsigneeName });
            return;
        }
        if (filterValues.distanceMax <= filterValues.distanceMin) {
            setError({
                distanceMin: "Minimum Distance should be lesser than Maximum Distance"
            });
            return;
        }

        if (!isFilterNullValue(filterValues.locationName) && isNullValue(filterParams.locationCode)) {
            setError({ locationName: "Select valid location" });
            return;
        }

        if (isNullValue(filterParams.fromDateTime) && !isNullValue(filterParams.toDateTime)) {
            setError({ fromDateTime: fromDateError });
            return;
        } else if (isNullValue(filterParams.toDateTime) && !isNullValue(filterParams.fromDateTime)) {
            setError({ toDateTime: toDateError });
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
            setError({ productName: "Enter valid product name" });
        }
    }

    function getSuggestionList(text: string) {
        appDispatch(searchLocationList({ query: text })).then((response: any) => {
            if (response) {
                setDestinationSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
            }
        })
    };


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
    function getProductList(text: string) {
        appDispatch(searchProductList({ query: text, queryField: "name" })).then((response: any) => {
            if (response) {
                response && response.results && setProductList(setAutoCompleteListWithData(response.results, "name", "sku"))
            }
        });
    }

    function getProductListWithSKU(text: string) {
        appDispatch(searchProductList({ query: text, queryField: "sku" })).then((response: any) => {
            if (response) {
                response && response.results && setProductList(setAutoCompleteListWithData(response.results, "sku", "sku"))
            }
        });
    }
}

export default POFilters;
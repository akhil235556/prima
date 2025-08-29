import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { demandFilterOptions, demandOrderStatusTabValue, doFilterOptions, SourceOrderCodeList } from "../../../base/constant/ArrayList";
import { errorConsigneeName } from '../../../base/constant/MessageUtils';
import { convertDateFormat, convertDateToServerFromDate, convertDateToServerToDate, displayDateFormatter } from "../../../base/utility/DateUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from "../../../component/widgets/EditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { searchCustomer } from '../../../serviceActions/ConsigneeServiceActions';
import { searchLocationList } from '../../../serviceActions/LocationServiceActions';
import { searchProductList } from '../../../serviceActions/ProductServiceActions';
import { customerLabel, customerPlaceholder, fromDateError, fromDateLabel, fromDatePlaceholder, sourceNumberLabel, sourceNumberPlaceholder, sourceOrderTypeLabel, sourceOrderTypePlaceholder, toDateError, toDateLabel } from "./base/demandOrderMessageUtils";

interface demandOrderFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
    addQuickSearch?: boolean,
    tabValue?: any,
}

function DemandOrderFilters(props: demandOrderFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips, addQuickSearch, tabValue } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false)
    const [productList, setProductList] = React.useState<Array<OptionType> | undefined>(undefined);
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
                {
                    (tabValue === demandOrderStatusTabValue[0] || tabValue === demandOrderStatusTabValue[1]) &&
                    <>
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
                    </>
                }
                <div className="form-group">
                    <EditText
                        label={customerLabel}
                        placeholder={customerPlaceholder}
                        value={filterValues && filterValues.vendorName}
                        error={error.vendorName}
                        maxLength={30}
                        onChange={(text: any) => {
                            setValues({ vendorName: text }, { vendorName: text })
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
                <div className="form-group">
                    <EditText
                        label={sourceNumberLabel}
                        placeholder={sourceNumberPlaceholder}
                        value={filterValues && filterValues.sourceNumber}
                        error={error.sourceNumber}
                        maxLength={30}
                        onChange={(text: any) => {
                            // const formattedText = text.replace(/\s+/g, '');
                            setValues({ sourceNumber: text }, { sourceNumber: text })
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label={sourceOrderTypeLabel}
                        placeHolder={sourceOrderTypePlaceholder}
                        error={error.sourceOrderTypeLabel}
                        value={filterValues.sourceType ? {
                            label: filterValues.sourceType,
                            value: filterParams.sourceType
                        } : undefined}
                        options={SourceOrderCodeList}
                        onChange={(element: any) => {
                            setValues({ sourceType: element.value }, { sourceType: element.value })
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
                                options={(tabValue === demandOrderStatusTabValue[0] || tabValue === demandOrderStatusTabValue[1]) ? doFilterOptions : demandFilterOptions}
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
        else if (!isFilterNullValue(filterValues.productSKU) && isNullValue(filterParams.productCode)) {
            setError({ productSKU: "Enter valid product SKU" });
            return;
        }
        else if (!isFilterNullValue(filterValues.consigneeName) && isNullValue(filterParams.consigneeCode)) {
            setError({ consigneeName: errorConsigneeName });
            return;
        } else if (!isFilterNullValue(filterValues.locationName) && isNullValue(filterParams.locationCode)) {
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

    function getSuggestionList(text: string) {
        appDispatch(searchLocationList({ query: text })).then((response: any) => {
            if (response) {
                setDestinationSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
            }
        })
    };
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

export default DemandOrderFilters;
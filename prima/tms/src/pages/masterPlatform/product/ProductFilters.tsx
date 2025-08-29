import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { productTypeOptions } from "../../../base/constant/ArrayList";
import { productTypeLabel, productTypePlaceholder } from "../../../base/constant/MessageUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList } from "../../../moduleUtility/DataUtils";
import { searchProductList } from "../../../serviceActions/ProductServiceActions";

interface VehicleFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any,
    filerChips: any,
    filerParams: any,
}

function VehicleFilters(props: VehicleFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const [productList, setProductList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [productListSKU, setProductListSKU] = React.useState<Array<OptionType> | undefined>(undefined);


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
                        label={"Product Search"}
                        placeHolder={"Enter Product Name"}
                        value={filterValues.name}
                        error={error.name}
                        suggestions={productList}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getProductList(value, "name");
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ name: element.label }, { name: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ name: text }, { name: "" });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoSuggest
                        label={"Product SKU"}
                        placeHolder={"Enter Product SKU"}
                        value={filterValues.sku}
                        error={error.sku}
                        suggestions={productListSKU}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getProductListSKU(value, "sku");
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ sku: element.label }, { sku: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ sku: text }, { sku: "" });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label={productTypeLabel}
                        placeHolder={productTypePlaceholder}
                        error={error.productTypeId}
                        value={filterValues.productTypeLabel ? {
                            label: filterValues.productTypeLabel,
                            value: filterParams.productTypeCode
                        } : undefined}
                        options={productTypeOptions}
                        onChange={(value: OptionType) => {
                            setValues({ productTypeLabel: value.label }, { productTypeCode: value.value })
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
        params && setIsFilterChanged(true);
    }
    function onApply() {

        if (!isFilterNullValue(filterValues.name) && isNullValue(filterParams.name)) {
            setError({ name: "Enter valid product name" });
            return;
        }
        if (!isFilterNullValue(filterValues.sku) && isNullValue(filterParams.sku)) {
            setError({ sku: "Enter valid product SKU" });
            return;
        }
        if (!isObjectEmpty(filterParams)) {
            if (isFilterChanged) {
                setError({});
                onApplyFilter(filterValues, filterParams);
            }
        } else {
            setError({ name: "Enter valid product name or SKU" });
        }
    }

    function getProductList(text: string, queryField: string) {
        appDispatch(searchProductList({ query: text, queryField: queryField })).then((response: any) => {
            if (response) {
                response && response.results && setProductList(setAutoCompleteList(response.results, "name", "name"));
            }
        });
    }
    function getProductListSKU(text: string, queryField: string) {
        appDispatch(searchProductList({ query: text, queryField: queryField })).then((response: any) => {
            if (response) {
                response && response.results && setProductListSKU(setAutoCompleteList(response.results, "sku", "sku"))
            }
        });
    }
}

export default VehicleFilters;

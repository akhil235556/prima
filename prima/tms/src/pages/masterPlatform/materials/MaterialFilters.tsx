import React, { useEffect } from "react";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { articleError } from "../../../base/constant/MessageUtils";
import { isObjectEmpty, isFilterNullValue, isNullValue } from "../../../base/utility/StringUtils";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { searchMaterialList } from "../../../serviceActions/MaterialServiceActions";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { useDispatch } from "react-redux";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";

interface MaterialFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function MaterialFilters(props: MaterialFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [articleList, setArticleList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false)
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
                        label="Material name"
                        placeHolder="Enter Material name"
                        suggestions={articleList}
                        error={error.articleError}
                        value={filterValues.name}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                appDispatch(searchMaterialList({ query: value })).then((response: any) => {
                                    response && response.materials && setArticleList(setAutoCompleteListWithData(response.materials, "name", "code"));
                                })
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ name: element.label }, { code: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ name: text }, { code: "" });
                        }}
                    />
                </div>
            </div>
        </FilterContainer>
    );

    function onApply() {
        if (!isFilterNullValue(filterValues.name) && isNullValue(filterParams.code)) {
            setError({ articleError: articleError });
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
            setError({ articleError: articleError });
        }
    }


    function setValues(chips: any, params?: any) {
        setFilterValues({
            ...filterValues,
            ...chips
        });
        setError({});
        params ? setFilterParams({
            ...filterParams,
            ...params
        }) : setFilterParams({});
        setIsFilterChanged(true);
    }
}

export default MaterialFilters;

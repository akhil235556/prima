import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { transporterLabel, transporterPlaceHolder } from "../../../base/constant/MessageUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from '../../../base/utility/StringUtils';
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList } from "../../../moduleUtility/DataUtils";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";

interface PartnerFilterProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function PartnerFilter(props: PartnerFilterProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined)
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
            </div>
        </FilterContainer>
    );

    function onApply() {
        if (!isFilterNullValue(filterValues.partnerName) && isNullValue(filterParams.partnerCode)) {
            setError({ partner: "Enter valid transporter" });
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
            setError({ partner: "Enter valid transporter" });
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


    function getPartnerList(text: string) {
        appDispatch(searchClientPartner({ query: text })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteList(response, "partnerName", "partnerCode"))
            }
        });
    }
}

export default PartnerFilter;

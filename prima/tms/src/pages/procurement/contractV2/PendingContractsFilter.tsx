import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { freightTypeList, serviceabilityModeTypeList } from "../../../base/constant/ArrayList";
import { errorTransporter, transporterLabel, transporterPlaceHolder } from "../../../base/constant/MessageUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList } from "../../../moduleUtility/DataUtils";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";

interface PendingContractsFilterProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}
function PendingContractsFilter(props: PendingContractsFilterProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined)
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const [error, setError] = React.useState<any>({});

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
                        value={filterValues.freightTypeCode ? {
                            label: filterValues.freightTypeCode,
                            value: filterParams.freightTypeCode
                        } : undefined}
                        options={freightTypeList}
                        onChange={(value: OptionType) => {
                            setValues({ freightTypeCode: value.label }, { contractType: value.value })
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Transportation Mode"
                        placeHolder="Select Mode"
                        value={filterValues.serviceabilityModeName ? {
                            label: filterValues.serviceabilityModeName,
                            value: filterParams.serviceabilityModeCode
                        } : undefined}
                        options={serviceabilityModeTypeList}
                        onChange={(value: OptionType) => {
                            setValues({ serviceabilityModeName: value.label }, { serviceabilityModeCode: value.value })
                        }}
                    />
                </div>


            </div>
        </FilterContainer>
    );

    function getPartnerList(text: string) {
        appDispatch(searchClientPartner({ query: text })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteList(response, "partnerName", "partnerCode"))
            }
        });
    }

    function onApply() {
        if (!isFilterNullValue(filterValues.partnerName) && isNullValue(filterParams.partnerCode)) {
            setError({ partner: errorTransporter });
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
            setError({ partner: errorTransporter });
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

    function closeModal() {
        setError({});
        onClose();
    }

}
export default PendingContractsFilter;
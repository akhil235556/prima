import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { errorOrigin, errorTransporter, transporterLabel, transporterPlaceHolder, zoneCodeLabel, zoneCodePlaceholder, zoneNameLabel, zoneNamePlaceholder } from "../../../base/constant/MessageUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from "../../../component/widgets/EditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListFromObject, setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchLanePartner } from "../../../serviceActions/LaneServiceActions";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";

interface ZoneFilterProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function ZoneFilters(props: ZoneFilterProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false)
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined);

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
                    <EditText
                        label={zoneNameLabel}
                        placeholder={zoneNamePlaceholder}
                        value={filterValues && filterValues.zoneName}
                        maxLength={30}
                        onChange={(text: any) => {
                            setValues({ zoneName: text }, { zoneName: text })
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoSuggest
                        label={transporterLabel}
                        placeHolder={transporterPlaceHolder}
                        error={error.partnerName}
                        value={filterValues && filterValues.partnerName}
                        suggestions={partnerList}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getPartnerList(value, "PTL");
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
                    <EditText
                        label={zoneCodeLabel}
                        placeholder={zoneCodePlaceholder}
                        value={filterValues && filterValues.zoneCode}
                        maxLength={30}
                        onChange={(text: any) => {
                            setValues({ zoneCode: text }, { zoneCode: text })
                        }}
                    />
                </div>

            </div>
        </FilterContainer>
    );

    function onApply() {
        if (!isFilterNullValue(filterValues.partnerName) && isNullValue(filterParams.partnerCode)) {
            setError({ partnerName: errorTransporter });
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
            setError({ originLocationName: errorOrigin });
        }
    }

    function setValues(chips: any, params?: any) {
        setFilterValues({
            ...filterValues,
            ...chips
        });
        setError({});
        setFilterParams({
            ...filterParams,
            ...params
        });
        setIsFilterChanged(true);
    }

    function getPartnerList(text: string, type?: string) {
        if (!type) {
            appDispatch(searchLanePartner({ laneCode: text })).then((response: any) => {
                if (response) {
                    setPartnerList(setAutoCompleteListFromObject(response.partnerDetails, "partner", "name", "code"))
                }
            });
        } else {
            appDispatch(searchClientPartner({ query: text })).then((response: any) => {
                if (response) {
                    setPartnerList(setAutoCompleteListWithData(response, "partnerName", "partnerCode"))
                }
            });
        }

    }
}

export default ZoneFilters;

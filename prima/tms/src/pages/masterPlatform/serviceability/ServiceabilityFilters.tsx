import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { contractModeType, freightTypeList, ptlModeTypeList, serviceabilityModeTypeList } from "../../../base/constant/ArrayList";
import { destinationLabel, enterDestinationPlaceHolder, enterOriginPlaceHolder, errorLane, laneLabel, lanePlaceholder, originLabel, serviceabilityPlaceholder, serviceabilityType, zoneTitle } from "../../../base/constant/MessageUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from '../../../base/utility/StringUtils';
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from "../../../component/widgets/EditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList } from "../../../moduleUtility/DataUtils";
import { searchLane } from "../../../serviceActions/LaneServiceActions";

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
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);
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
                        label={laneLabel}
                        placeHolder={lanePlaceholder}
                        value={filterValues.laneName}
                        suggestions={laneList}
                        // isDisabled={isZoneBased()}
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
                        label="Freight Type"
                        placeHolder="Select Freight Type"
                        value={filterValues.freightTypeName ? {
                            label: filterValues.freightTypeName,
                            value: filterParams.freightTypeCode
                        } : undefined}
                        options={freightTypeList}
                        onChange={(value: OptionType) => {
                            setValues(
                                { freightTypeName: value.label, serviceabilityTypeName: undefined, originZoneName: undefined, destinationZoneName: undefined },
                                { freightTypeCode: value.value, serviceabilityType: undefined, originZoneName: undefined, destinationZoneName: undefined }
                            );
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Mode of Transportation"
                        placeHolder="Mode of Transportation"
                        value={filterValues.serviceabilityModeName ? {
                            label: filterValues.serviceabilityModeName,
                            value: filterParams.serviceabilityModeCode
                        } : undefined}
                        options={serviceabilityModeTypeList}
                        onChange={(element: any) => {
                            setValues({ serviceabilityModeName: element.label }, { serviceabilityModeCode: element.value });
                        }}
                    />
                </div>

                <div className="form-group">
                    <AutoComplete
                        label={serviceabilityType}
                        placeHolder={serviceabilityPlaceholder}
                        value={filterValues.serviceabilityTypeName ? {
                            label: filterValues.serviceabilityTypeName,
                            value: filterParams.serviceabilityType
                        } : undefined}
                        // isDisabled={isFreightTypeFtl()}
                        options={ptlModeTypeList}
                        onChange={(element: OptionType) => {
                            if (element.value === contractModeType.ZONE) {
                                setValues(
                                    { serviceabilityTypeName: element.label, laneName: undefined, originZoneName: undefined, destinationZoneName: undefined },
                                    { serviceabilityType: element.value, laneCode: undefined, originZoneName: undefined, destinationZoneName: undefined }
                                );
                            } else {
                                setValues(
                                    { serviceabilityTypeName: element.label, originZoneName: undefined, destinationZoneName: undefined },
                                    { serviceabilityType: element.value, originZoneName: undefined, destinationZoneName: undefined }
                                );
                            }
                        }}
                    />
                </div>

                <div className="form-group">
                    <EditText
                        label={`${originLabel} ${zoneTitle}`}
                        placeholder={enterOriginPlaceHolder}
                        // disabled={!isZoneBased() || isFreightTypeFtl()}
                        value={filterValues && filterValues.originZoneName}
                        error={error.originZoneName}
                        maxLength={30}
                        onChange={(text: string) => {
                            setValues({ originZoneName: text }, { originZoneName: text })
                        }}
                    />
                </div>

                <div className="form-group">
                    <EditText
                        label={`${destinationLabel} ${zoneTitle}`}
                        placeholder={enterDestinationPlaceHolder}
                        // disabled={!isZoneBased() || isFreightTypeFtl()}
                        value={filterValues && filterValues.destinationZoneName}
                        error={error.destinationZoneName}
                        maxLength={30}
                        onChange={(text: string) => {
                            setValues({ destinationZoneName: text }, { destinationZoneName: text })
                        }}
                    />
                </div>
            </div>
        </FilterContainer>
    );

    // function isZoneBased() {
    //     return filterParams?.serviceabilityType === contractModeType.ZONE
    // }

    // function isFreightTypeFtl() {
    //     return filterParams.freightTypeCode === FreightType.FTL
    // }

    function onApply() {
        if (!isFilterNullValue(filterValues.laneName) && isNullValue(filterParams.laneCode)) {
            setError({ lane: errorLane });
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
            setError({ lane: errorLane });
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


    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                setLaneList(setAutoCompleteList(response, "laneName", "laneCode"))
            }
        });
    }
}

export default PartnerFilter;

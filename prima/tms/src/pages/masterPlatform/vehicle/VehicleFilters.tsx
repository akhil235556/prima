import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { vehicleSourceTypeList, vehicleStatus } from "../../../base/constant/ArrayList";
import { errorTransporter, transporterLabel, transporterPlaceHolder, vehicleNumberLabel, vehicleNumberPlaceHolder, vehicleTypeLabel, vehicleTypePlaceholder } from "../../../base/constant/MessageUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList, setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";
import { searchVehicleList } from "../../../serviceActions/VehicleServiceActions";
import { getAllVehicleTypeList } from '../../../serviceActions/VehicleTypeServiceActions';

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
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined)
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const [vehicleNumberList, setVehicleNumberList] = React.useState<Array<OptionType> | undefined>(undefined);
    const vehicleTypeList = useSelector((state: any) =>
        state.appReducer.vehicleTypeList, shallowEqual
    );

    useEffect(() => {
        if (open) {
            appDispatch(getAllVehicleTypeList());
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
                        label={vehicleNumberLabel}
                        placeHolder={vehicleNumberPlaceHolder}
                        value={filterValues.vehicleNumber}
                        error={error.vehicleNumber}
                        suggestions={vehicleNumberList}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getVehicleList(value);
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ vehicleNumber: element.label }, { vehicleNumber: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ vehicleNumber: text }, { vehicleNumber: "" });
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Vehicle Status"
                        placeHolder="Select vehicle status"
                        options={vehicleStatus}
                        value={filterValues.isVehicleAssignedStatus ? {
                            label: filterValues.isVehicleAssignedStatus,
                            value: filterValues.isAssigned,
                        } : null}
                        error={error.isAssigned}
                        onChange={(value: OptionType) => {
                            setValues({ isVehicleAssignedStatus: value.label }, { isAssigned: (value.value === "Assigned").toString() });
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group ">
                    <AutoComplete
                        label={vehicleTypeLabel}
                        placeHolder={vehicleTypePlaceholder}
                        error={error.vehicleTypeId}
                        value={filterValues.vehicleTypeLabel ? {
                            label: filterValues.vehicleTypeLabel,
                            value: filterParams.vehicleTypeId,
                        } : null}
                        options={setAutoCompleteListWithData(vehicleTypeList, "type", "id")}
                        onChange={(value: OptionType) => {
                            setValues({ vehicleTypeLabel: value.label }, { vehicleTypeId: value.value });
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Vehicle Source Type"
                        placeHolder="Select Vehicle Source Type"
                        options={vehicleSourceTypeList}
                        value={filterValues.vehicleSourceTypeStatus ? {
                            label: filterValues.vehicleSourceTypeStatus,
                            value: filterValues.isDedicated,
                        } : null}
                        error={error.vehicleSourceTypeStatus}
                        onChange={(value: OptionType) => {
                            setValues({ vehicleSourceTypeStatus: value.label }, { isDedicated: value.value });
                            setError({});
                        }}
                    />
                </div>
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
        if (!isFilterNullValue(filterValues.vehicleNumber) && isNullValue(filterParams.vehicleNumber)) {
            setError({ vehicleNumber: "Select valid vehicle number " });
            return;
        } else if (!isFilterNullValue(filterValues.isAssigned) && isNullValue(filterParams.isAssigned)) {
            setError({ isAssigned: "Select valid vehicle status" });
            return;
        } else if (!isFilterNullValue(filterValues.isAssigned) && isNullValue(filterParams.isAssigned)) {
            setError({ isAssigned: "Select valid vehicle type" });
            return;
        } else if (!isFilterNullValue(filterValues.partnerName) && isNullValue(filterParams.partnerCode)) {
            setError({ partner: errorTransporter });
            return;
        }

        if (!isObjectEmpty(filterParams)) {
            if (isFilterChanged) {
                setError({});
                onApplyFilter(filterValues, filterParams);
            }
        } else {
            setError({ vehicleNumber: "Select valid vehicle number " });
        }
    }

    function getVehicleList(text: string) {
        appDispatch(searchVehicleList({ query: text })).then((response: any) => {
            if (response) {
                setVehicleNumberList(setAutoCompleteList(response.vehicles, "vehicleNumber", "vehicleNumber"))
            }
        });
    }

    function getPartnerList(text: string) {
        appDispatch(searchClientPartner({ query: text })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteList(response, "partnerName", "partnerCode"))
            }
        });
    }
}

export default VehicleFilters;

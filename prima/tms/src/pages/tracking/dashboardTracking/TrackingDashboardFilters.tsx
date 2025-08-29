import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { freightTypeList } from "../../../base/constant/ArrayList";
import { errorTransporter, fromDateError, tatBreachedLabel, toDateError, transporterLabel, transporterPlaceHolder } from "../../../base/constant/MessageUtils";
import { convertDateFormat, displayDateFormatter } from "../../../base/utility/DateUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from '../../../component/widgets/AutoSuggest';
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList, setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";
import { searchVehicleList } from "../../../serviceActions/VehicleServiceActions";
import { getAllVehicleTypeList } from "../../../serviceActions/VehicleTypeServiceActions";

interface VehicleFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any,
    filerChips: any,
    filerParams: any,
}

function TrackingDashboardFilters(props: VehicleFiltersProps) {

    const { open, onClose, onApplyFilter, filerChips, filerParams } = props;
    const appDispatch = useDispatch();
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [originSuggestion, setOriginSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [vehicleSuggestion, setVehicleSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [destinationSuggestion, setDestinationSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const vehicleTypeList = useSelector((state: any) =>
        state.appReducer.vehicleTypeList, shallowEqual
    );
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined);

    const tatBreachedOptions = [{
        value: "true",
        label: "Yes"
    }, {
        value: "false",
        label: "No"
    }]

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
                if (validateData()) {
                    setError({});
                    onApply();
                }
            }}
            onClear={() => {
                setError({});
                onClear();
            }}
        >
            <div className="filter-form-row">
                <div className="form-group">
                    <AutoSuggest
                        label="Origin"
                        placeHolder="Enter Origin Name"
                        value={(filterValues && filterValues.originName) || null}
                        error={error.originName}
                        suggestions={originSuggestion}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getSuggestionList(value, "origin");
                            }
                        }}
                        onSelected={(value: OptionType) => {
                            setValues({ originName: value.label }, { originCode: value.value })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                        onChange={(text: string) => {
                            setValues({ originName: text }, { originCode: "" })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoSuggest
                        label="Destination"
                        placeHolder="Enter Destination Name"
                        value={(filterValues && filterValues.destinationName) || null}
                        error={error.destinationName}
                        suggestions={destinationSuggestion}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getSuggestionList(value, "destination");
                            }
                        }}
                        onSelected={(value: OptionType) => {
                            setValues({ destinationName: value.label }, { destinationCode: value.value })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                        onChange={(text: string) => {
                            setValues({ destinationName: text }, { destinationCode: "" })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Freight Type"
                        placeHolder="Select Freight Type"
                        value={filterValues.freightTypeName ? {
                            label: filterValues.freightTypeName,
                            value: filterParams.freightType
                        } : undefined}
                        options={freightTypeList}
                        onChange={(value: OptionType) => {
                            setValues({ freightTypeName: value.label }, { freightType: value.value })
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
                <div className="form-group">
                    <AutoSuggest
                        label="Vehicle Number"
                        placeHolder="Enter Vehicle Number"
                        value={(filterValues && filterValues.vehicleNumber) || null}
                        error={error.vehicleNumber}
                        suggestions={vehicleSuggestion}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getVehicleList(value);
                            }
                        }}
                        onSelected={(value: OptionType) => {
                            setValues({ vehicleNumber: value.label }, { vehicleCode: value.value })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                        onChange={(text: string) => {
                            setValues({ vehicleNumber: text }, { vehicleCode: "" })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Vehicle Type"
                        placeHolder="Vehicle Type"
                        value={filterValues.vehicleTypeName ? {
                            label: filterValues.vehicleTypeName,
                            value: filterParams.vehicleTypeCode,
                        } : undefined}
                        error={error.vehicleType}
                        options={setAutoCompleteListWithData(vehicleTypeList, "type", "code")}
                        onChange={(element: OptionType) => {
                            setValues({ vehicleTypeName: element.label }, { vehicleTypeCode: element.value });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label={tatBreachedLabel}
                        placeHolder="Select"
                        value={filterValues.isTatBreachedLabel ? {
                            label: filterValues.isTatBreachedLabel,
                            value: filterParams.isTatBreached
                        } : undefined}
                        options={tatBreachedOptions}
                        error={error.freightType}
                        onChange={(value: any) => {
                            setValues({ isTatBreachedLabel: value.label }, { isTatBreached: value.value })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                    />
                </div>
                <div className="form-group date-picker-wrap">
                    <label className="picker-label">{"From Date"}</label>
                    <DatePicker
                        clearable
                        className="custom-date-picker"
                        hiddenLabel
                        placeholder="From Date"
                        disableFuture
                        helperText={error.fromDate}
                        format={displayDateFormatter}
                        value={(filterParams && filterParams.fromDate) || null}
                        onChange={(date: any) => {
                            setValues({ fromDateChip: convertDateFormat(date, displayDateFormatter) }, { fromDate: convertDateFormat(date, "YYYY/MM/DD") })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                    />
                </div>
                <div className="form-group date-picker-wrap">
                    <label className="picker-label">{"To Date"}</label>
                    <DatePicker
                        clearable
                        className="custom-date-picker"
                        placeholder="To Date"
                        hiddenLabel
                        disableFuture
                        format={displayDateFormatter}
                        helperText={error.toDate}
                        minDate={(filterParams && filterParams.fromDate) || ""}
                        value={(filterParams && filterParams.toDate) || null}
                        onChange={(date: any) => {
                            setValues({ toDateChip: convertDateFormat(date, displayDateFormatter) }, { toDate: convertDateFormat(date, "YYYY/MM/DD") })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                    />
                </div>

            </div>
        </FilterContainer>
    );

    function onApply() {
        onApplyFilter(filterValues, filterParams);
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

    function getVehicleList(text: string) {
        appDispatch(searchVehicleList({ query: text })).then((response: any) => {
            if (response) {
                setVehicleSuggestion(setAutoCompleteListWithData(response.vehicles, "vehicleNumber", "vehicleCode"))
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

    function validateData() {
        if (!isFilterNullValue(filterValues.originName) && isNullValue(filterParams.originCode)) {
            setError({
                originName: "Enter valid Origin."
            });
            return false;
        } else if (!isFilterNullValue(filterValues.destinationName) && isNullValue(filterParams.destinationCode)) {
            setError({
                destinationName: "Enter valid Destination."
            });
            return false;
        } else if (!isFilterNullValue(filterValues.partnerName) && isNullValue(filterParams.partnerCode)) {
            setError({ partner: errorTransporter });
            return;
        } else if (!isFilterNullValue(filterValues.vehicleNumber) && isNullValue(filterParams.vehicleCode)) {
            setError({
                vehicleNumber: "Enter valid Vehicle Number."
            });
            return false;
        } else if (isNullValue(filterValues.fromDateChip) && !isNullValue(filterValues.toDateChip)) {
            setError({ fromDate: fromDateError });
            return;
        } else if (isNullValue(filterValues.toDateChip) && !isNullValue(filterValues.fromDateChip)) {
            setError({ toDate: toDateError });
            return;
        }

        if (!isObjectEmpty(filterParams)) {
            if (isFilterChanged) {
                setError({});
                return true
            } else {
                setError({});
                onClose();
            }

        } else {
            setError({ originName: "Enter valid Origin." });
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

}

export default TrackingDashboardFilters;
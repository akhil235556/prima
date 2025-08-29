import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { consentStatusList, freightTypeList } from "../../../base/constant/ArrayList";
import { DropPointLabel, DropPointPlaceholder, fromDateError, tatBreachedLabel, toDateError, vehicleTypeLabel, vehicleTypePlaceholder } from "../../../base/constant/MessageUtils";
import { convertDateFormat, displayDateFormatter } from "../../../base/utility/DateUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from '../../../component/widgets/AutoSuggest';
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { searchLocationList } from "../../../serviceActions/LocationServiceActions";
import { searchVehicleList } from "../../../serviceActions/VehicleServiceActions";
import { getAllVehicleTypeList } from "../../../serviceActions/VehicleTypeServiceActions";


interface VehicleFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any,
    filerChips: any,
    filerParams: any,
}

function TrackingFilters(props: VehicleFiltersProps) {
    const { open, onClose, onApplyFilter, filerChips, filerParams } = props;
    const appDispatch = useDispatch();
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [originSuggestion, setOriginSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [vehicleSuggestion, setVehicleSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [destinationSuggestion, setDestinationSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [dropPoint, setDropPointList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const vehicleTypeList = useSelector((state: any) =>
        state.appReducer.vehicleTypeList, shallowEqual
    );
    const transientStatus = [{
        value: "Delayed",
        label: "Delayed"
    }, {
        value: "On Schedule",
        label: "On Schedule"
    }, {
        value: "Unknown",
        label: "Unknown"
    }]

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
            appDispatch(getAllVehicleTypeList());
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
            onApply={() => {
                if (validateData()) {
                    setError({});
                    onApplyFilter(filterValues, filterParams);
                }
            }}
            onClear={() => {
                setError({});
                onClear();
            }}
        >
            <div className="filter-form-row">
                <div className="form-group">
                    <AutoComplete
                        label="Transit Status"
                        placeHolder="Select Transit"
                        value={filterValues.transientStatus ? {
                            label: filterValues.transientStatus,
                            value: filterParams.transientStatus
                        } : undefined}
                        options={transientStatus}
                        error={error.transientStatus}
                        onChange={(value: any) => {
                            setValues({ transientStatus: value.label }, { transientStatus: value.value })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoSuggest
                        label="Origin"
                        placeHolder="Enter Origin Name"
                        value={filterValues.originName}
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
                        value={filterValues.destinationName}
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
                    <AutoSuggest
                        label={DropPointLabel}
                        placeHolder={DropPointPlaceholder}
                        value={filterValues.taggedLocationName}
                        error={error.taggedLocationName}
                        suggestions={dropPoint}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getSuggestionList(value, "dropPoint");
                            }
                        }}
                        onSelected={(value: OptionType) => {
                            setValues({ taggedLocationName: value.label }, { taggedLocationCode: value.value })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                        onChange={(text: string) => {
                            setValues({ taggedLocationName: text }, { taggedLocationCode: "" })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                    />
                </div>

                <div className="form-group">
                    <AutoComplete
                        label={vehicleTypeLabel}
                        placeHolder={vehicleTypePlaceholder}
                        value={filterValues.vehicleTypeName ? {
                            label: filterValues.vehicleTypeName,
                            value: filterParams.vehicleTypeCode,
                        } : undefined}
                        error={error.vehicleType}
                        options={setAutoCompleteListWithData(vehicleTypeList, "type", "code")}
                        onChange={(value: OptionType) => {
                            setValues({ vehicleTypeName: value.label }, { vehicleTypeCode: value.value })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                    />
                </div>

                <div className="form-group">
                    <AutoComplete
                        label="Freight Type"
                        placeHolder="Freight Type"
                        value={filterValues.freightType ? {
                            label: filterValues.freightType,
                            value: filterParams.freightType
                        } : undefined}
                        options={freightTypeList}
                        error={error.freightType}
                        onChange={(value: any) => {
                            setValues({ freightType: value.label }, { freightType: value.value })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                    />
                </div>

                <div className="form-group">
                    <AutoComplete
                        label="Consent Status"
                        placeHolder="Consent Status"
                        value={filterValues.consentStatus ? {
                            label: filterValues.consentStatus,
                            value: filterParams.consentStatus
                        } : undefined}
                        options={consentStatusList}
                        error={error.consentStatus}
                        onChange={(value: any) => {
                            setValues({ consentStatus: value.label }, { consentStatus: value.value })
                            setError({});
                            setIsFilterChanged(true);
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoSuggest
                        label="Vehicle Number"
                        placeHolder="Enter Vehicle Number"
                        value={filterValues.vehicleNumber}
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
                        value={(filterParams.fromDate) || null}
                        maxDate={(filterParams.toDate) || new Date()}
                        onChange={(date: any) => {
                            setValues({ fromDateChip: convertDateFormat(date, displayDateFormatter) },
                                { fromDate: convertDateFormat(date, "YYYY/MM/DD") });
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
                        hiddenLabel
                        placeholder="To Date"
                        disableFuture
                        helperText={error.toDate}
                        minDate={(filterParams.fromDate) || ""}
                        format={displayDateFormatter}
                        value={(filterParams.toDate) || null}
                        onChange={(date: any) => {
                            setValues({ toDateChip: convertDateFormat(date, displayDateFormatter) },
                                { toDate: convertDateFormat(date, "YYYY/MM/DD") });
                            setError({});
                            setIsFilterChanged(true);
                        }}
                    />
                </div>
            </div>
        </FilterContainer>
    );

    function validateData() {
        if (!isFilterNullValue(filterValues.originName) && isNullValue(filterParams.originCode)) {
            setError({
                originName: "Enter valid Origin"
            });
            return false;
        } else if (!isFilterNullValue(filterValues.destinationName) && isNullValue(filterParams.destinationCode)) {
            setError({
                destinationName: "Enter valid Destination"
            });
            return false;
        } else if (!isFilterNullValue(filterValues.taggedLocationName) && isNullValue(filterParams.taggedLocationCode)) {
            setError({
                taggedLocationName: "Enter valid drop point"
            });
            return false;
        } else if (!isFilterNullValue(filterValues.vehicleNumber) && isNullValue(filterParams.vehicleCode)) {
            setError({
                vehicleNumber: "Enter valid Vehicle Number"
            });
            return false;
        } else if (isNullValue(filterParams.fromDate) && !isNullValue(filterParams.toDate)) {
            setError({ fromDate: fromDateError });
            return;
        } else if (isNullValue(filterParams.toDate) && !isNullValue(filterParams.fromDate)) {
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
            setError({
                transientStatus: "Enter valid Status"
            });
        }


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
                    case "dropPoint":
                        setDropPointList(setAutoCompleteListWithData(response, "locationName", "locationCode"));
                        break;
                }

            }
        })
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

    function getVehicleList(text: string) {
        appDispatch(searchVehicleList({ query: text })).then((response: any) => {
            if (response) {
                setVehicleSuggestion(setAutoCompleteListWithData(response.vehicles, "vehicleNumber", "vehicleCode"))
            }
        });
    }

}

export default TrackingFilters;
import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { freightTypeList } from "../../../base/constant/ArrayList";
import { errorTransporter, fromDateError, toDateError, transporterLabel, transporterPlaceHolder } from "../../../base/constant/MessageUtils";
import { convertDateFormat, convertDateToServerFromDate, convertDateToServerToDate, displayDateFormatter } from "../../../base/utility/DateUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from "../../../component/widgets/EditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";
import { getAllVehicleTypeList } from "../../../serviceActions/VehicleTypeServiceActions";

interface TrackRequestFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function TrackRequestFilters(props: TrackRequestFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false)
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [error, setError] = React.useState<any>({});
    const vehicleTypeList = useSelector((state: any) =>
        state.appReducer.vehicleTypeList, shallowEqual
    );

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
                    <EditText
                        label="Order Code"
                        placeholder="Enter Order Code"
                        error={error.orderCodeError}
                        value={filterValues.freightOrder}
                        maxLength={50}
                        onChange={(text: string) => {
                            setValues({ freightOrder: text }, { freightOrderCode: text })
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Vehicle Type"
                        placeHolder="Vehicle Type"
                        value={filterValues.vehicleType ? ({
                            label: filterValues.vehicleType,
                            value: filterParams.vehicleTypeCode,
                        }) : null}
                        error={error.vehicleType}
                        options={setAutoCompleteListWithData(vehicleTypeList, "type", "code")}
                        onChange={(element: OptionType) => {
                            setValues({ vehicleType: element.label }, { vehicleTypeCode: element.value });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Freight Type"
                        placeHolder="Select Freight Type"
                        value={filterValues.freightType ? {
                            label: filterValues.freightType,
                            value: filterParams.freightType
                        } : undefined}
                        options={freightTypeList}
                        onChange={(value: OptionType) => {
                            setValues({ freightType: value.label }, { freightType: value.value })
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoSuggest
                        label={transporterLabel}
                        placeHolder={transporterPlaceHolder}
                        value={filterValues.partnerName}
                        error={error.partnerCode}
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
                    <label className="picker-label">{"Order Created From"}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={"Order Created From"}
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
                    <label className="picker-label">{"Order Created To"}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={"Order Created To"}
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
            </div>
        </FilterContainer>
    );

    function getPartnerList(text: string) {
        appDispatch(searchClientPartner({ query: text })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteListWithData(response, "partnerName", "partnerCode"))
            }
        });
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

    function onApply() {
        if (!isFilterNullValue(filterValues.query) && isNullValue(filterParams.query)) {
            setError({ orderCodeError: "Enter valid order code" });
            return;
        } else if (!isFilterNullValue(filterValues.partnerName) && isNullValue(filterParams.partnerCode)) {
            setError({ partnerCode: errorTransporter });
            return;
        } else if (isNullValue(filterParams.fromDateTime) && !isNullValue(filterParams.toDateTime)) {
            setError({ fromDateTime: fromDateError });
            return;
        } else if (isNullValue(filterParams.toDateTime) && !isNullValue(filterParams.fromDateTime)) {
            setError({ toDateTime: toDateError });
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
            setError({ orderCodeError: "Enter valid order code" });
        }
    }

}

export default TrackRequestFilters;

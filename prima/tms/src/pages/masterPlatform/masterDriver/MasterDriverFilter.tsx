import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { vehicleSourceTypeList } from "../../../base/constant/ArrayList";
import {
    driverNameLabel
} from '../../../base/constant/MessageUtils';
import { convertDateFormat, convertDateToServerFromDate, convertDateToServerToDate, displayDateFormatter } from "../../../base/utility/DateUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from '../../../base/utility/StringUtils';
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import NumberEditText from "../../../component/widgets/NumberEditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { driverStatusOptions } from './base/ArrayList';
import { driverMobileError, driverMobileLabel, driverMobilePlaceholder, driverNameError, driverNamePlaceholder, fromDateError, fromDateLabel, fromDatePlaceholder, toDateError, toDateLabel, toDatePlaceholder } from "./base/MasterDriverMessageUtils";
import { searchDriverList } from "./masterDriverApi/MasterDriverServiceActions";

interface MasterDriverFilterProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function MasterDriverFilter(props: MasterDriverFilterProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const [nameSuggestion, setNameSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);

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
                        label={driverNameLabel}
                        placeHolder={driverNamePlaceholder}
                        error={error.driverName}
                        value={filterValues && filterValues.driverName}
                        suggestions={nameSuggestion}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getSuggestionList(value, "driverName");
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ driverName: element.label }, { driverName: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ driverName: text }, { driverName: "" });
                        }}
                    />
                </div>
                <div className="form-group">
                    <NumberEditText
                        placeholder={driverMobilePlaceholder}
                        error={error.driverMobileError}
                        label={driverMobileLabel}
                        value={filterValues && filterValues.contactNumber}
                        maxLength={10}
                        onChange={(text: any) => {
                            setValues({ contactNumber: text }, { contactNumber: text })
                        }}
                    />

                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Status"
                        placeHolder="Select Status"
                        // error={error.status}
                        value={filterValues.driverStatus ? {
                            label: filterValues.driverStatus,
                            value: filterParams.isActive
                        } : undefined}
                        options={driverStatusOptions}
                        onChange={(element: any) => {
                            setValues({ driverStatus: element.label }, { isActive: element.value })
                        }}
                    />
                </div>
                {/* <div className="form-group">
                    <NumberEditText
                        label={driverMobileLabel}
                        placeholder={driverMobilePlaceholder}
                        error={error.contactNumber}
                        maxLength={10}
                        value={filterValues.contactNumber}
                        onChange={(text: string) => {
                            setValues({ contactNumber: text }, { contactNumber: text });
                        }}
                    />
                </div> */}
                <div className="form-group">
                    <label className="picker-label">{fromDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={fromDatePlaceholder}
                        hiddenLabel
                        helperText={error.createdAtFromDate}
                        format={displayDateFormatter}
                        maxDate={(filterParams.createdAtToDate) || new Date()}
                        value={filterParams.createdAtFromDate || null}
                        onChange={(date: any) => {
                            setValues({ driverCreatedAtFromTime: convertDateFormat(date, displayDateFormatter) }, { createdAtFromDate: convertDateToServerFromDate(date) });
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{toDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={toDatePlaceholder}
                        hiddenLabel
                        helperText={error.createdAtToDate}
                        format={displayDateFormatter}
                        value={filterParams.createdAtToDate || null}
                        minDate={(filterParams.createdAtFromDate) || ""}
                        onChange={(date: any) => {
                            setValues({ driverCreatedAtToTime: convertDateFormat(date, displayDateFormatter) }, { createdAtToDate: convertDateToServerToDate(date) });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Driver Source Type"
                        placeHolder="Select Driver Source Type"
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
        setIsFilterChanged(true);
    }

    function onApply() {

        if (!isFilterNullValue(filterValues.driverName) && isNullValue(filterParams.driverName)) {
            setError({ driverName: driverNameError });
            return;
        }
        else if (!isFilterNullValue(filterValues.contactNumber) && isNullValue(filterParams.contactNumber)) {
            setError({ contactNumber: driverMobileError });
            return;
        }
        else if (isNullValue(filterParams.createdAtFromDate) && !isNullValue(filterParams.createdAtToDate)) {
            setError({ createdAtFromDate: fromDateError });
            return;
        } else if (isNullValue(filterParams.createdAtToDate) && !isNullValue(filterParams.createdAtFromDate)) {
            setError({ createdAtToDate: toDateError });
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
            setError({ driverName: "Enter valid Driver Name" });
        }
    }

    function getSuggestionList(text: string, type: string) {
        appDispatch(searchDriverList({ driverName: text })).then((response: any) => {
            if (response) {
                setNameSuggestion(setAutoCompleteListWithData(response.result, "driverName", "driverName"));
            }
        })
    };
}

export default MasterDriverFilter;

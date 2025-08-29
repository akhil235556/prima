import { DatePicker } from '@material-ui/pickers';
import React, { useEffect } from 'react';
import { dispatchDashboardPeriods, DispatchPeriodsEnum } from '../../base/constant/ArrayList';
import { fromDateError, fromDateLabel, fromDatePlaceholder, toDateError, toDateLabel, toDatePlaceholder } from '../../base/constant/MessageUtils';
import { convertDateFormat, convertDateToServerFromDate, convertDateToServerToDate, displayDateFormatter } from '../../base/utility/DateUtils';
import { isNullValue, isObjectEmpty } from '../../base/utility/StringUtils';
import AutoComplete from '../../component/widgets/AutoComplete';
import { OptionType } from '../../component/widgets/widgetsInterfaces';
import FilterContainer from '../../modals/FilterModal/FilterContainer';

interface ShipmentLogsFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}
function ShipmentLogFilters(props: ShipmentLogsFiltersProps) {
    //const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [isCustomPeriod, setIisCustomPeriod] = React.useState<boolean>(false);
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);

    useEffect(() => {
        if (open) {
            setFilterValues(filerChips);
            setFilterParams(filerParams);
            setIsFilterChanged(false);
            setIisCustomPeriod(filerChips.periodLabel === DispatchPeriodsEnum.Custom)
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
                setIisCustomPeriod(false)
            }}
            onApply={onApply}
        >
            <div className="filter-form-row">
                <div className="form-group">
                    <AutoComplete
                        label="Period"
                        placeHolder="Select Period"
                        value={filterValues.periodLabel ? {
                            label: filterValues.periodLabel,
                            value: filterValues.period,
                        } : undefined}
                        error={error.period}
                        options={dispatchDashboardPeriods}
                        onChange={(element: OptionType) => {
                            setValues(element.value === DispatchPeriodsEnum.Custom ?
                                {
                                    periodLabel: element.value,
                                } : {
                                    periodLabel: element.value,
                                    fromDate: "",
                                    toDate: ""
                                },
                                element.value === DispatchPeriodsEnum.Custom ?
                                    { fromDate: "", toDate: "" } : {
                                        fromDate: element.data.fromDate,
                                        toDate: element.data.toDate
                                    });
                            setIisCustomPeriod(element.value === DispatchPeriodsEnum.Custom);
                        }}
                    />
                </div>
                {isCustomPeriod && <>
                    <div className="form-group">
                        <label className="picker-label">{fromDateLabel}</label>
                        <DatePicker
                            className="custom-date-picker"
                            placeholder={fromDatePlaceholder}
                            hiddenLabel
                            disableFuture
                            helperText={error.fromDate}
                            format={displayDateFormatter}
                            maxDate={filterParams.toDate || new Date()}
                            value={filterParams.fromDate || null}
                            onChange={(date: any) => {
                                setValues({ fromDateLabel: convertDateFormat(date, displayDateFormatter) }, { fromDate: convertDateToServerFromDate(date) });
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="picker-label">{toDateLabel}</label>
                        <DatePicker
                            className="custom-date-picker"
                            placeholder={toDatePlaceholder}
                            hiddenLabel
                            disableFuture
                            helperText={error.toDate}
                            format={displayDateFormatter}
                            value={filterParams.toDate || null}
                            minDate={filterParams.fromDate}
                            onChange={(date: any) => {
                                setValues({ toDateLabel: convertDateFormat(date, displayDateFormatter) }, { toDate: convertDateToServerToDate(date) });

                            }}
                        />
                    </div>
                </>
                }
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


    function closeModal() {
        setError({});
        onClose();
    }

    function onApply() {
        if (!isNullValue(filterValues.period) && (isNullValue(filterParams.fromDate) || isNullValue(filterParams.toDate))) {
            if (isNullValue(filterParams.fromDate)) {
                setError({ fromDate: fromDateError });
                return;
            } else if (isNullValue(filterParams.toDate)) {
                setError({ toDate: toDateError });
                return;
            }
        }

        if (!isObjectEmpty(filterParams)) {
            if (isFilterChanged) {
                setError({});
                onApplyFilter(filterValues, filterParams);
            } else {
                closeModal();
            }
        } else {
            setError({ period: "Select period" });
        }
    }
}
export default ShipmentLogFilters;
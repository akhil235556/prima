import { DatePicker } from '@material-ui/pickers';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { jobStatusList } from '../../base/constant/ArrayList';
import { fromDateError, fromDateLabel, fromDatePlaceholder, toDateError, toDateLabel, toDatePlaceholder } from '../../base/constant/MessageUtils';
import { convertDateFormat, convertDateToServerFromDate, convertDateToServerToDate, displayDateFormatter } from '../../base/utility/DateUtils';
import { isFilterNullValue, isNullValue, isObjectEmpty } from '../../base/utility/StringUtils';
import AutoComplete from '../../component/widgets/AutoComplete';
import EditText from '../../component/widgets/EditText';
import { OptionType } from '../../component/widgets/widgetsInterfaces';
import FilterContainer from '../../modals/FilterModal/FilterContainer';
import { setAutoCompleteListWithData } from '../../moduleUtility/DataUtils';
import { getJobsRegistry } from '../../serviceActions/BulkUploadServiceActions';

interface BulkUploadTrackFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}
function BulkUploadTrackFilters(props: BulkUploadTrackFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});

    const [jobList, setJobList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);

    useEffect(() => {
        const getJobList = async () => {
            appDispatch(getJobsRegistry()).then((response: any) => {
                if (response) {
                    setJobList(setAutoCompleteListWithData(response, "jobName", "jobName"));
                }
            })
        }
        if (open) {
            setFilterValues(filerChips);
            setFilterParams(filerParams);
            setIsFilterChanged(false);
        }
        open && getJobList();
        // eslint-disable-next-line
    }, [open]);

    return (
        <FilterContainer
            open={open}
            onClose={onClose}
            onApply={onApply}
            onClear={() => {
                setFilterParams({});
                setFilterValues({});
                setError({});
            }}
        >
            <div className="filter-form-row">
                <div className="form-group">
                    <EditText
                        label="Request Id"
                        placeholder="Enter Request Id"
                        error={error.requestId}
                        value={filterValues.requestId}
                        maxLength={50}
                        onChange={(text: string) => {
                            setValues({ requestId: text }, { requestId: text.trim() })
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Job Entity"
                        placeHolder="Select Job Entity"
                        value={filterValues.jobName ? {
                            label: filterValues.jobName,
                            value: filterValues.jobName
                        } : undefined}
                        options={jobList}
                        onChange={(value: OptionType) => {
                            setValues({ jobName: value.label }, { jobName: value.value })
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Status"
                        placeHolder="Select Status"
                        value={filterValues.status ? {
                            label: filterValues.status,
                            value: filterValues.status
                        } : undefined}
                        options={jobStatusList}
                        onChange={(element: OptionType) => {
                            setValues({ status: element.label }, { status: element.label });
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{fromDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={fromDatePlaceholder}
                        hiddenLabel
                        helperText={error.fromDate}
                        format={displayDateFormatter}
                        maxDate={filterParams.toDate || new Date()}
                        value={filterParams.fromDate || null}
                        onChange={(date: any) => {
                            setValues({ fromTimeDate: convertDateFormat(date, displayDateFormatter) }, { fromDate: convertDateToServerFromDate(date) });
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{toDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={toDatePlaceholder}
                        hiddenLabel
                        helperText={error.toDate}
                        format={displayDateFormatter}
                        value={filterParams.toDate || null}
                        minDate={filterParams.fromDate}
                        onChange={(date: any) => {
                            setValues({ toTimeDate: convertDateFormat(date, displayDateFormatter) }, { toDate: convertDateToServerToDate(date) });

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
        if (!isFilterNullValue(filterValues.requestId) && isNullValue(filterParams.requestId)) {
            setError({ requestId: "Enter valid request id" });
            return;
        } else if (!isNullValue(filterParams.toDate) && isNullValue(filterParams.fromDate)) {
            setError({ fromDate: fromDateError });
            return;
        } else if (!isNullValue(filterParams.fromDate) && isNullValue(filterParams.toDate)) {
            setError({ toDate: toDateError });
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
            setError({ requestId: "Enter valid request id" });
        }
    }
}
export default BulkUploadTrackFilters;
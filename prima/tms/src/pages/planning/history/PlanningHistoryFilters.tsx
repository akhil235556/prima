import React, { useEffect } from "react";
import { planningHistoryFilter } from '../../../base/constant/ArrayList';
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";

interface PlanningHistoryFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any,
    filerChips: any,
    filerParams: any,
}

function PlanningHistoryFilters(props: PlanningHistoryFiltersProps) {
    const { open, onClose, onApplyFilter, filerChips, filerParams } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
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
                    <AutoComplete
                        label="Status"
                        placeHolder="Select Status"
                        error={error.status}
                        value={(filterValues.planningStatusLabel ? {
                            label: filterValues.planningStatusLabel,
                            value: filerParams.status,
                        } : undefined)}
                        options={planningHistoryFilter}
                        onChange={(value: any) => {
                            setValues({ planningStatusLabel: value.label }, { status: value.value, });
                        }
                        }
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
        if (!isObjectEmpty(filterParams)) {
            if (isFilterChanged) {
                setError({});
                onApplyFilter(filterValues, filterParams);
            } else {
                setError({});
                onClose();
            }

        } else {
            setError({ status: "Select valid status" });
        }
    }
}

export default PlanningHistoryFilters;

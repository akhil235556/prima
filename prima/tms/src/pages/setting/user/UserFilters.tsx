import React, { useEffect } from "react";
import { emailError } from "../../../base/constant/MessageUtils";
import { isNullValue, isValidEmailId } from '../../../base/utility/StringUtils';
import EditText from '../../../component/widgets/EditText';
import FilterContainer from "../../../modals/FilterModal/FilterContainer";

interface UserFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any,
    appliedFilters: any
}

function UserFilters(props: UserFiltersProps) {
    const { open, onClose, onApplyFilter, appliedFilters } = props;

    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});

    useEffect(() => {
        open && setFilterValues(appliedFilters);
        // eslint-disable-next-line
    }, [open]);

    return (
        <FilterContainer
            open={open}
            onClose={() => {
                setError({});
                onClose()
            }}
            onClear={() => {
                setFilterValues({});
                setError({});
            }}
            onApply={onApply}
        >
            <div className="filter-form-row">
                <div className="form-group">
                    <EditText
                        label={"Email"}
                        placeholder={"Enter Email"}
                        maxLength={40}
                        error={error.email}
                        value={filterValues.email}
                        onChange={(text: string) => {
                            setFilterValues({
                                ...filterValues,
                                email: text
                            });
                        }}
                    />
                </div>
            </div>
        </FilterContainer >
    );

    function onApply() {
        if (isNullValue(filterValues.email) || !isValidEmailId(filterValues.email)) {
            setError({ email: emailError })
            return;
        }
        let filterChips = {
            email: filterValues.email
        };
        let filterParams = {
            email: filterValues.email
        };
        setError({});
        onApplyFilter(filterChips, filterParams);
    }
}

export default UserFilters;

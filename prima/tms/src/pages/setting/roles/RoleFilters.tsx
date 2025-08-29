import React from "react";
import AutoComplete from "../../../component/widgets/AutoComplete";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";


interface RoleFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
}

function RoleFilters(props: RoleFiltersProps) {
    const { open, onClose, onApplyFilter } = props;
    return (
        <FilterContainer
            open={open}
            onClose={onClose}
            onApply={onApply}
        >
            <div className="filter-form-row">
                <div className="form-group">
                    <AutoComplete
                        label={"Role"}
                        placeHolder={"Select Name"}
                        value={null}
                        options={[]}
                        onChange={() => {

                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label={"User Id"}
                        placeHolder={"Select"}
                        value={null}
                        options={[]}
                        onChange={() => {

                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label={"Status"}
                        placeHolder={"Select"}
                        value={null}
                        options={[]}
                        onChange={() => {

                        }}
                    />
                </div>
            </div>
        </FilterContainer>
    );

    function onApply() {
        onApplyFilter()
    }
}

export default RoleFilters;

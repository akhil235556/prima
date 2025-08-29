import React from "react";
import AutoComplete from "../../../component/widgets/AutoComplete";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import EditText from '../../../component/widgets/EditText';

interface TrackingAssetsFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
}

function TrackingAssetsFilters(props: TrackingAssetsFiltersProps) {
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
                        label="Tracking Vendor"
                        placeHolder="Select Tracking Vendor"
                        value={null}
                        options={[]}
                        onChange={() => {

                        }}
                    />
                </div>
                <div className="form-group device-form">
                    <EditText
                        label="Device Number"
                        placeholder="Enter Device Number"
                        maxLength={25}
                        value=""
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

export default TrackingAssetsFilters;

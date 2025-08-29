import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { errorLane, laneLabel, lanePlaceholder, orderCodeLabel, orderIdPlaceholder } from "../../../base/constant/MessageUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from "../../../component/widgets/EditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList, setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchLane } from "../../../serviceActions/LaneServiceActions";

interface FreightBillingPeriodicFilterProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any,
    filerChips: any,
    filerParams: any,
}

const FreightBillingPeriodicFilter = (props: FreightBillingPeriodicFilterProps) => {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);
    const vehicleTypeList = useSelector((state: any) => state.appReducer.vehicleTypeList, shallowEqual);

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
                    <EditText
                        label={orderCodeLabel}
                        placeholder={orderIdPlaceholder}
                        value={filterValues.freightId}
                        error={error.freightId}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ freightId: text }, { freightId: text });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoSuggest
                        label={laneLabel}
                        placeHolder={lanePlaceholder}
                        value={filterValues.laneName}
                        suggestions={laneList}
                        error={error.lane}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getLaneList(value);
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ laneName: element.label }, { laneCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ laneName: text }, { laneCode: "" });
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
                        options={setAutoCompleteListWithData(vehicleTypeList, "type", "code")}
                        onChange={(element: OptionType) => {
                            setValues({ vehicleTypeName: element.label }, { vehicleTypeCode: element.value });
                        }}
                    />
                </div>
            </div>
        </FilterContainer>
    )

    function setValues(chips: any, params?: any) {
        params && setFilterParams({
            ...filterParams,
            ...params
        });
        setFilterValues({
            ...filterValues,
            ...chips
        });
        setError({});
        setIsFilterChanged(true);
    }

    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                setLaneList(setAutoCompleteList(response, "laneName", "laneCode"))
            }
        });
    }

    function closeModal() {
        setError({});
        onClose();
    }

    function onApply() {
        if (!isFilterNullValue(filterValues.freightId) && isNullValue(filterParams.freightId)) {
            setError({ freightId: "Enter valid Freight Id" });
            return;
        } else if (!isFilterNullValue(filterValues.laneName) && isNullValue(filterParams.laneCode)) {
            setError({ lane: errorLane });
            return;
        }

        if (!isObjectEmpty(filterParams)) {
            if (isFilterChanged) {
                setError({});
                onApplyFilter(filterValues, filterParams);
            } else {
                closeModal();
            }

        } else {
            setError({
                freightId: "Enter valid Freight Id"
            });
        }
    }

}

export default FreightBillingPeriodicFilter
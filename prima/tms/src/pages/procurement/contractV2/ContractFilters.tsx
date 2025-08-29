import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { freightTypeList, serviceabilityModeTypeList } from "../../../base/constant/ArrayList";
import { contractIdLabel, contractIdPlaceholder, errorContractId, errorLane, errorTransporter, laneLabel, lanePlaceholder, transporterLabel, transporterPlaceHolder, vehicleTypeLabel, vehicleTypePlaceholder } from "../../../base/constant/MessageUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from '../../../base/utility/StringUtils';
import AutoComplete from "../../../component/widgets/AutoComplete";
// import { searchLane } from "../../../serviceActions/LaneServiceActions";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList, setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchContractIdList } from "../../../serviceActions/ContractServiceActions";
import { searchLane } from "../../../serviceActions/LaneServiceActions";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";
import { getAllVehicleTypeList } from "../../../serviceActions/VehicleTypeServiceActions";

interface ContractFilterProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function ContractFilter(props: ContractFilterProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});

    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined)
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false)
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [contractIdList, setContractIdList] = React.useState<Array<OptionType> | undefined>(undefined);
    const vehicleTypeList = useSelector((state: any) =>
        state.appReducer.vehicleTypeList, shallowEqual
    );

    const contractStatus = [{
        value: "PENDING",
        label: "PENDING"
    },
    {
        value: "ACTIVE",
        label: "ACTIVE"
    },
    {
        value: "TERMINATED",
        label: "TERMINATED"
    }
    ]
    useEffect(() => {
        if (open) {
            setFilterValues(filerChips);
            setFilterParams(filerParams);
            setIsFilterChanged(false);
        }
        // eslint-disable-next-line
    }, [open]);

    useEffect(() => {
        const getList = async () => {
            appDispatch(getAllVehicleTypeList())
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <FilterContainer
            open={open}
            onClose={() => {
                setError({});
                onClose();
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
                        label={transporterLabel}
                        placeHolder={transporterPlaceHolder}
                        value={filterValues.partnerName}
                        error={error.partner}
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
                    <AutoSuggest
                        label={contractIdLabel}
                        placeHolder={contractIdPlaceholder}
                        value={filterValues.contractId}
                        error={error.contract}
                        suggestions={contractIdList}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getContractIdList(value);
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ contractId: element.label }, { contractCode: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ contractId: text }, { contractCode: "" });
                        }}
                    />
                </div>
                <div className="form-group lane-wrap-text">
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
                        label={vehicleTypeLabel}
                        placeHolder={vehicleTypePlaceholder}
                        value={filterValues.vehicleTypeName ? {
                            label: filterValues.vehicleTypeName,
                            value: filterParams.code,
                        } : undefined}
                        error={error.vehicleType}
                        options={setAutoCompleteListWithData(vehicleTypeList, "type", "code")}
                        onChange={(element: OptionType) => {
                            setValues({ vehicleTypeName: element.label }, { vehicleTypeCode: element.value });
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Freight Type"
                        placeHolder="Select Freight Type"
                        value={filterValues.freightTypeCode ? {
                            label: filterValues.freightTypeCode,
                            value: filterParams.contractType
                        } : undefined}
                        options={freightTypeList}
                        onChange={(value: OptionType) => {
                            setValues({ freightTypeCode: value.label }, { contractType: value.value })
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Status"
                        placeHolder="Select Status"
                        // error={error.status}
                        value={filterValues.contractStatus ? {
                            label: filterValues.contractStatus,
                            value: filterParams.contractStatus
                        } : undefined}
                        options={contractStatus}
                        onChange={(element: any) => {
                            setValues({ contractStatus: element.value }, { contractStatus: element.value })
                        }}
                    />
                </div>
                <div className="form-group">
                    <AutoComplete
                        label="Transportation Mode"
                        placeHolder="Select Mode"
                        value={filterValues.serviceabilityModeName ? {
                            label: filterValues.serviceabilityModeName,
                            value: filterParams.serviceabilityModeCode
                        } : undefined}
                        options={serviceabilityModeTypeList}
                        onChange={(value: OptionType) => {
                            setValues({ serviceabilityModeName: value.label }, { serviceabilityModeCode: value.value })
                        }}
                    />
                </div>
            </div>
        </FilterContainer>
    );

    function onApply() {
        if (!isFilterNullValue(filterValues.partnerName) && isNullValue(filterParams.partnerCode)) {
            setError({ partner: errorTransporter });
            return;
        } else if (!isFilterNullValue(filterValues.laneName) && isNullValue(filterParams.laneCode)) {
            setError({ lane: errorLane });
            return;
        } else if (!isFilterNullValue(filterValues.contractId) && isNullValue(filterParams.contractCode)) {
            setError({ contract: errorContractId });
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
            setError({ partner: "Enter valid transporter" });
        }
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


    function getPartnerList(text: string) {
        appDispatch(searchClientPartner({ query: text })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteList(response, "partnerName", "partnerCode"))
            }
        });
    }

    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                setLaneList(setAutoCompleteListWithData(response, "laneName", "laneCode"))
            }
        });
    }

    function getContractIdList(text: string) {
        appDispatch(searchContractIdList({ query: text })).then((response: any) => {
            if (response) {
                setContractIdList(setAutoCompleteListWithData(response, "contractCode", "contractCode"))
            }
        });
    }

}

export default ContractFilter;

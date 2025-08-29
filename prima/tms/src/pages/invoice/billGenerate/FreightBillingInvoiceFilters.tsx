import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { freightTypeList, InvoiceStatusEnum } from "../../../base/constant/ArrayList";
import { billApprovedByLabel, billApprovedByPlaceholder, errorApproverMaxLimit, errorLane, errorTransporter, externalOrderBillNumberLabel, externalOrderBillNumberPlaceholder, freighBillNumberLabel, freighBillNumberPlaceholder, freightBillFromDateLabel, freightBillToDateLabel, laneLabel, lanePlaceholder, orderCodeLabel, orderFromDateLabel, orderIdPlaceholder, orderToDateLabel, pendingBillApprovedByPlaceholder, pendingBillByLabel, transporterLabel, transporterPlaceHolder } from "../../../base/constant/MessageUtils";
import { convertDateFormat, displayDateFormatter, serverDateFormat } from "../../../base/utility/DateUtils";
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from "../../../component/widgets/EditText";
import MultiSelect from '../../../component/widgets/MultiSelect';
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteList, setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { getUsersList } from "../../../serviceActions/BillGenerateServiceActions";
import { searchLane } from "../../../serviceActions/LaneServiceActions";
import { searchClientPartner } from "../../../serviceActions/PartnerServiceAction";
import { getAllVehicleTypeList } from "../../../serviceActions/VehicleTypeServiceActions";

interface FreightBillingInvoiceFilterProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
    approvedBy?: any
}

function FreightBillingInvoiceFilters(props: FreightBillingInvoiceFilterProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips, approvedBy } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [usersList, setUsersList] = React.useState<Array<OptionType> | undefined>(undefined);
    const vehicleTypeList = useSelector((state: any) =>
        state.appReducer.vehicleTypeList, shallowEqual
    );

    useEffect(() => {
        const setUserData = async () => {
            setFilterValues(filerChips);
            setFilterParams(filerParams);
            setIsFilterChanged(false);
        }
        open && setUserData();
        // eslint-disable-next-line
    }, [open]);

    useEffect(() => {
        const getList = async () => {
            appDispatch(getAllVehicleTypeList());
            const userListParams = {
                permissionCode: "tms.freight-billing.approve"
            }
            let response = await appDispatch(getUsersList(userListParams));
            response && setUsersList(setAutoCompleteList(response, "name", "userId"))
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        label={freighBillNumberLabel}
                        placeholder={freighBillNumberPlaceholder}
                        value={filterValues.billNo}
                        error={error.billNo}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ billNo: text }, { billNo: text });
                        }}
                    />
                </div>
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

                {<div className="form-group">
                    <EditText
                        label={externalOrderBillNumberLabel}
                        placeholder={externalOrderBillNumberPlaceholder}
                        value={filterValues.externalShipmentBillNumber}
                        error={error.externalShipmentBillNumber}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ externalShipmentBillNumber: text }, { externalShipmentBillNumber: text });
                        }}
                    />
                </div>}

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
                    <AutoSuggest
                        label={transporterLabel}
                        placeHolder={transporterPlaceHolder}
                        value={filterValues.partnerName}
                        error={error.partnerName}
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
                            setValues({ partnerName: text });
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
                {approvedBy === InvoiceStatusEnum["AWAITING APPROVAL"] && <>
                    <div className="form-group">
                        <MultiSelect
                            label={billApprovedByLabel}
                            placeHolder={billApprovedByPlaceholder}
                            value={getSelectedUser(filterParams.billApprovedByUserId)}
                            error={error.billApprovedByUserId}
                            options={usersList}
                            maxLimit={3}
                            maxLimitMessage={errorApproverMaxLimit}
                            // handleSuggestionsFetchRequested={({ value }: any) => {
                            //     if (value.length > autosuggestSearchLength) {
                            //         getUsersList(value);
                            //     }
                            // }}
                            // onSelected={(element: OptionType) => {
                            //     setValues({ billApprovedByUserName: element.label }, { billApprovedByUserId: element.value });
                            // }}
                            onChange={(value: any) => {
                                if (value) {
                                    let billApprovedByUserName = value.map((elemet: any) => elemet.label).join(',');
                                    let billApprovedByUserId = value.map((elemet: any) => elemet.value).join(',');
                                    setValues({ billApprovedByUserName: billApprovedByLabel + ":- " + billApprovedByUserName }, { billApprovedByUserId: billApprovedByUserId });
                                } else {
                                    setValues({ billApprovedByUserName: "" }, { billApprovedByUserId: "" });
                                }

                            }}
                        />
                    </div>

                    <div className="form-group">
                        <MultiSelect
                            label={pendingBillByLabel}
                            placeHolder={pendingBillApprovedByPlaceholder}
                            value={getSelectedUser(filterParams.billPendingByUserId)}
                            error={error.billPendingByUserId}
                            options={usersList}
                            maxLimit={3}
                            maxLimitMessage={errorApproverMaxLimit}
                            // handleSuggestionsFetchRequested={({ value }: any) => {
                            //     if (value.length > autosuggestSearchLength) {
                            //         getUsersList(value);
                            //     }
                            // }}
                            // onSelected={(element: OptionType) => {
                            //     setValues({ pendingbillApprovedByUserName: element.label }, { billPendingByUserId: element.value });
                            // }}
                            onChange={(value: any) => {
                                if (value) {
                                    let pendingbillApprovedByUserName = value.map((elemet: any) => elemet.label).join(',');
                                    let billPendingByUserId = value.map((elemet: any) => elemet.value).join(',');
                                    setValues({ pendingbillApprovedByUserName: pendingBillByLabel + ":- " + pendingbillApprovedByUserName }, { billPendingByUserId: billPendingByUserId });
                                } else {
                                    setValues({ pendingbillApprovedByUserName: "" }, { billPendingByUserId: "" });
                                }
                            }}
                        />
                    </div>
                </>}

                <div className="form-group">
                    <label className="picker-label">{freightBillFromDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={freightBillFromDateLabel}
                        hiddenLabel
                        helperText={error.createdFrom}
                        format={displayDateFormatter}
                        maxDate={filterParams.createdTo}
                        value={filterParams.createdFrom || null}
                        onChange={(date: any) => {
                            setValues({ createdFrom: convertDateFormat(date, displayDateFormatter) }, { createdFrom: convertDateFormat(date, serverDateFormat) });
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{freightBillToDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={freightBillToDateLabel}
                        hiddenLabel
                        helperText={error.createdTo}
                        format={displayDateFormatter}
                        value={filterParams.createdTo || null}
                        minDate={filterParams.createdFrom}
                        onChange={(date: any) => {
                            setValues({ createdTo: convertDateFormat(date, displayDateFormatter) }, { createdTo: convertDateFormat(date, serverDateFormat) });

                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{orderFromDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={orderFromDateLabel}
                        hiddenLabel
                        helperText={error.freightOrderCreatedFrom}
                        format={displayDateFormatter}
                        maxDate={filterParams.freightOrderCreatedTo}
                        value={filterParams.freightOrderCreatedFrom || null}
                        onChange={(date: any) => {
                            setValues({ freightOrderCreatedFrom: convertDateFormat(date, displayDateFormatter) }, { freightOrderCreatedFrom: convertDateFormat(date, serverDateFormat) });
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{orderToDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={orderToDateLabel}
                        hiddenLabel
                        helperText={error.freightOrderCreatedTo}
                        format={displayDateFormatter}
                        value={filterParams.freightOrderCreatedTo || null}
                        minDate={filterParams.freightOrderCreatedFrom}
                        onChange={(date: any) => {
                            setValues({ freightOrderCreatedTo: convertDateFormat(date, displayDateFormatter) }, { freightOrderCreatedTo: convertDateFormat(date, serverDateFormat) });

                        }}
                    />
                </div>
            </div>
        </FilterContainer>
    );

    function getSelectedUser(selectedList: any) {
        let values: any;
        if (selectedList && usersList) {
            let selected = selectedList && selectedList.split(',');
            values = usersList.filter((element: any) => selected.includes(element.value));
        }
        return values;
    }
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

    function onApply() {
        if (!isFilterNullValue(filterValues.billNo) && isNullValue(filterParams.billNo)) {
            setError({ billNo: "Enter Valid Freight Bill Number" });
            return;
        } else if (!isFilterNullValue(filterValues.freightId) && isNullValue(filterParams.freightId)) {
            setError({ freightId: "Enter Valid Order Code " });
            return;
        }
        else if (!isFilterNullValue(filterValues.laneName) && isNullValue(filterParams.laneCode)) {
            setError({ lane: errorLane });
            return;
        } else if (!isFilterNullValue(filterValues.partnerName) && isNullValue(filterParams.partnerCode)) {
            setError({ partnerName: errorTransporter });
            return;
        } else if (!isFilterNullValue(filterValues.externalOrderBillNumber) && isNullValue(filterParams.externalOrderBillNumber)) {
            setError({ externalShipmentBillNumber: "Enter Valid External Order Bill Number" });
            return;
        }
        else if (!isFilterNullValue(filterValues.billApprovedByUserName) && isNullValue(filterParams.billApprovedByUserId)) {
            setError({ billApprovedByUserId: "Enter Valid User Id" });
            return;
        }
        else if (!isFilterNullValue(filterValues.pendingbillApprovedByUserName) && isNullValue(filterParams.billPendingByUserId)) {
            setError({ billPendingByUserId: "Enter Valid User Id" });
            return;
        }
        else if (isNullValue(filterParams.createdFrom) && !isNullValue(filterParams.createdTo)) {
            setError({ createdFrom: "Enter freight bill created from date" });
            return;
        } else if (isNullValue(filterParams.createdTo) && !isNullValue(filterParams.createdFrom)) {
            setError({ createdTo: "Enter freight bill created to date" });
            return;
        } else if (isNullValue(filterParams.freightOrderCreatedFrom) && !isNullValue(filterParams.freightOrderCreatedTo)) {
            setError({ freightOrderCreatedFrom: "Enter order created from date" });
            return;
        } else if (isNullValue(filterParams.freightOrderCreatedTo) && !isNullValue(filterParams.freightOrderCreatedFrom)) {
            setError({ freightOrderCreatedTo: "Enter order created to date" });
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
            setError({ billNo: "Enter Valid Freight Bill Number" });
        }
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
                setLaneList(setAutoCompleteList(response, "laneName", "laneCode"))
            }
        });
    }
}

export default FreightBillingInvoiceFilters;

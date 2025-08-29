import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { emailError, errorConsigneeName, errorGSTNumber, errorIntegrationCode, errorPanNumber, errorPhoneNumber, integrationCodeLabel, integrationCodePlaceholder } from '../../../base/constant/MessageUtils';
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from "../../../component/widgets/NumberEditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchCustomer } from "../../../serviceActions/ConsigneeServiceActions";

interface ConsigneeFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function ConsigneeFilters(props: ConsigneeFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [articleList, setArticleList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [error, setError] = React.useState<any>({});
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false)
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
                        label="Consignee Name"
                        placeHolder="Enter Consignee name"
                        error={error.customerName}
                        suggestions={articleList}
                        value={filterValues.customerName}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                appDispatch(searchCustomer({ queryField: "customer.name", query: value })).then((response: any) => {
                                    response && setArticleList(setAutoCompleteListWithData(response, "customerName", "customerName"));
                                })
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ customerName: element.label }, { customerName: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ customerName: text }, { customerName: "" });
                        }}
                    />
                </div>

                <div className="form-group">
                    <EditText
                        placeholder={"Enter Code"}
                        label={"Code"}
                        value={filterValues && filterValues.code}
                        error={error.code}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ code: text }, { code: text })
                        }}
                    />

                </div>

                <div className="form-group">
                    <EditText
                        placeholder={integrationCodePlaceholder}
                        label={integrationCodeLabel}
                        value={filterValues && filterValues.clientToCustomerIntegrationId}
                        error={error.clientToCustomerIntegrationId}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ clientToCustomerIntegrationId: text }, { clientToCustomerIntegrationId: text })
                        }}
                    />

                </div>

                <div className="form-group">
                    <NumberEditText
                        placeholder="Enter Phone Number"
                        error={error.customerPhoneNumber}
                        label="Phone Number"
                        value={filterValues && filterValues.customerPhoneNumber}
                        maxLength={10}
                        onChange={(text: any) => {
                            setValues({ customerPhoneNumber: text }, { customerPhoneNumber: text })
                        }}
                    />

                </div>
                <div className="form-group">
                    <EditText
                        placeholder="Enter GST Number"
                        error={error.customerGstinNumber}
                        label="Gst Number"
                        value={filterValues && filterValues.customerGstinNumber}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ customerGstinNumber: text }, { customerGstinNumber: text })
                        }}
                    />

                </div>
                <div className="form-group">
                    <EditText
                        placeholder="Enter Email Address"
                        label="Email Address"
                        error={error.customerEmail}
                        value={filterValues && filterValues.customerEmail}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ customerEmail: text }, { customerEmail: text })
                        }}
                    />

                </div>
                <div className="form-group">
                    <EditText
                        placeholder="PAN Number"
                        label="PAN Number"
                        error={error.customerPanNumber}
                        value={filterValues && filterValues.customerPanNumber}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ customerPanNumber: text }, { customerPanNumber: text })
                        }}
                    />

                </div>
            </div>
        </FilterContainer>
    );

    function onApply() {
        if (!isFilterNullValue(filterValues.customerName) && isNullValue(filterParams.customerName)) {
            setError({ customerName: errorConsigneeName });
            return;
        }
        if (!isFilterNullValue(filterValues.code) && isNullValue(filterParams.code)) {
            setError({ code: "Enter Valid Code" });
            return;
        }
        if (!isFilterNullValue(filterValues.customerPhoneNumber) && isNullValue(filterParams.customerPhoneNumber)) {
            setError({ customerPhoneNumber: errorPhoneNumber });
            return;
        }
        if (!isFilterNullValue(filterValues.customerGstinNumber) && isNullValue(filterParams.customerGstinNumber)) {
            setError({ customerGstinNumber: errorGSTNumber });
            return;
        }
        if (!isFilterNullValue(filterValues.customerEmail) && isNullValue(filterParams.customerEmail)) {
            setError({ customerEmail: emailError });
            return;
        }
        if (!isFilterNullValue(filterValues.clientToCustomerIntegrationId) && isNullValue(filterParams.clientToCustomerIntegrationId)) {
            setError({ clientToCustomerIntegrationId: errorIntegrationCode });
            return;
        }
        if (!isFilterNullValue(filterValues.customerPanNumber) && isNullValue(filterParams.customerPanNumber)) {
            setError({ customerPanNumber: errorPanNumber });
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
            setError({ customerName: errorConsigneeName });
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
}

export default ConsigneeFilters;

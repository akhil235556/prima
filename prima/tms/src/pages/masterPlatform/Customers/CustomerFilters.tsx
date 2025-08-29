import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { emailError, errorCustomerName, errorGSTNumber, errorIntegrationCode, errorPanNumber, errorPhoneNumber, integrationCodeLabel, integrationCodePlaceholder } from '../../../base/constant/MessageUtils';
import { isFilterNullValue, isNullValue, isObjectEmpty } from "../../../base/utility/StringUtils";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from "../../../component/widgets/NumberEditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { searchCustomer } from "./CustomersApi/customersServiceActions";

interface CustomerFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
}

function CustomerFilters(props: CustomerFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [vendorList, setVendorList] = React.useState<Array<OptionType> | undefined>(undefined);
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
                        label="Customer Name"
                        placeHolder="Enter Customer name"
                        error={error.vendorName}
                        suggestions={vendorList}
                        value={filterValues.vendorName}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                appDispatch(searchCustomer({ queryField: "vendor.name", query: value })).then((response: any) => {
                                    response && setVendorList(setAutoCompleteListWithData(response, "vendorName", "vendorName"));
                                })
                            }
                        }}
                        onSelected={(element: OptionType) => {
                            setValues({ vendorName: element.label }, { vendorName: element.value });
                        }}
                        onChange={(text: string) => {
                            setValues({ vendorName: text }, { vendorName: "" });
                        }}
                    />
                </div>
                <div className="form-group">
                    <EditText
                        placeholder={integrationCodePlaceholder}
                        label={integrationCodeLabel}
                        value={filterValues && filterValues.clientToVendorIntegrationId}
                        error={error.clientToVendorIntegrationId}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ clientToVendorIntegrationId: text }, { clientToVendorIntegrationId: text })
                        }}
                    />

                </div>

                <div className="form-group">
                    <NumberEditText
                        placeholder="Enter Phone Number"
                        error={error.vendorPhoneNumber}
                        label="Phone Number"
                        value={filterValues && filterValues.vendorPhoneNumber}
                        maxLength={10}
                        onChange={(text: any) => {
                            setValues({ vendorPhoneNumber: text }, { vendorPhoneNumber: text })
                        }}
                    />

                </div>
                <div className="form-group">
                    <EditText
                        placeholder="Enter GST Number"
                        error={error.vendorGstinNumber}
                        label="Gst Number"
                        value={filterValues && filterValues.vendorGstinNumber}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ vendorGstinNumber: text }, { vendorGstinNumber: text })
                        }}
                    />

                </div>
                <div className="form-group">
                    <EditText
                        placeholder="Enter Email Address"
                        label="Email Address"
                        error={error.vendorEmail}
                        value={filterValues && filterValues.vendorEmail}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ vendorEmail: text }, { vendorEmail: text })
                        }}
                    />
                </div>
                <div className="form-group">
                    <EditText
                        placeholder="PAN Number"
                        label="PAN Number"
                        error={error.vendorPanNumber}
                        value={filterValues && filterValues.vendorPanNumber}
                        maxLength={50}
                        onChange={(text: any) => {
                            setValues({ vendorPanNumber: text }, { vendorPanNumber: text })
                        }}
                    />

                </div>
            </div>
        </FilterContainer>
    );

    function onApply() {
        if (!isFilterNullValue(filterValues.vendorName) && isNullValue(filterParams.vendorName)) {
            setError({ vendorName: errorCustomerName });
            return;
        }
        if (!isFilterNullValue(filterValues.vendorPhoneNumber) && isNullValue(filterParams.vendorPhoneNumber)) {
            setError({ vendorPhoneNumber: errorPhoneNumber });
            return;
        }
        if (!isFilterNullValue(filterValues.vendorGstinNumber) && isNullValue(filterParams.vendorGstinNumber)) {
            setError({ vendorGstinNumber: errorGSTNumber });
            return;
        }
        if (!isFilterNullValue(filterValues.vendorEmail) && isNullValue(filterParams.vendorEmail)) {
            setError({ vendorEmail: emailError });
            return;
        }
        if (!isFilterNullValue(filterValues.clientToVendorIntegrationId) && isNullValue(filterParams.clientToVendorIntegrationId)) {
            setError({ clientToVendorIntegrationId: errorIntegrationCode });
            return;
        }
        if (!isFilterNullValue(filterValues.vendorPanNumber) && isNullValue(filterParams.vendorPanNumber)) {
            setError({ vendorPanNumber: errorPanNumber });
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
            setError({ vendorName: errorCustomerName });
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

export default CustomerFilters;

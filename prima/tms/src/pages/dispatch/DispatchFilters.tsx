import { DatePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { freightTypeList, listDispatch, orderStatusList, vehicleAssignedStatusList } from "../../base/constant/ArrayList";
import {
    assignedVehicleLabel,
    destinationZone,
    destinationZonePlaceHolder,
    DropPointLabel,
    DropPointPlaceholder,
    errorLane, errorTransporter, errorVehicleNumber,
    freightTypeLabel,
    freightTypePlaceholder,
    fromDateError, fromDateLabel, fromDatePlaceholder, laneLabel,
    lanePlaceholder, originZone,
    originZonePlaceHolder,
    pickUpPointLabel,
    pickUpPointPlaceholder,
    toDateError, toDateLabel, toDatePlaceholder, transporterLabel, transporterPlaceHolder
} from '../../base/constant/MessageUtils';
import { convertDateFormat, convertDateToServerFromDate, convertDateToServerToDate, displayDateFormatter } from '../../base/utility/DateUtils';
import { isFilterNullValue, isNullValue, isObjectEmpty } from '../../base/utility/StringUtils';
import AutoComplete from "../../component/widgets/AutoComplete";
import AutoSuggest from "../../component/widgets/AutoSuggest";
import EditText from "../../component/widgets/EditText";
import { OptionType } from "../../component/widgets/widgetsInterfaces";
import FilterContainer from "../../modals/FilterModal/FilterContainer";
import { autosuggestSearchLength } from "../../moduleUtility/ConstantValues";
import { setAutoCompleteList, setAutoCompleteListWithData } from "../../moduleUtility/DataUtils";
import { searchLane } from "../../serviceActions/LaneServiceActions";
import { searchLocationList } from "../../serviceActions/LocationServiceActions";
import { searchClientPartner } from "../../serviceActions/PartnerServiceAction";
import { searchVehicleList } from "../../serviceActions/VehicleServiceActions";

interface DispatchFiltersProps {
    open: boolean,
    onClose: any,
    onApplyFilter: any
    filerChips: any,
    filerParams: any,
    isListingPage?: boolean
    addQuickSearch?: boolean
    pickUpFilters?: boolean
    showAssignVehicleFilter?: boolean
    shipmentTagList?: any
}

function DispatchFilters(props: DispatchFiltersProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onApplyFilter, filerParams, filerChips, isListingPage, pickUpFilters, addQuickSearch, showAssignVehicleFilter, shipmentTagList } = props;
    const [filterValues, setFilterValues] = React.useState<any | undefined>({});
    const [filterParams, setFilterParams] = React.useState<any | undefined>({});
    const [error, setError] = React.useState<any>({});
    const [vehicleSuggestion, setVehicleSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [isFilterChanged, setIsFilterChanged] = React.useState<boolean>(false);
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [originSuggestion, setOriginSuggestion] = React.useState<Array<OptionType> | undefined>(undefined);

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
                {isListingPage && <>
                    <div className="form-group">
                        <EditText
                            label="Order Code"
                            placeholder="Enter Order Code"
                            error={error.query}
                            value={filterValues.query}
                            maxLength={50}
                            onChange={(text: string) => {
                                setValues({ query: text }, { query: text })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <EditText
                            label="Auction Code"
                            placeholder="Enter Auction Code"
                            error={error.auctionCode}
                            value={filterValues.auctionCode}
                            maxLength={50}
                            onChange={(text: string) => {
                                const formattedText = text.replace(/\s+/g, '');
                                setValues({ auctionCode: formattedText }, { auctionCode: formattedText })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <EditText
                            label="Indent Code"
                            placeholder="Enter Indent Code"
                            error={error.indentCode}
                            value={filterValues.indentCode}
                            maxLength={50}
                            onChange={(text: string) => {
                                const formattedText = text.replace(/\s+/g, '');
                                setValues({ indentCode: formattedText }, { indentCode: formattedText })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <EditText
                            label="Shipment Reference Id"
                            placeholder="Enter Shipment Reference Id"
                            value={filterValues.shipmentRefId}
                            maxLength={50}
                            onChange={(text: string) => {
                                setValues({ shipmentRefId: text }, { shipmentRefId: text })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <AutoComplete
                            label="Shipment Tag"
                            placeHolder="Select Shipment Tag"
                            value={filterValues.shipmentTagName ? {
                                label: filterValues.shipmentTagName,
                                value: filterParams.shipmentTag
                            } : undefined}
                            options={shipmentTagList}
                            onChange={(value: OptionType) => {
                                setValues({ shipmentTagName: value.label }, { shipmentTag: value.value })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <AutoComplete
                            label="Order Status"
                            placeHolder="Select Order Status"
                            value={filterValues.orderStatusName ? {
                                label: filterValues.orderStatusName,
                                value: filterParams.orderStatusCode
                            } : undefined}
                            options={orderStatusList}
                            onChange={(value: OptionType) => {
                                setValues({ orderStatusName: value.label }, { orderStatusCode: value.value })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <AutoComplete
                            label="Freight Type"
                            placeHolder="Select Freight Type"
                            value={filterValues.freightTypeName ? {
                                label: filterValues.freightTypeName,
                                value: filterParams.freightTypeCode
                            } : undefined}
                            options={freightTypeList}
                            onChange={(value: OptionType) => {
                                setValues({ freightTypeName: value.label }, { freightTypeCode: value.value })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <AutoSuggest
                            label="Vehicle Number"
                            placeHolder="Enter Vehicle Number"
                            value={filterValues.vehicleNumber}
                            error={error.vehicleNumber}
                            suggestions={vehicleSuggestion}
                            handleSuggestionsFetchRequested={({ value }: any) => {
                                if (value.length > autosuggestSearchLength) {
                                    getVehicleList(value);
                                }
                            }}
                            onSelected={(element: OptionType) => {
                                setValues({ vehicleNumber: element.label }, { vehicleRegistrationNumber: element.label });
                            }}
                            onChange={(text: string) => {
                                setValues({ vehicleNumber: text }, { vehicleRegistrationNumber: "" });
                            }}
                        />
                    </div>
                </>
                }

                {showAssignVehicleFilter &&
                    <div className="form-group">
                        <AutoComplete
                            label={assignedVehicleLabel}
                            placeHolder={`Select ${assignedVehicleLabel}`}
                            value={filterValues.isVehicleAssignedStatus ? {
                                label: filterValues.isVehicleAssignedStatus,
                                value: filterParams.isVehicleAssigned
                            } : undefined}
                            options={vehicleAssignedStatusList}
                            onChange={(value: OptionType) => {
                                setValues({ isVehicleAssignedStatus: value.label }, { isVehicleAssigned: value.value })
                            }}
                        />
                    </div>}
                <div className="form-group">
                    <AutoComplete
                        label={freightTypeLabel}
                        placeHolder={freightTypePlaceholder}
                        value={filterValues.freightTypeName ? {
                            label: filterValues.freightTypeName,
                            value: filterParams.freightTypeCode
                        } : undefined}
                        options={freightTypeList}
                        onChange={(value: OptionType) => {
                            setValues({ freightTypeName: value.label, destinationZoneCode: undefined, originZoneCode: undefined }, { freightTypeCode: value.value, destinationZoneName: undefined, originZoneName: undefined })
                        }}
                    />
                </div>
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

                {pickUpFilters && <>
                    <div className="form-group">
                        <AutoSuggest
                            label={pickUpPointLabel}
                            placeHolder={pickUpPointPlaceholder}
                            value={filterValues.pickupLocationName}
                            error={error.pickupLocationName}
                            suggestions={originSuggestion}
                            handleSuggestionsFetchRequested={({ value }: any) => {
                                if (value.length > autosuggestSearchLength) {
                                    getSuggestionList(value, "origin");
                                }
                            }}
                            onSelected={(value: OptionType) => {
                                setValues({ pickupLocationName: value.label }, { pickupLocationCode: value.value })
                                setError({});
                                setIsFilterChanged(true);
                            }}
                            onChange={(text: string) => {
                                setValues({ pickupLocationName: text }, { pickupLocationCode: "" })
                                setError({});
                                setIsFilterChanged(true);
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <AutoSuggest
                            label={DropPointLabel}
                            placeHolder={DropPointPlaceholder}
                            value={filterValues.dropLocationName}
                            error={error.dropLocationName}
                            suggestions={originSuggestion}
                            handleSuggestionsFetchRequested={({ value }: any) => {
                                if (value.length > autosuggestSearchLength) {
                                    getSuggestionList(value, "destination");
                                }
                            }}
                            onSelected={(value: OptionType) => {
                                setValues({ dropLocationName: value.label }, { dropLocationCode: value.value })
                                setError({});
                                setIsFilterChanged(true);
                            }}
                            onChange={(text: string) => {
                                setValues({ dropLocationName: text }, { dropLocationCode: "" })
                                setError({});
                                setIsFilterChanged(true);
                            }}
                        />
                    </div>

                </>}


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
                    <label className="picker-label">{fromDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={fromDatePlaceholder}
                        hiddenLabel
                        helperText={error.orderCreatedAtFromTime}
                        format={displayDateFormatter}
                        maxDate={(filterParams.orderCreatedAtToTime) || new Date()}
                        value={filterParams.orderCreatedAtFromTime || null}
                        onChange={(date: any) => {
                            setValues({ dispatchOrderCreatedAtFromTime: convertDateFormat(date, displayDateFormatter) }, { orderCreatedAtFromTime: convertDateToServerFromDate(date) });
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="picker-label">{toDateLabel}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={toDatePlaceholder}
                        hiddenLabel
                        helperText={error.orderCreatedAtToTime}
                        format={displayDateFormatter}
                        value={filterParams.orderCreatedAtToTime || null}
                        minDate={(filterParams.orderCreatedAtFromTime) || ""}
                        onChange={(date: any) => {
                            setValues({ dispatchOrderCreatedAtToTime: convertDateFormat(date, displayDateFormatter) }, { orderCreatedAtToTime: convertDateToServerToDate(date) });
                        }}
                    />
                </div>
                <div className="form-group">
                    <EditText
                        label={originZone}
                        placeholder={originZonePlaceHolder}
                        value={filterValues.originZoneCode}
                        // disabled={filterParams.freightTypeCode === FreightType.FTL}
                        maxLength={50}
                        onChange={(text: string) => {
                            setValues({ originZoneCode: text }, { originZoneName: text })
                        }}
                    />
                </div>
                <div className="form-group">
                    <EditText
                        label={destinationZone}
                        placeholder={destinationZonePlaceHolder}
                        value={filterValues.destinationZoneCode}
                        // disabled={filterParams.freightTypeCode === FreightType.FTL}
                        maxLength={50}
                        onChange={(text: string) => {
                            setValues({ destinationZoneCode: text }, { destinationZoneName: text })
                        }}
                    />
                </div>
                {addQuickSearch &&
                    <>
                        <div className="form-group">
                            <AutoComplete
                                label="Field"
                                placeHolder="Select Field"
                                error={error.queryField}
                                value={filterValues.queryFieldLabel ? {
                                    label: filterValues.queryFieldLabel,
                                    value: filterParams.queryField
                                } : undefined}
                                options={listDispatch}
                                onChange={(value: OptionType) => {
                                    setValues({ queryFieldLabel: value.label }, { queryField: value.value });
                                    setError({})
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <EditText
                                placeholder="Search"
                                label="Search"
                                value={filterValues && filterValues.query}
                                maxLength={50}
                                error={error.query}
                                onChange={(text: any) => {
                                    setValues({ query: text }, { query: text });
                                    setError({})
                                }}
                            />
                        </div>
                    </>
                }
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
        if (isListingPage && !isFilterNullValue(filterValues.query) && isNullValue(filterParams.query)) {
            setError({ query: "Enter valid order code" });
            return;
        } else if (isListingPage && !isFilterNullValue(filterValues.statusCode) && isNullValue(filterParams.statusCode)) {
            setError({ statusCode: "Select valid order status" });
            return;
        } else if (!isFilterNullValue(filterValues.vehicleNumber) && isNullValue(filterParams.vehicleRegistrationNumber)) {
            setError({ vehicleNumber: errorVehicleNumber });
            return;
        } if (!isFilterNullValue(filterValues.pickupLocationName) && isNullValue(filterParams.pickupLocationCode)) {
            setError({
                pickupLocationName: "Enter valid pick-up point"
            });
            return false;
        } else if (!isFilterNullValue(filterValues.dropLocationName) && isNullValue(filterParams.dropLocationCode)) {
            setError({
                dropLocationName: "Enter valid drop point"
            });
            return false;
        } else if (!isFilterNullValue(filterValues.laneName) && isNullValue(filterParams.laneCode)) {
            setError({ lane: errorLane });
            return;
        } else if (!isFilterNullValue(filterValues.partnerName) && isNullValue(filterParams.partnerCode)) {
            setError({ partner: errorTransporter });
            return;
        } else if (isNullValue(filterParams.orderCreatedAtFromTime) && !isNullValue(filterParams.orderCreatedAtToTime)) {
            setError({ orderCreatedAtFromTime: fromDateError });
            return;
        } else if (isNullValue(filterParams.orderCreatedAtToTime) && !isNullValue(filterParams.orderCreatedAtFromTime)) {
            setError({ orderCreatedAtToTime: toDateError });
            return;
        }

        if (addQuickSearch) {
            if (isNullValue(filterValues.query) && !isNullValue(filterParams.queryField)) {
                setError({ query: "Enter " + filterValues.queryFieldLabel });
                return;
            } else if (!isNullValue(filterValues.query) && isNullValue(filterParams.queryField)) {
                setError({ queryField: "Select Field" });
                return;
            }
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
            if (isListingPage) {
                setError({ query: "Enter valid order code" });
            } else {
                setError({ partner: errorTransporter });
            }

        }
    }

    function getPartnerList(text: string) {
        appDispatch(searchClientPartner({ query: text })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteList(response, "partnerName", "partnerCode"))
            }
        });
    }

    function getVehicleList(text: string) {
        appDispatch(searchVehicleList({ query: text })).then((response: any) => {
            if (response) {
                setVehicleSuggestion(setAutoCompleteListWithData(response.vehicles, "vehicleNumber", "vehicleCode"))
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

    function getSuggestionList(text: string, type: string) {
        appDispatch(searchLocationList({ query: text })).then((response: any) => {
            setOriginSuggestion(setAutoCompleteListWithData(response, "locationName", "locationCode"));
        })
    }

}

export default DispatchFilters;

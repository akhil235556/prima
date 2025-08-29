import { Card, CardContent, CardHeader, TextareaAutosize } from "@material-ui/core";
import {
    KeyboardBackspace,
    Timelapse,
    Today
} from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { biddingRate, dropTypes, FreightType, ftlServiceabilityModeTypeList, serviceabilityModeTypeList, tatOptions } from '../../base/constant/ArrayList';
import {
    ceilingPriceLabel,
    dropPointLabels,
    DropPointsPlaceholder, errorDropPointLabels, errorLane,
    errorPickUpPointsLabel, laneLabel, lanePlaceholder,
    modLabel, modPlaceholder,
    pickUpPointsLabel,
    PickUpPointsPlaceholder, remarkLabel, tatLabelWithoutUnit, tatPlaceholder, VolumeLabel, volumePlaceholder
} from '../../base/constant/MessageUtils';
import { convertDateTimeServerFormat, displayDateTimeFormatter } from "../../base/utility/DateUtils";
import { isEmptyArray, isNullValue, isNullValueOrZero, tatValueConverter } from "../../base/utility/StringUtils";
import { isMobile } from "../../base/utility/ViewUtils";
import Filter from "../../component/filter/Filter";
import PageContainer from "../../component/pageContainer/PageContainer";
import AutoComplete from "../../component/widgets/AutoComplete";
import AutoSuggest from "../../component/widgets/AutoSuggest";
import Button from "../../component/widgets/button/Button";
import CardContentSkeleton from "../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import MultiSelect from "../../component/widgets/MultiSelect";
// import EditText from "../../component/widgets/EditText";
import NumberEditText from "../../component/widgets/NumberEditText";
import { OptionType } from "../../component/widgets/widgetsInterfaces";
import { autosuggestSearchLength } from "../../moduleUtility/ConstantValues";
import { setAutoCompleteList, setAutoCompleteListWithData } from "../../moduleUtility/DataUtils";
import { showAlert } from '../../redux/actions/AppActions';
import { createAuction } from "../../serviceActions/AuctionServiceActions";
import { getClientFreightTypeList } from "../../serviceActions/FreightTypeServiceActions";
import { searchLane } from "../../serviceActions/LaneServiceActions";
import { getDropPointsList } from "../../serviceActions/LocationServiceActions";
import { getServiceabilityDetails, getServiceableVehciles } from '../../serviceActions/ServiceabilityServiceActions';
import { getBasePrice } from "./AuctionUtils";

function CreateAuction() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [userParams, setUserParams] = React.useState<any>({
        scheduleType: {
            value: "Now",
            label: "Now"
        }
    });
    const [error, setError] = React.useState<any>({});
    const userInfo = useSelector((state: any) => state.appReducer.userInfo, shallowEqual);
    const [loading, setLoading] = React.useState<any>(false);
    const [start, setStartLoading] = React.useState<any>(false);
    // eslint-disable-next-line
    // const [disableTat, setDisableTat] = React.useState<any>(true);
    const [tatValue, setTatValue] = React.useState<any>(tatOptions[0]);
    const [freightTypeList, setFreightTypeList] = React.useState<Array<OptionType> | undefined>(undefined)
    // const vehicleTypeList = useSelector((state: any) =>
    //     state.appReducer.vehicleTypeList, shallowEqual
    // );
    const scheduleType = [{
        value: "Now",
        label: "Now"
    }, {
        value: "Scheduled",
        label: "Scheduled"
    }]

    const [pickupPointsList, setPickUpPointsList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [dropPointsList, setDropPointsList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [serviceablevehicleTypeList, setServiceableVehcileTypeList] = React.useState<any>([])

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            let promiseArray: any = [appDispatch(getClientFreightTypeList())]
            Promise.all(promiseArray).then((response: any) => {
                response[0] && setFreightTypeList(setAutoCompleteList(response[0], "freightTypeName", "freightTypeName"));
                setLoading(false)
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (userParams && userParams.freightType && userParams.lane && userParams.serviceabilityMode) {
            if (userParams.freightType.value === "FTL") {
                let queryParams = {
                    freightTypeCode: userParams.freightType.value,
                    laneCode: userParams.lane.value,
                    // partnerCode: userParams.partner.value,
                    serviceabilityModeCode: userParams.serviceabilityMode.value
                }
                appDispatch(getServiceableVehciles(queryParams)).then((vehicleTypeResponse: any) => {
                    if (vehicleTypeResponse && vehicleTypeResponse.length > 0) {
                        setServiceableVehcileTypeList(setAutoCompleteListWithData(vehicleTypeResponse, "vehicleTypeName", "vehicleTypeCode"))
                    }
                })
            }
        }
        // eslint-disable-next-line
    }, [userParams.freightType, userParams.lane, userParams.serviceabilityMode])

    return (
        <div className="create-auction-wrapper">
            {/* <WarningModal
                open={openWarningModal}
                onSuccess={() => {
                    setOpenWarningModal(false)
                }}
                onClose={() => {
                    setOpenWarningModal(false)
                }}
                info={"You’re not authorised to modify TAT"}
            /> */}
            <div className="filter-wrap">
                <Filter
                    pageTitle="Create Auction"
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                />
            </div>

            <PageContainer>
                <div className="row auction-card-row">
                    <div className="col-md-6 pr-md-4">
                        <Card className="creat-contract-wrapp creat-wrapp">
                            <CardHeader className="creat-contract-header"
                                title="Lane Detail"
                                onClick={() => {
                                }}
                            />
                            {loading ?
                                <CardContentSkeleton
                                    row={7}
                                    column={1}
                                /> :
                                <CardContent className="creat-contract-content">
                                    <div className="custom-form-row row">
                                        <div className="form-group col-12">
                                            <AutoSuggest
                                                label={laneLabel}
                                                mandatory
                                                placeHolder={lanePlaceholder}
                                                value={userParams.laneName}
                                                suggestions={laneList}
                                                error={error.lane}
                                                handleSuggestionsFetchRequested={({ value }: any) => {
                                                    if (value.length > autosuggestSearchLength) {
                                                        getLaneList(value);
                                                    }
                                                }}
                                                onSelected={(element: OptionType) => {
                                                    getDropsList(element.value)
                                                    getTATInfo(element.value, userParams.freightType && userParams.freightType.value,
                                                        userParams.serviceabilityMode && userParams.serviceabilityMode.value,
                                                        {
                                                            laneName: element.label,
                                                            lane: element,
                                                            originLocationName: element.data.origin.name,
                                                            destinationLocationName: element.data.destination.name,
                                                        }, userParams.vehicleType && userParams.vehicleType.value);
                                                }}
                                                onChange={(text: string) => {
                                                    // setDisableTat(true);
                                                    setUserParams({
                                                        ...userParams,
                                                        lane: undefined,
                                                        laneName: text,
                                                        originLocationName: undefined,
                                                        destinationLocationName: undefined,
                                                        tat: undefined,
                                                        pickupPoints: [],
                                                        dropPoints: [],
                                                        vehicleType: undefined
                                                    });
                                                    setServiceableVehcileTypeList([])
                                                    setPickUpPointsList([]);
                                                    setDropPointsList([]);
                                                }}
                                            />
                                            {/* < CustomTooltipTable
                                                valueClassName="value"
                                                tableColumn={[{ description: "Location", name: "name" }, { description: "Location Type", name: "value" }]}
                                                tableData={undefined}
                                                showStringValue={true}
                                                customIcon={<img src="/images/map-pin.png" alt="map-pin" />}
                                                style={{
                                                    tooltip: {
                                                        minWidth: isMobile ? 320 : 320,
                                                        maxWidth: isMobile ? 320 : 400,
                                                    },
                                                    popper: {
                                                        marginTop: '3px',
                                                    }
                                                    // tooltipPlacementBottom: {
                                                    //     marginTop: '20px',
                                                    // }
                                                }}
                                            /> */}
                                        </div>
                                        <div className="form-group col-12">
                                            <MultiSelect
                                                label={pickUpPointsLabel}
                                                placeHolder={PickUpPointsPlaceholder}
                                                mandatory
                                                error={error.pickupPoints}
                                                value={userParams.pickupPoints}
                                                options={pickupPointsList}
                                                onChange={(value: any) => {
                                                    setError({});
                                                    setUserParams({
                                                        ...userParams,
                                                        pickupPoints: value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-12">
                                            <MultiSelect
                                                label={dropPointLabels}
                                                placeHolder={DropPointsPlaceholder}
                                                mandatory
                                                error={error.dropPoints}
                                                value={userParams.dropPoints}
                                                options={dropPointsList}
                                                onChange={(value: any) => {
                                                    setError({});
                                                    setUserParams({
                                                        ...userParams,
                                                        dropPoints: value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-md-12">
                                            <AutoComplete
                                                label="Freight Type"
                                                mandatory
                                                placeHolder="Freight Type"
                                                value={userParams.freightType}
                                                error={error.freightType}
                                                options={freightTypeList}
                                                onChange={(element: any) => {
                                                    let mod = element.label === FreightType.FTL ? ftlServiceabilityModeTypeList[0] : userParams.serviceabilityModeCode;
                                                    getTATInfo(userParams.lane && userParams.lane.value, element.value,
                                                        mod && mod.value, {
                                                        freightType: element,
                                                        serviceabilityMode: mod
                                                    }, userParams.vehicleType && userParams.vehicleType.value);
                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-md-12">
                                            <AutoComplete
                                                label={modLabel}
                                                placeHolder={modPlaceholder}
                                                options={(userParams.freightType && userParams.freightType.label === FreightType.FTL) ? ftlServiceabilityModeTypeList
                                                    : serviceabilityModeTypeList}
                                                mandatory
                                                error={error.serviceabilityModeName}
                                                value={userParams.serviceabilityMode}
                                                onChange={(element: OptionType) => {
                                                    getTATInfo(userParams.lane && userParams.lane.value,
                                                        userParams.freightType && userParams.freightType.value, element.value,
                                                        { serviceabilityMode: element }, userParams.vehicleType && userParams.vehicleType.value);
                                                }}
                                            />
                                        </div>
                                        {userParams.freightType && userParams.freightType.value === FreightType.PTL &&
                                            <>
                                                <div className="form-group col-12">
                                                    <NumberEditText
                                                        label="Weight (Kg)"
                                                        mandatory
                                                        placeholder="Weight (Kg)"
                                                        // disabled={false}
                                                        value={userParams.load}
                                                        allowNegative={false}
                                                        required
                                                        error={error.load}
                                                        maxLength={8}
                                                        onChange={(text: any) => {
                                                            setUserParams({
                                                                ...userParams,
                                                                load: Number(text)
                                                            })
                                                            setError({});
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group col-12">
                                                    <NumberEditText
                                                        label={VolumeLabel}
                                                        mandatory
                                                        placeholder={volumePlaceholder}
                                                        value={userParams.volume}
                                                        allowNegative={false}
                                                        required
                                                        error={error.volume}
                                                        maxLength={8}
                                                        onChange={(text: any) => {
                                                            setUserParams({
                                                                ...userParams,
                                                                volume: Number(text)
                                                            })
                                                            setError({});
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        }
                                        {userParams.freightType && userParams.freightType.value === FreightType.FTL &&
                                            <>
                                                <div className="form-group col-md-12">
                                                    <AutoComplete
                                                        label="Vehicle Type"
                                                        mandatory
                                                        placeHolder="Vehicle Type"
                                                        value={userParams.vehicleType}
                                                        error={error.vehicleType}
                                                        options={serviceablevehicleTypeList}
                                                        onChange={(element: OptionType) => {
                                                            let mod = ftlServiceabilityModeTypeList[0];
                                                            getTATInfo(userParams.lane && userParams.lane.value,
                                                                userParams.freightType && userParams.freightType.value,
                                                                mod && mod.value,
                                                                { vehicleType: element }, element.value);
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group col-12">
                                                    <NumberEditText
                                                        label="Number of vehicles"
                                                        mandatory
                                                        placeholder="Number of vehicles"
                                                        // disabled={false}
                                                        value={userParams.noOfVehicles}
                                                        allowNegative={false}
                                                        required
                                                        error={error.noOfVehicles}
                                                        maxLength={5}
                                                        onChange={(text: any) => {
                                                            setUserParams({
                                                                ...userParams,
                                                                noOfVehicles: Number(text)
                                                            })
                                                            setError({});
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        }
                                        <div className="form-group col-md-5 col-6">
                                            <AutoComplete
                                                label={tatLabelWithoutUnit}
                                                mandatory
                                                //isDisabled={disableTat}
                                                isDisabled={true}
                                                placeHolder={tatPlaceholder}
                                                value={tatValue}
                                                error={error.vehicleType}
                                                options={tatOptions}
                                                onChange={(element: OptionType) => {
                                                    setTatValue(element);
                                                    setUserParams({
                                                        ...userParams,
                                                        tat: ""
                                                    })
                                                    setError({});
                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-md-7 col-6 tat-no-field">
                                            <NumberEditText
                                                label={tatLabelWithoutUnit}
                                                mandatory
                                                placeholder={tatPlaceholder}
                                                //disabled={disableTat}
                                                disabled={true}
                                                value={userParams.tat}
                                                allowNegative={false}
                                                required
                                                maxLength={5}
                                                error={error.tat}
                                                onChange={(text: any) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        tat: Number(text)
                                                    })
                                                    setError({});
                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-12">
                                            <label className="picker-label">{"Placement Date and Time"}<span className="mandatory-flied">*</span></label>
                                            <DateTimePicker
                                                className="custom-date-picker"
                                                placeholder="Placement Date and Time"
                                                hiddenLabel
                                                disablePast
                                                helperText={error.vehicleRequiredDatetime}
                                                format={displayDateTimeFormatter}
                                                value={userParams.vehicleRequiredDatetime || null}
                                                onChange={(date: any) => {
                                                    // let tatValueDiff:any= userParams.tat;
                                                    // if(userParams && userParams.appointmentDateTime ){
                                                    // tatValueDiff=setTatByDifference(date,userParams.appointmentDateTime)
                                                    // }
                                                    setUserParams({
                                                        ...userParams,
                                                        vehicleRequiredDatetime: convertDateTimeServerFormat(date),
                                                        //tat:tatValueDiff
                                                    })
                                                    setError({})
                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-12">
                                            <label className="picker-label">{"Appointment Date and Time"}</label>
                                            <DateTimePicker
                                                className="custom-date-picker"
                                                placeholder="Appointment Date and Time"
                                                hiddenLabel
                                                disablePast
                                                // helperText={error.appointmentDateTime}
                                                format={displayDateTimeFormatter}
                                                value={userParams.appointmentDateTime || null}
                                                onChange={(date: any) => {
                                                    // let tatValueDiff:any= userParams.tat;
                                                    // if(userParams && userParams.vehicleRequiredDatetime){
                                                    //  tatValueDiff=setTatByDifference(userParams.vehicleRequiredDatetime,date)

                                                    // }

                                                    setUserParams({
                                                        ...userParams,
                                                        appointmentDateTime: convertDateTimeServerFormat(date),
                                                        // tat:tatValueDiff
                                                    })
                                                    setError({})
                                                }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>}
                        </Card>
                    </div>

                    <div className="col-md-6 pl-md-4">
                        <Card className="creat-contract-wrapp creat-wrapp">
                            <CardHeader className="creat-contract-header"
                                title="Auction Detail"
                                onClick={() => {
                                }}
                            />
                            {loading ?
                                <CardContentSkeleton
                                    row={3}
                                    column={1}
                                /> :
                                <CardContent className="creat-contract-content">
                                    <div className="custom-form-row row">
                                        <div className="form-group col-12">
                                            <NumberEditText
                                                label={ceilingPriceLabel}
                                                // mandatory
                                                placeholder="Ceiling Price"
                                                disabled={false}
                                                value={userParams.basePrice}
                                                allowNegative={false}
                                                // error={error.basePrice}
                                                required
                                                maxLength={7}
                                                onChange={(text: any) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        basePrice: Number(text)
                                                    })
                                                    setError({})
                                                }}
                                            />
                                        </div>
                                        {userParams.freightType && userParams.freightType.value === FreightType.PTL &&
                                            <div className="form-group col-12">
                                                <AutoComplete
                                                    label="Bidding Rate Criteria"
                                                    placeHolder="Bidding Rate Criteria"
                                                    value={userParams.biddingRateCriteria}
                                                    error={error.biddingRateCriteria}
                                                    options={biddingRate}
                                                    onChange={(value: any) => {
                                                        setUserParams({
                                                            ...userParams,
                                                            biddingRateCriteria: value
                                                        })
                                                        setError({});
                                                    }}
                                                />
                                            </div>
                                        }
                                        <div className="form-group col-12">
                                            <NumberEditText
                                                label="Duration Time (Minutes)"
                                                mandatory
                                                placeholder="Duration Time"
                                                disabled={false}
                                                error={error.duration}
                                                value={userParams.duration}
                                                allowNegative={false}
                                                required
                                                maxLength={5}
                                                onChange={(text: any) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        duration: Number(text)
                                                    })
                                                    setError({})
                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-md-12">
                                            <AutoComplete
                                                label="Schedule Type"
                                                mandatory
                                                placeHolder="Schedule Type"
                                                error={error.scheduleType}
                                                value={userParams.scheduleType}
                                                options={scheduleType}
                                                onChange={(value: any) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        scheduleType: value
                                                    })
                                                    setError({})
                                                }}
                                            />
                                        </div>
                                        {userParams.scheduleType && userParams.scheduleType.value === "Scheduled" &&
                                            <div className="form-group col-12">
                                                <label className="picker-label">{"Schedule Date and Time"}<span className="mandatory-flied">*</span></label>
                                                <DateTimePicker
                                                    className="custom-date-picker"
                                                    placeholder="Schedule Date and Time"
                                                    hiddenLabel
                                                    helperText={error.scheduleTime}
                                                    format={displayDateTimeFormatter}
                                                    value={userParams.scheduleTime || null}
                                                    onChange={(date: any) => {
                                                        setUserParams({
                                                            ...userParams,
                                                            scheduleTime: convertDateTimeServerFormat(date)
                                                        })
                                                        setError({})
                                                    }}
                                                />
                                            </div>}
                                        <div className="auction-remarks form-group col-md-12">
                                            <label>Remark</label>
                                            <TextareaAutosize
                                                rowsMax={2}
                                                rowsMin={2}
                                                aria-label="maximum height"
                                                placeholder={remarkLabel}
                                                value={userParams.remarks}
                                                onChange={(event: any) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        remarks: event.target.value
                                                    })
                                                    setError({})
                                                }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>}
                        </Card>

                        <div className="text-right">

                            <Button
                                loading={start}
                                buttonStyle="btn-blue"
                                title={(userParams.scheduleType && userParams.scheduleType.value === "Scheduled") ? "Schedule" : "Start"}
                                leftIcon={(userParams.scheduleType && userParams.scheduleType.value === "Scheduled") ? <Today /> : <Timelapse />}
                                onClick={() => {
                                    if (validateData()) {
                                        setStartLoading(true)
                                        let params: any = {
                                            basePrice: getBasePrice(userParams),
                                            duration: userParams.duration,
                                            biddingRateCriteria: userParams.biddingRateCriteria && userParams.biddingRateCriteria.value,
                                            lane: {
                                                destinationLocationCode: userParams.lane.data.destination.code,
                                                destinationLocationName: userParams.destinationLocationName,
                                                freightType: userParams.freightType.value,
                                                laneCode: userParams.lane.value,
                                                laneName: userParams.lane.data.laneName,
                                                originLocationCode: userParams.lane.data.origin.code,
                                                originLocationName: userParams.originLocationName,
                                                tat: tatValueConverter(tatValue.value, userParams.tat),
                                                vehicleRequiredDatetime: userParams.vehicleRequiredDatetime,
                                                appointmentDateTime: userParams.appointmentDateTime,
                                                serviceabilityModeCode: userParams.serviceabilityMode.value,
                                                serviceabilityModeName: userParams.serviceabilityMode.label,
                                            }
                                        }
                                        let auctionLocations: any = [];
                                        userParams.pickupPoints && userParams.pickupPoints.forEach((item: any) => {
                                            auctionLocations.push({
                                                parentLocationCode: (item.data && item.data.parent) ? item.data.parent.locationCode : item.value,
                                                parentLocationName: (item.data && item.data.parent) ? item.data.parent.locationName : item.label,
                                                locationCode: item.value,
                                                locationName: item.label,
                                                locationAddress: item.data.address,
                                                locationType: dropTypes.PICKUP
                                            })
                                        })
                                        userParams.dropPoints && userParams.dropPoints.forEach((item: any) => {
                                            auctionLocations.push({
                                                parentLocationCode: (item.data && item.data.parent) ? item.data.parent.locationCode : item.value,
                                                parentLocationName: (item.data && item.data.parent) ? item.data.parent.locationName : item.label,
                                                locationCode: item.value,
                                                locationName: item.label,
                                                locationAddress: item.data.address,
                                                locationType: dropTypes.DROP
                                            })
                                        })
                                        params.auctionLocations = auctionLocations;
                                        if (userParams.scheduleType.value === "Scheduled") {
                                            params.scheduleTime = userParams.scheduleTime
                                        }
                                        if (userParams.freightType.value === FreightType.PTL) {
                                            params.lane.load = userParams.load;
                                            params.lane.volume = userParams.volume;
                                        }
                                        if (userParams.freightType.value === FreightType.FTL) {
                                            params.lane.vehicleType = userParams.vehicleType.label;
                                            params.lane.vehicleTypeCode = userParams.vehicleType.value
                                            params.lane.noOfVehicles = userParams.noOfVehicles
                                        }
                                        if (userParams.remarks) {
                                            params.remarks = userParams.remarks;
                                        }
                                        appDispatch(createAuction(params)).then((response: any) => {
                                            setStartLoading(false)
                                            if (response) {
                                                response.message && appDispatch(showAlert(response.message));
                                                setUserParams({});
                                                history.goBack();
                                            }
                                        })
                                    }
                                }}
                            />

                        </div>
                    </div>
                </div>
            </PageContainer>
        </div >
    );

    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                setLaneList(setAutoCompleteListWithData(response, "laneName", "laneCode"))
            }
        });
    }

    function getDropsList(text: string) {
        appDispatch(getDropPointsList({ laneCode: text })).then((response: any) => {
            if (response) {
                setPickUpPointsList(setAutoCompleteListWithData(response.pickupList, "locationName", "locationCode"))
                setDropPointsList(setAutoCompleteListWithData(response.dropList, "locationName", "locationCode"))
            }
        });
    }

    function getTATInfo(laneCode: string, FreightTypeLabel: string, mod: string, parameters: any, vehicleTypeCode: string) {
        if (laneCode && FreightTypeLabel && mod &&
            ((FreightTypeLabel === FreightType.FTL && vehicleTypeCode) || FreightTypeLabel === FreightType.PTL)) {
            let params: any = {
                freightTypeCode: FreightTypeLabel,
                laneCode: laneCode,
                serviceabilityModeCode: mod,
            };
            if (FreightTypeLabel === FreightType.FTL && vehicleTypeCode) {
                params.vehicleTypeCode = vehicleTypeCode
            }

            appDispatch(getServiceabilityDetails(params)).then((response: any) => {
                if (response && response.tat) {
                    setUserParams({
                        ...userParams,
                        ...parameters,
                        tat: Number(response.tat)
                    })
                    if (userInfo && userInfo.isAdminUser) {
                        // setDisableTat(false);
                    }
                    setError({});
                } else {
                    setUserParams({
                        ...userParams,
                        ...parameters,
                        tat: ""
                    })
                    // setDisableTat(true);
                    setError({});
                    appDispatch(showAlert("Serviceability not found", false));
                }
            });
        } else {
            setUserParams({
                ...userParams,
                ...parameters,
                tat: ""
            })
            setError({});
            // setDisableTat(true);
        }
    }

    function validateData() {
        if (userParams.lane === undefined) {
            setError({
                lane: errorLane
            });
            return false;
        } else if (isEmptyArray(userParams.pickupPoints)) {
            setError({
                pickupPoints: errorPickUpPointsLabel
            });
            return false;
        } else if (isEmptyArray(userParams.dropPoints)) {
            setError({
                dropPoints: errorDropPointLabels
            });
            return false;
        } else if (isNullValue(userParams.freightType)) {
            setError({
                freightType: "Enter Freight Type"
            });
            return false;
        } else if (isNullValue(userParams.serviceabilityMode)) {
            setError({
                serviceabilityModeName: "Enter Mode of Transportation"
            });
            return false;
        } else if (userParams.freightType && userParams.freightType.value === FreightType.FTL && isNullValue(userParams.vehicleType)) {
            setError({
                vehicleType: "Enter Vehicle Type"
            });
            return false;
        } else if (userParams.freightType && userParams.freightType.value === FreightType.FTL && isNullValueOrZero(userParams.noOfVehicles)) {
            setError({
                noOfVehicles: "Enter Number of Vehicles"
            });
            return false;
        } else if (userParams.freightType && userParams.freightType.value === FreightType.PTL && isNullValueOrZero(userParams.load)) {
            setError({
                load: "Enter Weight"
            });
            return false;
        } else if (userParams.freightType && userParams.freightType.value === FreightType.PTL && isNullValueOrZero(userParams.volume)) {
            setError({
                volume: "Enter Volume"
            });
            return false;
        } else if (isNullValueOrZero(userParams.tat)) {
            setError({
                tat: "Enter TAT"
            });
            return false;
        } else if (isNullValue(userParams.vehicleRequiredDatetime)) {
            setError({
                vehicleRequiredDatetime: "Enter Placement Date and Time"
            });
            return false;
        }
        // else if (isNullValue(userParams.appointmentDateTime)) {
        //     setError({
        //         appointmentDateTime: "Enter Appointment Date and Time"
        //     });
        //     return false;
        // }
        // else if (isNullValueOrZero(userParams.basePrice)) {
        //     setError({
        //         basePrice: "Enter Ceiling Price"
        //     });
        //     return false;
        // }
        else if (isNullValueOrZero(userParams.duration)) {
            setError({
                duration: "Enter Duration Time"
            });
            return false;
        } else if (userParams.scheduleType.value === "Scheduled" && isNullValue(userParams.scheduleTime)) {
            setError({
                scheduleTime: "Enter Schedule Time"
            });
            return false;
        }
        return true;
    }

}
export default CreateAuction;

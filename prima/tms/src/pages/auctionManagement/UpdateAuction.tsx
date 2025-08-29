import { Card, CardContent, CardHeader, TextareaAutosize } from "@material-ui/core";
import { Cancel, Create, KeyboardBackspace, Timelapse } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { biddingRate, dropTypes, FreightType, ftlServiceabilityModeTypeList, serviceabilityModeTypeList, tatOptions } from "../../base/constant/ArrayList";
import { ceilingPriceLabel, dropPointLabels, DropPointsPlaceholder, errorDropPointLabels, errorLane, errorPickUpPointsLabel, laneLabel, lanePlaceholder, modLabel, modPlaceholder, pickUpPointsLabel, PickUpPointsPlaceholder, remarkLabel, tatLabelWithoutUnit, tatPlaceholder, VolumeLabel, volumePlaceholder } from '../../base/constant/MessageUtils';
import { convertDateTimeServerFormat, displayDateTimeFormatter } from "../../base/utility/DateUtils";
import { isNullValue, isNullValueOrZero, tatValueConverter } from "../../base/utility/StringUtils";
import { isMobile } from "../../base/utility/ViewUtils";
import Filter from "../../component/filter/Filter";
import PageContainer from "../../component/pageContainer/PageContainer";
import AutoComplete from "../../component/widgets/AutoComplete";
import AutoSuggest from "../../component/widgets/AutoSuggest";
import Button from "../../component/widgets/button/Button";
import CardContentSkeleton from "../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import EditText from "../../component/widgets/EditText";
import MultiSelect from "../../component/widgets/MultiSelect";
import NumberEditText from "../../component/widgets/NumberEditText";
import { OptionType } from "../../component/widgets/widgetsInterfaces";
import { autosuggestSearchLength } from "../../moduleUtility/ConstantValues";
import { setAutoCompleteList, setAutoCompleteListWithData } from "../../moduleUtility/DataUtils";
import { showAlert } from '../../redux/actions/AppActions';
import { getAuctionDetails, updateAuction } from '../../serviceActions/AuctionServiceActions';
import { getClientFreightTypeList } from "../../serviceActions/FreightTypeServiceActions";
import { searchLane } from "../../serviceActions/LaneServiceActions";
import { getAllVehicleTypeList } from "../../serviceActions/VehicleTypeServiceActions";
import { getBasePrice } from "./AuctionUtils";
import CancelAuctionModal from './CancelAuctionModal';


function CreateAuction() {
    const history = useHistory();
    const appDispatch = useDispatch();
    const { id } = useParams();
    const [laneList, setLaneList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<any>(false);
    const [valueUpdated, isValueUpdated] = React.useState<any>(false);
    const [cancelModal, OpenCancelModal] = React.useState<any>(false);
    const [editable, setEditable] = React.useState<any>(false);
    const [start, setStartLoading] = React.useState<any>(false);
    const [tatValue, setTatValue] = React.useState<any>(tatOptions[0]);
    const [freightTypeList, setFreightTypeList] = React.useState<Array<OptionType> | undefined>(undefined)
    const userInfo = useSelector((state: any) => state.appReducer.userInfo, shallowEqual);
    // eslint-disable-next-line
    const [disableTat, setDisableTat] = React.useState<any>(true);
    const vehicleTypeList = useSelector((state: any) =>
        state.appReducer.vehicleTypeList, shallowEqual
    );
    const scheduleType = [{
        value: "Now",
        label: "Now"
    }, {
        value: "Scheduled",
        label: "Scheduled"
    }]

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            let promiseArray: any = [appDispatch(getAuctionDetails({ id: id })), appDispatch(getAllVehicleTypeList()), appDispatch(getClientFreightTypeList())]
            Promise.all(promiseArray).then((response: any) => {
                if (response[0]) {
                    var pickUp: any = [];
                    var drop: any = [];
                    pickUp = response[0].auctionLocations && response[0].auctionLocations.filter((item: any) => item.locationType === dropTypes.PICKUP)
                    drop = response[0].auctionLocations && response[0].auctionLocations.filter((item: any) => item.locationType === dropTypes.DROP)
                    setUserParams({
                        ...userParams,
                        auctionCode: response[0].auctionCode,
                        auctionLocations: response[0].auctionLocations,
                        basePrice: showPTLPerKg(response[0]),
                        duration: response[0].duration,
                        biddingRateCriteria: {
                            label: response[0].biddingRateCriteria,
                            value: response[0].biddingRateCriteria,
                        },
                        dropPoints: setAutoCompleteListWithData(drop, "locationName", "locationCode"),
                        pickupPoints: setAutoCompleteListWithData(pickUp, "locationName", "locationCode"),
                        originLocationName: response[0].lane.originLocationName,
                        destinationLocationName: response[0].lane.destinationLocationName,
                        freightType: {
                            label: response[0].lane.freightType,
                            value: response[0].lane.freightType
                        },
                        lane: response[0].lane,
                        laneName: response[0].lane.laneName,
                        tat: response[0].lane.tat,
                        vehicleRequiredDatetime: response[0].lane.vehicleRequiredDatetime,
                        appointmentDateTime: response[0].lane.appointmentDateTime,
                        scheduleType: {
                            label: response[0].status,
                            value: response[0].status
                        },
                        load: response[0].lane.load,
                        volume: response[0].lane.volume,
                        noOfVehicles: response[0].lane.noOfVehicles,
                        vehicleType: {
                            label: response[0].lane.vehicleType,
                            value: response[0].lane.vehicleTypeCode
                        },
                        scheduleTime: response[0].scheduleTime,
                        serviceabilityMode: {
                            label: response[0].lane.serviceabilityModeName,
                            value: response[0].lane.serviceabilityModeCode
                        },
                        remarks: response[0].remarks
                    })
                }
                response[2] && setFreightTypeList(setAutoCompleteList(response[2], "freightTypeName", "freightTypeName"));
                setLoading(false)
            })
        }
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <div className="create-auction-wrapper">
            <div className="filter-wrap">
                <Filter
                    pageTitle="Auction Detail"
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}

                >
                    {!editable && userParams.scheduleType && userParams.scheduleType.value === "Scheduled" &&
                        <Button
                            buttonStyle="btn-blue"
                            title={isMobile ? "" : "Edit"}
                            loading={loading}
                            leftIcon={<Create />}
                            onClick={() => {
                                setEditable(true);
                                if (userInfo && userInfo.isAdminUser) {
                                    setDisableTat(false);
                                }
                            }}
                        />}
                </Filter>
            </div>

            <CancelAuctionModal
                open={cancelModal}
                selectedElement={userParams && userParams.auctionCode}
                onSuccess={() => {
                    // dispatch(setSelectedElement(undefined));
                    OpenCancelModal(false);
                    history.goBack();
                }}
                onClose={() => {
                    // dispatch(setSelectedElement(undefined));
                    OpenCancelModal(false);
                }}
            />

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
                                                isDisabled={true}
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
                                                    setUserParams({
                                                        ...userParams,
                                                        laneName: element.label,
                                                        lane: element,
                                                        originLocationName: element.data.origin.name,
                                                        destinationLocationName: element.data.destination.name,
                                                        tat: element.data.tat
                                                    });
                                                    isValueUpdated(true);
                                                    setError({});
                                                }}
                                                onChange={(text: string) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        lane: undefined,
                                                        laneName: text,
                                                        originLocationName: undefined,
                                                        destinationLocationName: undefined,
                                                        tat: undefined
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-12">
                                            {/* <EditText
                                                label="Origin"
                                                mandatory
                                                placeholder="Origin"
                                                disabled={true}
                                                value={userParams.originLocationName}
                                                maxLength={50}
                                                onChange={() => {

                                                }}
                                            /> */}
                                            <MultiSelect
                                                label={pickUpPointsLabel}
                                                placeHolder={PickUpPointsPlaceholder}
                                                mandatory
                                                isDisabled={true}
                                                error={error.pickupPoints}
                                                value={userParams.pickupPoints}
                                                options={[]}
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
                                            {/* <EditText
                                                label="Destination"
                                                mandatory
                                                placeholder="Destination"
                                                disabled={true}
                                                value={userParams.destinationLocationName}
                                                maxLength={50}
                                                onChange={() => {

                                                }}
                                            /> */}
                                            <MultiSelect
                                                label={dropPointLabels}
                                                placeHolder={DropPointsPlaceholder}
                                                mandatory
                                                isDisabled={true}
                                                error={error.dropPoints}
                                                value={userParams.dropPoints}
                                                options={[]}
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
                                                isDisabled={true}
                                                placeHolder="Freight Type"
                                                value={userParams.freightType}
                                                error={error.freightType}
                                                options={freightTypeList}
                                                onChange={(element: any) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        freightType: element
                                                    })
                                                    isValueUpdated(true);
                                                    setError({});
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
                                                isDisabled={true}
                                                error={error.serviceabilityModeName}
                                                value={userParams.serviceabilityMode}
                                                onChange={(element: OptionType) => {
                                                    // getTATInfo(userParams.lane && userParams.lane.value,
                                                    //     userParams.freightType && userParams.freightType.value, element.value, { serviceabilityMode: element });
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
                                                        disabled={!editable}
                                                        value={userParams.load}
                                                        allowNegative={false}
                                                        required
                                                        error={error.load}
                                                        maxLength={5}
                                                        onChange={(text: any) => {
                                                            setUserParams({
                                                                ...userParams,
                                                                load: Number(text)
                                                            })
                                                            isValueUpdated(true);
                                                            setError({});
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group col-12">
                                                    <NumberEditText
                                                        label={VolumeLabel}
                                                        placeholder={volumePlaceholder}
                                                        mandatory
                                                        disabled={!editable}
                                                        value={userParams.volume}
                                                        allowNegative={false}
                                                        required
                                                        error={error.volume}
                                                        maxLength={5}
                                                        onChange={(text: any) => {
                                                            setUserParams({
                                                                ...userParams,
                                                                volume: Number(text)
                                                            })
                                                            isValueUpdated(true);
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
                                                        isDisabled={true}
                                                        placeHolder="Vehicle Type"
                                                        value={userParams.vehicleType}
                                                        error={error.vehicleType}
                                                        options={setAutoCompleteListWithData(vehicleTypeList, "type", "code")}
                                                        onChange={(element: OptionType) => {
                                                            setUserParams({
                                                                ...userParams,
                                                                vehicleType: element,
                                                            })
                                                            isValueUpdated(true);
                                                            setError({});
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group col-12">
                                                    <NumberEditText
                                                        label="Number of vehicles"
                                                        mandatory
                                                        placeholder="Number of vehicles"
                                                        disabled={!editable}
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
                                                            isValueUpdated(true);
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
                                                // isDisabled={disableTat}
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
                                                // disabled={disableTat}
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
                                                    isValueUpdated(true);
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
                                                disabled={!editable}
                                                helperText={error.vehicleRequiredDatetime}
                                                format={displayDateTimeFormatter}
                                                value={userParams.vehicleRequiredDatetime || null}
                                                onChange={(date: any) => {
                                                    // let tatValueDiff:any= userParams.tat;
                                                    // if(userParams && userParams.appointmentDateTime){
                                                    // tatValueDiff=setTatByDifference(date,userParams.appointmentDateTime)
                                                    // }
                                                    setUserParams({
                                                        ...userParams,
                                                        vehicleRequiredDatetime: convertDateTimeServerFormat(date),
                                                        //tat:tatValueDiff
                                                    })
                                                    isValueUpdated(true);
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
                                                disabled={!editable}
                                                // helperText={error.appointmentDateTime}
                                                format={displayDateTimeFormatter}
                                                value={userParams.appointmentDateTime || null}
                                                onChange={(date: any) => {
                                                    // let tatValueDiff:any = userParams.tat;
                                                    // if(userParams && userParams.vehicleRequiredDatetime){
                                                    //  tatValueDiff=setTatByDifference(userParams.vehicleRequiredDatetime,date)

                                                    // }
                                                    setUserParams({
                                                        ...userParams,
                                                        appointmentDateTime: convertDateTimeServerFormat(date),
                                                        //tat:tatValueDiff
                                                    })
                                                    isValueUpdated(true);
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
                                                placeholder="Ceiling Price"
                                                disabled={!editable}
                                                value={userParams.basePrice}
                                                error={error.basePrice}
                                                allowNegative={false}
                                                required
                                                maxLength={7}
                                                onChange={(text: any) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        basePrice: Number(text)
                                                    })
                                                    isValueUpdated(true);
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
                                                    isDisabled={!editable}
                                                    options={biddingRate}
                                                    onChange={(value: any) => {
                                                        setUserParams({
                                                            ...userParams,
                                                            biddingRateCriteria: value
                                                        })
                                                        isValueUpdated(true);
                                                        setError({});
                                                    }}
                                                />
                                            </div>
                                        }
                                        <div className="form-group col-12">
                                            <NumberEditText
                                                label="Duration Time (Minutes)"
                                                mandatory
                                                placeholder="Duration Time (Minutes)"
                                                disabled={!editable}
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
                                                    isValueUpdated(true);
                                                    setError({})
                                                }}
                                            />
                                        </div>
                                        {userParams.scheduleType && userParams.scheduleType.value === "Scheduled" ?
                                            <div className="form-group col-md-12">
                                                <AutoComplete
                                                    label="Schedule Type"
                                                    mandatory
                                                    isDisabled={true}
                                                    placeHolder="Schedule Type"
                                                    error={error.scheduleType}
                                                    value={userParams.scheduleType}
                                                    options={scheduleType}
                                                    onChange={(value: any) => {
                                                        setUserParams({
                                                            ...userParams,
                                                            scheduleType: value
                                                        })
                                                        isValueUpdated(true);
                                                        setError({})
                                                    }}
                                                />
                                            </div> :
                                            <div className="form-group col-12">
                                                <EditText
                                                    label="Status"
                                                    mandatory
                                                    placeholder="Status"
                                                    disabled={true}
                                                    value={userParams.scheduleType && userParams.scheduleType.value}
                                                    maxLength={50}
                                                    onChange={() => {

                                                    }}
                                                />
                                            </div>
                                        }
                                        {userParams.scheduleType && userParams.scheduleType.value === "Scheduled" &&
                                            <div className="form-group col-12">
                                                <label className="picker-label">{"Schedule Date and Time"}<span className="mandatory-flied">*</span></label>
                                                <DateTimePicker
                                                    className="custom-date-picker"
                                                    placeholder="Schedule Date and Time"
                                                    hiddenLabel
                                                    disabled={!editable}
                                                    helperText={error.scheduleTime}
                                                    format={displayDateTimeFormatter}
                                                    value={userParams.scheduleTime || null}
                                                    onChange={(date: any) => {
                                                        setUserParams({
                                                            ...userParams,
                                                            scheduleTime: convertDateTimeServerFormat(date)
                                                        })
                                                        isValueUpdated(true);
                                                        setError({})
                                                    }}
                                                />
                                            </div>}
                                        <div className="auction-remarks form-group col-md-12">
                                            <label>Remark</label>
                                            <TextareaAutosize
                                                rowsMax={3}
                                                rowsMin={3}
                                                aria-label="maximum height"
                                                placeholder={remarkLabel}
                                                disabled={!editable}
                                                value={userParams.remarks}
                                                onChange={(event: any) => {
                                                    setUserParams({
                                                        ...userParams,
                                                        remarks: event.target.value
                                                    })
                                                    isValueUpdated(true);
                                                    setError({})
                                                }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>}
                            {/* </Collapse> */}
                        </Card>

                        <div className="text-right">

                            {editable ?
                                <Button
                                    loading={start}
                                    disable={!valueUpdated}
                                    buttonStyle="btn-blue"
                                    title={"Update"}
                                    leftIcon={<Timelapse />}
                                    onClick={() => {
                                        if (validateData()) {
                                            setStartLoading(true)
                                            let params: any = {
                                                id: id,
                                                basePrice: getBasePrice(userParams),
                                                duration: userParams.duration,
                                                biddingRateCriteria: userParams.biddingRateCriteria.value,
                                                lane: {
                                                    destinationLocationCode: userParams.lane.destinationLocationCode,
                                                    destinationLocationName: userParams.lane.destinationLocationName,
                                                    freightType: userParams.freightType.value,
                                                    laneCode: userParams.lane.laneCode,
                                                    laneName: userParams.lane.laneName,
                                                    originLocationCode: userParams.lane.originLocationCode,
                                                    originLocationName: userParams.lane.originLocationName,
                                                    tat: tatValueConverter(tatValue.value, userParams.tat),
                                                    vehicleRequiredDatetime: userParams.vehicleRequiredDatetime,
                                                    appointmentDateTime: userParams.appointmentDateTime,
                                                    serviceabilityModeCode: userParams.serviceabilityMode.value,
                                                    serviceabilityModeName: userParams.serviceabilityMode.label
                                                    // vehicleType: userParams.vehicleType.label,
                                                    // vehicleTypeCode: userParams.vehicleType.value
                                                },
                                                auctionLocations: userParams.auctionLocations
                                            }
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
                                            appDispatch(updateAuction(params)).then((response: any) => {
                                                setStartLoading(false)
                                                if (response) {
                                                    response.message && appDispatch(showAlert(response.message));
                                                    setUserParams({});
                                                    setError({});
                                                    isValueUpdated(false);
                                                    history.goBack();
                                                }
                                            })
                                        }
                                    }}
                                />
                                :
                                (userParams.scheduleType && userParams.scheduleType.value === "Scheduled" &&
                                    <Button
                                        loading={start}
                                        buttonStyle="btn-orange"
                                        title={"Cancel"}
                                        leftIcon={<Cancel />}
                                        onClick={() => {
                                            OpenCancelModal(true);
                                        }}
                                    />)
                            }

                        </div>
                    </div>
                </div>
            </PageContainer>
        </div >
    );

    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                setLaneList(setAutoCompleteListWithData(response, "laneDisplayName", "laneCode"))
            }
        });
    }

    function showPTLPerKg(data: any) {
        if (data?.lane?.load && data?.biddingRateCriteria === "Per KG" && data?.lane?.freightType === "PTL") {
            return data?.basePrice / data.lane.load;
        }
        return data?.basePrice;
    }

    function validateData() {
        if (userParams.lane === undefined) {
            setError({
                lane: errorLane
            });
            return false;
        } else if (isNullValue(userParams.pickupPoints)) {
            setError({
                pickupPoints: errorPickUpPointsLabel
            });
            return false;
        } else if (isNullValue(userParams.dropPoints)) {
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

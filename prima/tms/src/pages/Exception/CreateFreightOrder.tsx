import { Card, CardContent, CardHeader, TextareaAutosize } from "@material-ui/core";
import { ArrowRightAlt, ClearAll, KeyboardBackspace } from "@material-ui/icons";
import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { isNullOrUndefined } from "util";
import { FreightType, ftlServiceabilityModeTypeList, serviceabilityModeTypeList } from "../../base/constant/ArrayList";
import {
    contractId, laneLabel, lanePlaceholder,
    modLabel, modPlaceholder, referenceIdLabel,
    referenceIdPlaceholder, remarkLabel, transporterLabel, transporterPlaceHolder, vehicleTypeLabel, vehicleTypePlaceholder
} from "../../base/constant/MessageUtils";
import { isMobile } from "../../base/utility/ViewUtils";
import Filter from '../../component/filter/Filter';
import PageContainer from '../../component/pageContainer/PageContainer';
import AutoComplete from '../../component/widgets/AutoComplete';
import AutoSuggest from "../../component/widgets/AutoSuggest";
import Button from '../../component/widgets/button/Button';
import CardContentSkeleton from "../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import EditText from '../../component/widgets/EditText';
import NumberEditText from '../../component/widgets/NumberEditText';
import { InfoTooltip } from "../../component/widgets/tooltip/InfoTooltip";
import { OptionType } from "../../component/widgets/widgetsInterfaces";
import { autosuggestSearchLength } from "../../moduleUtility/ConstantValues";
import { setAutoCompleteListFromObject, setAutoCompleteListWithData } from '../../moduleUtility/DataUtils';
import { showAlert } from "../../redux/actions/AppActions";
import {
    clearUserParams, setError, setLaneList,
    setPartnerList, setUserParams, toggleOrderDeatils
} from '../../redux/actions/RaiseIndentAction';
import { getLanePrice } from '../../serviceActions/FrightRateServiceAction';
import { searchLane, searchLanePartner } from '../../serviceActions/LaneServiceActions';
import { diversionDetails } from "../../serviceActions/OrderServiceActions";
import { searchClientPartner } from "../../serviceActions/PartnerServiceAction";
import { getServiceabilityDetails } from "../../serviceActions/ServiceabilityServiceActions";
import { getServiceableVehicleType } from "../../serviceActions/VehicleTypeServiceActions";
import { validateIndentData } from "../freight/raiseOrders/RaiseOrderViewUtils";
import { Context } from "./CreateDiversionOrder";
import "./CreateFreightOrder.css";



function CreateFreightOrder() {
    const appDispatch = useDispatch();
    let history = useHistory();
    const { requestId } = useParams<any>();
    // const vehicleTypeList = useSelector((state: any) =>
    //     state.appReducer.vehicleTypeList, shallowEqual
    // );
    const [serviceableVehicleTypeList, setServiceableVehcileTypeList] = React.useState<any>([])
    const [loading, setLoading] = React.useState(false);
    const [state, dispatch] = useContext(Context);
    const [refresh, setRefresh] = React.useState(true);
    const [showContract, setShowContract] = React.useState(false);
    const [disableLane, setDisableLane] = React.useState(false);
    const [laneCheck, setLaneCheck] = React.useState(false);
    const [laneVisible, setLaneVisible] = React.useState(true);


    useEffect(() => {
        const getOldFreightData = async () => {
            if (requestId) {
                setLoading(true);
                // appDispatch(getDOList(doQueryParams)).then((response: any) => {
                //     if (response && response.data && response.data[0]) {
                //         let doResponse: any = response.data[0]
                //         dispatch(setUserParams({
                //             laneName: doResponse.laneDisplayName,
                //             lane: {
                //                 label: doResponse.laneDisplayName,
                //                 value: doResponse.laneCode
                //             },
                //             laneDisplayName: doResponse.laneDisplayName,
                //             partnerName: doResponse.transporter && doResponse.transporter.transporterName,
                //             partner: doResponse.transporter ? {
                //                 label: doResponse.transporter.transporterName,
                //                 value: doResponse.transporter.transporterCode
                //             } : undefined,
                //             DODetails: doResponse,
                //             lanePrice: doResponse.transporter && doResponse.transporter.lanePrice ? doResponse.transporter.lanePrice : ""
                //         }))
                //     }
                //     setLoading(false)
                // })
                appDispatch(diversionDetails({ requestId: requestId })).then((response: any) => {
                    if (response && response.oldFreightOrderDetails) {
                        const oldFreightData = response.oldFreightOrderDetails
                        dispatch(setUserParams({ oldFreightOrderCode: oldFreightData.freightOrderCode, requestId: requestId, orderDiversionId: response.id }))
                    }
                    setLoading(false)
                })
            } else {
                dispatch(clearUserParams());
            }
        }
        getOldFreightData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestId]);

    useEffect(() => {
        const getLanePriceDetails = async () => {
            if (state.userParams && state.userParams.freightType && state.userParams.partner
                && state.userParams.lane && state.userParams.serviceabilityModeCode) {
                let params: any = {}
                params = {
                    freightType: state.userParams.freightType.value,
                    laneCode: state.userParams.lane.value,
                    partnerCode: state.userParams.partner.value,
                    serviceabilityModeCode: state.userParams.serviceabilityModeCode.value
                }
                if (state.userParams.freightType.value === "FTL") {
                    if (state.userParams.vehicleType) {
                        params.vehicleTypeCode = state.userParams.vehicleType.value
                    } else return;
                }
                appDispatch(getLanePrice(params)).then((response: any) => {
                    setRefresh(false);
                    if (response) {
                        let userParams: any = Object.assign({}, state.userParams);

                        if (response.lanePrice) {
                            userParams.lanePrice = response.lanePrice
                            setDisableLane(true)
                            setLaneVisible(true);
                        } else if (!response.lanePrice && response.isKm) {
                            userParams.lanePrice = "0";
                            setLaneVisible(false);
                        } else {
                            userParams.lanePrice = ""
                            setDisableLane(false)
                            setLaneVisible(true);
                        }

                        if (response.contractCode) {
                            userParams.contractCode = response.contractCode;
                            setShowContract(true);
                        } else {
                            userParams.contractCode = undefined
                            setShowContract(false);
                        }

                        if (!response.contractCode && !response.lanePrice) {
                            userParams.lanePrice = state.userParams.lanePrice
                            setLaneCheck(true);
                        } else {
                            setLaneCheck(false);
                        }
                        dispatch(setUserParams(userParams))
                    }
                });
            }
        }
        refresh && getLanePriceDetails();
        // eslint-disable-next-line
    }, [state.userParams]);


    useEffect(() => {
        dispatch(setUserParams({
            ...state.userParams,
            vehicleType: undefined,
            lanePrice: ''
        }))
        setServiceableVehcileTypeList([])
        if (state.userParams && state.userParams.freightType && state.userParams.partner
            && state.userParams.lane && state.userParams.serviceabilityModeCode) {
            if (state.userParams.freightType.value === "FTL") {
                let queryParams = {
                    freightTypeCode: state.userParams.freightType.value,
                    laneCode: state.userParams.lane.value,
                    partnerCode: state.userParams.partner.value,
                    serviceabilityModeCode: state.userParams.serviceabilityModeCode.value
                }
                appDispatch(getServiceableVehicleType(queryParams)).then((vehicleTypeResponse: any) => {
                    if (vehicleTypeResponse && vehicleTypeResponse.length > 0) {
                        setServiceableVehcileTypeList(setAutoCompleteListWithData(vehicleTypeResponse, "vehicleTypeName", "vehicleTypeCode"))
                    }
                })
            }
        }
        // eslint-disable-next-line
    }, [state.userParams.freightType, state.userParams.lane, state.userParams.partner, state.userParams.serviceabilityModeCode])

    return (

        <div className="freight-order-wrapper">
            <Filter
                pageTitle="Create Freight Order"
                // buttonStyle="btn-detail"
                // buttonTitle={id && "Back"}
                buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                buttonTitle={isMobile ? " " : "Back"}
                leftIcon={<KeyboardBackspace />}
                onClick={() => {
                    history.goBack();
                }}
            >
            </Filter>

            <PageContainer>
                <Card className="creat-contract-wrapp">
                    <CardHeader className="creat-contract-header"
                        title="Freight Order"
                    />
                    {loading ?
                        <CardContentSkeleton
                            row={3}
                            column={2}
                        />
                        :
                        <CardContent className="creat-contract-content raise-contract-detail">
                            <div className="row custom-form-row align-items-end">
                                <div className="col-md-6 form-group order-type">
                                    <AutoComplete
                                        label={"Freight Type"}
                                        mandatory
                                        placeHolder={"Select Freight Type"}
                                        value={state.userParams.freightType}
                                        error={state.error.freightType}
                                        options={state.freightTypeList}
                                        onChange={(element: OptionType) => {
                                            // if (id) {
                                            //     dispatch(setUserParams({
                                            //         ...state.userParams,
                                            //         freightType: element,
                                            //         contractCode: undefined,
                                            //         vehicleType: undefined,
                                            //         serviceabilityModeCode: element.label === FreightType.FTL ? ftlServiceabilityModeTypeList[0] : state.userParams.serviceabilityModeCode
                                            //     }));
                                            // } else {
                                            dispatch(setUserParams({
                                                ...state.userParams,
                                                freightType: element,
                                                laneName: "",
                                                lane: undefined,
                                                partnerName: "",
                                                partner: undefined,
                                                lanePrice: "",
                                                contractCode: undefined,
                                                vehicleType: undefined,
                                                serviceabilityModeCode: element.label === FreightType.FTL ? ftlServiceabilityModeTypeList[0] : state.userParams.serviceabilityModeCode
                                            }));
                                            // }
                                            setShowContract(false)
                                            setDisableLane(false)
                                            setRefresh(true)
                                        }
                                        }
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <AutoSuggest
                                        label={laneLabel}
                                        placeHolder={lanePlaceholder}
                                        value={state.userParams.laneName}
                                        suggestions={state.laneList}
                                        // isDisabled={id ? true : false}
                                        mandatory
                                        error={state.error.lane}
                                        handleSuggestionsFetchRequested={({ value }: any) => {
                                            if (value.length > autosuggestSearchLength) {
                                                getLaneList(value);
                                            }
                                        }}
                                        onSelected={(value: OptionType) => {
                                            dispatch(setUserParams({
                                                ...state.userParams,
                                                laneName: value.label,
                                                lane: value,
                                                originLocationName: value.data && value.data.origin && value.data.origin.name,
                                                origin: value.data && value.data.origin,
                                                destinationLocationName: value.data && value.data.destination && value.data.destination.name,
                                                destination: value.data && value.data.destination,
                                                tat: value.data && value.data.tat,
                                            }));
                                            setRefresh(true)
                                        }}
                                        onChange={(text: string) => {
                                            setValues({
                                                laneName: text,
                                                lane: undefined,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <AutoComplete
                                        label={modLabel}
                                        placeHolder={modPlaceholder}
                                        options={(state.userParams.freightType && state.userParams.freightType.label === FreightType.FTL) ? ftlServiceabilityModeTypeList : serviceabilityModeTypeList}
                                        mandatory
                                        error={state.error.serviceabilityModeCode}
                                        value={state.userParams && state.userParams.serviceabilityModeCode}
                                        onChange={(element: OptionType) => {
                                            setValues({
                                                serviceabilityModeCode: element,
                                            });
                                            setRefresh(true)
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <EditText
                                        label={referenceIdLabel}
                                        maxLength={60}
                                        placeholder={referenceIdPlaceholder}
                                        error={state.error.refId}
                                        value={state.userParams && state.userParams.refId}
                                        onChange={(text: string) => {
                                            setValues({
                                                refId: text.trim()
                                            });
                                        }}
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <AutoSuggest
                                        mandatory
                                        label={transporterLabel}
                                        placeHolder={transporterPlaceHolder}
                                        error={state.error.partner}
                                        value={state.userParams.partnerName}
                                        suggestions={state.partnerList}
                                        isDisabled={state.userParams.DODetails && state.userParams.DODetails.transporter}
                                        handleSuggestionsFetchRequested={({ value }: any) => {
                                            if (value.length > autosuggestSearchLength) {
                                                getPartnerList(value, "PTL");
                                            }
                                        }}
                                        onSelected={(element: OptionType) => {
                                            setValues({
                                                partner: element,
                                                partnerName: element.label,
                                            });
                                            setRefresh(true)
                                        }}
                                        onChange={(text: string) => {
                                            setValues({
                                                partnerName: text,
                                                partner: undefined,
                                            });
                                        }}
                                    />
                                </div>
                                {state.userParams.freightType && state.userParams.freightType.label === FreightType.FTL &&
                                    <div className="form-group col-md-6">
                                        <AutoComplete
                                            label={vehicleTypeLabel}
                                            mandatory
                                            placeHolder={vehicleTypePlaceholder}
                                            error={state.error.vehicleType}
                                            value={state.userParams && state.userParams.vehicleType}
                                            options={serviceableVehicleTypeList}
                                            onChange={(element: OptionType) => {
                                                dispatch(setUserParams({
                                                    ...state.userParams,
                                                    vehicleType: element,
                                                }));
                                                setRefresh(true)
                                            }}
                                        />
                                    </div>
                                }

                                {showContract &&
                                    <div className="form-group col-md-6">
                                        <EditText
                                            label={contractId}
                                            maxLength={60}
                                            disabled
                                            placeholder={"Contract Id"}
                                            value={state.userParams && state.userParams.contractCode}
                                            onChange={(text: string) => {
                                            }}
                                        />
                                    </div>}

                                {laneVisible &&
                                    <div className="form-group col-md-6">
                                        <NumberEditText
                                            label={"Lane Price ( \u20B9 )"}
                                            mandatory={state.userParams.freightType && state.userParams.freightType.label === FreightType.FTL}
                                            maxLength={8}
                                            allowNegative={false}
                                            allowZero
                                            decimalScale={2}
                                            toolTip={() => (
                                                <InfoTooltip title="Billing will be sum of Lane Price and KM run charges as per lane contract"
                                                    disableInMobile={"false"}
                                                    placement="top" />
                                            )}
                                            disabled={disableLane}
                                            placeholder={"Enter Lane Price"}
                                            error={state.error.lanePrice}
                                            value={state.userParams && state.userParams.lanePrice}
                                            onChange={(text: string) => {
                                                setValues({
                                                    lanePrice: text
                                                });
                                            }}
                                        />
                                    </div>}
                                <div className="form-group col-md-6">
                                    <EditText
                                        label={"Linked FO"}
                                        maxLength={60}
                                        placeholder={"Linked FO"}
                                        value={state.userParams && state.userParams.oldFreightOrderCode}
                                        disabled
                                        onChange={(text: string) => {
                                            setValues({
                                                linkedFO: text
                                            });
                                        }}
                                    />
                                </div>
                                <div className="order-remarks form-group col-md-6">
                                    <label>Remark</label>
                                    <TextareaAutosize
                                        rowsMax={2}
                                        rowsMin={2}
                                        aria-label="maximum height"
                                        placeholder={remarkLabel}
                                        value={state.userParams && state.userParams.orderRemarks}
                                        onChange={(event: any) => {
                                            setValues({
                                                orderRemarks: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                            </div>
                        </CardContent>}
                </Card>
                <div className="row text-right">
                    <div className="col indent-btn-wrap">
                        <Button
                            buttonStyle="btn-orange mr-3"
                            title="Clear"
                            disable={state.loading}
                            leftIcon={<ClearAll />}
                            onClick={() => {
                                clearData();
                            }}
                        />
                        <Button
                            buttonStyle="btn-blue"
                            title="Next"
                            loading={state.loading}
                            onClick={() => {
                                const validate = validateIndentData(state.userParams, laneCheck, laneVisible)
                                if (laneCheck && laneVisible &&
                                    (!state.userParams.contractCode || isNullOrUndefined(state.userParams.contractCode)) &&
                                    (!state.userParams.lanePrice || isNullOrUndefined(state.userParams.lanePrice))) {
                                    appDispatch(showAlert("No contract found, add custom lane price for order", false));
                                }
                                if (validate === true) {
                                    let serviceablityParams: any = {
                                        freightTypeCode: state.userParams.freightType.value,
                                        laneCode: state.userParams.lane.value,
                                        partnerCode: state.userParams.partner.value,
                                        serviceabilityModeCode: state.userParams.serviceabilityModeCode.value
                                    }
                                    if (state.userParams.freightType.label === FreightType.FTL) {
                                        serviceablityParams.vehicleTypeCode = state.userParams.vehicleType.value
                                    }
                                    appDispatch(getServiceabilityDetails(serviceablityParams)).then((response: any) => {
                                        if (response && response.tat) {
                                            dispatch(setUserParams({ ...state.userParams, servicabilityTat: response.tat }))
                                            dispatch(toggleOrderDeatils())
                                        }
                                    })
                                } else {
                                    dispatch(setError(validate));
                                }
                            }}
                            leftIcon={<ArrowRightAlt />}
                        />
                    </div>
                </div>




            </PageContainer>
        </div>
    );

    function setValues(params: any) {
        dispatch(setUserParams({
            ...state.userParams,
            ...params
        }));
    }

    function clearData() {
        // if (id) {
        //     dispatch(clearUserParams());
        //     dispatch(setUserParams({
        //         laneName: state.userParams.laneName,
        //         lane: state.userParams.lane,
        //         laneDisplayName: state.userParams.laneDisplayName,
        //         lanePrice: state.userParams.DODetails && state.userParams.DODetails.transporter && state.userParams.DODetails.transporter.lanePrice ? state.userParams.DODetails.transporter.lanePrice : "",
        //         partnerName: state.userParams.DODetails && state.userParams.DODetails.transporter ? state.userParams.partnerName : "",
        //         partner: state.userParams.DODetails && state.userParams.DODetails.transporter ? state.userParams.partner : undefined,
        //         DODetails: state.userParams.DODetails
        //     }))
        // } else {
        // dispatch(clearUserParams());
        // }
        dispatch(clearUserParams());
        setShowContract(false);
        setDisableLane(false);
        setLaneCheck(false);
        setLaneVisible(true);
    }

    function getLaneList(text: string) {
        appDispatch(searchLane({ query: text })).then((response: any) => {
            if (response) {
                dispatch(setLaneList(setAutoCompleteListWithData(response, "laneName", "laneCode")));
            }
        });
    }

    function getPartnerList(text: string, type?: string) {
        if (!type) {
            appDispatch(searchLanePartner({ laneCode: text })).then((response: any) => {
                if (response) {
                    dispatch(setPartnerList(setAutoCompleteListFromObject(response.partnerDetails, "partner", "name", "code")));
                }
            });
        } else {
            appDispatch(searchClientPartner({ query: text })).then((response: any) => {
                if (response) {
                    dispatch(setPartnerList(setAutoCompleteListWithData(response, "partnerName", "partnerCode")));
                }
            });
        }

    }
}

export default CreateFreightOrder;


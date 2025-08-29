import { Card, CardContent, CardHeader } from "@material-ui/core";
import { AddCircle, CheckCircle, KeyboardBackspace } from '@material-ui/icons';
import { isUndefined } from "lodash";
import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from 'react-router-dom';
import {
    contractModeType,
    FreightType, JobFileType, RegisterJobs,
    tatOptions
} from "../../../base/constant/ArrayList";
import { constraintBreachContinue, contractId, freightTypeLabel, lanePriceLabel, referenceIdLabel, remarkLabel, vehicleTypeHint, zoneLaneTitle } from '../../../base/constant/MessageUtils';
import { OrderListingUrl } from "../../../base/constant/RoutePath";
import { isEmptyArray, isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import { ListLaneView } from "../../../component/CommonView";
import Filter from '../../../component/filter/Filter';
import Information from "../../../component/information/Information";
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from '../../../component/widgets/button/Button';
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomToolTip } from "../../../component/widgets/CustomToolTip";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import BulkUploadDialog from "../../../modals/BulkUploadDialog/BulkUploadDialog";
import WarningModal from "../../../modals/warningModal/WarningModal";
import {
    setAutoCompleteList,
    setAutoCompleteListWithData
} from "../../../moduleUtility/DataUtils";
import { pollStart, showAlert } from "../../../redux/actions/AppActions";
import {
    addMultipleShipmetDetails, addShipmetDetails, clearShipmentDetails, hideLoading, removeShipmetDetails, saveShipmetDetails, showLoading, toggleModal, toggleOrderDeatils
} from '../../../redux/actions/RaiseIndentAction';
import { getOrderLocations, getOrderZoneLocations, getShipmentTagList, orderCreation, orderOrchestration } from "../../../serviceActions/OrderServiceActions";
import {
    getLrNumberListDetails
} from "../../../serviceActions/ServiceabilityServiceActions";
import { getDoMaterialList } from "../../freight/demandOrders/demandOrdersApi/demandOrderServiceActions";
import ContractDetailModal from "../../indentManagement/indent/ContractDetailModal";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import ShipmentOrder from "../shipmentOrder/ShipmentOrder";
import { Context } from "./CreateOrder";
import { createIndentParams, validateShipmentDetails } from "./RaiseOrderViewUtils";
import './ShipmentOrderDetails.css';


function ShipmentOrderDetails() {
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
    const appDispatch = useDispatch();
    const [state, dispatch] = useContext(Context);
    const history = useHistory();
    const [openContractDetailModal, setOpenContractDetailModal] = React.useState<boolean>(false)
    const [pickupPointsList, setPickUpPointsList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [dropPointsList, setDropPointsList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [doMaterialResponse, setDoMaterialResponse] = React.useState<Array<OptionType> | undefined>(undefined);
    const [servicabiltyTat, setServicabiltyTat] = React.useState<any>();
    const [lrNumberList, setLrNumberList] = React.useState<any>([]);
    const [shipmentTagList, setShipmentTagList] = React.useState<any>([]);
    const { id } = useParams<any>();
    const eclipseLength = isMobile ? 6 : 28;
    const [skeletonLoading, setSkeletonLoading] = React.useState<boolean>(false);
    const [fileType, setFileType] = React.useState<any>(JobFileType.STANDARD_FILE)
    const [warningModalDetails, setWarningModalDetails] = React.useState<{ open: boolean, warningMessage?: any }>({ open: false });
    const [constraintBreachDetails, setConstraintBreachDetails] = React.useState<any>(undefined);
    const onFileTypeChange = (value: any) => {
        setFileType(value)
    }
    const fetchPollingData = (params: any) => {
        return appDispatch(orderOrchestration({ orchestrationId: params.orchestrationId, service: params.service })).then((response: any) => {
            if (response?.details?.customStatus?.code === 700) {
                setWarningModalDetails({ open: true, warningMessage: response?.details?.customStatus?.message });
                setConstraintBreachDetails(response?.details?.customStatus?.details)
                return
            }
            return response.details;
        })
    }

    const stopPollingLoader = (isOrderCreated: boolean) => {
        dispatch(hideLoading());
        if (!isUndefined(isOrderCreated)) {
            setConstraintBreachDetails(undefined)
        }
        isOrderCreated && (id ? history.goBack() : history.push(OrderListingUrl));
    }
    useEffect(() => {
        const getLocationList = async () => {
            setSkeletonLoading(true);
            let orderLocationsResponse = (state.userParams?.originZoneCode && state.userParams?.destination?.value)
                ? await appDispatch(getOrderZoneLocations({ origin_zone_code: state.userParams?.originZoneCode, destination_zone_code: state.userParams?.destination?.value, serviceabilityModeCode: state.userParams?.serviceabilityModeCode?.value }))
                : await appDispatch(getOrderLocations({ laneCode: state.userParams.lane.value }));
            if (orderLocationsResponse) {
                setPickUpPointsList(setAutoCompleteListWithData(orderLocationsResponse.pickupList, "locationName", "locationCode"))
                setDropPointsList(setAutoCompleteListWithData(orderLocationsResponse.dropList, "locationName", "locationCode"))
            }

            if (!isObjectEmpty(state.userParams?.DODetails)) {
                let materialListParams: any = {
                    demandOrderCode: id
                }
                let doMaterialListResponse = await appDispatch(getDoMaterialList(materialListParams));
                if (doMaterialListResponse) {
                    setDoMaterialResponse(doMaterialListResponse);
                } else {
                    setDoMaterialResponse(undefined);
                }
            }

            if (state.userParams.servicabilityTat) {
                setServicabiltyTat(state.userParams.servicabilityTat)
            }
            if (state.userParams.refId) {
                let lrParams: any = {
                    referenceId: state.userParams.refId
                }
                let lrNumberListResponse = await appDispatch(getLrNumberListDetails(lrParams));
                if (lrNumberListResponse && lrNumberListResponse.lrNumbers) {
                    setLrNumberList(lrNumberListResponse.lrNumbers)
                    let multipleShipmentDetails = lrNumberListResponse.lrNumbers.map((item: any, index: any) => {
                        return {
                            index: index,
                            isShipmentRefIdDisabled: true,
                            isNonDeletable: true,
                            details: {
                                shipmentRefId: item,
                                tatValue: tatOptions[0],
                                tat: state.userParams?.servicabilityTat ? state.userParams.servicabilityTat : "",
                                articles: [{
                                    index: 0,
                                }]
                            },
                            error: {}
                        }
                    });
                    dispatch(addMultipleShipmetDetails(multipleShipmentDetails))
                }
            }
            const response = await appDispatch(getShipmentTagList())
            if (response && response.length > 0) {
                setShipmentTagList(setAutoCompleteList(response, "tagName", "tagName"))
            } else {
                setShipmentTagList([])
            }
            setSkeletonLoading(false);
        }
        state && (state.userParams.lane || (state.userParams?.originZoneCode && state.userParams?.destination?.value)) && getLocationList();
        // eslint-disable-next-line
    }, [state.userParams]);

    return (
        <div className="order-detail-wrapper ship-order-detail-wrap">
            <BulkUploadDialog
                title="Bulk Freight Orders"
                open={state.openModal}
                jobName={JobFileType.STANDARD_FILE === fileType ? RegisterJobs.RAISE_ORDERS : RegisterJobs.RAISE_ORDERS_INTEGRATION}
                jobFileType={fileType}
                onJobFileTypeChange={onFileTypeChange}
                onClose={() => {
                    dispatch(toggleModal());
                }}
            />
            <WarningModal
                open={warningModalDetails?.open}
                onClose={() => {
                    setWarningModalDetails({ open: false });
                    setConstraintBreachDetails(undefined);
                    dispatch(hideLoading());
                }}
                warningMessage={<div><p className="warning-constraint">{warningModalDetails.warningMessage}</p><p className="warning-continue">{constraintBreachContinue}</p></div>}
                primaryButtonTitle={"Yes"}
                secondaryuttonTitle={"No"}
                onSuccess={() => {
                    setWarningModalDetails({ open: false });
                    raiseOrder();
                }}
            />
            <div className="filter-wrap">
                <Filter
                    pageTitle={"Order Details"}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        dispatch(toggleOrderDeatils());
                        dispatch(clearShipmentDetails());
                    }}
                >
                </Filter>
            </div>
            <LanePointsDisplayModal
                open={openPointModal}
                laneCode={state.userParams && state.userParams.lane && state.userParams.lane.value}
                onClose={() => {
                    setOpenPointModal(false);
                }} />

            {openContractDetailModal &&
                <ContractDetailModal
                    open={openContractDetailModal}
                    selectedElement={{
                        contractCode: state.userParams.contractCode,
                        partnerCode: state.userParams.partner.value
                    }}
                    laneCode={state.userParams.lane && state.userParams.lane.value}
                    freightType={state.userParams.freightType && state.userParams.freightType.value}
                    onSuccess={() => {
                        setOpenContractDetailModal(false)
                    }}
                    onClose={() => {
                        setOpenContractDetailModal(false)
                    }}
                />}

            <PageContainer  >
                <Card className="creat-contract-wrapp creat-wrapp">
                    <CardHeader className="creat-contract-header"
                        title="Freight Details"
                    />
                    {skeletonLoading ?
                        <CardContentSkeleton
                            row={2}
                            column={4}
                        />
                        : <CardContent className="creat-contract-content">
                            <div className="custom-form-row row">
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={freightTypeLabel}
                                        text={state.userParams.freightType.label}
                                    />
                                </div>
                                {state.userParams.freightType && state.userParams.freightType.label === FreightType.FTL &&
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={vehicleTypeHint}
                                            text={state.userParams.vehicleType.label}
                                        />
                                    </div>
                                }
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={zoneLaneTitle}
                                        text={(state.userParams?.originZoneName && state.userParams?.destinationName) && `${state.userParams?.originZoneName} -> ${state.userParams?.destinationName}`}
                                        customView={state?.userParams?.laneName && <ListLaneView element={state.userParams} onClickLaneCode={(data: any) => { setOpenPointModal(true); }} />}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={"Mode of transport"}
                                        text={state.userParams.serviceabilityModeCode?.label}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={referenceIdLabel}
                                        text={state.userParams.refId}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={lanePriceLabel}
                                        text={state.userParams.lanePrice}
                                    />
                                </div>
                                {state.userParams.contractCode &&
                                    <div className="col-md-3 billing-group col-6">
                                        <Information
                                            title={contractId}
                                            valueClassName="blue-text"
                                            customView={
                                                <span className="blue-text cursor-pointer" onClick={() => {
                                                    setOpenContractDetailModal(true);
                                                }} >{state.userParams.contractCode}</span>
                                            }
                                        />
                                    </div>
                                }
                                <div className="labelWidth col-md-3 billing-group col-6">
                                    <Information
                                        title={remarkLabel}
                                        customView={
                                            <div className="d-flex ">
                                                <p>{state.userParams.orderRemarks || "NA"}</p>
                                                {
                                                    state.userParams &&
                                                    state.userParams.orderRemarks &&
                                                    state.userParams.orderRemarks.length >= eclipseLength &&
                                                    <CustomToolTip
                                                        title={state.userParams.orderRemarks}
                                                        placement={"top"}
                                                        disableInMobile={"false"}
                                                    >
                                                        <span className="blue-text">more</span>
                                                    </CustomToolTip>
                                                }
                                            </div>
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>}

                </Card>
                {(state.shipmentDeatils && state.shipmentDeatils.length > 0 && <>
                    {state.shipmentDeatils.map((element: any, index: number) => <ShipmentOrder
                        key={index}
                        details={element}
                        pickupPointList={pickupPointsList}
                        servicabiltyTat={servicabiltyTat}
                        dropPointList={dropPointsList}
                        doMaterialResponse={doMaterialResponse}
                        shipmentTagList={shipmentTagList}
                        DODetails={state.userParams.DODetails}
                        onDelete={(index: number) => {
                            dispatch(removeShipmetDetails(index));
                        }}
                    />)}
                    <div className="row text-right">
                        <div className="col indent-btn-wrap">
                            {isEmptyArray(lrNumberList) &&
                                <Button
                                    buttonStyle="btn-orange mr-3"
                                    title={"Shipment"}
                                    disable={state.loading}
                                    leftIcon={<AddCircle />}
                                    onClick={() => {
                                        dispatch(addShipmetDetails({
                                            articles: [{
                                                index: 0,
                                            }]
                                        }, {}));
                                    }}
                                />}
                            <Button
                                buttonStyle="btn-blue"
                                title={"Raise Order"}
                                disable={state.loading}
                                loading={state.loading}
                                leftIcon={<CheckCircle />}
                                onClick={() => {
                                    let validate = validateShipmentDetails(state.shipmentDeatils, state.userParams.freightType, state.userParams.DODetails)
                                    if (validate === true) {
                                        raiseOrder();
                                    } else {
                                        dispatch(saveShipmetDetails(validate))
                                    }
                                }}
                            />
                        </div>

                    </div>
                </>) ||
                    <>
                        {isEmptyArray(lrNumberList) &&
                            <div className="text-center mt-md-5">
                                <Button
                                    buttonStyle="btn-orange mr-3"
                                    title={"Shipment"}
                                    disable={state.loading || skeletonLoading}
                                    leftIcon={<AddCircle />}
                                    onClick={() => {
                                        const tat = state.userParams.ptlMode?.value === contractModeType.ZONE
                                            && (state.userParams.tat || state.userParams.servicabilityTat)
                                        dispatch(addShipmetDetails({
                                            articles: [{
                                                index: 0,
                                            }],
                                            tat
                                        }, {}));
                                    }}
                                />
                            </div>}
                        <div className="shipment-img text-center">
                            <img src="/images/shipment-img.png" alt="shipment" />
                        </div>
                    </>
                }
            </PageContainer>
        </div >
    );

    function raiseOrder() {
        let params = createIndentParams(state);
        if (constraintBreachDetails && !isObjectEmpty(constraintBreachDetails?.failed_constraint)) {
            let ignoredConstraints: any = constraintBreachDetails?.ignored_constraints ? constraintBreachDetails?.ignored_constraints : [];
            ignoredConstraints.push(constraintBreachDetails?.failed_constraint)
            params.ignored_constraints = [...ignoredConstraints];
        }
        dispatch(showLoading());
        appDispatch(orderCreation(params)).then((response: any) => {
            if (response) {
                // eslint-disable-next-line
                if (response.code && response.code == 200) {
                    let orchestrationParams: any = response && response.details && {
                        orchestrationId: response.details.orchestrationId,
                        service: response.details.service,
                    }
                    appDispatch(pollStart({
                        params: orchestrationParams,
                        asyncFetch: fetchPollingData,
                        stopPollingLoader: stopPollingLoader,
                    }));
                }
            } else {
                appDispatch(showAlert("Something went wrong. Please try again", false));
                dispatch(hideLoading());
                return;
            }
        })
    }
}


export default ShipmentOrderDetails;

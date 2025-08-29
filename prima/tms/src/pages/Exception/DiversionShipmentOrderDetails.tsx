import { Card, CardContent, CardHeader } from "@material-ui/core";
import { AddCircle, CheckCircle, KeyboardBackspace } from '@material-ui/icons';
import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
    diversionMaterialBalanceQuantityColumn,
    diversionTabEnum,
    FreightType, tatOptions
} from "../../base/constant/ArrayList";
import { constraintBreachContinue, contractId, freightTypeLabel, lanePriceLabel, laneTitle, referenceIdLabel, vehicleTypeHint } from '../../base/constant/MessageUtils';
import { DiversionRequestDetailsUrl } from "../../base/constant/RoutePath";
import { isEmptyArray, isObjectEmpty } from "../../base/utility/StringUtils";
import { isMobile } from "../../base/utility/ViewUtils";
import { ListLaneView } from "../../component/CommonView";
import Filter from '../../component/filter/Filter';
import Information from "../../component/information/Information";
import PageContainer from "../../component/pageContainer/PageContainer";
import Button from '../../component/widgets/button/Button';
import CardContentSkeleton from "../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomTooltipTable } from "../../component/widgets/CustomToolTipTable";
import { OptionType } from "../../component/widgets/widgetsInterfaces";
import WarningModal from "../../modals/warningModal/WarningModal";
import {
    setAutoCompleteListWithData
} from "../../moduleUtility/DataUtils";
import { hideLoading, showLoading } from "../../redux/actions/DiversionActions";
import { removeShipmetDetails, saveShipmetDetails } from "../../redux/actions/DiversionCreateOrderAction";
import {
    addMultipleShipmetDetails, addShipmetDetails, clearShipmentDetails, toggleOrderDeatils
} from '../../redux/actions/RaiseIndentAction';
import { diversionCreateFreightOrder, diversionTotalMaterialList, getOrderLocations } from "../../serviceActions/OrderServiceActions";
import {
    getLrNumberListDetails
} from "../../serviceActions/ServiceabilityServiceActions";
import ContractDetailModal from "../indentManagement/indent/ContractDetailModal";
import LanePointsDisplayModal from "../masterPlatform/lane/LanePointsDisplayModal";
import { Context } from "./CreateDiversionOrder";
import { diversionCreateOrderParams, diversionValidateShipmentDetails } from "./DiversionRaiseOrderViewUtils";
import DiversionShipmentOrder from "./DiversionShipmentOrder";
import './DiversionShipmentOrderDetails.css';


function DiversionShipmentOrderDetails() {
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
    const appDispatch = useDispatch();
    const { requestId } = useParams<any>();
    const order = new URLSearchParams(useLocation().search).get("order");
    const [state, dispatch] = useContext(Context);
    const history = useHistory();
    const [openContractDetailModal, setOpenContractDetailModal] = React.useState<boolean>(false)
    const [pickupPointsList, setPickUpPointsList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [dropPointsList, setDropPointsList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [servicabiltyTat, setServicabiltyTat] = React.useState<any>();
    const [lrNumberList, setLrNumberList] = React.useState<any>([]);
    const [skeletonLoading, setSkeletonLoading] = React.useState<boolean>(false);
    const [totalMaterialList, setTotalMaterialList] = React.useState<any>(undefined)
    const [warningModalDetails, setWarningModalDetails] = React.useState<{ open: boolean, warningMessage?: any }>({ open: false });
    const [constraintBreachDetails, setConstraintBreachDetails] = React.useState<any>(undefined);

    useEffect(() => {
        const getTotalMaterialList = async () => {
            setSkeletonLoading(true);
            appDispatch(diversionTotalMaterialList({ freightOrderCode: state.userParams.oldFreightOrderCode })).then((response: any) => {
                setTotalMaterialList(response)
            })
            setSkeletonLoading(false);
        }
        getTotalMaterialList()
        // eslint-disable-next-line
    }, [])


    useEffect(() => {
        const getLocationList = async () => {
            setSkeletonLoading(true);
            let orderLocationsResponse = await appDispatch(getOrderLocations({ laneCode: state.userParams.lane.value }));
            if (orderLocationsResponse) {
                setPickUpPointsList(setAutoCompleteListWithData(orderLocationsResponse.pickupList, "locationName", "locationCode"))
                setDropPointsList(setAutoCompleteListWithData(orderLocationsResponse.dropList, "locationName", "locationCode"))
            }
            let params: any = {
                freightTypeCode: state.userParams.freightType.value,
                laneCode: state.userParams.lane.value,
                serviceabilityModeCode: state.userParams.serviceabilityModeCode.value,
                partnerCode: state.userParams.partner.value
            };
            if (state.userParams.freightType.label === FreightType.FTL) {
                params.vehicleTypeCode = state.userParams.vehicleType.value
            }
            // if (!isObjectEmpty(state.userParams?.DODetails)) {
            //     let materialListParams: any = {
            //         demandOrderCode: id
            //     }
            //     let doMaterialListResponse = await appDispatch(getDoMaterialList(materialListParams));
            //     if (doMaterialListResponse) {
            //         setDoMaterialResponse(doMaterialListResponse);
            //     } else {
            //         setDoMaterialResponse(undefined);
            //     }
            // }
            // let servicabiltyResponse = await appDispatch(getServiceabilityDeatils(params));
            // if (servicabiltyResponse && servicabiltyResponse.tat) {
            //     setServicabiltyTat(servicabiltyResponse.tat)
            // }
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
            setSkeletonLoading(false);
        }
        state && state.userParams.lane && getLocationList();
        // eslint-disable-next-line
    }, [state.userParams]);

    return (
        <div className="order-detail-wrapper ship-order-detail-wrap">
            <div className="filter-wrap">
                <Filter
                    pageTitle={"Create Freight Order Details"}
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
                    createDiversionOrder();
                }}
            />

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
                                        title={laneTitle}
                                        customView={<ListLaneView element={state.userParams} onClickLaneCode={(data: any) => { setOpenPointModal(true); }} />}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={"Mode of transport"}
                                        text={state.userParams.serviceabilityModeCode.label}
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
                                <div className="labelWidth col-md-3 billing-group col-6 createFreightOrder">
                                    <Information
                                        title={"Linked FO"}
                                        text={state.userParams.oldFreightOrderCode}
                                        tooltip={() => (<CustomTooltipTable
                                            tableColumn={diversionMaterialBalanceQuantityColumn}
                                            tableData={totalMaterialList}
                                        />)}
                                    />
                                </div>
                            </div>
                        </CardContent>}

                </Card>
                {(state.shipmentDeatils && state.shipmentDeatils.length > 0 && <>
                    {state.shipmentDeatils.map((element: any, index: number) => <DiversionShipmentOrder
                        order={order}
                        key={index}
                        details={element}
                        pickupPointList={pickupPointsList}
                        servicabiltyTat={servicabiltyTat}
                        dropPointList={dropPointsList}
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
                                title={"Done"}
                                disable={state.loading}
                                loading={state.loading}
                                leftIcon={<CheckCircle />}
                                onClick={() => {
                                    let validate = diversionValidateShipmentDetails(state.shipmentDeatils, state.userParams.freightType, state.userParams.DODetails, order)
                                    if (validate === true) {
                                        createDiversionOrder()
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
                                        dispatch(addShipmetDetails({
                                            articles: [{
                                                index: 0,
                                            }]
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

    function createDiversionOrder() {
        let params = diversionCreateOrderParams(state);
        if (constraintBreachDetails && !isObjectEmpty(constraintBreachDetails?.failedConstraint)) {
            let ignoredConstraints: any = constraintBreachDetails?.ignoredConstraints ? constraintBreachDetails?.ignoredConstraints : [];
            ignoredConstraints.push(constraintBreachDetails?.failedConstraint)
            params.ignored_constraints = [...ignoredConstraints];
        }
        dispatch(showLoading());
        appDispatch(diversionCreateFreightOrder(params)).then((response: any) => {
            if (response && response?.details) {
                if (response?.code === 700) {
                    setWarningModalDetails({ open: true, warningMessage: response.message });
                    setConstraintBreachDetails(response.details)
                    return
                }
                history.push({
                    pathname: DiversionRequestDetailsUrl + requestId,
                    search: order ? "?order=DO&tabName=" + diversionTabEnum.IN_PROGRESS : "?tabName=" + diversionTabEnum.IN_PROGRESS
                })
            }
            dispatch(hideLoading())
        })
    }
}

export default DiversionShipmentOrderDetails;

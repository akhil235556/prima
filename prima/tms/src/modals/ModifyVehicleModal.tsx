import { ArrowRightAlt } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { contractExistMessage, vehicleTypeChangeMessage, vehicleTypePlaceholder } from "../base/constant/MessageUtils";
import AutoComplete from "../component/widgets/AutoComplete";
import { OptionType } from "../component/widgets/widgetsInterfaces";
import { setAutoCompleteListWithData } from "../moduleUtility/DataUtils";
import { showAlert } from "../redux/actions/AppActions";
import { getServiceabilityDetails } from "../serviceActions/AppServiceActions";
import { getLanePrice } from "../serviceActions/FrightRateServiceAction";
import { getServiceableVehicleType, updateVehicleType } from "../serviceActions/VehicleTypeServiceActions";
import ModalContainer from "./ModalContainer";
import "./ModifyVehicleModal.css";
import WarningModal from "./warningModal/WarningModal";

interface ModifyVehicleModalProps {
    open: boolean
    onClose: any
    onSuccess: any
    orderDetails: any
    selectedNewVehicleType: any
    setIsVehicleUpdated: Function
    userParams: any
}

function ModifyVehicleModal(props: ModifyVehicleModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onSuccess, orderDetails, selectedNewVehicleType, setIsVehicleUpdated, userParams } = props;
    const [loading, setLoading] = React.useState<any>(false);
    const [params, setParams] = React.useState<any>({});
    const [serviceablevehicleTypeList, setServiceableVehcileTypeList] = React.useState<any>([]);
    const initialModalState = {
        open: false,
        warningMessage: "",
        primaryButtonTitle: "",
        secondaryuttonTitle: "",
        primaryButtonLeftIcon: "",
        showLanePrice: false
    }
    const [modalState, setModalState] = React.useState<any>(initialModalState);
    const [laneDetails, setLaneDetails] = React.useState<any>({});
    let contractParams: any = {
        laneCode: orderDetails?.laneCode,
        partnerCode: orderDetails?.partnerCode,
        serviceabilityModeCode: orderDetails?.serviceabilityModeCode,
        vehicleTypeCode: params.vehicleType && params.vehicleType.value
    };

    useEffect(() => {
        if (laneDetails?.contractDetails) {
            checkServiceability();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [laneDetails?.contractDetails]);

    useEffect(() => {
        if (open && orderDetails && orderDetails.freightTypeCode && orderDetails.partnerCode
            && orderDetails.laneCode && orderDetails.serviceabilityModeCode) {
            if (orderDetails.freightTypeCode === "FTL") {
                let queryParams = {
                    freightTypeCode: orderDetails.freightTypeCode,
                    laneCode: orderDetails.laneCode,
                    partnerCode: orderDetails.partnerCode,
                    serviceabilityModeCode: orderDetails.serviceabilityModeCode
                }
                appDispatch(getServiceableVehicleType(queryParams)).then((vehicleTypeResponse: any) => {
                    if (vehicleTypeResponse && vehicleTypeResponse.length > 0) {
                        setServiceableVehcileTypeList(setAutoCompleteListWithData(vehicleTypeResponse, "vehicleTypeName", "vehicleTypeCode"))
                    }
                })
            }
        }
        selectedNewVehicleType && setParams({ vehicleType: selectedNewVehicleType })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    return (
        <ModalContainer
            title={"Change Vehicle Type"}
            primaryButtonTitle={"Submit"}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            styleName="modify-vehicle-modal"
            loading={loading}
            open={open}
            onClose={() => {
                onClose()
                setParams({});
                setLaneDetails({});
            }}
            onApply={() => {
                setLaneDetails({});
                setModalState({
                    ...initialModalState,
                    open: true,
                    warningMessage: vehicleTypeChangeMessage,
                    primaryButtonTitle: "Yes",
                    secondaryuttonTitle: "No"
                });
            }}
        >
            <WarningModal
                open={modalState?.open}
                onClose={() => {
                    setModalState({ ...initialModalState, open: false });
                    setLaneDetails({});
                }}
                warningMessage={modalState?.warningMessage}
                primaryButtonTitle={modalState?.primaryButtonTitle}
                secondaryuttonTitle={modalState?.secondaryuttonTitle}
                primaryButtonLeftIcon={modalState?.primaryButtonLeftIcon}
                value={laneDetails?.lanePrice}
                onChange={(text: any) => {
                    setLaneDetails({ ...laneDetails, lanePriceError: "", lanePrice: text });
                }}
                showTextField={modalState?.showLanePrice}
                errorMessage={laneDetails?.lanePriceError}
                label={"Lane Price"}
                placeholder={"Enter Lane Price"}
                onSuccess={() => {
                    if (!modalState.showLanePrice) {
                        appDispatch(getLanePrice({ ...contractParams, freightType: orderDetails?.freightTypeCode })).then((response: any) => {
                            if (!response?.lanePrice) {
                                setModalState({
                                    ...initialModalState,
                                    open: true,
                                    warningMessage: contractExistMessage,
                                    primaryButtonTitle: "Submit",
                                    secondaryuttonTitle: "",
                                    primaryButtonLeftIcon: <ArrowRightAlt />,
                                    showLanePrice: true
                                });
                            } else {
                                setLaneDetails({ ...laneDetails, contractDetails: response });
                            }
                        })
                    } else if (!laneDetails?.lanePrice && modalState.showLanePrice) {
                        setLaneDetails({ ...laneDetails, lanePriceError: "Enter Lane Price" });
                    } else {
                        checkServiceability();
                    }
                }}
            />
            <div className="row">
                <div className="form-group col-md-12">
                    <AutoComplete
                        label={"Current Vehicle Type"}
                        placeHolder={vehicleTypePlaceholder}
                        value={{
                            label: orderDetails?.vehicleTypeName,
                            value: orderDetails?.vehicleTypeCode
                        }}
                        isDisabled={true}
                        options={serviceablevehicleTypeList}
                        onChange={(element: any) => {

                        }}
                    />
                </div>
                <div className="form-group col-md-12">
                    <AutoComplete
                        label={"New Vehicle Type"}
                        placeHolder={vehicleTypePlaceholder}
                        value={params?.vehicleType}
                        options={serviceablevehicleTypeList}
                        isShowAll={true}
                        onChange={(element: OptionType) => {
                            setLaneDetails({});
                            setParams({
                                ...params,
                                vehicleType: element
                            })
                        }}
                    />
                </div>
            </div>


        </ModalContainer>
    );

    function checkServiceability() {
        setModalState({ ...initialModalState, open: false });
        appDispatch(getServiceabilityDetails({ ...contractParams, freightTypeCode: orderDetails?.freightTypeCode })).then((response: any) => {
            if (response?.code === 200) {
                onApply();
            }
        })
    }

    function onApply() {
        setLoading(true)
        let vehicleParams: any = {
            freightOrderCode: orderDetails?.freightOrderCode,
            vehicleTypeCode: params?.vehicleType.value,
            vehicleTypeName: params?.vehicleType.label,
            lanePrice: laneDetails?.lanePrice ? laneDetails?.lanePrice : laneDetails?.contractDetails?.lanePrice ? laneDetails?.contractDetails?.lanePrice : orderDetails?.lanePrice,
            contractCode: laneDetails?.contractDetails?.contractCode,
            vehicleRegistrationNumber: userParams.vehicleRegistrationNumber,
            freightShipmentCodes: orderDetails && orderDetails?.shipmentDetails?.map((shipment: any) => {
                return shipment.freightShipmentCode
            })
        };
        appDispatch(updateVehicleType(vehicleParams)).then((response: any) => {
            if (response?.code === 200) {
                response.message && appDispatch(showAlert(response?.message));
                setLoading(false);
                setIsVehicleUpdated();
                onSuccess()
                setParams({});
            } else {
                setLoading(false);
            }
        })
    }

}

export default ModifyVehicleModal;

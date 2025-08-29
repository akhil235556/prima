import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { acceptTrackRequestWarningMessage } from "../../../base/constant/MessageUtils";
import { isNullValue } from "../../../base/utility/StringUtils";
import Button from "../../../component/widgets/button/Button";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import NumberEditText from "../../../component/widgets/NumberEditText";
import ModalContainer from "../../../modals/ModalContainer";
import { getLanePrice } from "../../../serviceActions/FrightRateServiceAction";
import { getOrderDetail } from "../../../serviceActions/OrderServiceActions";
import { approveTrackRequest } from "../../../serviceActions/TrackRequestVehicleTypeServiceActions";


interface TrackRequestAcceptWarningModal {
    open: boolean
    onClose: any
    onSuccess?: any,
    warningMessage: any,
    selectedElement: any,
    primaryButtonTitle: any,
    secondaryButtonTitle: any,
    pollingLoader?: boolean,
}


function TrackRequestAcceptWarningModal(props: TrackRequestAcceptWarningModal) {
    const appDispatch = useDispatch()
    const { open, onClose, warningMessage, onSuccess, selectedElement, primaryButtonTitle, secondaryButtonTitle, pollingLoader } = props;
    const [showLanePrice, setShowLanePrice] = React.useState<any>(false);
    const [userParams, setUserParams] = React.useState<any>({})
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<any>({});

    useEffect(() => {
        if (open) {
            setLoading(true);
            appDispatch(getOrderDetail({ freightOrderCode: selectedElement?.freightOrderCode })).then((response: any) => {
                if (response?.details) {
                    let promiseArr: any = []
                    const queryParams: any = {
                        freightType: selectedElement.freightType,
                        laneCode: selectedElement.laneCode,
                        partnerCode: selectedElement.partnerCode,
                        vehicleTypeCode: selectedElement.vehicleTypeCode,
                        serviceabilityModeCode: response.details && response.details.results && response.details.results[0] && response.details.results[0].serviceabilityModeCode
                    }
                    promiseArr.push(appDispatch(getLanePrice(queryParams)))
                    return Promise.all(promiseArr)
                }
            }).then((response: any) => {
                if (response && response[0]) {
                    if (response[0].isKm || response[0].contractCode || response[0].isKg || response[0].lanePrice) {
                        setShowLanePrice(false);
                        setUserParams({
                            ...userParams,
                            lanePrice: selectedElement.lanePrice
                        })
                    } else {
                        setShowLanePrice(true);
                    }
                }
                setLoading(false)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedElement, open])

    return (
        <ModalContainer
            title="Warning"
            open={open}
            loading={loading || pollingLoader}
            secondaryButtonLoading={loading}
            onApply={() => {
                onClickApprove();
                setError({})
            }}
            secondaryButtonTitle={!showLanePrice ? secondaryButtonTitle : null}
            primaryButtonTitle={!showLanePrice ? primaryButtonTitle : null}
            onClose={() => {
                onClose();
                setUserParams({})
                setError({})
            }}
            onClear={() => {
                onClose();
                setUserParams({})
                setError({})
            }}
            styleName={"warning-modal"}
        >
            {loading ?
                <CardContentSkeleton
                    row={2}
                    column={2}
                /> :
                (<div className="warning-container text-center">
                    <img src="/images/warning-icon.png" alt="truck-icon" />
                    <h3>Warning!</h3>
                    <h4>{showLanePrice ? warningMessage : acceptTrackRequestWarningMessage}</h4>
                    {showLanePrice && <div className="warning-lane-modal">
                        <div>
                            <div className="custom-form-row">
                                <div className="form-group col-md-9">
                                    <NumberEditText
                                        label={"Lane Price"}
                                        maxLength={8}
                                        placeholder={"Enter lane price"}
                                        value={userParams.lanePrice}
                                        mandatory
                                        error={error.lanePrice}
                                        onChange={(text: string) => {
                                            setUserParams({
                                                ...userParams,
                                                lanePrice: text
                                            })
                                            setError({})
                                        }}
                                    />
                                </div>
                                <div className="warning-lane-modal-button">
                                    <Button
                                        buttonStyle="btn-blue"
                                        title="Approve"
                                        loading={loading || pollingLoader}
                                        onClick={() => {
                                            if (validate(userParams)) {
                                                onClickApprove()
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>)}
        </ModalContainer>
    );

    function onClickApprove() {
        setLoading(true)
        appDispatch(approveTrackRequest({ id: selectedElement.id, lanePrice: userParams && userParams.lanePrice && Number(userParams.lanePrice), freightOrderCode: selectedElement.freightOrderCode })).then((response: any) => {
            if (response) {
                onSuccess(response);
            }
            setLoading(false)
        })
    }

    function validate(userParams: any) {
        if (isNullValue(userParams.lanePrice)) {
            setError({ lanePrice: "Enter lane price" });
            return false;
        }
        return true;
    }
}

export default TrackRequestAcceptWarningModal;

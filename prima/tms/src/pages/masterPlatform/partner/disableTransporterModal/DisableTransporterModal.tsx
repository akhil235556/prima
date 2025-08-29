import { ArrowForward, CheckCircle, Timelapse, Visibility } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import { LaneUrl, OrderListingUrl } from '../../../../base/constant/RoutePath';
import Button from "../../../../component/widgets/button/Button";
import CardContentSkeleton from '../../../../component/widgets/cardContentSkeleton/CardContentSkeleton';
import ModalContainer from "../../../../modals/ModalContainer";
import './DisableTransporterModal.css';
import { createObjectQueryParams } from "../../../../base/utility/Routerutils";

interface DisableTransporterModalProps {
    open: boolean,
    onClose: any,
    onSuccess: any,
    readyToDisable: boolean,
    isLoading?: boolean,
    checkList?: any
}

function DisableTransporterModal(props: DisableTransporterModalProps) {
    const { open, onClose, readyToDisable, onSuccess, isLoading, checkList } = props;
    const [isDisabled, setIsDisabled] = React.useState<boolean>(false);
    const history = useHistory();
    return (
        <ModalContainer
            title={!isDisabled ? "Disable Transporter" : "Warning"}
            primaryButtonTitle={!isDisabled ? "Disable" : "OK"}
            primaryButtonLeftIcon={!isDisabled && <ArrowForward />}
            primaryButtonDisable={!readyToDisable}
            loading={isLoading}
            open={open}
            onClose={() => {
                setIsDisabled(false);
                onClose();
            }}
            styleName={!isDisabled ? "disable-transport-modal" : "warning-modal"}
            primaryButtonStyle={!isDisabled ? "" : "btn-orange width-40"}
            onApply={() => {
                if (!isDisabled) {
                    setIsDisabled(true)
                } else {
                    onSuccess();
                    setIsDisabled(false)
                }
            }}
        >
            {isLoading || Object.keys(checkList).length === 0 ? (
                <CardContentSkeleton className=" col-md-12 col-12" column={1} row={3} />
            ) : (!isDisabled ? (
                <>
                    <div className="media">
                        <img className="mr-3" src="/images/truck-icon-circle.png" alt="truck-icon" />
                        <div className="media-body">
                            <div className="row align-items-center">
                                <div className="col-md-8 col-7">
                                    <h5>Orders</h5>
                                    <p>Cancel all pending freight orders.</p>
                                    {
                                        checkList &&
                                            checkList.inOrder ? (
                                                <div className="d-flex pending-col align-items-center">
                                                    <Timelapse className="orange-text" />
                                                    <span className="orange-text">Pending</span>
                                                </div>
                                            ) : (
                                                <div className="d-flex pending-col align-items-center">
                                                    <CheckCircle className="green-text" />
                                                    <span className="green-text">Done</span>
                                                </div>
                                            )
                                    }

                                </div>
                                <div className="col-md-4 col-5 text-right">
                                    <Button
                                        buttonStyle="btn-orange sml-btn"
                                        title="View"
                                        leftIcon={<Visibility />}
                                        disable={!(checkList && checkList.inOrder)}
                                        onClick={() => {
                                            history.push({
                                                pathname: OrderListingUrl,
                                                search: createObjectQueryParams({
                                                    partnerCode: checkList.partnerCode,
                                                    partnerName: checkList.partnerName
                                                })
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="media">
                        <img className="mr-3" src="/images/sob-icon.png" alt="truck-sob" />
                        <div className="media-body">
                            <div className="row align-items-center">
                                <div className="col-md-8 col-7">
                                    <h5>Share of Business</h5>
                                    <p>Remove transporter share of business from Lanes.</p>
                                    {
                                        checkList &&
                                            checkList.inSob ? (
                                                <div className="d-flex pending-col align-items-center">
                                                    <Timelapse className="orange-text" />
                                                    <span className="orange-text">Pending</span>
                                                </div>
                                            ) : (
                                                <div className="d-flex pending-col align-items-center">
                                                    <CheckCircle className="green-text" />
                                                    <span className="green-text">Done</span>
                                                </div>
                                            )
                                    }
                                </div>
                                <div className="col-md-4 col-5 text-right">
                                    <Button
                                        buttonStyle="btn-orange sml-btn"
                                        title="View"
                                        leftIcon={<Visibility />}
                                        disable={!(checkList && checkList.inSob)}
                                        onClick={() => {
                                            history.push({
                                                pathname: LaneUrl,
                                                search: createObjectQueryParams({
                                                    partnerCode: checkList.partnerCode,
                                                    partnerName: checkList.partnerName,
                                                    sob: 1,
                                                    sobLabel: "Yes"
                                                })
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>) : (
                    <div className="warning-container text-center">
                        <img src="/images/warning-icon.png" alt="truck-icon" />
                        <h3>Warning!</h3>
                        <h4>
                            All Contracts with the transporter will be terminated after this action.
                    </h4>
                        <h5>Are you sure ?</h5>
                    </div>
                )
                )}

        </ModalContainer>
    );
}

export default DisableTransporterModal;
